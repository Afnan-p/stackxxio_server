import express from 'express';
import { auth } from '../middleware/auth.js';
import { getFooter, updateFooter } from '../controllers/footerController.js';

const router = express.Router();

// Public Routes
router.get('/', getFooter);

// Admin Routes (Protected)
router.put('/', auth, updateFooter);

export default router;
