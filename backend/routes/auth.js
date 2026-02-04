const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const User = require('../models/User');
const { createOtpProvider, normalizeIndianMobile } = require('../services/otpProvider');

const otpProvider = createOtpProvider();

const sendLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getMockOtp() {
  const test = (process.env.OTP_TEST_CODE || '').trim();
  if (test && /^\d{4,10}$/.test(test)) return test;
  return generateOtp();
}

router.post('/send-otp', sendLimiter, async (req, res) => {
  const schema = z.object({ mobile: z.string().min(8) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const mobile = normalizeIndianMobile(parsed.data.mobile);

  // For Twilio Verify, we don't store OTP server-side.
  if (otpProvider.mode === 'twilio_verify') {
    await otpProvider.sendOtp(mobile);
    await User.findOneAndUpdate(
      { mobile },
      { $setOnInsert: { mobile }, $set: { otpLastRequestedAt: new Date() } },
      { upsert: true, new: true }
    );

    return res.json({ ok: true, provider: otpProvider.mode });
  }

  // Mock/dev OTP: generate and store hash + expiry
  if (otpProvider.mode === 'mock' && (process.env.NODE_ENV || '').toLowerCase() === 'production') {
    console.warn('[SECURITY] OTP_PROVIDER=mock while NODE_ENV=production. Do not use mock OTP in real production.');
  }

  const otp = otpProvider.mode === 'mock' ? getMockOtp() : generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

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
    { upsert: true }
  );

  await otpProvider.sendOtp(mobile, otp);
  return res.json({ ok: true, provider: otpProvider.mode });
});

router.post('/verify-otp', async (req, res) => {
  const schema = z.object({ mobile: z.string().min(8), code: z.string().min(4) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const mobile = normalizeIndianMobile(parsed.data.mobile);
  const code = parsed.data.code;

  let ok = false;
  if (otpProvider.mode === 'twilio_verify') {
    ok = await otpProvider.verifyOtp(mobile, code);
  } else {
    const user = await User.findOne({ mobile });
    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ error: 'OTP not requested' });
    }
    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: 'OTP expired' });
    }
    ok = await bcrypt.compare(code, user.otpHash);
  }

  if (!ok) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  await User.findOneAndUpdate(
    { mobile },
    { $set: { isVerified: true }, $unset: { otpHash: 1, otpExpiresAt: 1 } },
    { upsert: true }
  );

  const token = jwt.sign(
    { mobile },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return res.json({ ok: true, token, mobile });
});

module.exports = router;
