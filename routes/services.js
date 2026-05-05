import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getServices,
  addService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';

const router = express.Router();

// Public Routes
router.get('/', getServices);

// Admin Routes (Protected)
router.post('/', auth, addService);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);

export default router;
