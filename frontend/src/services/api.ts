// ==============================================================================
// SANSKRITVERSE Frontend API Client
// ==============================================================================

import {
  UserProfile,
  VocabularyWord,
  SentenceAnalysis,
  SandhiResult,
  QuizQuestion,
  Achievement,
  LeaderboardUser
} from '../types';

const API_BASE = '/api';

export class ApiService {
  private static getHeaders() {
    const token = localStorage.getItem('sanskritverse_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // Auth & Profile
  public static async login(identifier: string, password: string): Promise<{ message: string; token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return await res.json();
  }

  public static async register(data: {
    username: string;
    email: string;
    password?: string;
    sanskrit_level?: string;
    daily_goal_mins?: number;
  }): Promise<{ message: string; token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return await res.json();
  }

  public static async getProfile(): Promise<{ user: UserProfile }> {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to load profile');
      return await res.json();
    } catch {
      // Fallback to local profile
      const activeUser = localStorage.getItem('sanskritverse_active_user') || 'Vidyarthi';
      const key = `sanskritverse_profile_${activeUser.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          return { user: JSON.parse(saved) };
        } catch {}
      }
      return {
        user: {
          id: Date.now(),
          username: activeUser,
          email: `${activeUser.toLowerCase()}@sanskritverse.io`,
          sanskrit_level: 'Beginner',
          daily_goal_mins: 15,
          xp: 0,
          current_level: 1,
          streak_days: 1,
          avatar: 'avatar_student.png'
        }
      };
    }
  }

  public static async updateOnboarding(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/onboarding`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  // Acharya AI Tutor
  public static async sendChatMessage(message: string, mode: string, history: any[] = []): Promise<any> {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message, mode, history })
    });
    return await res.json();
  }

  // Linguistics Lab
  public static async transliterate(text: string, from: string, to: string): Promise<any> {
    const res = await fetch(`${API_BASE}/linguistics/transliterate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text, from, to })
    });
    return await res.json();
  }

  public static async analyzeSentence(sentence: string): Promise<SentenceAnalysis> {
    const res = await fetch(`${API_BASE}/linguistics/analyze`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sentence })
    });
    return await res.json();
  }

  public static async resolveSandhi(word1: string, word2: string): Promise<SandhiResult> {
    const res = await fetch(`${API_BASE}/linguistics/sandhi`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ word1, word2 })
    });
    return await res.json();
  }

  public static async getDhatuTree(root: string = 'गम्'): Promise<any> {
    const res = await fetch(`${API_BASE}/linguistics/dhatu-tree?root=${encodeURIComponent(root)}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  // Vocabulary & Spaced Repetition
  public static async getVocabulary(category?: string, difficulty?: string, search?: string): Promise<{ words: VocabularyWord[] }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/vocabulary?${params.toString()}`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async getSavedWords(): Promise<any> {
    const res = await fetch(`${API_BASE}/vocabulary/saved`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async saveWord(wordId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/vocabulary/save`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ wordId })
    });
    return await res.json();
  }

  public static async reviewWord(wordId: number, grade: number): Promise<any> {
    const res = await fetch(`${API_BASE}/vocabulary/review`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ wordId, grade })
    });
    return await res.json();
  }

  // Grammar Academy
  public static async getVibhaktis(): Promise<any> {
    const res = await fetch(`${API_BASE}/grammar/vibhaktis`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async getDeclensions(word: string = 'राम'): Promise<any> {
    const res = await fetch(`${API_BASE}/grammar/declensions?word=${encodeURIComponent(word)}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  public static async getGrammarTopics(): Promise<any> {
    const res = await fetch(`${API_BASE}/grammar/topics`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Lessons
  public static async getLessons(): Promise<any> {
    const res = await fetch(`${API_BASE}/lessons`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async completeLesson(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/lessons/${id}/complete`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return await res.json();
  }

  // Quizzes & Daily Challenges
  public static async getQuizzes(category?: string): Promise<{ questions: QuizQuestion[] }> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/quizzes${params}`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async submitQuiz(answers: any[]): Promise<any> {
    const res = await fetch(`${API_BASE}/quizzes/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers })
    });
    return await res.json();
  }

  public static async getDailyChallenge(): Promise<any> {
    const res = await fetch(`${API_BASE}/quizzes/daily-challenge`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async completeDailyChallenge(): Promise<any> {
    const res = await fetch(`${API_BASE}/quizzes/daily-challenge/complete`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return await res.json();
  }

  // Audio & Pronunciation
  public static async evaluatePronunciation(targetText: string, recognizedText: string): Promise<any> {
    const res = await fetch(`${API_BASE}/audio/pronunciation-evaluate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ targetText, recognizedText })
    });
    return await res.json();
  }

  public static async getAlphabet(): Promise<any> {
    const res = await fetch(`${API_BASE}/audio/alphabet`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Gamification & Leaderboard
  public static async getAchievements(): Promise<{ achievements: Achievement[] }> {
    const res = await fetch(`${API_BASE}/gamification/achievements`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async getLeaderboard(): Promise<{ leaderboard: LeaderboardUser[] }> {
    const res = await fetch(`${API_BASE}/gamification/leaderboard`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async getStreak(): Promise<any> {
    const res = await fetch(`${API_BASE}/gamification/streak`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Progress Analytics & Mistakes
  public static async getDashboardData(): Promise<any> {
    const res = await fetch(`${API_BASE}/progress/dashboard`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async getMistakes(): Promise<any> {
    const res = await fetch(`${API_BASE}/progress/mistakes`, { headers: this.getHeaders() });
    return await res.json();
  }

  public static async getLearningPath(): Promise<any> {
    const res = await fetch(`${API_BASE}/progress/path`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Global Search
  public static async searchGlobal(q: string): Promise<any> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Chhandas Prosody Scanner
  public static async scanChhandas(verse: string): Promise<any> {
    const res = await fetch(`${API_BASE}/linguistics/chhandas`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ verse })
    });
    return await res.json();
  }

  // Samāsa Analyzer
  public static async analyzeSamasa(word: string): Promise<any> {
    const res = await fetch(`${API_BASE}/linguistics/samasa`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ word })
    });
    return await res.json();
  }

  // Declension Matrix
  public static async getDeclensionMatrix(stem: string = 'राम', gender: string = 'masculine'): Promise<any> {
    const res = await fetch(`${API_BASE}/linguistics/declensions?stem=${encodeURIComponent(stem)}&gender=${encodeURIComponent(gender)}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  // Pāṇinian Sūtras
  public static async getPaniniSutras(): Promise<{ sutras: any[]; count: number }> {
    const res = await fetch(`${API_BASE}/linguistics/sutras`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Graded Stories & Manuscripts
  public static async getStories(): Promise<{ stories: any[]; count: number }> {
    const res = await fetch(`${API_BASE}/linguistics/stories`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Subhāṣita Wisdom
  public static async getSubhashitas(): Promise<{ subhashitas: any[]; count: number }> {
    const res = await fetch(`${API_BASE}/linguistics/subhashitas`, { headers: this.getHeaders() });
    return await res.json();
  }

  // Multilingual Translation Engine (Tamil, Telugu, Hindi, English -> Sanskrit)
  public static async translate(text: string, sourceLang: string = 'en', targetLang: string = 'sa'): Promise<any> {
    const res = await fetch(`${API_BASE}/linguistics/translate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text, sourceLang, targetLang })
    });
    if (!res.ok) {
      throw new Error('Translation failed');
    }
    return await res.json();
  }
}

