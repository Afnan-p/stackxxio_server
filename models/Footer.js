import mongoose from 'mongoose';

const FooterSchema = new mongoose.Schema({
  email: {
    type: String,
    default: 'zynexta@gmail.com',
  },
  phones: {
    type: [String],
    default: [],
  },
  logoText: {
    type: String,
    default: 'ZYNEXTA.',
  },
  tagline: {
    type: String,
    default: 'LUXURY TECH ARCHITECTURES • EST. 2024',
  },
  twitter: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  instagram: {
    type: String,
    default: '',
  },
  whatsapp: {
    type: String,
    default: '',
  },
  copyright: {
    type: String,
    default: '© 2025 ZYNEXTA STUDIO. ALL RIGHTS RESERVED.',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Footer', FooterSchema);
