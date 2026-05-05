import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  videoUrl: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String, // Cover image for video projects
    default: ''
  },
  mediaUrl: {
    type: String, // Uploaded file path
    default: ''
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);