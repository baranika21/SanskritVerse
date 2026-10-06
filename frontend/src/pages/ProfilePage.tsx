// ==============================================================================
// SANSKRITVERSE Profile & "My Sanskrit Library" Page
// User identity, earned badges, learning goals, and bookmarked words/topics
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useAppStore, getLevelTitle } from '../store/useAppStore';
import { Achievement } from '../types';
import {
  User,
  Award,
  Bookmark,
  Sparkles,
  Flame,
  Volume2,
  Trash2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { SpeechService } from '../services/speech';

export const ProfilePage: React.FC = () => {
  const { user } = useAppStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [savedWords, setSavedWords] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [achData, swData] = await Promise.all([
          ApiService.getAchievements(),
          ApiService.getSavedWords()
        ]);
        setAchievements(achData.achievements);
        setSavedWords(swData.savedWords);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Profile Identity Card (Section 37 Specification) */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900/95 via-[#170B28]/90 to-slate-900/90 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-1 shadow-gold-glow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-sanskrit text-4xl font-extrabold text-amber-300">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user.username}
              </h1>
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold w-fit mx-auto sm:mx-0">
                {user.sanskrit_level} Level
              </span>
            </div>

            <p className="font-sanskrit text-amber-400 font-semibold text-sm">
              {getLevelTitle(user.current_level)}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{user.xp.toLocaleString()} XP Total</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Flame className="w-4 h-4 fill-current" />
                <span>{user.streak_days} Day Streak</span>
              </span>
              <span>•</span>
              <span>Goal: {user.daily_goal_mins} mins/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Achievements (Sections 30 & 31 Specification) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Badges & Achievements (सिद्धयः)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-xl border transition-all ${
                a.unlocked
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                  a.unlocked ? 'bg-amber-500 text-black shadow-gold-glow' : 'bg-slate-800 text-slate-500'
                }`}>
                  🏆
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{a.title}</div>
                  <div className="font-sanskrit text-xs text-amber-300">{a.title_sanskrit}</div>
                  <p className="text-[11px] text-slate-400 mt-1">{a.description}</p>
                  <div className="text-[10px] text-amber-400 font-semibold mt-1">
                    +{a.xp_reward} XP
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MY SANSKRIT LIBRARY / SAVED WORDS (Section 39 Specification) */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">My Sanskrit Library (मम पुस्तकालयः)</h2>
          </div>
          <span className="text-xs text-emerald-300 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            {savedWords.length} Saved Words
          </span>
        </div>

        {savedWords.length === 0 ? (
          <div className="text-center py-10 space-y-2 text-slate-400 text-xs">
            <p>No saved Sanskrit words yet.</p>
            <p className="text-slate-500">Star words in the vocabulary section to review them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedWords.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sanskrit text-xl font-bold text-amber-300">
                      {item.word?.devanagari}
                    </span>
                    <span className="text-xs font-mono text-slate-400 italic">
                      ({item.word?.iast})
                    </span>
                  </div>
                  <div className="text-xs font-medium text-white mt-0.5">
                    {item.word?.english}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    SRS Stage {item.srsStage} • Next review in {item.intervalDays} days
                  </div>
                </div>

                <button
                  onClick={() => SpeechService.speak(item.word?.devanagari)}
                  className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:text-white"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
