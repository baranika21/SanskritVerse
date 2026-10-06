// ==============================================================================
// SANSKRITVERSE Authentication & Authorization Middleware
// ==============================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'sanskritverse_sacred_jwt_secret_2026';

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For demo convenience, attach default demo user if no token is provided
    req.user = { id: 1, username: 'vidyarthi', email: 'student@sanskritverse.io' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };
    next();
  } catch (err) {
    // Graceful fallback to demo user in dev
    req.user = { id: 1, username: 'vidyarthi', email: 'student@sanskritverse.io' };
    next();
  }
};
