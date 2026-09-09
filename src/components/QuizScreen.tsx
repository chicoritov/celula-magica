import React, { useState, useEffect, useCallback } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { quizQuestions, QuizQuestion, Difficulty } from '../data/cells';

interface QuizScreenProps {
  onBack: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

const TOTAL = 8;

type QuizState = 'menu' | 'playing' | 'done';

export function QuizScreen({ onBack }: QuizScreenProps) {
  const [quizState, setQuizState] = useState<QuizState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty | 'todas'>('todas');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState(false);
  const { speak, playFeedbackSound, unlockAchievement } = useAccessibility();

  const q = questions[idx];

  const handleAnswer = useCallback((i: number) => {
    if (feedback) return;
    setAnswer(i);
    setFeedback(true);
    const correct = i === q.correct;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const ns = s + 1;
        if (ns >= 5) unlockAchievement('quiz_streak');
        return ns;
      });
      setMaxStreak(s => Math.max(s, streak + 1));
      playFeedbackSound('correct');
      speak('Muito bem! Resposta correta!');
    } else {
      setStreak(0);
      playFeedbackSound('incorrect');
      speak('Não foi dessa vez. Vamos aprender!');
    }
  }, [feedback, q, streak, playFeedbackSound, speak, unlockAchievement]);

  const handleNext = useCallback(() => {
    if (idx + 1 >= TOTAL) {
      setQuizState('done');
      unlockAchievement('quiz_first');
      if (score === TOTAL) unlockAchievement('quiz_perfect');
    } else {
      setIdx(i => i + 1);
      setAnswer(null);
      setFeedback(false);
    }
  }, [idx, score, unlockAchievement]);

  const startQuiz = (diff: Difficulty | 'todas') => {
    setDifficulty(diff);
    const filtered = diff === 'todas' 
      ? quizQuestions 
      : quizQuestions.filter(q => q.difficulty === diff);
    setQuestions(shuffleArray(filtered).slice(0, TOTAL));
    setIdx(0);
    setAnswer(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFeedback(false);
    setQuizState('playing');
  };

  const restart = () => {
    startQuiz(difficulty);
  };

  // Menu de seleção de dificuldade
  if (quizState === 'menu') {
    const countByDiff = {
      todas: quizQuestions.length,
      facil: quizQuestions.filter(q => q.difficulty === 'facil').length,
      medio: quizQuestions.filter(q => q.difficulty === 'medio').length,
      dificil: quizQuestions.filter(q => q.difficulty === 'dificil').length,
    };

    return (
      <div className="min-h-screen px-4 py-20">
        <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
          <button onClick={onBack} className="glass-card px-4 py-2 text-white font-semibold hover:bg-white/20 min-h-[44px] text-sm" aria-label="Voltar">← Voltar</button>
          <h1 className="text-xl font-bold text-white">📝 Quiz</h1>
          <div className="w-20" />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 text-center mb-6">
            <div className="text-5xl mb-3" aria-hidden="true">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-2">Escolha a dificuldade</h2>
            <p className="text-white/70">Selecione o nível de desafio para o quiz</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => startQuiz('todas')}
              className="glass-card p-5 text-left hover:bg-white/20 transition-all min-h-[44px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl" aria-hidden="true">🌈</span>
                <span className="text-white/60 text-sm">{countByDiff.todas} perguntas</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Todas</h3>
              <p className="text-white/70 text-sm">Mistura de fácil, médio e difícil</p>
            </button>

            <button
              onClick={() => startQuiz('facil')}
              className="glass-card p-5 text-left hover:bg-white/20 transition-all min-h-[44px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl" aria-hidden="true">🌱</span>
                <span className="text-white/60 text-sm">{countByDiff.facil} perguntas</span>
              </div>
              <h3 className="text-lg font-bold text-green-300 mb-1">Fácil</h3>
              <p className="text-white/70 text-sm">Para começar a aprender</p>
            </button>

            <button
              onClick={() => startQuiz('medio')}
              className="glass-card p-5 text-left hover:bg-white/20 transition-all min-h-[44px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl" aria-hidden="true">🌿</span>
                <span className="text-white/60 text-sm">{countByDiff.medio} perguntas</span>
              </div>
              <h3 className="text-lg font-bold text-yellow-300 mb-1">Médio</h3>
              <p className="text-white/70 text-sm">Para quem já sabe o básico</p>
            </button>

            <button
              onClick={() => startQuiz('dificil')}
              className="glass-card p-5 text-left hover:bg-white/20 transition-all min-h-[44px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl" aria-hidden="true">🌳</span>
                <span className="text-white/60 text-sm">{countByDiff.dificil} perguntas</span>
              </div>
              <h3 className="text-lg font-bold text-red-300 mb-1">Difícil</h3>
              <p className="text-white/70 text-sm">Para cientistas de verdade!</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela final
  if (quizState === 'done') {
    const pct = Math.round((score / TOTAL) * 100);
    const { emoji, msg } = pct === 100 ? { emoji: '🏆', msg: 'Perfeito! Você é um gênio!' }
      : pct >= 75 ? { emoji: '🌟', msg: 'Muito bem! Quase perfeito!' }
      : pct >= 50 ? { emoji: '👍', msg: 'Bom trabalho! Continue!' }
      : { emoji: '💪', msg: 'Não desista! Tente de novo!' };

    return (
      <div className="min-h-screen px-4 py-20 flex items-center justify-center">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-3" aria-hidden="true">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Finalizado!</h2>
          <p className="text-lg text-white/85 mb-5">{msg}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-yellow-300">{score}/{TOTAL}</p>
              <p className="text-white/60 text-xs">Acertos</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-cyan-300">{pct}%</p>
              <p className="text-white/60 text-xs">Aproveitamento</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-pink-300">{maxStreak}</p>
              <p className="text-white/60 text-xs">Melhor sequência</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-green-300">{pct >= 75 ? '⭐' : pct >= 50 ? '🌙' : '🌱'}</p>
              <p className="text-white/60 text-xs">Classificação</p>
            </div>
          </div>
          <button onClick={restart} className="btn-primary w-full mb-2">🔄 Jogar de novo ({difficulty})</button>
          <button onClick={() => setQuizState('menu')} className="glass-card w-full px-4 py-3 text-white font-semibold hover:bg-white/20 min-h-[44px] mb-2">🎯 Mudar dificuldade</button>
          <button onClick={onBack} className="glass-card w-full px-4 py-3 text-white font-semibold hover:bg-white/20 min-h-[44px]">← Voltar</button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="min-h-screen px-4 py-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto">
        <button onClick={onBack} className="glass-card px-4 py-2 text-white font-semibold hover:bg-white/20 min-h-[44px] text-sm" aria-label="Voltar">← Voltar</button>
        <h1 className="text-xl font-bold text-white">📝 Quiz</h1>
        <div className="glass-card px-3 py-1.5 text-white text-sm font-semibold">{idx + 1}/{TOTAL}</div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Progresso */}
        <div className="mb-4">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(idx / TOTAL) * 100}%` }} role="progressbar" aria-valuenow={(idx / TOTAL) * 100} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>

        {/* Placar */}
        <div className="flex justify-between mb-4">
          <div className="glass-card px-3 py-1.5 text-white text-sm font-semibold">✅ {score}</div>
          <div className="glass-card px-3 py-1.5 text-white text-sm font-semibold">🔥 {streak}</div>
        </div>

        {/* Pergunta */}
        <div className="glass-card p-5 mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">{q.question}</h2>
          <div className="space-y-2" role="radiogroup" aria-label="Opções de resposta">
            {q.options.map((opt, i) => {
              let style = 'bg-white/10 text-white hover:bg-white/20 border-white/20';
              if (feedback) {
                if (i === q.correct) style = 'bg-green-500/30 text-white border-green-400 ring-2 ring-green-400';
                else if (i === answer) style = 'bg-red-500/30 text-white border-red-400 ring-2 ring-red-400';
                else style = 'bg-white/5 text-white/40 border-white/10';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={feedback}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all min-h-[48px] font-medium text-sm flex items-center gap-2 ${style}`}
                  role="radio"
                  aria-checked={answer === i}
                >
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="glass-card p-4 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl" aria-hidden="true">{answer === q.correct ? '✅' : '💡'}</span>
              <div>
                <p className="text-white font-bold text-sm mb-1">{answer === q.correct ? 'Muito bem!' : 'Vamos aprender!'}</p>
                <p className="text-white/85 text-sm">{q.explanation}</p>
              </div>
            </div>
            <button onClick={handleNext} className="btn-primary w-full mt-3" autoFocus>
              {idx + 1 >= TOTAL ? '🏁 Ver resultado' : '→ Próxima'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
