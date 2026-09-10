const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"GlideAway" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

function otpEmailTemplate(name, otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#0E7C86;">GlideAway</h2>
      <p>Hi ${name},</p>
      <p>Your verification code is:</p>
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; background:#F3ECDD; padding: 16px; text-align:center; border-radius: 10px;">${otp}</div>
      <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>
  `;
}

function resetPasswordEmailTemplate(name, otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#0E7C86;">GlideAway</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Use this code to continue:</p>
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; background:#F3ECDD; padding: 16px; text-align:center; border-radius: 10px;">${otp}</div>
      <p>This code expires in 10 minutes. If you didn't request this, please secure your account.</p>
    </div>
  `;
}

module.exports = { sendEmail, otpEmailTemplate, resetPasswordEmailTemplate };
