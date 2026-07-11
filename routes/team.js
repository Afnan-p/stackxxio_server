import express from 'express';
import { auth } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/teamController.js';

const router = express.Router();

// Cloudinary Storage Config for Team
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zynexta/team',
    format: 'webp',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  },
});

const upload = multer({ storage: storage });

// Routes
router.get('/', getTeamMembers);
router.post('/', auth, upload.single('image'), addTeamMember);
router.put('/:id', auth, upload.single('image'), updateTeamMember);
router.delete('/:id', auth, deleteTeamMember);

export default router;
