import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  CytoplasmParticles,
  GlowEffect,
  EnhancedNucleus,
  EnhancedMitochondrion,
  EnhancedER,
  EnhancedGolgi,
  EnhancedChloroplast,
  EnhancedVacuole,
  EnhancedLysosome,
} from './Organelles3D';

interface CellScene3DProps {
  cellType: 'animal' | 'vegetal';
  activePart: number | null;
  onPartClick: (partId: number) => void;
  xrayMode?: boolean;
  xrayProgress?: number;
}

// Membrana celular aprimorada com textura lipídica
function CellMembrane({ color, isActive, onClick }: {
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
      meshRef.current.scale.setScalar(breathe);
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
      innerMeshRef.current.scale.setScalar(breathe * 0.98);
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Bicamada lipídica externa */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : color}
          emissive={isActive ? color : '#000000'}
          emissiveIntensity={isActive ? 0.4 : 0.05}
          transparent
          opacity={0.12}
          roughness={0.05}
          metalness={0}
          transmission={0.92}
          thickness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Membrana interna (bicamada) */}
      <mesh ref={innerMeshRef}>
        <sphereGeometry args={[2.72, 48, 48]} />
        <meshPhysicalMaterial
          color={isActive ? '#fef3c7' : color}
          emissive={isActive ? color : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
          transparent
          opacity={0.06}
          roughness={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Citoesqueleto - microtúbulos que dão estrutura
function Cytoskeleton() {
  const groupRef = useRef<THREE.Group>(null);

  const microtubules = useMemo(() => {
    const tubes = [];
    for (let i = 0; i < 20; i++) {
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = startAngle + (Math.random() - 0.5) * 1.5;
      const radius = 0.5 + Math.random() * 1.8;
      const height = (Math.random() - 0.5) * 2;
      
      tubes.push({
        start: [Math.cos(startAngle) * radius * 0.3, height * 0.3, Math.sin(startAngle) * radius * 0.3] as [number, number, number],
        end: [Math.cos(endAngle) * radius, height, Math.sin(endAngle) * radius] as [number, number, number],
      });
    }
    return tubes;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {microtubules.map((tube, i) => {
        const direction = new THREE.Vector3(
          tube.end[0] - tube.start[0],
          tube.end[1] - tube.start[1],
          tube.end[2] - tube.start[2]
        );
        const length = direction.length();
        const midpoint = new THREE.Vector3(
          (tube.start[0] + tube.end[0]) / 2,
          (tube.start[1] + tube.end[1]) / 2,
          (tube.start[2] + tube.end[2]) / 2
        );
        
        return (
          <mesh
            key={i}
            position={[midpoint.x, midpoint.y, midpoint.z]}
            quaternion={new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              direction.normalize()
            )}
          >
            <cylinderGeometry args={[0.008, 0.008, length, 6]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

// Parede celular (vegetal)
function CellWall({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <boxGeometry args={[5.2, 3.8, 5.2]} />
      <meshPhysicalMaterial
        color={isActive ? '#ffffff' : '#65a30d'}
        emissive={isActive ? '#65a30d' : '#000000'}
        emissiveIntensity={isActive ? 0.3 : 0}
        transparent
        opacity={0.1}
        roughness={0.8}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
}

// Ribossomos distribuídos
function Ribosomes({ positions, isActive, onClick }: {
  positions: [number, number, number][];
  isActive: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[0, 0, 0]} color="#10b981" scale={2} active={isActive} />
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshPhysicalMaterial
            color={isActive ? '#ffffff' : '#6ee7b7'}
            emissive={isActive ? '#10b981' : '#000000'}
            emissiveIntensity={isActive ? 0.5 : 0.1}
            roughness={0.3}
            clearcoat={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Área invisível para clicar no citoplasma
function CytoplasmClickArea({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <mesh visible={false} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <sphereGeometry args={[2.7, 32, 32]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// Célula Animal 3D Melhorada
function AnimalCell3D({ activePart, onPartClick }: { activePart: number | null; onPartClick: (id: number) => void }) {
  const ribosomePositions: [number, number, number][] = useMemo(() => [
    // Livres no citoplasma
    [1.8, 0.5, -0.5], [2, -0.3, 0.8], [-1.5, 0.8, 1.2],
    [-1.8, -0.5, -0.8], [0.5, 1.5, 1.5], [-0.8, -1.2, 1.8],
    [1.2, 1, 1.8], [-1, 1.5, -1.2], [1.5, -1.5, 0.5],
    [-1.8, 1.2, -0.5], [0.8, 1.8, -1], [-0.5, -1.8, 0.8],
    // Aderidos ao RE
    [-0.8, 0.3, -0.9], [-1.1, -0.2, -0.7], [-0.6, 0.5, -1.1],
    [-0.9, -0.4, -1.0], [-1.2, 0.1, -0.8]
  ], []);

  const peroxisomePositions: [number, number, number][] = useMemo(() => [
    [1.6, -1.2, 0.8],
    [-1.3, 1.4, 0.6],
    [0.9, -1.8, -0.7]
  ], []);

  return (
    <>
      {/* Citoesqueleto - microtúbulos estruturais */}
      <Cytoskeleton />
      
      {/* Partículas do citoplasma - mais densas perto do núcleo */}
      <CytoplasmParticles count={200} radius={2.5} color="#e0f2fe" />
      <CytoplasmParticles count={80} radius={1.5} color="#c4b5fd" />
      
      {/* Membrana celular - bicamada lipídica */}
      <CellMembrane color="#f59e0b" isActive={activePart === 1} onClick={() => onPartClick(1)} />
      
      {/* Núcleo - posicionado lateralmente (mais realista) */}
      <EnhancedNucleus isActive={activePart === 2} onClick={() => onPartClick(2)} position={[-0.3, 0.1, 0]} />
      
      {/* Mitocôndrias - distribuídas onde há demanda energética */}
      <EnhancedMitochondrion position={[1.8, 0.3, 0.6]} rotation={[0.3, 0.5, 0]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedMitochondrion position={[-1.6, -0.9, 0.8]} rotation={[0.8, 0.2, 0.4]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedMitochondrion position={[0.8, -1.6, -0.9]} rotation={[0.1, 0.9, 0.3]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedMitochondrion position={[-1.9, 0.7, -0.6]} rotation={[0.5, 0.3, 0.7]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedMitochondrion position={[1.5, 1.2, -1.1]} rotation={[0.7, 0.6, 0.2]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedMitochondrion position={[-0.5, -1.9, 1.2]} rotation={[0.4, 0.8, 0.5]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      
      {/* Citoplasma (área clicável) */}
      <CytoplasmClickArea isActive={activePart === 4} onClick={() => onPartClick(4)} />
      
      {/* Ribossomos - livres e aderidos ao RE */}
      <Ribosomes positions={ribosomePositions} isActive={activePart === 5} onClick={() => onPartClick(5)} />
      
      {/* Retículo Endoplasmático Rugoso - conectado ao núcleo */}
      <EnhancedER isActive={activePart === 6} onClick={() => onPartClick(6)} rough={true} />
      
      {/* Complexo de Golgi - próximo ao RE */}
      <EnhancedGolgi isActive={activePart === 7} onClick={() => onPartClick(7)} />
      
      {/* Lisossomos - distribuídos pela célula */}
      <EnhancedLysosome position={[2.1, -0.6, -0.4]} isActive={activePart === 8} onClick={() => onPartClick(8)} />
      <EnhancedLysosome position={[-1.9, 0.4, -0.9]} isActive={activePart === 8} onClick={() => onPartClick(8)} />
      <EnhancedLysosome position={[1.4, 1.7, 0.7]} isActive={activePart === 8} onClick={() => onPartClick(8)} />
      <EnhancedLysosome position={[-0.7, -1.7, -1.3]} isActive={activePart === 8} onClick={() => onPartClick(8)} />
    </>
  );
}

// Célula Vegetal 3D Melhorada
function VegetalCell3D({ activePart, onPartClick }: { activePart: number | null; onPartClick: (id: number) => void }) {
  const ribosomePositions: [number, number, number][] = useMemo(() => [
    [-1.8, 1, 1.5], [1.5, 1.2, -1.5], [-1.5, -1.2, -1.2],
    [2, -0.5, 1], [0.5, -1.8, -1], [-0.5, 1.8, 0.5],
    [1.8, 1.5, 1], [-2, -1, 0.8]
  ], []);

  return (
    <>
      {/* Partículas do citoplasma */}
      <CytoplasmParticles count={120} radius={2.3} color="#dcfce7" />
      
      {/* Parede Celular */}
      <CellWall isActive={activePart === 1} onClick={() => onPartClick(1)} />
      
      {/* Membrana */}
      <mesh onClick={(e) => { e.stopPropagation(); onPartClick(2); }}>
        <boxGeometry args={[5, 3.6, 5]} />
        <meshPhysicalMaterial
          color={activePart === 2 ? '#ffffff' : '#f59e0b'}
          emissive={activePart === 2 ? '#f59e0b' : '#000000'}
          emissiveIntensity={activePart === 2 ? 0.3 : 0}
          transparent
          opacity={0.06}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Cloroplastos */}
      <EnhancedChloroplast position={[-1.8, 1.2, 1.5]} rotation={[0.3, 0.5, 0]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedChloroplast position={[1.8, -1, 1.8]} rotation={[0.8, 0.2, 0.4]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedChloroplast position={[-2, -0.5, -1.5]} rotation={[0.1, 0.9, 0.3]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedChloroplast position={[1.5, 1.5, -1.2]} rotation={[0.5, 0.3, 0.7]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      <EnhancedChloroplast position={[-1.2, -1.5, 1.2]} rotation={[0.7, 0.4, 0.2]} isActive={activePart === 3} onClick={() => onPartClick(3)} />
      
      {/* Vacúolo */}
      <EnhancedVacuole isActive={activePart === 4} onClick={() => onPartClick(4)} />
      
      {/* Núcleo */}
      <EnhancedNucleus isActive={activePart === 5} onClick={() => onPartClick(5)} position={[-1.2, 0.8, -0.5]} />
      
      {/* Mitocôndrias */}
      <EnhancedMitochondrion position={[2, 0.5, -1]} rotation={[0.3, 0.5, 0]} isActive={activePart === 6} onClick={() => onPartClick(6)} />
      <EnhancedMitochondrion position={[-1, -1.5, 1.5]} rotation={[0.8, 0.2, 0.4]} isActive={activePart === 6} onClick={() => onPartClick(6)} />
      
      {/* Citoplasma (área clicável) */}
      <mesh visible={false} onClick={(e) => { e.stopPropagation(); onPartClick(7); }}>
        <boxGeometry args={[4.8, 3.4, 4.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Ribossomos */}
      <Ribosomes positions={ribosomePositions} isActive={activePart === 8} onClick={() => onPartClick(8)} />
    </>
  );
}

// Cena principal aprimorada
export function CellScene3D({ cellType, activePart, onPartClick, xrayMode = false, xrayProgress = 0 }: CellScene3DProps) {
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  
  // Anima o plano de corte baseado no progresso
  useEffect(() => {
    if (xrayMode) {
      clippingPlane.constant = 3 - xrayProgress * 3; // De 3 (fora) até 0 (meio)
    } else {
      clippingPlane.constant = 3; // Fora da célula
    }
  }, [xrayMode, xrayProgress, clippingPlane]);
  
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 7], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          localClippingEnabled: true
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        {/* Iluminação estilo microscópio de fluorescência */}
        <ambientLight intensity={0.4} />
        
        {/* Luz principal - simula iluminação do microscópio */}
        <directionalLight position={[0, 8, 5]} intensity={1.2} castShadow color="#ffffff" />
        <directionalLight position={[0, -5, -3]} intensity={0.3} color="#e0e7ff" />
        
        {/* Luzes coloridas para efeito de fluorescência */}
        <pointLight position={[3, 2, 3]} intensity={0.5} color="#8b5cf6" distance={10} decay={2} />
        <pointLight position={[-3, -2, 3]} intensity={0.4} color="#06b6d4" distance={10} decay={2} />
        <pointLight position={[0, 3, -3]} intensity={0.35} color="#ec4899" distance={8} decay={2} />
        <pointLight position={[-2, 0, -2]} intensity={0.3} color="#10b981" distance={8} decay={2} />
        
        {/* Luz de preenchimento suave */}
        <hemisphereLight intensity={0.3} color="#fef3c7" groundColor="#3b82f6" />
        
        {/* Environment para reflexos realistas */}
        <Environment preset="city" />
        
        {/* Controles de órbita */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.5}
          makeDefault
          enableDamping
          dampingFactor={0.05}
        />

        {/* Célula */}
        <Suspense fallback={null}>
          {cellType === 'animal' ? (
            <AnimalCell3D activePart={activePart} onPartClick={onPartClick} />
          ) : (
            <VegetalCell3D activePart={activePart} onPartClick={onPartClick} />
          )}
        </Suspense>

        {/* Indicador visual do plano de corte (Raio-X) */}
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
        <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={10} blur={2.5} far={4} />
        
        {/* Fog sutil para profundidade */}
        <fog attach="fog" args={['#1e1b4b', 10, 25]} />
      </Canvas>
    </div>
  );
}
