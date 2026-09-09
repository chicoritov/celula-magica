import React, { useState, useCallback } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityBar } from './components/AccessibilityBar';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { QuizScreen } from './components/QuizScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { CompareScreen } from './components/CompareScreen';
import { MusicPlayer } from './components/MusicPlayer';

type Screen = 'home' | 'explore' | 'quiz' | 'achievements' | 'compare';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('home');

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const screens: Record<Screen, React.ReactNode> = {
    home: <HomeScreen onNavigate={navigate} />,
    explore: <ExploreScreen onBack={() => navigate('home')} />,
    quiz: <QuizScreen onBack={() => navigate('home')} />,
    achievements: <AchievementsScreen onBack={() => navigate('home')} />,
    compare: <CompareScreen onBack={() => navigate('home')} />,
  };

  return (
    <div className="min-h-screen animated-bg relative">
      {/* Bokeh decorativo - aria-hidden para acessibilidade */}
      <div className="bokeh w-64 h-64 bg-purple-400 top-20 left-10" style={{ animationDelay: '0s' }} aria-hidden="true" />
      <div className="bokeh w-48 h-48 bg-blue-400 top-40 right-20" style={{ animationDelay: '5s' }} aria-hidden="true" />
      <div className="bokeh w-56 h-56 bg-green-400 bottom-20 left-1/3" style={{ animationDelay: '10s' }} aria-hidden="true" />
      <div className="bokeh w-40 h-40 bg-pink-400 top-1/2 right-1/4" style={{ animationDelay: '7s' }} aria-hidden="true" />

      <AccessibilityBar />
      
      <main className="relative z-10">
        {screens[screen]}
      </main>

      {/* Player de música ambiente */}
      <MusicPlayer />

      <footer className="relative z-10 text-center py-4 text-white/50 text-xs">
        🔬 Célula Mágica — Aprendendo ciências com inclusão ✨
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
