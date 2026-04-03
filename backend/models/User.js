const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    mobile:       { type: String, required: true, unique: true, index: true },
    email:        { type: String, sparse: true, index: true, lowercase: true, trim: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
