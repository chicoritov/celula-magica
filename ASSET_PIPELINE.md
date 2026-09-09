# 🎨 Asset Pipeline - Modelos 3D para Célula Mágica

Guia completo para sourcing, otimização e integração de modelos 3D profissionais.

## 📦 Modelos GLB Recomendados (Gratuitos)

### Sketchfab (CC Attribution)

| Organela | Modelo Recomendado | Licença | Link |
|----------|-------------------|---------|------|
| **Mitocôndria** | "Mitochondria 3D" | CC BY 4.0 | sketchfab.com/3d-models/mitochondria |
| **Núcleo** | "Cell Nucleus" | CC BY 4.0 | sketchfab.com/3d-models/cell-nucleus |
| **Cloroplasto** | "Chloroplast" | CC BY 4.0 | sketchfab.com/3d-models/chloroplast |
| **Ribossomo** | "Ribosome Structure" | CC BY 4.0 | sketchfab.com/3d-models/ribosome |
| **Golgi** | "Golgi Apparatus" | CC BY 4.0 | sketchfab.com/3d-models/golgi |
| **RE** | "Endoplasmic Reticulum" | CC BY 4.0 | sketchfab.com/3d-models/er |

### Poly Pizza (CC0 - Domínio Público)

| Organela | Modelo | Licença | Link |
|----------|--------|---------|------|
| **Lisossomo** | "Lysosome" | CC0 | poly.pizza/search/lysosome |
| **Vacúolo** | "Vacuole" | CC0 | poly.pizza/search/vacuole |
| **Centríolo** | "Centriole" | CC0 | poly.pizza/search/centriole |

### Alternativas Procedurais (Sem modelos externos)

Para organelas complexas, mantemos a geração procedural atual:
- ✅ Membrana (esfera translúcida)
- ✅ Parede celular (box wireframe)
- ✅ Citoesqueleto (microtúbulos)
- ✅ Partículas do citoplasma

---

## 🛠️ Pipeline de Otimização

### 1. Download e Conversão

```bash
# Instalar gltf-transform (ferramenta de otimização)
npm install -g @gltf-transform/cli

# Converter para GLB (binário, mais compacto)
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024
```

### 2. Otimizações Recomendadas

```bash
# Compressão Draco (reduz 70-90% do tamanho)
gltf-transform draco input.glb output.glb --level 10

# Compressão de texturas (WebP)
gltf-transform webp input.glb output.glb --quality 80

# Reduzir polígonos (LOD)
gltf-transform simplify input.glb output.glb --ratio 0.5

# Instanciar geometrias repetidas
gltf-transform instance output.glb
```

### 3. Target Sizes

| Tipo de Modelo | Tamanho Máximo | Polígonos |
|----------------|----------------|-----------|
| Organela simples | 200 KB | < 5k |
| Organela complexa | 500 KB | < 20k |
| Célula completa | 2 MB | < 100k |

---

## 📥 Integração no React Three Fiber

### Componente de Loading com Suspense

```tsx
import { useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function MitochondriaModel({ position, rotation, scale }) {
  const { scene } = useGLTF('/models/mitochondria.glb');
  
  return (
    <primitive 
      object={scene.clone()} 
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

// Uso com fallback
<Suspense fallback={<SimpleMitochondria />}>
  <MitochondriaModel position={[1, 0, 0]} />
</Suspense>
```

### Sistema de LOD (Level of Detail)

```tsx
import { LOD } from '@react-three/drei';

function MitochondriaLOD({ position }) {
  return (
    <LOD>
      {/* Alta qualidade - perto */}
      <MitochondriaModelHigh position={position} />
      
      {/* Média qualidade - médio */}
      <MitochondriaModelMedium position={position} />
      
      {/* Baixa qualidade - longe */}
      <MitochondriaModelLow position={position} />
    </LOD>
  );
}
```

### Fallback SVG para Dispositivos Low-End

```tsx
function SmartOrganelle({ type, position }) {
  const isLowEnd = useDetectLowEndDevice();
  
  if (isLowEnd) {
    return <SVG fallback={<MitochondriaSVG />} />;
  }
  
  return <MitochondriaModel position={position} />;
}

function useDetectLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  useEffect(() => {
    // Detecta dispositivos móveis antigos ou com pouca GPU
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    // Heurística simples
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isOldGPU = /Intel|Mali-4|Adreno 3/i.test(renderer);
    
    setIsLowEnd(isMobile && isOldGPU);
  }, []);
  
  return isLowEnd;
}
```

---

## 🎨 Aplicação de Materiais PBR

