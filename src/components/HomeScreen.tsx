import React from 'react';

interface HomeScreenProps {
  onNavigate: (screen: 'explore' | 'quiz' | 'achievements' | 'compare') => void;
}

const navCards = [
  { screen: 'explore' as const, icon: '🔍', title: 'Explorar', desc: 'Descubra as partes da célula em 2D e 3D' },
  { screen: 'compare' as const, icon: '🆚', title: 'Comparar', desc: 'Veja as diferenças entre animal e vegetal' },
  { screen: 'quiz' as const, icon: '📝', title: 'Quiz', desc: 'Teste o que você aprendeu' },
  { screen: 'achievements' as const, icon: '🏆', title: 'Conquistas', desc: 'Veja suas medalhas desbloqueadas' },
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Logo e Título */}
      <header className="text-center mb-10">
        <div className="text-6xl md:text-7xl mb-3" aria-hidden="true">🔬</div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
            Célula Mágica
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/85 max-w-lg mx-auto">
          Aprenda sobre células de um jeito divertido e mágico! ✨
        </p>
      </header>

      {/* Cards de Navegação */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mb-12" aria-label="Navegação principal">
        {navCards.map(({ screen, icon, title, desc }) => (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            className="glass-card p-6 text-center group cursor-pointer focus-visible:outline-3 focus-visible:outline-yellow-400"
            aria-label={`${title} — ${desc}`}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">{icon}</div>
            <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
            <p className="text-white/75 text-sm">{desc}</p>
          </button>
        ))}
      </nav>

      {/* Seção Pedagógica */}
      <section className="glass-card p-6 max-w-xl w-full" aria-labelledby="teaching-title">
        <h2 id="teaching-title" className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <span aria-hidden="true">👩‍🏫</span> Para quem ensina
        </h2>
        <div className="text-white/85 space-y-2 text-sm">
          <p><strong>Célula Mágica</strong> é inclusivo. Funciona para todas as crianças, incluindo com deficiência visual, auditiva, motora, dislexia, TEA ou TDAH.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 ml-2">
            <li>🔊 Leitura em voz alta</li>
            <li>🅰️ Texto grande</li>
            <li>◐ Alto contraste</li>
            <li>🔤 Fonte para dislexia</li>
            <li>🎯 Modo foco (sem distrações)</li>
            <li>🧊 Visualização 3D interativa</li>
          </ul>
          <p className="text-white/60 text-xs mt-2">Ideal para ciências no ensino fundamental.</p>
        </div>
      </section>
    </div>
  );
}
