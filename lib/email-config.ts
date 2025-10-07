// Email configuration
export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
  // Add timeout and connection settings
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 30000,
};

export const emailAddresses = {
  from: process.env.FROM_EMAIL || 'your-email@gmail.com',
  to: process.env.TO_EMAIL || 'waitlist@tiffinlyfoods.com',
};

