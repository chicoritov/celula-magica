import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface LabelProps {
  position: [number, number, number];
  labelPosition?: [number, number, number];
  text: string;
  subtext?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  onClick?: () => void;
  visible?: boolean;
}

/**
 * Sistema de Labels Premium estilo National Geographic
 * 
 * Características:
 * - Linhas pointer elegantes (thin lines)
 * - Backdrop blur (frosted glass)
 * - Animação de entrada suave
 * - Hover state com glow
 * - Acessibilidade completa (ARIA)
 */
export function PremiumLabel({
  position,
  labelPosition,
  text,
  subtext,
  icon,
  color = '#ffffff',
  isActive = false,
  onClick,
  visible = true,
}: LabelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Calcula posição do label (offset da organela)
  const labelPos = useMemo(() => {
    if (labelPosition) return new THREE.Vector3(...labelPosition);
    // Default: offset para cima e para o lado
    return new THREE.Vector3(
      position[0] + (position[0] > 0 ? 1.5 : -1.5),
      position[1] + 1,
      position[2]
    );
  }, [position, labelPosition]);

  const organellePos = useMemo(() => new THREE.Vector3(...position), [position]);

  // Pontos da linha pointer
  const linePoints = useMemo(() => {
    const midPoint = new THREE.Vector3().lerpVectors(organellePos, labelPos, 0.5);
    midPoint.y += 0.3; // Curva suave
    return [organellePos, midPoint, labelPos];
  }, [organellePos, labelPos]);

  // Animação de entrada
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Float suave
    groupRef.current.position.y = labelPos.y + Math.sin(time * 2) * 0.02;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* Ponto na organela */}
      <mesh position={organellePos}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Linha pointer */}
      <Line
        points={linePoints}
        color={color}
        lineWidth={isActive ? 2 : 1}
        transparent
        opacity={isActive ? 1 : 0.6}
      />

      {/* Label HTML com frosted glass */}
      <Html
        position={labelPos}
        center
        distanceFactor={8}
        style={{
          transition: 'all 0.3s ease',
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <button
          onClick={onClick}
          className={`
            group relative px-4 py-2 rounded-xl
            bg-white/10 backdrop-blur-md
            border border-white/20
            shadow-lg shadow-black/20
            hover:bg-white/20 hover:border-white/40
            transition-all duration-300
            min-w-[120px] text-left
            ${isActive ? 'ring-2 ring-offset-2 ring-offset-transparent' : ''}
          `}
          style={{
            borderColor: isActive ? color : undefined,
            boxShadow: isActive ? `0 0 20px ${color}40` : undefined,
          }}
          aria-label={`${text}${subtext ? `. ${subtext}` : ''}`}
          role="button"
          tabIndex={0}
        >
          {/* Ícone */}
          {icon && (
            <span className="text-2xl mr-2 inline-block" aria-hidden="true">
              {icon}
            </span>
          )}
          
          {/* Texto */}
          <div className="inline-block">
            <div
              className="text-white font-semibold text-sm leading-tight"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {text}
            </div>
            {subtext && (
              <div
                className="text-white/70 text-xs mt-0.5"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {subtext}
              </div>
            )}
          </div>

          {/* Glow effect quando ativo */}
          {isActive && (
            <div
              className="absolute inset-0 rounded-xl opacity-20 blur-xl -z-10"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          )}
        </button>
      </Html>
    </group>
  );
}

/**
 * Sistema completo de labels para todas as organelas
 */
interface LabelSystemProps {
  cellType: 'animal' | 'vegetal';
  activeOrganelle: number | null;
  onOrganelleClick: (id: number) => void;
  showLabels?: boolean;
}

