import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export function AccessibilityBar() {
  const { voiceEnabled, toggleVoice, textLarge, toggleTextLarge, highContrast, toggleHighContrast, dyslexiaFont, toggleDyslexiaFont, focusMode, toggleFocusMode } = useAccessibility();

  const buttons = [
    { icon: '🔊', label: 'Voz', active: voiceEnabled, onClick: toggleVoice, title: 'Ligar/desligar leitura em voz alta' },
    { icon: '🅰️', label: 'Texto', active: textLarge, onClick: toggleTextLarge, title: 'Aumentar texto' },
    { icon: '◐', label: 'Contraste', active: highContrast, onClick: toggleHighContrast, title: 'Alto contraste' },
    { icon: '🔤', label: 'Dislexia', active: dyslexiaFont, onClick: toggleDyslexiaFont, title: 'Fonte para dislexia' },
    { icon: '🎯', label: 'Foco', active: focusMode, onClick: toggleFocusMode, title: 'Modo foco' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none rounded-b-2xl px-3 py-1.5" role="toolbar" aria-label="Ferramentas de acessibilidade">
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="text-white/70 font-semibold text-xs mr-1 hidden sm:inline" aria-hidden="true">♿</span>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            aria-pressed={btn.active}
            aria-label={btn.title}
            title={btn.title}
            className={`min-w-[40px] min-h-[40px] px-2 py-1.5 rounded-lg font-bold text-base transition-all flex items-center gap-1 ${
              btn.active ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span aria-hidden="true" className="text-sm">{btn.icon}</span>
            <span className="hidden md:inline text-xs">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
