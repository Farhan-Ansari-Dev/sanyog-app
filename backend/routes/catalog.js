const router = require('express').Router();
const Service = require('../models/Service');
const { SERVICE_CATALOG } = require('../services/serviceCatalog');
const cacheMiddleware = require('../middleware/cache');

router.get('/services', cacheMiddleware('cache:catalog:services', 86400), async (req, res) => {
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

// Mock Country Rules with global caching
router.get('/country-rules', cacheMiddleware('cache:catalog:country-rules', 86400), (req, res) => {
  const rules = {
    'India': [
      { rule: 'BIS CRS', description: 'Mandatory certification for 77 IT and electronic product categories.', severity: 'High' },
      { rule: 'WPC ETA', description: 'Required for all wireless and RF products.', severity: 'High' },
      { rule: 'EPR', description: 'E-Waste management requirement for producers and importers.', severity: 'Medium' }
    ],
    'European Union': [
      { rule: 'CE Mark', description: 'Mandatory conformity mark for products sold in the EEA.', severity: 'High' },
      { rule: 'RoHS', description: 'Restriction of Hazardous Substances in electrical equipment.', severity: 'High' }
    ],
    'United States': [
      { rule: 'FCC', description: 'Mandatory for all devices operating at 9 kHz or higher.', severity: 'High' }
    ]
  };

  return res.json(rules);
});

module.exports = router;
