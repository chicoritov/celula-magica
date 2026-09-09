import React, { useEffect, useState } from 'react';

interface AnimationModalProps {
  organelleId: number;
  organelleName: string;
  onClose: () => void;
}

// Animações SVG para cada organela
const animations: Record<number, { steps: string[]; icon: string; color: string }> = {
  1: {
    icon: '🛡️',
    color: '#f59e0b',
    steps: [
      'A membrana é como uma peneira super inteligente!',
      'Coisas boas entram: água, oxigênio, alimento.',
      'Coisas ruins saem: lixo, gás carbônico.',
      'Ela escolhe o que passa! É a porteira da célula.'
    ]
  },
  2: {
    icon: '🧠',
    color: '#8b5cf6',
    steps: [
      'O núcleo é o chefe da célula!',
      'Dentro dele tem o DNA (a receita da vida).',
      'Ele lê a receita e manda fazer proteínas.',
      'Os poros são portinhas que controlam a saída.'
    ]
  },
  3: {
    icon: '⚡',
    color: '#ef4444',
    steps: [
      'A mitocôndria é a usina de energia!',
      'Ela pega o alimento e o oxigênio.',
      'Mistura tudo e produz energia (ATP).',
      'A energia faz a célula funcionar!'
    ]
  },
  4: {
    icon: '💧',
    color: '#06b6d4',
    steps: [
      'O citoplasma é a gelatina da célula!',
      'Tudo fica boiando nele.',
      'As organelas se movem pelo citoplasma.',
      'É cheio de água e substâncias importantes.'
    ]
  },
  5: {
    icon: '🔧',
    color: '#10b981',
    steps: [
      'Os ribossomos são fábricas de proteínas!',
      'Eles leem a receita do DNA.',
      'Montam as proteínas, tijolo por tijolo.',
      'As proteínas fazem tudo na célula!'
    ]
  },
  6: {
    icon: '🛤️',
    color: '#f97316',
    steps: [
      'O retículo é uma rede de estradas!',
      'As proteínas viajam por ele.',
      'O rugoso tem ribossomos grudados.',
      'O liso faz gorduras e detoxifica.'
    ]
  },
  7: {
    icon: '📦',
    color: '#ec4899',
    steps: [
      'O Golgi é o correio da célula!',
      'Recebe proteínas do retículo.',
      'Empacota em vesículas (caixinhas).',
      'Envia para onde a célula precisa!'
    ]
  },
  8: {
    icon: '🗑️',
    color: '#84cc16',
    steps: [
      'O lisossomo é o lixeiro da célula!',
      'Ele tem enzimas digestivas dentro.',
      'Quebra o que está velho ou quebrado.',
      'Recicla tudo para a célula reusar!'
    ]
  }
};

const vegetalAnimations: Record<number, { steps: string[]; icon: string; color: string }> = {
  1: {
    icon: '🧱',
    color: '#65a30d',
    steps: [
      'A parede celular é como uma casca dura!',
      'É feita de celulose (igual papel).',
      'Deixa a planta firme e em pé.',
      'Protege contra insetos e doenças.'
    ]
  },
  2: {
    icon: '🛡️',
    color: '#f59e0b',
    steps: [
      'A membrana fica dentro da parede!',
      'Controla o que entra e sai.',
      'É igual à membrana da célula animal.',
      'Mas tem uma parede dura por fora.'
    ]
  },
  3: {
    icon: '🌿',
    color: '#22c55e',
    steps: [
      'O cloroplasto é verde e faz fotossíntese!',
      'Pega luz do sol + água + gás carbônico.',
      'Mistura tudo e faz açúcar (alimento).',
      'Também solta oxigênio para a gente respirar!'
    ]
  },
  4: {
    icon: '💎',
    color: '#3b82f6',
    steps: [
      'O vacúolo é uma garrafinha gigante!',
      'Guarda muita água e sais minerais.',
      'Deixa a célula cheia e firme.',
      'Quando a planta murcha, o vacúolo esvazia!'
    ]
  },
  5: {
    icon: '🧠',
    color: '#8b5cf6',
    steps: [
      'O núcleo da planta é igual ao do animal!',
      'Tem o DNA (receita da vida).',
      'Comanda tudo na célula.',
      'Fica empurrado pro lado pelo vacúolo.'
    ]
  },
  6: {
    icon: '⚡',
    color: '#ef4444',
    steps: [
      'A mitocôndria da planta é igual à do animal!',
      'Produz energia (ATP) para a célula.',
      'Usa o açúcar feito pelo cloroplasto.',
      'Funciona dia e noite!'
    ]
  },
  7: {
    icon: '💧',
    color: '#06b6d4',
    steps: [
      'O citoplasma preenche a célula vegetal!',
      'É mais apertado por causa do vacúolo.',
      'As organelas ficam espremidas.',
      'Mas tudo funciona direitinho!'
    ]
  },
  8: {
    icon: '🔧',
    color: '#10b981',
    steps: [
      'Os ribossomos da planta são iguais!',
      'Fazem proteínas para a célula.',
      'Ficam livres ou grudados no RE.',
      'São bem pequenos mas muito importantes!'
    ]
  }
};

export function AnimationModal({ organelleId, organelleName, onClose }: AnimationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Tenta pegar a animação da célula animal, se não encontrar, usa a vegetal
  const animData = animations[organelleId] || vegetalAnimations[organelleId];
  
  useEffect(() => {
    if (!animData || !isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep(s => {
        if (s >= animData.steps.length - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isPlaying, animData]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!animData) return null;

  const restart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="animation-title"
    >
      <div className="modal-content glass-card p-6 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">{animData.icon}</span>
            <div>
              <h3 id="animation-title" className="text-xl font-bold text-white">
                {organelleName}
              </h3>
              <p className="text-white/60 text-sm">🎬 Mini-aula animada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/20"
            aria-label="Fechar animação"
            autoFocus
          >
            ✕
          </button>
        </div>

        {/* Área de animação */}
        <div
          className="rounded-xl p-6 mb-4 min-h-[200px] flex items-center justify-center transition-all duration-500"
          style={{ backgroundColor: `${animData.color}22`, border: `2px solid ${animData.color}44` }}
        >
          <div className="text-center">
            {/* Ícone animado */}
            <div
              className="text-7xl mb-4 transition-all duration-500"
              style={{
                transform: `scale(${1 + currentStep * 0.05}) rotate(${currentStep * 3}deg)`,
                filter: `drop-shadow(0 0 ${10 + currentStep * 5}px ${animData.color})`
              }}
              aria-hidden="true"
            >
              {animData.icon}
            </div>
            
            {/* Texto da etapa atual */}
            <p className="text-white text-lg font-medium leading-relaxed">
              {animData.steps[currentStep]}
            </p>
          </div>
        </div>

        {/* Progresso */}
        <div className="flex gap-1 mb-4">
          {animData.steps.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i <= currentStep ? animData.color : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="flex-1 glass-card px-4 py-2 text-white font-semibold hover:bg-white/20 min-h-[44px] disabled:opacity-30"
          >
            ← Anterior
          </button>
          {currentStep >= animData.steps.length - 1 ? (
            <button
              onClick={restart}
              className="flex-1 btn-primary"
            >
              🔄 Rever
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentStep(s => s + 1);
                setIsPlaying(false);
              }}
              className="flex-1 btn-primary"
            >
              Próximo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
