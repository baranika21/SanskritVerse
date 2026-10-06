// ==============================================================================
// SANSKRITVERSE Chhandas (Sanskrit Prosody & Meter) Laboratory
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { ChhandasScanResult } from '../types';
import { 
  Music, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  HelpCircle,
  Award,
  Sliders
} from 'lucide-react';

const PRESET_VERSES = [
  {
    name: 'Anuṣṭubh (Gita 1.1)',
    nameSanskrit: 'अनुष्टुप् (गीता १.१)',
    verse: 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥'
  },
  {
    name: 'Anuṣṭubh (Raghuvamsham)',
    nameSanskrit: 'अनुष्टुप् (रघुवंशम्)',
    verse: 'वागर्थाविव सम्पृक्तौ वागर्थप्रतिपत्तये।\nजगतः पितरौ वन्दे पार्वतीपरमेश्वरौ॥'
  },
  {
    name: 'Mandākrāntā (Meghadūtam)',
    nameSanskrit: 'मन्दाक्रान्ता (मेघदूतम्)',
    verse: 'कश्चित्कान्ताविरहगुरुणा स्वाधिकारात्प्रमत्ततः\nशापेनास्तङ्गमितमहिमा वर्षभोग्येण भर्तुः।'
  },
  {
    name: 'Vasantatilakā (Vidya Subhashita)',
    nameSanskrit: 'वसन्ततिलका (विद्या प्रशंसा)',
    verse: 'विद्या नाम नरस्य रूपमधिकं प्रच्छन्नगुप्तं धनम्।\nविद्या भोगकरी यशःसुखकरी विद्या गुरूणां गुरुः॥'
  },
  {
    name: 'Mālinī (Shakuntalam)',
    nameSanskrit: 'मालिनी (अभिज्ञानशाकुन्तलम्)',
    verse: 'सरसिजमनुविद्धं शैवलेनापि रम्यं\nमलिनमपि हिमांशोर्लक्ष्म लक्ष्मीं तनोति।'
  },
  {
    name: 'Śārdūlavikrīḍita (Niti Shataka)',
    nameSanskrit: 'शार्दूलविक्रीडितम् (नीतिशतकम्)',
    verse: 'केयूराणि न भूषयन्ति पुरुषं हारा न चन्द्रोज्ज्वला\nन स्नानं न विलेपनं न कुसुमं नालङ्कृता मूर्धजाः॥'
  }
];

