const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    mobile:       { type: String, index: true },
    name:         { type: String, trim: true },
    passwordHash: { type: String },
    company:      { type: String, trim: true },
    country:      { type: String, trim: true },
    isVerified:   { type: Boolean, default: false },

    // OTP fields
    otpHash:             { type: String },
    otpExpiresAt:        { type: Date },
    otpRequestCount:     { type: Number, default: 0 },
    otpLastRequestedAt:  { type: Date },

    // UI & Profile
    avatar: { type: String },
    settings: {
      theme: { type: String, default: 'light' },
      compactMode: { type: Boolean, default: false },
      notifPrefs: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        applicationUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        security: { type: Boolean, default: true },
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
