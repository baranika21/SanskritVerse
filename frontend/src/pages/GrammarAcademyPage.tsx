// ==============================================================================
// SANSKRITVERSE Grammar Academy & Sandhi Lab Page
// 8 Vibhaktis Visualizer, Dhātu Root Explorer Tree & Interactive Sandhi Formula Lab
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { SandhiResult } from '../types';
import {
  Brain,
  Sparkles,
  GitBranch,
  Volume2,
  Table,
  BookOpen,
  ArrowRight,
  Layers
} from 'lucide-react';

export const GrammarAcademyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vibhaktis' | 'dhatu' | 'sandhi' | 'samasa'>('vibhaktis');
  const [vibhaktis, setVibhaktis] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [declensionTable, setDeclensionTable] = useState<any>(null);
  const [selectedStem, setSelectedStem] = useState<string>('राम');

  // Dhātu Explorer state
  const [selectedRoot, setSelectedRoot] = useState<string>('गम्');
  const [dhatuData, setDhatuData] = useState<any>(null);

  // Sandhi Lab state
  const [sandhiWord1, setSandhiWord1] = useState('राम');
  const [sandhiWord2, setSandhiWord2] = useState('इति');
  const [sandhiResult, setSandhiResult] = useState<SandhiResult | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [vibData, decData, dhData] = await Promise.all([
          ApiService.getVibhaktis(),
          ApiService.getDeclensionMatrix('राम'),
          ApiService.getDhatuTree('गम्')
        ]);
        setVibhaktis(vibData.vibhaktis);
        setSelectedCase(vibData.vibhaktis[0]);
        setDeclensionTable(decData);
        setDhatuData(dhData);
      } catch (err) {
        console.error('Error loading grammar data:', err);
      }
    };
    load();
    handleRunSandhi('राम', 'इति');
  }, []);

  const handleSelectStem = async (stem: string) => {
    setSelectedStem(stem);
    try {
      const data = await ApiService.getDeclensionMatrix(stem);
      setDeclensionTable(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectRoot = async (root: string) => {
    setSelectedRoot(root);
    try {
      const data = await ApiService.getDhatuTree(root);
      setDhatuData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunSandhi = async (w1?: string, w2?: string) => {
    const p1 = w1 || sandhiWord1;
    const p2 = w2 || sandhiWord2;
    if (!p1.trim() || !p2.trim()) return;

    try {
      const res = await ApiService.resolveSandhi(p1, p2);
      setSandhiResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-900/90 via-[#131E3A]/80 to-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Grammar Academy</h1>
            <p className="font-sanskrit text-blue-300 text-xs">पाणिनीय-व्याकरण-पीठम्</p>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {[
            { id: 'vibhaktis', label: '8 Vibhaktis (Cases)', icon: Table },
            { id: 'dhatu', label: 'Dhātu Root Explorer', icon: GitBranch },
            { id: 'sandhi', label: 'Sandhi Lab', icon: Sparkles },
            { id: 'samasa', label: 'Samāsa (Compounds)', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. VIBHAKTI VISUALIZER (Section 22 Specification) */}
      {activeTab === 'vibhaktis' && (
        <div className="space-y-6 animate-fade-in">
          {/* Interactive 8 Cases Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {vibhaktis.map((v) => {
              const isSelected = selectedCase?.case_num === v.case_num;
              return (
                <div
                  key={v.case_num}
                  onClick={() => setSelectedCase(v)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow scale-105'
                      : 'glass-card border-slate-800 hover:border-amber-500/40 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold opacity-75">
                    Case {v.case_num}
                  </div>
                  <div className="font-sanskrit text-base font-bold my-0.5">
                    {v.sanskrit}
                  </div>
                  <div className="text-[10px] truncate opacity-90">
                    {v.english}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Case Detail Card */}
          {selectedCase && (
            <div className="glass-card p-6 rounded-2xl border border-amber-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-sanskrit text-3xl font-extrabold text-amber-300">
                      {selectedCase.sanskrit} विभक्तिः
                    </h3>
                    <span className="text-sm text-slate-400 font-semibold">
                      ({selectedCase.english} Case)
                    </span>
                  </div>
                  <div className="text-xs text-amber-400/90 font-medium mt-1">
                    Thematic Role: <strong>{selectedCase.karaka}</strong> • Meaning: "{selectedCase.meaning}"
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                    Question: <span className="font-sanskrit text-amber-300 font-bold">{selectedCase.question}</span>
                  </div>
                </div>
              </div>

              {/* Endings & Sample sentence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Noun Endings (Masculine a-kāra)
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Singular</div>
                      <div className="font-sanskrit text-amber-300 font-bold text-sm">{selectedCase.masc_endings?.sg}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Dual</div>
                      <div className="font-sanskrit text-amber-300 font-bold text-sm">{selectedCase.masc_endings?.du}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Plural</div>
                      <div className="font-sanskrit text-amber-300 font-bold text-sm">{selectedCase.masc_endings?.pl}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Sample Word: <strong className="font-sanskrit text-white">{selectedCase.sample_noun}</strong>
                  </div>
                </div>

                {/* Example Sentence with Audio */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                      Exemplary Sentence
                    </div>
                    <div className="font-sanskrit text-xl font-bold text-amber-200">
                      {selectedCase.sentence_sanskrit}
                    </div>
                    <div className="text-xs font-mono text-slate-400 italic mt-0.5">
                      {selectedCase.sentence_iast}
                    </div>
                    <div className="text-xs text-slate-300 mt-1.5">
                      "{selectedCase.sentence_english}"
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => SpeechService.speak(selectedCase.sentence_sanskrit)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Vedic Pronunciation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Declension Matrix (Subanta Paradigm Generator) */}
          {declensionTable && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-amber-400" />
                  <span>Subanta Declension Matrix: <strong className="text-amber-300 font-sanskrit">{declensionTable.stemType || declensionTable.gender}</strong></span>
                </h3>

                {/* Stem Selector Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { stem: 'राम', label: 'राम (Masc. a-stem)' },
                    { stem: 'लता', label: 'लता (Fem. ā-stem)' },
                    { stem: 'फल', label: 'फल (Neut. a-stem)' },
                    { stem: 'गुरु', label: 'गुरु (Masc. u-stem)' }
                  ].map((s) => (
                    <button
                      key={s.stem}
                      onClick={() => handleSelectStem(s.stem)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold font-sanskrit transition-colors border ${
                        selectedStem === s.stem
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-amber-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-amber-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Case (विभक्तिः / कारकम्)</th>
                      <th className="py-3 px-4">Singular (एकवचनम्)</th>
                      <th className="py-3 px-4">Dual (द्विवचनम्)</th>
                      <th className="py-3 px-4">Plural (बहुवचनम्)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sanskrit">
                    {declensionTable.rows.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-sans font-semibold text-slate-400">{r.caseName || r.case}</td>
                        <td className="py-3 px-4 font-bold text-amber-300 text-sm">{r.singular}</td>
                        <td className="py-3 px-4 text-slate-200 text-sm">{r.dual}</td>
                        <td className="py-3 px-4 text-slate-200 text-sm">{r.plural}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. DHĀTU / ROOT EXPLORER (Section 23 Specification) */}
      {activeTab === 'dhatu' && (
        <div className="space-y-6 animate-fade-in">
          {/* Select Root */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">Select Dhātu Root:</span>
            {['गम्', 'पठ्', 'भू'].map((r) => (
              <button
                key={r}
                onClick={() => handleSelectRoot(r)}
                className={`px-4 py-1.5 rounded-xl font-sanskrit text-sm font-bold transition-all border ${
                  selectedRoot === r
                    ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow'
                    : 'bg-slate-900 text-amber-200 border-slate-700 hover:border-amber-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {dhatuData && (
            <div className="glass-card p-6 rounded-2xl border border-blue-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-sanskrit text-4xl font-extrabold text-amber-400">
                      √ {dhatuData.root}
                    </span>
                    <span className="text-sm text-slate-300 font-semibold">
                      Meaning: "{dhatuData.meaning}"
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Class: {dhatuData.gana}</div>
                </div>
              </div>

              {/* Visual Derivational Tree (Section 23 Requirement: गम् -> गच्छति -> गतः -> गमनम्) */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Interactive Derivational Tree (कृदन्तरूपाणि)</span>
                </h4>

                <div className="flex flex-wrap items-center justify-center gap-4 py-4 bg-slate-950/70 rounded-xl border border-slate-800">
                  {/* Root Box */}
                  <div className="px-5 py-3 rounded-xl bg-amber-500 text-black font-sanskrit font-extrabold text-2xl shadow-gold-glow">
                    {dhatuData.root}
                  </div>

                  <span className="text-amber-500 text-xl font-bold">→</span>

                  {dhatuData.paradigm?.kridanta_tree?.map((k: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 cursor-pointer text-center transition-all group"
                      onClick={() => SpeechService.speak(k.form)}
                    >
                      <div className="text-[10px] text-slate-400">{k.affix}</div>
                      <div className="font-sanskrit text-lg font-bold text-amber-300 group-hover:scale-105 transition-transform">
                        {k.form}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{k.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conjugation Grid (Laṭ Lakāra Present Tense) */}
              {dhatuData.paradigm?.present_lat && (
                <div>
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                    {dhatuData.paradigm.present_lat.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {dhatuData.paradigm.present_lat.forms.map((f: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400">{f.person}</div>
                        <div className="font-sanskrit text-lg font-bold text-amber-300 mt-1">
                          {f.singular}
                        </div>
                        <div className="text-xs text-slate-400 font-sanskrit">
                          Dual: {f.dual} • Plural: {f.plural}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. SANDHI LAB (Section 24 Specification) */}
      {activeTab === 'sandhi' && (
        <div className="space-y-6 animate-fade-in">
          {/* Interactive Inputs */}
          <div className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Interactive Sandhi Transformer</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={sandhiWord1}
                onChange={(e) => setSandhiWord1(e.target.value)}
                placeholder="Word 1 (e.g. राम)"
                className="w-full sm:w-48 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-sanskrit text-center text-lg focus:outline-none focus:border-amber-400"
              />
              <span className="text-amber-400 font-extrabold text-2xl">+</span>
              <input
                type="text"
                value={sandhiWord2}
                onChange={(e) => setSandhiWord2(e.target.value)}
                placeholder="Word 2 (e.g. इति)"
                className="w-full sm:w-48 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-sanskrit text-center text-lg focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleRunSandhi()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-gold-glow"
              >
                Apply Sandhi Rule
              </button>
            </div>

            {/* Quick Pairs */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-slate-400">Try common rules:</span>
              {[
                { p1: 'राम', p2: 'इति', label: 'Guṇa: राम + इति' },
                { p1: 'विद्या', p2: 'आलयः', label: 'Dīrgha: विद्या + आलयः' },
                { p1: 'महा', p2: 'उत्सवः', label: 'Guṇa: महा + उत्सवः' },
                { p1: 'कः', p2: 'अयम्', label: 'Visarga: कः + अयम्' }
              ].map((pair, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSandhiWord1(pair.p1);
                    setSandhiWord2(pair.p2);
                    handleRunSandhi(pair.p1, pair.p2);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 transition-colors"
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transformation Visualizer Card (Section 24 Requirement: Input -> Rule -> Transformation -> Output) */}
          {sandhiResult && (
            <div className="glass-card p-6 rounded-2xl border border-amber-500/40 space-y-6">
              <div className="text-center space-y-2">
                <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold">
                  Resulting Combined Euphonic Unit
                </div>
                <div className="font-sanskrit text-4xl sm:text-5xl font-extrabold gold-gradient-text drop-shadow-md">
                  {sandhiResult.output}
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Step 1: Input</div>
                  <div className="font-sanskrit text-base font-bold text-white mt-1">
                    {sandhiResult.input1} + {sandhiResult.input2}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Step 2: Rule (सूत्रम्)</div>
                  <div className="font-sanskrit text-xs font-bold text-amber-300 mt-1">
                    {sandhiResult.sutra}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Step 3: Transformation</div>
                  <div className="text-xs text-blue-300 mt-1 font-medium">
                    {sandhiResult.sandhiType}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40">
                  <div className="text-[10px] text-amber-300 uppercase font-semibold">Step 4: Output</div>
                  <div className="font-sanskrit text-base font-extrabold text-amber-200 mt-1">
                    {sandhiResult.output}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                📖 <strong>Pāṇinian Linguistic Commentary</strong>: {sandhiResult.explanation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SAMĀSA (COMPOUNDS) */}
      {activeTab === 'samasa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {[
            { name: 'तत्पुरुषः (Tatpuruṣa)', desc: 'Determinative compound where the second member is principal. E.g. राजपुरुषः (King\'s official).' },
            { name: 'कर्मधारयः (Karmadhāraya)', desc: 'Descriptive noun-adjective compound. E.g. नीलोत्पलम् (Blue lotus).' },
            { name: 'द्विगुः (Dvigu)', desc: 'Numeral compound whose initial word denotes quantity. E.g. त्रिलोकम् (The three worlds).' },
            { name: 'द्वन्द्वः (Dvandva)', desc: 'Copulative compound where all elements are equally principal ("and"). E.g. रामलक्ष्मणौ (Rama and Lakshmana).' },
            { name: 'बहुव्रीहिः (Bahuvrīhi)', desc: 'Exocentric compound referring to an external entity. E.g. पीताम्बरः (He who wears yellow, Krishna).' },
            { name: 'अव्ययीभावः (Avyayībhāva)', desc: 'Indeclinable compound starting with an indeclinable particle. E.g. प्रतिदिनम् (Daily).' }
          ].map((s, idx) => (
            <div key={idx} className="glass-card p-5 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-colors">
              <h4 className="font-sanskrit text-base font-bold text-amber-300 mb-1">{s.name}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
