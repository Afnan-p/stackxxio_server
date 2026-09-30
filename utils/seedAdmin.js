import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@zynexta.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    // Find existing admin or user by role or email
    let admin = await User.findOne({ 
      $or: [
        { role: 'admin' }, 
        { role: 'superadmin' }, 
        { email: adminEmail }
      ] 
    });
    
    if (!admin) {
      console.log('No admin found. Creating default admin...');
      admin = new User({
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log(`✅ Admin account created: ${adminEmail}`);
    } else {
      // Synchronize both email and password directly from .env
      admin.email = adminEmail;
      admin.password = adminPassword;
      await admin.save();
      console.log(`✔ Admin account synchronized with .env credentials: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

export default seedAdmin;
