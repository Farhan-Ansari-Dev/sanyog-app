const router = require('express').Router();

const { SERVICE_CATALOG } = require('../services/serviceCatalog');

router.get('/services', async (req, res) => {
  const groups = (SERVICE_CATALOG || []).map((g) => ({
    groupName: g.name,
    services: g.services,
  }));
  return res.json({ groups });
});

module.exports = router;
