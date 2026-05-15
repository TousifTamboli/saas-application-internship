import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.post('/', handleChat);

export default router;
