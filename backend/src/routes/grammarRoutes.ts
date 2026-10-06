import { Router } from 'express';
import { GrammarController } from '../controllers/grammarController';

const router = Router();

router.get('/topics', GrammarController.getTopics);
router.get('/vibhaktis', GrammarController.getVibhaktis);
router.get('/declensions', GrammarController.getDeclensionTable);

export default router;
