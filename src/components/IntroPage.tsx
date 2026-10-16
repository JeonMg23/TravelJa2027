import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

interface IntroPageProps {
  onComplete: () => void;
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
}

interface TrailPoint {
  x: number;
  y: number;
  color: string;
  size: number;
  alpha: number;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [revealedLetters, setRevealedLetters] = useState<boolean[]>([false, false, false, false, false]);
  const [revealedLightning, setRevealedLightning] = useState<boolean>(false);
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

  // iOS Safari / Android Web Audio API Unlocker (모바일 브라우저 오디오 자동재생 정책 해제)
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

      // iOS WebKit silent 1-sample buffer playback unlocks audio engine for the session
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      setHasAudioUnlocked(true);
    } catch {
      // Ignored
    }
  }, []);

  // Global mobile touch / click listeners to immediately unlock sound on any user gesture
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

  // Web Audio API Synthesizer: 6 bright, pleasant, sparkling "띠리링~" (tiriring~) chimes
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

      // 6 harmonious ascending notes with sparkling micro-arpeggios (띠-리-링~)
      // Step 0: '도' -> C5 arpeggio [C5, E5, G5]
      // Step 1: '쿄' -> E5 arpeggio [E5, G5, B5]
      // Step 2: '원' -> G5 arpeggio [G5, B5, D6]
      // Step 3: '정' -> B5 arpeggio [B5, D6, E6]
      // Step 4: '대' -> C6 arpeggio [C6, E6, G6]
      // Step 5: '번개' -> Grand golden culmination chord [E6, G6, B6, C7, E7]
      const noteGroups: number[][] = [
        [523.25, 659.25, 783.99],             // 도 (C5, E5, G5)
        [659.25, 783.99, 987.77],             // 쿄 (E5, G5, B5)
        [783.99, 987.77, 1174.66],            // 원 (G5, B5, D6)
        [987.77, 1174.66, 1318.51],           // 정 (B5, D6, E6)
        [1046.50, 1318.51, 1567.98],          // 대 (C6, E6, G6)
        [1318.51, 1567.98, 1975.53, 2093.00, 2637.02] // 번개 Golden climax!
      ];

      const frequencies = noteGroups[stepIndex] || noteGroups[0];
      const isLightning = stepIndex === 5;

      frequencies.forEach((freq, idx) => {
        const noteTime = now + idx * 0.042; // 42ms interval for sparkling "띠-리-링"
        const duration = isLightning ? 1.8 : 1.2;

        // Primary crystal tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        // Gentle sparkle pitch ramp
        osc.frequency.exponentialRampToValueAtTime(freq * 1.006, noteTime + 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq, noteTime + 0.2);

        // Bright crystal bandpass filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.6, noteTime);
        filter.Q.setValueAtTime(1.1, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(isLightning ? 0.24 : 0.18, noteTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration);

        // Shimmering octave sparkle overtone
        const overtone = ctx.createOscillator();
        const overGain = ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, noteTime);

        overGain.gain.setValueAtTime(0.0001, noteTime);
        overGain.gain.linearRampToValueAtTime(isLightning ? 0.09 : 0.06, noteTime + 0.015);
        overGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration * 0.7);

        overtone.connect(overGain);
        overGain.connect(ctx.destination);

        overtone.start(noteTime);
        overtone.stop(noteTime + duration);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  const handleSkip = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsOutro(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  }, [onComplete]);

  // Main Canvas Animation: 5 wavy white stars + 1 wavy yellow star
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles collection (sparks, bursts, trails)
    const particles: Particle[] = [];
    const trailPoints: TrailPoint[] = [];

    // Helper: spawn explosion burst at (x, y)
    const createBurst = (x: number, y: number, isYellow: boolean) => {
      const count = isYellow ? 50 : 30;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isYellow ? 5.5 : 4) + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * (isYellow ? 3.5 : 2.5) + 1.2,
          color: isYellow
            ? ['#FFFBEB', '#FEF08A', '#FACC15', '#F59E0B'][Math.floor(Math.random() * 4)]
            : ['#FFFFFF', '#F8FAFC', '#E2E8F0', '#BAE6FD'][Math.floor(Math.random() * 4)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    // 6 Star Flight Definitions:
    // Stars 0..4: White starlight for "도", "쿄", "원", "정", "대"
    // Star 5: Yellow starlight for the central lightning bolt
    interface StarFlight {
      startXRatio: number;
      targetIndex: number; // 0..4 for letters, 5 for lightning
      startTime: number;
      duration: number;
      wavePhase: number;
      waveFreq: number;
      waveAmp: number;
      isYellow: boolean;
      status: 'waiting' | 'flying' | 'landed';
    }

    // Precise schedule (ms from animation start)
    const starFlights: StarFlight[] = [
      { startXRatio: 0.15, targetIndex: 0, startTime: 350, duration: 680, wavePhase: 0.2, waveFreq: 3.5, waveAmp: 42, isYellow: false, status: 'waiting' },
      { startXRatio: 0.35, targetIndex: 1, startTime: 1050, duration: 680, wavePhase: 1.8, waveFreq: 4.0, waveAmp: -38, isYellow: false, status: 'waiting' },
      { startXRatio: 0.52, targetIndex: 2, startTime: 1750, duration: 680, wavePhase: 3.1, waveFreq: 3.6, waveAmp: 40, isYellow: false, status: 'waiting' },
      { startXRatio: 0.70, targetIndex: 3, startTime: 2450, duration: 680, wavePhase: 4.5, waveFreq: 4.2, waveAmp: -44, isYellow: false, status: 'waiting' },
      { startXRatio: 0.88, targetIndex: 4, startTime: 3150, duration: 680, wavePhase: 5.7, waveFreq: 3.8, waveAmp: 46, isYellow: false, status: 'waiting' },
      // Final 6th yellow star descending to center for lightning bolt
      { startXRatio: 0.50, targetIndex: 5, startTime: 3950, duration: 750, wavePhase: 1.2, waveFreq: 4.5, waveAmp: 55, isYellow: true, status: 'waiting' }
    ];

    const animStartTime = performance.now();

    const drawTwinkleStar = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      glowColor: string
    ) => {
      c.save();
      c.translate(x, y);

      // Outer Radial Glow
      const grad = c.createRadialGradient(0, 0, 1, 0, 0, size * 3.5);
      grad.addColorStop(0, glowColor);
      grad.addColorStop(0.4, glowColor);
      grad.addColorStop(1, 'transparent');
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, size * 3.5, 0, Math.PI * 2);
      c.fill();

      // Core 4-pointed Star Sparkle
      c.fillStyle = color;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.moveTo(0, 0);
        c.lineTo(size * 0.25, size * 0.25);
        c.lineTo(0, size * 2.2);
        c.lineTo(-size * 0.25, size * 0.25);
        c.closePath();
      }
      c.fill();

      // Center Bright Diamond
      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(0, 0, size * 0.7, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    const render = (currentTime: number) => {
      const elapsed = currentTime - animStartTime;

      // 1. Clear Canvas with Pure Pitch Black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw and Update Trails
      for (let i = trailPoints.length - 1; i >= 0; i--) {
        const pt = trailPoints[i];
        pt.alpha -= 0.024;
        if (pt.alpha <= 0) {
          trailPoints.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw and Update Burst Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Process Each Star Flight
      starFlights.forEach((star) => {
        if (elapsed < star.startTime) return;

        const flightElapsed = elapsed - star.startTime;
        const progress = Math.min(1, flightElapsed / star.duration);

        // Get target coordinates from real DOM element positions
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
          // Central lightning target
          const boltEl = lightningRef.current;
          if (boltEl) {
            const rect = boltEl.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
        }

        const startX = width * star.startXRatio;
        const startY = -40;

        if (progress < 1) {
          star.status = 'flying';

          // Fluid organic wavy path ("흐물흐물하게"):
          // Smooth eased progress towards target
          const easeProgress = 1 - Math.pow(1 - progress, 2.2);

          const curBaseX = startX + (targetX - startX) * easeProgress;
          const curBaseY = startY + (targetY - startY) * easeProgress;

          // Multi-frequency sinusoidal waving oscillation
          const waveFactor = Math.sin(progress * Math.PI * star.waveFreq + star.wavePhase);
          const damping = 1 - easeProgress * 0.75; // Wave dampens as it approaches target
          const currentX = curBaseX + waveFactor * star.waveAmp * damping;
          const currentY = curBaseY + Math.cos(progress * Math.PI * 3) * 8 * damping;

          // Add starlight trail points
          const starColor = star.isYellow ? '#FACC15' : '#FFFFFF';
          trailPoints.push({
            x: currentX,
            y: currentY,
            color: starColor,
            size: star.isYellow ? 3.2 : 2.4,
            alpha: 0.95
          });

          // Occasional sparkle dust
          if (Math.random() < 0.4) {
            trailPoints.push({
              x: currentX + (Math.random() - 0.5) * 14,
              y: currentY + (Math.random() - 0.5) * 14,
              color: star.isYellow ? '#FEF08A' : '#BAE6FD',
              size: Math.random() * 2 + 0.8,
              alpha: 0.8
            });
          }

          // Draw shooting star head
          drawTwinkleStar(
            ctx,
            currentX,
            currentY,
            star.isYellow ? 9 : 7,
            star.isYellow ? '#FFFBEB' : '#FFFFFF',
            star.isYellow ? 'rgba(250, 204, 21, 0.7)' : 'rgba(255, 255, 255, 0.7)'
          );
        } else if (star.status === 'flying') {
          // Arrived at target!
          star.status = 'landed';

          // 1. Play dedicated sound effect for this step (0..5)
          playSparkleChime(star.targetIndex);

          // 2. Create starburst explosion
          createBurst(targetX, targetY, star.isYellow);

          // 3. Reveal corresponding letter or lightning
          if (star.targetIndex < 5) {
            setRevealedLetters((prev) => {
              const next = [...prev];
              next[star.targetIndex] = true;
              return next;
            });
          } else {
            setRevealedLightning(true);
          }
        }
      });

      // 5. Check if all completed and trigger outro
      if (elapsed > 5800 && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setIsOutro(true);
        setTimeout(() => {
          onComplete();
        }, 800);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, [playSparkleChime, onComplete]);

  // Touch screen to unlock audio on mobile smartphones
  const handleScreenInteraction = () => {
    initAndUnlockAudio();
    if (!hasAudioUnlocked && !isMutedRef.current) {
      playSparkleChime(revealedLightning ? 5 : Math.max(0, revealedLetters.filter(Boolean).length - 1));
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
      {/* 1. Fullscreen Animation Canvas for Falling Stars & Sparkles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* 2. Top Controls: Discreet Mute & Skip buttons */}
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
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
          title={isMuted ? '소리 켜기' : '소리 끄기'}
          aria-label={isMuted ? '음소거 해제' : '음소거'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium tracking-tight transition-all cursor-pointer backdrop-blur-sm active:scale-95"
        >
          <span>건너뛰기</span>
          <FastForward className="w-3.5 h-3.5 text-yellow-400" />
        </button>
      </div>

      {/* 3. Main Stage: Yellow Lightning Bolt (3x Letter Size) & 5 Letters "도 쿄 원 정 대" */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none">
        {/* Yellow Lightning Bolt (아이콘의 노란색 번개 - 글자 크기의 3배) */}
        {/* Letter font size is 38px/52px, so lightning is ~114px/156px (exactly 3x!) */}
        <div
          ref={lightningRef}
          className={`relative flex items-center justify-center mb-6 sm:mb-8 transition-all duration-700 ease-out ${
            revealedLightning
              ? 'opacity-100 scale-100 translate-y-0 filter drop-shadow-[0_0_35px_rgba(250,204,21,0.95)]'
              : 'opacity-0 scale-50 -translate-y-4'
          }`}
        >
          {/* Subtle Golden Radial Glow */}
          <div
            className={`absolute -inset-10 rounded-full bg-yellow-400/30 blur-2xl transition-opacity duration-1000 ${
              revealedLightning ? 'opacity-100 scale-110' : 'opacity-0 scale-50'
            }`}
          />

          <svg
            className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_4px_24px_rgba(250,204,21,0.85)]"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="yellowIntroBoltGrad" x1="0%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
              <filter id="yellowBoltFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#FACC15" floodOpacity="0.9" />
              </filter>
            </defs>
            <path
              d="M 292 60 
                 L 140 270 
                 L 256 270 
                 L 190 460 
                 L 372 230 
                 L 262 230 
                 L 325 60 
                 Z"
              fill="url(#yellowIntroBoltGrad)"
              stroke="#FFFBEB"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#yellowBoltFilter)"
            />
          </svg>
        </div>

        {/* 5 Letters: "도", "쿄", "원", "정", "대" (One by one as white stars land) */}
        <div className="flex items-center justify-center gap-2 sm:gap-4.5">
          {letters.map((char, index) => {
            const isRevealed = revealedLetters[index];
            return (
              <span
                key={index}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                className={`text-[36px] sm:text-[50px] font-black tracking-tight leading-none transition-all duration-500 ease-out select-none inline-block text-center ${
                  isRevealed
                    ? 'opacity-100 scale-100 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]'
                    : 'opacity-0 scale-60 text-white/10'
                }`}
                style={{
                  textShadow: isRevealed
                    ? '0 0 16px rgba(255,255,255,0.95), 0 0 30px rgba(255,255,255,0.5)'
                    : 'none'
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* 4. Mobile Sound Notice (스마트폰 브라우저 오디오 자동재생 차단 해제 안내) */}
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
