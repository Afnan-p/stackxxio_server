import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  videoUrl: {
    type: String,
    default: null
  },
  thumbnail: {
    type: String, // Cover image for video projects
    default: null
  },
  mediaUrl: {
    type: String, // Uploaded file path
    default: null
  },
  images: {
    type: [String],
    default: []
  },
  techStack: {
    type: [String],
    default: []
  },
  liveLink: {
    type: String,
    default: null
  },
  githubLink: {
    type: String,
    default: null
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, { timestamps: true });

// Add indexes for optimization
projectSchema.index({ category: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ type: 1 });
projectSchema.index({ title: 1 });

export default mongoose.model('Project', projectSchema);