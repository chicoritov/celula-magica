import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { animalCell, vegetalCell, CellPart, CellData } from '../data/cells';
import { AnimalCellSVG } from './AnimalCellSVG';
import { VegetalCellSVG } from './VegetalCellSVG';
import { AnimationModal } from './AnimationModal';

// Lazy load dos componentes 3D para melhor performance
const CellScene3D = lazy(() => import('./CellScene3D').then(m => ({ default: m.CellScene3D })));

interface ExploreScreenProps {
  onBack: () => void;
}

type ViewMode = '2d' | '3d';

function LoadingFallback() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-spin" aria-hidden="true">🔬</div>
        <p className="text-white/80 font-medium">Carregando modelo 3D...</p>
      </div>
    </div>
  );
}

export function ExploreScreen({ onBack }: ExploreScreenProps) {
  const [cellType, setCellType] = useState<'animal' | 'vegetal'>('animal');
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [activePart, setActivePart] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<CellPart | null>(null);
  const [xrayMode, setXrayMode] = useState(false);
  const [xrayProgress, setXrayProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { speak, addExploredPart, playFeedbackSound } = useAccessibility();

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

  const currentCell: CellData = cellType === 'animal' ? animalCell : vegetalCell;

  const handlePartClick = useCallback((partId: number) => {
    const part = currentCell.parts.find(p => p.id === partId);
    if (part) {
      setSelectedPart(part);
      setActivePart(partId);
      setShowModal(true);
      addExploredPart(cellType, partId);
      playFeedbackSound('click');
      speak(`${part.name}. ${part.analogy}`);
    }
  }, [currentCell, cellType, addExploredPart, playFeedbackSound, speak]);

  const handlePartListClick = useCallback((part: CellPart) => {
    setSelectedPart(part);
    setActivePart(part.id);
    setShowModal(true);
    addExploredPart(cellType, part.id);
    playFeedbackSound('click');
    speak(`${part.name}. ${part.analogy}`);
  }, [cellType, addExploredPart, playFeedbackSound, speak]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showModal]);

  // Focus trap no modal
  useEffect(() => {
    if (showModal && modalRef.current) {
      const closeButton = modalRef.current.querySelector('button');
      closeButton?.focus();
    }
  }, [showModal]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setActivePart(null);
  }, []);

  return (
    <div className="min-h-screen px-4 py-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="glass-card px-4 py-2 text-white font-semibold hover:bg-white/20 min-h-[44px] flex items-center gap-2"
          aria-label="Voltar para a tela inicial"
        >
          ← Voltar
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-white">🔍 Explorar Células</h1>
        <div className="w-20" />
      </div>

      {/* Controles: Tipo + Modo */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          {/* Tabs Animal/Vegetal */}
          <div className="flex gap-2 glass-card p-1.5" role="tablist" aria-label="Tipo de célula">
            <button
              role="tab"
              aria-selected={cellType === 'animal'}
              onClick={() => { setCellType('animal'); setActivePart(null); }}
              className={`py-2 px-4 rounded-lg font-semibold transition-all min-h-[44px] text-sm ${
                cellType === 'animal' ? 'bg-white/30 text-white shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >
              🐾 Animal
            </button>
            <button
              role="tab"
              aria-selected={cellType === 'vegetal'}
              onClick={() => { setCellType('vegetal'); setActivePart(null); }}
              className={`py-2 px-4 rounded-lg font-semibold transition-all min-h-[44px] text-sm ${
                cellType === 'vegetal' ? 'bg-white/30 text-white shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >
              🌱 Vegetal
            </button>
          </div>

          {/* Alternância 2D/3D */}
          <div className="flex gap-2 glass-card p-1.5" role="tablist" aria-label="Modo de visualização">
            <button
              role="tab"
              aria-selected={viewMode === '2d'}
              onClick={() => setViewMode('2d')}
              className={`py-2 px-4 rounded-lg font-semibold transition-all min-h-[44px] text-sm ${
                viewMode === '2d' ? 'bg-white/30 text-white shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >
              📷 2D
            </button>
            <button
              role="tab"
              aria-selected={viewMode === '3d'}
              onClick={() => setViewMode('3d')}
              className={`py-2 px-4 rounded-lg font-semibold transition-all min-h-[44px] text-sm ${
                viewMode === '3d' ? 'bg-white/30 text-white shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >
              🧊 3D
            </button>
          </div>

          {/* Botões especiais (só no modo 3D) */}
          {viewMode === '3d' && (
            <div className="flex gap-2">
              <button
                onClick={() => setXrayMode(!xrayMode)}
                className={`glass-card px-3 py-2 rounded-lg font-semibold transition-all min-h-[44px] text-sm flex items-center gap-1.5 ${
                  xrayMode ? 'bg-yellow-400/30 text-yellow-200 ring-2 ring-yellow-400' : 'text-white/70 hover:text-white'
                }`}
                aria-pressed={xrayMode}
                title="Cortar a célula ao meio para ver o interior"
              >
                <span aria-hidden="true">🔬</span> Raio-X
              </button>
              <button
                onClick={() => selectedPart && setShowAnimation(true)}
                disabled={!selectedPart}
                className="glass-card px-3 py-2 rounded-lg font-semibold transition-all min-h-[44px] text-sm flex items-center gap-1.5 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title={selectedPart ? 'Ver animação educativa desta organela' : 'Selecione uma organela primeiro'}
              >
                <span aria-hidden="true">🎬</span> Animar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Área da Imagem/3D */}
        <div className="lg:col-span-2">
          <div className="glass-card p-3 md:p-4 relative">
            <h2 className="text-lg font-bold text-white mb-2 text-center">
              {currentCell.name} — {viewMode === '3d' ? 'Modelo 3D' : 'Ilustração 2D'}
            </h2>
            
            {viewMode === '3d' ? (
              <div className="relative w-full aspect-[4/3] min-h-[400px]">
                <Suspense fallback={<LoadingFallback />}>
                  <CellScene3D
                    cellType={cellType}
                    activePart={activePart}
                    onPartClick={handlePartClick}
                    xrayMode={xrayMode}
                    xrayProgress={xrayProgress}
                  />
                </Suspense>
                {/* Instruções 3D */}
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="glass-card px-3 py-1 text-white/80 text-xs inline-block">
                    🖱️ Arraste para girar • Scroll para zoom • Clique nas partes
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] max-h-[500px]">
                {cellType === 'animal' ? (
                  <AnimalCellSVG onPartClick={handlePartClick} activePart={activePart} className="w-full h-full" />
                ) : (
                  <VegetalCellSVG onPartClick={handlePartClick} activePart={activePart} className="w-full h-full" />
                )}
                
                {/* Hotspots numerados */}
                {currentCell.parts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => handlePartClick(part.id)}
                    className="hotspot"
                    style={{
                      left: `${part.x}%`,
                      top: `${part.y}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: activePart === part.id ? part.color : `${part.color}cc`,
                      color: 'white',
                    }}
                    aria-label={`Parte ${part.id}: ${part.name}`}
                    title={part.name}
                  >
                    {part.id}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista de Partes */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <h2 className="text-lg font-bold text-white mb-3">📋 Partes da célula</h2>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {currentCell.parts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => handlePartListClick(part)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all min-h-[44px] flex items-center gap-2.5 ${
                    activePart === part.id
                      ? 'bg-white/30 text-white shadow-lg'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                  }`}
                  aria-label={`Ver detalhes de ${part.name}`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: part.color }}
                    aria-hidden="true"
                  >
                    {part.id}
                  </span>
                  <span className="font-medium text-sm">{part.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedPart && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="modal-content glass-card p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl" aria-hidden="true">{selectedPart.icon}</span>
                <div>
                  <h3 id="modal-title" className="text-xl font-bold text-white">
                    {selectedPart.name}
                  </h3>
                  <span
                    className="inline-block w-4 h-4 rounded-full mt-1"
                    style={{ backgroundColor: selectedPart.color }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/20"
                aria-label="Fechar detalhes"
                autoFocus
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-yellow-300 font-semibold text-sm mb-1">💡 Analogia:</p>
                <p className="text-white text-sm">{selectedPart.analogy}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-cyan-300 font-semibold text-sm mb-1">📖 O que é:</p>
                <p className="text-white text-sm">{selectedPart.description}</p>
              </div>
            </div>

            <button onClick={closeModal} className="btn-primary w-full mt-4">
              Entendi! 👍
            </button>
          </div>
        </div>
      )}

      {/* Modal de Animação Educativa */}
      {showAnimation && selectedPart && (
        <AnimationModal
          organelleId={selectedPart.id}
          organelleName={selectedPart.name}
          onClose={() => setShowAnimation(false)}
        />
      )}
    </div>
  );
}
