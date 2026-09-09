import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Html } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { LIGHTING_CONFIG, POSTPROCESSING_CONFIG } from '../lib/materials';
import { LabelSystem } from './LabelSystem';
import { OrganelleAnimation, ChloroplastAnimationWrapper } from './OrganelleAnimations';

// Importa organelas melhoradas
import {
  CytoplasmParticles,
  EnhancedNucleus,
  EnhancedMitochondrion,
  EnhancedER,
  EnhancedGolgi,
  EnhancedChloroplast,
  EnhancedVacuole,
  EnhancedLysosome,
} from './Organelles3D';

interface PremiumSceneProps {
  cellType: 'animal' | 'vegetal';
  activeOrganelle: number | null;
  onOrganelleClick: (id: number) => void;
  xrayMode?: boolean;
  xrayProgress?: number;
  showLabels?: boolean;
  className?: string;
}

// ====== ILUMINAÇÃO CINEMATOGRÁFICA DE 3 PONTOS ======
function CinematicLighting() {
  const { key, fill, rim, ambient, accents } = LIGHTING_CONFIG;

  return (
    <>
      {/* Key Light - Luz principal */}
      <directionalLight
        position={key.position}
        intensity={key.intensity}
        color={key.color}
        castShadow={key.castShadow}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill Light - Luz de preenchimento */}
      <directionalLight
        position={fill.position}
        intensity={fill.intensity}
        color={fill.color}
      />

      {/* Rim Light - Luz de contorno */}
      <directionalLight
        position={rim.position}
        intensity={rim.intensity}
        color={rim.color}
      />

      {/* Ambient Light - Luz ambiente */}
      <ambientLight intensity={ambient.intensity} color={ambient.color} />

      {/* Accent Lights - Luzes de destaque */}
      {accents.map((light, i) => (
        <pointLight
          key={i}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
          distance={light.distance}
          decay={2}
        />
      ))}

      {/* Hemisphere Light - Luz do céu/chão */}
      <hemisphereLight
        intensity={0.2}
        color="#fef3c7" // Céu âmbar
        groundColor="#3b82f6" // Chão azul
      />
    </>
  );
}

// ====== POST-PROCESSING PIPELINE ======
function PostProcessing() {
  const { bloom, vignette } = POSTPROCESSING_CONFIG;

  return (
    <EffectComposer>
      {/* Bloom - Brilho em organelas luminosas */}
      <Bloom
        luminanceThreshold={bloom.luminanceThreshold}
        luminanceSmoothing={bloom.luminanceSmoothing}
        intensity={bloom.intensity}
      />

      {/* Vignette - Escurece bordas para foco central */}
      <Vignette
        offset={vignette.offset}
        darkness={vignette.darkness}
      />
    </EffectComposer>
  );
}

// ====== MEMBRANA COM CLIPPING ======
function PremiumMembrane({ color, isActive, onClick, clippingPlane }: {
  color: string;
  isActive: boolean;
  onClick: () => void;
  clippingPlane: THREE.Plane | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
      meshRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <sphereGeometry args={[2.8, 64, 64]} />
      <meshPhysicalMaterial
        color={isActive ? '#ffffff' : color}
        emissive={isActive ? color : '#000000'}
        emissiveIntensity={isActive ? 0.4 : 0.05}
        transparent
        opacity={0.12}
        roughness={0.05}
        transmission={0.95}
        thickness={0.5}
        clearcoat={1}
        clearcoatRoughness={0.02}
        side={THREE.DoubleSide}
        clippingPlanes={clippingPlane ? [clippingPlane] : []}
      />
    </mesh>
  );
}

