const router = require('express').Router();
const { z } = require('zod');

const Application = require('../models/Application');
const Document = require('../models/Document');
const { adminAuth, requireRole } = require('../middleware/adminAuth');

// ── GET all (excludes soft-deleted by default) ───────────────────────────────
router.get('/', adminAuth, requireRole(['admin', 'ops', 'viewer']), async (req, res) => {
  const { status, serviceGroup, serviceName, showDeleted } = req.query;
  const filter = {};

  // Only show deleted if explicitly requested (and admin role)
  if (showDeleted === 'true') {
    filter.deletedAt = { $ne: null };
  } else {
    filter.deletedAt = null;
  }

  if (status) filter.status = status;
  if (serviceGroup) filter.serviceGroup = serviceGroup;
  if (serviceName) filter.serviceName = serviceName;

  const apps = await Application.find(filter).sort({ createdAt: -1 }).lean();

  const appIds = apps.map((a) => a._id);
  const docs = await Document.find({ applicationId: { $in: appIds } })
    .sort({ createdAt: -1 })
    .lean();

  const docsByApp = new Map();
  for (const d of docs) {
    const key = String(d.applicationId);
    const arr = docsByApp.get(key) || [];
    arr.push({
      _id: d._id,
      originalName: d.originalName,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      storageProvider: d.storageProvider,
      createdAt: d.createdAt,
    });
    docsByApp.set(key, arr);
  }

  const out = apps.map((a) => ({
    ...a,
    documentsMeta: docsByApp.get(String(a._id)) || [],
  }));

  return res.json(out);
});

// ── POST (manually create application) ───────────────────────────────────────
router.post('/', adminAuth, requireRole(['admin', 'ops']), async (req, res) => {
  try {
    const { userMobile, applicantName, email, companyName, serviceName, serviceGroup, status, remarks } = req.body;
    
    if (!userMobile || !serviceName) {
      return res.status(400).json({ error: 'Mobile and Service Name are required' });
    }

    const app = await Application.create({
      userMobile,
      applicantName,
      email,
      companyName,
      serviceName,
      certification: serviceName, // Required field fallback
      serviceGroup: serviceGroup || 'Admin Created',
      status: status || 'Documents Received',
      remarks: remarks || '',
    });

    return res.status(201).json(app);
  } catch (error) {
    console.error('[Admin] Manual application create error', error);
    return res.status(500).json({ error: 'Failed to create application' });
  }
});

// ── PATCH status/remarks ─────────────────────────────────────────────────────
router.patch('/:id', adminAuth, requireRole(['admin', 'ops']), async (req, res) => {
  const schema = z.object({
    status:  z.string().min(2).optional(),
    remarks: z.string().max(5000).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    { $set: parsed.data },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: 'Not found' });
  return res.json(updated);
});

// ── DELETE (soft delete) ──────────────────────────────────────────────────────
router.delete('/:id', adminAuth, requireRole(['admin']), async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  if (app.deletedAt) return res.status(400).json({ error: 'Application already deleted' });

  app.deletedAt = new Date();
  app.deletedBy = req.admin?.email || 'admin';
  await app.save();

  console.log(`[Admin] Application ${req.params.id} soft-deleted by ${req.admin?.email}`);
  return res.json({ ok: true, message: 'Application moved to trash' });
});

// ── RESTORE (un-delete) ───────────────────────────────────────────────────────
router.post('/:id/restore', adminAuth, requireRole(['admin']), async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  if (!app.deletedAt) return res.status(400).json({ error: 'Application is not deleted' });

  app.deletedAt = null;
  app.deletedBy = undefined;
  await app.save();

  console.log(`[Admin] Application ${req.params.id} restored by ${req.admin?.email}`);
  return res.json({ ok: true, message: 'Application restored successfully' });
});

// ── PURGE (permanent delete — admin only) ────────────────────────────────────
router.delete('/:id/purge', adminAuth, requireRole(['admin']), async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  await Application.findByIdAndDelete(req.params.id);
  console.log(`[Admin] Application ${req.params.id} permanently purged by ${req.admin?.email}`);
  return res.json({ ok: true, message: 'Application permanently deleted' });
});

// ── GET stats (for dashboard) ─────────────────────────────────────────────────
router.get('/stats/summary', adminAuth, requireRole(['admin', 'ops', 'viewer']), async (req, res) => {
  const [total, pending, approved, rejected, deleted] = await Promise.all([
    Application.countDocuments({ deletedAt: null }),
    Application.countDocuments({ deletedAt: null, status: { $in: ['submitted', 'pending', 'in-progress', 'under-review', 'documents_required'] } }),
    Application.countDocuments({ deletedAt: null, status: { $in: ['approved', 'certificate-issued'] } }),
    Application.countDocuments({ deletedAt: null, status: 'rejected' }),
    Application.countDocuments({ deletedAt: { $ne: null } }),
  ]);

  // Applications per day (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const trend = await Application.aggregate([
    { $match: { deletedAt: null, createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return res.json({ total, pending, approved, rejected, deleted, trend });
});

module.exports = router;
