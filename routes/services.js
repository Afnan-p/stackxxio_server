import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getServices,
  getServiceBySlug,
  addService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zynexta/services',
    allowed_formats: ['jpg', 'png', 'webp'],
  }
});

const upload = multer({ storage });

// Public Routes
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

// Admin Routes (Protected)
router.post('/', auth, upload.single('image'), addService);
router.put('/:id', auth, upload.single('image'), updateService);
router.delete('/:id', auth, deleteService);

export default router;
