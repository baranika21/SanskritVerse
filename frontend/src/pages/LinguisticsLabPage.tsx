// ==============================================================================
// SANSKRITVERSE Computational Linguistics Lab Page
// Sentence Analysis, Kāraka Dependency, Samāsa Decompounding, & Pāṇini Sūtra Explorer
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { SentenceAnalysis, MorphologicalToken, SamasaAnalysisResult } from '../types';
import {
  Cpu,
  Play,
  ArrowRightLeft,
  Share2,
  Sparkles,
  BookOpen,
  Volume2,
  Layers,
  Search,
  BookMarked,
  HelpCircle,
  Award
} from 'lucide-react';
import { SpeechService } from '../services/speech';

export const LinguisticsLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parser' | 'samasa' | 'sutras' | 'transliteration'>('parser');

  // Sentence Analysis State
  const [inputSentence, setInputSentence] = useState('रामः वनं गच्छति।');
  const [analysis, setAnalysis] = useState<SentenceAnalysis | null>(null);
  const [selectedToken, setSelectedToken] = useState<MorphologicalToken | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Samasa Analysis State
  const [samasaInput, setSamasaInput] = useState('महावृक्षः');
  const [samasaResult, setSamasaResult] = useState<SamasaAnalysisResult | null>(null);
  const [isSamasaAnalyzing, setIsSamasaAnalyzing] = useState(false);

  // Panini Sutras State
  const [sutras, setSutras] = useState<any[]>([]);
  const [sutraSearch, setSutraSearch] = useState('');

  // Transliteration Tool states
  const [transText, setTransText] = useState('नमस्ते भवन्तः। ज्ञानं परमं बलम्।');
  const [fromScript, setFromScript] = useState('devanagari');
  const [toScript, setToScript] = useState('iast');
  const [transResult, setTransResult] = useState('namaste bhavantaḥ. jñānaṃ paramaṃ balam.');

  const presetSentences = [
    'रामः वनं गच्छति।',
    'बालकः पुस्तकं पठति।',
    'अहं प्रतिदिनं संस्कृतं पठामि।',
    'ज्ञानं शक्तिः अस्ति।',
    'विद्या ददाति विनयम्।'
  ];

  const presetSamasas = ['महावृक्षः', 'दशाननः', 'रामलक्ष्मणौ', 'प्रतिदिनम्', 'राजपुरुषः', 'पञ्चगवम्', 'विद्याधनम्'];

  useEffect(() => {
    handleAnalyze();
    handleSamasaAnalyze('महावृक्षः');
    loadSutras();
  }, []);

  const handleAnalyze = async (sent?: string) => {
    const s = sent || inputSentence;
    if (!s.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await ApiService.analyzeSentence(s);
      setAnalysis(res);
      if (res.tokens.length > 0) {
        setSelectedToken(res.tokens[0]);
      }
    } catch (err) {
      console.error('Linguistic analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSamasaAnalyze = async (wordToAnalyze?: string) => {
    const w = wordToAnalyze || samasaInput;
    if (!w.trim()) return;

    setIsSamasaAnalyzing(true);
    try {
      const res = await ApiService.analyzeSamasa(w);
      setSamasaResult(res);
    } catch (err) {
      console.error('Samasa analysis failed:', err);
    } finally {
      setIsSamasaAnalyzing(false);
    }
  };

  const loadSutras = async () => {
    try {
      const res = await ApiService.getPaniniSutras();
      setSutras(res.sutras || []);
    } catch (err) {
      console.error('Failed to load sutras:', err);
    }
  };

  const handleTransliterate = async () => {
    if (!transText.trim()) return;
    try {
      const res = await ApiService.transliterate(transText, fromScript, toScript);
      setTransResult(res.result);
    } catch {
      setTransResult(transText);
    }
  };

  const filteredSutras = sutras.filter(
    (s) =>
      s.sutra.includes(sutraSearch) ||
      s.topic.toLowerCase().includes(sutraSearch.toLowerCase()) ||
      s.meaning.toLowerCase().includes(sutraSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#1E1438] to-slate-950 p-6 sm:p-7 border border-purple-500/30 shadow-2xl flex items-center justify-between">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium mb-2">
            <Cpu className="w-3.5 h-3.5" /> भाषाविज्ञान-प्रयोगशाला
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sanskrit tracking-wide">
            Computational Linguistics Laboratory
          </h1>
        </div>
        <div className="hidden sm:block text-xs font-mono uppercase px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
          NLP & Sūtras
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('parser')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'parser' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" /> Sentence Parser & Kāraka Graph
        </button>
        <button
          onClick={() => setActiveTab('samasa')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'samasa' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Samāsa Decompounder (समास-विग्रह)
        </button>
        <button
          onClick={() => setActiveTab('sutras')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'sutras' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookMarked className="w-4 h-4" /> Pāṇinian Sūtras (अष्टाध्यायी)
        </button>
        <button
          onClick={() => setActiveTab('transliteration')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'transliteration' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Multi-Script Transliteration
        </button>
      </div>

      {/* TAB 1: SENTENCE PARSER & KARAKA DEPENDENCY */}
      {activeTab === 'parser' && (
        <div className="space-y-6">
          {/* Input Analysis Section */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={inputSentence}
                onChange={(e) => setInputSentence(e.target.value)}
                placeholder="Enter a Sanskrit sentence (e.g. रामः वनं गच्छति।)..."
                className="flex-1 bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-3 text-white text-base sm:text-lg font-sanskrit focus:outline-none focus:border-amber-400 shadow-inner"
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isAnalyzing ? 'Parsing...' : 'Analyze Sentence'}
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Try Presets:</span>
              {presetSentences.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputSentence(s);
                    handleAnalyze(s);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-sanskrit bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis View */}
          {analysis && (
            <div className="space-y-6">
              {/* Sentence Summary Header */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                    Normalized Sanskrit Sentence
                  </div>
                  <div className="text-2xl font-bold text-slate-100 font-sanskrit flex items-center gap-3">
                    {analysis.originalSentence}
                    <button
                      onClick={() => SpeechService.speak(analysis.originalSentence)}
                      className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm font-mono text-slate-400 italic mt-1">{analysis.iast}</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-md">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    English Coherent Translation
                  </div>
                  <div className="text-base font-medium text-amber-200">
                    "{analysis.englishTranslation}"
                  </div>
                </div>
              </div>

              {/* Tokens & Morphological Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Interactive Token Tiles */}
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Morphological Tokens (पद-विश्लेषणम्)
                  </h3>

                  <div className="space-y-3">
                    {analysis.tokens.map((token, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedToken(token)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedToken?.token === token.token
                            ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-md shadow-amber-500/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold font-sanskrit text-amber-300">{token.cleanToken}</span>
                            <span className="text-xs font-mono text-slate-400">({token.iast})</span>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-indigo-300">
                              {token.partOfSpeech}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Role: <strong className="text-slate-200">{token.karakaRole || 'Dependant'}</strong> • Gloss: "{token.englishGloss}"
                          </div>
                        </div>

                        <span className="text-xs font-mono text-amber-400 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                          {token.case ? `${token.case} (${token.number})` : token.tense || 'Avyaya'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Selected Token Deep Morphological Inspector */}
                <div className="lg:col-span-6">
                  <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl sticky top-6 space-y-4">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Detailed Morphological Inspection
                    </h3>

                    {selectedToken ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div>
                            <span className="text-3xl font-bold font-sanskrit text-amber-300">{selectedToken.cleanToken}</span>
                            <span className="text-sm font-mono text-slate-400 ml-2">[{selectedToken.iast}]</span>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                            {selectedToken.partOfSpeech}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {selectedToken.stem && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-400 block mb-0.5">Stem / Prātipadika:</span>
                              <span className="font-sanskrit text-base text-amber-200">{selectedToken.stem}</span>
                            </div>
                          )}
                          {selectedToken.root && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-400 block mb-0.5">Root / Dhātu:</span>
                              <span className="font-sanskrit text-base text-amber-200">{selectedToken.root}</span>
                            </div>
                          )}
                          {selectedToken.case && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-400 block mb-0.5">Case / Vibhakti:</span>
                              <span className="font-semibold text-indigo-300">{selectedToken.case}</span>
                            </div>
                          )}
                          {selectedToken.gender && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-400 block mb-0.5">Gender / Liṅga:</span>
                              <span className="font-semibold text-slate-200 capitalize">{selectedToken.gender}</span>
                            </div>
                          )}
                          {selectedToken.number && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-400 block mb-0.5">Number / Vacana:</span>
                              <span className="font-semibold text-slate-200 capitalize">{selectedToken.number}</span>
                            </div>
                          )}
                          {selectedToken.karakaRole && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-slate-400 block mb-0.5">Kāraka Role:</span>
                              <span className="font-semibold text-amber-300">{selectedToken.karakaRole}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          <strong className="text-amber-400 block mb-1">Pāṇinian Derivation Note:</strong>
                          {selectedToken.explanation}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic text-center py-12">
                        Select a token on the left to inspect its complete grammatical derivation.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kāraka Dependency Graph Visualizer */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Kāraka Syntactic Dependency Graph (कारक-सम्बन्ध)
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Predicate Head: {analysis.tokens.find(t => t.partOfSpeech === 'verb')?.cleanToken || 'Action'}</span>
                </div>

                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-around gap-6">
                  {analysis.dependencyGraph.links.map((link, lIdx) => (
                    <div key={lIdx} className="flex flex-col items-center bg-slate-900/80 border border-indigo-500/30 p-4 rounded-xl min-w-[200px]">
                      <span className="text-lg font-bold font-sanskrit text-amber-300 mb-1">{link.source}</span>
                      <div className="w-full flex items-center my-2">
                        <div className="h-[2px] bg-indigo-500 flex-1"></div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          {link.relation}
                        </span>
                        <div className="h-[2px] bg-indigo-500 flex-1"></div>
                      </div>
                      <span className="text-lg font-bold font-sanskrit text-emerald-400">{link.target}</span>
                      <span className="text-[11px] text-slate-400 text-center mt-2">{link.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAMASA (COMPOUND) DECOMPOUNDER */}
      {activeTab === 'samasa' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={samasaInput}
                onChange={(e) => setSamasaInput(e.target.value)}
                placeholder="Enter a compound Sanskrit word (e.g. महावृक्षः, दशाननः, प्रतिदिनम्)..."
                className="flex-1 bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-3 text-white text-base sm:text-lg font-sanskrit focus:outline-none focus:border-amber-400 shadow-inner"
              />
              <button
                onClick={() => handleSamasaAnalyze()}
                disabled={isSamasaAnalyzing}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Layers className="w-4 h-4" />
                {isSamasaAnalyzing ? 'Analyzing...' : 'Decompound'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Examples:</span>
              {presetSamasas.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSamasaInput(s);
                    handleSamasaAnalyze(s);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-sanskrit bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Samasa Result Card */}
          {samasaResult && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    Compound Type: {samasaResult.samasaType}
                  </div>
                  <h2 className="text-3xl font-bold font-sanskrit text-amber-300 mt-1">
                    {samasaResult.compoundWord} ({samasaResult.samasaTypeSanskrit})
                  </h2>
                  <div className="text-sm font-mono text-slate-400 italic mt-0.5">{samasaResult.iast}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                  <div className="text-xs text-slate-400">Pāṇini Sūtra:</div>
                  <div className="text-sm font-bold text-indigo-300 font-sanskrit">{samasaResult.paniniSutra}</div>
                </div>
              </div>

              {/* Members Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    पूर्वपदम् (Prior Member)
                  </span>
                  <div className="text-2xl font-bold font-sanskrit text-slate-100">{samasaResult.purvapada}</div>
                  <div className="text-xs text-slate-400">{samasaResult.purvapadaMeaning}</div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    उत्तरपदम् (Latter Member)
                  </span>
                  <div className="text-2xl font-bold font-sanskrit text-slate-100">{samasaResult.uttarapada}</div>
                  <div className="text-xs text-slate-400">{samasaResult.uttarapadaMeaning}</div>
                </div>
              </div>

              {/* Vigraha Vakya */}
              <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  विग्रह-वाक्यम् (Analytical Dissolution Phrase):
                </span>
                <div className="text-xl font-bold font-sanskrit text-amber-200">{samasaResult.vigrahaVakya}</div>
                <div className="text-xs font-mono text-slate-400 italic">{samasaResult.vigrahaIast}</div>
                <div className="text-sm text-slate-200 mt-2 font-medium">"{samasaResult.englishMeaning}"</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-xs text-slate-300 leading-relaxed border border-slate-800">
                <strong className="text-amber-400 block mb-1">Syntactic Explanation:</strong>
                {samasaResult.explanation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PANINI SUTRAS */}
      {activeTab === 'sutras' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={sutraSearch}
                onChange={(e) => setSutraSearch(e.target.value)}
                placeholder="Search Aṣṭādhyāyī Sūtras by Sanskrit name, number, or rule..."
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSutras.map((s, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-3 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xl font-bold font-sanskrit text-amber-300">{s.sutra}</span>
                    <span className="text-xs font-mono text-slate-400 ml-2">({s.number})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {s.topic}
                  </span>
                </div>
                <p className="text-slate-200 text-sm font-medium">{s.meaning}</p>
                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  {s.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRANSLITERATION */}
      {activeTab === 'transliteration' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">From Script:</label>
              <select
                value={fromScript}
                onChange={(e) => setFromScript(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="devanagari">Devanagari (देवनागरी)</option>
                <option value="iast">IAST (Roman Diacritics)</option>
                <option value="hk">Harvard-Kyoto (HK)</option>
                <option value="slp1">SLP1 (Basic ASCII)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">To Script:</label>
              <select
                value={toScript}
                onChange={(e) => setToScript(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="iast">IAST (Roman Diacritics)</option>
                <option value="devanagari">Devanagari (देवनागरी)</option>
                <option value="hk">Harvard-Kyoto (HK)</option>
                <option value="slp1">SLP1 (Basic ASCII)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={4}
              value={transText}
              onChange={(e) => setTransText(e.target.value)}
              placeholder="Enter text to transliterate..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-100 font-sanskrit text-base focus:outline-none focus:border-amber-500 resize-none"
            />

            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-amber-200 font-mono text-base overflow-y-auto min-h-[110px]">
              {transResult}
            </div>
          </div>

          <button
            onClick={handleTransliterate}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" /> Convert Script
          </button>
        </div>
      )}
    </div>
  );
};
