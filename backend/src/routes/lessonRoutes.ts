import { Router } from 'express';
import { LessonController } from '../controllers/lessonController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, LessonController.getAll);
router.get('/:id', requireAuth, LessonController.getById);
router.post('/:id/complete', requireAuth, LessonController.completeLesson);

export default router;
