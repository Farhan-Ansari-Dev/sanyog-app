const router = require('express').Router();
const Shipment = require('../models/Shipment');
const { auth } = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cache');

// List my shipments
router.get('/my', auth, cacheMiddleware('cache:shipments', 300, (req) => `cache:shipments:${req.user.email}`), async (req, res) => {
  try {
    let shipments = await Shipment.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    
    // Seed dummy shipments if none exist to support the mobile UI demonstration
    if (shipments.length === 0) {
      const dummy1 = await Shipment.create({
        userEmail: req.user.email,
        shipmentId: 'MSCU1234567',
        type: 'Ocean Freight',
        route: 'Shanghai (SHA) ➔ Nhava Sheva (NSA)',
        status: 'In Customs',
        eta: 'Today, 14:00',
        progress: 85,
        complianceStatus: 'Clearance Pending',
        complianceColor: '#f59e0b',
        checklist: [
          { item: 'Commercial Invoice & Packing List', cleared: true, warning: false },
          { item: 'Bill of Lading / AWB', cleared: true, warning: false },
          { item: 'BIS CRS Certificate Clearance', cleared: false, warning: true },
        ],
        logs: [
          { title: 'Arrived at Destination Port', time: 'Today, 08:30 AM • Nhava Sheva', active: true },
          { title: 'Customs Declaration Submitted', time: 'Yesterday, 14:15 PM • Online', active: false },
          { title: 'Vessel Departed Origin', time: 'May 12, 09:00 AM • Shanghai', active: false },
        ]
      });

      const dummy2 = await Shipment.create({
        userEmail: req.user.email,
        shipmentId: 'AWB-882-991',
        type: 'Air Freight',
        route: 'Frankfurt (FRA) ➔ Delhi (DEL)',
        status: 'Delivered',
        eta: 'May 18, 09:00',
        progress: 100,
        complianceStatus: 'Cleared',
        complianceColor: '#16a34a',
        checklist: [
          { item: 'Commercial Invoice', cleared: true, warning: false },
          { item: 'Air Waybill', cleared: true, warning: false },
        ],
        logs: [
          { title: 'Delivered to Warehouse', time: 'May 18, 14:00 PM • Delhi', active: true },
          { title: 'Customs Cleared', time: 'May 18, 10:30 AM • Delhi', active: false },
        ]
      });
      
      shipments = [dummy1, dummy2];
    }
    
    return res.json(shipments);
  } catch (err) {
    console.error('[Shipments List Error]:', err);
    res.status(500).json({ error: 'Failed to load shipments' });
  }
});

module.exports = router;
