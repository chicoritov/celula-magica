import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { achievements } from '../data/cells';

interface Props { onBack: () => void; }

export function AchievementsScreen({ onBack }: Props) {
  const { unlockedAchievements, speak } = useAccessibility();
  const count = unlockedAchievements.length;
  const total = achievements.length;

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="flex items-center justify-between mb-4 max-w-4xl mx-auto">
        <button onClick={onBack} className="glass-card px-4 py-2 text-white font-semibold hover:bg-white/20 min-h-[44px] text-sm" aria-label="Voltar">← Voltar</button>
        <h1 className="text-xl font-bold text-white">🏆 Conquistas</h1>
        <div className="glass-card px-3 py-1.5 text-white text-sm font-semibold">{count}/{total}</div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progresso */}
        <div className="glass-card p-4 mb-6 text-center">
          <p className="text-white/70 text-sm mb-1">Suas conquistas</p>
          <p className="text-3xl font-bold text-yellow-300 mb-2">{count} / {total}</p>
          <div className="progress-bar max-w-xs mx-auto">
            <div className="progress-fill" style={{ width: `${(count / total) * 100}%` }} role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={total} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((a) => {
            const unlocked = unlockedAchievements.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => unlocked && speak(`${a.name}. ${a.description}`)}
                className={`glass-card p-4 text-center medal min-h-[44px] ${unlocked ? '' : 'medal-locked'}`}
                aria-label={`${a.name}: ${unlocked ? a.description : 'Bloqueada. ' + a.condition}`}
                title={unlocked ? a.description : a.condition}
              >
                <div className="text-3xl mb-2" aria-hidden="true">{unlocked ? a.icon : '🔒'}</div>
                <h3 className="text-sm font-bold text-white mb-0.5">{a.name}</h3>
                <p className={`text-xs ${unlocked ? 'text-white/70' : 'text-white/40'}`}>
                  {unlocked ? a.description : a.condition}
                </p>
                {unlocked && <span className="inline-block mt-1.5 text-[10px] bg-green-500/30 text-green-300 px-1.5 py-0.5 rounded-full">✅</span>}
              </button>
            );
          })}
        </div>

        <div className="glass-card p-4 mt-6 text-center">
          <p className="text-white/70 text-sm">💡 Explore as células, faça o quiz e use os recursos de acessibilidade!</p>
        </div>
      </div>
    </div>
  );
}
