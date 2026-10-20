import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

interface IntroPageProps {
  onComplete: () => void;
}

interface BgStar {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  isSparkle: boolean;
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

interface ElectricArc {
  points: { x: number; y: number }[];
  alpha: number;
  decay: number;
  color: string;
  width: number;
}

interface StepNode {
  targetIndex: number; // 0..4 for letters, 5 for central lightning
  startTime: number;
  duration: number;
  isYellow: boolean;
  status: 'waiting' | 'forging' | 'landed';
  landedX: number;
  landedY: number;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [revealedLetters, setRevealedLetters] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false
  ]);
  const [activeImpactIndex, setActiveImpactIndex] = useState<number | null>(null);
  const [revealedLightning, setRevealedLightning] = useState<boolean>(false);
  const [revealedSubtitle, setRevealedSubtitle] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOutro, setIsOutro] = useState<boolean>(false);
  const [hasAudioUnlocked, setHasAudioUnlocked] = useState<boolean>(false);
  const [melodyPlayCount, setMelodyPlayCount] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lightningRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasFinishedRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const hasAudioUnlockedRef = useRef<boolean>(false);
  const lastGestureTimeRef = useRef<number>(0);
  const animStartTimeRef = useRef<number>(0);
  const minEndTimeRef = useRef<number>(5800);
  const fullMelodyWavUrlRef = useRef<string | null>(null);
  const stepWavUrlsRef = useRef<string[]>([]);
  const activeHtmlAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted && activeHtmlAudioRef.current) {
      try {
        activeHtmlAudioRef.current.pause();
      } catch {}
    }
  }, [isMuted]);

  // Build in-memory 16-bit PCM WAV data URLs so mobile browsers (iOS Safari, KakaoTalk, Android Chrome)
  // play crisp, loud melodies over the native Media Audio channel on any screen touch
  useEffect(() => {
    const sampleRate = 22050;

    const buildWavUrl = (
      notes: { freq: number; start: number; duration: number; amp: number }[],
      totalDuration: number
    ): string => {
      const numSamples = Math.floor(sampleRate * totalDuration);
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      const writeStr = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeStr(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeStr(8, 'WAVE');
      writeStr(12, 'fmt ');
      view.setUint32(16, 16, true); // PCM chunk size
      view.setUint16(20, 1, true); // PCM format
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeStr(36, 'data');
      view.setUint32(40, numSamples * 2, true);

      const samples = new Float32Array(numSamples);

      for (const note of notes) {
        const startIdx = Math.max(0, Math.floor(note.start * sampleRate));
        const endIdx = Math.min(numSamples, Math.floor((note.start + note.duration) * sampleRate));
        const attackSamples = Math.max(1, Math.floor(0.008 * sampleRate));
        const noteLen = Math.max(1, endIdx - startIdx);

        for (let i = startIdx; i < endIdx; i++) {
          const localIdx = i - startIdx;
          const t = localIdx / sampleRate;
          const envAttack = localIdx < attackSamples ? localIdx / attackSamples : 1;
          const envDecay = Math.exp((-3.8 * localIdx) / noteLen);
          const env = envAttack * envDecay;

          // Bright bell + warm triangle overtone blend audible on all phone speakers
          const fundamental = Math.sin(2 * Math.PI * note.freq * t);
          const harmonic2 = 0.42 * Math.sin(2 * Math.PI * note.freq * 2 * t);
          const harmonic3 = 0.18 * Math.sin(2 * Math.PI * note.freq * 3 * t);
          samples[i] += (fundamental + harmonic2 + harmonic3) * note.amp * env;
        }
      }

      // Soft limiter and 16-bit PCM encoding
      for (let i = 0; i < numSamples; i++) {
        const clamped = Math.max(-0.98, Math.min(0.98, Math.tanh(samples[i] * 1.35)));
        view.setInt16(44 + i * 2, clamped * 32767, true);
      }

      const blob = new Blob([buffer], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    };

    // 1) Full Sparkling "도-쿄-원-정-대 ⚡" Intro Melody Fanfare (plays immediately on mobile screen touch)
    const fanfareNotes = [
      // 도 (C5 + E5 + G5)
      { freq: 523.25, start: 0.0, duration: 0.36, amp: 0.42 },
      { freq: 659.25, start: 0.03, duration: 0.34, amp: 0.32 },
      { freq: 1046.5, start: 0.06, duration: 0.32, amp: 0.24 },
      // 쿄 (D5 + F#5 + A5)
      { freq: 587.33, start: 0.15, duration: 0.36, amp: 0.42 },
      { freq: 739.99, start: 0.18, duration: 0.34, amp: 0.32 },
      { freq: 1174.66, start: 0.21, duration: 0.32, amp: 0.24 },
      // 원 (E5 + G#5 + B5)
      { freq: 659.25, start: 0.3, duration: 0.36, amp: 0.44 },
      { freq: 830.61, start: 0.33, duration: 0.34, amp: 0.34 },
      { freq: 1318.51, start: 0.36, duration: 0.32, amp: 0.26 },
      // 정 (G5 + B5 + D6)
      { freq: 783.99, start: 0.45, duration: 0.38, amp: 0.46 },
      { freq: 987.77, start: 0.48, duration: 0.36, amp: 0.36 },
      { freq: 1567.98, start: 0.51, duration: 0.34, amp: 0.28 },
      // 대 (A5 + C#6 + E6)
      { freq: 880.0, start: 0.6, duration: 0.42, amp: 0.48 },
      { freq: 1108.73, start: 0.63, duration: 0.4, amp: 0.38 },
      { freq: 1760.0, start: 0.66, duration: 0.38, amp: 0.3 },
      // ⚡ 번개 클라이맥스 팬파레 (C5 -> G5 -> C6 -> E6 -> G6 -> C7 Grand Golden Chord)
      { freq: 523.25, start: 0.78, duration: 1.15, amp: 0.38 },
      { freq: 783.99, start: 0.81, duration: 1.12, amp: 0.38 },
      { freq: 1046.5, start: 0.85, duration: 1.1, amp: 0.46 },
      { freq: 1318.51, start: 0.9, duration: 1.05, amp: 0.46 },
      { freq: 1567.98, start: 0.95, duration: 1.0, amp: 0.48 },
      { freq: 2093.0, start: 1.01, duration: 0.98, amp: 0.52 },
      { freq: 2637.02, start: 1.07, duration: 0.92, amp: 0.38 }
    ];
    fullMelodyWavUrlRef.current = buildWavUrl(fanfareNotes, 2.05);

    // 2) Individual Step Chimes (0..5)
    const stepGroups: number[][] = [
      [523.25, 659.25, 783.99, 1046.5], // 도
      [587.33, 739.99, 880.0, 1174.66], // 쿄
      [659.25, 830.61, 987.77, 1318.51], // 원
      [783.99, 987.77, 1174.66, 1567.98], // 정
      [880.0, 1108.73, 1318.51, 1760.0], // 대
      [523.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0, 2637.02] // ⚡ 번개
    ];

    stepWavUrlsRef.current = stepGroups.map((freqs, sIdx) => {
      const isFinal = sIdx === 5;
      const notes = freqs.map((freq, idx) => ({
        freq,
        start: idx * 0.042,
        duration: isFinal ? 1.15 : 0.65,
        amp: isFinal ? 0.45 : 0.42
      }));
      return buildWavUrl(notes, isFinal ? 1.45 : 0.85);
    });

    return () => {
      if (fullMelodyWavUrlRef.current) {
        URL.revokeObjectURL(fullMelodyWavUrlRef.current);
      }
      stepWavUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  // Ensure AudioContext exists and is resumed inside user gesture
  const ensureAudioContext = useCallback((): AudioContext | null => {
    try {
      // iOS 16.4+ / 17+ AudioSession API: allow playback even if hardware silent switch is on
      const nav = navigator as Navigator & {
        audioSession?: { type: string };
      };
      if (nav.audioSession) {
        nav.audioSession.type = 'playback';
      }

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state !== 'running') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch {
      return null;
    }
  }, []);

  // Play Web Audio API Chime Notes on given AudioContext
  const scheduleWebAudioNotes = useCallback(
    (
      ctx: AudioContext,
      notes: { freq: number; delay: number; duration: number; peakGain: number }[]
    ) => {
      const startBase = ctx.currentTime + 0.01;
      notes.forEach(({ freq, delay, duration, peakGain }) => {
        const noteTime = startBase + delay;

        // Primary crystal bell oscillator (direct to destination without muting bandpass filter)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.005, noteTime + 0.03);
        osc.frequency.exponentialRampToValueAtTime(freq, noteTime + 0.16);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(peakGain, noteTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + duration + 0.02);

        // Sparkling harmonic overtone
        const overOsc = ctx.createOscillator();
        const overGain = ctx.createGain();
        overOsc.type = 'sine';
        overOsc.frequency.setValueAtTime(freq * 2, noteTime);

        overGain.gain.setValueAtTime(0.0001, noteTime);
        overGain.gain.linearRampToValueAtTime(peakGain * 0.45, noteTime + 0.012);
        overGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration * 0.75);

        overOsc.connect(overGain);
        overGain.connect(ctx.destination);
        overOsc.start(noteTime);
        overOsc.stop(noteTime + duration + 0.02);
      });
    },
    []
  );

  // Play individual step sound (when each character '도','쿄','원','정','대','⚡' lands)
  const playForgeSound = useCallback(
    (stepIndex: number) => {
      if (isMutedRef.current) return;

      // 1) If unlocked on mobile, play the step WAV via HTML5 Audio for guaranteed mobile speaker output
      if (hasAudioUnlockedRef.current && stepWavUrlsRef.current[stepIndex]) {
        try {
          const stepAudio = new Audio(stepWavUrlsRef.current[stepIndex]);
          stepAudio.volume = 0.9;
          stepAudio.play().catch(() => {});
        } catch {}
      }

      // 2) Also play via Web Audio API if context is running
      try {
        const ctx = ensureAudioContext();
        if (!ctx) return;

        const noteGroups: number[][] = [
          [523.25, 659.25, 783.99, 1046.5], // 도 (C5)
          [587.33, 739.99, 880.0, 1174.66], // 쿄 (D5)
          [659.25, 830.61, 987.77, 1318.51], // 원 (E5)
          [783.99, 987.77, 1174.66, 1567.98], // 정 (G5)
          [880.0, 1108.73, 1318.51, 1760.0], // 대 (A5)
          [523.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0, 2637.02] // ⚡ 번개
        ];
        const freqs = noteGroups[stepIndex] || noteGroups[0];
        const isLightning = stepIndex === 5;
        const notes = freqs.map((freq, idx) => ({
          freq,
          delay: idx * 0.04,
          duration: isLightning ? 1.4 : 0.85,
          peakGain: isLightning ? 0.28 : 0.24
        }));

        if (ctx.state === 'running') {
          scheduleWebAudioNotes(ctx, notes);
        }
      } catch {
        // Ignore autoplay errors before user interaction
      }
    },
    [ensureAudioContext, scheduleWebAudioNotes]
  );

  // Play the full sparkling "도-쿄-원-정-대 ⚡" melody fanfare immediately on user touch/click
  const playFullIntroMelodyOnTouch = useCallback(() => {
    if (isMutedRef.current) return;

    hasAudioUnlockedRef.current = true;
    setHasAudioUnlocked(true);
    setMelodyPlayCount((c) => c + 1);

    // 1) Play HTML5 WAV Fanfare immediately inside the user touch gesture (100% reliable on iOS & Android)
    if (fullMelodyWavUrlRef.current) {
      try {
        if (activeHtmlAudioRef.current) {
          activeHtmlAudioRef.current.pause();
          activeHtmlAudioRef.current.currentTime = 0;
        }
        const audio = new Audio(fullMelodyWavUrlRef.current);
        audio.volume = 1.0;
        activeHtmlAudioRef.current = audio;
        audio.play().catch(() => {});
      } catch {}
    }

    // 2) Also unlock & play Web Audio API melody notes (handles both running and newly resumed states)
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const melodySequence = [
        { freq: 523.25, delay: 0.0, duration: 0.38, peakGain: 0.26 }, // 도
        { freq: 659.25, delay: 0.04, duration: 0.35, peakGain: 0.2 },
        { freq: 587.33, delay: 0.15, duration: 0.38, peakGain: 0.26 }, // 쿄
        { freq: 739.99, delay: 0.19, duration: 0.35, peakGain: 0.2 },
        { freq: 659.25, delay: 0.3, duration: 0.38, peakGain: 0.28 }, // 원
        { freq: 830.61, delay: 0.34, duration: 0.35, peakGain: 0.22 },
        { freq: 783.99, delay: 0.45, duration: 0.4, peakGain: 0.3 }, // 정
        { freq: 987.77, delay: 0.49, duration: 0.36, peakGain: 0.24 },
        { freq: 880.0, delay: 0.6, duration: 0.42, peakGain: 0.32 }, // 대
        { freq: 1108.73, delay: 0.64, duration: 0.38, peakGain: 0.25 },
        // ⚡ Grand Golden Climax Arpeggio
        { freq: 1046.5, delay: 0.78, duration: 1.15, peakGain: 0.32 },
        { freq: 1318.51, delay: 0.84, duration: 1.1, peakGain: 0.32 },
        { freq: 1567.98, delay: 0.9, duration: 1.05, peakGain: 0.34 },
        { freq: 2093.0, delay: 0.96, duration: 1.05, peakGain: 0.36 },
        { freq: 2637.02, delay: 1.02, duration: 0.95, peakGain: 0.28 }
      ];

      if (ctx.state === 'running') {
        scheduleWebAudioNotes(ctx, melodySequence);
      } else {
        ctx
          .resume()
          .then(() => {
            scheduleWebAudioNotes(ctx, melodySequence);
          })
          .catch(() => {});
      }
    } catch {}
  }, [ensureAudioContext, scheduleWebAudioNotes]);

  const handleSkip = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) e.stopPropagation();
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;
      if (activeHtmlAudioRef.current) {
        try {
          activeHtmlAudioRef.current.pause();
        } catch {}
      }
      setIsOutro(true);
      setTimeout(() => {
        onComplete();
      }, 420);
    },
    [onComplete]
  );

  // High-FPS 3D Metal Forge & Chained Electric Arc Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateCanvasSize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // 1. Ambient Gold/Amber Starlight in Obsidian Space
    const bgStars: BgStar[] = Array.from({ length: 85 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      baseAlpha: Math.random() * 0.55 + 0.15,
      twinkleSpeed: Math.random() * 0.003 + 0.001,
      twinklePhase: Math.random() * Math.PI * 2,
      color: ['#FFFFFF', '#FEF08A', '#FACC15', '#FDE68A'][Math.floor(Math.random() * 4)]
    }));

    const particles: Particle[] = [];
    const shockwaves: ShockwaveRing[] = [];
    const electricArcs: ElectricArc[] = [];

    // Create jagged high-voltage electric polyline
    const createJaggedBolt = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      segments: number,
      jitterAmount: number,
      color: string,
      lineWidth: number,
      decay = 0.035
    ) => {
      const pts: { x: number; y: number }[] = [{ x: x1, y: y1 }];
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const bx = x1 + (x2 - x1) * t;
        const by = y1 + (y2 - y1) * t;
        const perpX = -(y2 - y1);
        const perpY = x2 - x1;
        const len = Math.hypot(perpX, perpY) || 1;
        const offset = (Math.random() - 0.5) * jitterAmount;
        pts.push({
          x: bx + (perpX / len) * offset,
          y: by + (perpY / len) * offset
        });
      }
      pts.push({ x: x2, y: y2 });
      electricArcs.push({
        points: pts,
        alpha: 1,
        decay,
        color,
        width: lineWidth
      });
    };

    // Radial electric arcs from impact center
    const spawnRadialElectricArcs = (cx: number, cy: number, isGrand: boolean) => {
      const branchCount = isGrand ? 10 : 4;
      for (let b = 0; b < branchCount; b++) {
        const angle = (Math.PI * 2 * b) / branchCount + (Math.random() - 0.5) * 0.5;
        const dist = isGrand ? 120 + Math.random() * 65 : 50 + Math.random() * 25;
        const ex = cx + Math.cos(angle) * dist;
        const ey = cy + Math.sin(angle) * dist;
        createJaggedBolt(
          cx,
          cy,
          ex,
          ey,
          isGrand ? 8 : 5,
          isGrand ? 28 : 16,
          isGrand ? (b % 2 === 0 ? '#FEF08A' : '#FACC15') : '#FEF08A',
          isGrand ? 2.6 : 1.6,
          isGrand ? 0.028 : 0.045
        );
      }
    };

    // Molten anvil impact burst: shockwaves + sparks + arcs
    const createImpactBurst = (x: number, y: number, isYellow: boolean) => {
      shockwaves.push({
        x,
        y,
        radius: 6,
        maxRadius: isYellow ? 185 : 85,
        color: isYellow ? '#FACC15' : '#F59E0B',
        alpha: 0.95,
        lineWidth: isYellow ? 3.8 : 2.4
      });

      if (isYellow) {
        shockwaves.push({
          x,
          y,
          radius: 2,
          maxRadius: 270,
          color: '#FEF08A',
          alpha: 0.75,
          lineWidth: 2.0
        });
      }

      // Molten metal forge sparks flying with gravity
      const count = isYellow ? 90 : 45;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isYellow ? 8.2 : 5.0) + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.4,
          size: Math.random() * (isYellow ? 4.2 : 2.8) + 1.0,
          color: isYellow
            ? ['#FFFFFF', '#FFFBEB', '#FEF08A', '#FACC15', '#F59E0B'][
                Math.floor(Math.random() * 5)
              ]
            : ['#FFFFFF', '#FEF08A', '#FACC15', '#F97316'][Math.floor(Math.random() * 4)],
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          gravity: 0.08,
          isSparkle: Math.random() > 0.35
        });
      }

      spawnRadialElectricArcs(x, y, isYellow);

      if (isYellow) {
        for (let k = 0; k < 3; k++) {
          const topX = x + (Math.random() - 0.5) * 140;
          createJaggedBolt(topX, -10, x, y, 12, 36, '#FACC15', 3.2, 0.025);
        }
      }
    };

    const steps: StepNode[] = [
      {
        targetIndex: 0,
        startTime: 280,
        duration: 620,
        isYellow: false,
        status: 'waiting',
        landedX: 0,
        landedY: 0
      },
      {
        targetIndex: 1,
        startTime: 950,
        duration: 620,
        isYellow: false,
        status: 'waiting',
        landedX: 0,
        landedY: 0
      },
      {
        targetIndex: 2,
        startTime: 1620,
        duration: 620,
        isYellow: false,
        status: 'waiting',
        landedX: 0,
        landedY: 0
      },
      {
        targetIndex: 3,
        startTime: 2290,
        duration: 620,
        isYellow: false,
        status: 'waiting',
        landedX: 0,
        landedY: 0
      },
      {
        targetIndex: 4,
        startTime: 2960,
        duration: 620,
        isYellow: false,
        status: 'waiting',
        landedX: 0,
        landedY: 0
      },
      // 5: Grand Finale Yellow Lightning Bolt
      {
        targetIndex: 5,
        startTime: 3700,
        duration: 720,
        isYellow: true,
        status: 'waiting',
        landedX: 0,
        landedY: 0
      }
    ];

    const animStartTime = performance.now();
    animStartTimeRef.current = animStartTime;
    let flashIntensity = 0;

    const drawCinematicFlare = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      isYellow: boolean,
      time: number
    ) => {
      c.save();
      c.translate(x, y);

      const haloGrad = c.createRadialGradient(0, 0, 1, 0, 0, size * 4.5);
      haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      haloGrad.addColorStop(0.35, 'rgba(250, 204, 21, 0.55)');
      haloGrad.addColorStop(1, 'transparent');

      c.fillStyle = haloGrad;
      c.beginPath();
      c.arc(0, 0, size * 4.5, 0, Math.PI * 2);
      c.fill();

      c.rotate(time * 0.0025);
      c.fillStyle = isYellow ? '#FEF08A' : '#FFFFFF';
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(size * 0.24, size * 0.24);
        c.lineTo(0, size * 2.7);
        c.lineTo(-size * 0.24, size * 0.24);
        c.closePath();
        c.fill();
      }

      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(0, 0, size * 0.72, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    const render = (currentTime: number) => {
      const elapsed = currentTime - animStartTime;

      // 1. Pure Obsidian Black Backdrop
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Warm amber-gold ambient aura in center
      if (elapsed > 700) {
        const auraAlpha = Math.min(0.24, ((elapsed - 700) / 3800) * 0.24);
        const centerGrad = ctx.createRadialGradient(
          width / 2,
          height / 2 - 40,
          10,
          width / 2,
          height / 2 - 40,
          Math.max(width, height) * 0.46
        );
        centerGrad.addColorStop(0, `rgba(250, 204, 21, ${auraAlpha})`);
        centerGrad.addColorStop(0.5, `rgba(245, 158, 11, ${auraAlpha * 0.45})`);
        centerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = centerGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Ambient Stars
      bgStars.forEach((st) => {
        const twinkle =
          st.baseAlpha + Math.sin(currentTime * st.twinkleSpeed + st.twinklePhase) * 0.22;
        ctx.save();
        ctx.globalAlpha = Math.max(0.05, Math.min(0.95, twinkle));
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Process 3D Metal Forge Steps
      steps.forEach((step) => {
        if (elapsed < step.startTime) return;

        const flightElapsed = elapsed - step.startTime;
        const progress = Math.min(1, flightElapsed / step.duration);

        let targetX = width / 2;
        let targetY = height / 2;

        if (step.targetIndex < 5) {
          const el = letterRefs.current[step.targetIndex];
          if (el) {
            const rect = el.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
        } else {
          const boltEl = lightningRef.current;
          if (boltEl) {
            const rect = boltEl.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
        }

        if (progress < 1) {
          step.status = 'forging';

          // Vertical molten gold forge beam slamming down
          const easeIn = Math.pow(progress, 2.4);
          const startY = -60;
          const currentY = startY + (targetY - startY) * easeIn;

          const beamGrad = ctx.createLinearGradient(targetX, startY, targetX, currentY);
          beamGrad.addColorStop(0, 'transparent');
          beamGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)');
          beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0.95)');

          ctx.save();
          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = step.isYellow ? 15 : 7.5;
          ctx.lineCap = 'round';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 22;
          ctx.beginPath();
          ctx.moveTo(targetX, Math.max(-40, currentY - 180));
          ctx.lineTo(targetX, currentY);
          ctx.stroke();
          ctx.restore();

          drawCinematicFlare(
            ctx,
            targetX,
            currentY,
            step.isYellow ? 11 : 8,
            true,
            currentTime
          );

          // Anvil ring warming up on target spot
          ctx.save();
          ctx.strokeStyle = `rgba(250, 204, 21, ${progress * 0.7})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(targetX, targetY, (1 - progress) * 42 + 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else if (step.status === 'forging') {
          step.status = 'landed';
          step.landedX = targetX;
          step.landedY = targetY;

          playForgeSound(step.targetIndex);
          createImpactBurst(targetX, targetY, step.isYellow);

          // Connect newly forged letter with yellow electric arc to previous letter!
          if (step.targetIndex > 0 && step.targetIndex < 5) {
            const prevStep = steps[step.targetIndex - 1];
            if (prevStep.landedX && prevStep.landedY) {
              createJaggedBolt(
                prevStep.landedX,
                prevStep.landedY,
                targetX,
                targetY,
                7,
                18,
                '#FACC15',
                2.4,
                0.025
              );
            }
          } else if (step.targetIndex === 5) {
            // Climax: connect all 5 letters to the central Golden Lightning Bolt!
            for (let idx = 0; idx < 5; idx++) {
              const lStep = steps[idx];
              if (lStep.landedX && lStep.landedY) {
                createJaggedBolt(
                  lStep.landedX,
                  lStep.landedY,
                  targetX,
                  targetY,
                  8,
                  24,
                  '#FEF08A',
                  2.6,
                  0.02
                );
              }
            }
          }

          if (step.targetIndex < 5) {
            const idx = step.targetIndex;
            setActiveImpactIndex(idx);
            setRevealedLetters((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          } else {
            flashIntensity = 0.48;
            setRevealedLightning(true);
            setTimeout(() => {
              setRevealedSubtitle(true);
            }, 200);
          }
        }
      });

      // Ambient golden electric sparks around the lightning bolt
      if (elapsed > 4450 && Math.random() < 0.16) {
        const boltEl = lightningRef.current;
        if (boltEl) {
          const rect = boltEl.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const ang = Math.random() * Math.PI * 2;
          const r = 35 + Math.random() * 55;
          createJaggedBolt(
            cx + Math.cos(ang) * 14,
            cy + Math.sin(ang) * 14,
            cx + Math.cos(ang) * r,
            cy + Math.sin(ang) * r,
            5,
            14,
            '#FACC15',
            1.8,
            0.06
          );
        }
      }

      // 4. Expanding Shockwave Rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.14;
        sw.alpha -= 0.03;
        if (sw.alpha <= 0.01) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = sw.alpha;
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.lineWidth * sw.alpha;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 5. Electric Lightning Arcs
      for (let i = electricArcs.length - 1; i >= 0; i--) {
        const arc = electricArcs[i];
        arc.alpha -= arc.decay;
        if (arc.alpha <= 0) {
          electricArcs.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = arc.alpha;
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = arc.width;
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        arc.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x + (Math.random() - 0.5) * 2.5, pt.y + (Math.random() - 0.5) * 2.5);
        });
        ctx.stroke();
        ctx.restore();
      }

      // 6. Molten Spark Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + p.gravity;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.isSparkle ? 8 : 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 7. Golden Screen Flash on Lightning Strike
      if (flashIntensity > 0.005) {
        ctx.save();
        ctx.fillStyle = `rgba(254, 240, 138, ${flashIntensity})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        flashIntensity *= 0.87;
      }

      // 8. Auto-advance smoothly after full presentation & any touch melody completes
      if (elapsed > minEndTimeRef.current && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setIsOutro(true);
        setTimeout(() => {
          onComplete();
        }, 550);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [playForgeSound, onComplete]);

  // Clean up audio context
  useEffect(() => {
    return () => {
      if (activeHtmlAudioRef.current) {
        try {
          activeHtmlAudioRef.current.pause();
        } catch {}
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, []);

  const handleScreenInteraction = useCallback(() => {
    const now = performance.now();
    // Prevent duplicate firing when mobile fires both onTouchStart and onClick for the same tap
    if (now - lastGestureTimeRef.current < 280) return;
    lastGestureTimeRef.current = now;

    // Ensure intro stays visible long enough for the 2.0s melody fanfare to finish playing
    const elapsedSinceStart = now - (animStartTimeRef.current || now);
    minEndTimeRef.current = Math.max(minEndTimeRef.current, elapsedSinceStart + 2150);

    playFullIntroMelodyOnTouch();
  }, [playFullIntroMelodyOnTouch]);

  const letters = ['도', '쿄', '원', '정', '대'];

  return (
    <div
      onClick={handleScreenInteraction}
      onTouchStart={handleScreenInteraction}
      className={`fixed inset-0 z-[10000] w-full min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center select-none font-sans transition-all duration-700 cursor-pointer ${
        isOutro ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '-webkit-fill-available'
      }}
    >
      {/* 1. Fullscreen Canvas for 3D Metal Forge & Electric Lightning Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 2. Top Controls: Sound Toggle & Skip */}
      <div
        className="absolute top-4 right-4 z-30 flex items-center gap-2"
        style={{ marginTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            const nextMuted = !isMuted;
            isMutedRef.current = nextMuted;
            setIsMuted(nextMuted);
            if (!nextMuted) {
              playFullIntroMelodyOnTouch();
            }
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-md"
          title={isMuted ? '소리 켜기' : '소리 끄기'}
          aria-label={isMuted ? '음소거 해제' : '음소거'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-yellow-400" />
          )}
        </button>

        <button
          onClick={handleSkip}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/85 hover:text-white text-xs font-semibold tracking-tight transition-all cursor-pointer backdrop-blur-md active:scale-95 whitespace-nowrap"
        >
          <span>건너뛰기</span>
          <FastForward className="w-3.5 h-3.5 text-yellow-400" />
        </button>
      </div>

      {/* 3. Main Centerpiece Stage: 3D Faceted Golden Lightning Emblem + "도 쿄 원 정 대" */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4">
        {/* Golden Lightning Bolt Emblem (3x Letter Size) */}
        <div
          ref={lightningRef}
          className={`relative flex items-center justify-center mb-6 sm:mb-8 transition-all duration-700 ease-out ${
            revealedLightning
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-50 -translate-y-6'
          }`}
        >
          {/* Outer Pulsing Golden Corona */}
          <div
            className={`absolute -inset-12 rounded-full bg-yellow-400/25 blur-3xl transition-all duration-1000 ${
              revealedLightning ? 'opacity-100 scale-125' : 'opacity-0 scale-50'
            }`}
          />

          {/* 3D Metallic Amber-Gold Halo Ring */}
          <div
            className={`absolute w-32 h-32 sm:w-42 sm:h-42 rounded-full border-2 border-amber-400/60 shadow-[0_0_60px_rgba(245,158,11,0.8)] transition-all duration-700 ${
              revealedLightning ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          />

          <svg
            className="w-28 h-28 sm:w-38 sm:h-38 drop-shadow-[0_0_36px_rgba(250,204,21,0.98)]"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="argonIntroBoltGrad" x1="0%" y1="0%" x2="75%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="22%" stopColor="#FEF08A" />
                <stop offset="58%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              <linearGradient id="argonBoltRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <filter id="argonBoltGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="12"
                  floodColor="#FACC15"
                  floodOpacity="0.95"
                />
              </filter>
            </defs>
            {/* Main 3D Faceted Lightning Bolt */}
            <path
              d="M 292 60 
                 L 140 270 
                 L 256 270 
                 L 190 460 
                 L 372 230 
                 L 262 230 
                 L 325 60 
                 Z"
              fill="url(#argonIntroBoltGrad)"
              stroke="url(#argonBoltRim)"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#argonBoltGlow)"
            />
            {/* Inner Specular Highlight Facet */}
            <path
              d="M 288 84 L 166 256 L 256 256 L 212 395 L 340 242 L 254 242 Z"
              fill="#FFFFFF"
              fillOpacity="0.32"
            />
          </svg>
        </div>

        {/* 5 Forged 3D Characters: "도 쿄 원 정 대" */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-5">
          {letters.map((char, index) => {
            const isRevealed = revealedLetters[index];
            const isFreshImpact = activeImpactIndex === index;
            return (
              <span
                key={index}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                className={`relative text-[38px] sm:text-[56px] font-black tracking-tight leading-none transition-all duration-500 ease-out select-none inline-block text-center ${
                  isRevealed
                    ? 'opacity-100 scale-100 translate-y-0 text-white'
                    : 'opacity-0 scale-50 translate-y-3 text-white/10'
                }`}
                style={{
                  textShadow: isRevealed
                    ? revealedLightning
                      ? '0 0 18px rgba(255,255,255,0.98), 0 0 38px rgba(250,204,21,0.85), 0 4px 14px rgba(0,0,0,0.95)'
                      : isFreshImpact
                      ? '0 0 28px rgba(254,240,138,1), 0 0 50px rgba(245,158,11,0.95)'
                      : '0 2px 0 rgba(180,83,9,0.9), 0 0 22px rgba(250,204,21,0.65)'
                    : 'none'
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Cinematic Expedition Subtitle (Ignites as the Golden Lightning is forged) */}
        <div
          className={`mt-4 sm:mt-5 flex items-center gap-2.5 text-xs sm:text-sm font-mono font-bold tracking-[0.22em] text-yellow-300/95 uppercase transition-all duration-700 ${
            revealedSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{
            textShadow: '0 0 14px rgba(250, 204, 21, 0.65)'
          }}
        >
          <span className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent to-yellow-400/80" />
          <span>TOKYO EXPEDITION 2027</span>
          <span className="w-6 sm:w-10 h-px bg-gradient-to-l from-transparent to-yellow-400/80" />
        </div>
      </div>

      {/* 4. Mobile Sound Unlock & Melody Trigger Button */}
      {!isMuted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleScreenInteraction();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleScreenInteraction();
          }}
          className={`absolute bottom-6 sm:bottom-8 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full border backdrop-blur-md cursor-pointer active:scale-95 transition-all text-xs font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${
            hasAudioUnlocked
              ? 'bg-amber-400/20 border-amber-400/50 text-amber-200'
              : 'bg-white/15 hover:bg-white/25 border-white/25 text-white animate-pulse'
          }`}
          style={{ marginBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
        >
          <Volume2 className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>
            {hasAudioUnlocked
              ? `인트로 멜로디 재생됨 ♪ (터치하면 다시 재생${melodyPlayCount > 1 ? ` · ${melodyPlayCount}회` : ''})`
              : '화면을 터치하면 인트로 멜로디가 울립니다 🎵'}
          </span>
        </button>
      )}
    </div>
  );
};
