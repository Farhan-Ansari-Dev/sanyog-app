const router = require('express').Router();
const multer = require('multer');
const { z } = require('zod');

const Application = require('../models/Application');
const Document = require('../models/Document');
const ApplicationEvent = require('../models/ApplicationEvent');
const { auth } = require('../middleware/auth');
const { saveUploadedFile, getStorageMode } = require('../services/storage');

function fileFilter(req, file, cb) {
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  return cb(new Error('Only PDF/JPG/PNG allowed'));
}

// Use memory storage so we can route to local filesystem or S3 through a single abstraction.
const upload = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Create an application (user)
router.post('/', auth, async (req, res) => {
  const schema = z.object({
    // Backward compatible field
    certification: z.string().min(2).optional(),

    // Preferred fields
    serviceGroup: z.string().min(2).optional(),
    serviceName: z.string().min(2).optional(),

    companyName: z.string().min(2).optional(),
    applicantName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    city: z.string().min(2).optional(),
    description: z.string().max(5000).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const certification = parsed.data.certification || parsed.data.serviceName;
  if (!certification) {
    return res.status(400).json({ error: 'Missing certification/serviceName' });
  }

  const app = await Application.create({
    userMobile: req.user.mobile,
    certification,
    serviceGroup: parsed.data.serviceGroup,
    serviceName: parsed.data.serviceName,
    companyName: parsed.data.companyName,
    applicantName: parsed.data.applicantName,
    email: parsed.data.email,
    city: parsed.data.city,
    description: parsed.data.description,
  });

  await ApplicationEvent.create({
    applicationId: app._id,
    type: 'created',
    actorType: 'client',
    actorId: req.user.mobile,
    payload: { serviceGroup: app.serviceGroup, serviceName: app.serviceName, certification: app.certification },
  });

  return res.json(app);
});

// List my applications
router.get('/my', auth, async (req, res) => {
  const apps = await Application.find({ userMobile: req.user.mobile }).sort({ createdAt: -1 });
  return res.json(apps);
});

// Upload docs for an application (user)
router.post('/:id/upload', auth, upload.array('files', 5), async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Not found' });
  if (app.userMobile !== req.user.mobile) return res.status(403).json({ error: 'Forbidden' });

  const uploaded = [];
  for (const f of req.files || []) {
    let saved;
    try {
      saved = await saveUploadedFile({
        buffer: f.buffer,
        mimeType: f.mimetype,
        originalName: f.originalname,
        keyPrefix: `applications/${app.serviceName || app.certification}/${app._id}`,
      });
    } catch (e) {
      return res.status(500).json({
        error: 'Upload failed',
        detail: e?.message || 'Storage error',
      });
    }

    const doc = await Document.create({
      applicationId: app._id,
      uploadedByMobile: req.user.mobile,
      originalName: f.originalname,
      mimeType: f.mimetype,
      sizeBytes: f.size,
      storageProvider: saved.storageProvider,
      storageKey: saved.storageKey,
      publicUrl: saved.publicUrl,
    });

    app.documentIds = [...(app.documentIds || []), doc._id];
    // Keep legacy field for local download paths and simpler UI
    if (saved.storageProvider === 'local') {
      app.documents = [...(app.documents || []), saved.publicUrl];
    }

    uploaded.push({ id: doc._id, url: doc.publicUrl });
  }

  await app.save();

  await ApplicationEvent.create({
    applicationId: app._id,
    type: 'document_uploaded',
    actorType: 'client',
    actorId: req.user.mobile,
    payload: { count: uploaded.length, storageMode: getStorageMode() },
  });

  return res.json({ ...app.toObject(), uploaded });
});

module.exports = router;