Após carregar o modelo, aplique nossos materiais premium:

```tsx
import { MITOCHONDRIA_OUTER_MATERIAL, createPBRMaterial } from '../lib/materials';

function MitochondriaWithMaterials() {
  const { scene } = useGLTF('/models/mitochondria.glb');
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          ...createPBRMaterial(MITOCHONDRIA_OUTER_MATERIAL),
        });
      }
    });
  }, [scene]);
  
  return <primitive object={scene} />;
}
```

---

## 📊 Performance Budget

### Target Frame Rates

| Dispositivo | FPS Target | Qualidade |
|-------------|------------|-----------|
| Desktop (GPU dedicada) | 60 FPS | Ultra |
| Laptop (GPU integrada) | 45 FPS | High |
| Tablet moderno | 30 FPS | Medium |
| Mobile antigo | 24 FPS | Low |

### Otimizações Críticas

1. **Instancing**: Usar `InstancedMesh` para ribossomos (100+ cópias)
2. **Texture Atlas**: Combinar texturas pequenas em uma única
3. **Occlusion Culling**: Não renderizar organelas fora da viewport
4. **Lazy Loading**: Carregar modelos sob demanda
5. **Compression**: Draco + WebP para reduzir 80% do tamanho

---

## 🔄 Workflow de Atualização

### Quando adicionar novo modelo:

1. **Download** do Sketchfab/Poly Pizza
2. **Otimização** com gltf-transform
3. **Teste** de performance (FPS, memória)
4. **Integração** no componente React
5. **Fallback** SVG para low-end
6. **Deploy** para `/public/models/`

### Checklist de Qualidade:

- [ ] Modelo carrega em < 2 segundos
- [ ] FPS > 30 em mobile
- [ ] Texturas nítidas (sem pixelização)
- [ ] Materiais PBR aplicados corretamente
- [ ] Fallback SVG funciona
- [ ] Acessibilidade mantida (ARIA labels)

---

## 📁 Estrutura de Arquivos

```
public/
└── models/
    ├── animal/
    │   ├── mitochondria.glb
    │   ├── nucleus.glb
    │   ├── ribosome.glb
    │   └── golgi.glb
    ├── vegetal/
    │   ├── chloroplast.glb
    │   ├── vacuole.glb
    │   └── cell-wall.glb
    └── shared/
        ├── lysosome.glb
        └── peroxisome.glb

src/
├── components/
│   ├── models/
│   │   ├── MitochondriaModel.tsx
│   │   ├── NucleusModel.tsx
│   │   └── ...
│   └── fallbacks/
│       ├── MitochondriaSVG.tsx
│       └── ...
└── lib/
    ├── materials.ts
    └── lod.ts
```

---

## 🎯 Próximos Passos

### Fase 1: Modelos Básicos (1 semana)
- [ ] Download de 3 modelos principais (mitocôndria, núcleo, cloroplasto)
- [ ] Otimização com gltf-transform
- [ ] Integração básica no PremiumScene

### Fase 2: Materiais Premium (1 semana)
- [ ] Aplicar materiais PBR em todos os modelos
- [ ] Testar em diferentes dispositivos
- [ ] Ajustar roughness/metalness para look realista

### Fase 3: LOD e Fallbacks (1 semana)
- [ ] Criar versões low-poly
- [ ] Implementar sistema de LOD
- [ ] Criar fallbacks SVG

### Fase 4: Performance (contínuo)
- [ ] Profiling com React DevTools
- [ ] Otimizar draw calls
- [ ] Comprimir texturas

---

## 🔗 Recursos Úteis

- **Sketchfab**: https://sketchfab.com/search?q=cell+organelle
- **Poly Pizza**: https://poly.pizza/
- **gltf-transform**: https://gltf-transform.donmccurdy.com/
- **Three.js Examples**: https://threejs.org/examples/
- **React Three Fiber Docs**: https://docs.pmnd.rs/react-three-fiber

---

## 💡 Dicas de Qualidade

1. **Iluminação é tudo**: Mesmo modelos simples ficam incríveis com boa iluminação
2. **Materiais PBR**: Use roughness/metalness corretos para cada material biológico
3. **Escala**: Mantenha proporções realistas entre organelas
4. **Cores**: Use cores cientificamente corretas (mitocôndria = laranja, cloroplasto = verde)
5. **Translucidez**: Membranas devem ser translúcidas, não transparentes

---

**Status**: ✅ Sistema de materiais PBR implementado
**Próximo**: 🔄 Integrar modelos GLB reais
**ETA**: 2-3 semanas para pipeline completo
