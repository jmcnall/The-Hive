import { Resend } from 'resend';

// Simple in-memory rate limit store
// Note: In serverless environments, this resets when the instance spins down.
// For robust rate limiting across instances, use Vercel KV or Upstash Redis.
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 requests per IP per minute

function isRateLimited(ip) {
  if (!ip) return false;
  
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count += 1;
  return false;
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // IP Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { firstName, lastName, email, interestType, message, website_url, turnstileToken } = req.body;

  // 1. Honeypot Check
  // Legitimate users will not see or fill the `website_url` field.
  if (website_url) {
    // Silently reject by returning a success-like message or generic error to confuse bots
    return res.status(400).json({ error: 'Invalid submission.' });
  }

  // 2. Required Fields & Validation
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and Message are required.' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message is too short.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address format.' });
  }

  // 3. Turnstile Token Verification
  if (!turnstileToken) {
    return res.status(400).json({ error: 'Turnstile verification token is missing.' });
  }

  const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // Fallback to Cloudflare's always-pass test secret key
  
  try {
    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', turnstileToken);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const verificationData = await verificationResponse.json();

    if (!verificationData.success) {
      console.error('Turnstile verification failed:', verificationData['error-codes']);
      return res.status(400).json({ error: 'Failed human verification. Please try again.' });
    }
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return res.status(500).json({ error: 'Internal server error during verification.' });
  }

  // Send email using Resend
  const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxx');

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'jmcnall@newmarkmw.com',
      subject: `New Inquiry from ${firstName || ''} ${lastName || ''}`,
      html: `
        <h3>New Project Hive Inquiry</h3>
        <p><strong>Name:</strong> ${firstName || ''} ${lastName || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interest Type:</strong> ${interestType || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send inquiry email.' });
    }

    console.log('Email sent successfully:', data);
    return res.status(200).json({ success: true, message: 'Your inquiry has been submitted successfully.' });
  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ error: 'Internal server error while sending email.' });
  }
}
