// ==============================================================================
// SANSKRITVERSE Gamification Controller
// Badges, Achievements, Streaks, and Global Leaderboard
// ==============================================================================

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../services/db';

export class GamificationController {
  public static getAchievements(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const user = store['users'].find(u => u.id === userId) || store['users'][0];
    const savedWordsCount = (store['saved_words'] || []).filter(sw => sw.userId === user.id).length;
    const completedGrammarCount = (store['grammar_topics'] || []).filter(g => g.completed).length;

    const computed = (store['achievements'] || []).map(ach => {
      let isUnlocked = false;
      if (ach.badge_code === 'FIRST_WORD' && (user.xp >= 10 || savedWordsCount >= 1)) isUnlocked = true;
      if (ach.badge_code === 'SEVEN_DAY_STREAK' && user.streak_days >= 7) isUnlocked = true;
      if (ach.badge_code === 'CENTURY_WORDS' && savedWordsCount >= 100) isUnlocked = true;
      if (ach.badge_code === 'GRAMMAR_MASTER' && completedGrammarCount >= 4) isUnlocked = true;
      if (ach.badge_code === 'PRONUNCIATION_PRO' && user.xp >= 150) isUnlocked = true;
      if (ach.badge_code === 'QUIZ_CHAMPION' && user.xp >= 300) isUnlocked = true;

      return {
        ...ach,
        unlocked: isUnlocked
      };
    });

    res.json({ achievements: computed });
  }

  public static getLeaderboard(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const activeUser = store['users'].find(u => u.id === userId) || store['users'][0];

    // Build fresh leaderboard including current user
    const baseList = (store['leaderboard'] || []).filter(item => !item.username.toLowerCase().includes(activeUser.username.toLowerCase()) && !item.username.includes('(You)'));
    
    const userEntry = {
      id: activeUser.id,
      username: `${activeUser.username} (You)`,
      avatar: activeUser.avatar || 'avatar_student.png',
      level: activeUser.current_level,
      total_xp: activeUser.xp,
      streak: activeUser.streak_days
    };

    const combined = [...baseList, userEntry];
    const sorted = combined.sort((a, b) => b.total_xp - a.total_xp).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    res.json({ leaderboard: sorted });
  }

  public static getStreakInfo(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const user = store['users'].find(u => u.id === userId) || store['users'][0];

    const weeklyActivity = [
      { day: 'Mon', xp: user.xp > 0 ? Math.round(user.xp * 0.2) : 0, completed: user.streak_days >= 1 },
      { day: 'Tue', xp: user.xp > 50 ? Math.round(user.xp * 0.2) : 0, completed: user.streak_days >= 2 },
      { day: 'Wed', xp: user.xp > 100 ? Math.round(user.xp * 0.2) : 0, completed: user.streak_days >= 3 },
      { day: 'Thu', xp: user.xp > 150 ? Math.round(user.xp * 0.2) : 0, completed: user.streak_days >= 4 },
      { day: 'Fri', xp: user.xp > 200 ? Math.round(user.xp * 0.2) : 0, completed: user.streak_days >= 5 },
      { day: 'Sat', xp: user.xp > 250 ? Math.round(user.xp * 0.2) : 0, completed: user.streak_days >= 6 },
      { day: 'Sun', xp: user.xp > 300 ? Math.round(user.xp * 0.2) : 0, completed: user.streak_days >= 7 }
    ];

    res.json({
      streakDays: user?.streak_days || 1,
      lastActive: user?.last_active_date || new Date().toISOString().split('T')[0],
      weeklyActivity,
      streakProtectionActive: true
    });
  }
}
