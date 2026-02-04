const router = require('express').Router();
const { z } = require('zod');

const Application = require('../models/Application');
const Document = require('../models/Document');
const { adminAuth, requireRole } = require('../middleware/adminAuth');

router.get('/', adminAuth, requireRole(['admin', 'ops', 'viewer']), async (req, res) => {
  const { status, serviceGroup, serviceName } = req.query;
  const filter = {};
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

router.patch('/:id', adminAuth, requireRole(['admin', 'ops']), async (req, res) => {
  const schema = z.object({
    status: z.string().min(2).optional(),
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

module.exports = router;
