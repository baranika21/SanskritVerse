import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, QuizController.getQuestions);
router.post('/submit', requireAuth, QuizController.submitQuiz);
router.get('/daily-challenge', requireAuth, QuizController.getDailyChallenge);
router.post('/daily-challenge/complete', requireAuth, QuizController.completeDailyChallenge);

export default router;
