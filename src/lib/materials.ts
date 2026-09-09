import * as THREE from 'three';

/**
 * Sistema de Materiais PBR Premium para Célula Mágica
 * Estilo: National Geographic / Khan Academy
 * 
 * Cada material usa Physically Based Rendering com:
 * - Subsurface scattering simulado via transmission
 * - Roughness/metalness calibrados para look orgânico
 * - Clearcoat para brilho úmido (células vivas)
 * - Emission para glow em organelas ativas
 */

export interface MaterialConfig {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness: number;
  metalness: number;
  transmission?: number;
  thickness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  opacity?: number;
  transparent?: boolean;
  ior?: number;
  sheen?: number;
  sheenColor?: string;
  side?: THREE.Side;
}

// ====== MEMBRANA CELULAR ======
// Bicamada lipídica translúcida com brilho úmido
export const MEMBRANE_MATERIAL: MaterialConfig = {
  color: '#fde68a',
  roughness: 0.05,
  metalness: 0,
  transmission: 0.95,
  thickness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  opacity: 0.15,
  transparent: true,
  ior: 1.4, // Índice de refração de lipídios
  side: THREE.DoubleSide,
};

// ====== PAREDE CELULAR (Vegetal) ======
// Celulose rígida com padrão hexagonal
export const CELL_WALL_MATERIAL: MaterialConfig = {
  color: '#65a30d',
  roughness: 0.7,
  metalness: 0,
  opacity: 0.2,
  transparent: true,
  clearcoat: 0.3,
  clearcoatRoughness: 0.6,
  side: THREE.DoubleSide,
};

// ====== NÚCLEO ======
// Profundo roxo com glow interno (DNA)
export const NUCLEUS_MATERIAL: MaterialConfig = {
  color: '#c4b5fd',
  emissive: '#4c1d95',
  emissiveIntensity: 0.15,
  roughness: 0.1,
  metalness: 0,
  transmission: 0.6,
  thickness: 0.8,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  opacity: 0.5,
  transparent: true,
  ior: 1.35,
};

export const NUCLEOLUS_MATERIAL: MaterialConfig = {
  color: '#6d28d9',
  emissive: '#7c3aed',
  emissiveIntensity: 0.2,
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 0.8,
  clearcoatRoughness: 0.1,
};

export const DNA_MATERIAL: MaterialConfig = {
  color: '#a78bfa',
  emissive: '#8b5cf6',
  emissiveIntensity: 0.6,
  roughness: 0.3,
  metalness: 0.2,
};

// ====== MITOCÔNDRIA ======
// Laranja quente com cristas visíveis
export const MITOCHONDRIA_OUTER_MATERIAL: MaterialConfig = {
  color: '#fca5a5',
  emissive: '#dc2626',
  emissiveIntensity: 0.1,
  roughness: 0.2,
  metalness: 0,
  transmission: 0.3,
  thickness: 0.4,
  clearcoat: 0.6,
  clearcoatRoughness: 0.1,
  opacity: 0.75,
  transparent: true,
};

export const MITOCHONDRIA_CRISTAE_MATERIAL: MaterialConfig = {
  color: '#dc2626',
  emissive: '#ef4444',
  emissiveIntensity: 0.3,
  roughness: 0.4,
  metalness: 0.1,
};

export const MITOCHONDRIA_MATRIX_MATERIAL: MaterialConfig = {
  color: '#fecaca',
  emissive: '#f87171',
  emissiveIntensity: 0.15,
  roughness: 0.3,
  metalness: 0,
  transmission: 0.4,
  thickness: 0.3,
  opacity: 0.6,
  transparent: true,
};

// ====== CLOROPLASTO (Vegetal) ======
// Verde vibrante com tilacoides internos
export const CHLOROPLAST_OUTER_MATERIAL: MaterialConfig = {
  color: '#86efac',
  emissive: '#16a34a',
  emissiveIntensity: 0.1,
  roughness: 0.2,
  metalness: 0,
  transmission: 0.4,
  thickness: 0.5,
  clearcoat: 0.7,
  clearcoatRoughness: 0.1,
  opacity: 0.7,
  transparent: true,
};

export const THYLAKOID_MATERIAL: MaterialConfig = {
  color: '#16a34a',
  emissive: '#22c55e',
  emissiveIntensity: 0.4,
  roughness: 0.3,
  metalness: 0.1,
};

export const STROMA_MATERIAL: MaterialConfig = {
  color: '#bbf7d0',
  emissive: '#4ade80',
  emissiveIntensity: 0.1,
  roughness: 0.3,
  metalness: 0,
  transmission: 0.5,
  thickness: 0.3,
  opacity: 0.4,
  transparent: true,
};

// ====== VACÚOLO (Vegetal) ======
// Azul claro com refração de líquido
export const VACUOLE_MATERIAL: MaterialConfig = {
  color: '#bfdbfe',
  emissive: '#3b82f6',
  emissiveIntensity: 0.05,
  roughness: 0.05,
  metalness: 0,
  transmission: 0.85,
  thickness: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  opacity: 0.3,
  transparent: true,
  ior: 1.33, // Água
};

// ====== RETÍCULO ENDOPLASMÁTICO ======
// Tubos laranja translúcidos
export const ER_MATERIAL: MaterialConfig = {
  color: '#fdba74',
  emissive: '#f97316',
  emissiveIntensity: 0.1,
  roughness: 0.3,
  metalness: 0,
  opacity: 0.8,
  transparent: true,
  clearcoat: 0.4,
  clearcoatRoughness: 0.2,
};

