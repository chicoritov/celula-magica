import React, { Suspense, useEffect, useState } from 'react';
import { PremiumScene } from './PremiumScene';
import { useSyncedCamera } from '../hooks/useSyncedCamera';

interface CompareScreenProps {
  onBack: () => void;
}

export function CompareScreen({ onBack }: CompareScreenProps) {
  const [xrayMode, setXrayMode] = useState(false);
  const [xrayProgress, setXrayProgress] = useState(0);
  const [selectedOrganelle, setSelectedOrganelle] = useState<number | null>(null);
  const { registerControls, syncCameras, resetCamera } = useSyncedCamera();

  // Animação suave do Raio-X
  useEffect(() => {
    let animationFrame: number;
    let startTime: number;
    const duration = 800;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setXrayProgress(xrayMode ? eased : 1 - eased);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [xrayMode]);

  const handleOrganelleClick = (id: number) => {
    setSelectedOrganelle(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen px-4 py-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-7xl mx-auto flex-wrap gap-2">
        <button
          onClick={onBack}
          className="glass-card px-4 py-2 text-white font-semibold hover:bg-white/20 min-h-[44px] flex items-center gap-2"
          aria-label="Voltar"
        >
          ← Voltar
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-white">🆚 Comparador Premium</h1>
        <button
          onClick={() => setXrayMode(!xrayMode)}
          className={`glass-card px-4 py-2 rounded-lg font-semibold transition-all min-h-[44px] text-sm flex items-center gap-2 ${
            xrayMode ? 'bg-yellow-400/30 text-yellow-200 ring-2 ring-yellow-400' : 'text-white/80 hover:text-white'
          }`}
          aria-pressed={xrayMode}
        >
          <span aria-hidden="true">🔬</span>
          {xrayMode ? 'Desativar Raio-X' : 'Modo Raio-X'}
        </button>
      </div>

      {/* Grid lado a lado */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Célula Animal */}
        <div className="glass-card p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span aria-hidden="true">🐾</span>
              Célula Animal
            </h2>
            <span className="text-xs text-white/60">Arredondada, flexível</span>
          </div>
          <div className="relative w-full aspect-square min-h-[400px] bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl overflow-hidden">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white/60">Carregando cena premium...</div>
              </div>
            }>
              <PremiumScene
                cellType="animal"
                activeOrganelle={selectedOrganelle}
                onOrganelleClick={handleOrganelleClick}
                xrayMode={xrayMode}
                xrayProgress={xrayProgress}
                showLabels={true}
              />
            </Suspense>
          </div>
          <div className="mt-3 p-3 bg-white/5 rounded-lg">
            <p className="text-white/80 text-sm">
              <strong className="text-yellow-300">Características:</strong> Membrana flexível, centríolos, lisossomos.
              Presente em animais e humanos.
            </p>
          </div>
        </div>

        {/* Célula Vegetal */}
        <div className="glass-card p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span aria-hidden="true">🌱</span>
              Célula Vegetal
            </h2>
            <span className="text-xs text-white/60">Retangular, rígida</span>
          </div>
          <div className="relative w-full aspect-square min-h-[400px] bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl overflow-hidden">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white/60">Carregando cena premium...</div>
              </div>
            }>
              <PremiumScene
                cellType="vegetal"
                activeOrganelle={selectedOrganelle}
                onOrganelleClick={handleOrganelleClick}
                xrayMode={xrayMode}
                xrayProgress={xrayProgress}
                showLabels={true}
              />
            </Suspense>
          </div>
          <div className="mt-3 p-3 bg-white/5 rounded-lg">
            <p className="text-white/80 text-sm">
              <strong className="text-green-300">Características:</strong> Parede rígida, cloroplastos, vacúolo grande.
              Presente em plantas e algas.
            </p>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="max-w-7xl mx-auto mt-4 glass-card p-4">
        <div className="flex flex-wrap gap-4 justify-center text-sm text-white/80">
          <span>🖱️ <strong>Arraste</strong> para girar (câmeras sincronizadas)</span>
          <span>🔍 <strong>Scroll</strong> para zoom</span>
          <span>👆 <strong>Clique</strong> em labels ou organelas</span>
          <span>🔬 <strong>Raio-X</strong> corta a célula ao meio</span>
        </div>
      </div>

      {/* Legenda da organela selecionada */}
      {selectedOrganelle && (
        <div className="max-w-7xl mx-auto mt-4 glass-card p-4 text-center">
          <p className="text-white font-semibold">
            Organela selecionada: <span className="text-yellow-300">#{selectedOrganelle}</span>
          </p>
          <p className="text-white/70 text-sm mt-1">
            Observe a animação educativa e os labels em ambas as células!
          </p>
        </div>
      )}
    </div>
  );
}
