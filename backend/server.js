require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ROUTES
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');
const adminAuthRoutes = require('./routes/adminAuth');
const adminApplicationRoutes = require('./routes/adminApplications');
const adminContactRoutes = require('./routes/adminContact');
const adminDocumentsRoutes = require('./routes/adminDocuments');
const adminUsersRoutes = require('./routes/adminUsers');
const catalogRoutes = require('./routes/catalog');

// SERVICES
const { seedAdminFromEnv } = require('./services/adminSeed');

const app = express();


// ============================================
// TRUST PROXY (Cloudflare + Nginx)
// ============================================
app.set('trust proxy', 1);


// ============================================
// CORS CONFIG
// ============================================
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
  : [];

if (allowedOrigins.length === 0) {
  console.warn('[CORS] WARNING: CORS_ORIGIN is not set. All origins will be blocked for credentialed requests.');
}

app.use(
  cors({
    origin: function (origin, callback) {
      // No origin = server-to-server, curl, Postman, mobile app → allow
      if (!origin) return callback(null, true);

      // If no allowlist configured, allow all (dev fallback)
      if (allowedOrigins.length === 0) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log the blocked origin so we can debug easily
      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());


// ============================================
// BODY PARSER (CRITICAL)
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// ============================================
// STATIC FILES
// ============================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({ ok: true });
});


// ============================================
// ROUTES
// ============================================
app.use('/auth', authRoutes);
app.use('/applications', applicationRoutes);
app.use('/contact', contactRoutes);

app.use('/admin/auth', adminAuthRoutes);
app.use('/admin/applications', adminApplicationRoutes);
app.use('/admin/contact', adminContactRoutes);
app.use('/admin/documents', adminDocumentsRoutes);
app.use('/admin/users', adminUsersRoutes);

app.use('/catalog', catalogRoutes);


// ============================================
// ENV VALIDATION
// ============================================
if (!process.env.MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET');
  process.exit(1);
}


// ============================================
// DATABASE + SERVER START
// ============================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    await seedAdminFromEnv();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Mongo connection error:', err);
    process.exit(1);
  });