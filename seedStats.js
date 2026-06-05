import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stat from './models/Stat.js';

dotenv.config();

const seedStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Clear existing
    await Stat.deleteMany({});

    // Default Stats
    const stats = [
      { number: '13+', label: 'Projects Delivered', order: 1 },
      { number: '20+', label: 'Happy Clients', order: 2 },
      { number: '6+', label: 'Core Services', order: 3 },
      { number: '100%', label: 'Commitment', order: 4 }
    ];

    await Stat.insertMany(stats);
    console.log('Stats seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding stats:', error);
    process.exit(1);
  }
};

seedStats();
