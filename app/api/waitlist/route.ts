import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { emailConfig, emailAddresses } from '@/lib/email-config';

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail, honeypot } = await request.json();
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';

    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      console.warn('Waitlist honeypot triggered, ignoring submission');
      return NextResponse.json(
        { message: 'Successfully added to waitlist!' },
        { status: 200 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Email content
    const mailOptions = {
      from: emailAddresses.from,
      to: emailAddresses.to,
      subject: 'New Waitlist Signup - Tiffinly',
      text: `New email signup: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Waitlist Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            This email was automatically generated from the Tiffinly website waitlist signup form.
          </p>
        </div>
      `,
    };

    // Send email with better error handling
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Waitlist signup email sent: ${email}`);
      console.log('Message ID:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (emailError: any) {
      console.error('Email sending failed:', {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command,
        responseCode: emailError.responseCode,
        response: emailError.response,
      });
      throw emailError;
    }

    return NextResponse.json(
      { 
        message: 'Successfully added to waitlist!',
        email: email 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
