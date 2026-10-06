// ==============================================================================
// SANSKRITVERSE Progress, Analytics & Mistake Analysis Page
// Radar mastery meters, "My Mistakes" diagnostics & 7-step personalized learning path
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import {
  BarChart3,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';

export const ProgressAnalyticsPage: React.FC = () => {
  const { user, navigateTo } = useAppStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [learningPath, setLearningPath] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, mist, path] = await Promise.all([
          ApiService.getDashboardData(),
          ApiService.getMistakes(),
          ApiService.getLearningPath()
        ]);
        setDashboardData(dash);
        setMistakes(mist.mistakes);
        setLearningPath(path.path);
      } catch (err) {
        console.error('Failed to load progress analytics:', err);
      }
    };
    load();
  }, []);

  const domainSkills = [
    { label: 'Vocabulary (शब्दावली)', percent: dashboardData?.stats?.vocabMasteredPercent || 0, color: 'bg-emerald-500' },
    { label: 'Grammar (व्याकरणम्)', percent: dashboardData?.stats?.grammarMasteredPercent || 0, color: 'bg-blue-500' },
    { label: 'Reading & Script (पठनम्)', percent: dashboardData?.stats?.readingMasteredPercent || 0, color: 'bg-amber-500' },
    { label: 'Pronunciation (उच्चारणम्)', percent: dashboardData?.stats?.pronunciationMasteredPercent || 0, color: 'bg-pink-500' },
    { label: 'Conversation (सम्भाषणम्)', percent: dashboardData?.stats?.conversationMasteredPercent || 0, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900/90 via-[#1E1438]/80 to-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Learning Progress & Analytics</h1>
            <p className="font-sanskrit text-amber-300 text-xs">विद्या-प्रगति-विश्लेषणम्</p>
          </div>
        </div>
        <div className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
          Live Diagnostics
        </div>
      </div>

      {/* 1. DOMAIN SKILL MASTERY METERS (Section 32 Specification) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Linguistic Domain Competency Breakdown</span>
        </h2>

        <div className="space-y-4">
          {domainSkills.map((d, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">{d.label}</span>
                <span className="font-bold text-white">{d.percent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${d.percent}%` }}
                  className={`${d.color} h-full rounded-full transition-all duration-1000`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MISTAKE ANALYSIS: "My Mistakes" (Section 33 Specification) */}
      <div className="glass-card p-6 rounded-2xl border border-red-500/30 space-y-4 bg-gradient-to-br from-slate-900/90 via-[#260E0E]/40 to-slate-900/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">My Mistakes (दोष-विश्लेषणम्)</h2>
          </div>
          <span className="text-xs text-red-300 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            Intelligent Error Diagnostic
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Acharya AI tracks your repeated quiz confusions and adjusts learning recommendations automatically:
        </p>

        <div className="space-y-3 pt-2">
          {mistakes.map((m: any) => (
            <div
              key={m.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-red-300 uppercase">
                  {m.topic}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Repeatedly confused:</span>
                  {m.confusedElements?.map((el: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-red-500/20 text-red-200 text-xs font-sanskrit font-bold">
                      {el}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-300">{m.diagnosis}</p>
              </div>

              <button
                onClick={() => navigateTo('grammar')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shrink-0 shadow-sm"
              >
                <span>{m.recommendedPractice}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PERSONALIZED LEARNING PATH (Section 34 Specification) */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Your Learning Path (अध्ययन-क्रमः)</h2>
        </div>
        <p className="text-xs text-slate-400">
          Dynamic progression adapting to your diagnostic scores, time goals, and grammatical milestones:
        </p>

        <div className="space-y-2.5 pt-2">
          {learningPath.map((item: any) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';

            return (
              <div
                key={item.step}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 shadow-gold-glow'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800 opacity-80'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-500 text-black'
                      : isCurrent
                      ? 'bg-amber-500 text-black animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                  </div>

                  <div>
                    <div className={`text-sm font-bold ${isCurrent ? 'text-amber-300' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                      {item.title}
                    </div>
                    <div className="text-[11px] font-sanskrit opacity-75">
                      {item.titleSanskrit}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-black">
                      CURRENT
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-xs text-emerald-400 font-semibold">✓ Completed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
