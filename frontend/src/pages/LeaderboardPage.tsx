// ==============================================================================
// SANSKRITVERSE Global Leaderboard Page
// Ranks, XP, Levels, Streaks, and Privacy Controls
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { LeaderboardUser } from '../types';
import { Trophy, Medal, Flame, Award, Shield, Eye, EyeOff } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ApiService.getLeaderboard();
        setUsers(data.leaderboard);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-slate-900/90 via-[#261E0E]/80 to-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Global Sanskrit Scholars</h1>
            <p className="font-sanskrit text-yellow-300 text-xs">विश्व-संस्कृत-अग्रणी-सूची</p>
          </div>
        </div>

        {/* Privacy Toggle (Section 36 Specification) */}
        <button
          onClick={() => setIsPublic(!isPublic)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
          title="Toggle your public leaderboard visibility"
        >
          {isPublic ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>{isPublic ? 'Profile Visible' : 'Anonymous Mode'}</span>
        </button>
      </div>

      {/* Leaderboard Table (Section 36 Specification: Rank, User, XP, Level, Streak) */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {users.map((u) => {
            const isTop3 = u.rank <= 3;
            const isCurrentUser = u.username.includes('You');

            return (
              <div
                key={u.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  isCurrentUser
                    ? 'bg-amber-500/15 border-l-4 border-amber-500'
                    : isTop3
                    ? 'bg-slate-900/40 hover:bg-slate-800/40'
                    : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                    u.rank === 1
                      ? 'bg-amber-400 text-black shadow-gold-glow'
                      : u.rank === 2
                      ? 'bg-slate-300 text-black'
                      : u.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {u.rank}
                  </div>

                  {/* Avatar & Username */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-amber-300 text-xs">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{u.username}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Level {u.level}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-orange-400">
                          <Flame className="w-3 h-3 fill-current" />
                          <span>{u.streak} day streak</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* XP Column */}
                <div className="text-right">
                  <div className="font-extrabold text-base gold-gradient-text">
                    {u.total_xp.toLocaleString()} XP
                  </div>
                  <div className="text-[10px] text-slate-500">Cumulative</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
