import { Router } from 'express';
import { LinguisticsController } from '../controllers/linguisticsController';

const router = Router();

router.post('/transliterate', LinguisticsController.transliterate);
router.post('/tokenize', LinguisticsController.tokenize);
router.post('/analyze', LinguisticsController.analyzeSentence);
router.post('/morphology', LinguisticsController.analyzeMorphology);
router.post('/sandhi', LinguisticsController.resolveSandhi);
router.get('/dhatu-tree', LinguisticsController.getDhatuTree);
router.post('/chhandas', LinguisticsController.scanChhandas);
router.post('/samasa', LinguisticsController.analyzeSamasa);
router.get('/declensions', LinguisticsController.getDeclensions);
router.get('/sutras', LinguisticsController.getPaniniSutras);
router.get('/stories', LinguisticsController.getStories);
router.get('/subhashitas', LinguisticsController.getSubhashitas);
router.post('/translate', LinguisticsController.translateSentence);

export default router;
