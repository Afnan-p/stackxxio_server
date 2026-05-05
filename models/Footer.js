import mongoose from 'mongoose';

const FooterSchema = new mongoose.Schema({
  logoText: {
    type: String,
    default: 'STACKXXIO.',
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
    default: '© 2025 STACKXXIO STUDIO. ALL RIGHTS RESERVED.',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Footer', FooterSchema);
