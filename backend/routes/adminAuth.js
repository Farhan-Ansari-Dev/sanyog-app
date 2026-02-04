const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const AdminUser = require('../models/AdminUser');
const { adminAuth } = require('../middleware/adminAuth');

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const email = parsed.data.email.toLowerCase();
  const admin = await AdminUser.findOne({ email });
  if (!admin || !admin.isActive) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

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
    admin: { email: admin.email, name: admin.name, role: admin.role },
  });
});

router.get('/me', adminAuth, async (req, res) => {
  return res.json({ email: req.admin.email, name: req.admin.name, role: req.admin.role });
});

module.exports = router;
