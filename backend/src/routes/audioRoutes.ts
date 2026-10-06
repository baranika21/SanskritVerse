import { Router } from 'express';
import { AudioController } from '../controllers/audioController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/pronunciation-evaluate', requireAuth, AudioController.evaluatePronunciation);
router.get('/alphabet', AudioController.getAlphabet);

export default router;
