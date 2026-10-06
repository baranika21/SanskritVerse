// ==============================================================================
// SANSKRITVERSE Graded Story & Manuscript Reader (कथा एवं पाण्डुलिपि)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { GradedStory } from '../types';
import { 
  BookOpen, 
  Scroll, 
  Volume2, 
  Sparkles, 
  Eye, 
  Info, 
  CheckCircle2, 
  ChevronRight, 
  Layers,
  Search,
  BookMarked,
  Share2
} from 'lucide-react';

export const ManuscriptReaderPage: React.FC = () => {
  const [stories, setStories] = useState<GradedStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<GradedStory | null>(null);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [selectedWordInfo, setSelectedWordInfo] = useState<{ word: string; stem: string; grammar: string; meaning: string } | null>(null);
  const [displayMode, setDisplayMode] = useState<'manuscript' | 'modern' | 'anvaya'>('manuscript');
  const [showPadachheda, setShowPadachheda] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await ApiService.getStories();
      if (data.stories && data.stories.length > 0) {
        setStories(data.stories);
        setSelectedStory(data.stories[0]);
      }
    } catch (err) {
      console.error('Failed to load stories', err);
    }
  };

  const playSentenceAudio = (text: string) => {
    setIsPlaying(true);
    SpeechService.speak(text);
    setTimeout(() => setIsPlaying(false), 2500);
  };

  if (!selectedStory) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  const currentSentence = selectedStory.sentences[activeSentenceIndex] || selectedStory.sentences[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2A1B0E] via-[#1A1412] to-[#3D2514] p-6 sm:p-7 border border-amber-600/30 shadow-2xl flex items-center justify-between">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-2">
            <Scroll className="w-3.5 h-3.5" /> कथा एवं पाण्डुलिपि
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-100 font-sanskrit tracking-wide">
            संस्कृत कथा-मञ्जरी — Manuscript Reader
          </h1>
        </div>
        <div className="hidden sm:block text-xs font-mono uppercase px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
          Graded Stories
        </div>
      </div>

      {/* Story Selector & Settings Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => {
                setSelectedStory(story);
                setActiveSentenceIndex(0);
                setSelectedWordInfo(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                selectedStory.id === story.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700/60 hover:border-amber-500/40 hover:text-amber-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{story.titleSanskrit} ({story.title})</span>
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setDisplayMode('manuscript')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              displayMode === 'manuscript' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📜 Palm Leaf Manuscript
          </button>
          <button
            onClick={() => setDisplayMode('modern')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              displayMode === 'modern' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📖 Modern Typography
          </button>
          <button
            onClick={() => setDisplayMode('anvaya')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              displayMode === 'anvaya' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔍 Anvaya (Prose Order)
          </button>
        </div>
      </div>

      {/* Main Manuscript Reader Card */}
      <div className={`relative rounded-3xl border transition-all duration-300 shadow-2xl p-8 sm:p-10 ${
        displayMode === 'manuscript'
          ? 'bg-gradient-to-b from-[#2B1B10] via-[#1F140C] to-[#160E08] border-amber-700/40 text-amber-100 shadow-amber-950/40'
          : 'bg-slate-900/90 border-slate-800 text-slate-100'
      }`}>
        {/* Story Metadata */}
        <div className="flex justify-between items-center pb-6 border-b border-amber-500/20 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80">
              Source: {selectedStory.source} • Level: {selectedStory.difficulty}
            </span>
            <h2 className="text-2xl font-bold font-sanskrit text-amber-200 mt-1">
              {selectedStory.titleSanskrit} — {selectedStory.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playSentenceAudio(currentSentence.sanskrit)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-2 text-xs font-semibold transition-colors"
            >
              <Volume2 className="w-4 h-4" /> Listen Recitation
            </button>
            <button
              onClick={() => setShowPadachheda(!showPadachheda)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                showPadachheda ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              Sandhi Split ({showPadachheda ? 'ON' : 'OFF'})
            </button>
          </div>
        </div>

        {/* Primary Interactive Sentence Viewer */}
        <div className="space-y-6">
          {/* Devanagari Interactive Word Tiles */}
          <div>
            <div className="text-xs text-amber-400/70 font-mono mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Click any Sanskrit word to inspect root, case & meaning:
            </div>
            <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-black/30 border border-amber-500/10">
              {currentSentence.words.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWordInfo(w)}
                  className={`px-3.5 py-2 rounded-xl font-sanskrit text-xl sm:text-2xl transition-all ${
                    selectedWordInfo?.word === w.word
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105'
                      : 'bg-amber-950/40 text-amber-200 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/20'
                  }`}
                >
                  {w.word}
                </button>
              ))}
            </div>
          </div>

          {/* IAST Transliteration */}
          <div className="text-sm font-mono text-amber-300/80 italic pl-1">
            {currentSentence.iast}
          </div>

          {/* Sandhi Split (Padachheda) */}
          {showPadachheda && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                पदच्छेदः (Word-by-Word Sandhi Dissolution):
              </div>
              <div className="font-sanskrit text-base text-amber-200">
                {currentSentence.padachheda}
              </div>
            </div>
          )}

          {/* Anvaya (Syntactic Prose Order) */}
          {displayMode === 'anvaya' && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                अन्वयः (Syntactic Prose Order):
              </div>
              <div className="font-sanskrit text-base text-indigo-200">
                {currentSentence.anvaya}
              </div>
            </div>
          )}

          {/* English Translation */}
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              English Translation:
            </div>
            <div className="text-sm sm:text-base text-slate-200 leading-relaxed">
              "{currentSentence.english}"
            </div>
          </div>

          {/* Word Inspector Card (Shows when clicked) */}
          {selectedWordInfo && (
            <div className="bg-gradient-to-r from-amber-950/60 to-slate-950/80 border border-amber-500/40 rounded-2xl p-5 animate-fadeIn">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-300 font-sanskrit">{selectedWordInfo.word}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono">
                      Stem: {selectedWordInfo.stem}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-300 font-semibold font-mono">
                    Grammar: {selectedWordInfo.grammar}
                  </div>
                  <div className="text-sm text-slate-200">
                    Meaning: <strong className="text-amber-200">{selectedWordInfo.meaning}</strong>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWordInfo(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-mono"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sentence Navigation Footer */}
        <div className="flex justify-between items-center pt-8 mt-8 border-t border-amber-500/20">
          <button
            disabled={activeSentenceIndex === 0}
            onClick={() => {
              setActiveSentenceIndex(activeSentenceIndex - 1);
              setSelectedWordInfo(null);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:border-amber-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            ← Previous Sentence
          </button>

          <span className="text-xs font-mono text-amber-400">
            Sentence {activeSentenceIndex + 1} of {selectedStory.sentences.length}
          </span>

          <button
            disabled={activeSentenceIndex === selectedStory.sentences.length - 1}
            onClick={() => {
              setActiveSentenceIndex(activeSentenceIndex + 1);
              setSelectedWordInfo(null);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            Next Sentence <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
