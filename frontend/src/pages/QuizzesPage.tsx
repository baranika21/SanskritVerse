// ==============================================================================
// SANSKRITVERSE Interactive Quizzes & Practice Page
// Multi-format question engine: MCQ, Fill in Blank, Match, Arrange & Timed Challenge
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles,
  Clock,
  ArrowRight,
  RotateCcw,
  Zap,
  HelpCircle
} from 'lucide-react';

export const QuizzesPage: React.FC = () => {
  const { addXp } = useAppStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ApiService.getQuizzes();
        setQuestions(data.questions);
      } catch (err) {
        console.error('Failed to load quiz questions:', err);
      }
    };
    load();
  }, []);

  const currentQ = questions[currentQIndex];

  // Timed challenge countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && !isSubmitted && timerActive) {
      // Auto submit on time out
      handleSubmitAnswer();
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, isSubmitted]);

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (!currentQ || isSubmitted) return;
    setIsSubmitted(true);
    setTimerActive(false);

    const isCorrect = String(currentQ.correct_answer).trim() === String(selectedAnswer).trim();
    if (isCorrect) {
      setScore(s => s + 1);
      addXp(currentQ.xp_value || 20);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setTimerSeconds(15);
      if (questions[currentQIndex + 1]?.question_type === 'timed') {
        setTimerActive(true);
      }
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setTimerSeconds(15);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-slate-900/90 via-[#261E0E]/80 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sanskrit Practice & Quizzes</h1>
            <p className="font-sanskrit text-yellow-300 text-xs">ज्ञान-परीक्षा प्रश्नोत्तरी च</p>
          </div>
        </div>

        {/* Score pill */}
        <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-yellow-500/30 text-xs font-semibold text-yellow-300">
          Score: <span className="font-bold text-base text-white ml-1">{score}</span> / {questions.length}
        </div>
      </div>

      {/* QUIZ FINISHED CELEBRATION */}
      {quizFinished ? (
        <div className="glass-card p-10 rounded-3xl border border-amber-500/40 shadow-gold-glow-lg text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 mx-auto flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-black" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Quiz Completed!</h2>
            <p className="font-sanskrit text-amber-300 text-lg">अभिनन्दनम्! भवन्तः उत्तीर्णाः।</p>
            <p className="text-sm text-slate-300">
              You scored <strong className="text-amber-400 font-bold">{score} out of {questions.length}</strong> (
              {Math.round((score / Math.max(1, questions.length)) * 100)}% Accuracy).
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs shadow-gold-glow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* ACTIVE QUESTION CARD (Section 28 Specification) */
        <div className="glass-card p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-6 animate-fade-in">
          {/* Question Header & Meta */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 uppercase">
                {currentQ.category}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                {currentQ.question_type}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {currentQ.question_type === 'timed' && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                  timerSeconds <= 5 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-slate-800 text-slate-300'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timerSeconds}s</span>
                </div>
              )}
              <span className="text-xs text-amber-400 font-bold">+{currentQ.xp_value} XP</span>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <div className="text-xs text-slate-400">
              Question {currentQIndex + 1} of {questions.length}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {currentQ.question_text}
            </h2>
            {currentQ.prompt_sanskrit && (
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 text-center font-sanskrit text-2xl font-extrabold text-amber-300">
                {currentQ.prompt_sanskrit}
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectAnswer = opt === currentQ.correct_answer;

              let btnStyle = 'bg-slate-900/90 border-slate-700 hover:border-amber-400 text-slate-200';
              if (isSelected) {
                btnStyle = 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-gold-glow';
              }
              if (isSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-red-500/20 border-red-500 text-red-300 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isSubmitted}
                  className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout when submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1.5 animate-fade-in">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pāṇinian Grammatical Explanation</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {isSubmitted ? (
                selectedAnswer === currentQ.correct_answer ? (
                  <span className="text-emerald-400 font-bold">✓ Correct answer!</span>
                ) : (
                  <span className="text-red-400 font-bold">✗ Incorrect answer</span>
                )
              ) : (
                <span>Select one answer and confirm</span>
              )}
            </div>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-40 text-black font-extrabold text-xs shadow-gold-glow transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs shadow-gold-glow transition-all"
              >
                <span>{currentQIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
