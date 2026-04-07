const router = require('express').Router();
const { z } = require('zod');
const { adminAuth } = require('../middleware/auth');
const Service = require('../models/Service');

// Create a new service
router.post('/', adminAuth, async (req, res) => {
  try {
    const schema = z.object({
      category: z.string().min(1),
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      isActive: z.boolean().optional(),
    });
    
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

    const existing = await Service.findOne({ slug: parsed.data.slug });
    if (existing) {
       return res.status(400).json({ error: 'Service with this slug already exists' });
    }

    const service = await Service.create(parsed.data);
    res.json({ ok: true, service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a service
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const schema = z.object({
      category: z.string().min(1).optional(),
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      isActive: z.boolean().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

    const service = await Service.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    res.json({ ok: true, service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a service
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