// ====== COMPLEXO DE GOLGI ======
// Discos rosa empilhados com brilho
export const GOLGI_MATERIAL: MaterialConfig = {
  color: '#f9a8d4',
  emissive: '#ec4899',
  emissiveIntensity: 0.15,
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 0.9,
  clearcoatRoughness: 0.05,
};

export const VESICLE_MATERIAL: MaterialConfig = {
  color: '#f472b6',
  emissive: '#ec4899',
  emissiveIntensity: 0.2,
  roughness: 0.2,
  metalness: 0,
  transmission: 0.3,
  thickness: 0.2,
  opacity: 0.7,
  transparent: true,
};

// ====== RIBOSSOMOS ======
// Pequenas esferas verdes brilhantes
export const RIBOSOME_MATERIAL: MaterialConfig = {
  color: '#6ee7b7',
  emissive: '#10b981',
  emissiveIntensity: 0.2,
  roughness: 0.3,
  metalness: 0.2,
  clearcoat: 0.6,
};

// ====== LISSOSSOMO ======
// Verde amarelado translúcido
export const LYSOSOME_MATERIAL: MaterialConfig = {
  color: '#bef264',
  emissive: '#84cc16',
  emissiveIntensity: 0.15,
  roughness: 0.25,
  metalness: 0,
  transmission: 0.3,
  thickness: 0.3,
  clearcoat: 0.6,
  opacity: 0.75,
  transparent: true,
};

// ====== CENTRÍOLOS (Animal) ======
// Estrutura cilíndrica dourada
export const CENTRIOLE_MATERIAL: MaterialConfig = {
  color: '#fcd34d',
  emissive: '#f59e0b',
  emissiveIntensity: 0.2,
  roughness: 0.3,
  metalness: 0.3,
  clearcoat: 0.7,
};

// ====== PEROXISSOMOS (Animal) ======
// Vesículas laranja com cristal core
export const PEROXISOME_MATERIAL: MaterialConfig = {
  color: '#fed7aa',
  emissive: '#f97316',
  emissiveIntensity: 0.1,
  roughness: 0.25,
  metalness: 0,
  transmission: 0.3,
  thickness: 0.2,
  opacity: 0.7,
  transparent: true,
  clearcoat: 0.5,
};

// ====== CITOESQUELETO ======
// Microtúbulos violeta sutis
export const CYTOSKELETON_MATERIAL: MaterialConfig = {
  color: '#a78bfa',
  roughness: 0.4,
  metalness: 0.1,
  opacity: 0.2,
  transparent: true,
};

// ====== FUNÇÃO HELPER PARA CRIAR MATERIAIS ======
export function createPBRMaterial(config: MaterialConfig): JSX.IntrinsicElements['meshPhysicalMaterial'] {
  return {
    color: config.color,
    emissive: config.emissive || '#000000',
    emissiveIntensity: config.emissiveIntensity || 0,
    roughness: config.roughness,
    metalness: config.metalness,
    transmission: config.transmission || 0,
    thickness: config.thickness || 0,
    clearcoat: config.clearcoat || 0,
    clearcoatRoughness: config.clearcoatRoughness || 0,
    opacity: config.opacity || 1,
    transparent: config.transparent || false,
    ior: config.ior || 1.5,
    side: config.side || THREE.FrontSide,
  };
}

// ====== CONFIGURAÇÃO DE ILUMINAÇÃO CINEMATOGRÁFICA ======
export const LIGHTING_CONFIG = {
  // Key light (principal) - luz forte de cima-direita
  key: {
    position: [5, 8, 5] as [number, number, number],
    intensity: 1.5,
    color: '#ffffff',
    castShadow: true,
  },
  // Fill light (preenchimento) - luz suave de esquerda
  fill: {
    position: [-5, 2, 3] as [number, number, number],
    intensity: 0.4,
    color: '#a78bfa', // Violeta suave
  },
  // Rim light (contorno) - luz de trás para destacar bordas
  rim: {
    position: [0, -3, -5] as [number, number, number],
    intensity: 0.6,
    color: '#67e8f9', // Ciano
  },
  // Ambient - luz ambiente muito suave
  ambient: {
    intensity: 0.3,
    color: '#fef3c7', // Âmbar quente
  },
  // Accent lights para organelas específicas
  accents: [
    { position: [3, 2, 3] as [number, number, number], intensity: 0.4, color: '#8b5cf6', distance: 10 }, // Núcleo
    { position: [-3, -2, 3] as [number, number, number], intensity: 0.3, color: '#06b6d4', distance: 8 }, // Citoplasma
    { position: [0, 3, -3] as [number, number, number], intensity: 0.3, color: '#ec4899', distance: 8 }, // Golgi
  ],
};

// ====== CONFIGURAÇÃO DE POST-PROCESSING ======
export const POSTPROCESSING_CONFIG = {
  bloom: {
    luminanceThreshold: 0.8,
    luminanceSmoothing: 0.9,
    intensity: 0.5,
  },
  ssao: {
    radius: 0.5,
    intensity: 30,
    luminanceInfluence: 0.5,
  },
  vignette: {
    offset: 0.3,
    darkness: 0.6,
  },
};
