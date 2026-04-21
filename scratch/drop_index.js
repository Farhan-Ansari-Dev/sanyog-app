const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  try {
    const col = mongoose.connection.collection('users');
    // Drop the mobile_1 unique index
    await col.dropIndex('mobile_1');
    console.log('Successfully dropped unique index on mobile');
  } catch (err) {
    if (err.codeName === 'IndexNotFound') {
        console.log('Index mobile_1 not found, skipping');
    } else {
        console.error('Error dropping index:', err);
    }
  }
  
  await mongoose.disconnect();
}
run();
