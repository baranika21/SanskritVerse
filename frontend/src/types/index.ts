// ==============================================================================
// SANSKRITVERSE Frontend Type Definitions
// ==============================================================================

export type PageView =
  | 'login'
  | 'landing'
  | 'dashboard'
  | 'acharya'
  | 'lessons'
  | 'alphabet'
  | 'vocabulary'
  | 'grammar'
  | 'pronunciation'
  | 'linguistics'
  | 'chhandas'
  | 'manuscripts'
  | 'subhashitas'
  | 'translation'
  | 'builder'
  | 'practice'
  | 'achievements'
  | 'progress'
  | 'profile'
  | 'settings';

export type GraphicsQuality = 'high' | 'medium' | 'low' | '2d';

export type NativeLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml';

export interface TranslationGlossItem {
  sourceWord: string;
  sanskritWord: string;
  iast: string;
  role: string;
  meaning: string;
}

export interface TranslationResponse {
  originalText: string;
  sourceLang: string;
  targetLang: string;
  sanskritDevanagari: string;
  sanskritIast: string;
  sanskritNativeScript?: string;
  translatedText: string;
  gloss: TranslationGlossItem[];
  explanation: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  sanskrit_level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  daily_goal_mins: number;
  xp: number;
  current_level: number;
  streak_days: number;
  avatar: string;
}

export interface VocabularyWord {
  id: number;
  devanagari: string;
  iast: string;
  english: string;
  word_type: string;
  gender: string;
  category: string;
  root?: string;
  audio_url?: string;
  example_sanskrit: string;
  example_iast?: string;
  example_english: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface MorphologicalToken {
  token: string;
  iast: string;
  cleanToken: string;
  partOfSpeech: string;
  root?: string;
  stem?: string;
  gender?: string;
  case?: string;
  number?: string;
  person?: string;
  tense?: string;
  karakaRole?: string;
  englishGloss: string;
  explanation: string;
}

export interface DependencyGraph {
  nodes: Array<{ id: string; label: string; iast: string; role: string; pos: string }>;
  links: Array<{ source: string; target: string; relation: string; description: string }>;
}

export interface SentenceAnalysis {
  originalSentence: string;
  iast: string;
  tokens: MorphologicalToken[];
  dependencyGraph: DependencyGraph;
  syntacticStructure: string;
  englishTranslation: string;
}

export interface SandhiResult {
  input1: string;
  input2: string;
  output: string;
  sutra: string;
  sutraName: string;
  sandhiType: string;
  explanation: string;
  steps: string[];
}

export interface QuizQuestion {
  id: number;
  topic_id?: number;
  category: string;
  difficulty: string;
  question_type: 'mcq' | 'fill_blank' | 'translation' | 'match' | 'arrange' | 'timed';
  question_text: string;
  prompt_sanskrit?: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  xp_value: number;
}

export interface Achievement {
  id: number;
  badge_code: string;
  title: string;
  title_sanskrit: string;
  description: string;
  icon_name: string;
  xp_reward: number;
  unlocked: boolean;
}

export interface LeaderboardUser {
  id: number;
  rank: number;
  username: string;
  avatar: string;
  level: number;
  total_xp: number;
  streak: number;
}

export interface ChhandasSyllable {
  syllable: string;
  weight: 'L' | 'G'; // Laghu or Guru
  symbol: string;    // ∪ or —
  matra: number;     // 1 or 2
  reason: string;
}

export interface ChhandasPada {
  padaNumber: number;
  text: string;
  syllables: ChhandasSyllable[];
  syllableCount: number;
  matraCount: number;
  pattern: string;   // e.g. "— ∪ —  — ∪ ∪  ∪ ∪ —"
  ganas: Array<{ name: string; pattern: string; syllables: string[] }>;
}

export interface ChhandasScanResult {
  meterName: string;
  meterNameSanskrit: string;
  meterCategory: string; // Vedic, Varna-vritta, Matra-vritta
  syllablesPerPada: number;
  schemeDescription: string;
  yati: string; // Caesura rule
  padas: ChhandasPada[];
  isMatch: boolean;
  famousExample: string;
  exampleMeaning: string;
  classicalRecitationGuide: string;
}

export interface SamasaAnalysisResult {
  compoundWord: string;
  iast: string;
  samasaType: string;
  samasaTypeSanskrit: string;
  purvapada: string;
  purvapadaMeaning: string;
  uttarapada: string;
  uttarapadaMeaning: string;
  vigrahaVakya: string;
  vigrahaIast: string;
  englishMeaning: string;
  paniniSutra: string;
  explanation: string;
}

export interface GradedStory {
  id: string;
  title: string;
  titleSanskrit: string;
  source: string; // Panchatantra, Hitopadesha, etc.
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  audioRecitationUrl?: string;
  summary: string;
  sentences: Array<{
    sanskrit: string;
    iast: string;
    padachheda: string; // sandhi split
    anvaya: string;     // prose order
    english: string;
    words: Array<{
      word: string;
      stem: string;
      grammar: string;
      meaning: string;
    }>;
  }>;
}

export interface Subhashita {
  id: number;
  verseSanskrit: string;
  verseIast: string;
  source: string;
  meter: string;
  padachheda: string;
  anvaya: string;
  wordMeanings: Array<{ word: string; meaning: string }>;
  englishTranslation: string;
  philosophicalPurport: string;
  grammarNotes: string;
}

