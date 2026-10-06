import React, { useEffect, useState } from 'react';
import { useAppStore, getLevelTitle } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { SceneContainer } from '../components/3d/SceneContainer';
import { getTranslation } from '../i18n';
import {
  Flame,
  Sparkles,
  BookOpen,
  Brain,
  Award,
  ArrowRight,
  Bot,
  Mic,
  Trophy,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, navigateTo, addXp, sourceLanguage } = useAppStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, chal] = await Promise.all([
          ApiService.getDashboardData(),
          ApiService.getDailyChallenge()
        ]);
        setDashboardData(dash);
        setDailyChallenge(chal);
      } catch (err) {
        console.warn('Could not load dashboard data, using responsive defaults', err);
      }
    };
    load();
  }, []);

  const handleCompleteChallenge = async () => {
    if (challengeCompleted) return;
    try {
      await ApiService.completeDailyChallenge();
      setChallengeCompleted(true);
      addXp(50);
    } catch {
      setChallengeCompleted(true);
      addXp(50);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 border border-amber-500/30 relative overflow-hidden bg-gradient-to-r from-slate-900/95 via-[#1E1438]/80 to-slate-900/90">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>{getTranslation(sourceLanguage, 'welcome_back')}</span>
              <span>•</span>
              <span className="font-sanskrit text-sm font-bold">नमस्ते {user.username}!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {getLevelTitle(user.current_level)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {getTranslation(sourceLanguage, 'dashboard_subtitle')}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('acharya')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-gold-glow transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>{getTranslation(sourceLanguage, 'chat_acharya')}</span>
            </button>
            <button
              onClick={() => navigateTo('lessons')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <span>{getTranslation(sourceLanguage, 'continue_learning')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Daily Goal */}
        <div className="glass-card glass-card-hover p-4 rounded-xl border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{getTranslation(sourceLanguage, 'daily_goal')}</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{dashboardData?.user?.dailyGoalProgressPercent ?? 0}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${dashboardData?.user?.dailyGoalProgressPercent ?? 0}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="glass-card glass-card-hover p-4 rounded-xl border border-orange-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{getTranslation(sourceLanguage, 'streak')}</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="text-2xl font-extrabold text-orange-400">🔥 {user.streak_days || 1} {getTranslation(sourceLanguage, 'day_streak')}</div>
          <div className="text-[10px] text-slate-400 mt-1">Day {user.streak_days || 1}</div>
        </div>

        {/* Total XP */}
        <div className="glass-card glass-card-hover p-4 rounded-xl border border-purple-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{getTranslation(sourceLanguage, 'total_xp')}</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold gold-gradient-text">{(user.xp || 0).toLocaleString()} {getTranslation(sourceLanguage, 'xp')}</div>
          <div className="text-[10px] text-slate-400 mt-1">Level {user.current_level}</div>
        </div>

        {/* Words Learned */}
        <div className="glass-card glass-card-hover p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{getTranslation(sourceLanguage, 'words_learned')}</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{dashboardData?.stats?.wordsMasteredCount ?? 0}</div>
          <div className="text-[10px] text-emerald-400/90 mt-1">
            {dashboardData?.stats?.wordsMasteredCount ? `${dashboardData.stats.vocabMasteredPercent}% mastered` : 'Active Lexicon'}
          </div>
        </div>

        {/* Grammar Topics */}
        <div className="glass-card glass-card-hover p-4 rounded-xl border border-blue-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{getTranslation(sourceLanguage, 'grammar_mastery')}</span>
            <Brain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{dashboardData?.stats?.grammarCompletedCount ?? 0}</div>
          <div className="text-[10px] text-blue-400/90 mt-1">Pāṇinian Grammar</div>
        </div>

        {/* Quiz Accuracy */}
        <div className="glass-card glass-card-hover p-4 rounded-xl border border-pink-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{getTranslation(sourceLanguage, 'quiz_accuracy')}</span>
            <Trophy className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-extrabold text-pink-300">
            {dashboardData?.stats?.quizAccuracyPercent ? `${dashboardData.stats.quizAccuracyPercent}%` : '0%'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Verified Accuracy</div>
        </div>
      </div>

      {/* Central 3D Sanskrit Universe (Knowledge Tree / Temple) */}
      <div className="w-full">
        <SceneContainer />
      </div>

      {/* Continue Learning & Today's Sanskrit Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CONTINUE LEARNING CARD (Section 9 Specification) */}
        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>CONTINUE LEARNING</span>
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px]">
                Level {dashboardData?.currentLesson?.level || 1} • Up Next
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {dashboardData?.currentLesson?.title || 'Lesson 1 — Introduction to Sanskrit'}
            </h3>
            <p className="font-sanskrit text-amber-300/90 text-sm mt-0.5">
              {dashboardData?.currentLesson?.titleSanskrit || 'संस्कृत-प्रवेशः देवनागरी च'}
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {dashboardData?.currentLesson?.description || 'Explore the phonetic architecture of Devanagari, articulation points, and vowels.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-4">
              <span>⏱️ {dashboardData?.currentLesson?.estimated_minutes || 10} mins</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">+{dashboardData?.currentLesson?.xp_reward || 50} XP Reward</span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => navigateTo('lessons')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-gold-glow transition-all"
            >
              <span>Continue Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TODAY'S SANSKRIT CHALLENGE (Section 29 Specification) */}
        <div className="glass-card p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between bg-gradient-to-br from-[#170B28]/80 to-slate-900/90">
          <div>
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>TODAY'S SANSKRIT CHALLENGE</span>
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px]">
                +50 XP Reward
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Translate into Sanskrit:</h3>
            <div className="my-3 p-4 rounded-xl bg-black/40 border border-purple-500/20 text-center">
              <span className="text-xl font-extrabold text-amber-300 font-serif">
                "Knowledge is power."
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5">
              <p>Vocabulary hints:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2 py-1 rounded bg-slate-800 text-amber-200 text-xs">
                  ज्ञानम् = Knowledge
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-amber-200 text-xs">
                  शक्तिः = Power
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-amber-200 text-xs">
                  अस्ति = Is
                </span>
              </div>
            </div>

            {challengeCompleted && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correct! "ज्ञानं शक्तिः अस्ति।" (+50 XP added to streak)</span>
              </div>
            )}
          </div>

          <div className="pt-5">
            <button
              onClick={handleCompleteChallenge}
              disabled={challengeCompleted}
              className={`w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                challengeCompleted
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-purple-500 to-amber-500 hover:brightness-110 text-white shadow-purple-glow'
              }`}
            >
              {challengeCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Challenge Completed for Today</span>
                </>
              ) : (
                <>
                  <span>Submit: "ज्ञानं शक्तिः अस्ति।"</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* NEW: SPECIALIZED LABS & WISDOM HUBS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Advanced Sanskrit Linguistics & Wisdom Studios</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Chhandas Lab Card */}
          <div
            onClick={() => navigateTo('chhandas')}
            className="p-5 rounded-2xl glass-card border border-indigo-500/30 hover:border-indigo-400/80 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-[#121124] to-slate-900 group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                🎵
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                Prosody Lab
              </span>
            </div>
            <h3 className="font-bold text-white text-base font-sanskrit group-hover:text-indigo-300 transition-colors">
              छन्दोविज्ञानम् (Chhandas Lab)
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Scan Laghu & Guru syllables, calculate Mātrās, and analyze Sanskrit meters like Anuṣṭubh & Mandākrāntā.
            </p>
          </div>

          {/* Graded Manuscript Reader Card */}
          <div
            onClick={() => navigateTo('manuscripts')}
            className="p-5 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-400/80 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-[#24170D] to-slate-900 group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                📜
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                Graded Stories
              </span>
            </div>
            <h3 className="font-bold text-white text-base font-sanskrit group-hover:text-amber-300 transition-colors">
              पाण्डुलिपि-वाचकः (Story Reader)
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Read Panchatantra & Gita in palm-leaf manuscript styling with click-to-analyze grammar & word sandhi split.
            </p>
          </div>

          {/* Subhashita Studio Card */}
          <div
            onClick={() => navigateTo('subhashitas')}
            className="p-5 rounded-2xl glass-card border border-rose-500/30 hover:border-rose-400/80 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-[#240E14] to-slate-900 group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                ✨
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300">
                Daily Wisdom
              </span>
            </div>
            <h3 className="font-bold text-white text-base font-sanskrit group-hover:text-rose-300 transition-colors">
              सुभाषित-मञ्जरी (Subhāṣita Studio)
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Explore timeless Sanskrit gnomic verses, audio chanting, philosophical purport, and custom calligraphy cards.
            </p>
          </div>

          {/* Samasa & Linguistics Card */}
          <div
            onClick={() => navigateTo('linguistics')}
            className="p-5 rounded-2xl glass-card border border-purple-500/30 hover:border-purple-400/80 cursor-pointer transition-all hover:scale-[1.02] bg-gradient-to-br from-[#1E1128] to-slate-900 group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                🔬
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                NLP & Sūtras
              </span>
            </div>
            <h3 className="font-bold text-white text-base font-sanskrit group-hover:text-purple-300 transition-colors">
              भाषाविज्ञान-प्रयोगशाला
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Deconstruct compound words (Samāsa), search Pāṇinian Aṣṭādhyāyī Sūtras, and generate Kāraka dependency graphs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
