import { Router } from 'express';
import { VocabController } from '../controllers/vocabController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, VocabController.getAll);
router.get('/categories', requireAuth, VocabController.getCategories);
router.get('/saved', requireAuth, VocabController.getSavedWords);
router.post('/save', requireAuth, VocabController.saveWord);
router.post('/review', requireAuth, VocabController.reviewWord);

export default router;
