import { createTransport } from "nodemailer";

// 1. Setup the transporter using your Gmail credentials
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * @function sendVerificationEmail
 * @description Sends a 6-digit code to the user's real inbox
 */
export async function sendVerificationEmail(email, verificationToken) {
  try {
    const mailOptions = {
      from: `"Trip Planner" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email - Trip Planner",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #f97316;">Welcome to Trip Planner!</h2>
          <p>Please use the following code to verify your account:</p>
          <div style="background: #fff7ed; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f97316;">
            ${verificationToken}
          </div>
          <p>This code will expire in 24 hours.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
}
// Add this temporarily to test your setup
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ Server is ready to take our messages!");
  }
});

/**
 * @file emailService.js
 * @description Centralized SMTP dispatch for Atlas Identity System.
 */

// Verification check to debug connection live
transporter.verify((error) => {
  if (error) console.log("❌ SMTP Error:", error);
  else console.log("✅ Identity Server: SMTP Link Established");
});

export async function sendPasswordResetEmail(email, resetCode) {
  const mailOptions = {
    from: `"Atlas Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Action Required: Reset Password",
    html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 50px; border-radius: 30px; text-align: center; border: 1px solid #333;">
            <h1 style="color: #f97316; text-transform: uppercase; letter-spacing: 2px;">Security Alert</h1>
            <p style="color: #888; margin-bottom: 30px;">A request was made to synchronize the credentials for your account.</p>
            <div style="background: #111; padding: 30px; border: 1px solid #f97316/20; border-radius: 20px; display: inline-block;">
                <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #f97316;">${resetCode}</span>
            </div>
            <p style="font-size: 10px; color: #444; margin-top: 40px; text-transform: uppercase; letter-spacing: 3px;">
                Code expires in 10 minutes.
            </p>
        </div>
    `,
  };

  try {
    // RECTIFIED: Explicitly await the dispatch
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Dispatched:", info.messageId);
    return info;
  } catch (error) {
    console.error("Mail Dispatch Failure:", error);
    throw error;
  }
}