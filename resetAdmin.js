import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const resetAdmin = async () => {
  const newEmail = 'admin@zynexta.com';
  const newPassword = 'admin_reset_2024'; // User should change this after login

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and update or create admin
    let admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      admin.email = newEmail;
      admin.password = newPassword; // Will be hashed by pre-save hook
      await admin.save();
      console.log(`✅ Admin updated: ${newEmail} / ${newPassword}`);
    } else {
      admin = new User({
        username: 'admin',
        email: newEmail,
        password: newPassword,
        role: 'admin'
      });
      await admin.save();
      console.log(`✅ New Admin created: ${newEmail} / ${newPassword}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
};

resetAdmin();
