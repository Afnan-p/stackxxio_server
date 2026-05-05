import express from 'express';
import { submitInquiry, getInquiries, deleteInquiry } from '../controllers/inquiryController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public route to submit an inquiry
router.post('/', submitInquiry);

// Private routes for admin
router.get('/', auth, getInquiries);
router.delete('/:id', auth, deleteInquiry);

export default router;
