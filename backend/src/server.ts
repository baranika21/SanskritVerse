// ==============================================================================
// SANSKRITVERSE HTTP Server Entry Point
// ==============================================================================

import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  =============================================================
    🕉️  SANSKRITVERSE BACKEND SERVER RUNNING
    📡  Port: http://localhost:${PORT}
    🔬  Computational Linguistics Engine: Active
    🤖  Acharya AI Tutor Engine: Active
    📚  Sanskrit Relational Database: Ready
  =============================================================
  `);
});
