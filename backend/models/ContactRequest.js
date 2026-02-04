const mongoose = require('mongoose');

const ContactRequestSchema = new mongoose.Schema(
  {
    userMobile: { type: String, required: true, index: true },
    message: { type: String },
    status: { type: String, default: 'Open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactRequest', ContactRequestSchema);
