// ==============================================================================
// SANSKRITVERSE Quiz & Daily Challenge Controller
// ==============================================================================

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../services/db';

export class QuizController {
  public static getQuestions(req: AuthenticatedRequest, res: Response): void {
    const { category, difficulty, type } = req.query;
    const store = db.getMemoryStore();
    let questions = [...store['quiz_questions']];

    if (category && category !== 'All') {
      questions = questions.filter(q => q.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      questions = questions.filter(q => q.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
    }

    if (type && type !== 'All') {
      questions = questions.filter(q => q.question_type.toLowerCase() === (type as string).toLowerCase());
    }

    res.json({ count: questions.length, questions });
  }

  public static submitQuiz(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const { answers } = req.body; // Array of { questionId, selectedAnswer }

    if (!Array.isArray(answers)) {
      res.status(400).json({ error: 'Answers must be an array.' });
      return;
    }

    const store = db.getMemoryStore();
    let correctCount = 0;
    let totalXpEarned = 0;
    const detailedResults: any[] = [];

    answers.forEach(a => {
      const q = store['quiz_questions'].find(item => item.id === a.questionId);
      if (q) {
        const isCorrect = String(q.correct_answer).trim() === String(a.selectedAnswer).trim();
        if (isCorrect) {
          correctCount++;
          totalXpEarned += q.xp_value || 20;
        }

        // Record attempt
        if (!store['quiz_attempts']) store['quiz_attempts'] = [];
        store['quiz_attempts'].push({
          userId,
          questionId: q.id,
          selectedAnswer: a.selectedAnswer,
          isCorrect,
          timestamp: new Date()
        });

        detailedResults.push({
          questionId: q.id,
          questionText: q.question_text,
          promptSanskrit: q.prompt_sanskrit,
          selectedAnswer: a.selectedAnswer,
          correctAnswer: q.correct_answer,
          isCorrect,
          explanation: q.explanation
        });
      }
    });

    const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

    const user = store['users'].find(u => u.id === userId);
    let leveledUp = false;
    if (user) {
      user.xp += totalXpEarned;
      const newLevel = Math.min(6, Math.floor(user.xp / 1000) + 1);
      if (newLevel > user.current_level) {
        user.current_level = newLevel;
        leveledUp = true;
      }
    }

    res.json({
      score: correctCount,
      totalQuestions: answers.length,
      accuracyPercentage: accuracy,
      xpEarned: totalXpEarned,
      currentXp: user?.xp,
      currentLevel: user?.current_level,
      leveledUp,
      details: detailedResults
    });
  }

  public static getDailyChallenge(req: AuthenticatedRequest, res: Response): void {
    const store = db.getMemoryStore();
    const challenge = store['daily_challenges'][0];
    res.json(challenge);
  }

  public static completeDailyChallenge(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const challenge = store['daily_challenges'][0];

    challenge.completed = true;

    const user = store['users'].find(u => u.id === userId);
    if (user) {
      user.xp += challenge.xp_reward || 50;
      user.streak_days += 1; // Increment streak
    }

    res.json({
      message: 'Daily Sanskrit Challenge Completed!',
      xpEarned: challenge.xp_reward,
      currentStreak: user?.streak_days,
      currentXp: user?.xp
    });
  }
}
