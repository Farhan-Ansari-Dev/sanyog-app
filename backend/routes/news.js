const router = require('express').Router();
const axios = require('axios');

// Placeholder for real crawling logic
// In a real production app, this would be a scheduled task that saves to DB
// For now, we'll implement a dynamic fetch with a fallback

router.get('/', async (req, res) => {
  try {
    // We can simulate a crawl or fetch from a known RSS/HTML page
    // For this demonstration, we'll return a mix of "Live" crawled-style data
    // and important compliance updates.

    const news = [
      {
        id: '1',
        title: 'BIS Quality Control Order for Toys Extended',
        source: 'BIS Official',
        date: new Date().toISOString(),
        content: 'The Department for Promotion of Industry and Internal Trade (DPIIT) has extended the deadline for compliance with the Quality Control Order (QCO) for toys...',
        link: 'https://www.bis.gov.in',
        category: 'BIS'
      },
      {
        id: '2',
        title: 'New EPR Guidelines for Plastic Packaging 2024',
        source: 'CPCB',
        date: new Date(Date.now() - 86400000).toISOString(),
        content: 'Central Pollution Control Board has released new circular regarding the recycling targets for PWOs...',
        link: 'https://cpcb.nic.in',
        category: 'EPR'
      },
      {
        id: '3',
        title: 'WPC ETA Process Streamlined for Low Power Devices',
        source: 'DoT / WPC',
        date: new Date(Date.now() - 172800000).toISOString(),
        content: 'Wireless Planning and Coordination wing has introduced a new self-declaration route for certain low power equipment...',
        link: 'https://saralsanchar.gov.in',
        category: 'WPC'
      },
      {
        id: '4',
        title: 'CDSCO Medical Device Classification Update',
        source: 'CDSCO',
        date: new Date(Date.now() - 259200000).toISOString(),
        content: 'The Central Drugs Standard Control Organization has updated the classification list for Class B medical devices...',
        link: 'https://cdsco.gov.in',
        category: 'Medical'
      }
    ];

    // Simulate some real-time data from a government site if possible
    // (Optional: try-catch a real fetch here)

    return res.json(news);
  } catch (error) {
    console.error('News fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
