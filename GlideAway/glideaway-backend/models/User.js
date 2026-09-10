const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["traveler", "admin"], default: "traveler" },
    savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    isVerified: { type: Boolean, default: false },
    // --- Email verification (OTP) ---
    otpHash: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0, select: false },

    // --- Forgot password (OTP) ---
    resetOtpHash: { type: String, select: false },
    resetOtpExpiresAt: { type: Date, select: false },
    resetOtpAttempts: { type: Number, default: 0, select: false },
  },
  { timestamps: true },
);

// Never send the password hash back to the client
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.otpHash;
  delete obj.otpExpiresAt;
  delete obj.otpAttempts;
  delete obj.resetOtpHash;
  delete obj.resetOtpExpiresAt;
  delete obj.resetOtpAttempts;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
