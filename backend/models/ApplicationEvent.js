const mongoose = require('mongoose');

const ApplicationEventSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    type: {
      type: String,
      enum: ['created', 'status_changed', 'remarks_changed', 'document_uploaded'],
      required: true,
    },
    actorType: { type: String, enum: ['client', 'admin'], required: true },
    actorId: { type: String, required: true },
    payload: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApplicationEvent', ApplicationEventSchema);
