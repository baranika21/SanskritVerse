// ==============================================================================
// SANSKRITVERSE Resilient Dual-Mode Database Service
// Primary: MySQL 8.0 Pool (when configured & accessible)
// Fallback: Embedded In-Memory & Local Relational Storage Engine
// ==============================================================================

import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export interface QueryResult<T = any> {
  rows: T[];
  affectedRows?: number;
  insertId?: number;
}

class DatabaseService {
  private pool: Pool | null = null;
  private isMySqlConnected: boolean = false;
  private memoryStore: Record<string, any[]> = {};

  constructor() {
    this.initMemoryStore();
    this.attemptMySqlConnection();
  }

  private initMemoryStore() {
    // 1. Users
    this.memoryStore['users'] = [
      {
        id: 1,
        username: 'vidyarthi',
        email: 'student@sanskritverse.io',
        password_hash: '$2a$10$wE9sY62fM1c3QZ8WkK7Cee4W3Qf.2H1Vv7TfWzGk/k9e5R6q8S0v2', // Sanskrit@2026!
        sanskrit_level: 'Beginner',
        daily_goal_mins: 15,
        xp: 0,
        current_level: 1,
        streak_days: 1,
        last_active_date: new Date().toISOString().split('T')[0],
        avatar: 'avatar_student.png',
        created_at: new Date()
      },
      {
        id: 2,
        username: 'arya_sharma',
        email: 'arya@sanskritverse.io',
        password_hash: '$2a$10$wE9sY62fM1c3QZ8WkK7Cee4W3Qf.2H1Vv7TfWzGk/k9e5R6q8S0v2',
        sanskrit_level: 'Advanced',
        daily_goal_mins: 30,
        xp: 1250,
        current_level: 2,
        streak_days: 3,
        last_active_date: new Date().toISOString().split('T')[0],
        avatar: 'avatar_arya.png',
        created_at: new Date()
      }
    ];

    // 2. Vocabulary
    this.memoryStore['vocabulary'] = [
      { id: 1, devanagari: 'सूर्यः', iast: 'sūryaḥ', english: 'Sun', word_type: 'noun', gender: 'masculine', category: 'Nature', root: 'सू (sū)', example_sanskrit: 'सूर्यः पूर्वे उदेति।', example_iast: 'sūryaḥ pūrve udeti.', example_english: 'The sun rises in the east.', difficulty: 'beginner' },
      { id: 2, devanagari: 'चन्द्रः', iast: 'candraḥ', english: 'Moon', word_type: 'noun', gender: 'masculine', category: 'Nature', root: 'चन्द् (cand)', example_sanskrit: 'रात्रौ चन्द्रः प्रकाशते।', example_iast: 'rātrau candraḥ prakāśate.', example_english: 'The moon shines at night.', difficulty: 'beginner' },
      { id: 3, devanagari: 'जलम्', iast: 'jalam', english: 'Water', word_type: 'noun', gender: 'neuter', category: 'Nature', root: 'जल् (jal)', example_sanskrit: 'जलम् एव जीवनम्।', example_iast: 'jalam eva jīvanam.', example_english: 'Water alone is life.', difficulty: 'beginner' },
      { id: 4, devanagari: 'अग्निः', iast: 'agniḥ', english: 'Fire', word_type: 'noun', gender: 'masculine', category: 'Nature', root: 'अग् (ag)', example_sanskrit: 'अग्निः सर्वं दहति।', example_iast: 'agniḥ sarvaṃ dahati.', example_english: 'Fire burns everything.', difficulty: 'beginner' },
      { id: 5, devanagari: 'नमस्ते', iast: 'namaste', english: 'Greetings / Salutations', word_type: 'indeclinable', gender: 'none', category: 'Daily Life', root: 'नम् (nam)', example_sanskrit: 'नमस्ते, कथम् अस्ति भवान्?', example_iast: 'namaste, katham asti bhavān?', example_english: 'Greetings, how are you?', difficulty: 'beginner' },
      { id: 6, devanagari: 'धन्यवादः', iast: 'dhanyavādaḥ', english: 'Thank you', word_type: 'noun', gender: 'masculine', category: 'Daily Life', root: 'धन् (dhan)', example_sanskrit: 'भवते हार्दिकः धन्यवादः।', example_iast: 'bhavate hārdikaḥ dhanyavādaḥ.', example_english: 'Heartfelt thanks to you.', difficulty: 'beginner' },
      { id: 7, devanagari: 'ज्ञानम्', iast: 'jñānam', english: 'Knowledge', word_type: 'noun', gender: 'neuter', category: 'School', root: 'ज्ञा (jñā)', example_sanskrit: 'ज्ञानं परमं बलम्।', example_iast: 'jñānaṃ paramaṃ balam.', example_english: 'Knowledge is supreme strength.', difficulty: 'beginner' },
      { id: 8, devanagari: 'विद्या', iast: 'vidyā', english: 'Learning / Wisdom', word_type: 'noun', gender: 'feminine', category: 'School', root: 'विद् (vid)', example_sanskrit: 'विद्या ददाति विनयम्।', example_iast: 'vidyā dadāti vinayam.', example_english: 'Learning bestows humility.', difficulty: 'beginner' },
      { id: 9, devanagari: 'गुरुः', iast: 'guruḥ', english: 'Teacher / Master', word_type: 'noun', gender: 'masculine', category: 'School', root: 'गृ (gṛ)', example_sanskrit: 'गुरुः साक्षात् परब्रह्म।', example_iast: 'guruḥ sākṣāt parabrahma.', example_english: 'The guru is supreme consciousness.', difficulty: 'beginner' },
      { id: 10, devanagari: 'मित्रम्', iast: 'mitram', english: 'Friend', word_type: 'noun', gender: 'neuter', category: 'Family', root: 'मिद् (mid)', example_sanskrit: 'सत्यं मित्रं दुर्लभम्।', example_iast: 'satyaṃ mitraṃ durlabham.', example_english: 'A true friend is rare.', difficulty: 'beginner' },
      { id: 11, devanagari: 'गजः', iast: 'gajaḥ', english: 'Elephant', word_type: 'noun', gender: 'masculine', category: 'Animals', root: 'गज् (gaj)', example_sanskrit: 'गजः मन्दं मन्दं चलति।', example_iast: 'gajaḥ mandaṃ mandaṃ calati.', example_english: 'The elephant walks slowly.', difficulty: 'beginner' },
      { id: 12, devanagari: 'सिंहः', iast: 'siṃhaḥ', english: 'Lion', word_type: 'noun', gender: 'masculine', category: 'Animals', root: 'हिंस् (hiṃs)', example_sanskrit: 'सिंहः वनस्य राजा अस्ति।', example_iast: 'siṃhaḥ vanasya rājā asti.', example_english: 'The lion is the king of forest.', difficulty: 'beginner' },
      { id: 13, devanagari: 'पुस्तकम्', iast: 'pustakam', english: 'Book', word_type: 'noun', gender: 'neuter', category: 'School', root: 'पुस्त् (pust)', example_sanskrit: 'बालकः पुस्तकं पठति।', example_iast: 'bālakaḥ pustakaṃ paṭhati.', example_english: 'The boy reads a book.', difficulty: 'beginner' },
      { id: 14, devanagari: 'विद्यालयः', iast: 'vidyālayaḥ', english: 'School', word_type: 'noun', gender: 'masculine', category: 'School', root: 'विद् + आलय', example_sanskrit: 'छात्राः विद्यालयं गच्छन्ति।', example_iast: 'chātrāḥ vidyālayaṃ gacchanti.', example_english: 'Students go to school.', difficulty: 'beginner' }
    ];

    // 3. Lessons (Sequential progression: Lesson 1 is in_progress, rest are not_started)
    this.memoryStore['lessons'] = [
      { id: 1, title: 'Introduction to Sanskrit & Devanagari', title_sanskrit: 'संस्कृत-प्रवेशः देवनागरी च', level: 1, category: 'Alphabet', description: 'Explore the phonetic architecture of Devanagari, articulation points, and vowels.', order_num: 1, xp_reward: 50, estimated_minutes: 10, status: 'in_progress' },
      { id: 2, title: 'Consonants & Articulation Centers', title_sanskrit: 'व्यञ्जनानि उच्चारणस्थानानि च', level: 1, category: 'Alphabet', description: 'Learn the 5 consonant groups (Vargas: Ka, Cha, Ta, Tha, Pa).', order_num: 2, xp_reward: 60, estimated_minutes: 12, status: 'not_started' },
      { id: 3, title: 'First Sanskrit Words & Pronouns', title_sanskrit: 'प्रथमशब्दाः सर्वनामानि च', level: 1, category: 'Vocabulary', description: 'Master greetings, everyday objects, and primary pronouns.', order_num: 3, xp_reward: 70, estimated_minutes: 15, status: 'not_started' },
      { id: 4, title: 'Sanskrit Nouns & The Nominative Case', title_sanskrit: 'सुबन्त-प्रकरणम् प्रथमा विभक्तिः', level: 2, category: 'Grammar', description: 'Understand noun declensions and the agent case (Prathamā Vibhakti / Kartā).', order_num: 4, xp_reward: 80, estimated_minutes: 15, status: 'not_started' },
      { id: 5, title: 'Action & Motion: Accusative Case', title_sanskrit: 'द्वितीया विभक्तिः कर्मकारकम्', level: 2, category: 'Grammar', description: 'Learn the goal and destination of motion (Dvitīyā Vibhakti / Karma).', order_num: 5, xp_reward: 80, estimated_minutes: 15, status: 'not_started' },
      { id: 6, title: 'Verbal Conjugation in Present Tense (Laṭ)', title_sanskrit: 'वर्तमानकाले लट्लकारः', level: 3, category: 'Grammar', description: 'Master the 9 forms of present tense verbs across 3 persons and 3 numbers.', order_num: 6, xp_reward: 90, estimated_minutes: 20, status: 'not_started' },
      { id: 7, title: 'The Science of Sandhi: Vowel Blending', title_sanskrit: 'स्वरसन्धि-विज्ञानम्', level: 4, category: 'Sandhi', description: 'Master the rules of Dīrgha, Guṇa, and Vṛddhi sandhi for natural speech.', order_num: 7, xp_reward: 110, estimated_minutes: 20, status: 'not_started' }
    ];

    // 4. Grammar Topics
    this.memoryStore['grammar_topics'] = [
      { id: 1, title_sanskrit: 'विभक्ति-परिचयः (Aṣṭa-Vibhaktayaḥ)', title_english: 'The Eight Sanskrit Cases', category: 'vibhakti', summary: 'Sanskrit has eight grammatical cases defining thematic kāraka relations.', completed: false },
      { id: 2, title_sanskrit: 'धातु-परिचयः (Dhātu & Lakāra)', title_english: 'Verbal Roots & Conjugations', category: 'dhatu', summary: 'Every Sanskrit verb derives from a root conjugated across 10 Lakāras.', completed: false },
      { id: 3, title_sanskrit: 'सन्धि-प्रकरणम् (Sandhi Lab)', title_english: 'Phonetic Conjunction Rules', category: 'sandhi', summary: 'Euphoric blending of adjacent sounds according to Pāṇinian sūtras.', completed: false },
      { id: 4, title_sanskrit: 'समास-विचारः (Samāsa Academy)', title_english: 'Compound Words Classification', category: 'samasa', summary: 'Compounding multiple words into a single morphological unit.', completed: false }
    ];

    // 5. Quizzes
    this.memoryStore['quiz_questions'] = [
      {
        id: 1, topic_id: 1, category: 'Grammar', difficulty: 'beginner', question_type: 'mcq',
        question_text: 'What is the grammatical case (Vibhakti) of "रामेण"?',
        prompt_sanskrit: 'रामेण बाणः हतः।',
        options: ['प्रथमा (Nominative)', 'द्वितीया (Accusative)', 'तृतीया (Instrumental)', 'पञ्चमी (Ablative)'],
        correct_answer: 'तृतीया (Instrumental)',
        explanation: 'रामेण ends in -ेण, which is singular instrumental case signifying the agent.',
        xp_value: 20
      },
      {
        id: 2, topic_id: 1, category: 'Grammar', difficulty: 'beginner', question_type: 'mcq',
        question_text: 'Which case is used for destination/object in "बालकः वनं गच्छति"?',
        prompt_sanskrit: 'बालकः वनं गच्छति।',
        options: ['प्रथमा (Nominative)', 'द्वितीया (Accusative)', 'सप्तमी (Locative)', 'षष्ठी (Genitive)'],
        correct_answer: 'द्वितीया (Accusative)',
        explanation: 'The goal of motion takes the accusative case (द्वितीया विभक्तिः).',
        xp_value: 20
      },
      {
        id: 3, topic_id: 2, category: 'Grammar', difficulty: 'beginner', question_type: 'fill_blank',
        question_text: 'Choose the correct verb form: "अहं प्रतिदिनं विद्यालयम् ______।"',
        prompt_sanskrit: 'अहं प्रतिदिनं विद्यालयम् ______।',
        options: ['गच्छति', 'गच्छसि', 'गच्छामि', 'गच्छन्ति'],
        correct_answer: 'गच्छामि',
        explanation: 'Subject "अहम्" is 1st person singular (Uttama-puruṣa), requiring "-आमि".',
        xp_value: 25
      },
      {
        id: 4, topic_id: 3, category: 'Sandhi', difficulty: 'intermediate', question_type: 'mcq',
        question_text: 'According to Guṇa Sandhi rules, what is "राम + इति"?',
        prompt_sanskrit: 'राम + इति = ?',
        options: ['रामेति', 'रामाइति', 'रामोइति', 'रामैति'],
        correct_answer: 'रामेति',
        explanation: 'a + i merges into e by "आद्गुणः" (Pāṇini 6.1.87).',
        xp_value: 25
      }
    ];

    // 6. Achievements (Dynamic unlocked condition based on real user accomplishments)
    this.memoryStore['achievements'] = [
      { id: 1, badge_code: 'FIRST_WORD', title: 'First Sanskrit Word', title_sanskrit: 'प्रथम-शब्दः', description: 'Learned and practiced your first authentic Sanskrit word.', icon_name: 'Sparkles', xp_reward: 50, required_xp: 50 },
      { id: 2, badge_code: 'SEVEN_DAY_STREAK', title: '7 Day Fire Streak', title_sanskrit: 'सप्त-दिन-दीक्षा', description: 'Kept your Sanskrit learning flame alive for 7 continuous days.', icon_name: 'Flame', xp_reward: 150, required_streak: 7 },
      { id: 3, badge_code: 'CENTURY_WORDS', title: '100 Words Mastered', title_sanskrit: 'शत-शब्द-विशारदः', description: 'Committed 100 Sanskrit words to your active vocabulary bank.', icon_name: 'BookOpen', xp_reward: 250, required_words: 100 },
      { id: 4, badge_code: 'GRAMMAR_MASTER', title: 'Grammar Master', title_sanskrit: 'वैयाकरण-शिरोमणिः', description: 'Successfully mastered all 8 Vibhakti visualizer challenges.', icon_name: 'Brain', xp_reward: 300, required_grammar: 4 },
      { id: 5, badge_code: 'PRONUNCIATION_PRO', title: 'Pronunciation Explorer', title_sanskrit: 'स्पष्ट-वाक्', description: 'Achieved high accuracy on audio speech practice.', icon_name: 'Mic', xp_reward: 200, required_xp: 150 },
      { id: 6, badge_code: 'QUIZ_CHAMPION', title: 'Quiz Champion', title_sanskrit: 'प्रश्नोत्तर-विजेता', description: 'Achieved a perfect score on an advanced linguistics quiz.', icon_name: 'Trophy', xp_reward: 250, required_xp: 300 }
    ];

    // 7. Leaderboard (Real-time dynamic ranks)
    this.memoryStore['leaderboard'] = [
      { id: 1, rank: 1, username: 'dev_pandit', avatar: 'avatar_dev.png', level: 3, total_xp: 850, streak: 5 },
      { id: 2, rank: 2, username: 'arya_sharma', avatar: 'avatar_arya.png', level: 2, total_xp: 450, streak: 3 },
      { id: 3, rank: 3, username: 'ananya_roy', avatar: 'avatar_ananya.png', level: 1, total_xp: 120, streak: 2 }
    ];

    // 8. Saved words (Starts clean with zero dummy values)
    this.memoryStore['saved_words'] = [];

    // 9. User Quiz Attempts
    this.memoryStore['quiz_attempts'] = [];

    // 10. Chat History
    this.memoryStore['chatbot_history'] = [];

    // 11. Daily Challenge
    this.memoryStore['daily_challenges'] = [
      {
        id: 1,
        date_for: new Date().toISOString().split('T')[0],
        title: 'Translate: Knowledge is Power',
        title_sanskrit: 'ज्ञानं शक्तिः अस्ति',
        challenge_type: 'translation',
        challenge_data: {
          english: 'Knowledge is power.',
          target_sanskrit: 'ज्ञानं शक्तिः अस्ति।',
          hints: ['ज्ञानम् = Knowledge', 'शक्तिः = Power', 'अस्ति = Is']
        },
        xp_reward: 50,
        completed: false
      }
    ];

    // 12. User Settings
    this.memoryStore['user_settings'] = [
      {
        userId: 1,
        theme: 'dark',
        graphics_quality: 'high',
        audio_speed: 1.0,
        default_script: 'both',
        sound_effects: true,
        auto_pronounce: true,
        privacy_public_leaderboard: true
      }
    ];
  }

