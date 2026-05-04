import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('No admin found. Creating default admin...');
      const admin = new User({
        username: 'admin',
        email: 'admin@stackxio.com',
        password: 'admin123', // This will be hashed by the User model's pre-save hook
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Default admin created: admin@stackxio.com / admin123');
    } else {
      console.log('✔ Admin account verified.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

export default seedAdmin;
