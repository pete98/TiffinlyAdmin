// Email configuration
export const emailConfig = {
  // You'll need to set up an SMTP service (Gmail, SendGrid, etc.)
  // For Gmail, you'll need to use an App Password
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
};

export const emailAddresses = {
  from: process.env.FROM_EMAIL || 'your-email@gmail.com',
  to: process.env.TO_EMAIL || 'waitlist@tiffinlyfoods.com',
};

