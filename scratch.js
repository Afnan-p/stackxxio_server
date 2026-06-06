import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const projects = await Project.find({});
  projects.forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`Media: ${p.mediaUrl}`);
    console.log('---');
  });
  process.exit(0);
}
check();