// ====== CÉLULA ANIMAL PREMIUM ======
function PremiumAnimalCell({ activeOrganelle, onOrganelleClick, clippingPlane }: {
  activeOrganelle: number | null;
  onOrganelleClick: (id: number) => void;
  clippingPlane: THREE.Plane | null;
}) {
  const ribosomePositions: [number, number, number][] = useMemo(() => [
    [1.8, 0.5, -0.5], [2, -0.3, 0.8], [-1.5, 0.8, 1.2],
    [-1.8, -0.5, -0.8], [0.5, 1.5, 1.5], [-0.8, -1.2, 1.8],
    [1.2, 1, 1.8], [-1, 1.5, -1.2], [1.5, -1.5, 0.5],
    [-1.8, 1.2, -0.5], [0.8, 1.8, -1], [-0.5, -1.8, 0.8],
  ], []);

  return (
    <group>
      {/* Partículas do citoplasma */}
      <CytoplasmParticles count={120} radius={2.5} color="#e0f2fe" />

      {/* Membrana */}
      <PremiumMembrane
        color="#fde68a"
        isActive={activeOrganelle === 1}
        onClick={() => onOrganelleClick(1)}
        clippingPlane={clippingPlane}
      />

      {/* Núcleo */}
      <EnhancedNucleus
        isActive={activeOrganelle === 2}
        onClick={() => onOrganelleClick(2)}
        position={[-0.3, 0.1, 0]}
      />

      {/* Mitocôndrias */}
      <EnhancedMitochondrion position={[1.8, 0.3, 0.6]} rotation={[0.3, 0.5, 0]} isActive={activeOrganelle === 3} onClick={() => onOrganelleClick(3)} />
      <EnhancedMitochondrion position={[-1.6, -0.9, 0.8]} rotation={[0.8, 0.2, 0.4]} isActive={activeOrganelle === 3} onClick={() => onOrganelleClick(3)} />
      <EnhancedMitochondrion position={[0.8, -1.6, -0.9]} rotation={[0.1, 0.9, 0.3]} isActive={activeOrganelle === 3} onClick={() => onOrganelleClick(3)} />

      {/* Citoplasma (área clicável) */}
      <mesh visible={false} onClick={(e) => { e.stopPropagation(); onOrganelleClick(4); }}>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ribossomos */}
      <group onClick={(e) => { e.stopPropagation(); onOrganelleClick(5); }}>
        {ribosomePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshPhysicalMaterial
              color={activeOrganelle === 5 ? '#ffffff' : '#6ee7b7'}
              emissive={activeOrganelle === 5 ? '#10b981' : '#000000'}
              emissiveIntensity={activeOrganelle === 5 ? 0.5 : 0.1}
              roughness={0.3}
              clearcoat={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Retículo Endoplasmático */}
      <EnhancedER isActive={activeOrganelle === 6} onClick={() => onOrganelleClick(6)} rough={true} />

      {/* Complexo de Golgi */}
      <EnhancedGolgi isActive={activeOrganelle === 7} onClick={() => onOrganelleClick(7)} />

      {/* Lisossomos */}
      <EnhancedLysosome position={[2.1, -0.6, -0.4]} isActive={activeOrganelle === 8} onClick={() => onOrganelleClick(8)} />
      <EnhancedLysosome position={[-1.9, 0.4, -0.9]} isActive={activeOrganelle === 8} onClick={() => onOrganelleClick(8)} />

      {/* Animação da organela selecionada */}
      {activeOrganelle && (
        <OrganelleAnimation
          organelleId={activeOrganelle}
          active={true}
          position={activeOrganelle === 2 ? [-0.3, 0.1, 0] : [0, 0, 0]}
        />
      )}
    </group>
  );
}

