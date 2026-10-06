// ==============================================================================
// SANSKRITVERSE Progress & Mistake Analysis Controller
// ==============================================================================

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../services/db';

export class ProgressController {
  public static getDashboard(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const user = store['users'].find(u => u.id === userId) || store['users'][0];

    const totalWords = store['vocabulary']?.length || 14;
    const userSavedWords = (store['saved_words'] || []).filter(sw => sw.userId === user.id);
    const savedWordsCount = userSavedWords.length;
    const vocabMasteredPercent = Math.min(100, Math.round((savedWordsCount / Math.max(1, totalWords)) * 100));

    const totalLessons = store['lessons']?.length || 7;
    const completedLessons = (store['lessons'] || []).filter(l => l.status === 'completed').length;
    const overallProgressPercent = Math.min(100, Math.round((completedLessons / Math.max(1, totalLessons)) * 100));

    // Grammar topics completed
    const totalGrammar = store['grammar_topics']?.length || 4;
    const completedGrammar = (store['grammar_topics'] || []).filter(g => g.completed).length;
    const grammarMasteredPercent = Math.min(100, Math.round((completedGrammar / Math.max(1, totalGrammar)) * 100));

    // Quiz Accuracy
    const quizAttempts = store['quiz_attempts'] || [];
    const userAttempts = quizAttempts.filter((qa: any) => qa.userId === user.id);
    let quizAccuracyPercent = 0;
    if (userAttempts.length > 0) {
      const totalCorrect = userAttempts.reduce((sum: number, a: any) => sum + (a.isCorrect ? 1 : 0), 0);
      quizAccuracyPercent = Math.round((totalCorrect / userAttempts.length) * 100);
    }

    // Daily Goal progress
    const dailyChallengeDone = (store['daily_challenges'] || []).some(dc => dc.completed);
    const completedTodayCount = completedLessons + (dailyChallengeDone ? 1 : 0);
    const dailyGoalProgressPercent = Math.min(100, Math.round((completedTodayCount / Math.max(1, 2)) * 100));

    // First uncompleted lesson
    const currentLesson = (store['lessons'] || []).find(l => l.status !== 'completed') || store['lessons'][0];

    res.json({
      user: {
        id: user.id,
        username: user.username,
        level: user.current_level,
        xp: user.xp,
        streakDays: user.streak_days,
        dailyGoalMins: user.daily_goal_mins,
        dailyGoalProgressPercent,
        sanskritLevel: user.sanskrit_level
      },
      stats: {
        wordsMasteredCount: savedWordsCount,
        totalVocabularyCount: totalWords,
        vocabMasteredPercent,
        grammarMasteredPercent,
        grammarCompletedCount: completedGrammar,
        readingMasteredPercent: Math.min(100, completedLessons * 15),
        pronunciationMasteredPercent: Math.min(100, completedLessons * 12),
        conversationMasteredPercent: Math.min(100, completedLessons * 10),
        overallProgressPercent,
        quizAccuracyPercent,
        timeSpentMinutes: completedLessons * 15
      },
      currentLesson: {
        id: currentLesson.id,
        title: currentLesson.title,
        titleSanskrit: currentLesson.title_sanskrit,
        level: currentLesson.level,
        category: currentLesson.category,
        description: currentLesson.description,
        xp_reward: currentLesson.xp_reward,
        estimated_minutes: currentLesson.estimated_minutes
      }
    });
  }

  public static getMistakeAnalysis(req: AuthenticatedRequest, res: Response): void {
    const mistakes = [
      {
        id: 1,
        topic: 'Noun Cases (विभक्तयः)',
        confusedElements: ['रामः (Prathamā)', 'रामम् (Dvitīyā)', 'रामेण (Tṛtīyā)'],
        diagnosis: 'Frequently confusing subject (nominative), destination/object (accusative), and instrument (tṛtīyā).',
        recommendedPractice: 'Practice: Sanskrit Cases (सुबन्त-प्रकरणम्)',
        actionUrl: '/grammar'
      },
      {
        id: 2,
        topic: 'Verbal Agreement (तिङन्ताः)',
        confusedElements: ['पठामि (1st Person Sg)', 'पठति (3rd Person Sg)'],
        diagnosis: 'Mixing 1st person उत्तमपुरुष (अहं पठामि) with 3rd person प्रथमपुरुष (सः पठति).',
        recommendedPractice: 'Practice: Present Tense Verb Endings',
        actionUrl: '/practice'
      }
    ];

    res.json({ mistakes });
  }

  public static getLearningPath(req: AuthenticatedRequest, res: Response): void {
    const path = [
      { step: 1, title: 'Devanagari Alphabet Basics', titleSanskrit: 'वर्णामाला-प्रवेशः', status: 'completed' },
      { step: 2, title: 'Basic Vocabulary & Greetings', titleSanskrit: 'मूलशब्दाः शिष्टाचारश्च', status: 'completed' },
      { step: 3, title: 'Nominative Case (Prathamā / Kartā)', titleSanskrit: 'प्रथमा विभक्तिः', status: 'completed' },
      { step: 4, title: 'Accusative Case (Dvitīyā / Karma)', titleSanskrit: 'द्वितीया विभक्तिः', status: 'current' },
      { step: 5, title: 'Present Tense Verbs (Laṭ Lakāra)', titleSanskrit: 'लट् लकारः', status: 'locked' },
      { step: 6, title: 'Sentence Construction & Kāraka', titleSanskrit: 'वाक्य-रचना कारकं च', status: 'locked' },
      { step: 7, title: 'Conversational Dialogue Practice', titleSanskrit: 'सम्भाषण-अभ्यासः', status: 'locked' }
    ];

    res.json({ path });
  }
}
