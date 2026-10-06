// ==============================================================================
// SANSKRITVERSE Express Application Configuration
// ==============================================================================

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import linguisticsRoutes from './routes/linguisticsRoutes';
import chatRoutes from './routes/chatRoutes';
import vocabRoutes from './routes/vocabRoutes';
import grammarRoutes from './routes/grammarRoutes';
import lessonRoutes from './routes/lessonRoutes';
import quizRoutes from './routes/quizRoutes';
import gamificationRoutes from './routes/gamificationRoutes';
import progressRoutes from './routes/progressRoutes';
import audioRoutes from './routes/audioRoutes';
import searchRoutes from './routes/searchRoutes';

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SanskritVerse AI Lab',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/linguistics', linguisticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/vocabulary', vocabRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/search', searchRoutes);

import path from 'path';
import fs from 'fs';

// Serve compiled frontend in standalone / production mode
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred in SanskritVerse engine.',
    status: 'error'
  });
});

export default app;
