const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'ops', 'viewer', 'client', 'system'],
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'APPLICATION_CREATED',
      'APPLICATION_STATUS_CHANGED',
      'APPLICATION_DELETED',
      'APPLICATION_RESTORED',
      'DOCUMENT_UPLOADED',
      'DOCUMENT_DELETED',
      'USER_ROLE_CHANGED',
      'SYSTEM_BACKUP',
      'BULK_UPDATE'
    ]
  },
  targetResource: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: '365d' // Automatically retain logs for exactly 1 year to meet Enterprise Compliance
  }
});

auditLogSchema.index({ actorId: 1, action: 1 });
auditLogSchema.index({ targetResource: 1 });
auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
