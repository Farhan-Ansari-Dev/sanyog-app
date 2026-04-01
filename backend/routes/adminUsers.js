const router = require('express').Router();
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const User = require('../models/User');
const Application = require('../models/Application');
const { adminAuth, requireRole } = require('../middleware/adminAuth');

// ─── ALL ADMIN USERS (Staff Management) ──────────────────────────────────────

// GET  /admin/users/staff  — list all admin staff
router.get('/staff', adminAuth, async (req, res) => {
  try {
    const staff = await AdminUser.find().select('-passwordHash').sort({ createdAt: -1 });
    return res.json(staff);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /admin/users/staff — create new admin user (superadmin only)
router.post('/staff', adminAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const exists = await AdminUser.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await AdminUser.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'ops',
      isActive: true,
    });

    return res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /admin/users/staff/:id — update staff (toggle active, change role, reset password)
router.patch('/staff/:id', adminAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, role, isActive, password } = req.body;
    const admin = await AdminUser.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Not found' });

    if (name !== undefined) admin.name = name;
    if (role !== undefined) admin.role = role;
    if (isActive !== undefined) admin.isActive = isActive;
    if (password) admin.passwordHash = await bcrypt.hash(password, 12);

    await admin.save();
    return res.json({ ok: true, _id: admin._id, name: admin.name, role: admin.role, isActive: admin.isActive });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /admin/users/staff/:id — delete admin user
router.delete('/staff/:id', adminAuth, requireRole('admin'), async (req, res) => {
  try {
    // Prevent self-deletion
    if (String(req.params.id) === String(req.admin.sub)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await AdminUser.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── CLIENT USERS (Mobile app users) ─────────────────────────────────────────

// GET /admin/users/clients — list all registered mobile app users
router.get('/clients', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(500);
    // Attach application count
    const appCounts = await Application.aggregate([
      { $group: { _id: '$mobile', count: { $sum: 1 }, lastDate: { $max: '$createdAt' } } }
    ]);
    const countMap = {};
    appCounts.forEach(a => { countMap[a._id] = { count: a.count, lastDate: a.lastDate }; });

    const result = users.map(u => ({
      _id: u._id,
      mobile: u.mobile,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
      applications: countMap[u.mobile]?.count || 0,
      lastActivity: countMap[u.mobile]?.lastDate || u.createdAt,
    }));

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /admin/users/clients/:id — delete a client user
router.delete('/clients/:id', adminAuth, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
