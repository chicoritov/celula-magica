import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrganelleAnimationProps {
  organelleId: number;
  active: boolean;
  position?: [number, number, number];
}

/**
 * Sistema de micro-animações educativas por organela.
 * Cada organela tem uma animação única que explica sua função.
 */

// ====== 1. MITOCÔNDRIA: Pulsa e libera partículas de ATP ======
export function MitochondriaAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const count = 20;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [particles, setParticles] = useState(() => 
    Array.from({ length: count }, () => ({
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      life: Math.random(),
      scale: 0.03 + Math.random() * 0.02,
    }))
  );

  useFrame((state, delta) => {
    if (!particlesRef.current || !active) return;
    const time = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      p.life += delta * 0.5;
      if (p.life > 1) {
        p.life = 0;
        p.position.set(0, 0, 0);
        p.velocity.set(
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03
        );
      }
      p.position.add(p.velocity);

      const fadeOut = 1 - p.life;
      dummy.position.set(
        position[0] + p.position.x,
        position[1] + p.position.y,
        position[2] + p.position.z
      );
      dummy.scale.setScalar(p.scale * fadeOut);
      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });

    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
    </instancedMesh>
  );
}

// ====== 2. NÚCLEO: DNA desenrolando com glow ======
export function NucleusAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const helixRef = useRef<THREE.Group>(null);
  
  // Cria pontos da dupla hélice
  const helixPoints = useMemo(() => {
    const points: { pos1: THREE.Vector3; pos2: THREE.Vector3; connector: boolean }[] = [];
    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const angle = t * Math.PI * 4;
      const radius = 0.3;
      const y = (t - 0.5) * 1.5;
      
      points.push({
        pos1: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
        pos2: new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius),
        connector: i % 3 === 0,
      });
    }
    return points;
  }, []);

  useFrame((state) => {
    if (!helixRef.current || !active) return;
    const time = state.clock.elapsedTime;
    helixRef.current.rotation.y = time * 0.5;
    
    // Efeito de "desenrolar" - escala oscila
    const unwind = 1 + Math.sin(time * 2) * 0.1;
    helixRef.current.scale.setScalar(unwind);
  });

  if (!active) return null;

  return (
    <group ref={helixRef} position={position}>
      {helixPoints.map((point, i) => (
        <React.Fragment key={i}>
          {/* Fita 1 */}
          <mesh position={point.pos1}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.9} />
          </mesh>
          {/* Fita 2 */}
          <mesh position={point.pos2}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ec4899" transparent opacity={0.9} />
          </mesh>
          {/* Conectores (bases nitrogenadas) */}
          {point.connector && (
            <mesh position={point.pos1.clone().lerp(point.pos2, 0.5)}>
              <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
            </mesh>
          )}
        </React.Fragment>
      ))}
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ====== 3. CLOROPLASTO: Fótons entrando + bolhas de O2 saindo ======
export function ChloroplastAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const photonsRef = useRef<THREE.InstancedMesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const count = 15;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const [photons, setPhotons] = useState(() =>
    Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        2 + Math.random() * 2,
        (Math.random() - 0.5) * 3
      ),
      speed: 0.02 + Math.random() * 0.02,
    }))
  );

  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        0,
        (Math.random() - 0.5) * 0.5
      ),
      speed: 0.01 + Math.random() * 0.01,
      life: Math.random(),
    }))
  );

  useFrame((state, delta) => {
    if (!photonsRef.current || !bubblesRef.current || !active) return;

    // Fótons descendo (luz solar)
    photons.forEach((p, i) => {
      p.position.y -= p.speed;
      if (p.position.y < -0.5) {
        p.position.set(
          (Math.random() - 0.5) * 3,
          2 + Math.random() * 2,
          (Math.random() - 0.5) * 3
        );
      }
      dummy.position.set(
        position[0] + p.position.x,
        position[1] + p.position.y,
        position[2] + p.position.z
      );
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      photonsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    photonsRef.current.instanceMatrix.needsUpdate = true;

    // Bolhas de O2 subindo
    bubbles.forEach((b, i) => {
      b.life += delta * 0.3;
      if (b.life > 1) {
        b.life = 0;
        b.position.set(
          (Math.random() - 0.5) * 0.3,
          0,
          (Math.random() - 0.5) * 0.3
        );
      }
      b.position.y += b.speed;
      
      dummy.position.set(
        position[0] + b.position.x,
        position[1] + b.position.y,
        position[2] + b.position.z
      );
      const fadeOut = 1 - b.life;
      dummy.scale.setScalar(0.05 * fadeOut);
      dummy.updateMatrix();
      bubblesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    bubblesRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <group>
      {/* Fótons (luz solar amarela) */}
      <instancedMesh ref={photonsRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#fde047" transparent opacity={0.9} />
      </instancedMesh>
      {/* Bolhas de O2 (azul claro) */}
      <instancedMesh ref={bubblesRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.7} />
      </instancedMesh>
    </group>
  );
}

// ====== 4. RIBOSSOMOS: Montando proteínas (partículas se juntando) ======
export function RibosomeAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 8;
  
  const aminoAcids = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      startPos: new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ),
      endPos: new THREE.Vector3(0, (i - count / 2) * 0.1, 0),
      color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][i % 4],
    }))
  , []);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    const time = state.clock.elapsedTime;
    const cycle = (time % 4) / 4; // 0 a 1 em 4 segundos

    groupRef.current.children.forEach((child, i) => {
      if (i < count) {
        const aa = aminoAcids[i];
        const progress = Math.min(1, cycle * 2 + i * 0.1);
        child.position.lerpVectors(aa.startPos, aa.endPos, progress);
        
        // Pulsa quando chega
        const scale = progress > 0.9 ? 1 + Math.sin(time * 10) * 0.1 : 1;
        child.scale.setScalar(scale * 0.08);
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={position}>
      {aminoAcids.map((aa, i) => (
        <mesh key={i} position={aa.startPos}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={aa.color} transparent opacity={0.9} />
        </mesh>
      ))}
      {/* Ribossomo central */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial color="#10b981" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ====== 5. LISSOSSOMO: Digerindo partículas ======
export function LysosomeAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const particlesRef = useRef<THREE.Group>(null);
  const count = 10;
  
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0.5 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.5,
      size: 0.03 + Math.random() * 0.02,
    }))
  , []);

  useFrame((state) => {
    if (!particlesRef.current || !active) return;
    const time = state.clock.elapsedTime;

    particlesRef.current.children.forEach((child, i) => {
      if (i < count) {
        const p = particles[i];
        // Espiral para dentro (digestão)
        const radius = p.radius * (1 - (time * p.speed * 0.1) % 1);
        child.position.set(
          position[0] + Math.cos(p.angle + time * p.speed) * radius,
          position[1] + Math.sin(time * 2 + i) * 0.1,
          position[2] + Math.sin(p.angle + time * p.speed) * radius
        );
        child.scale.setScalar(p.size * radius * 2);
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={particlesRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#84cc16" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ====== 6. GOLGI: Empacotando vesículas ======
export function GolgiAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const vesiclesRef = useRef<THREE.Group>(null);
  const count = 6;
  
  useFrame((state) => {
    if (!vesiclesRef.current || !active) return;
    const time = state.clock.elapsedTime;

    vesiclesRef.current.children.forEach((child, i) => {
      if (i < count) {
        // Vesículas brotando de um lado e saindo do outro
        const cycle = ((time * 0.5 + i * 0.3) % 2) / 2;
        const side = i < count / 2 ? -1 : 1;
        
        if (cycle < 0.5) {
          // Entrando
          child.position.set(
            position[0] + side * (0.5 - cycle),
            position[1] + (i - count / 2) * 0.1,
            position[2]
          );
          child.scale.setScalar(cycle * 2 * 0.06);
        } else {
          // Saindo
          child.position.set(
            position[0] - side * (cycle - 0.5),
            position[1] + (i - count / 2) * 0.1,
            position[2]
          );
          child.scale.setScalar((1 - cycle) * 2 * 0.06);
        }
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={vesiclesRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshPhysicalMaterial color="#ec4899" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ====== 7. RETÍCULO: Transportando proteínas ======
export function ERAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const proteinsRef = useRef<THREE.Group>(null);
  const count = 8;
  
  useFrame((state) => {
    if (!proteinsRef.current || !active) return;
    const time = state.clock.elapsedTime;

    proteinsRef.current.children.forEach((child, i) => {
      if (i < count) {
        // Proteínas viajando pelos túbulos
        const t = ((time * 0.3 + i * 0.2) % 1);
        const angle = t * Math.PI * 2;
        const radius = 1 + Math.sin(t * Math.PI * 4) * 0.3;
        
        child.position.set(
          position[0] + Math.cos(angle) * radius - 0.5,
          position[1] + Math.sin(t * Math.PI * 2) * 0.5,
          position[2] + Math.sin(angle) * radius - 0.5
        );
        child.scale.setScalar(0.05);
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={proteinsRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ====== 8. MEMBRANA: Transporte seletivo ======
export function MembraneAnimation({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  const particlesRef = useRef<THREE.Group>(null);
  const count = 12;
  
  useFrame((state) => {
    if (!particlesRef.current || !active) return;
    const time = state.clock.elapsedTime;

    particlesRef.current.children.forEach((child, i) => {
      if (i < count) {
        const entering = i < count / 2;
        const t = ((time * 0.4 + i * 0.15) % 1);
        const direction = entering ? 1 : -1;
        const radius = 2.8;
        
        // Partículas atravessando a membrana
        const r = radius + direction * (t - 0.5) * 0.5;
        const angle = (i / count) * Math.PI * 2;
        
        child.position.set(
          position[0] + Math.cos(angle) * r,
          position[1] + Math.sin(time + i) * 0.3,
          position[2] + Math.sin(angle) * r
        );
        
        // Fade quando atravessa
        const opacity = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
        (child as any).material.opacity = opacity * 0.8;
        child.scale.setScalar(0.04);
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={particlesRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color={i < count / 2 ? "#10b981" : "#ef4444"} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      ))}
    </group>
  );
}

// ====== Componente principal que escolhe a animação ======
export function OrganelleAnimation({ organelleId, active, position = [0, 0, 0] }: OrganelleAnimationProps) {
  switch (organelleId) {
    case 1: // Membrana
      return <MembraneAnimation active={active} position={position} />;
    case 2: // Núcleo
      return <NucleusAnimation active={active} position={position} />;
    case 3: // Mitocôndria
      return <MitochondriaAnimation active={active} position={position} />;
    case 5: // Ribossomos
      return <RibosomeAnimation active={active} position={position} />;
    case 6: // Retículo
      return <ERAnimation active={active} position={position} />;
    case 7: // Golgi
      return <GolgiAnimation active={active} position={position} />;
    case 8: // Lisossomo
      return <LysosomeAnimation active={active} position={position} />;
    default:
      return null;
  }
}

// Animação específica para cloroplasto (ID 3 na célula vegetal)
export function ChloroplastAnimationWrapper({ active, position = [0, 0, 0] }: { active: boolean; position?: [number, number, number] }) {
  return <ChloroplastAnimation active={active} position={position} />;
}
