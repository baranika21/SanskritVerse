// ==============================================================================
// SANSKRITVERSE Navigation Sidebar Component
// Fully Localized Dynamic Navigation
// ==============================================================================

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PageView } from '../../types';
import { getTranslation } from '../../i18n';
import {
  Home,
  Bot,
  BookOpen,
  Type,
  BookmarkCheck,
  Brain,
  Mic,
  Cpu,
  Languages,
  PenTool,
  Trophy,
  Award,
  BarChart3,
  User,
  Settings,
  Sparkles,
  Music,
  Scroll
} from 'lucide-react';

interface NavItem {
  id: PageView;
  labelKey: string;
  defaultLabel: string;
  labelSanskrit: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, sourceLanguage } = useAppStore();

  const navItems: NavItem[] = [
    { id: 'dashboard', labelKey: 'dashboard', defaultLabel: 'Dashboard', labelSanskrit: 'गृहम्', icon: Home },
    { id: 'acharya', labelKey: 'acharya', defaultLabel: 'Acharya AI', labelSanskrit: 'आचार्यः', icon: Bot, badge: 'AI' },
    { id: 'lessons', labelKey: 'lessons', defaultLabel: 'Curriculum', labelSanskrit: 'पाठ्यक्रमः', icon: BookOpen },
    { id: 'alphabet', labelKey: 'alphabet', defaultLabel: 'Alphabet', labelSanskrit: 'वर्णमाला', icon: Type },
    { id: 'vocabulary', labelKey: 'vocabulary', defaultLabel: 'Vocabulary', labelSanskrit: 'शब्दावली', icon: BookmarkCheck },
    { id: 'grammar', labelKey: 'grammar', defaultLabel: 'Grammar Academy', labelSanskrit: 'व्याकरणम्', icon: Brain },
    { id: 'pronunciation', labelKey: 'pronunciation', defaultLabel: 'Pronunciation Lab', labelSanskrit: 'उच्चारणम्', icon: Mic },
    { id: 'linguistics', labelKey: 'linguistics', defaultLabel: 'Linguistics Lab', labelSanskrit: 'भाषाविज्ञानम्', icon: Cpu, badge: 'NLP' },
    { id: 'chhandas', labelKey: 'chhandas', defaultLabel: 'Chhandas Prosody', labelSanskrit: 'छन्दःशास्त्रम्', icon: Music, badge: 'Meter' },
    { id: 'manuscripts', labelKey: 'manuscripts', defaultLabel: 'Story Reader', labelSanskrit: 'पाण्डुलिपि', icon: Scroll },
    { id: 'subhashitas', labelKey: 'subhashitas', defaultLabel: 'Subhāṣita Studio', labelSanskrit: 'सुभाषितम्', icon: Sparkles },
    { id: 'translation', labelKey: 'translation', defaultLabel: 'Translation Lab', labelSanskrit: 'अनुवादः', icon: Languages },
    { id: 'builder', labelKey: 'builder', defaultLabel: 'Sentence Builder', labelSanskrit: 'वाक्य-रचना', icon: PenTool },
    { id: 'practice', labelKey: 'practice', defaultLabel: 'Practice & Quizzes', labelSanskrit: 'अभ्यासः', icon: Trophy },
    { id: 'achievements', labelKey: 'achievements', defaultLabel: 'Achievements', labelSanskrit: 'सिद्धयः', icon: Award },
    { id: 'progress', labelKey: 'progress', defaultLabel: 'Progress & Analytics', labelSanskrit: 'प्रगतिः', icon: BarChart3 },
    { id: 'profile', labelKey: 'profile', defaultLabel: 'My Library & Profile', labelSanskrit: 'पुस्तकालयः', icon: User },
    { id: 'settings', labelKey: 'settings', defaultLabel: 'Settings', labelSanskrit: 'विन्यासाः', icon: Settings }
  ];

  return (
    <aside className="w-64 glass-card border-r border-amber-500/20 flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto p-3 hidden md:flex shrink-0 bg-[#0B0F19]/90">
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold text-amber-500/80 uppercase tracking-widest">
          Sanskrit Ecosystem
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const localizedLabel = getTranslation(sourceLanguage, item.labelKey, item.defaultLabel);

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-gold-glow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-black' : 'text-amber-400/90'
                  }`}
                />
                <span className="truncate">{localizedLabel}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                      isActive
                        ? 'bg-black text-amber-300'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <span
                  className={`font-sanskrit text-[11px] opacity-70 ${
                    isActive ? 'text-black font-semibold' : 'text-slate-400'
                  }`}
                >
                  {item.labelSanskrit}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Motivation Box */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/20 text-center">
        <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>सुभाषितम् (Vedic Wisdom)</span>
        </div>
        <p className="font-sanskrit text-xs text-amber-200 font-medium">
          विद्या ददाति विनयम्
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          "Learning bestows humility."
        </p>
      </div>
    </aside>
  );
};
