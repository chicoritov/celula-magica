import { useRef, useCallback, useEffect } from 'react';

// Escala pentatônica em frequências (soa agradável e relaxante)
const PENTATONIC_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

// Padrões de melodia (índices da escala)
const MELODY_PATTERNS = [
  [0, 2, 4, 3, 1, 2, 0, 4],
  [4, 3, 2, 4, 5, 4, 3, 2],
  [1, 3, 5, 4, 2, 3, 1, 0],
  [5, 4, 3, 2, 4, 5, 6, 5],
];

// Acordes suaves (fundamental + terça + quinta)
const CHORD_PROGRESSION = [
  [0, 2, 4], // C major
  [3, 5, 0], // G major (inversão)
  [4, 6, 1], // A minor
  [2, 4, 6], // E minor
];

interface BackgroundMusicOptions {
  volume?: number;
  tempo?: number; // BPM
}

export function useBackgroundMusic() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const schedulerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentPatternRef = useRef(0);
  const currentNoteRef = useRef(0);
  const currentChordRef = useRef(0);

  const createAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      
      // Master gain para controle de volume
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.value = 0;
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    return audioCtxRef.current;
  }, []);

  // Toca uma nota com envelope ADSR suave
  const playNote = useCallback((
    frequency: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.15
  ) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !masterGainRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Filtro low-pass para som mais suave
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    osc.type = type;
    osc.frequency.value = frequency;

    // Envelope ADSR suave
    const attack = 0.1;
    const decay = 0.2;
    const sustain = volume * 0.6;
    const release = 0.5;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + attack);
    gain.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
    gain.gain.setValueAtTime(sustain, startTime + duration - release);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }, []);

  // Toca um acorde suave (pad)
  const playChord = useCallback((
    chordIndices: number[],
    startTime: number,
    duration: number,
    volume: number = 0.08
  ) => {
    chordIndices.forEach((idx, i) => {
      const freq = PENTATONIC_SCALE[idx] / 2; // Oitava abaixo para som mais grave
      playNote(freq, startTime, duration, 'sine', volume);
      // Adiciona uma oitava acima com volume menor para brilho
      if (i === 0) {
        playNote(freq * 2, startTime, duration, 'sine', volume * 0.3);
      }
    });
  }, [playNote]);

  // Scheduler principal
  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isPlayingRef.current) return;

    const tempo = 60; // BPM
    const secondsPerBeat = 60.0 / tempo;
    const lookahead = 0.1; // Segundos para olhar à frente

    while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
      const pattern = MELODY_PATTERNS[currentPatternRef.current];
      const noteIndex = pattern[currentNoteRef.current];
      const frequency = PENTATONIC_SCALE[noteIndex];

      // Toca nota da melodia
      playNote(frequency, nextNoteTimeRef.current, secondsPerBeat * 0.8, 'sine', 0.12);

      // A cada 4 notas, toca um acorde
      if (currentNoteRef.current % 4 === 0) {
        const chord = CHORD_PROGRESSION[currentChordRef.current];
        playChord(chord, nextNoteTimeRef.current, secondsPerBeat * 4, 0.06);
        currentChordRef.current = (currentChordRef.current + 1) % CHORD_PROGRESSION.length;
      }

      // Avança para próxima nota
      nextNoteTimeRef.current += secondsPerBeat;
      currentNoteRef.current++;

      // Muda padrão a cada 8 notas
      if (currentNoteRef.current >= 8) {
        currentNoteRef.current = 0;
        currentPatternRef.current = (currentPatternRef.current + 1) % MELODY_PATTERNS.length;
      }
    }

    schedulerRef.current = requestAnimationFrame(scheduler);
  }, [playNote, playChord]);

  const start = useCallback((options: BackgroundMusicOptions = {}) => {
    const { volume = 0.3 } = options;
    
    try {
      const ctx = createAudioContext();
      
      // Resume se estiver suspenso (política de autoplay dos navegadores)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (masterGainRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1);
      }

      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        nextNoteTimeRef.current = ctx.currentTime;
        currentPatternRef.current = 0;
        currentNoteRef.current = 0;
        currentChordRef.current = 0;
        scheduler();
      }
    } catch (error) {
      console.warn('Erro ao iniciar música de fundo:', error);
    }
  }, [createAudioContext, scheduler]);

  const stop = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;

    const ctx = audioCtxRef.current;
    
    // Fade out suave
    masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
    masterGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

    isPlayingRef.current = false;
    
    if (schedulerRef.current) {
      cancelAnimationFrame(schedulerRef.current);
      schedulerRef.current = null;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    
    const ctx = audioCtxRef.current;
    masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
    masterGainRef.current.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.3);
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stop]);

  return {
    start,
    stop,
    setVolume,
    isPlaying: () => isPlayingRef.current,
  };
}
