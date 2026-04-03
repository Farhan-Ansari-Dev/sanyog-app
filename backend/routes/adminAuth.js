const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const AdminUser = require('../models/AdminUser');
const { adminAuth } = require('../middleware/adminAuth');

// ── POST /login ───────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const email = parsed.data.email.toLowerCase();
  const admin = await AdminUser.findOne({ email });
  if (!admin || !admin.isActive) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = jwt.sign(
    { type: 'admin', sub: String(admin._id), email: admin.email, role: admin.role, name: admin.name },
    process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '12h' }
  );

  return res.json({
    ok: true,
    token,
    admin: { email: admin.email, name: admin.name, role: admin.role, avatar: admin.avatar },
  });
});

// ── GET /me ───────────────────────────────────────────────────────────────────
router.get('/me', adminAuth, async (req, res) => {
  const admin = await AdminUser.findById(req.admin.sub).select('-passwordHash');
  if (!admin) return res.status(404).json({ error: 'Admin not found' });
  return res.json(admin);
});

// ── PUT /me (update profile details) ─────────────────────────────────────────
router.put('/me', adminAuth, async (req, res) => {
  const schema = z.object({
    name:  z.string().min(2).max(100).optional(),
    phone: z.string().max(20).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const admin = await AdminUser.findByIdAndUpdate(
    req.admin.sub,
    { $set: parsed.data },
    { new: true, select: '-passwordHash' }
  );
  return res.json({ ok: true, admin });
});

// ── PUT /me/avatar (upload profile picture as base64) ─────────────────────────
router.put('/me/avatar', adminAuth, async (req, res) => {
  const schema = z.object({
    avatar: z.string().min(10), // base64 data URL or external URL
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid avatar data' });

  // Limit size ~500KB in base64
  if (parsed.data.avatar.length > 700000) {
    return res.status(413).json({ error: 'Image too large. Please use an image under 500KB.' });
  }

  const admin = await AdminUser.findByIdAndUpdate(
    req.admin.sub,
    { $set: { avatar: parsed.data.avatar } },
    { new: true, select: '-passwordHash' }
  );
  return res.json({ ok: true, avatar: admin.avatar });
});

// ── PUT /me/password (change password) ───────────────────────────────────────
router.put('/me/password', adminAuth, async (req, res) => {
  const schema = z.object({
    currentPassword: z.string().min(6),
    newPassword:     z.string().min(8).max(128),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const admin = await AdminUser.findById(req.admin.sub);
  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  const ok = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });

  admin.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await admin.save();

  return res.json({ ok: true, message: 'Password updated successfully' });
});

module.exports = router;
