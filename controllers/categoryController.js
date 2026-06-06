import Category from '../models/Category.js';
import slugify from 'slugify';

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   POST api/categories
// @desc    Create a category
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const slug = slugify(name, { lower: true });
    
    const category = new Category({ name, slug });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const slug = slugify(name, { lower: true });
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A category with this name already exists.' });
    }
    res.status(500).json({ message: err.message });
  }
};
