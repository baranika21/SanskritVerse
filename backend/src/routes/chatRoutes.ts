import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/message', requireAuth, ChatController.sendMessage);
router.get('/history', requireAuth, ChatController.getHistory);

export default router;
