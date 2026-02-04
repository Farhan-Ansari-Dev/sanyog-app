const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    userMobile: { type: String, required: true, index: true },
    certification: { type: String, required: true },

    // Website-derived taxonomy (preferred)
    serviceGroup: { type: String },
    serviceName: { type: String },

    companyName: { type: String },
    applicantName: { type: String },
    email: { type: String },
    city: { type: String },
    description: { type: String },

    status: { type: String, default: 'Documents Received' },
    remarks: { type: String },
    // Legacy: public URLs for local uploads
    documents: [{ type: String }],

    // Preferred: document metadata references
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
