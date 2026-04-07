require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');
const adminAuthRoutes = require('./routes/adminAuth');
const adminApplicationRoutes = require('./routes/adminApplications');
const adminContactRoutes = require('./routes/adminContact');
const adminDocumentsRoutes = require('./routes/adminDocuments');
const adminServicesRoutes = require('./routes/adminServices');
const adminUsersRoutes = require('./routes/adminUsers');
const catalogRoutes = require('./routes/catalog');
const { seedAdminFromEnv } = require('./services/adminSeed');

const app = express();


// ============================================
// ⭐ CRITICAL FIX — TRUST PROXY (Cloudflare + Nginx)
// ============================================
// Required when using:
// Cloudflare → Nginx → Express
// Fixes rate-limit + login + 521 errors
app.set('trust proxy', 1);


// ============================================
// ⭐ CORS CONFIGURATION
// ============================================

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow curl/postman/server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// handle preflight requests
app.options('*', cors());


// ============================================
// BODY PARSER
// ============================================

app.use(express.json({ limit: '10mb' }));


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
app.use('/admin/services', adminServicesRoutes);
app.use('/admin/users', adminUsersRoutes);

app.use('/catalog', catalogRoutes);


// ============================================
// ENV VALIDATION
// ============================================

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
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
  .connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected');
    return seedAdminFromEnv();
  })
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`🚀 Server running on port ${port}`)
    );
  })
  .catch((err) => {
    console.error('❌ Mongo connection error', err);
    process.exit(1);
  });
