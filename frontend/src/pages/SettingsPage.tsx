// ==============================================================================
// SANSKRITVERSE Settings Page
// Native Source Language Preferences, Speech Rate, & Assessment Reset
// ==============================================================================

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { NativeLanguage } from '../types';
import { getTranslation } from '../i18n';
import { Settings, Languages, Volume2, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    sourceLanguage,
    setSourceLanguage,
    triggerOnboarding
  } = useAppStore();

  const languageOptions: Array<{ id: NativeLanguage; name: string; native: string; flag: string }> = [
    { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { id: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { id: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900/90 via-[#1E1438]/80 to-slate-900/90">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{getTranslation(sourceLanguage, 'platform_settings')}</h1>
            <p className="font-sanskrit text-amber-300 text-xs">व्यक्तिगत-विन्यासाः</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          {getTranslation(sourceLanguage, 'settings_subtitle')}
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* 1. Original / Native Language Selection */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 bg-slate-900/80">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Languages className="w-4 h-4 text-emerald-400" />
            <span>{getTranslation(sourceLanguage, 'native_lang_pref')}</span>
          </h2>

          <div className="space-y-3">
            <div className="text-xs text-slate-400">
              {getTranslation(sourceLanguage, 'native_lang_desc')}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languageOptions.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSourceLanguage(lang.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    sourceLanguage === lang.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-gold-glow font-bold'
                      : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-amber-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{lang.native}</span>
                    <span className="text-base">{lang.flag}</span>
                  </div>
                  <div className="text-xs opacity-75">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Audio & Speech Rate */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 bg-slate-900/80">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{getTranslation(sourceLanguage, 'speech_speed')}</span>
          </h2>

          <div className="flex items-center gap-2">
            {[0.75, 0.9, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-white transition-colors"
              >
                {speed}x Speed
              </button>
            ))}
          </div>
        </div>

        {/* 3. Onboarding Retake */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <div className="text-sm font-semibold text-white">{getTranslation(sourceLanguage, 'reset_profile')}</div>
            <div className="text-xs text-slate-400">Re-evaluate your Sanskrit proficiency and goals</div>
          </div>

          <button
            onClick={() => triggerOnboarding(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            {getTranslation(sourceLanguage, 'retake_assessment')}
          </button>
        </div>
      </div>
    </div>
  );
};
