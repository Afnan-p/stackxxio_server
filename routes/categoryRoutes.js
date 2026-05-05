import express from 'express';
import { auth } from '../middleware/auth.js';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', auth, createCategory);
router.delete('/:id', auth, deleteCategory);

export default router;
