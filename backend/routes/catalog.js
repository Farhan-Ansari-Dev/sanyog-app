const router = require('express').Router();
const Service = require('../models/Service');
const { SERVICE_CATALOG } = require('../services/serviceCatalog');

router.get('/services', async (req, res) => {
  try {
    let services = await Service.find({ isActive: true }).sort({ priority: -1, createdAt: 1 });
    
    // Auto-seed if empty
    if (services.length === 0) {
      console.log('Seeding services from SERVICE_CATALOG...');
      const toInsert = [];
      for (const group of SERVICE_CATALOG) {
        for (const s of group.services) {
          toInsert.push({
            category: group.name,
            name: s.name,
            slug: s.slug,
            isActive: true,
          });
        }
      }
      if (toInsert.length > 0) {
        await Service.insertMany(toInsert);
        services = await Service.find({ isActive: true }).sort({ createdAt: 1 });
      }
    }

    // Group services by category
    const grouped = services.reduce((acc, service) => {
      const group = acc.find((g) => g.groupName === service.category);
      if (group) {
        group.services.push(service);
      } else {
        acc.push({ groupName: service.category, services: [service] });
      }
      return acc;
    }, []);

    // Also return a flat list for a direct catalog view if needed by future screens
    return res.json({ groups: grouped, flatServices: services });
  } catch (error) {
    console.error('Error fetching catalog services:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
