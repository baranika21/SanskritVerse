// ==============================================================================
// SANSKRITVERSE Footer Component
// ==============================================================================

import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const Footer: React.FC = () => {
  const { navigateTo } = useAppStore();

  return (
    <footer className="w-full glass-card border-t border-amber-500/20 py-8 px-6 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-sanskrit text-amber-400 font-bold text-lg">
            ॐ
          </div>
          <div>
            <div className="text-white font-bold text-sm flex items-center gap-1.5">
              <span>SanskritVerse</span>
              <span className="text-[10px] text-amber-400 font-normal">v1.0.0</span>
            </div>
            <p className="text-[11px] text-slate-500">
              AI-Powered Sanskrit Learning & Computational Linguistics Lab
            </p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <button onClick={() => navigateTo('linguistics')} className="hover:text-amber-400 transition-colors">
            Computational Linguistics
          </button>
          <button onClick={() => navigateTo('acharya')} className="hover:text-amber-400 transition-colors">
            Acharya AI
          </button>
          <button onClick={() => navigateTo('grammar')} className="hover:text-amber-400 transition-colors">
            Pāṇinian Grammar
          </button>
          <button onClick={() => navigateTo('practice')} className="hover:text-amber-400 transition-colors">
            Vedic Quizzes
          </button>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} SanskritVerse. Dedicated to Sanskrit Computational Linguistics.</p>
          <p className="font-sanskrit text-amber-500/70 text-xs mt-0.5">सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</p>
        </div>
      </div>
    </footer>
  );
};
