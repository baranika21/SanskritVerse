// ==============================================================================
// SANSKRITVERSE 2D Fallback Interactive Knowledge Tree (Mandala Architecture)
// Used when 2D mode is selected or WebGL is unavailable
// ==============================================================================

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PageView } from '../../types';
import { BookOpen, Brain, Mic, Languages, Sparkles, MessageSquare, Trophy } from 'lucide-react';

interface BranchNode {
  id: string;
  titleSanskrit: string;
  titleEnglish: string;
  view: PageView;
  icon: any;
  angleDeg: number;
  radius: number;
  color: string;
  description: string;
}

export const FallbackKnowledge2D: React.FC = () => {
  const { navigateTo } = useAppStore();
  const [hoveredNode, setHoveredNode] = useState<BranchNode | null>(null);

  const branches: BranchNode[] = [
    { id: 'vocab', titleSanskrit: 'शब्दावली', titleEnglish: 'Vocabulary', view: 'vocabulary', icon: BookOpen, angleDeg: -90, radius: 150, color: '#F59E0B', description: 'Explore spaced-repetition flashcards and 100+ authentic root words' },
    { id: 'grammar', titleSanskrit: 'व्याकरणम्', titleEnglish: 'Grammar Academy', view: 'grammar', icon: Brain, angleDeg: -35, radius: 165, color: '#3B82F6', description: 'Master 8 Vibhaktis, Dhātu roots, and Sandhi rules' },
    { id: 'pronounce', titleSanskrit: 'उच्चारणम्', titleEnglish: 'Pronunciation Lab', view: 'pronunciation', icon: Mic, angleDeg: 25, radius: 155, color: '#EC4899', description: 'Practice oral articulation with waveform analysis & phonetic feedback' },
    { id: 'translate', titleSanskrit: 'अनुवादः', titleEnglish: 'Translation Lab', view: 'translation', icon: Languages, angleDeg: 80, radius: 160, color: '#10B981', description: 'Bidirectional Sanskrit-English semantic translation' },
    { id: 'linguistics', titleSanskrit: 'भाषाविज्ञानम्', titleEnglish: 'Linguistics Lab', view: 'linguistics', icon: Sparkles, angleDeg: 140, radius: 170, color: '#8B5CF6', description: 'Tokenization, multi-script transliteration & Kāraka dependency graphs' },
    { id: 'convo', titleSanskrit: 'संवादः', titleEnglish: 'Acharya AI Tutor', view: 'acharya', icon: MessageSquare, angleDeg: 200, radius: 160, color: '#EAB308', description: 'Socratic dialogue partner across 7 pedagogical tutoring modes' },
    { id: 'quizzes', titleSanskrit: 'अभ्यासः', titleEnglish: 'Practice & Quizzes', view: 'practice', icon: Trophy, angleDeg: 255, radius: 165, color: '#F97316', description: 'Interactive MCQ, arrange sentence, and timed challenges' }
  ];

  const centerX = 250;
  const centerY = 230;

  return (
    <div className="relative w-full h-[480px] rounded-2xl glass-card overflow-hidden flex items-center justify-center p-4">
      {/* Background Mandala Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#170B28]/40 via-[#0B0F19] to-[#0B0F19] pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <svg className="w-full max-w-[500px] h-[440px] select-none" viewBox="0 0 500 460">
        <defs>
          <radialGradient id="treeCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FDE047" stop-opacity="0.9" />
            <stop offset="60%" stop-color="#F59E0B" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#B45309" stop-opacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Orbit Circles */}
        <circle cx={centerX} cy={centerY} r="160" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeDasharray="4 4" />
        <circle cx={centerX} cy={centerY} r="100" fill="none" stroke="rgba(139, 92, 246, 0.12)" strokeDasharray="6 6" />

        {/* Connecting Branch Lines */}
        {branches.map(b => {
          const rad = (b.angleDeg * Math.PI) / 180;
          const x = centerX + b.radius * Math.cos(rad);
          const y = centerY + b.radius * Math.sin(rad);
          const isHovered = hoveredNode?.id === b.id;

          return (
            <g key={b.id}>
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={isHovered ? b.color : 'rgba(245, 158, 11, 0.3)'}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={isHovered ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
              />
              <circle
                cx={(centerX + x) / 2}
                cy={(centerY + y) / 2}
                r={isHovered ? 3.5 : 2}
                fill={b.color}
                opacity={0.8}
              />
            </g>
          );
        })}

        {/* Central Core: Sacred Sanskrit Knowledge Trunk */}
        <circle
          cx={centerX}
          cy={centerY}
          r="48"
          fill="url(#treeCenterGlow)"
          className="cursor-pointer animate-pulse-slow"
          onClick={() => navigateTo('dashboard')}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r="38"
          fill="#0B0F19"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          fill="#FDE047"
          fontSize="30"
          fontWeight="bold"
          fontFamily="'Noto Sans Devanagari', 'Yatra One', serif"
          className="pointer-events-none"
        >
          ज्ञान
        </text>

        {/* Outer Branch Nodes */}
        {branches.map(b => {
          const rad = (b.angleDeg * Math.PI) / 180;
          const x = centerX + b.radius * Math.cos(rad);
          const y = centerY + b.radius * Math.sin(rad);
          const isHovered = hoveredNode?.id === b.id;

          return (
            <g
              key={b.id}
              className="cursor-pointer transition-transform duration-300"
              onMouseEnter={() => setHoveredNode(b)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => navigateTo(b.view)}
            >
              {/* Outer Glow Ring */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 30 : 25}
                fill="#111827"
                stroke={b.color}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={isHovered ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
              />
              {/* Node Title in Sanskrit */}
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize={isHovered ? '13' : '11'}
                fontWeight="600"
                fontFamily="'Noto Sans Devanagari', sans-serif"
                className="select-none pointer-events-none transition-all duration-300"
              >
                {b.titleSanskrit}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Info Card when node hovered */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl glass-card border border-amber-500/40 text-center max-w-sm animate-fade-in shadow-gold-glow">
          <div className="text-amber-400 font-bold text-sm flex items-center justify-center gap-2">
            <span>{hoveredNode.titleSanskrit}</span>
            <span className="text-slate-400">•</span>
            <span>{hoveredNode.titleEnglish}</span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">{hoveredNode.description}</p>
          <span className="text-[10px] text-amber-500/90 tracking-wide font-medium mt-1 inline-block">Click branch to enter module →</span>
        </div>
      )}

      {/* Mode Indicator Overlay */}
      <div className="absolute top-4 left-4 text-[11px] text-amber-400/80 bg-black/40 px-3 py-1 rounded-full border border-amber-500/20">
        🌱 Sanskrit Knowledge Tree (2D Mode)
      </div>
    </div>
  );
};
