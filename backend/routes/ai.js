const router = require('express').Router();
const { auth } = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cache');

// Helper to sanitize message for cache key
const getAiCacheKey = (req) => {
  if (!req.body.message) return 'cache:ai:empty';
  const cleanStr = req.body.message.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  return `cache:ai:msg:${cleanStr}`;
};

// Mock AI Chat Endpoint with Semantic Caching
// In a real scenario, this would call the OpenAI API
router.post('/chat', auth, cacheMiddleware('', 86400, getAiCacheKey), async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let reply = "I am Sanyog Intelligence. How can I assist you with your compliance and regulatory needs today?";
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('bis') || lowerMessage.includes('crs')) {
      reply = "For BIS CRS certification, you will need to prepare a Technical File including the BOM, Schematics, and Brand Authorization. The typical timeline is 30-45 days. Would you like me to start an application for you?";
    } else if (lowerMessage.includes('status') || lowerMessage.includes('where is')) {
      reply = "I see you have an active Ocean Freight shipment (MSCU1234567) arriving today. It is currently at 'Clearance Pending' due to a missing BIS certificate. Please check the Shipments Hub.";
    } else if (lowerMessage.includes('epr')) {
      reply = "EPR (Extended Producer Responsibility) requires you to submit an E-Waste Action Plan to the CPCB. It's mandatory for electronics importers. I can guide you through the document checklist.";
    }

    return res.json({
      role: 'assistant',
      content: reply,
      timestamp: new Date()
    });

  } catch (err) {
    console.error('[AI Chat Error]:', err);
    res.status(500).json({ error: 'AI engine failed to respond' });
  }
});

module.exports = router;
