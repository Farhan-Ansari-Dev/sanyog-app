const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const User = require('../models/User');
const emailService = require('../services/emailService');

// ─── Rate Limiters ──────────────────────────────────────────────────────────
const sendOtpLimiter = rateLimit({
  windowMs: 60 * 1000,          // 1 minute
  limit: 5,                      // max 5 OTP requests per minute per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait 1 minute.' },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ─── POST /auth/send-otp (Email OTP) ──────────────────────────────────────────
router.post('/send-otp', sendOtpLimiter, async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    /* 
    mobile: z.string().optional(), // Mobile login disabled for now
    */
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please register first.' });
    }

    await User.updateOne(
      { email },
      {
        $set: {
          otpHash,
          otpExpiresAt,
          otpLastRequestedAt: new Date(),
        },
      }
    );

    // REAL EMAIL SENDING
    await emailService.sendOtpEmail(email, otp);
    
    return res.json({
      ok: true,
      message: `Verification code sent to ${email}`,
      // For development/mock login:
      ...(process.env.NODE_ENV !== 'production' && (email === 'admin@sanyog.com' || email.includes('test')) ? { _devOtp: otp } : {})
    });
  } catch (err) {
    console.error('[send-otp] Error:', err);
    return res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// ─── POST /auth/verify-otp ────────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    code: z.string().min(6),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { email, code } = parsed.data;
  const lowerEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: lowerEmail });
    if (!user || !user.otpHash || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
    }

    const isValid = await bcrypt.compare(code, user.otpHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid OTP' });

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ email: lowerEmail, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ ok: true, token, user });
  } catch (err) {
    return res.status(500).json({ error: 'Verification failed' });
  }
});

// ─── POST /auth/login-password ───────────────────────────────────────────────
router.post('/login-password', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { email, password } = parsed.data;
  const lowerEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: lowerEmail });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: lowerEmail, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ ok: true, token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// ─── GET /auth/me (Get Current Profile) ──────────────────────────────────────
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -otpHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ─── PUT /auth/me (Update Profile) ───────────────────────────────────────────
router.put('/me', authenticateToken, async (req, res) => {
  const { name, company, country, mobile, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { name, company, country, mobile, avatar } },
      { new: true }
    ).select('-passwordHash -otpHash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ─── PUT /auth/me/settings (Update UI Settings) ──────────────────────────────
router.put('/me/settings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { settings: req.body } },
      { new: true }
    ).select('-passwordHash -otpHash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ─── POST /auth/register (Email Signup) ───────────────────────────────────────
router.post('/register', async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    company: z.string().optional(),
    mobile: z.string().optional(),
    country: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid data. Password must be at least 6 characters.' });

  const { name, email, password, company, mobile, country } = parsed.data;
  const lowerEmail = email.toLowerCase();

  try {
    const existing = await User.findOne({ email: lowerEmail });
    if (existing && existing.passwordHash) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { email: lowerEmail },
      { $set: { name, company, mobile, country, passwordHash, isVerified: true } },
      { upsert: true, new: true }
    );

    // TRIGGER WELCOME NOTIFICATION
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: user._id,
      title: "Welcome to Sanyog",
      desc: `Your account for ${name} has been activated successfully.`,
      type: 'success'
    });

    const token = jwt.sign({ email: lowerEmail, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ ok: true, token, user });
  } catch (err) {
    return res.status(500).json({ error: 'Signup failed' });
  }
});

module.exports = router;
