import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: 'FaCode',
  },
  tag: {
    type: String,
    default: '',
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  fullDescription: {
    type: String,
  },
  image: {
    type: String,
  },
  features: [{
    type: String
  }],
  technologies: [{
    name: String,
    icon: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  seoTitle: {
    type: String
  },
  seoDescription: {
    type: String
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Service', ServiceSchema);
