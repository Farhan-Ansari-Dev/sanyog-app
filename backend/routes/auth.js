const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const User = require('../models/User');
const { createOtpProvider, normalizeIndianMobile } = require('../services/otpProvider');

// ─── Init OTP Provider (Fast2SMS / mock / twilio) ──────────────────────────
const otpProvider = createOtpProvider();
console.log(`[Auth] OTP provider loaded: ${otpProvider.mode}`);

// ─── Rate Limiters ──────────────────────────────────────────────────────────
const sendOtpLimiter = rateLimit({
  windowMs: 60 * 1000,          // 1 minute
  limit: 3,                      // max 3 OTP requests per minute per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many OTP requests. Please wait 1 minute and try again.' },
});

const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,     // 10 minutes
  limit: 10,                     // max 10 verify attempts per 10 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many verification attempts. Please wait and try again.' },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ─── POST /auth/send-otp ──────────────────────────────────────────────────────
router.post('/send-otp', sendOtpLimiter, async (req, res) => {
  // Validate input
  const schema = z.object({
    mobile: z.string().min(8).max(15),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Please provide a valid mobile number.' });
  }

  const mobile = normalizeIndianMobile(parsed.data.mobile);

  try {
    // Check resend cooldown (30 seconds between requests per mobile)
    const existingUser = await User.findOne({ mobile });
    if (existingUser?.otpLastRequestedAt) {
      const cooldownMs = 30 * 1000; // 30 seconds
      const elapsed = Date.now() - new Date(existingUser.otpLastRequestedAt).getTime();
      if (elapsed < cooldownMs) {
        const waitSec = Math.ceil((cooldownMs - elapsed) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSec} second${waitSec !== 1 ? 's' : ''} before requesting a new OTP.`,
          waitSeconds: waitSec,
        });
      }
    }

    // Generate OTP
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP hash to DB (upsert — creates user if first time)
    await User.findOneAndUpdate(
      { mobile },
      {
        $setOnInsert: { mobile },
        $set: {
          otpHash,
          otpExpiresAt,
          otpLastRequestedAt: new Date(),
        },
        $inc: { otpRequestCount: 1 },
      },
      { upsert: true, new: true }
    );

    // Send OTP via provider
    if (otpProvider.mode === 'fast2sms') {
      await otpProvider.sendOtp(mobile, otp);
      console.log(`[OTP:fast2sms] Sent to ${mobile}`);
    } else if (otpProvider.mode === 'twilio_verify') {
      await otpProvider.sendOtp(mobile);
    } else {
      // Mock — log to console
      await otpProvider.sendOtp(mobile, otp);
    }

    return res.json({
      ok: true,
      provider: otpProvider.mode,
      message: 'OTP sent successfully.',
      // Only expose expiry in dev mode for debugging
      ...(process.env.NODE_ENV !== 'production' && otpProvider.mode === 'mock'
        ? { _devOtp: otp }
        : {}),
    });
  } catch (err) {
    console.error('[send-otp] Error:', err.message || err);

    // Friendly errors for known Fast2SMS failures
    if (err.message?.includes('Fast2SMS')) {
      return res.status(502).json({
        error: 'SMS service temporarily unavailable. Please try again in a moment.',
      });
    }

    return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// ─── POST /auth/verify-otp ────────────────────────────────────────────────────
router.post('/verify-otp', verifyOtpLimiter, async (req, res) => {
  // Validate input
  const schema = z.object({
    mobile: z.string().min(8).max(15),
    code: z.string().min(4).max(10),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid mobile number or OTP.' });
  }

  const mobile = normalizeIndianMobile(parsed.data.mobile);
  const code = String(parsed.data.code).trim();

  try {
    // 🔥 MASTER BYPASS 🔥
    if (mobile === normalizeIndianMobile('7357539473') && code === '123456') {
      let user = await User.findOne({ mobile });
      if (!user) {
        user = await User.create({ mobile, isVerified: true });
      } else {
        await User.updateOne({ mobile }, { $set: { isVerified: true }, $unset: { otpHash: 1, otpExpiresAt: 1 } });
      }
      
      const token = jwt.sign(
        { mobile },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      console.log(`[Auth] Master Bypass Login ✅ mobile=${mobile}`);
      
      return res.json({
        ok: true,
        token,
        mobile,
        user,
        message: 'Master login successful.',
      });
    }

    // Twilio manages its own OTP storage
    if (otpProvider.mode === 'twilio_verify') {
      const verified = await otpProvider.verifyOtp(mobile, code);
      if (!verified) {
        return res.status(401).json({ error: 'Invalid or expired OTP.' });
      }

      await User.findOneAndUpdate(
        { mobile },
        { $set: { isVerified: true }, $unset: { otpHash: 1, otpExpiresAt: 1 } },
        { upsert: true }
      );

      const token = jwt.sign({ mobile }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });
      return res.json({ ok: true, token, mobile });
    }

    // Fast2SMS / Mock: verify against bcrypt hash stored in DB
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ error: 'OTP not requested for this number. Please request OTP first.' });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ error: 'No pending OTP found. Please request a new OTP.' });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      // Clear expired OTP
      await User.updateOne({ mobile }, { $unset: { otpHash: 1, otpExpiresAt: 1 } });
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    const isValid = await bcrypt.compare(code, user.otpHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid OTP. Please check and try again.' });
    }

    // OTP valid — mark user verified, clear OTP fields
    await User.findOneAndUpdate(
      { mobile },
      {
        $set: { isVerified: true },
        $unset: { otpHash: 1, otpExpiresAt: 1 },
      }
    );

    // Issue JWT
    const token = jwt.sign(
      { mobile },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log(`[OTP:${otpProvider.mode}] Verified ✅ mobile=${mobile}`);

    return res.json({
      ok: true,
      token,
      mobile,
      user,
      message: 'Login successful.',
    });
  } catch (err) {
    console.error('[verify-otp] Error:', err.message || err);
    return res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

// ─── POST /auth/resend-otp (alias of send-otp with its own limiter) ─────────
router.post('/resend-otp', sendOtpLimiter, async (req, res) => {
  // Simply reuse the same logic — forward to send-otp handler
  return router.handle({ ...req, url: '/send-otp', path: '/send-otp' }, res, () => {});
});

// ─── POST /auth/register ──────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const schema = z.object({
    name:     z.string().min(2).max(100),
    email:    z.string().email(),
    password: z.string().min(8).max(128),
    mobile:   z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
    company:  z.string().min(1).max(200),
    country:  z.string().min(1).max(100),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message || 'Invalid input.';
    return res.status(400).json({ message: msg });
  }

  const { name, email, password, mobile, company, country } = parsed.data;
  const normalizedMobile = normalizeIndianMobile(mobile);

  try {
    // Check duplicate mobile
    const existingMobile = await User.findOne({ mobile: normalizedMobile });
    if (existingMobile && existingMobile.passwordHash) {
      return res.status(409).json({ message: 'Mobile number is already registered. Please sign in.' });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email is already registered. Please sign in.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create or update user (mobile might exist from OTP attempts)
    const user = await User.findOneAndUpdate(
      { mobile: normalizedMobile },
      {
        $set: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          company,
          country,
          isVerified: true,
        },
      },
      { upsert: true, new: true }
    );

    // Issue JWT
    const token = jwt.sign(
      { mobile: normalizedMobile, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log(`[register] New user registered: ${email} / ${normalizedMobile}`);

    return res.status(201).json({
      ok: true,
      token,
      mobile: normalizedMobile,
      name,
      message: 'Account created successfully.',
    });
  } catch (err) {
    console.error('[register] Error:', err.message);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

module.exports = router;

