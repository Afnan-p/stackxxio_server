import express from 'express';
import { getTech, addTech, updateTech, deleteTech } from '../controllers/technologyController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTech);
router.post('/', auth, addTech);
router.put('/:id', auth, updateTech);
router.delete('/:id', auth, deleteTech);

export default router;
