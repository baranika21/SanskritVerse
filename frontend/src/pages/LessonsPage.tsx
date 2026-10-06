// ==============================================================================
// SANSKRITVERSE Structured Curriculum (Lessons) Page
// Progressive lesson roadmap from Devanagari basics to Classical Pāṇinian literature
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LessonsPage: React.FC = () => {
  const { addXp, sourceLanguage } = useAppStore();
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ApiService.getLessons();
        setLessons(data.lessons);
      } catch (err) {
        console.error('Failed to load lessons:', err);
      }
    };
    load();
  }, []);

  const handleOpenLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setIsModalOpen(true);
  };

  const handleComplete = async (lesson: any) => {
    try {
      await ApiService.completeLesson(lesson.id);
      addXp(lesson.xp_reward || 50);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setLessons(prev =>
        prev.map(l => (l.id === lesson.id ? { ...l, status: 'completed' } : l))
      );
    } catch {
      addXp(lesson.xp_reward || 50);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900/90 via-[#1E1438]/80 to-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{getTranslation(sourceLanguage, 'curriculum_title')}</h1>
            <p className="font-sanskrit text-amber-300 text-xs">क्रमबद्ध-संस्कृत-पाठ्यक्रमः</p>
          </div>
        </div>
        <div className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
          Sequential Mastery Track
        </div>
      </div>

      {/* Lesson Roadmap List */}
      <div className="space-y-3.5">
        {lessons.map((lesson, idx) => {
          const isCompleted = lesson.status === 'completed';
          const isUnlocked = idx === 0 || lessons[idx - 1]?.status === 'completed';
          const isInProgress = isUnlocked && !isCompleted;

          return (
            <div
              key={lesson.id}
              onClick={() => {
                if (isUnlocked) {
                  handleOpenLesson(lesson);
                }
              }}
              className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                !isUnlocked
                  ? 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                  : isCompleted
                  ? 'glass-card border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer'
                  : isInProgress
                  ? 'glass-card border-amber-500/50 shadow-gold-glow cursor-pointer'
                  : 'glass-card border-slate-800 hover:border-slate-700 cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Level / Status Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                  !isUnlocked
                    ? 'bg-slate-900 text-slate-600 border border-slate-800'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isInProgress
                    ? 'bg-amber-500 text-black shadow-gold-glow animate-pulse'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {!isUnlocked ? <Lock className="w-4 h-4" /> : isCompleted ? <CheckCircle2 className="w-5 h-5" /> : lesson.order_num}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Level {lesson.level} • {lesson.category}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 font-medium">
                        {getTranslation(sourceLanguage, 'lesson_locked')}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        {getTranslation(sourceLanguage, 'lesson_completed')}
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold animate-pulse">
                        {getTranslation(sourceLanguage, 'start_lesson')}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-bold transition-colors ${
                    !isUnlocked ? 'text-slate-500' : 'text-white group-hover:text-amber-300'
                  }`}>
                    {lesson.title}
                  </h3>

                  <div className={`font-sanskrit text-xs ${!isUnlocked ? 'text-slate-600' : 'text-amber-400/80'}`}>
                    {lesson.title_sanskrit}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    {lesson.description}
                  </p>
                </div>
              </div>

              {/* Action / Meta */}
              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="hidden sm:flex flex-col items-end text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.estimated_minutes || 15} mins</span>
                  </span>
                  <span className="text-amber-400 font-semibold mt-0.5">+{lesson.xp_reward} XP</span>
                </div>

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  !isUnlocked
                    ? 'bg-slate-900 text-slate-600'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-amber-500 group-hover:text-black'
                }`}>
                  {!isUnlocked ? <Lock className="w-3.5 h-3.5" /> : <ArrowRight className="w-4 h-4" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Modal Viewer */}
      {isModalOpen && activeLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-card rounded-3xl border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative animate-fade-in max-h-[85vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                Level {activeLesson.level} • {activeLesson.category}
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {activeLesson.title}
              </h2>
              <div className="font-sanskrit text-amber-300 text-base mt-0.5">
                {activeLesson.title_sanskrit}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeLesson.description}
            </div>

            {/* Lesson Content Sections */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
              <h4 className="font-bold text-white text-sm">Key Pedagogical Insights:</h4>
              <p>
                1. <strong>Phonetic Precision</strong>: Sanskrit sounds are classified by vocal points of resonance.
              </p>
              <p>
                2. <strong>Syntactic Flexibility</strong>: Because words carry explicit case markers (Vibhaktis), word order is highly expressive while preserving core semantic relationships.
              </p>
              <p>
                3. <strong>Pāṇinian Computational Grammar</strong>: Every inflected nominal and verbal form is generated deterministically from roots and affixes.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-amber-400 font-semibold">
                Reward: +{activeLesson.xp_reward} XP
              </span>

              <button
                onClick={() => handleComplete(activeLesson)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs shadow-gold-glow"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Lesson Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
