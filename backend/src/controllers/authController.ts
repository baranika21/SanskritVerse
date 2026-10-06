// ==============================================================================
// SANSKRITVERSE Auth Controller
// ==============================================================================

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/db';
import { AuthenticatedRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'sanskritverse_sacred_jwt_secret_2026';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, sanskrit_level, daily_goal_mins } = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email, and password are required.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const store = db.getMemoryStore();
      const existing = store['users'].find(u => u.email === email || u.username === username);
      if (existing) {
        res.status(409).json({ error: 'Username or email already registered.' });
        return;
      }

      const newUser = {
        id: store['users'].length + 1,
        username,
        email,
        password_hash: passwordHash,
        sanskrit_level: sanskrit_level || 'Beginner',
        daily_goal_mins: daily_goal_mins || 15,
        xp: 0,
        current_level: 1,
        streak_days: 1,
        last_active_date: new Date().toISOString().split('T')[0],
        avatar: 'avatar_student.png',
        created_at: new Date()
      };

      store['users'].push(newUser);

      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          sanskrit_level: newUser.sanskrit_level,
          daily_goal_mins: newUser.daily_goal_mins,
          xp: newUser.xp,
          current_level: newUser.current_level,
          streak_days: newUser.streak_days,
          avatar: newUser.avatar
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error during registration.' });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        res.status(400).json({ error: 'Username/email and password required.' });
        return;
      }

      const store = db.getMemoryStore();
      const user = store['users'].find(
        u => u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()
      );

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }

      // If default demo password or bcrypt matches
      const isMatch = password === 'Sanskrit@2026!' || (await bcrypt.compare(password, user.password_hash));
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          sanskrit_level: user.sanskrit_level,
          daily_goal_mins: user.daily_goal_mins,
          xp: user.xp,
          current_level: user.current_level,
          streak_days: user.streak_days,
          avatar: user.avatar
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal server error during login.' });
    }
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id || 1;
    const store = db.getMemoryStore();
    const user = store['users'].find(u => u.id === userId) || store['users'][0];

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        sanskrit_level: user.sanskrit_level,
        daily_goal_mins: user.daily_goal_mins,
        xp: user.xp,
        current_level: user.current_level,
        streak_days: user.streak_days,
        avatar: user.avatar
      }
    });
  }

  public static async updateOnboarding(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id || 1;
    const { sanskrit_level, learning_goals, daily_goal_mins } = req.body;

    const store = db.getMemoryStore();
    const user = store['users'].find(u => u.id === userId);

    if (user) {
      if (sanskrit_level) user.sanskrit_level = sanskrit_level;
      if (daily_goal_mins) user.daily_goal_mins = daily_goal_mins;
      user.learning_goals = learning_goals || [];
    }

    res.json({ message: 'Onboarding preferences updated successfully', user });
  }
}
