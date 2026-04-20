const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    userEmail:    { type: String, required: true, index: true },
    certification: { type: String, required: true },

    serviceGroup:  { type: String },
    serviceName:   { type: String },

    companyName:    { type: String },
    applicantName:  { type: String },
    email:          { type: String },
    city:           { type: String },
    description:    { type: String },
    productDescription: { type: String },
    additionalNotes:    { type: String },

    status:  { type: String, default: 'submitted' },
    remarks: { type: String },

    documents:   [{ type: String }],
    documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],

    // Soft-delete support
    deletedAt:  { type: Date, default: null, index: true },
    deletedBy:  { type: String },   // admin email
  },
  { timestamps: true }
);

// High Performance Compound Aggregation Indexes
ApplicationSchema.index({ status: 1, deletedAt: 1, createdAt: -1 });
ApplicationSchema.index({ serviceGroup: 1, createdAt: -1 });
ApplicationSchema.index({ userEmail: 1, status: 1, deletedAt: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
