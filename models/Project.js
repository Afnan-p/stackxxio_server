import mongoose from 'mongoose';
import { PROJECT_CATEGORIES } from '../utils/constants.js';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  techStack: {
    type: [String],
    required: true,
  },
  liveLink: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  category: {
    type: String,
    enum: PROJECT_CATEGORIES,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);