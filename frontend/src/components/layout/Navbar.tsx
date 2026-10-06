// ==============================================================================
// SANSKRITVERSE Navigation Bar Component
// Pure Immersive Dark Mode with Responsive Native Language Selector
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useAppStore, getLevelTitle } from '../../store/useAppStore';
import { ApiService } from '../../services/api';
import { NativeLanguage } from '../../types';
import { getTranslation } from '../../i18n';
import {
  Flame,
  Award,
  Search,
  Sparkles,
  X,
  Languages,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    navigateTo,
    sourceLanguage,
    setSourceLanguage,
    isAuthenticated,
    logout
  } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const langNames: Record<NativeLanguage, { label: string; native: string; flag: string }> = {
    en: { label: 'English', native: 'English', flag: '🇬🇧' },
    ta: { label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    te: { label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    hi: { label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    kn: { label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    ml: { label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setLangMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await ApiService.searchGlobal(val);
      setSearchResults(res.results);
    } catch {
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-card border-b border-amber-500/20 px-4 lg:px-6 py-3 bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center p-0.5 shadow-gold-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <span className="font-sanskrit text-2xl font-bold gold-gradient-text">ॐ</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Sanskrit<span className="gold-gradient-text">Verse</span>
                </span>
                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                  AI LAB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                AI Sanskrit Learning & Computational Linguistics
              </p>
            </div>
          </div>

          {/* Search Trigger Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-amber-500/25 px-3.5 py-1.5 rounded-xl text-xs w-64 transition-all hover:border-amber-500/50"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="flex-1 text-left truncate">{getTranslation(sourceLanguage, 'search_placeholder')}</span>
            <kbd className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Language Selector & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Native Source Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:border-amber-400 hover:bg-slate-800 shadow-sm transition-all"
                title="Select Native / Source Language"
              >
                <Languages className="w-4 h-4 text-amber-400" />
                <span className="font-bold">{langNames[sourceLanguage].native}</span>
                <ChevronDown className="w-3 h-3 text-amber-400/80" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-card border border-amber-500/30 py-1.5 shadow-2xl z-50 bg-slate-950/95">
                  <div className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {getTranslation(sourceLanguage, 'source_language')}
                  </div>
                  {(Object.keys(langNames) as NativeLanguage[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSourceLanguage(key);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        sourceLanguage === key
                          ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{langNames[key].flag}</span>
                        <span className="font-medium">{langNames[key].native}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{langNames[key].label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gamification Status */}
            {isAuthenticated ? (
              <>
                {/* Streak Counter */}
                <div
                  onClick={() => navigateTo('progress')}
                  className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-semibold text-amber-300 cursor-pointer hover:border-amber-500 transition-all shadow-sm"
                  title="Daily Learning Streak"
                >
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                  <span>{user.streak_days} {getTranslation(sourceLanguage, 'day_streak')}</span>
                </div>

                {/* XP Points */}
                <div
                  onClick={() => navigateTo('progress')}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/15 to-amber-500/15 border border-purple-500/30 px-2.5 py-1 rounded-xl text-xs font-semibold text-purple-200 cursor-pointer hover:border-purple-500 transition-all"
                  title="Total Experience Points"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="gold-gradient-text font-bold">{user.xp.toLocaleString()} {getTranslation(sourceLanguage, 'xp')}</span>
                </div>

                {/* User Avatar Button */}
                <div
                  onClick={() => navigateTo('profile')}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 cursor-pointer hover:scale-105 transition-transform"
                  title={`Logged in as ${user.username}`}
                >
                  <div className="w-full h-full bg-[#111827] rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="hidden md:block px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/40 text-xs font-semibold transition-colors"
                  title="Sign out of student account"
                >
                  {getTranslation(sourceLanguage, 'sign_out')}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
              >
                {getTranslation(sourceLanguage, 'sign_in')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center p-4 sm:pt-20">
          <div className="w-full max-w-2xl glass-card rounded-2xl border border-amber-500/40 p-4 shadow-2xl animate-fade-in bg-slate-950">
            <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3">
              <Search className="w-5 h-5 text-amber-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={getTranslation(sourceLanguage, 'search_placeholder')}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
              {isSearching ? (
                <div className="p-6 text-center text-xs text-slate-400">Searching...</div>
              ) : searchResults ? (
                <div>
                  {searchResults.words && searchResults.words.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2">
                        {getTranslation(sourceLanguage, 'vocabulary')}
                      </div>
                      {searchResults.words.map((w: any) => (
                        <div
                          key={w.id}
                          onClick={() => {
                            navigateTo('vocabulary');
                            setSearchOpen(false);
                          }}
                          className="p-2 rounded-xl bg-slate-900/60 hover:bg-amber-500/10 border border-slate-800 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="font-sanskrit text-amber-300 font-bold mr-2">{w.devanagari}</span>
                            <span className="text-slate-400 text-xs italic">({w.iast})</span>
                          </div>
                          <span className="text-xs text-white">{w.english}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  Type to search vocabulary words, Pāṇinian grammar rules, and lessons.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
