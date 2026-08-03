const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {
  resetPasswordTemplate,
  verifyEmailTemplate,
} = require("../utils/emailTemplates");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email, and password");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists with this email");
    }

    const user = await User.create({ name, email, password });

    // Raw verification token (jayega email mein)
    const verifyToken = crypto.randomBytes(32).toString("hex");
    // Hashed version (jayega database mein)
    const hashedToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Connectify Account",
        html: verifyEmailTemplate(user.name, verifyUrl),
      });
    } catch (emailError) {
      console.error("Verification email failed to send:", emailError.message);
    }
    res.status(201).json({
      success: true,
      message:
        "Account created. Please check your email to verify your account before logging in.",
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      res.status(403);
      throw new Error("Please verify your email before logging in");
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Please provide your email");
    }

    const user = await User.findOne({ email });

    // Security note: hum jaan bujh kar ye nahi batate ke email exist karti hai ya nahi —
    // warna attacker email enumeration attack kar sakta hai (guess kar ke pata laga sakta hai
    // konsi emails registered hain). Hamesha same generic message bhejte hain.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    // Raw random token generate karo (ye email mein jayega)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Isi token ka hashed version banao (ye database mein save hoga)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Frontend ka reset page URL (React app mein ye route banayenge baad mein)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Connectify Password",
        html: resetPasswordTemplate(user.name, resetUrl),
      });

      res.status(200).json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    } catch (emailError) {
      // Agar email bhejne mein fail ho, token ko wapas hata do — warna
      // token database mein "dangling" reh jayega jo kabhi use nahi ho sakega
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500);
      throw new Error("Email could not be sent, please try again later");
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Reset link is invalid or has expired");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Verify user's email using token from email link
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Verification link is invalid or has expired");
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Please provide your email");
    }

    const user = await User.findOne({ email });

    // Generic response — email enumeration se bachne ke liye
    if (!user || user.isVerified) {
      return res.status(200).json({
        success: true,
        message:
          "If that account exists and isn't verified, a new link has been sent.",
      });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Connectify Account",
      html: verifyEmailTemplate(user.name, verifyUrl),
    });

    res.status(200).json({
      success: true,
      message:
        "If that account exists and isn't verified, a new link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};
