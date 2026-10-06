import { Router } from 'express';
import { ProgressController } from '../controllers/progressController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/dashboard', requireAuth, ProgressController.getDashboard);
router.get('/mistakes', requireAuth, ProgressController.getMistakeAnalysis);
router.get('/path', requireAuth, ProgressController.getLearningPath);

export default router;
