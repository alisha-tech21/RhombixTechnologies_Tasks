const crypto = require("crypto");
const bcrypt = require("bcryptjs");

/** Generates a random 6-digit OTP as a string, e.g. "482913". */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/** Hashes the OTP the same way we hash passwords — never store it in plain text. */
async function hashOTP(otp) {
  return bcrypt.hash(otp, 10);
}

/** Compares a user-entered OTP against the stored hash. */
async function compareOTP(otp, hashedOTP) {
  return bcrypt.compare(otp, hashedOTP);
}

module.exports = { generateOTP, hashOTP, compareOTP };
