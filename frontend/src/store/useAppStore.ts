// ==============================================================================
// SANSKRITVERSE Global Application Store & State Hook
// User Authentication, Day-1 Starting State, and Progress Persistence by Login ID
// ==============================================================================

import { useState, useEffect } from 'react';
import { PageView, GraphicsQuality, UserProfile, NativeLanguage } from '../types';

export interface AppState {
  isAuthenticated: boolean;
  currentView: PageView;
  graphicsQuality: GraphicsQuality;
  sourceLanguage: NativeLanguage;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  onboardingCompleted: boolean;
  showOnboardingModal: boolean;
  user: UserProfile;
}

export const createDayOneUser = (username: string = 'Vidyarthi', email: string = 'student@sanskritverse.io'): UserProfile => ({
  id: Date.now(),
  username,
  email,
  sanskrit_level: 'Beginner',
  daily_goal_mins: 15,
  xp: 0,
  current_level: 1,
  streak_days: 1, // Day 1
  avatar: 'avatar_student.png'
});

const LEVEL_TITLES: Record<number, string> = {
  1: 'Sanskrit Explorer (संस्कृत-अन्वेषकः)',
  2: 'Word Learner (शब्द-जिज्ञासुः)',
  3: 'Sentence Builder (वाक्य-शिल्पी)',
  4: 'Grammar Explorer (व्याकरण-प्रवीणः)',
  5: 'Sanskrit Speaker (संस्कृत-वक्ता)',
  6: 'Sanskrit Scholar (संस्कृत-विद्वान्)'
};

export const getLevelTitle = (level: number): string => {
  return LEVEL_TITLES[level] || LEVEL_TITLES[1];
};

// Initialize from LocalStorage (Always start on Login page on launch, loading saved profile)
const getInitialState = (): AppState => {
  const activeUsername = localStorage.getItem('sanskritverse_active_user');
  let user = createDayOneUser();

  if (activeUsername) {
    const savedProfile = localStorage.getItem(`sanskritverse_profile_${activeUsername.toLowerCase()}`);
    if (savedProfile) {
      try {
        user = JSON.parse(savedProfile);
      } catch {
        user = createDayOneUser(activeUsername);
      }
    } else {
      user = createDayOneUser(activeUsername);
    }
  }

  const savedSourceLang = (localStorage.getItem('sanskritverse_source_lang') as NativeLanguage) || 'en';

  // Apply permanent dark theme to DOM
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }

  // Always require sign-in on launch as requested
  return {
    isAuthenticated: false,
    currentView: 'login',
    graphicsQuality: 'high',
    sourceLanguage: savedSourceLang,
    theme: 'dark',
    soundEnabled: true,
    onboardingCompleted: false,
    showOnboardingModal: false,
    user
  };
};

let globalState: AppState = getInitialState();
const listeners = new Set<() => void>();

export const setGlobalState = (updater: (prev: AppState) => AppState) => {
  globalState = updater(globalState);
  listeners.forEach(fn => fn());
};

export const useAppStore = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const update = () => setTick(t => t + 1);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const navigateTo = (view: PageView) => {
    // If not authenticated, keep on login page
    if (!globalState.isAuthenticated && view !== 'landing' && view !== 'login') {
      setGlobalState(prev => ({ ...prev, currentView: 'login' }));
      return;
    }
    setGlobalState(prev => ({ ...prev, currentView: view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (userData: UserProfile, token: string) => {
    localStorage.setItem('sanskritverse_token', token);
    localStorage.setItem('sanskritverse_active_user', userData.username);

    // Retrieve any existing saved profile for this user or create one
    const profileKey = `sanskritverse_profile_${userData.username.toLowerCase()}`;
    const existing = localStorage.getItem(profileKey);
    const finalUser = existing ? JSON.parse(existing) : userData;

    localStorage.setItem(profileKey, JSON.stringify(finalUser));

    setGlobalState(prev => ({
      ...prev,
      isAuthenticated: true,
      user: finalUser,
      currentView: 'dashboard'
    }));
  };

  const logout = () => {
    localStorage.removeItem('sanskritverse_token');
    localStorage.removeItem('sanskritverse_active_user');

    setGlobalState(prev => ({
      ...prev,
      isAuthenticated: false,
      currentView: 'login'
    }));
  };

  const saveUserProgress = (updates: Partial<UserProfile>) => {
    setGlobalState(prev => {
      const updatedUser = { ...prev.user, ...updates };
      const profileKey = `sanskritverse_profile_${updatedUser.username.toLowerCase()}`;
      localStorage.setItem(profileKey, JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  const addXp = (amount: number) => {
    setGlobalState(prev => {
      const newXp = prev.user.xp + amount;
      const newLevel = Math.min(6, Math.floor(newXp / 1000) + 1);
      const updatedUser = {
        ...prev.user,
        xp: newXp,
        current_level: newLevel
      };
      const profileKey = `sanskritverse_profile_${updatedUser.username.toLowerCase()}`;
      localStorage.setItem(profileKey, JSON.stringify(updatedUser));
      return {
        ...prev,
        user: updatedUser
      };
    });
  };

  const setGraphicsQuality = (quality: GraphicsQuality) => {
    setGlobalState(prev => ({ ...prev, graphicsQuality: quality }));
  };

  const setSourceLanguage = (lang: NativeLanguage) => {
    localStorage.setItem('sanskritverse_source_lang', lang);
    setGlobalState(prev => ({ ...prev, sourceLanguage: lang }));
  };

  const toggleTheme = () => {
    setGlobalState(prev => {
      const next = prev.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sanskritverse_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { ...prev, theme: next };
    });
  };

  const triggerOnboarding = (show: boolean) => {
    setGlobalState(prev => ({ ...prev, showOnboardingModal: show }));
  };

  return {
    ...globalState,
    navigateTo,
    login,
    logout,
    saveUserProgress,
    setGraphicsQuality,
    setSourceLanguage,
    toggleTheme,
    addXp,
    triggerOnboarding
  };
};
