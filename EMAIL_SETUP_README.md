# Email Setup for Waitlist Functionality

## Overview
The waitlist signup form now sends actual emails to `waitlist@tiffinlyfoods.com` when users submit their email addresses.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
TO_EMAIL=waitlist@tiffinlyfoods.com
```

### 2. Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

### 3. Alternative Email Services
You can also use other SMTP services:

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### 4. Testing
1. Start your development server: `npm run dev`
2. Go to the home page
3. Enter an email in the waitlist form
4. Check the console for success/error messages
5. Check `waitlist@tiffinlyfoods.com` for the received email

## Email Format
The emails sent will include:
- **Subject**: "New Waitlist Signup - Tiffinly"
- **Content**: Email address, timestamp, and formatted HTML
- **From**: Your configured email address
- **To**: waitlist@tiffinlyfoods.com

## Troubleshooting
- **Authentication Error**: Check your SMTP credentials
- **Connection Error**: Verify SMTP host and port settings
- **No emails received**: Check spam folder and email configuration
- **Development vs Production**: Make sure environment variables are set correctly

## Security Notes
- Never commit `.env.local` to version control
- Use app passwords instead of your main email password
- Consider using a dedicated email service for production