// Posições das labels (offset das organelas)
const ANIMAL_LABEL_POSITIONS: Record<number, { organelle: [number, number, number]; label: [number, number, number] }> = {
  1: { organelle: [0, 0, 2.8], label: [2.5, 2, 2.8] }, // Membrana
  2: { organelle: [-0.3, 0.1, 0], label: [-2.5, 1.5, 0] }, // Núcleo
  3: { organelle: [1.8, 0.3, 0.6], label: [3, 1, 0.6] }, // Mitocôndria
  4: { organelle: [0, 0, 0], label: [0, -2.5, 2] }, // Citoplasma
  5: { organelle: [1.8, 0.5, -0.5], label: [3, 2, -0.5] }, // Ribossomos
  6: { organelle: [-1, 0, -1], label: [-3, 0, -1] }, // RE
  7: { organelle: [1.5, -0.5, 1], label: [3, -1.5, 1] }, // Golgi
  8: { organelle: [2.1, -0.6, -0.4], label: [3.5, -0.6, -0.4] }, // Lisossomo
};

const VEGETAL_LABEL_POSITIONS: Record<number, { organelle: [number, number, number]; label: [number, number, number] }> = {
  1: { organelle: [0, 1.9, 0], label: [3, 2.5, 0] }, // Parede
  2: { organelle: [0, 1.8, 2.5], label: [3, 1.8, 2.5] }, // Membrana
  3: { organelle: [-1.8, 1.2, 1.5], label: [-3.5, 2, 1.5] }, // Cloroplasto
  4: { organelle: [0.3, 0, 0.3], label: [2.5, 0, 2] }, // Vacúolo
  5: { organelle: [-1.2, 0.8, -0.5], label: [-3, 1.5, -0.5] }, // Núcleo
  6: { organelle: [2, 0.5, -1], label: [3.5, 1, -1] }, // Mitocôndria
  7: { organelle: [0, 0, 0], label: [0, -2.5, 2] }, // Citoplasma
  8: { organelle: [-1.8, 1, 1.5], label: [-3.5, 1, 1.5] }, // Ribossomos
};

const ORGANELLE_INFO: Record<number, { name: string; icon: string; color: string; subtext: string }> = {
  1: { name: 'Membrana', icon: '🛡️', color: '#f59e0b', subtext: 'Protege a célula' },
  2: { name: 'Núcleo', icon: '🧠', color: '#8b5cf6', subtext: 'Centro de controle' },
  3: { name: 'Mitocôndria', icon: '⚡', color: '#ef4444', subtext: 'Produz energia' },
  4: { name: 'Citoplasma', icon: '💧', color: '#06b6d4', subtext: 'Preenche a célula' },
  5: { name: 'Ribossomos', icon: '🔧', color: '#10b981', subtext: 'Fazem proteínas' },
  6: { name: 'Retículo', icon: '🛤️', color: '#f97316', subtext: 'Transporta materiais' },
  7: { name: 'Golgi', icon: '📦', color: '#ec4899', subtext: 'Empacota e envia' },
  8: { name: 'Lisossomo', icon: '🗑️', color: '#84cc16', subtext: 'Digere e recicla' },
};

const VEGETAL_EXTRA_INFO: Record<number, { name: string; icon: string; color: string; subtext: string }> = {
  1: { name: 'Parede Celular', icon: '🧱', color: '#65a30d', subtext: 'Dá firmeza' },
  3: { name: 'Cloroplasto', icon: '🌿', color: '#22c55e', subtext: 'Faz fotossíntese' },
  4: { name: 'Vacúolo', icon: '💎', color: '#3b82f6', subtext: 'Guarda água' },
};

export function LabelSystem({ cellType, activeOrganelle, onOrganelleClick, showLabels = true }: LabelSystemProps) {
  const positions = cellType === 'animal' ? ANIMAL_LABEL_POSITIONS : VEGETAL_LABEL_POSITIONS;
  const baseInfo = ORGANELLE_INFO;
  const extraInfo = cellType === 'vegetal' ? VEGETAL_EXTRA_INFO : {};

  if (!showLabels) return null;

  return (
    <group>
      {Object.entries(positions).map(([id, pos]) => {
        const idNum = parseInt(id);
        const info = extraInfo[idNum] || baseInfo[idNum];
        if (!info) return null;

        return (
          <PremiumLabel
            key={id}
            position={pos.organelle}
            labelPosition={pos.label}
            text={info.name}
            subtext={info.subtext}
            icon={info.icon}
            color={info.color}
            isActive={activeOrganelle === idNum}
            onClick={() => onOrganelleClick(idNum)}
            visible={true}
          />
        );
      })}
    </group>
  );
}