// ====== CÉLULA VEGETAL PREMIUM ======
function PremiumVegetalCell({ activeOrganelle, onOrganelleClick, clippingPlane }: {
  activeOrganelle: number | null;
  onOrganelleClick: (id: number) => void;
  clippingPlane: THREE.Plane | null;
}) {
  const ribosomePositions: [number, number, number][] = useMemo(() => [
    [-1.8, 1, 1.5], [1.5, 1.2, -1.5], [-1.5, -1.2, -1.2],
    [2, -0.5, 1], [0.5, -1.8, -1], [-0.5, 1.8, 0.5],
  ], []);

  return (
    <group>
      {/* Partículas do citoplasma */}
      <CytoplasmParticles count={100} radius={2.3} color="#dcfce7" />

      {/* Parede Celular */}
      <mesh onClick={(e) => { e.stopPropagation(); onOrganelleClick(1); }}>
        <boxGeometry args={[5.2, 3.8, 5.2]} />
        <meshPhysicalMaterial
          color={activeOrganelle === 1 ? '#ffffff' : '#65a30d'}
          emissive={activeOrganelle === 1 ? '#65a30d' : '#000000'}
          emissiveIntensity={activeOrganelle === 1 ? 0.3 : 0}
          transparent
          opacity={0.1}
          roughness={0.7}
          side={THREE.DoubleSide}
          wireframe
          clippingPlanes={clippingPlane ? [clippingPlane] : []}
        />
      </mesh>

      {/* Membrana */}
      <mesh onClick={(e) => { e.stopPropagation(); onOrganelleClick(2); }}>
        <boxGeometry args={[5, 3.6, 5]} />
        <meshPhysicalMaterial
          color={activeOrganelle === 2 ? '#ffffff' : '#fde68a'}
          emissive={activeOrganelle === 2 ? '#f59e0b' : '#000000'}
          emissiveIntensity={activeOrganelle === 2 ? 0.3 : 0}
          transparent
          opacity={0.06}
          roughness={0.05}
          side={THREE.DoubleSide}
          clippingPlanes={clippingPlane ? [clippingPlane] : []}
        />
      </mesh>

      {/* Cloroplastos */}
      <EnhancedChloroplast position={[-1.8, 1.2, 1.5]} rotation={[0.3, 0.5, 0]} isActive={activeOrganelle === 3} onClick={() => onOrganelleClick(3)} />
      <EnhancedChloroplast position={[1.8, -1, 1.8]} rotation={[0.8, 0.2, 0.4]} isActive={activeOrganelle === 3} onClick={() => onOrganelleClick(3)} />
      <EnhancedChloroplast position={[-2, -0.5, -1.5]} rotation={[0.1, 0.9, 0.3]} isActive={activeOrganelle === 3} onClick={() => onOrganelleClick(3)} />

      {/* Vacúolo */}
      <EnhancedVacuole isActive={activeOrganelle === 4} onClick={() => onOrganelleClick(4)} />

      {/* Núcleo */}
      <EnhancedNucleus isActive={activeOrganelle === 5} onClick={() => onOrganelleClick(5)} position={[-1.2, 0.8, -0.5]} />

      {/* Mitocôndrias */}
      <EnhancedMitochondrion position={[2, 0.5, -1]} rotation={[0.3, 0.5, 0]} isActive={activeOrganelle === 6} onClick={() => onOrganelleClick(6)} />
      <EnhancedMitochondrion position={[-1, -1.5, 1.5]} rotation={[0.8, 0.2, 0.4]} isActive={activeOrganelle === 6} onClick={() => onOrganelleClick(6)} />

      {/* Citoplasma */}
      <mesh visible={false} onClick={(e) => { e.stopPropagation(); onOrganelleClick(7); }}>
        <boxGeometry args={[4.8, 3.4, 4.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ribossomos */}
      <group onClick={(e) => { e.stopPropagation(); onOrganelleClick(8); }}>
        {ribosomePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshPhysicalMaterial
              color={activeOrganelle === 8 ? '#ffffff' : '#6ee7b7'}
              emissive={activeOrganelle === 8 ? '#10b981' : '#000000'}
              emissiveIntensity={activeOrganelle === 8 ? 0.5 : 0.1}
              roughness={0.3}
              clearcoat={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Animação da organela selecionada */}
      {activeOrganelle && (
        <>
          <OrganelleAnimation
            organelleId={activeOrganelle}
            active={true}
            position={activeOrganelle === 5 ? [-1.2, 0.8, -0.5] : [0, 0, 0]}
          />
          {activeOrganelle === 3 && (
            <ChloroplastAnimationWrapper active={true} position={[-1.8, 1.2, 1.5]} />
          )}
        </>
      )}
    </group>
  );
}

// ====== CENA PREMIUM PRINCIPAL ======
export function PremiumScene({
  cellType,
  activeOrganelle,
  onOrganelleClick,
  xrayMode = false,
  xrayProgress = 0,
  showLabels = true,
  className = '',
}: PremiumSceneProps) {
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 3), []);

  // Anima o plano de corte
  useEffect(() => {
    if (xrayMode) {
      clippingPlane.constant = 3 - xrayProgress * 3;
    } else {
      clippingPlane.constant = 3;
    }
  }, [xrayMode, xrayProgress, clippingPlane]);

  return (
    <div className={`w-full h-full min-h-[400px] rounded-xl overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 2, 7], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          localClippingEnabled: true,
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        shadows
      >
        {/* Iluminação Cinematográfica */}
        <CinematicLighting />

        {/* HDRI Environment para reflexos realistas */}
        <Environment preset="city" />

        {/* Controles de Órbita */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Célula */}
        <Suspense fallback={null}>
          {cellType === 'animal' ? (
            <PremiumAnimalCell
              activeOrganelle={activeOrganelle}
              onOrganelleClick={onOrganelleClick}
              clippingPlane={xrayMode ? clippingPlane : null}
            />
          ) : (
            <PremiumVegetalCell
              activeOrganelle={activeOrganelle}
              onOrganelleClick={onOrganelleClick}
              clippingPlane={xrayMode ? clippingPlane : null}
            />
          )}
        </Suspense>

        {/* Sistema de Labels */}
        <LabelSystem
          cellType={cellType}
          activeOrganelle={activeOrganelle}
          onOrganelleClick={onOrganelleClick}
          showLabels={showLabels}
        />

        {/* Plano de corte visual (Raio-X) */}
        {xrayMode && xrayProgress > 0 && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 3 - xrayProgress * 3, 0]}>
            <planeGeometry args={[8, 8]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.15 * xrayProgress}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Sombras de contato */}
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4}
        />

        {/* Post-Processing */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}
