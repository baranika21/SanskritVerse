import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', requireAuth, AuthController.getProfile);
router.post('/onboarding', requireAuth, AuthController.updateOnboarding);

export default router;
