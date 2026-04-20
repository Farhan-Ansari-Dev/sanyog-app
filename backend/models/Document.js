const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    uploadedByEmail: { type: String, required: true, index: true },

    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },

    storageProvider: { type: String, enum: ['local', 's3'], required: true },
    storageKey: { type: String, required: true },
    publicUrl: { type: String, required: true },
  },
  { timestamps: true }
);

DocumentSchema.index({ applicationId: 1, createdAt: -1 });

module.exports = mongoose.model('Document', DocumentSchema);
