import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';

interface AccessibilityState {
  voiceEnabled: boolean;
  textLarge: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  focusMode: boolean;
  unlockedAchievements: string[];
  exploredParts: { animal: number[]; vegetal: number[] };
}

interface AccessibilityContextType extends AccessibilityState {
  toggleVoice: () => void;
  toggleTextLarge: () => void;
  toggleHighContrast: () => void;
  toggleDyslexiaFont: () => void;
  toggleFocusMode: () => void;
  unlockAchievement: (id: string) => void;
  addExploredPart: (type: 'animal' | 'vegetal', partId: number) => void;
  speak: (text: string) => void;
  playFeedbackSound: (type: 'correct' | 'incorrect' | 'click') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const DEFAULT_STATE: AccessibilityState = {
  voiceEnabled: false,
  textLarge: false,
  highContrast: false,
  dyslexiaFont: false,
  focusMode: false,
  unlockedAchievements: [],
  exploredParts: { animal: [], vegetal: [] },
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(() => {
    try {
      const saved = localStorage.getItem('celula-magica-state');
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  // Persistência
  useEffect(() => {
    localStorage.setItem('celula-magica-state', JSON.stringify(state));
  }, [state]);

  // Aplicar classes CSS
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('text-large', state.textLarge);
    html.classList.toggle('high-contrast', state.highContrast);
    html.classList.toggle('dyslexia-font', state.dyslexiaFont);
    html.classList.toggle('focus-mode', state.focusMode);
  }, [state.textLarge, state.highContrast, state.dyslexiaFont, state.focusMode]);

  const toggleVoice = useCallback(() => {
    setState(s => {
      const newAchievements = s.unlockedAchievements.includes('voice_on')
        ? s.unlockedAchievements
        : [...s.unlockedAchievements, 'voice_on'];
      return { ...s, voiceEnabled: !s.voiceEnabled, unlockedAchievements: newAchievements };
    });
  }, []);

  const toggleTextLarge = useCallback(() => setState(s => ({ ...s, textLarge: !s.textLarge })), []);
  const toggleHighContrast = useCallback(() => setState(s => ({ ...s, highContrast: !s.highContrast })), []);
  const toggleDyslexiaFont = useCallback(() => setState(s => ({ ...s, dyslexiaFont: !s.dyslexiaFont })), []);
  const toggleFocusMode = useCallback(() => setState(s => ({ ...s, focusMode: !s.focusMode })), []);

  const unlockAchievement = useCallback((id: string) => {
    setState(s => s.unlockedAchievements.includes(id) ? s : { ...s, unlockedAchievements: [...s.unlockedAchievements, id] });
  }, []);

  const addExploredPart = useCallback((type: 'animal' | 'vegetal', partId: number) => {
    setState(s => {
      if (s.exploredParts[type].includes(partId)) return s;
      const newExplored = { ...s.exploredParts, [type]: [...s.exploredParts[type], partId] };
      const newAchievements = [...s.unlockedAchievements];
      
      if (!newAchievements.includes('first_explore')) newAchievements.push('first_explore');
      if (newExplored.animal.length === 8 && !newAchievements.includes('all_animal')) newAchievements.push('all_animal');
      if (newExplored.vegetal.length === 8 && !newAchievements.includes('all_vegetal')) newAchievements.push('all_vegetal');
      
      return { ...s, exploredParts: newExplored, unlockedAchievements: newAchievements };
    });
  }, []);

  const speak = useCallback((text: string) => {
    if (!state.voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt'));
    if (ptVoice) utterance.voice = ptVoice;
    window.speechSynthesis.speak(utterance);
  }, [state.voiceEnabled]);

  const playFeedbackSound = useCallback((type: 'correct' | 'incorrect' | 'click') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const configs = {
        correct: { freq: 523.25, gain: 0.3, dur: 0.3 },
        incorrect: { freq: 200, gain: 0.2, dur: 0.3 },
        click: { freq: 800, gain: 0.1, dur: 0.05 },
      };
      const cfg = configs[type];
      osc.frequency.value = cfg.freq;
      gain.gain.value = cfg.gain;
      osc.start();
      osc.stop(ctx.currentTime + cfg.dur);
      
      if (navigator.vibrate) {
        navigator.vibrate(type === 'correct' ? [50, 30, 50] : type === 'incorrect' ? [200] : [20]);
      }
    } catch { /* Audio indisponível */ }
  }, []);

  const value = useMemo(() => ({
    ...state, toggleVoice, toggleTextLarge, toggleHighContrast,
    toggleDyslexiaFont, toggleFocusMode, unlockAchievement,
    addExploredPart, speak, playFeedbackSound,
  }), [state, toggleVoice, toggleTextLarge, toggleHighContrast,
    toggleDyslexiaFont, toggleFocusMode, unlockAchievement,
    addExploredPart, speak, playFeedbackSound]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}
