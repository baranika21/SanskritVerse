// ==============================================================================
// SANSKRITVERSE Landing Page
// Hero section, 3D interactive knowledge visualization & floating Sanskrit glyphs
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { SceneContainer } from '../components/3d/SceneContainer';
import {
  Sparkles,
  Bot,
  Brain,
  Cpu,
  Mic,
  ArrowRight,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, triggerOnboarding, isAuthenticated } = useAppStore();

  const floatingGlyphs = [
    { glyph: 'अ', top: '15%', left: '8%', delay: '0s' },
    { glyph: 'आ', top: '25%', right: '10%', delay: '1s' },
    { glyph: 'इ', top: '65%', left: '6%', delay: '2s' },
    { glyph: 'उ', top: '75%', right: '8%', delay: '3s' },
    { glyph: 'क', top: '35%', left: '14%', delay: '1.5s' },
    { glyph: 'ख', top: '80%', left: '16%', delay: '2.5s' },
    { glyph: 'ग', top: '20%', right: '18%', delay: '0.5s' },
    { glyph: 'घ', top: '60%', right: '14%', delay: '3.5s' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      {/* Floating Sanskrit Glyphs Background */}
      {floatingGlyphs.map((item, idx) => (
        <div
          key={idx}
          style={{ top: item.top, left: item.left, right: item.right, animationDelay: item.delay }}
          className="absolute font-sanskrit text-5xl md:text-7xl font-extrabold text-amber-500/10 select-none pointer-events-none animate-float hidden md:block"
        >
          {item.glyph}
        </div>
      ))}

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-gold-glow">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Next-Generation Computational Linguistics for Classical Sanskrit</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Learn Sanskrit. <br />
          <span className="gold-gradient-text">Understand the Language.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-light">
          An AI-powered computational linguistics laboratory for learning Sanskrit through Socratic dialogue, 3D knowledge trees, Pāṇinian morphological parsing, and acoustic speech synthesis.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigateTo('dashboard');
              } else {
                navigateTo('login');
              }
            }}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-sm sm:text-base hover:brightness-110 shadow-gold-glow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Learning'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('acharya')}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl glass-card border border-amber-500/40 text-amber-200 hover:text-white hover:border-amber-400 font-bold text-sm sm:text-base transition-all transform hover:-translate-y-0.5"
          >
            <Bot className="w-5 h-5 text-amber-400" />
            <span>Talk to Acharya AI</span>
          </button>

          <button
            onClick={() => navigateTo('linguistics')}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 font-medium text-sm sm:text-base transition-all"
          >
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>Explore Linguistics Lab</span>
          </button>
        </div>
      </div>

      {/* Central 3D Sanskrit Universe / Knowledge Tree */}
      <div className="max-w-5xl mx-auto mt-12">
        <SceneContainer />
      </div>

      {/* Feature Highlight Grid */}
      <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigateTo('acharya')}
          className="glass-card glass-card-hover p-6 rounded-2xl cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
            Acharya AI Sanskrit Tutor
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Seven interactive pedagogical modes: Socratic tutoring, natural Sanskrit conversations, error diagnosis, exam simulation, and translation with word-by-word Devanagari gloss.
          </p>
        </div>

        <div
          onClick={() => navigateTo('linguistics')}
          className="glass-card glass-card-hover p-6 rounded-2xl cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
            Computational Linguistics Lab
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Pāṇinian tokenization, IAST/Harvard-Kyoto transliteration, morphological parsing, and dynamic Kāraka dependency syntax tree visualization.
          </p>
        </div>

        <div
          onClick={() => navigateTo('grammar')}
          className="glass-card glass-card-hover p-6 rounded-2xl cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
            Grammar Academy & Sandhi Lab
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Interactive visualizer for the eight Vibhaktis, Dhātu root derivational trees (गम्, भू, पठ्), and step-by-step Pāṇinian Sandhi formula simulator.
          </p>
        </div>
      </div>
    </div>
  );
};
