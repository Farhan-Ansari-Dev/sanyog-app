const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    mobile: { type: String, required: true, unique: true, index: true },
    isVerified: { type: Boolean, default: false },

    otpHash: { type: String },
    otpExpiresAt: { type: Date },
    otpRequestCount: { type: Number, default: 0 },
    otpLastRequestedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
