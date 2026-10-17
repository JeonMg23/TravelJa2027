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

  // 3D Metal Forge & High-Voltage Electric Thunder Synthesizer
  const playForgeSound = useCallback((stepIndex: number) => {
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
      const isLightning = stepIndex === 5;

      // Heavy Sub-Bass Anvil Punch
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = isLightning ? 'sine' : 'triangle';
      const startFreq = isLightning ? 130 : 145;
      const endFreq = isLightning ? 36 : 46;
      const subDur = isLightning ? 1.6 : 0.55;

      subOsc.frequency.setValueAtTime(startFreq, now);
      subOsc.frequency.exponentialRampToValueAtTime(endFreq, now + subDur * 0.75);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(isLightning ? 0.32 : 0.18, now + 0.016);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + subDur);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + subDur + 0.05);

      // Ascending Metallic Anvil Harmonics for 도(0) -> 쿄(1) -> 원(2) -> 정(3) -> 대(4) -> ⚡번개(5)
      const noteGroups: number[][] = [
        [523.25, 659.25, 783.99, 1046.5], // 도 (C5)
        [587.33, 739.99, 880.0, 1174.66], // 쿄 (D5)
        [659.25, 830.61, 987.77, 1318.51], // 원 (E5)
        [783.99, 987.77, 1174.66, 1567.98], // 정 (G5)
        [880.0, 1108.73, 1318.51, 1760.0], // 대 (A5)
        [523.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0, 2637.02] // ⚡ Grand Golden Finale
      ];

      const frequencies = noteGroups[stepIndex] || noteGroups[0];

      frequencies.forEach((freq, idx) => {
        const noteTime = now + idx * (isLightning ? 0.035 : 0.038);
        const duration = isLightning ? 2.2 : 1.05;

        // Primary metallic clang
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.008, noteTime + 0.035);
        osc.frequency.exponentialRampToValueAtTime(freq, noteTime + 0.18);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.9, noteTime);
        filter.Q.setValueAtTime(1.2, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(isLightning ? 0.22 : 0.16, noteTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration);

        // High metallic overtone
        const overtone = ctx.createOscillator();
        const overGain = ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2.5, noteTime);

        overGain.gain.setValueAtTime(0.0001, noteTime);
        overGain.gain.linearRampToValueAtTime(isLightning ? 0.085 : 0.05, noteTime + 0.015);
        overGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration * 0.65);

        overtone.connect(overGain);
        overGain.connect(ctx.destination);

        overtone.start(noteTime);
        overtone.stop(noteTime + duration);
      });
    } catch {
      // Ignore autoplay errors
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

      // 8. Auto-advance smoothly after full presentation completes (~5.8s)
      if (elapsed > 5800 && !hasFinishedRef.current) {
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
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, []);

  const handleScreenInteraction = () => {
    initAndUnlockAudio();
    if (!hasAudioUnlocked && !isMutedRef.current) {
      playForgeSound(
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

      {/* 4. Mobile Sound Unlock Prompt */}
      {!hasAudioUnlocked && !isMuted && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            initAndUnlockAudio();
            playForgeSound(0);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            initAndUnlockAudio();
            playForgeSound(0);
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
