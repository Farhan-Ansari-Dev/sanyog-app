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

const applicationSubmitSchema = z.object({
  serviceId: z.string().optional(),
  serviceName: z.string().min(2, "Service Name is required"),
  serviceGroup: z.string().optional(),
  companyName: z.string().min(2, "Company Name is required"),
  applicantName: z.string().min(2, "Applicant Name is required"),
  email: z.string().email("A valid email is required"),
  city: z.string().min(2, "City is required"),
  productDescription: z.string().optional(),
});

// Create an application with files (User)
router.post('/', auth, upload.array('files', 10), async (req, res, next) => {
  try {
    const validatedData = applicationSubmitSchema.parse(req.body);
    const { 
      serviceId, serviceName, serviceGroup, 
      companyName, applicantName, email, city, productDescription 
    } = validatedData;

    const certification = serviceName || 'General Compliance';

    // 1. Create Application
    const app = await Application.create({
      userEmail: req.user.email,
      certification,
      serviceGroup: serviceGroup || 'Uncategorized',
      serviceName: certification,
      companyName: companyName || '',
      applicantName: applicantName || '',
      email: email || '',
      city: city || '',
      productDescription: productDescription || '',
      description: productDescription || '',
    });

    // 2. Upload Files
    const uploadedDocs = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        const saved = await saveUploadedFile({
          buffer: f.buffer,
          mimeType: f.mimetype,
          originalName: f.originalname,
          keyPrefix: `applications/${req.user.userId}/${app._id}`,
        });

        const doc = await Document.create({
          applicationId: app._id,
          uploadedByEmail: req.user.email,
          originalName: f.originalname,
          mimeType: f.mimetype,
          sizeBytes: f.size,
          storageProvider: saved.storageProvider,
          storageKey: saved.storageKey,
          publicUrl: saved.publicUrl,
        });

        app.documentIds = [...(app.documentIds || []), doc._id];
        if (saved.storageProvider === 'local') {
          app.documents = [...(app.documents || []), saved.publicUrl];
        }
        uploadedDocs.push(doc._id);
      }
      await app.save();
    }

    // 3. Create Event
    await ApplicationEvent.create({
      applicationId: app._id,
      type: 'created',
      actorType: 'client',
      actorId: req.user.email,
      payload: { serviceName, fileCount: uploadedDocs.length },
    });

    // 4. Trigger Notification
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: req.user.userId,
      title: "Application Received",
      desc: `Your request for ${certification} has been submitted successfully (App ID: ${app._id.toString().slice(-6).toUpperCase()}).`,
      type: 'info'
    });

    return res.status(201).json(app);
  } catch (err) {
    console.error('[Application Submission Error]:', err);
    next(err);
  }
});

// List my applications
router.get('/my', auth, async (req, res) => {
  const apps = await Application.find({ userEmail: req.user.email })
    .populate('documentIds')
    .sort({ createdAt: -1 });
  return res.json(apps);
});

// Upload docs for an application (user)
router.post('/:id/upload', auth, upload.array('files', 5), async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Not found' });
  if (app.userEmail !== req.user.email) return res.status(403).json({ error: 'Forbidden' });

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
      uploadedByEmail: req.user.email,
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
    actorId: req.user.email,
    payload: { count: uploaded.length, storageMode: getStorageMode() },
  });

  return res.json({ ...app.toObject(), uploaded });
});

module.exports = router;
