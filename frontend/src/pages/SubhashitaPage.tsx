// ==============================================================================
// SANSKRITVERSE Subhāṣita & Calligraphy Wisdom Card Studio
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { Subhashita } from '../types';
import { 
  Sparkles, 
  Volume2, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Heart, 
  Sun,
  Flame,
  Award
} from 'lucide-react';

export const SubhashitaPage: React.FC = () => {
  const [subhashitas, setSubhashitas] = useState<Subhashita[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [cardTheme, setCardTheme] = useState<'gold' | 'vedic' | 'himalaya' | 'royal'>('gold');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSubhashitas();
  }, []);

  const loadSubhashitas = async () => {
    try {
      const data = await ApiService.getSubhashitas();
      if (data.subhashitas && data.subhashitas.length > 0) {
        setSubhashitas(data.subhashitas);
      }
    } catch (err) {
      console.error('Failed to load subhashitas', err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playAudio = (text: string) => {
    SpeechService.speak(text);
  };

  const activeSubhashita = subhashitas[selectedIdx] || subhashitas[0];

  if (!activeSubhashita) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  const getThemeStyles = () => {
    switch (cardTheme) {
      case 'gold':
        return 'from-[#2A1E0D] via-[#1E150A] to-[#3B2A10] border-amber-500/40 text-amber-100 shadow-amber-950/50';
      case 'vedic':
        return 'from-[#1A1024] via-[#0F0B18] to-[#2D163F] border-purple-500/40 text-purple-100 shadow-purple-950/50';
      case 'himalaya':
        return 'from-[#0A192F] via-[#071120] to-[#112A45] border-cyan-500/40 text-cyan-100 shadow-cyan-950/50';
      case 'royal':
        return 'from-[#1E0E12] via-[#14090C] to-[#2E121B] border-rose-500/40 text-rose-100 shadow-rose-950/50';
      default:
        return 'from-[#2A1E0D] via-[#1E150A] to-[#3B2A10] border-amber-500/40 text-amber-100 shadow-amber-950/50';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#201509] via-[#120B04] to-[#2E1E0E] p-6 sm:p-7 border border-amber-500/30 shadow-2xl flex items-center justify-between">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> सुभाषित रत्नभाण्डागारम्
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 font-sanskrit tracking-wide">
            सुभाषित-मञ्जरी — Timeless Wisdom Studio
          </h1>
        </div>
        <div className="hidden sm:block text-xs font-mono uppercase px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
          Wisdom & Calligraphy
        </div>
      </div>

      {/* Selector pills */}
      <div className="flex flex-wrap gap-2">
        {subhashitas.map((sub, idx) => (
          <button
            key={sub.id}
            onClick={() => setSelectedIdx(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              selectedIdx === idx
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-amber-500/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Verse {sub.id}: {sub.source}</span>
          </button>
        ))}
      </div>

      {/* Main Calligraphy Card Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Canvas Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`relative rounded-3xl bg-gradient-to-br ${getThemeStyles()} border p-8 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[420px]`}>
            {/* Top decorative banner */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest opacity-80">
                {activeSubhashita.source} • {activeSubhashita.meter}
              </span>
              <span className="text-amber-400 text-lg">🕉️</span>
            </div>

            {/* Central Calligraphy Verse */}
            <div className="my-8 text-center space-y-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sanskrit leading-relaxed tracking-wider whitespace-pre-line drop-shadow-md">
                {activeSubhashita.verseSanskrit}
              </div>
              <div className="text-xs sm:text-sm font-mono opacity-80 italic max-w-xl mx-auto whitespace-pre-line">
                {activeSubhashita.verseIast}
              </div>
            </div>

            {/* English Translation Quote */}
            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-sm italic opacity-95 leading-relaxed">
                "{activeSubhashita.englishTranslation}"
              </p>
              <div className="text-[10px] uppercase font-mono tracking-widest opacity-60 mt-2">
                — SanskritVerse • AI Computational Linguistics Lab
              </div>
            </div>
          </div>

          {/* Theme Switcher & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Card Theme:</span>
              <button
                onClick={() => setCardTheme('gold')}
                className={`w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 ${
                  cardTheme === 'gold' ? 'border-white scale-110' : 'border-transparent opacity-60'
                }`}
                title="Temple Gold"
              />
              <button
                onClick={() => setCardTheme('vedic')}
                className={`w-6 h-6 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-400 border-2 ${
                  cardTheme === 'vedic' ? 'border-white scale-110' : 'border-transparent opacity-60'
                }`}
                title="Vedic Purple"
              />
              <button
                onClick={() => setCardTheme('himalaya')}
                className={`w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-900 to-sky-400 border-2 ${
                  cardTheme === 'himalaya' ? 'border-white scale-110' : 'border-transparent opacity-60'
                }`}
                title="Himalayan Dawn"
              />
              <button
                onClick={() => setCardTheme('royal')}
                className={`w-6 h-6 rounded-full bg-gradient-to-tr from-rose-900 to-pink-400 border-2 ${
                  cardTheme === 'royal' ? 'border-white scale-110' : 'border-transparent opacity-60'
                }`}
                title="Royal Rose"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playAudio(activeSubhashita.verseSanskrit)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>
              <button
                onClick={() => handleCopy(`${activeSubhashita.verseSanskrit}\n\n${activeSubhashita.englishTranslation}\n— ${activeSubhashita.source}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Verse'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Linguistic & Philosophical Deep-Dive */}
        <div className="lg:col-span-5 space-y-4">
          {/* Philosophical Commentary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4" /> Philosophical Purport (भावार्थः)
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {activeSubhashita.philosophicalPurport}
            </p>
          </div>

          {/* Word-by-Word Vocabulary Meaning */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Word Meanings (पदार्थः)
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeSubhashita.wordMeanings.map((wm, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-800/60 text-xs">
                  <span className="font-sanskrit text-amber-300 font-bold text-sm">{wm.word}</span>
                  <span className="text-slate-400 text-right">{wm.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar & Sandhi Notes */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" /> Vyākaraṇa Insight (व्याकरण-विशेषः)
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {activeSubhashita.grammarNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
