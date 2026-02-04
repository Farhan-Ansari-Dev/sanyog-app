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
const catalogRoutes = require('./routes/catalog');
const { seedAdminFromEnv } = require('./services/adminSeed');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRoutes);
app.use('/applications', applicationRoutes);
app.use('/contact', contactRoutes);

app.use('/admin/auth', adminAuthRoutes);
app.use('/admin/applications', adminApplicationRoutes);
app.use('/admin/contact', adminContactRoutes);
app.use('/admin/documents', adminDocumentsRoutes);

app.use('/catalog', catalogRoutes);

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET');
  process.exit(1);
}

// ADMIN_API_KEY is optional now (legacy admin key auth). Prefer admin JWT routes.

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    return seedAdminFromEnv();
  })
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
