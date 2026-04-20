require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');

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
// ⭐ SECURITY HARDENING (HELMET & RATE LIMIT)
// ============================================
app.use(helmet());

// Global Rate Limiter: Maximum 300 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

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
app.use('/notifications', require('./routes/notifications'));
app.use('/applications', applicationRoutes);
app.use('/contact', contactRoutes);

app.use('/admin/auth', adminAuthRoutes);
app.use('/admin/applications', adminApplicationRoutes);
app.use('/admin/contact', adminContactRoutes);
app.use('/admin/documents', adminDocumentsRoutes);
app.use('/admin/services', adminServicesRoutes);
app.use('/admin/users', adminUsersRoutes);

app.use('/catalog', catalogRoutes);
app.use('/news', require('./routes/news'));


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
// GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  logger.error(`[Error] ${err.message}`, { stack: err.stack, method: req.method, path: req.path });

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle MongoDB Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered.';
  }

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(' | ');
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


// ============================================
// DATABASE + SERVER START
// ============================================

mongoose
  .connect(mongoUri)
  .then(() => {
    logger.info('✅ MongoDB connected');
    return seedAdminFromEnv();
  })
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      logger.info(`🚀 Server running on port ${port}`)
    );
  })
  .catch((err) => {
    logger.error('❌ Mongo connection error', { error: err });
    process.exit(1);
  });
