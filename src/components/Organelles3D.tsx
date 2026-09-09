import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Partículas flutuantes para simular o citoplasma
export function CytoplasmParticles({ count = 100, radius = 2.5, color = '#ffffff' }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * radius;
      temp.push({
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.03,
      });
    }
    return temp;
  }, [count, radius]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    particles.forEach((particle, i) => {
      const x = particle.position.x + Math.sin(time * particle.speed + particle.offset) * 0.1;
      const y = particle.position.y + Math.cos(time * particle.speed * 0.7 + particle.offset) * 0.1;
      const z = particle.position.z + Math.sin(time * particle.speed * 0.5 + particle.offset) * 0.1;
      
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </instancedMesh>
  );
}

// Glow effect para organelas ativas
export function GlowEffect({ position, color, scale = 1, active = false }: {
  position: [number, number, number];
  color: string;
  scale?: number;
  active?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    meshRef.current.scale.setScalar(scale * pulse * 1.3);
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Núcleo melhorado com poros nucleares
export function EnhancedNucleus({ isActive, onClick, position = [0, 0, 0] }: {
  isActive: boolean;
  onClick: () => void;
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (innerRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      innerRef.current.scale.setScalar(pulse);
    }
  });

  // Poros nucleares
  const pores = useMemo(() => {
    const p = [];
    for (let i = 0; i < 12; i++) {
      const theta = (i / 12) * Math.PI * 2;
      const phi = Math.acos(2 * (i / 12) - 1);
      p.push({
        position: [
          Math.sin(phi) * Math.cos(theta) * 1.15,
          Math.sin(phi) * Math.sin(theta) * 1.15,
          Math.cos(phi) * 1.15
        ] as [number, number, number],
        rotation: [phi, theta, 0] as [number, number, number]
      });
    }
    return p;
  }, []);

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[0, 0, 0]} color="#8b5cf6" scale={1.2} active={isActive} />
      
      {/* Membrana nuclear */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.15, 48, 48]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : '#c4b5fd'}
          emissive={isActive ? '#8b5cf6' : '#4c1d95'}
          emissiveIntensity={isActive ? 0.6 : 0.1}
          transparent
          opacity={0.4}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Cromatina/DNA */}
      <mesh position={[0.2, 0.1, 0.1]}>
        <torusKnotGeometry args={[0.3, 0.08, 64, 16]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : '#7c3aed'}
          emissive={isActive ? '#7c3aed' : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0}
          roughness={0.3}
        />
      </mesh>
      
      {/* Nucléolo */}
      <mesh position={[-0.3, -0.2, 0.2]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : '#6d28d9'}
          emissive={isActive ? '#6d28d9' : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0}
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>
      
      {/* Poros nucleares */}
      {pores.map((pore, i) => (
        <mesh key={i} position={pore.position} rotation={pore.rotation}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshPhysicalMaterial
            color={isActive ? '#ffffff' : '#a78bfa'}
            emissive={isActive ? '#a78bfa' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Mitocôndria melhorada com cristas detalhadas
export function EnhancedMitochondrion({ 
  position, 
  rotation, 
  isActive, 
  onClick 
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.02;
      groupRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[0, 0, 0]} color="#ef4444" scale={0.4} active={isActive} />
      
      {/* Membrana externa */}
      <mesh>
        <capsuleGeometry args={[0.22, 0.5, 24, 24]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : '#fca5a5'}
          emissive={isActive ? '#ef4444' : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0}
          transparent
          opacity={0.7}
          roughness={0.2}
          transmission={0.3}
          thickness={0.3}
          clearcoat={0.5}
        />
      </mesh>
      
      {/* Membrana interna com cristas */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, (i - 2) * 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.15, 0.025, 12, 24]} />
          <meshPhysicalMaterial
            color={isActive ? '#ffffff' : '#dc2626'}
            emissive={isActive ? '#dc2626' : '#000000'}
            emissiveIntensity={isActive ? 0.4 : 0.1}
            roughness={0.4}
          />
        </mesh>
      ))}
      
      {/* Matriz interna */}
      <mesh>
        <capsuleGeometry args={[0.18, 0.45, 16, 16]} />
        <meshPhysicalMaterial
          color={isActive ? '#fef2f2' : '#fecaca'}
          emissive={isActive ? '#ef4444' : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
          transparent
          opacity={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Retículo Endoplasmático Rugoso com ribossomos
export function EnhancedER({ isActive, onClick, rough = true }: { isActive: boolean; onClick: () => void; rough?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const tubes = useMemo(() => {
    const t = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 4;
      const radius = 1.4 + Math.sin(i * 0.7) * 0.3;
      t.push({
        position: [
          Math.cos(angle) * radius - 0.5,
          Math.sin(i * 0.9) * 0.6,
          Math.sin(angle) * radius - 0.5
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number]
      });
    }
    return t;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[-0.5, 0, -0.5]} color="#f97316" scale={1.5} active={isActive} />
      
      {/* Tubos do retículo */}
      {tubes.map((tube, i) => (
        <mesh key={i} position={tube.position} rotation={tube.rotation}>
          <torusGeometry args={[0.12, 0.04, 12, 24]} />
          <meshPhysicalMaterial
            color={isActive ? '#ffffff' : '#f97316'}
            emissive={isActive ? '#f97316' : '#000000'}
            emissiveIntensity={isActive ? 0.4 : 0.1}
            roughness={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Ribossomos no RE rugoso */}
      {rough && tubes.slice(0, 8).map((tube, i) => (
        <mesh key={`r-${i}`} position={[tube.position[0] + 0.05, tube.position[1] + 0.05, tube.position[2]]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshPhysicalMaterial
            color={isActive ? '#ffffff' : '#10b981'}
            emissive={isActive ? '#10b981' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Complexo de Golgi com vesículas
export function EnhancedGolgi({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[1.5, -0.5, 1]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[0, 0, 0]} color="#ec4899" scale={0.5} active={isActive} />
      
      {/* Discos do Golgi */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, i * 0.12 - 0.3, 0]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.35 - i * 0.02, 0.35 - i * 0.02, 0.05, 32]} />
          <meshPhysicalMaterial
            color={isActive ? '#ffffff' : '#ec4899'}
            emissive={isActive ? '#ec4899' : '#000000'}
            emissiveIntensity={isActive ? 0.5 : 0.1}
            roughness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
      
      {/* Vesículas brotando */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`v-${i}`} position={[0.4 + i * 0.1, i * 0.15 - 0.2, 0.1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshPhysicalMaterial
            color={isActive ? '#ffffff' : '#f472b6'}
            emissive={isActive ? '#f472b6' : '#000000'}
            emissiveIntensity={isActive ? 0.4 : 0}
            transparent
            opacity={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Cloroplasto melhorado com lamelas
export function EnhancedChloroplast({ 
  position, 
  rotation, 
  isActive, 
  onClick 
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.02;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[0, 0, 0]} color="#22c55e" scale={0.35} active={isActive} />
      
      {/* Membrana externa */}
      <mesh>
        <capsuleGeometry args={[0.18, 0.35, 24, 24]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : '#86efac'}
          emissive={isActive ? '#22c55e' : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0}
          transparent
          opacity={0.6}
          roughness={0.2}
          transmission={0.4}
          thickness={0.3}
        />
      </mesh>
      
      {/* Lamelas (tilacoides empilhados - granum) */}
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[(i - 2) * 0.08, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {[...Array(3)].map((_, j) => (
            <mesh key={j} position={[0, 0, (j - 1) * 0.04]}>
              <cylinderGeometry args={[0.1, 0.1, 0.015, 20]} />
              <meshPhysicalMaterial
                color={isActive ? '#ffffff' : '#16a34a'}
                emissive={isActive ? '#16a34a' : '#000000'}
                emissiveIntensity={isActive ? 0.4 : 0.15}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Estroma */}
      <mesh>
        <capsuleGeometry args={[0.15, 0.3, 16, 16]} />
        <meshPhysicalMaterial
          color={isActive ? '#f0fdf4' : '#bbf7d0'}
          emissive={isActive ? '#22c55e' : '#000000'}
          emissiveIntensity={isActive ? 0.2 : 0}
          transparent
          opacity={0.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Vacúolo melhorado com textura de membrana
export function EnhancedVacuole({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const wobble = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      meshRef.current.scale.set(wobble, wobble * 0.95, wobble);
    }
  });

  return (
    <mesh ref={meshRef} position={[0.3, 0, 0.3]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <sphereGeometry args={[1.4, 48, 48]} />
      <meshPhysicalMaterial
        color={isActive ? '#ffffff' : '#bfdbfe'}
        emissive={isActive ? '#3b82f6' : '#000000'}
        emissiveIntensity={isActive ? 0.4 : 0}
        transparent
        opacity={0.25}
        roughness={0.05}
        transmission={0.8}
        thickness={1.5}
        clearcoat={1}
        clearcoatRoughness={0.05}
        ior={1.33}
      />
    </mesh>
  );
}

// Lisossomo melhorado
export function EnhancedLysosome({ position, isActive, onClick }: {
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={position} color="#84cc16" scale={0.2} active={isActive} />
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : '#bef264'}
          emissive={isActive ? '#84cc16' : '#000000'}
          emissiveIntensity={isActive ? 0.5 : 0.1}
          roughness={0.2}
          transparent
          opacity={0.75}
          clearcoat={0.6}
        />
      </mesh>
      {/* Enzimas internas */}
      <mesh position={position}>
        <icosahedronGeometry args={[0.1, 0]} />
        <meshPhysicalMaterial
          color={isActive ? '#fef9c3' : '#a3e635'}
          emissive={isActive ? '#a3e635' : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
          roughness={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Centríolos (exclusivo da célula animal)
export function Centrioles({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const createCentriole = (offset: [number, number, number], rotation: [number, number, number]) => (
    <group position={offset} rotation={rotation}>
      {/* Cilindro principal com 9 tríplons */}
      {[...Array(9)].map((_, i) => {
        const angle = (i / 9) * Math.PI * 2;
        const radius = 0.12;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.03, 0.25, 0.03]} />
            <meshPhysicalMaterial
              color={isActive ? '#ffffff' : '#fbbf24'}
              emissive={isActive ? '#f59e0b' : '#000000'}
              emissiveIntensity={isActive ? 0.5 : 0.15}
              roughness={0.3}
              clearcoat={0.7}
            />
          </mesh>
        );
      })}
      {/* Disco central */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.015, 8, 16]} />
        <meshPhysicalMaterial
          color={isActive ? '#ffffff' : '#f59e0b'}
          emissive={isActive ? '#f59e0b' : '#000000'}
          emissiveIntensity={isActive ? 0.4 : 0.1}
          roughness={0.3}
        />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef} position={[0.8, 0.6, 0.8]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[0, 0, 0]} color="#f59e0b" scale={0.3} active={isActive} />
      {createCentriole([0, 0, 0], [0, 0, 0])}
      {createCentriole([0.15, 0, 0], [0, 0, Math.PI / 2])}
    </group>
  );
}

// Peroxissomos (exclusivo da célula animal)
export function Peroxisomes({ positions, isActive, onClick }: {
  positions: [number, number, number][];
  isActive: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <GlowEffect position={[0, 0, 0]} color="#f97316" scale={1.8} active={isActive} />
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshPhysicalMaterial
              color={isActive ? '#ffffff' : '#fed7aa'}
              emissive={isActive ? '#f97316' : '#000000'}
              emissiveIntensity={isActive ? 0.5 : 0.1}
              roughness={0.25}
              transparent
              opacity={0.7}
              clearcoat={0.5}
            />
          </mesh>
          {/* Cristal core */}
          <mesh>
            <octahedronGeometry args={[0.06, 0]} />
            <meshPhysicalMaterial
              color={isActive ? '#fff7ed' : '#fb923c'}
              emissive={isActive ? '#fb923c' : '#000000'}
              emissiveIntensity={isActive ? 0.3 : 0}
              roughness={0.4}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
