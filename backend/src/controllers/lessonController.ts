// ==============================================================================
// SANSKRITVERSE Lesson Controller
// ==============================================================================

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../services/db';

export class LessonController {
  public static getAll(req: AuthenticatedRequest, res: Response): void {
    const store = db.getMemoryStore();
    const lessons = store['lessons'];
    res.json({ count: lessons.length, lessons });
  }

  public static getById(req: AuthenticatedRequest, res: Response): void {
    const { id } = req.params;
    const store = db.getMemoryStore();
    const lesson = store['lessons'].find(l => l.id === Number(id));

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found.' });
      return;
    }

    res.json(lesson);
  }

  public static completeLesson(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const { id } = req.params;
    const store = db.getMemoryStore();

    const lesson = store['lessons'].find(l => l.id === Number(id));
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found.' });
      return;
    }

    lesson.status = 'completed';

    // Automatically transition next lesson to in_progress if not_started
    const nextLesson = store['lessons'].find(l => l.order_num === lesson.order_num + 1);
    if (nextLesson && nextLesson.status === 'not_started') {
      nextLesson.status = 'in_progress';
    }

    const user = store['users'].find(u => u.id === userId);
    let xpAwarded = lesson.xp_reward || 50;
    let leveledUp = false;

    if (user) {
      user.xp += xpAwarded;
      const newLevel = Math.min(6, Math.floor(user.xp / 1000) + 1);
      if (newLevel > user.current_level) {
        user.current_level = newLevel;
        leveledUp = true;
      }
    }

    res.json({
      message: `Lesson "${lesson.title}" completed!`,
      xpEarned: xpAwarded,
      currentXp: user?.xp,
      currentLevel: user?.current_level,
      leveledUp
    });
  }
}
