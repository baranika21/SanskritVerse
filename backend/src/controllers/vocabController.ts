// ==============================================================================
// SANSKRITVERSE Vocabulary & Spaced Repetition Controller
// ==============================================================================

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../services/db';
import { SpacedRepetitionService } from '../services/spacedRepetition';

export class VocabController {
  public static getAll(req: AuthenticatedRequest, res: Response): void {
    const { category, difficulty, search } = req.query;
    const store = db.getMemoryStore();
    let words = [...store['vocabulary']];

    if (category && category !== 'All') {
      words = words.filter(w => w.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      words = words.filter(w => w.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      words = words.filter(w =>
        w.devanagari.includes(q) ||
        w.iast.toLowerCase().includes(q) ||
        w.english.toLowerCase().includes(q)
      );
    }

    res.json({ count: words.length, words });
  }

  public static getCategories(req: AuthenticatedRequest, res: Response): void {
    const store = db.getMemoryStore();
    const categories = Array.from(new Set(store['vocabulary'].map(w => w.category)));
    res.json({ categories: ['All', ...categories] });
  }

  public static getSavedWords(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const userSaved = store['saved_words'].filter(sw => sw.userId === userId);

    const fullItems = userSaved.map(sw => {
      const word = store['vocabulary'].find(w => w.id === sw.wordId);
      return {
        ...sw,
        word
      };
    }).filter(item => item.word);

    res.json({ count: fullItems.length, savedWords: fullItems });
  }

  public static saveWord(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const { wordId } = req.body;

    if (!wordId) {
      res.status(400).json({ error: 'wordId is required.' });
      return;
    }

    const store = db.getMemoryStore();
    const existing = store['saved_words'].find(sw => sw.userId === userId && sw.wordId === wordId);

    if (existing) {
      res.json({ message: 'Word already saved in your SRS library.', item: existing });
      return;
    }

    const newItem = {
      id: store['saved_words'].length + 1,
      userId,
      wordId,
      srsStage: 0,
      easeFactor: 2.50,
      intervalDays: 1,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: null,
      nextReview: new Date()
    };

    store['saved_words'].push(newItem);

    // Award XP for saving new word
    const user = store['users'].find(u => u.id === userId);
    if (user) user.xp += 10;

    res.status(201).json({ message: 'Word successfully added to Sanskrit Library.', item: newItem });
  }

  public static reviewWord(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const { wordId, grade } = req.body; // grade: 0 to 5

    if (!wordId || grade === undefined) {
      res.status(400).json({ error: 'wordId and grade (0-5) are required.' });
      return;
    }

    const store = db.getMemoryStore();
    let saved = store['saved_words'].find(sw => sw.userId === userId && sw.wordId === wordId);

    if (!saved) {
      // Auto-create saved word if reviewing for the first time
      saved = {
        id: store['saved_words'].length + 1,
        userId,
        wordId,
        srsStage: 0,
        easeFactor: 2.50,
        intervalDays: 1,
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: null,
        nextReview: new Date()
      };
      store['saved_words'].push(saved);
    }

    const calculation = SpacedRepetitionService.calculateNextReview(
      saved.srsStage,
      saved.easeFactor,
      saved.intervalDays,
      Number(grade)
    );

    saved.srsStage = calculation.srsStage;
    saved.easeFactor = calculation.easeFactor;
    saved.intervalDays = calculation.intervalDays;
    saved.nextReview = calculation.nextReview;
    saved.lastReviewed = new Date();

    if (calculation.isCorrect) {
      saved.correctCount += 1;
    } else {
      saved.incorrectCount += 1;
    }

    // Award XP
    const user = store['users'].find(u => u.id === userId);
    if (user) {
      user.xp += calculation.isCorrect ? 15 : 5;
    }

    res.json({
      message: calculation.isCorrect ? 'Great recall! Review interval extended.' : 'Marked for earlier review.',
      calculation,
      item: saved
    });
  }
}
