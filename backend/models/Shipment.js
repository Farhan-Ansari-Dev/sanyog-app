const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    shipmentId: { type: String, required: true },
    type: { type: String, default: 'Ocean Freight' }, // e.g., 'Ocean Freight', 'Air Freight'
    route: { type: String }, // e.g., 'Shanghai (SHA) ➔ Nhava Sheva (NSA)'
    status: { type: String, default: 'In Transit' },
    eta: { type: String }, // Can be ISO Date string or text 'Today, 14:00'
    progress: { type: Number, default: 0 }, // 0 to 100 percentage
    complianceStatus: { type: String, default: 'Clearance Pending' },
    complianceColor: { type: String, default: '#f59e0b' },
    
    // Checklists for compliance items
    checklist: [{
      item: String,
      cleared: Boolean,
      warning: Boolean
    }],

    // Tracking history nodes
    logs: [{
      title: String,
      time: String,
      active: Boolean
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', ShipmentSchema);