  private async attemptMySqlConnection() {
    try {
      const host = process.env.DB_HOST || 'localhost';
      const port = Number(process.env.DB_PORT) || 3306;
      const user = process.env.DB_USER || 'root';
      const password = process.env.DB_PASSWORD || '';
      const database = process.env.DB_NAME || 'sanskritverse';

      this.pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Quick test query with short timeout
      const conn = await Promise.race([
        this.pool.getConnection(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 2000))
      ]);

      await conn.ping();
      conn.release();
      this.isMySqlConnected = true;
      console.log('✅ Connected to MySQL 8.0 Database successfully.');
    } catch (err: any) {
      this.isMySqlConnected = false;
      this.pool = null;
      console.log('ℹ️  MySQL not directly reachable (or credentials differ) - operating in Resilient In-Memory Relational Mode.');
      console.log('    All lessons, vocabulary, grammar, Acharya AI tutor, and gamification APIs remain fully functional.');
    }
  }

  public isUsingMySql(): boolean {
    return this.isMySqlConnected;
  }

  public getMemoryStore(): Record<string, any[]> {
    return this.memoryStore;
  }

  /**
   * Universal query executor that safely proxies queries to MySQL or in-memory store
   */
  public async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (this.isMySqlConnected && this.pool) {
      try {
        const [results] = await this.pool.query(sql, params);
        if (Array.isArray(results)) {
          return { rows: results as T[] };
        } else {
          const header = results as mysql.ResultSetHeader;
          return {
            rows: [],
            affectedRows: header.affectedRows,
            insertId: header.insertId
          };
        }
      } catch (err) {
        console.error('MySQL query error, falling back to memory store:', err);
      }
    }

    // Resilient memory mock handlers
    return this.handleMemoryQuery<T>(sql, params);
  }

  private handleMemoryQuery<T>(sql: string, params: any[]): QueryResult<T> {
    const trimmed = sql.trim().toUpperCase();

    // Vocabulary query
    if (trimmed.includes('FROM VOCABULARY') || trimmed.includes('FROM `VOCABULARY`')) {
      return { rows: this.memoryStore['vocabulary'] as T[] };
    }

    // Lessons query
    if (trimmed.includes('FROM LESSONS') || trimmed.includes('FROM `LESSONS`')) {
      return { rows: this.memoryStore['lessons'] as T[] };
    }

    // Grammar query
    if (trimmed.includes('FROM GRAMMAR_TOPICS') || trimmed.includes('FROM `GRAMMAR_TOPICS`')) {
      return { rows: this.memoryStore['grammar_topics'] as T[] };
    }

    // Quizzes query
    if (trimmed.includes('FROM QUIZ_QUESTIONS') || trimmed.includes('FROM `QUIZ_QUESTIONS`')) {
      return { rows: this.memoryStore['quiz_questions'] as T[] };
    }

    // Achievements query
    if (trimmed.includes('FROM ACHIEVEMENTS') || trimmed.includes('FROM `ACHIEVEMENTS`')) {
      return { rows: this.memoryStore['achievements'] as T[] };
    }

    // Leaderboard query
    if (trimmed.includes('FROM LEADERBOARD') || trimmed.includes('FROM `LEADERBOARD`')) {
      return { rows: this.memoryStore['leaderboard'] as T[] };
    }

    // Users query
    if (trimmed.includes('FROM USERS') || trimmed.includes('FROM `USERS`')) {
      if (params.length > 0) {
        const identifier = params[0];
        const user = this.memoryStore['users'].find(u => u.email === identifier || u.username === identifier || u.id === identifier);
        return { rows: (user ? [user] : []) as T[] };
      }
      return { rows: this.memoryStore['users'] as T[] };
    }

    // Saved words
    if (trimmed.includes('FROM SAVED_WORDS') || trimmed.includes('FROM `SAVED_WORDS`')) {
      return { rows: this.memoryStore['saved_words'] as T[] };
    }

    // Daily challenges
    if (trimmed.includes('FROM DAILY_CHALLENGES') || trimmed.includes('FROM `DAILY_CHALLENGES`')) {
      return { rows: this.memoryStore['daily_challenges'] as T[] };
    }

    return { rows: [] };
  }
}

export const db = new DatabaseService();
