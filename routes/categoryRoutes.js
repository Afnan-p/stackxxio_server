import express from 'express';
import { auth } from '../middleware/auth.js';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', auth, createCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router;
