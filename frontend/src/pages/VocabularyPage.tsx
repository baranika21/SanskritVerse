// ==============================================================================
// SANSKRITVERSE Vocabulary Learning & Spaced Repetition Page
// Category filters, 3D interactive flashcards & SM-2 memory retention engine
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { VocabularyWord } from '../types';
import { Flashcard3D } from '../components/vocabulary/Flashcard3D';
import {
  BookmarkCheck,
  Search,
  Sparkles,
  Layers,
  Star,
  CheckCircle2,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { SpeechService } from '../services/speech';

export const VocabularyPage: React.FC = () => {
  const { addXp } = useAppStore();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');

  useEffect(() => {
    const load = async () => {
      try {
        const [wordData, catData] = await Promise.all([
          ApiService.getVocabulary(),
          ApiService.getVocabulary() // extract categories
        ]);
        setWords(wordData.words);
        const uniqueCats = Array.from(new Set(wordData.words.map(w => w.category)));
        setCategories(['All', ...uniqueCats]);
      } catch (err) {
        console.error('Failed to load vocabulary:', err);
      }
    };
    load();
  }, []);

  const filteredWords = words.filter(w => {
    const matchesCat = selectedCategory === 'All' || w.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (
      w.devanagari.includes(q) ||
      w.iast.toLowerCase().includes(q) ||
      w.english.toLowerCase().includes(q)
    );
    return matchesCat && matchesSearch;
  });

  const currentCard = filteredWords[activeCardIndex] || filteredWords[0];

  const handleKnow = async (word: VocabularyWord) => {
    try {
      await ApiService.reviewWord(word.id, 5); // perfect recall
      addXp(15);
    } catch {
      addXp(15);
    }
    if (activeCardIndex < filteredWords.length - 1) {
      setActiveCardIndex(activeCardIndex + 1);
    } else {
      setActiveCardIndex(0);
    }
  };

  const handleReviewAgain = async (word: VocabularyWord) => {
    try {
      await ApiService.reviewWord(word.id, 1); // hard recall
      addXp(5);
    } catch {
      addXp(5);
    }
    if (activeCardIndex < filteredWords.length - 1) {
      setActiveCardIndex(activeCardIndex + 1);
    } else {
      setActiveCardIndex(0);
    }
  };

  const handleSave = async (word: VocabularyWord) => {
    try {
      await ApiService.saveWord(word.id);
      addXp(10);
    } catch {
      addXp(10);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900/90 via-[#0D241E]/80 to-slate-900/90">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Vocabulary & Lexicon Bank</h1>
                <p className="font-sanskrit text-emerald-300 text-xs">शब्दावली पुनरावृत्ति-विज्ञानम्</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('flashcard')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-amber-500 text-black shadow-gold-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Flashcard
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-black shadow-gold-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Words ({words.length})
            </button>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveCardIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FLASHCARD 3D VIEW (Section 16 Specification) */}
      {viewMode === 'flashcard' && currentCard && (
        <div className="flex flex-col items-center space-y-6 pt-4 animate-fade-in">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Card {activeCardIndex + 1} of {filteredWords.length}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{currentCard.category}</span>
          </div>

          <Flashcard3D
            word={currentCard}
            onKnow={handleKnow}
            onReviewAgain={handleReviewAgain}
            onSave={handleSave}
          />

          {/* Card Navigator Dots */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveCardIndex(prev => Math.max(0, prev - 1))}
              disabled={activeCardIndex === 0}
              className="px-4 py-2 rounded-xl glass-card border border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={() => setActiveCardIndex(prev => Math.min(filteredWords.length - 1, prev + 1))}
              disabled={activeCardIndex >= filteredWords.length - 1}
              className="px-4 py-2 rounded-xl glass-card border border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {filteredWords.map(w => (
            <div
              key={w.id}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 space-y-3 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-sanskrit text-2xl font-bold text-amber-300">
                    {w.devanagari}
                  </div>
                  <div className="text-xs font-mono text-slate-400 italic mt-0.5">
                    {w.iast}
                  </div>
                </div>
                <button
                  onClick={() => SpeechService.speak(w.devanagari)}
                  className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:text-white"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm font-semibold text-white">
                {w.english}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="font-sanskrit text-amber-200">{w.example_sanskrit}</div>
                <div className="text-[11px] text-slate-400">{w.example_english}</div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                <span className="capitalize">{w.category}</span>
                <span className="capitalize text-amber-400/80">{w.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
