const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

async function seedAdminFromEnv() {
  const email = (process.env.ADMIN_SEED_EMAIL || '').trim().toLowerCase();
  const password = (process.env.ADMIN_SEED_PASSWORD || '').trim();
  const name = (process.env.ADMIN_SEED_NAME || '').trim();
  const role = (process.env.ADMIN_SEED_ROLE || 'admin').trim();

  if (!email || !password || !name) {
    return;
  }

  const exists = await AdminUser.findOne({ email });
  if (exists) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({ email, name, passwordHash, role, isActive: true });
  console.log(`[adminSeed] created admin user: ${email} (${role})`);
}

module.exports = { seedAdminFromEnv };
