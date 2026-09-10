const baseWrapper = (contentHtml) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f0f2f5; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.1);">
            <tr>
              <td style="background:#1877f2; padding:20px 30px;">
                <h1 style="margin:0; color:#ffffff; font-size:22px;">Connectify</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;">
                ${contentHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 30px; background:#f7f7f7; text-align:center;">
                <p style="margin:0; font-size:12px; color:#8a8d91;">
                  © ${new Date().getFullYear()} Connectify. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const resetPasswordTemplate = (name, resetUrl) =>
  baseWrapper(`
    <h2 style="margin-top:0; color:#1c1e21;">Reset your password</h2>
    <p style="color:#4b4f56; font-size:15px; line-height:1.5;">
      Hi ${name},
    </p>
    <p style="color:#4b4f56; font-size:15px; line-height:1.5;">
      We received a request to reset your Connectify account password. Click the button below to choose a new password. This link will expire in <strong>15 minutes</strong>.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:6px; background:#1877f2;">
          <a href="${resetUrl}" target="_blank"
             style="display:inline-block; padding:12px 28px; color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
    <p style="color:#8a8d91; font-size:13px; line-height:1.5;">
      If you didn't request this, you can safely ignore this email — your password will remain unchanged.
    </p>
    <p style="color:#8a8d91; font-size:12px; word-break:break-all;">
      Or copy this link: ${resetUrl}
    </p>
  `);

const verifyEmailTemplate = (name, verifyUrl) =>
  baseWrapper(`
    <h2 style="margin-top:0; color:#1c1e21;">Welcome to Connectify, ${name}! 👋</h2>
    <p style="color:#4b4f56; font-size:15px; line-height:1.5;">
      Thanks for signing up. Please confirm this is your email address so you can start connecting with friends.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:6px; background:#1877f2;">
          <a href="${verifyUrl}" target="_blank"
             style="display:inline-block; padding:12px 28px; color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px;">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>
    <p style="color:#8a8d91; font-size:13px; line-height:1.5;">
      This link will expire in <strong>24 hours</strong>. If you didn't create a Connectify account, you can safely ignore this email.
    </p>
    <p style="color:#8a8d91; font-size:12px; word-break:break-all;">
      Or copy this link: ${verifyUrl}
    </p>
  `);

module.exports = { resetPasswordTemplate, verifyEmailTemplate };
