import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email, token) {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

    const emailHTML = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#0b0f19;font-family:system-ui,sans-serif;">
  <div style="max-width:480px;margin:40px auto;padding:20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
  <div style="display:inline-block;width:48px;height:48px;background:rgba(129,140,248,0.15);border-radius:12px;margin-bottom:12px;">
    <span style="display:block;line-height:48px;font-size:20px;font-weight:700;color:#818cf8;">₹</span>
  </div>
  <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#818cf8;">Personal Finance</p>
  <h1 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#f1f5f9;">Expense Tracker</h1>
</div>

    <!-- Card -->
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;text-align:center;">
      <div style="width:56px;height:56px;background:rgba(129,140,248,0.1);border:1px solid rgba(129,140,248,0.2);border-radius:50%;margin:0 auto 20px;text-align:center;">
  <span style="font-size:24px;line-height:56px;display:inline-block;width:100%;text-align:center;">✉️</span>
</div>
      <h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#f1f5f9;">Verify your email</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.6;">
        Click the button below to verify your email address and activate your Expense Tracker account.
      </p>
      
      <!-- Button -->
      <a href="${verificationUrl}" style="display:inline-block;background:#818cf8;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:12px;text-decoration:none;margin-bottom:24px;">
        Verify Email →
      </a>

      <p style="margin:0;font-size:12px;color:#64748b;">
        This link will expire in 24 hours.<br/>
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <p style="text-align:center;margin-top:24px;font-size:12px;color:#475569;">
      © 2025 Expense Tracker • Made with 💜
    </p>

  </div>
</body>
</html>
`;
  
    transporter
    .sendMail({
      from: `Expense Tracker <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email — Expense Tracker",
      html: emailHTML,
    })
    .catch(console.error);

  } catch (error) {
    console.error(error.message);
  }
}
