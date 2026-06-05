import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Stat = mongoose.model('Stat', statSchema);

export default Stat;
