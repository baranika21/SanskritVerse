// ==============================================================================
// SANSKRITVERSE Interactive 3D Flip Flashcard Component
// Front: Devanagari | Back: IAST, English, Root, Example | SM-2 Review Actions
// ==============================================================================

import React, { useState } from 'react';
import { VocabularyWord } from '../../types';
import { SpeechService } from '../../services/speech';
import { Volume2, Star, Check, RotateCcw } from 'lucide-react';

interface Flashcard3DProps {
  word: VocabularyWord;
  onKnow: (word: VocabularyWord) => void;
  onReviewAgain: (word: VocabularyWord) => void;
  onSave?: (word: VocabularyWord) => void;
  isSaved?: boolean;
}

export const Flashcard3D: React.FC<Flashcard3DProps> = ({
  word,
  onKnow,
  onReviewAgain,
  onSave,
  isSaved = false
}) => {
  const [flipped, setFlipped] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    SpeechService.speak(word.devanagari);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    if (onSave) onSave(word);
  };

  return (
    <div className="w-full max-w-sm h-80 perspective-1000 select-none">
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative w-full h-full duration-500 transform-style-3d cursor-pointer transition-transform ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-2xl glass-card border border-amber-500/30 p-6 flex flex-col justify-between items-center text-center backface-hidden shadow-gold-glow-lg bg-gradient-to-b from-slate-900/90 via-[#170B28]/80 to-slate-950">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
              {word.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className="p-2 rounded-xl bg-slate-800/80 text-amber-400 hover:text-amber-200 hover:bg-slate-700 transition-colors"
                title="Listen Pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className={`p-2 rounded-xl transition-colors ${
                  saved ? 'bg-amber-500 text-black' : 'bg-slate-800/80 text-slate-400 hover:text-amber-400'
                }`}
                title="Save Word"
              >
                <Star className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          <div className="my-auto space-y-3">
            <div className="font-sanskrit text-5xl font-extrabold gold-gradient-text drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              {word.devanagari}
            </div>
            <div className="text-xs text-slate-400 tracking-wider font-mono">
              [Click card to reveal meaning & root]
            </div>
          </div>

          <div className="w-full text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span className="capitalize">{word.gender} {word.word_type}</span>
            <span className="capitalize text-amber-400/80">{word.difficulty}</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-2xl glass-card border border-blue-500/40 p-6 flex flex-col justify-between items-center text-center backface-hidden rotate-y-180 shadow-2xl bg-gradient-to-b from-[#111827] via-[#1E1438] to-[#0B0F19]">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-sanskrit text-lg font-bold text-amber-300">
              {word.devanagari}
            </span>
            <button
              onClick={handleSpeak}
              className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:text-white"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xl font-bold text-white tracking-wide">
              {word.english}
            </div>
            <div className="text-sm font-mono text-amber-400 italic">
              {word.iast}
            </div>
            {word.root && (
              <div className="text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
                Root: <span className="font-sanskrit text-amber-300 font-semibold">{word.root}</span>
              </div>
            )}
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-left text-xs space-y-1">
              <div className="font-sanskrit text-amber-200">{word.example_sanskrit}</div>
              <div className="text-[11px] text-slate-400">{word.example_english}</div>
            </div>
          </div>

          {/* SM-2 Review Action Buttons */}
          <div className="w-full flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReviewAgain(word);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review again</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onKnow(word);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-semibold transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>I know this</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
