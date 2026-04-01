const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);
    if (!payload || payload.type !== 'admin') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  // 'admin' and 'superadmin' are treated equivalently
  const expanded = [...new Set(allowed.flatMap(r => r === 'admin' ? ['admin', 'superadmin'] : [r]))];
  return (req, res, next) => {
    const role = req.admin?.role;
    if (!role || !expanded.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { adminAuth, requireRole };
