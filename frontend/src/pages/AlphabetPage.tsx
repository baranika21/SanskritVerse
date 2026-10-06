// ==============================================================================
// SANSKRITVERSE Alphabet (Varṇamālā) Page
// Interactive Devanagari grid: Swaras, Vyañjanas, Articulation Sthānas & Audio
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { Type, Volume2, Sparkles, BookOpen } from 'lucide-react';

export const AlphabetPage: React.FC = () => {
  const [alphabetData, setAlphabetData] = useState<any>(null);
  const [selectedLetter, setSelectedLetter] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ApiService.getAlphabet();
        setAlphabetData(data);
        if (data.swaras?.length > 0) {
          setSelectedLetter(data.swaras[0]);
        }
      } catch (err) {
        console.error('Failed to load alphabet:', err);
      }
    };
    load();
  }, []);

  const handleSelect = (item: any) => {
    setSelectedLetter(item);
    SpeechService.speak(item.letter);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900/90 via-[#1E1438]/80 to-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sanskrit Alphabet (Varṇamālā)</h1>
            <p className="font-sanskrit text-amber-300 text-xs">देवनागरी वर्णमाला उच्चारणस्थानानि च</p>
          </div>
        </div>
        <div className="text-xs text-amber-300 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
          Phonetic Matrix
        </div>
      </div>

      {/* Selected Letter Detail Spotlight */}
      {selectedLetter && (
        <div className="glass-card p-6 rounded-2xl border border-amber-500/40 shadow-gold-glow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center font-sanskrit text-5xl font-extrabold text-amber-300">
                {selectedLetter.letter}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono text-white font-bold">{selectedLetter.iast}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedLetter.type || 'Consonant (व्यञ्जनम्)'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Point of Articulation (स्थानम्): <strong className="text-amber-300 font-sanskrit">{selectedLetter.sthana || 'मुखस्थानम्'}</strong>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Vedic Example: <strong className="font-sanskrit text-white">{selectedLetter.example}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => SpeechService.speak(selectedLetter.letter)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-gold-glow transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen Pronunciation</span>
          </button>
        </div>
      )}

      {/* 1. SWARAS (Vowels) GRID */}
      {alphabetData?.swaras && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="font-sanskrit text-amber-400 text-lg">स्वराः</span>
              <span>— The Sanskrit Vowels (11 Pure Tones)</span>
            </h2>
            <span className="text-xs text-slate-400">Independent sounds</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2.5">
            {alphabetData.swaras.map((s: any, idx: number) => {
              const isSelected = selectedLetter?.letter === s.letter;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(s)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow scale-105'
                      : 'bg-slate-900/80 border-slate-700 hover:border-amber-500/50 text-white'
                  }`}
                >
                  <div className="font-sanskrit text-2xl font-bold">{s.letter}</div>
                  <div className="text-[11px] font-mono opacity-80 mt-0.5">{s.iast}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VYANJANAS (Consonant Vargas) GRID */}
      {alphabetData?.vargas && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="font-sanskrit text-blue-400 text-lg">व्यञ्जनानि</span>
            <span>— The Five Consonantal Vargas (25 Articulated Stops)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {alphabetData.vargas.map((varga: any, vIdx: number) => (
              <div key={vIdx} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-300 font-sanskrit">{varga.name}</div>
                <div className="text-[10px] text-slate-400">{varga.sthana}</div>

                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {varga.letters.map((l: any, lIdx: number) => {
                    const isSelected = selectedLetter?.letter === l.letter;
                    return (
                      <div
                        key={lIdx}
                        onClick={() => handleSelect({ ...l, sthana: varga.sthana })}
                        className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow'
                            : 'bg-slate-900/80 border-slate-700 hover:border-amber-400 text-white'
                        }`}
                      >
                        <div className="font-sanskrit text-lg font-bold">{l.letter}</div>
                        <div className="text-[9px] font-mono opacity-70">{l.iast}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
