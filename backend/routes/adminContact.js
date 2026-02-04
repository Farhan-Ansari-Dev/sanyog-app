const router = require('express').Router();
const { z } = require('zod');

const ContactRequest = require('../models/ContactRequest');
const { adminAuth, requireRole } = require('../middleware/adminAuth');

router.get('/', adminAuth, requireRole(['admin', 'ops', 'viewer']), async (req, res) => {
  const items = await ContactRequest.find({}).sort({ createdAt: -1 });
  return res.json(items);
});

router.patch('/:id', adminAuth, requireRole(['admin', 'ops']), async (req, res) => {
  const schema = z.object({ status: z.string().min(2).optional() });
  const parsed = schema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const updated = await ContactRequest.findByIdAndUpdate(
    req.params.id,
    { $set: parsed.data },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Not found' });
  return res.json(updated);
});

module.exports = router;
