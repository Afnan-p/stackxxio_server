import Technology from '../models/Technology.js';

// @desc    Get all technologies
// @route   GET /api/tech
// @access  Public
export const getTech = async (req, res) => {
  try {
    const tech = await Technology.find().sort({ order: 1 });
    res.json(tech);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add new technology
// @route   POST /api/tech
// @access  Private/Admin
export const addTech = async (req, res) => {
  try {
    const { name, icon, order } = req.body;
    const tech = await Technology.create({ name, icon, order });
    res.status(201).json(tech);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update technology
// @route   PUT /api/tech/:id
// @access  Private/Admin
export const updateTech = async (req, res) => {
  try {
    const tech = await Technology.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tech) return res.status(404).json({ message: 'Technology not found' });
    res.json(tech);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete technology
// @route   DELETE /api/tech/:id
// @access  Private/Admin
export const deleteTech = async (req, res) => {
  try {
    const tech = await Technology.findByIdAndDelete(req.params.id);
    if (!tech) return res.status(404).json({ message: 'Technology not found' });
    res.json({ message: 'Technology liquidated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
