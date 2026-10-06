import { Router } from 'express';
import { GamificationController } from '../controllers/gamificationController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/achievements', requireAuth, GamificationController.getAchievements);
router.get('/leaderboard', requireAuth, GamificationController.getLeaderboard);
router.get('/streak', requireAuth, GamificationController.getStreakInfo);

export default router;
