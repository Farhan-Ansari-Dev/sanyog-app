// Reset password for the main admin account
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const email = 'sanyogconformity1@gmail.com';
  const newPassword = 'Sanyog@2025';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  const result = await User.findOneAndUpdate(
    { email },
    { $set: { passwordHash, isVerified: true } },
    { new: true }
  );

  if (result) {
    console.log(`✅ Password reset for: ${result.email}`);
    console.log(`   Name: ${result.name}`);
    console.log(`   New Password: ${newPassword}`);
  } else {
    console.log(`❌ User not found: ${email}`);
    // List all users
    const all = await User.find({}).select('email name isVerified');
    console.log('All users:', all);
  }

  await mongoose.disconnect();
  console.log('Done.');
})();
