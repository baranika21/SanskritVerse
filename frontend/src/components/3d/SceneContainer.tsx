// ==============================================================================
// SANSKRITVERSE Unified High-Fidelity 3D Scene Container
// Pure single top-quality 3D experience with automatic hardware fallback
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { KnowledgeTree3D } from './KnowledgeTree3D';
import { SanskritTemple3D } from './SanskritTemple3D';
import { FallbackKnowledge2D } from './FallbackKnowledge2D';

export const SceneContainer: React.FC = () => {
  const [activeModel, setActiveModel] = useState<'tree' | 'temple'>('tree');
  const [hasWebGl, setHasWebGl] = useState<boolean>(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGl(!!gl);
    } catch {
      setHasWebGl(false);
    }
  }, []);

  return (
    <div className="relative w-full">
      {/* Model Selector Bar */}
      <div className="flex items-center justify-start gap-2 mb-3 px-1">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-amber-500/20 text-xs">
          <button
            onClick={() => setActiveModel('tree')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeModel === 'tree'
                ? 'bg-amber-500 text-black font-semibold shadow-gold-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🌳 Knowledge Tree (ज्ञानवृक्षः)
          </button>
          <button
            onClick={() => setActiveModel('temple')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeModel === 'temple'
                ? 'bg-amber-500 text-black font-semibold shadow-gold-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏛️ Sanskrit Temple (मन्दिरम्)
          </button>
        </div>
      </div>

      {/* Render 3D or 2D Canvas */}
      <div className="relative">
        {hasWebGl ? (
          activeModel === 'tree' ? <KnowledgeTree3D /> : <SanskritTemple3D />
        ) : (
          <FallbackKnowledge2D />
        )}
      </div>
    </div>
  );
};
