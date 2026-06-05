import express from 'express';
import Stat from '../models/Stat.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all stats
router.get('/', async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new stat
router.post('/', auth, async (req, res) => {
  try {
    const { number, label, order } = req.body;
    if (!number || !label) {
      return res.status(400).json({ message: 'Number and label are required' });
    }
    const stat = new Stat({ number, label, order });
    const savedStat = await stat.save();
    res.status(201).json(savedStat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a stat
router.put('/:id', auth, async (req, res) => {
  try {
    const { number, label, order } = req.body;
    const stat = await Stat.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    
    if (number !== undefined) stat.number = number;
    if (label !== undefined) stat.label = label;
    if (order !== undefined) stat.order = order;
    
    const updatedStat = await stat.save();
    res.json(updatedStat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a stat
router.delete('/:id', auth, async (req, res) => {
  try {
    const stat = await Stat.findByIdAndDelete(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    res.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
