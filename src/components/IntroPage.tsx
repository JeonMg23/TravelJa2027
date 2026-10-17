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
  color: string;
  width: number;
}

interface TrailNode {
  x: number;
  y: number;
  alpha: number;
  size: number;
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lightningRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasFinishedRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // iOS Safari / Android Web Audio API Unlocker
  const initAndUnlockAudio = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      setHasAudioUnlocked(true);
    } catch {
      // Ignore audio unlock errors
    }
  }, []);

  useEffect(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
        if (audioContextRef.current.state === 'running') {
          setHasAudioUnlocked(true);
        }
      }
    } catch {}

    const unlockHandler = () => {
      initAndUnlockAudio();
    };

    window.addEventListener('touchstart', unlockHandler, { passive: true });
    window.addEventListener('touchend', unlockHandler, { passive: true });
    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('click', unlockHandler, { passive: true });

    return () => {
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('touchend', unlockHandler);
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('click', unlockHandler);
    };
  }, [initAndUnlockAudio]);

  // Studio-grade Web Audio Synthesizer: Crystal Arpeggio Chimes + Cinematic Thunder Finale
  const playSparkleChime = useCallback((stepIndex: number) => {
    if (isMutedRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // Ascending crystal harmonic progressions for 도 -> 쿄 -> 원 -> 정 -> 대 -> ⚡번개
      const noteGroups: number[][] = [
        [523.25, 659.25, 783.99, 1046.5], // 도 (C5 Major9)
        [587.33, 739.99, 880.0, 1174.66], // 쿄 (D5 Major9)
        [659.25, 830.61, 987.77, 1318.51], // 원 (E5 Major9)
        [783.99, 987.77, 1174.66, 1567.98], // 정 (G5 Major9)
        [880.0, 1108.73, 1318.51, 1760.0], // 대 (A5 Major9)
        [523.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0, 2637.02] // ⚡ Golden Finale Chord
      ];

      const frequencies = noteGroups[stepIndex] || noteGroups[0];
      const isLightning = stepIndex === 5;

      // Cinematic warm sub-bass impact on the Golden Lightning strike
      if (isLightning) {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110, now);
        subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.9);

        subGain.gain.setValueAtTime(0.001, now);
        subGain.gain.linearRampToValueAtTime(0.28, now + 0.02);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 1.45);
      }

      frequencies.forEach((freq, idx) => {
        const noteTime = now + idx * (isLightning ? 0.036 : 0.042);
        const duration = isLightning ? 2.1 : 1.3;

        // Primary bell tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.005, noteTime + 0.045);
        osc.frequency.exponentialRampToValueAtTime(freq, noteTime + 0.22);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.7, noteTime);
        filter.Q.setValueAtTime(1.0, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(isLightning ? 0.2 : 0.16, noteTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration);

        // Shimmering harmonic overtone
        const overtone = ctx.createOscillator();
        const overGain = ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, noteTime);

        overGain.gain.setValueAtTime(0.0001, noteTime);
        overGain.gain.linearRampToValueAtTime(isLightning ? 0.08 : 0.05, noteTime + 0.015);
        overGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration * 0.65);

        overtone.connect(overGain);
        overGain.connect(ctx.destination);

        overtone.start(noteTime);
        overtone.stop(noteTime + duration);
      });
    } catch {
      // Fallback for autoplay restrictions
    }
  }, []);

  const handleSkip = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;
      setIsOutro(true);
      setTimeout(() => {
        onComplete();
      }, 420);
    },
    [onComplete]
  );

  // High-FPS Canvas Engine: Deep Starfield + Wavy Ribbon Comets + Shockwaves + Electric Lightning Arcs
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

    // 1. Ambient Night Sky Stars
    const bgStars: BgStar[] = Array.from({ length: 85 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      baseAlpha: Math.random() * 0.55 + 0.15,
      twinkleSpeed: Math.random() * 0.003 + 0.001,
      twinklePhase: Math.random() * Math.PI * 2,
      color: ['#FFFFFF', '#E0F2FE', '#FEF08A', '#CBD5E1'][Math.floor(Math.random() * 4)]
    }));

    const particles: Particle[] = [];
    const shockwaves: ShockwaveRing[] = [];
    const electricArcs: ElectricArc[] = [];

    // Spawn procedural electric lightning branches from (cx, cy)
    const spawnElectricArcs = (cx: number, cy: number, isGrand: boolean) => {
      const branchCount = isGrand ? 9 : 3;
      for (let b = 0; b < branchCount; b++) {
        const angle = (Math.PI * 2 * b) / branchCount + (Math.random() - 0.5) * 0.5;
        const segments = isGrand ? 8 : 5;
        const stepLen = isGrand ? 22 : 12;
        const pts: { x: number; y: number }[] = [{ x: cx, y: cy }];
        let curX = cx;
        let curY = cy;
        for (let s = 1; s <= segments; s++) {
          const jitter = (Math.random() - 0.5) * 26;
          curX += Math.cos(angle) * stepLen + Math.sin(angle) * jitter;
          curY += Math.sin(angle) * stepLen - Math.cos(angle) * jitter;
          pts.push({ x: curX, y: curY });
        }
        electricArcs.push({
          points: pts,
          alpha: 1,
          color: isGrand ? (b % 2 === 0 ? '#FEF08A' : '#FACC15') : '#E0F2FE',
          width: isGrand ? 2.4 : 1.5
        });
      }
    };

    // Spawn luminous starburst + shockwave ring
    const createImpactBurst = (x: number, y: number, isYellow: boolean) => {
      // Shockwave rings
      shockwaves.push({
        x,
        y,
        radius: 6,
        maxRadius: isYellow ? 160 : 78,
        color: isYellow ? '#FACC15' : '#FFFFFF',
        alpha: 0.9,
        lineWidth: isYellow ? 3.5 : 2.2
      });

      if (isYellow) {
        shockwaves.push({
          x,
          y,
          radius: 2,
          maxRadius: 240,
          color: '#FEF08A',
          alpha: 0.65,
          lineWidth: 1.8
        });
      }

      // Particle explosion
      const count = isYellow ? 75 : 38;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isYellow ? 7.2 : 4.6) + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * (isYellow ? 3.8 : 2.6) + 1.0,
          color: isYellow
            ? ['#FFFFFF', '#FFFBEB', '#FEF08A', '#FACC15', '#F59E0B'][
                Math.floor(Math.random() * 5)
              ]
            : ['#FFFFFF', '#F8FAFC', '#BAE6FD', '#FEF08A'][Math.floor(Math.random() * 4)],
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          gravity: 0.035,
          isSparkle: Math.random() > 0.45
        });
      }

      spawnElectricArcs(x, y, isYellow);
    };

    interface StarFlight {
      startXRatio: number;
      targetIndex: number; // 0..4 for letters, 5 for central lightning
      startTime: number;
      duration: number;
      wavePhase: number;
      waveFreq: number;
      waveAmp: number;
      isYellow: boolean;
      status: 'waiting' | 'flying' | 'landed';
      ribbonHistory: TrailNode[];
    }

    const starFlights: StarFlight[] = [
      {
        startXRatio: 0.14,
        targetIndex: 0,
        startTime: 320,
        duration: 680,
        wavePhase: 0.2,
        waveFreq: 3.5,
        waveAmp: 44,
        isYellow: false,
        status: 'waiting',
        ribbonHistory: []
      },
      {
        startXRatio: 0.34,
        targetIndex: 1,
        startTime: 1020,
        duration: 680,
        wavePhase: 1.8,
        waveFreq: 4.0,
        waveAmp: -40,
        isYellow: false,
        status: 'waiting',
        ribbonHistory: []
      },
      {
        startXRatio: 0.52,
        targetIndex: 2,
        startTime: 1720,
        duration: 680,
        wavePhase: 3.1,
        waveFreq: 3.6,
        waveAmp: 42,
        isYellow: false,
        status: 'waiting',
        ribbonHistory: []
      },
      {
        startXRatio: 0.7,
        targetIndex: 3,
        startTime: 2420,
        duration: 680,
        wavePhase: 4.5,
        waveFreq: 4.2,
        waveAmp: -44,
        isYellow: false,
        status: 'waiting',
        ribbonHistory: []
      },
      {
        startXRatio: 0.88,
        targetIndex: 4,
        startTime: 3120,
        duration: 680,
        wavePhase: 5.7,
        waveFreq: 3.8,
        waveAmp: 46,
        isYellow: false,
        status: 'waiting',
        ribbonHistory: []
      },
      // 6th Grand Golden Star descending to ignite the 3x Golden Lightning Bolt
      {
        startXRatio: 0.5,
        targetIndex: 5,
        startTime: 3900,
        duration: 760,
        wavePhase: 1.1,
        waveFreq: 4.4,
        waveAmp: 58,
        isYellow: true,
        status: 'waiting',
        ribbonHistory: []
      }
    ];

    const animStartTime = performance.now();
    let flashIntensity = 0;

    const drawCinematicStarHead = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      isYellow: boolean,
      time: number
    ) => {
      c.save();
      c.translate(x, y);

      // 1. Wide atmospheric halo
      const haloGrad = c.createRadialGradient(0, 0, 1, 0, 0, size * 4.5);
      if (isYellow) {
        haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        haloGrad.addColorStop(0.35, 'rgba(250, 204, 21, 0.55)');
        haloGrad.addColorStop(1, 'transparent');
      } else {
        haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        haloGrad.addColorStop(0.35, 'rgba(186, 230, 253, 0.5)');
        haloGrad.addColorStop(1, 'transparent');
      }
      c.fillStyle = haloGrad;
      c.beginPath();
      c.arc(0, 0, size * 4.5, 0, Math.PI * 2);
      c.fill();

      // 2. Rotating 4-point primary flare + diagonal sub-flare
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

      // 3. Hot diamond core
      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(0, 0, size * 0.72, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    const render = (currentTime: number) => {
      const elapsed = currentTime - animStartTime;

      // 1. Deep Night Sky Backdrop
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Subtle central ambient aura once letters begin revealing
      if (elapsed > 900) {
        const auraAlpha = Math.min(0.18, ((elapsed - 900) / 4000) * 0.18);
        const centerGrad = ctx.createRadialGradient(
          width / 2,
          height / 2 - 20,
          10,
          width / 2,
          height / 2 - 20,
          Math.max(width, height) * 0.45
        );
        centerGrad.addColorStop(0, `rgba(250, 204, 21, ${auraAlpha})`);
        centerGrad.addColorStop(0.5, `rgba(56, 189, 248, ${auraAlpha * 0.35})`);
        centerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = centerGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Twinkling Starfield
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

      // 3. Process Each Shooting Star & Smooth Ribbon Trail
      starFlights.forEach((star) => {
        if (elapsed < star.startTime) return;

        const flightElapsed = elapsed - star.startTime;
        const progress = Math.min(1, flightElapsed / star.duration);

        let targetX = width / 2;
        let targetY = height / 2;

        if (star.targetIndex < 5) {
          const el = letterRefs.current[star.targetIndex];
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

        const startX = width * star.startXRatio;
        const startY = -45;

        if (progress < 1) {
          star.status = 'flying';

          // Organic wavy trajectory ("흐물흐물 유려한 별빛 궤적")
          const easeProgress = 1 - Math.pow(1 - progress, 2.25);
          const curBaseX = startX + (targetX - startX) * easeProgress;
          const curBaseY = startY + (targetY - startY) * easeProgress;

          const waveFactor = Math.sin(progress * Math.PI * star.waveFreq + star.wavePhase);
          const damping = 1 - easeProgress * 0.78;
          const currentX = curBaseX + waveFactor * star.waveAmp * damping;
          const currentY = curBaseY + Math.cos(progress * Math.PI * 3) * 9 * damping;

          star.ribbonHistory.push({
            x: currentX,
            y: currentY,
            alpha: 1,
            size: star.isYellow ? 5.2 : 3.8
          });

          // Fine stardust along the path
          if (Math.random() < 0.55) {
            particles.push({
              x: currentX + (Math.random() - 0.5) * 14,
              y: currentY + (Math.random() - 0.5) * 14,
              vx: (Math.random() - 0.5) * 0.7,
              vy: (Math.random() - 0.5) * 0.7 + 0.2,
              size: Math.random() * 2 + 0.8,
              color: star.isYellow ? '#FEF08A' : '#E0F2FE',
              alpha: 0.85,
              decay: 0.028,
              gravity: 0.01,
              isSparkle: true
            });
          }

          // Draw comet head
          drawCinematicStarHead(
            ctx,
            currentX,
            currentY,
            star.isYellow ? 9.5 : 7.2,
            star.isYellow,
            currentTime
          );
        } else if (star.status === 'flying') {
          star.status = 'landed';

          playSparkleChime(star.targetIndex);
          createImpactBurst(targetX, targetY, star.isYellow);

          if (star.targetIndex < 5) {
            const idx = star.targetIndex;
            setActiveImpactIndex(idx);
            setRevealedLetters((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          } else {
            flashIntensity = 0.38;
            setRevealedLightning(true);
            setTimeout(() => {
              setRevealedSubtitle(true);
            }, 220);
          }
        }

        // Render smooth tapered ribbon trail for this star
        if (star.ribbonHistory.length > 1) {
          for (let i = star.ribbonHistory.length - 1; i >= 0; i--) {
            star.ribbonHistory[i].alpha -= 0.032;
            if (star.ribbonHistory[i].alpha <= 0) {
              star.ribbonHistory.splice(i, 1);
            }
          }

          for (let i = 1; i < star.ribbonHistory.length; i++) {
            const prev = star.ribbonHistory[i - 1];
            const curr = star.ribbonHistory[i];
            const ratio = i / star.ribbonHistory.length;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.strokeStyle = star.isYellow
              ? `rgba(250, 204, 21, ${curr.alpha * ratio})`
              : `rgba(255, 255, 255, ${curr.alpha * ratio})`;
            ctx.lineWidth = curr.size * ratio;
            ctx.lineCap = 'round';
            ctx.shadowColor = star.isYellow ? '#FACC15' : '#BAE6FD';
            ctx.shadowBlur = star.isYellow ? 14 : 10;
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      // 4. Draw Expanding Shockwave Rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.14;
        sw.alpha -= 0.032;
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

      // 5. Draw Procedural Electric Lightning Arcs
      for (let i = electricArcs.length - 1; i >= 0; i--) {
        const arc = electricArcs[i];
        arc.alpha -= 0.055;
        if (arc.alpha <= 0) {
          electricArcs.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = arc.alpha;
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = arc.width;
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        arc.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x + (Math.random() - 0.5) * 3, pt.y + (Math.random() - 0.5) * 3);
        });
        ctx.stroke();
        ctx.restore();
      }

      // 6. Draw Burst & Stardust Particles
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

      // 7. Subtle Golden Screen Flash on Lightning Strike
      if (flashIntensity > 0.005) {
        ctx.save();
        ctx.fillStyle = `rgba(254, 240, 138, ${flashIntensity})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        flashIntensity *= 0.88;
      }

      // 8. Complete Intro Sequence
      if (elapsed > 6000 && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setIsOutro(true);
        setTimeout(() => {
          onComplete();
        }, 780);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, [playSparkleChime, onComplete]);

  const handleScreenInteraction = () => {
    initAndUnlockAudio();
    if (!hasAudioUnlocked && !isMutedRef.current) {
      playSparkleChime(
        revealedLightning ? 5 : Math.max(0, revealedLetters.filter(Boolean).length - 1)
      );
    }
  };

  const letters = ['도', '쿄', '원', '정', '대'];

  return (
    <div
      onClick={handleScreenInteraction}
      onTouchStart={handleScreenInteraction}
      className={`fixed inset-0 z-[10000] w-full min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center select-none font-sans transition-all duration-700 ${
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
      {/* 1. Fullscreen High-DPI Canvas for Starlight Comets, Ribbons & Electric Arcs */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 2. Top Controls: Mute & Skip */}
      <div
        className="absolute top-4 right-4 z-30 flex items-center gap-2"
        style={{ marginTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            initAndUnlockAudio();
            setIsMuted(!isMuted);
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
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/85 hover:text-white text-xs font-semibold tracking-tight transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <span>건너뛰기</span>
          <FastForward className="w-3.5 h-3.5 text-yellow-400" />
        </button>
      </div>

      {/* 3. Main Centerpiece Stage: 3x Golden Lightning Emblem + "도 쿄 원 정 대" */}
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

          {/* Crisp Golden Halo Ring */}
          <div
            className={`absolute w-32 h-32 sm:w-42 sm:h-42 rounded-full border border-yellow-300/40 shadow-[0_0_50px_rgba(250,204,21,0.5)] transition-all duration-700 ${
              revealedLightning ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          />

          <svg
            className="w-28 h-28 sm:w-38 sm:h-38 drop-shadow-[0_0_32px_rgba(250,204,21,0.95)]"
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
                <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#FACC15" floodOpacity="0.95" />
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
              fillOpacity="0.28"
            />
          </svg>
        </div>

        {/* 5 Starlight Characters: "도 쿄 원 정 대" */}
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
                className={`relative text-[38px] sm:text-[54px] font-black tracking-tight leading-none transition-all duration-500 ease-out select-none inline-block text-center ${
                  isRevealed
                    ? 'opacity-100 scale-100 translate-y-0 text-white'
                    : 'opacity-0 scale-50 translate-y-3 text-white/10'
                }`}
                style={{
                  textShadow: isRevealed
                    ? revealedLightning
                      ? '0 0 18px rgba(255,255,255,0.98), 0 0 36px rgba(250,204,21,0.75), 0 4px 12px rgba(0,0,0,0.9)'
                      : isFreshImpact
                      ? '0 0 24px rgba(255,255,255,1), 0 0 45px rgba(186,230,253,0.9)'
                      : '0 0 16px rgba(255,255,255,0.95), 0 0 30px rgba(255,255,255,0.45)'
                    : 'none'
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Cinematic Expedition Subtitle (Appears smoothly as the Golden Lightning ignites) */}
        <div
          className={`mt-4 sm:mt-5 flex items-center gap-2.5 text-xs sm:text-sm font-mono font-bold tracking-[0.22em] text-yellow-300/90 uppercase transition-all duration-700 ${
            revealedSubtitle
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
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

      {/* 4. Mobile Sound Unlock Prompt */}
      {!hasAudioUnlocked && !isMuted && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            initAndUnlockAudio();
            playSparkleChime(0);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            initAndUnlockAudio();
            playSparkleChime(0);
          }}
          className="absolute bottom-6 sm:bottom-8 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white backdrop-blur-md cursor-pointer animate-pulse active:scale-95 transition-all text-xs font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          style={{ marginBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
        >
          <Volume2 className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>화면을 터치하면 사운드가 켜집니다 🎵</span>
        </div>
      )}
    </div>
  );
};
