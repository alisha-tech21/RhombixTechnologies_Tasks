const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth.middleware");
const { asyncHandler } = require("../middleware/error.middleware");
const { generateOTP, hashOTP, compareOTP } = require("../utils/otp");
const {
  sendEmail,
  otpEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../utils/sendEmail");

const router = express.Router();

const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

/* =========================================================
   POST /api/auth/register
   Creates an UNVERIFIED account and emails a 6-digit OTP.
   No JWT is issued yet — the user must verify first.
   ========================================================= */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Full name is required."),
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters."),
    body("phone").optional().isString(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      isVerified: false,
      otpHash,
      otpExpiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
      otpAttempts: 0,
    });

    await sendEmail(
      user.email,
      "Verify your GlideAway account",
      otpEmailTemplate(user.name, otp),
    );

    res.status(201).json({
      message:
        "Account created. Please check your email for a verification code.",
      email: user.email,
    });
  }),
);

/* =========================================================
   POST /api/auth/verify-otp
   Confirms the OTP, marks the account verified, and logs the user in.
   ========================================================= */
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("Enter the 6-digit code."),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+otpHash +otpExpiresAt +otpAttempts",
    );

    if (!user) return res.status(404).json({ message: "Account not found." });
    if (user.isVerified)
      return res.status(400).json({ message: "Account is already verified." });

    if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Code expired. Please request a new one." });
    }
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res
        .status(429)
        .json({ message: "Too many attempts. Please request a new code." });
    }

    const match = await compareOTP(otp, user.otpHash);
    if (!match) {
      user.otpAttempts += 1;
      await user.save();
      return res
        .status(400)
        .json({ message: "Incorrect code. Please try again." });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();

    const token = signToken(user);
    res.json({ message: "Account verified successfully.", user, token });
  }),
);

/* =========================================================
   POST /api/auth/resend-otp
   ========================================================= */
router.post(
  "/resend-otp",
  [body("email").isEmail().withMessage("Enter a valid email address.")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Account not found." });
    if (user.isVerified)
      return res.status(400).json({ message: "Account is already verified." });

    const otp = generateOTP();
    user.otpHash = await hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    user.otpAttempts = 0;
    await user.save();

    await sendEmail(
      user.email,
      "Your new GlideAway verification code",
      otpEmailTemplate(user.name, otp),
    );
    res.json({ message: "A new verification code has been sent." });
  }),
);

/* =========================================================
   POST /api/auth/login
   Blocks unverified accounts instead of issuing a token.
   ========================================================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
        email: user.email,
      });
    }

    const token = signToken(user);
    res.json({ user, token });
  }),
);

/* =========================================================
   POST /api/auth/forgot-password
   Always returns a generic success message, whether or not the
   email exists — this stops attackers from using it to discover
   which emails are registered.
   ========================================================= */
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Enter a valid email address.")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (user) {
      const otp = generateOTP();
      user.resetOtpHash = await hashOTP(otp);
      user.resetOtpExpiresAt = new Date(
        Date.now() + OTP_TTL_MINUTES * 60 * 1000,
      );
      user.resetOtpAttempts = 0;
      await user.save();

      await sendEmail(
        user.email,
        "Reset your GlideAway password",
        resetPasswordEmailTemplate(user.name, otp),
      );
    }

    res.json({
      message: "If that email is registered, a reset code has been sent.",
    });
  }),
);

/* =========================================================
   POST /api/auth/reset-password
   ========================================================= */
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Enter a valid email address."),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("Enter the 6-digit code."),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters."),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetOtpHash +resetOtpExpiresAt +resetOtpAttempts",
    );

    if (!user) return res.status(404).json({ message: "Account not found." });
    if (
      !user.resetOtpHash ||
      !user.resetOtpExpiresAt ||
      user.resetOtpExpiresAt < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Code expired. Please request a new one." });
    }
    if (user.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
      return res
        .status(429)
        .json({ message: "Too many attempts. Please request a new code." });
    }

    const match = await compareOTP(otp, user.resetOtpHash);
    if (!match) {
      user.resetOtpAttempts += 1;
      await user.save();
      return res
        .status(400)
        .json({ message: "Incorrect code. Please try again." });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    user.resetOtpAttempts = 0;
    await user.save();

    res.json({
      message:
        "Password reset successfully. Please log in with your new password.",
    });
  }),
);

/* =========================================================
   GET /api/auth/me
   ========================================================= */
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  }),
);

module.exports = router;
