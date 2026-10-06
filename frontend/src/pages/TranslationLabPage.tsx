// ==============================================================================
// SANSKRITVERSE Translation Lab Page
// Multilingual Indic & English → Sanskrit with Word-by-Word Grammatical Gloss & Audio
// Supports: English, Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिन्दी), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import { NativeLanguage, TranslationResponse } from '../types';
import { getTranslation } from '../i18n';
import { Languages, ArrowRightLeft, Volume2, Sparkles, Copy, Check } from 'lucide-react';

interface LangInfo {
  id: NativeLanguage;
  name: string;
  native: string;
  flag: string;
  samples: Array<{ text: string; label: string }>;
}

const LANGUAGES: LangInfo[] = [
  {
    id: 'en',
    name: 'English',
    native: 'English',
    flag: '🇬🇧',
    samples: [
      { text: 'The boy reads a book.', label: 'Reading a book' },
      { text: 'I learn Sanskrit.', label: 'Learning Sanskrit' },
      { text: 'Water is life.', label: 'Water is life' },
      { text: 'Rama goes to the forest.', label: 'Rama in the forest' },
      { text: 'Knowledge illuminates everything.', label: 'Power of knowledge' }
    ]
  },
  {
    id: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    flag: '🇮🇳',
    samples: [
      { text: 'நான் சமஸ்கிருதம் கற்கிறேன்', label: 'சமஸ்கிருதம் கற்றல்' },
      { text: 'சிறுவன் புத்தகம் படிக்கிறான்', label: 'புத்தகம் படித்தல்' },
      { text: 'நீரே வாழ்வு', label: 'நீர் வாழ்வின் ஆதாரம்' },
      { text: 'ராமர் காட்டிற்கு செல்கிறார்', label: 'ராமர் காடு செல்லுதல்' },
      { text: 'கோவில் எங்கே இருக்கிறது?', label: 'கோவில் வினவல்' }
    ]
  },
  {
    id: 'te',
    name: 'Telugu',
    native: 'తెలుగు',
    flag: '🇮🇳',
    samples: [
      { text: 'నేను సంస్కృతం నేర్చుకుంటున్నాను', label: 'సంస్కృతం అభ్యాసం' },
      { text: 'బాలుడు పుస్తకం చదువుతున్నాడు', label: 'పుస్తకం చదవడం' },
      { text: 'నీరే జీవనం', label: 'జీవనాధారం' },
      { text: 'రాముడు అడవికి వెళ్తున్నాడు', label: 'రాముడి ప్రయాణం' },
      { text: 'గుడి ఎక్కడ ఉంది?', label: 'ఆలయ విచారణ' }
    ]
  },
  {
    id: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    flag: '🇮🇳',
    samples: [
      { text: 'मैं संस्कृत सीखता हूँ', label: 'संस्कृत अध्ययन' },
      { text: 'बालक पुस्तक पढ़ता है', label: 'पुस्तक पठन' },
      { text: 'जल ही जीवन है', label: 'जल का महत्त्व' },
      { text: 'राम वन जाता है', label: 'राम का वनगमन' },
      { text: 'मन्दिर कहाँ है?', label: 'मन्दिर की स्थिति' }
    ]
  },
  {
    id: 'kn',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    samples: [
      { text: 'ನಾನು ಸಂಸ್ಕೃತವನ್ನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ', label: 'ಸಂಸ್ಕೃತ ಕಲಿಕೆ' },
      { text: 'ಹುಡುಗ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ', label: 'ಪುಸ್ತಕ ಓದುವುದು' },
      { text: 'ನೀರೆ ಜೀವನ', label: 'ಜೀವನ' }
    ]
  },
  {
    id: 'ml',
    name: 'Malayalam',
    native: 'മലയാളം',
    flag: '🇮🇳',
    samples: [
      { text: 'ഞാൻ സംസ്കൃതം പഠിക്കുന്നു', label: 'സംസ്കൃത പഠനം' },
      { text: 'ബാലൻ പുസ്തകം വായിക്കുന്നു', label: 'പുസ്തക വായന' },
      { text: 'ജലം തന്നെയാണ് ജീവൻ', label: 'ജീവൻ' }
    ]
  }
];

