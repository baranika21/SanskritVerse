// ==============================================================================
// SANSKRITVERSE Chat Controller (Acharya AI)
// ==============================================================================

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AiTutorService, ChatMode } from '../services/aiTutor';
import { db } from '../services/db';

export class ChatController {
  public static async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 1;
      const { message, mode = 'tutor', history = [] } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'A valid message string is required.' });
        return;
      }

      const store = db.getMemoryStore();
      const user = store['users'].find(u => u.id === userId);
      const userLevel = user?.sanskrit_level || 'Intermediate';

      const response = await AiTutorService.generateResponse(
        message,
        mode as ChatMode,
        userLevel,
        history
      );

      // Record in chat history
      store['chatbot_history'].push({
        id: store['chatbot_history'].length + 1,
        user_id: userId,
        mode,
        user_message: message,
        assistant_message: response.message,
        sanskrit_gloss: response.sanskritGloss,
        created_at: new Date()
      });

      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to process message with Acharya AI.' });
    }
  }

  public static getHistory(req: AuthenticatedRequest, res: Response): void {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const userHistory = store['chatbot_history'].filter(h => h.user_id === userId);

    res.json({
      count: userHistory.length,
      history: userHistory.slice(-20) // recent 20 messages
    });
  }
}
