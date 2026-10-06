// ==============================================================================
// SANSKRITVERSE Interactive User Onboarding Modal
// Evaluates Sanskrit proficiency, learning domains & daily commitment
// ==============================================================================

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { Sparkles, Check, ArrowRight, X } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboardingModal, triggerOnboarding, navigateTo, addXp } = useAppStore();
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState<string>('Beginner');
  const [goals, setGoals] = useState<string[]>(['Grammar', 'Vocabulary', 'Conversation']);
  const [dailyMins, setDailyMins] = useState<number>(15);

  if (!showOnboardingModal) return null;

  const levels = [
    { id: 'Beginner', title: 'Beginner (प्रवेशः)', desc: 'New to Sanskrit or learning Devanagari script for the first time.' },
    { id: 'Elementary', title: 'Elementary (प्रारम्भिकः)', desc: 'Know the alphabet and simple words; ready for noun declensions.' },
    { id: 'Intermediate', title: 'Intermediate (मध्यमः)', desc: 'Familiar with Vibhaktis & basic conjugations; want fluency & linguistics.' },
    { id: 'Advanced', title: 'Advanced (प्रौढः)', desc: 'Studying classical literature, Pāṇinian sūtras, and sentence parsing.' }
  ];

  const goalOptions = [
    'Speaking', 'Reading', 'Writing', 'Grammar',
    'Vocabulary', 'Translation', 'Pronunciation', 'Literature', 'Conversation'
  ];

  const timeOptions = [5, 10, 15, 30, 60];

  const toggleGoal = (g: string) => {
    if (goals.includes(g)) {
      setGoals(goals.filter(item => item !== g));
    } else {
      setGoals([...goals, g]);
    }
  };

  const handleFinish = async () => {
    try {
      await ApiService.updateOnboarding({
        sanskrit_level: level,
        learning_goals: goals,
        daily_goal_mins: dailyMins
      });
      addXp(50); // Welcome bonus XP!
    } catch {
      // Graceful local handling
    }
    triggerOnboarding(false);
    navigateTo('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card rounded-2xl border border-amber-500/40 p-6 shadow-2xl relative animate-fade-in">
        <button
          onClick={() => triggerOnboarding(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Personalized Learning Path (Step {step} of 3)
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-6 h-1 rounded-full ${
                  i <= step ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Level */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">What is your Sanskrit level?</h2>
              <p className="text-xs text-slate-300 mt-1">
                We will tailor Acharya AI exercises and lesson recommendations to match your pace.
              </p>
            </div>

            <div className="space-y-2.5">
              {levels.map(l => (
                <div
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    level === l.id
                      ? 'bg-amber-500/20 border-amber-500 shadow-gold-glow'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-white">{l.title}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{l.desc}</div>
                  </div>
                  {level === l.id && <Check className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Learning Goals */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">What do you want to learn?</h2>
              <p className="text-xs text-slate-300 mt-1">Select all skills you wish to cultivate:</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {goalOptions.map(g => {
                const isSelected = goals.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500/25 text-amber-300 border-amber-500 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Daily Commitment */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Daily Learning Goal</h2>
              <p className="text-xs text-slate-300 mt-1">
                Consistent daily practice builds unbroken linguistic memory:
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {timeOptions.map(m => (
                <button
                  key={m}
                  onClick={() => setDailyMins(m)}
                  className={`py-4 rounded-xl border text-center transition-all ${
                    dailyMins === m
                      ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-gold-glow'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg font-extrabold">{m}</div>
                  <div className="text-[10px] opacity-80">mins/day</div>
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 text-xs text-slate-300">
              ✨ <strong>Personalized Path Ready</strong>: Level: {level} • Goals: {goals.join(', ')} • Commitment: {dailyMins} mins/day.
            </div>

            <div className="pt-3 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs shadow-gold-glow"
              >
                Enter SanskritVerse (+50 XP)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
