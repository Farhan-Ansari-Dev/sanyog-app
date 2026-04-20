const nodemailer = require('nodemailer');

/**
 * createEmailService - Initializes the SMTP transporter based on .env
 */
const createEmailService = () => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // SMTP Configuration from .env
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(config);

  return {
    /**
     * sendOtpEmail - Sends a premium HTML email with the OTP code
     */
    sendOtpEmail: async (to, otp) => {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ EMAIL_USER or EMAIL_PASS not set. Email delivery skipped.');
        console.log(`[OTP-MOCK-LOG] To: ${to} | OTP: ${otp}`);
        return;
      }

      const mailOptions = {
        from: `"DICE | Sanyog" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject: `${otp} is your DICE Verification Code`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #0f172a;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #16a34a; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">DICE</h1>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 600; text-transform: uppercase; tracking: 0.1em;">Security Verification</p>
            </div>
            
            <p style="font-size: 16px; line-height: 24px; color: #334155;">Hello,</p>
            <p style="font-size: 16px; line-height: 24px; color: #334155;">Use the following verification code to access your DICE by Sanyog account. This code is valid for 10 minutes.</p>
            
            <div style="margin: 32px 0; text-align: center;">
              <div style="display: inline-block; padding: 16px 32px; background-color: #f8fafc; border: 2px solid #16a34a; border-radius: 16px;">
                <span style="font-size: 36px; font-weight: 900; color: #0f172a; letter-spacing: 8px;">${otp}</span>
              </div>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
              If you did not request this code, please ignore this email or contact our support team.
            </p>
            
            <div style="text-align: center; margin-top: 40px;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} Sanyog Conformity Solutions</p>
              <p style="font-size: 12px; color: #94a3b8; margin: 4px 0;">Compliance. Simplified. Secure.</p>
            </div>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`[EmailService] OTP sent to ${to}`);
      } catch (error) {
        console.error('[EmailService] Error sending email:', error);
        throw new Error('Email delivery failed');
      }
    },
  };
};

module.exports = createEmailService();
