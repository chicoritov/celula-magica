# 🔬 Célula Mágica

App educacional inclusivo sobre células para crianças, com visualização 3D interativa.

## 🎯 Funcionalidades

### Telas
- **Home**: Tela inicial com navegação intuitiva
- **Explorar**: Visualização 2D e **3D interativa** das células com hotspots
- **Quiz**: 8 perguntas embaralhadas com feedback imediato e gamificação
- **Conquistas**: Sistema de medalhas desbloqueáveis

### Visualização 3D
- 🧊 **Modelos 3D completos** de células animal e vegetal
- 🖱️ **Rotação livre** com arrastar do mouse
- 🔍 **Zoom** com scroll do mouse
- 👆 **Clique nas organelas** para ver detalhes
- 🎨 **Materiais realistas** com transparência e reflexos
- 🔄 **Auto-rotação** suave
- 💡 **Iluminação dinâmica** com sombras

### Acessibilidade (WCAG 2.2)
- 🔊 **Voz**: Leitura em voz alta com SpeechSynthesis pt-BR
- 🅰️ **Texto grande**: Aumento progressivo do tamanho do texto
- ◐ **Alto contraste**: Modo preto + dourado para baixa visão
- 🔤 **Fonte dislexia**: OpenDyslexic para disléxicos
- 🎯 **Modo foco**: Remove animações (anti-sobrecarga sensorial para TEA)

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

## 🧊 Componentes 3D

O modelo 3D inclui organelas realistas:
- **Membrana celular**: Esfera transparente com material glass-like
- **Núcleo**: Esfera com nucléolo interno
- **Mitocôndrias**: Cápsulas com cristas internas
- **Retículo endoplasmático**: Tubos curvos
- **Complexo de Golgi**: Discos empilhados
- **Ribossomos**: Esferas pequenas distribuídas
- **Lisossomos**: Esferas translúcidas
- **Cloroplastos** (vegetal): Cápsulas verdes com tilacoides
- **Vacúolo** (vegetal): Esfera grande transparente
- **Parede celular** (vegetal): Caixa wireframe externa

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