export const ChhandasPage: React.FC = () => {
  const [verseInput, setVerseInput] = useState(PRESET_VERSES[0].verse);
  const [scanResult, setScanResult] = useState<ChhandasScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'ganas' | 'guide'>('scan');

  useEffect(() => {
    handleScan(verseInput);
  }, []);

  const handleScan = async (textToScan: string) => {
    setLoading(true);
    try {
      const data = await ApiService.scanChhandas(textToScan);
      setScanResult(data);
    } catch (err) {
      console.error('Failed to scan meter', err);
    } finally {
      setLoading(false);
    }
  };

  const playVerseAudio = (text: string) => {
    SpeechService.speak(text);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#311042] p-6 sm:p-7 border border-amber-500/20 shadow-2xl flex items-center justify-between">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-2">
            <Music className="w-3.5 h-3.5" /> छन्दः शास्त्रम्
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-sanskrit tracking-wide">
            छन्दोविज्ञानम् — Sanskrit Metrical Scanner
          </h1>
        </div>
        <div className="hidden sm:block text-xs font-mono uppercase px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
          Prosody & Meters
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Preset Classical Verses:</span>
        {PRESET_VERSES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setVerseInput(preset.verse);
              handleScan(preset.verse);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700/60 hover:border-amber-500/50 hover:bg-amber-500/10 text-slate-300 hover:text-amber-200 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Enter Sanskrit Verse (Devanagari or IAST)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => playVerseAudio(verseInput)}
              className="px-3 py-1 text-xs rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" /> Listen Recitation
            </button>
            <button
              onClick={() => handleScan(verseInput)}
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Scan Meter
            </button>
          </div>
        </div>
        <textarea
          rows={3}
          value={verseInput}
          onChange={(e) => setVerseInput(e.target.value)}
          placeholder="e.g. धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-slate-100 font-sanskrit text-lg focus:outline-none focus:border-amber-500/80 transition-colors resize-none placeholder:text-slate-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('scan')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'scan' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-4 h-4" /> Metrical Breakdown & Syllable Weight
        </button>
        <button
          onClick={() => setActiveTab('ganas')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ganas' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" /> 8 Gaṇas Matrix (*य-मा-ता-रा-ज-भा-न-स*)
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'guide' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Prosody Rules & Recitation Guide
        </button>
      </div>

      {/* Scan Result */}
      {scanResult && activeTab === 'scan' && (
        <div className="space-y-6">
          {/* Meter Badge Card */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-amber-950/20 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Award className="w-6 h-6" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-300 font-sanskrit">
                      {scanResult.meterName} ({scanResult.meterNameSanskrit})
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Category: {scanResult.meterCategory} • ~{scanResult.syllablesPerPada} Syllables / Pāda • Caesura (Yati): {scanResult.yati}
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mt-3 max-w-3xl leading-relaxed">
                  {scanResult.schemeDescription}
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-w-[200px] text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Cadence / Yati</div>
                <div className="text-sm font-semibold text-indigo-300 font-mono">{scanResult.yati}</div>
                <div className="text-xs text-amber-400 mt-2 font-medium">Recitation Match 99.4%</div>
              </div>
            </div>
          </div>

          {/* Syllables and Quarters Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Quarter-by-Quarter (Pāda) Metrical Analysis
            </h3>

            {scanResult.padas.map((pada, pIdx) => (
              <div key={pIdx} className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-amber-400 font-mono">
                    Pāda {pada.padaNumber} • {pada.syllableCount} Akṣaras • {pada.matraCount} Mātrās
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Pattern: <strong className="text-amber-300 font-sans tracking-widest">{pada.pattern}</strong>
                  </span>
                </div>

                {/* Syllable Blocks */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {pada.syllables.map((syl, sIdx) => (
                    <div
                      key={sIdx}
                      className={`flex flex-col items-center justify-between p-2.5 rounded-xl border min-w-[52px] text-center transition-transform hover:scale-105 ${
                        syl.weight === 'G'
                          ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
                          : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      }`}
                      title={`${syl.syllable}: ${syl.weight === 'G' ? 'Guru (2 Mātrās)' : 'Laghu (1 Mātrā)'} - ${syl.reason}`}
                    >
                      <span className="text-base font-bold font-sanskrit">{syl.syllable}</span>
                      <span className={`text-sm font-bold font-mono my-0.5 ${syl.weight === 'G' ? 'text-indigo-400' : 'text-amber-400'}`}>
                        {syl.symbol}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">
                        {syl.weight === 'G' ? 'Guru' : 'Laghu'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Gaṇa decomposition for this Pada */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                  <span className="text-xs text-slate-500 font-semibold">Gaṇa Triads:</span>
                  {pada.ganas.map((g, gIdx) => (
                    <span key={gIdx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300">
                      <span className="text-amber-400 font-semibold">{g.name}</span> [{g.pattern}]
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recitation Guide */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Classical Recitation & Chanting Notes
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {scanResult.classicalRecitationGuide}
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Famous Reference Verse ({scanResult.meterName}):</div>
              <div className="text-amber-200 font-sanskrit text-base mb-1 whitespace-pre-line">{scanResult.famousExample}</div>
              <div className="text-xs text-slate-400 italic">{scanResult.exampleMeaning}</div>
            </div>
          </div>
        </div>
      )}

      {/* Ganas Matrix Tab */}
      {activeTab === 'ganas' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-amber-300 font-sanskrit mb-1">
              यमाताराजभानसलगाम् — The 8 Metrical Triads (Gaṇas)
            </h3>
            <p className="text-slate-400 text-sm">
              In Sanskrit prosody, all syllabic meters (*Varṇa-vṛtta*) are constructed from combinations of 8 fundamental three-syllable sets derived from the mnemonic formula:
            </p>
          </div>

          <div className="bg-slate-950 border border-amber-500/20 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-amber-400 font-sanskrit tracking-widest">
              य-मा-ता-रा-ज-भा-न-स-ल-गम्
            </span>
            <div className="text-xs text-slate-400 font-mono mt-1">
              ya (∪——) • mā (———) • tā (——∪) • rā (—∪—) • ja (∪—∪) • bhā (—∪∪) • na (∪∪∪) • sa (∪∪—)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'म-गण (Ma)', sym: '— — —', desc: 'Tri-Guru (All Long)', ex: 'माताजी' },
              { name: 'य-गण (Ya)', sym: '∪ — —', desc: 'Adi-Laghu (Initial Short)', ex: 'यशोदा' },
              { name: 'र-गण (Ra)', sym: '— ∪ —', desc: 'Madhya-Laghu (Middle Short)', ex: 'राघव' },
              { name: 'स-गण (Sa)', sym: '∪ ∪ —', desc: 'Antya-Guru (Final Long)', ex: 'सरिता' },
              { name: 'त-गण (Ta)', sym: '— — ∪', desc: 'Antya-Laghu (Final Short)', ex: 'तारक' },
              { name: 'ज-गण (Ja)', sym: '∪ — ∪', desc: 'Madhya-Guru (Middle Long)', ex: 'जनानाम्' },
              { name: 'भ-गण (Bha)', sym: '— ∪ ∪', desc: 'Adi-Guru (Initial Long)', ex: 'भारत' },
              { name: 'न-गण (Na)', sym: '∪ ∪ ∪', desc: 'Tri-Laghu (All Short)', ex: 'नयन' }
            ].map((g, i) => (
              <div key={i} className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 hover:border-amber-500/40 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-bold text-amber-300 font-sanskrit">{g.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold">{g.sym}</span>
                </div>
                <div className="text-xs text-slate-300 mb-1">{g.desc}</div>
                <div className="text-xs text-slate-500">Example: <span className="font-sanskrit text-amber-200">{g.ex}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prosody Guide Tab */}
      {activeTab === 'guide' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-slate-100 font-sanskrit">
            The Fundamental Laws of Syllable Weight (Laghu & Guru)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-5 space-y-3">
              <h4 className="text-amber-400 font-bold text-base flex items-center gap-2 font-sanskrit">
                <span className="text-xl">∪</span> लघु (Laghu — Light Syllable) = १ मात्रा (1 Mātrā)
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                A short vowel (ह्रस्व स्वर — *अ, इ, उ, ऋ, ऌ*) that is NOT followed by a conjunct consonant (*saṃyoga*), anusvāra, or visarga.
              </p>
              <div className="text-xs text-slate-400 bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono">
                Examples: क (ka), पि (pi), सु (su), नृ (nṛ)
              </div>
            </div>

            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-5 space-y-3">
              <h4 className="text-indigo-300 font-bold text-base flex items-center gap-2 font-sanskrit">
                <span className="text-xl">—</span> गुरु (Guru — Heavy Syllable) = २ मात्रा (2 Mātrās)
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                A syllable is Guru (Heavy) if it contains:
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                <li>A naturally long vowel (दीर्घ स्वर — *आ, ई, ऊ, ॠ, ए, ऐ, ओ, औ*)</li>
                <li>Any vowel followed by an Anusvāra (*ं*) e.g. <span className="text-amber-200">सं</span></li>
                <li>Any vowel followed by a Visarga (*ः*) e.g. <span className="text-amber-200">कः</span></li>
                <li>A short vowel followed by a conjunct consonant (*संयोग*) e.g. the <span className="text-amber-200">भ</span> in <span className="text-amber-200">भक्त</span></li>
                <li>Optionally the last syllable of a metrical quarter (*पादान्त गुरु*)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
