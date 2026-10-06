// ==============================================================================
// SANSKRITVERSE Interactive Sentence Builder Page
// Drag & drop / slot arrangement with syntactic validation, +10 XP & explanations
// ==============================================================================

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  PenTool,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';
import { SpeechService } from '../services/speech';

interface BuilderExercise {
  id: number;
  englishPrompt: string;
  words: Array<{ id: string; text: string; role: string; iast: string }>;
  correctSequence: string[];
  explanation: string;
}

export const SentenceBuilderPage: React.FC = () => {
  const { addXp } = useAppStore();

  const exercises: BuilderExercise[] = [
    {
      id: 1,
      englishPrompt: 'Rama goes to the forest.',
      words: [
        { id: 'w1', text: 'गच्छति', role: 'Verb (Kriyā)', iast: 'gacchati' },
        { id: 'w2', text: 'रामः', role: 'Subject (Kartā)', iast: 'rāmaḥ' },
        { id: 'w3', text: 'वनम्', role: 'Destination (Karma)', iast: 'vanam' }
      ],
      correctSequence: ['रामः', 'वनम्', 'गच्छति'],
      explanation: 'In standard Sanskrit sentence order (S-O-V), the subject (रामः) comes first in nominative case, followed by the destination in accusative case (वनम्), followed by the conjugated finite verb (गच्छति).'
    },
    {
      id: 2,
      englishPrompt: 'The boy reads a book.',
      words: [
        { id: 'w1', text: 'पठति', role: 'Verb (Kriyā)', iast: 'paṭhati' },
        { id: 'w2', text: 'बालकः', role: 'Subject (Kartā)', iast: 'bālakaḥ' },
        { id: 'w3', text: 'पुस्तकम्', role: 'Object (Karma)', iast: 'pustakam' }
      ],
      correctSequence: ['बालकः', 'पुस्तकम्', 'पठति'],
      explanation: 'बालकः (Boy) is the agent in Prathamā, पुस्तकम् (Book) is the accusative object, and पठति is the 3rd person singular present verb.'
    },
    {
      id: 3,
      englishPrompt: 'I study Sanskrit every day.',
      words: [
        { id: 'w1', text: 'पठामि', role: 'Verb (1st Sg)', iast: 'paṭhāmi' },
        { id: 'w2', text: 'अहम्', role: 'Subject (I)', iast: 'aham' },
        { id: 'w3', text: 'प्रतिदिनम्', role: 'Adverb (Daily)', iast: 'pratidinam' },
        { id: 'w4', text: 'संस्कृतम्', role: 'Object (Sanskrit)', iast: 'saṃskṛtam' }
      ],
      correctSequence: ['अहम्', 'प्रतिदिनम्', 'संस्कृतम्', 'पठामि'],
      explanation: 'Subject "अहम्" governs 1st person ending "-आमि" in "पठामि". The adverb "प्रतिदिनम्" and object "संस्कृतम्" precede the verb.'
    }
  ];

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const exercise = exercises[currentExerciseIdx];

  const [selectedWords, setSelectedWords] = useState<any[]>([]);
  const [availableWords, setAvailableWords] = useState<any[]>(exercise.words);
  const [resultStatus, setResultStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const handlePickWord = (word: any) => {
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter(w => w.id !== word.id));
    setResultStatus('idle');
  };

  const handleRemoveWord = (word: any) => {
    setAvailableWords([...availableWords, word]);
    setSelectedWords(selectedWords.filter(w => w.id !== word.id));
    setResultStatus('idle');
  };

  const handleReset = () => {
    setSelectedWords([]);
    setAvailableWords(exercise.words);
    setResultStatus('idle');
  };

  const handleCheck = () => {
    const arrangedSequence = selectedWords.map(w => w.text);
    const isCorrect = JSON.stringify(arrangedSequence) === JSON.stringify(exercise.correctSequence);

    if (isCorrect) {
      setResultStatus('correct');
      addXp(10);
      SpeechService.speak(arrangedSequence.join(' '));
    } else {
      setResultStatus('incorrect');
    }
  };

  const handleNext = () => {
    const nextIdx = (currentExerciseIdx + 1) % exercises.length;
    setCurrentExerciseIdx(nextIdx);
    setSelectedWords([]);
    setAvailableWords(exercises[nextIdx].words);
    setResultStatus('idle');
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900/90 via-[#261E0E]/80 to-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sanskrit Sentence Builder</h1>
            <p className="font-sanskrit text-amber-300 text-xs">वाक्य-रचना-शिल्पम्</p>
          </div>
        </div>
        <div className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
          Syntactic Builder
        </div>
      </div>

      {/* Main Exercise Card (Section 25 Specification) */}
      <div className="glass-card p-8 rounded-3xl border border-amber-500/40 shadow-gold-glow space-y-6">
        {/* Prompt */}
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Exercise {currentExerciseIdx + 1} of {exercises.length}
          </div>
          <div className="text-2xl font-extrabold text-white">
            "{exercise.englishPrompt}"
          </div>
          <p className="text-xs text-slate-400">Click or drag words into the sentence slot in correct order:</p>
        </div>

        {/* Droppable Sentence Slot */}
        <div className="min-h-[90px] p-4 rounded-2xl bg-slate-950/80 border-2 border-dashed border-amber-500/40 flex flex-wrap items-center justify-center gap-3">
          {selectedWords.length === 0 ? (
            <span className="text-xs text-slate-500 italic">
              Tap words below to place them here...
            </span>
          ) : (
            selectedWords.map((w, i) => (
              <button
                key={w.id}
                onClick={() => handleRemoveWord(w)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-sanskrit text-xl font-extrabold shadow-md hover:scale-105 transition-all animate-fade-in"
              >
                {w.text}
              </button>
            ))
          )}
        </div>

        {/* Word Pool */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            Available Sanskrit Word Cards
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            {availableWords.map(w => (
              <button
                key={w.id}
                onClick={() => handlePickWord(w)}
                className="px-5 py-3 rounded-2xl glass-card border border-amber-500/40 hover:border-amber-400 text-center hover:scale-105 transition-all shadow-sm group"
              >
                <div className="font-sanskrit text-2xl font-bold text-amber-300 group-hover:text-white">
                  {w.text}
                </div>
                <div className="text-[10px] text-slate-400 font-mono italic">{w.iast}</div>
                <div className="text-[9px] text-amber-500/80 font-medium">{w.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Result Message Card */}
        {resultStatus === 'correct' && (
          <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-left space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>✓ Correct! (+10 XP)</span>
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:brightness-110 transition-all"
              >
                <span>Next Sentence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              💡 <strong>Why it's correct</strong>: {exercise.explanation}
            </p>
          </div>
        )}

        {resultStatus === 'incorrect' && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Not quite right. In standard Sanskrit, check whether the subject precedes the object and verb.</span>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-200 text-xs font-semibold hover:bg-red-500/30"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Arrangement</span>
          </button>

          <button
            onClick={handleCheck}
            disabled={selectedWords.length === 0 || resultStatus === 'correct'}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 disabled:opacity-40 text-black font-extrabold text-sm shadow-gold-glow transition-all"
          >
            Verify Sentence
          </button>
        </div>
      </div>
    </div>
  );
};
