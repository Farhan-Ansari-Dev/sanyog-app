const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name:         { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['admin', 'ops', 'viewer'], default: 'ops' },
    isActive:     { type: Boolean, default: true },
    avatar:       { type: String, default: null },  // base64 or URL
    phone:        { type: String },
    lastLoginAt:  { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminUser', AdminUserSchema);
