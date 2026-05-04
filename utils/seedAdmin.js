import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  const adminEmail = 'admin@stackxio.com';
  const adminPassword = 'admin123';

  try {
    let admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('No admin found. Creating default admin...');
      admin = new User({
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log(`✅ Default admin created: ${adminEmail} / ${adminPassword}`);
    } else {
      // Force update password to ensure it's correct
      admin.password = adminPassword;
      await admin.save();
      console.log(`✔ Admin account verified and password synchronized.`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

export default seedAdmin;
