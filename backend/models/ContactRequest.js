const mongoose = require('mongoose');

const ContactRequestSchema = new mongoose.Schema(
  {
    userMobile: { type: String, required: false, index: true },
    userEmail: { type: String },
    userName: { type: String },
    message: { type: String },
    status: { type: String, default: 'Open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactRequest', ContactRequestSchema);
