import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('SanskritVerse API Endpoints', () => {
  it('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/auth/login succeeds with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      identifier: 'vidyarthi',
      password: 'Sanskrit@2026!'
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('vidyarthi');
  });

  it('GET /api/vocabulary returns vocabulary list', async () => {
    const res = await request(app).get('/api/vocabulary');
    expect(res.status).toBe(200);
    expect(res.body.words.length).toBeGreaterThan(0);
    expect(res.body.words[0]).toHaveProperty('devanagari');
  });

  it('GET /api/grammar/vibhaktis returns all 8 cases', async () => {
    const res = await request(app).get('/api/grammar/vibhaktis');
    expect(res.status).toBe(200);
    expect(res.body.vibhaktis.length).toBe(8);
    expect(res.body.vibhaktis[0].sanskrit).toBe('प्रथमा');
  });

  it('POST /api/chat/message returns Acharya AI response and Sanskrit gloss', async () => {
    const res = await request(app).post('/api/chat/message').send({
      message: 'How do I say "I am learning Sanskrit"?',
      mode: 'tutor'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('अहं संस्कृतं पठामि');
    expect(res.body.sanskritGloss.length).toBeGreaterThan(0);
  });

  it('POST /api/linguistics/transliterate converts scripts', async () => {
    const res = await request(app).post('/api/linguistics/transliterate').send({
      text: 'नमस्ते',
      from: 'devanagari',
      to: 'iast'
    });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('namaste');
  });
});