export const TranslationLabPage: React.FC = () => {
  const { sourceLanguage, setSourceLanguage } = useAppStore();
  const [direction, setDirection] = useState<'source_to_sa' | 'sa_to_source'>('source_to_sa');
  const [inputText, setInputText] = useState('The boy reads a book.');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResponse>({
    originalText: 'The boy reads a book.',
    sourceLang: 'en',
    targetLang: 'sa',
    sanskritDevanagari: 'बालकः पुस्तकं पठति।',
    sanskritIast: 'bālakaḥ pustakaṃ paṭhati.',
    translatedText: 'बालकः पुस्तकं पठति।',
    gloss: [
      { sourceWord: 'The boy', sanskritWord: 'बालकः', iast: 'bālakaḥ', role: 'Agent (Kartā - Prathamā Sg)', meaning: 'The boy' },
      { sourceWord: 'a book', sanskritWord: 'पुस्तकम्', iast: 'pustakam', role: 'Object (Karma - Dvitīyā Sg)', meaning: 'Book' },
      { sourceWord: 'reads', sanskritWord: 'पठति', iast: 'paṭhati', role: 'Verb (Root पठ्, Laṭ 3rd Sg)', meaning: 'Reads' }
    ],
    explanation: 'Subject बालकः in Nominative singular, Object पुस्तकम् in Accusative singular, and Verb पठति in Present tense 3rd person singular.'
  });
  const [isCopied, setIsCopied] = useState(false);

  const currentLangConfig = LANGUAGES.find(l => l.id === sourceLanguage) || LANGUAGES[0];

  // Update input text when source language changes
  useEffect(() => {
    if (direction === 'source_to_sa') {
      const sample = currentLangConfig.samples[0]?.text || 'The boy reads a book.';
      setInputText(sample);
      executeTranslate(sample, sourceLanguage);
    }
  }, [sourceLanguage]);

  const executeTranslate = async (text: string, srcLang: NativeLanguage) => {
    if (!text.trim()) return;
    setIsTranslating(true);
    try {
      const res = await ApiService.translate(text, srcLang, 'sa');
      setTranslationResult(res);
    } catch {
      // Fallback
      setTranslationResult({
        originalText: text,
        sourceLang: srcLang,
        targetLang: 'sa',
        sanskritDevanagari: 'ज्ञानं प्रकाशयति सर्वम्।',
        sanskritIast: 'jñānaṃ prakāśayati sarvam.',
        translatedText: 'ज्ञानं प्रकाशयति सर्वम्।',
        gloss: [
          { sourceWord: text, sanskritWord: 'ज्ञानम्', iast: 'jñānam', role: 'Kartā', meaning: 'Wisdom' },
          { sourceWord: '', sanskritWord: 'प्रकाशयति', iast: 'prakāśayati', role: 'Kriyā', meaning: 'Illuminates' }
        ],
        explanation: 'Active indicative Sanskrit construction.'
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslate = () => {
    executeTranslate(inputText, sourceLanguage);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translationResult.sanskritDevanagari || translationResult.translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleDirection = () => {
    if (direction === 'source_to_sa') {
      setDirection('sa_to_source');
      setInputText('रामः वनं गच्छति।');
    } else {
      setDirection('source_to_sa');
      setInputText(currentLangConfig.samples[0]?.text || 'The boy reads a book.');
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900/90 via-[#0D241C]/80 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{getTranslation(sourceLanguage, 'translation_title')}</h1>
            <p className="font-sanskrit text-emerald-300 text-xs">संस्कृत-बहुभाषा-अनुवाद-केन्द्रम्</p>
          </div>
        </div>

        {/* Direction Switcher Button */}
        <button
          onClick={toggleDirection}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold text-xs transition-colors"
        >
          <span>
            {direction === 'source_to_sa'
              ? `${currentLangConfig.native} → Sanskrit (संस्कृतम्)`
              : `Sanskrit (संस्कृतम्) → ${currentLangConfig.native}`}
          </span>
          <ArrowRightLeft className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Source Language Picker Tabs */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <Languages className="w-4 h-4 text-emerald-400" />
          <span>{getTranslation(sourceLanguage, 'native_lang_pref')}:</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSourceLanguage(lang.id)}
              className={`px-3 py-2.5 rounded-xl border text-center transition-all ${
                sourceLanguage === lang.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-gold-glow font-bold scale-[1.02]'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-amber-400'
              }`}
            >
              <div className="text-base">{lang.flag}</div>
              <div className="text-xs font-semibold mt-0.5">{lang.native}</div>
              <div className="text-[10px] text-slate-400">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Translation Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INPUT BOX */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between bg-slate-900/80">
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>
                {direction === 'source_to_sa'
                  ? `${currentLangConfig.name} (${currentLangConfig.native}) ${getTranslation(sourceLanguage, 'source_input_label')}`
                  : 'Sanskrit Source Sentence (देवनागरी)'}
              </span>
            </div>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter text in ${currentLangConfig.name}...`}
              className={`w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-base focus:outline-none focus:border-amber-400 transition-colors ${
                direction === 'sa_to_source' ? 'font-sanskrit text-xl' : ''
              }`}
            />
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{getTranslation(sourceLanguage, 'sample_prompts_title')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentLangConfig.samples.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(s.text);
                    executeTranslate(s.text, sourceLanguage);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-amber-500/20 border border-slate-800 text-[11px] text-slate-300 hover:text-amber-300 transition-colors"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-gold-glow transition-all"
            >
              {isTranslating ? getTranslation(sourceLanguage, 'translating_btn') : getTranslation(sourceLanguage, 'translate_btn')}
            </button>
          </div>
        </div>

        {/* OUTPUT BOX */}
        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-4 flex flex-col justify-between bg-gradient-to-b from-slate-900/95 to-slate-950/95">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span className="uppercase tracking-wider">{getTranslation(sourceLanguage, 'sanskrit_output_label')}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => SpeechService.speak(translationResult.sanskritDevanagari || translationResult.translatedText)}
                  className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:text-white transition-all"
                  title="Listen Pronunciation Audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all"
                  title="Copy Text"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Devanagari Sanskrit */}
            <div className="font-sanskrit text-2xl sm:text-3xl font-extrabold text-amber-300 py-1 leading-relaxed">
              {translationResult.sanskritDevanagari || translationResult.translatedText}
            </div>

            {/* IAST Transliteration */}
            {translationResult.sanskritIast && (
              <div className="text-xs font-mono text-slate-400 italic">
                IAST: {translationResult.sanskritIast}
              </div>
            )}

            {/* Native Indic Script Rendition */}
            {translationResult.sanskritNativeScript && translationResult.sanskritNativeScript !== translationResult.sanskritDevanagari && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200">
                <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
                  Sanskrit in {currentLangConfig.name} Script:
                </span>
                <span className="font-semibold text-sm text-amber-200">{translationResult.sanskritNativeScript}</span>
              </div>
            )}
          </div>

          {/* Word-by-Word Gloss Cards */}
          {translationResult.gloss && translationResult.gloss.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {getTranslation(sourceLanguage, 'word_gloss_title')}
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {translationResult.gloss.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-sanskrit font-bold text-amber-300 text-sm">
                        {g.sanskritWord}
                      </span>
                      {g.sourceWord && (
                        <>
                          <span className="text-slate-500">←</span>
                          <span className="text-slate-300 font-medium">{g.sourceWord}</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                      {g.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          {translationResult.explanation && (
            <p className="text-[11px] text-slate-400 italic pt-1">
              💡 {translationResult.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
