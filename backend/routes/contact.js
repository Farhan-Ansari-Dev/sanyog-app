const router = require('express').Router();
const { z } = require('zod');

const { auth } = require('../middleware/auth');
const ContactRequest = require('../models/ContactRequest');

// Client: request a callback
router.post('/request', auth, async (req, res) => {
  const schema = z.object({ message: z.string().max(2000).optional() });
  const parsed = schema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const doc = await ContactRequest.create({
    userMobile: req.user.mobile,
    message: parsed.data.message,
  });

  return res.json({ ok: true, requestId: doc._id });
});

module.exports = router;
