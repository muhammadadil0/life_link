const User = require('../models/User');
const { isDbConnected } = require('./db');

const seedDatabase = async () => {
  if (!isDbConnected()) return;

  try {
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      await User.create({
        userType: 'admin',
        name: 'System Administrator',
        email: 'admin@gmail.com',
        password: 'admin',
        phone: '03494996898',
        age: 35,
        bloodGroup: 'O+',
        address: 'Central Directorate, Shergarh, Mardan',
        city: 'Mardan'
      });
      console.log('✅ Admin initialized.');
    }
  } catch (err) {
    console.error('Error during initial admin check:', err.message);
  }
};

module.exports = { seedDatabase };
