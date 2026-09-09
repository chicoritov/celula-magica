# 🔬 Célula Mágica

App educacional inclusivo sobre células para crianças, com visualização 3D interativa.

## 🎯 Funcionalidades

### Telas
- **Home**: Tela inicial com navegação intuitiva
- **Explorar**: Visualização 2D e **3D interativa** das células com hotspots
- **Comparar**: Células lado a lado com câmeras sincronizadas
- **Quiz**: 34 perguntas com 3 níveis de dificuldade (fácil/médio/difícil)
- **Conquistas**: Sistema de medalhas desbloqueáveis

### Comparador Lado a Lado (NOVO!)
- 🔄 **Câmeras sincronizadas**: Gire uma célula e a outra acompanha automaticamente
- 🔬 **Raio-X animado**: Corte suave com easing (800ms de transição)
- 📊 **Tabela comparativa**: Diferenças entre célula animal e vegetal
- 👆 **Seleção compartilhada**: Clique em uma organela e veja em ambas as células

### Mini-Animações Educativas por Organela
Cada organela tem uma animação única que explica sua função:
- ⚡ **Mitocôndria**: Libera partículas de ATP (energia) pulsando
- 🧠 **Núcleo**: DNA dupla hélice desenrolando com glow
- 🌿 **Cloroplasto**: Fótons (luz) entrando + bolhas de O₂ saindo
- 🔧 **Ribossomos**: Aminoácidos coloridos se montando em proteína
- 🗑️ **Lisossomo**: Partículas sendo digeridas em espiral
- 📦 **Golgi**: Vesículas sendo empacotadas e enviadas
- 🛤️ **Retículo Endoplasmático**: Proteínas viajando pelos túbulos
- 🛡️ **Membrana**: Transporte seletivo entrando/saindo

### Visualização 3D Premium (Estilo National Geographic)
- 🧊 **Modelos 3D completos** de células animal e vegetal
- 🖱️ **Rotação livre** com arrastar do mouse + damping suave
- 🔍 **Zoom** com scroll do mouse (4x a 12x)
- 👆 **Clique nas organelas** para ver detalhes e animações
- 🎨 **Materiais PBR fotorrealistas** com subsurface scattering
- 🔄 **Auto-rotação** suave quando idle
- 💡 **Iluminação cinematográfica** de 3 pontos (key, fill, rim)
- 🌟 **Bloom effect** em organelas luminosas (núcleo, mitocôndria)
- 🌫️ **Vignette** para foco visual central
- 🌍 **HDRI Environment** para reflexos realistas
- 🏷️ **Labels elegantes** com linhas pointer estilo textbook
- 🪟 **Frosted glass** nos labels (backdrop-filter blur)

### Áudio
- 🎵 **Música ambiente procedural**: Gerada em tempo real com Web Audio API
- 🎼 **Escala pentatônica**: Melodia relaxante que nunca soa dissonante
- 🔊 **Controle de volume**: Slider para ajustar o volume
- ⏸️ **Pausa/Play**: Botão flutuante no canto inferior direito
- 💾 **Persistência**: Lembra a preferência do usuário
- 🎯 **Modo foco**: Pausa automaticamente para evitar sobrecarga sensorial

### Acessibilidade (WCAG 2.2)
- 🔊 **Voz**: Leitura em voz alta com SpeechSynthesis pt-BR
- 🅰️ **Texto grande**: Aumento progressivo do tamanho do texto
- ◐ **Alto contraste**: Modo preto + dourado para baixa visão
- 🔤 **Fonte dislexia**: OpenDyslexic para disléxicos
- 🎯 **Modo foco**: Remove animações e música (anti-sobrecarga sensorial para TEA)

### Design
- Glassmorphism moderno com backdrop-filter blur
- Gradiente animado roxo → azul → verde
- Bokeh decorativo flutuante
- Paleta segura para daltônicos
- Respeita `prefers-reduced-motion`
- Alvos de toque ≥ 44px
- Navegação 100% por teclado

## 🚀 Execução

```bash
npm install
npm run dev      # Desenvolvimento
npm run build    # Build para produção
```

## 📁 Estrutura Otimizada

```
src/
├── App.tsx                          # Componente principal otimizado
├── context/
│   └── AccessibilityContext.tsx     # Estado global com useMemo
├── components/
│   ├── AccessibilityBar.tsx         # Barra de acessibilidade
│   ├── HomeScreen.tsx               # Tela inicial
│   ├── ExploreScreen.tsx            # Exploração 2D/3D com lazy loading
│   ├── CellScene3D.tsx              # Modelo 3D completo (lazy loaded)
│   ├── QuizScreen.tsx               # Quiz gamificado
│   ├── AchievementsScreen.tsx       # Conquistas
│   ├── AnimalCellSVG.tsx            # SVG interativo 2D
│   └── VegetalCellSVG.tsx           # SVG interativo 2D
└── data/
    └── cells.ts                     # Dados centralizados
```

### Performance
- **Code splitting**: Three.js carrega apenas quando necessário (lazy loading)
- **Bundle principal**: ~56KB gzip
- **3D module**: ~244KB gzip (carregado sob demanda)
- **CSS otimizado**: ~6KB gzip

## 🧊 Componentes 3D Melhorados

Modelo 3D com organelas ultra-realistas e efeitos visuais:

### Organelas Detalhadas
- **Membrana celular**: Material glass-like com transmission, clearcoat e respiração suave
- **Núcleo**: Poros nucleares, cromatina em torus knot, nucléolo com clearcoat
- **Mitocôndrias**: Cristas internas detalhadas, membrana dupla, respiração orgânica
- **Retículo endoplasmático**: Tubos curvos com ribossomos aderidos (RE rugoso)
- **Complexo de Golgi**: Discos empilhados com vesículas brotando
- **Ribossomos**: InstancedMesh para performance, distribuídos pelo citoplasma
- **Lisossomos**: Enzimas internas em icosaedro, pulsação individual
- **Cloroplastos** (vegetal): Granum com tilacoides empilhados, estroma
- **Vacúolo** (vegetal): IOR 1.33 (água real), wobble orgânico
- **Parede celular** (vegetal): Wireframe com rotação suave

### Efeitos Visuais
- ✨ **Glow effect**: Brilho ao redor das organelas ativas
- 💫 **Partículas do citoplasma**: 150 partículas com movimento browniano
- 🌈 **Iluminação multi-color**: 5 luzes coloridas (âmbar, violeta, azul, rosa)
- 🌍 **Environment map**: Reflexos realistas com preset "city"
- 🎭 **Materiais físicos**: Transmission, clearcoat, IOR, roughness
- 🫧 **Animações orgânicas**: Respiração, pulsação, rotação individual

### Interatividade
- 🖱️ **Hover**: Cursor muda, organela destaca
- 👆 **Click**: Seleciona e mostra informações
- 🔄 **Auto-rotação**: Suave com damping
- 🔍 **Zoom**: Scroll do mouse (4x a 12x de distância)

## ♿ Acessibilidade

- HTML semântico com ARIA completo
- Navegação por teclado (Tab, Enter, ESC)
- Foco visível (outline amarelo)
- Focus trap em modais
- Feedback multimodal (visual + sonoro + háptico)
- Linguagem simples e analogias cotidianas

## 🔧 Manutenção

### Adicionar perguntas
Edite `src/data/cells.ts` → `quizQuestions`

### Adicionar partes às células
Edite `src/data/cells.ts` → `animalCell.parts` ou `vegetalCell.parts`

### Modificar modelo 3D
Edite `src/components/CellScene3D.tsx`

## 📄 Licença

Projeto educacional de código aberto.
