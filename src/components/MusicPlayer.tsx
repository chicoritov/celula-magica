import React, { useState, useEffect, useRef } from 'react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useAccessibility } from '../context/AccessibilityContext';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showSlider, setShowSlider] = useState(false);
  const { start, stop, setVolume: setMusicVolume } = useBackgroundMusic();
  const { focusMode } = useAccessibility();
  const sliderRef = useRef<HTMLDivElement>(null);
  const wasPlayingRef = useRef(false);

  // Carregar preferência do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('celula-magica-music');
    if (saved) {
      try {
        const { playing, volume: vol } = JSON.parse(saved);
        setVolume(vol ?? 0.3);
        if (playing) {
          // Não iniciar automaticamente - requer interação do usuário (política de autoplay)
          setIsPlaying(false);
        }
      } catch {
        // fallback
      }
    }
  }, []);

  // Salvar preferência
  useEffect(() => {
    localStorage.setItem('celula-magica-music', JSON.stringify({ playing: isPlaying, volume }));
  }, [isPlaying, volume]);

  // Pausar música no modo foco (anti-sobrecarga sensorial)
  useEffect(() => {
    if (focusMode && isPlaying) {
      wasPlayingRef.current = true;
      stop();
      setIsPlaying(false);
    } else if (!focusMode && wasPlayingRef.current) {
      wasPlayingRef.current = false;
      start({ volume });
      setIsPlaying(true);
    }
  }, [focusMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMusic = () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
    } else {
      start({ volume });
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setMusicVolume(newVol);
  };

  // Fechar slider ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        setShowSlider(false);
      }
    };
    if (showSlider) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSlider]);

  // Esconder no modo foco
  if (focusMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Slider de volume */}
      {showSlider && (
        <div
          ref={sliderRef}
          className="glass-card px-4 py-3 flex items-center gap-3 animate-in"
          style={{ animation: 'slideUp 0.2s ease' }}
        >
          <span className="text-white/70 text-sm" aria-hidden="true">🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 accent-purple-400 cursor-pointer"
            aria-label="Volume da música"
          />
          <span className="text-white/70 text-sm" aria-hidden="true">🔊</span>
        </div>
      )}

      {/* Botão principal */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSlider(!showSlider)}
          className="glass-card w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all min-w-[40px] min-h-[40px]"
          aria-label="Ajustar volume da música"
          title="Volume"
        >
          <span aria-hidden="true" className="text-sm">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}
          </span>
        </button>
        <button
          onClick={toggleMusic}
          className={`
            glass-card w-14 h-14 rounded-full flex items-center justify-center
            transition-all min-w-[56px] min-h-[56px]
            ${isPlaying
              ? 'bg-purple-500/40 text-white shadow-lg shadow-purple-500/30 scale-105'
              : 'bg-white/15 text-white/80 hover:bg-white/25'
            }
          `}
          aria-label={isPlaying ? 'Pausar música de fundo' : 'Tocar música de fundo'}
          aria-pressed={isPlaying}
          title={isPlaying ? 'Pausar música' : 'Tocar música'}
        >
          <span aria-hidden="true" className="text-2xl">
            {isPlaying ? '⏸️' : '🎵'}
          </span>
        </button>
      </div>

      {/* Indicador visual quando tocando */}
      {isPlaying && (
        <div className="flex items-center gap-0.5 px-2 py-1 glass-card rounded-full" aria-hidden="true">
          <div className="w-0.5 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-0.5 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-0.5 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="w-0.5 h-5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="w-0.5 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '250ms' }} />
        </div>
      )}
    </div>
  );
}
