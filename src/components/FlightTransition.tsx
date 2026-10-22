import React, { useEffect, useState, useRef } from 'react';
import { Plane, FastForward, Sparkles } from 'lucide-react';
import { getEffectivePresetMembers } from '../services/kakaoAuth';
import { getCharacterAvatarById } from '../data/characterAvatars';

interface FlightTransitionProps {
  onComplete: () => void;
  targetDayNumber?: number;
  targetView?: 'timeline' | 'map';
}

export const FlightTransition: React.FC<FlightTransitionProps> = ({
  onComplete,
  targetDayNumber = 1,
  targetView = 'timeline'
}) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState(
    '🇰🇷 대한민국 인천국제공항(ICN) 활주로 이륙! 도쿄 원정대 출발!'
  );
  const [statusBadge, setStatusBadge] = useState('인천 이륙 🛫');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const targetDayNumberRef = useRef(targetDayNumber);
  targetDayNumberRef.current = targetDayNumber;

  const targetViewRef = useRef(targetView);
  targetViewRef.current = targetView;

  const members = getEffectivePresetMembers();

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2200; // 2.2 seconds smooth cinematic flight
    let animFrameId: number;
    let isFinished = false;

    const frame = (now: number) => {
      if (isFinished) return;
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      const roundedPct = Math.round(pct * 10) / 10;

      setProgress(roundedPct);

      const targetDay = targetDayNumberRef.current;
      const view = targetViewRef.current;

      if (pct < 22) {
        setStatusBadge('인천 이륙 🛫');
        setStageText('🇰🇷 대한민국 인천국제공항(ICN) 활주로 이륙! 도쿄 원정대 출발!');
      } else if (pct < 50) {
        setStatusBadge('동해 상공 순항 ☁️');
        setStageText('동해 상공 10,500m 성층권 순항 중! 최고 속도 892km/h!');
      } else if (pct < 78) {
        setStatusBadge('후지산 상공 통과 🗻');
        setStageText('🇯🇵 일본 열도 진입! 만년설 후지산 절경 감상 및 하강 시작!');
      } else if (pct < 96) {
        setStatusBadge('나리타 착륙 🛬');
        setStageText('도쿄 나리타 국제공항(NRT) 활주로 안전 착륙 완료!');
      } else {
        setStatusBadge('도쿄 도착 완료! 🎉');
        if (view === 'map') {
          setStageText('도쿄 원정대 2027 구글 동선 지도 화면으로 진입합니다! 🗺️');
        } else {
          setStageText(`도쿄 원정대 2027 Day ${targetDay} 일정 화면으로 진입합니다!`);
        }
      }

      if (pct >= 100) {
        isFinished = true;
        setIsFadingOut(true);
        setTimeout(() => {
          onCompleteRef.current();
        }, 260);
        return;
      }

      animFrameId = requestAnimationFrame(frame);
    };

    animFrameId = requestAnimationFrame(frame);

    return () => {
      isFinished = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onCompleteRef.current();
    }, 180);
  };

  // Bezier flight curve calculation along the 3D stratosphere arc
  const t = Math.max(0, Math.min(1, progress / 100));
  const P0x = 140;
  const P0y = 285;
  const P1x = 500;
  const P1y = 55;
  const P2x = 860;
  const P2y = 285;

  const bx = (1 - t) * (1 - t) * P0x + 2 * (1 - t) * t * P1x + t * t * P2x;
  const by = (1 - t) * (1 - t) * P0y + 2 * (1 - t) * t * P1y + t * t * P2y;
  const currentX = (bx / 1000) * 100;
  const currentY = (by / 420) * 100;

  const dx = 2 * (1 - t) * (P1x - P0x) + 2 * t * (P2x - P1x);
  const dy = 2 * (1 - t) * (P1y - P0y) + 2 * t * (P2y - P1y);
  const planeAngle = Math.atan2(dy, dx) * (180 / Math.PI);

  const altitudeMeters = Math.round(
    t < 0.2
      ? (t / 0.2) * 10500
      : t > 0.8
      ? ((1 - t) / 0.2) * 10500
      : 10500
  );
  const speedKmh = Math.round(
    t < 0.15 ? 280 + (t / 0.15) * 612 : t > 0.88 ? 260 + ((1 - t) / 0.12) * 632 : 892
  );

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#030714] via-[#06122c] to-[#02050d] text-white transition-all duration-300 select-none px-4 sm:px-6 py-6 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Starlight & 3D Night Globe Horizon Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.85) 1px, transparent 1.5px), radial-gradient(circle at 76% 16%, rgba(250,204,21,0.85) 1.5px, transparent 2px), radial-gradient(circle at 48% 32%, rgba(56,189,248,0.85) 1px, transparent 1.5px), radial-gradient(circle at 84% 58%, rgba(255,255,255,0.7) 1px, transparent 1.5px), radial-gradient(circle at 26% 68%, rgba(255,255,255,0.6) 1px, transparent 1.5px)',
            backgroundSize: '180px 180px'
          }}
        />
        <div className="absolute -bottom-52 left-1/2 -translate-x-1/2 w-[140%] h-[420px] rounded-[100%] bg-gradient-to-t from-sky-500/30 via-blue-600/15 to-transparent blur-3xl" />
        <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[130%] h-[390px] rounded-[100%] border-t-2 border-cyan-300/60 shadow-[0_-20px_60px_rgba(56,189,248,0.45)] bg-[#020611]/95" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col justify-between gap-4">
        {/* Top Header Bar & Skip Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black backdrop-blur-md shadow-[0_0_20px_rgba(250,204,21,0.2)]">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>TOKYO EXPEDITION 2027 · FIRST CLASS BOARDING</span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-slate-200 hover:text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer active:scale-95"
          >
            <span>스킵하고 바로 이동</span>
            <FastForward className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* =========================================================================
            DESIGN 1: FIRST-CLASS GOLD BOARDING PASS & 3D STRATOSPHERE NIGHT GLOBE
           ========================================================================= */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#04091a]/90 via-[#071430]/90 to-[#02050d]/95 border-2 border-amber-400/45 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden p-4 sm:p-6 flex flex-col justify-between min-h-[430px] sm:min-h-[490px] backdrop-blur-xl">
          {/* Inner 3D Earth Curvature Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[130%] h-[360px] rounded-[100%] bg-gradient-to-t from-sky-500/30 via-blue-600/15 to-transparent blur-2xl" />
            <div className="absolute -bottom-56 left-1/2 -translate-x-1/2 w-[125%] h-[340px] rounded-[100%] border-t-2 border-cyan-300/60 shadow-[0_-15px_50px_rgba(56,189,248,0.45)] bg-[#030712]/95" />
          </div>

          {/* 1) First-Class Gold Boarding Pass Card */}
          <div className="relative z-20 w-full bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-amber-950/40 border border-amber-400/50 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Route ICN -> NRT */}
              <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-8 flex-1">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                    DEPARTURE · KOREA
                  </span>
                  <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    ICN
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">
                    인천국제공항 T1
                  </span>
                </div>

                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                  <span className="text-[10px] font-mono text-amber-300 font-bold mb-1">
                    FIRST CLASS · 2h 25m
                  </span>
                  <div className="w-full flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                    <div className="flex-1 h-0.5 border-b-2 border-dashed border-amber-400/60 relative">
                      <Plane
                        className="w-5 h-5 text-amber-300 fill-amber-300 rotate-45 absolute -top-2.5 -translate-x-1/2 transition-all duration-75"
                        style={{ left: `${progress}%` }}
                      />
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185]" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    FLIGHT TOKYO-2027
                  </span>
                </div>

                <div className="text-right md:text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-bold block">
                    ARRIVAL · JAPAN
                  </span>
                  <div className="text-2xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight">
                    NRT
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">
                    도쿄 나리타 국제공항
                  </span>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className="hidden md:block h-16 border-l-2 border-dashed border-amber-400/30 mx-2" />

              {/* Right: 4 Expedition Crew Avatars & Gate Info */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    PASSENGERS (4 VIPs)
                  </span>
                  <div className="flex items-center -space-x-2 mt-1">
                    {members.map((m) => {
                      const av = getCharacterAvatarById(m.avatarId, m.id);
                      return (
                        <div
                          key={m.id}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${av.bgGradient} border-2 border-amber-300 overflow-hidden flex items-center justify-center shadow-md`}
                          title={m.nickname}
                        >
                          {m.profileImageUrl ? (
                            <img
                              src={m.profileImageUrl}
                              alt={m.nickname}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            av.renderSvg('w-full h-full')
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                    GATE 27 · BOARDING
                  </span>
                  <div className="text-xs font-bold text-white mt-1">
                    2027.01.13 09:00
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2) 3D Stratosphere Curved Earth Horizon & Golden Jet Arc */}
          <div className="relative z-10 flex-1 my-2 min-h-[250px] sm:min-h-[300px]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 420"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="d1ArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <filter id="d1Glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Curved 3D Globe Latitude / Longitude Grid Lines */}
              <path
                d="M 40 360 Q 500 200 960 360"
                fill="none"
                stroke="#38bdf840"
                strokeWidth="2"
              />
              <path
                d="M 0 400 Q 500 240 1000 400"
                fill="none"
                stroke="#38bdf825"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />

              {/* City Night Lights Clusters on the Globe Horizon */}
              <circle cx="140" cy="285" r="18" fill="#38bdf830" />
              <circle cx="140" cy="285" r="6" fill="#38bdf8" />
              <circle cx="860" cy="285" r="22" fill="#f43f5e30" />
              <circle cx="860" cy="285" r="7" fill="#f43f5e" />

              {/* Flight Guide Dashed Curve */}
              <path
                d="M 140 285 Q 500 55 860 285"
                fill="none"
                stroke="#ffffff25"
                strokeWidth="3"
                strokeDasharray="8 8"
              />

              {/* Active Golden Starlight Trajectory */}
              <path
                d="M 140 285 Q 500 55 860 285"
                fill="none"
                stroke="url(#d1ArcGrad)"
                strokeWidth="6"
                strokeDasharray="950"
                strokeDashoffset={950 - (progress / 100) * 950}
                strokeLinecap="round"
                filter="url(#d1Glow)"
              />
            </svg>

            {/* Departure City Pin (Seoul / Incheon) */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: '14%', top: '68%' }}
            >
              <div className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400 text-sky-200 text-xs font-black backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                🇰🇷 SEOUL · ICN
              </div>
              <span className="text-[10px] text-sky-300/80 font-mono mt-1 block">
                09:00 AM 이륙
              </span>
            </div>

            {/* Center Stratosphere Telemetry Badge */}
            <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-amber-400/40 text-amber-200 text-xs font-mono font-bold shadow-lg">
                ALT {altitudeMeters.toLocaleString()}m · {speedKmh} km/h
              </div>
            </div>

            {/* Arrival City Pin (Tokyo / Narita) */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: '86%', top: '68%' }}
            >
              <div className="px-3 py-1 rounded-full bg-rose-500/25 border border-rose-400 text-rose-200 text-xs font-black backdrop-blur-md shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse">
                🇯🇵 TOKYO · NRT
              </div>
              <span className="text-[10px] text-rose-300/80 font-mono mt-1 block">
                11:30 AM 착륙
              </span>
            </div>

            {/* Flying Luxury Golden Jet */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: `${currentX}%`,
                top: `${currentY}%`,
                transform: `translate(-50%, -50%) rotate(${planeAngle}deg)`
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute -left-20 w-24 h-2 bg-gradient-to-l from-amber-300 via-sky-400 to-transparent rounded-full blur-[1px]" />
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border-2 border-white shadow-[0_0_35px_rgba(250,204,21,0.95)] flex items-center justify-center">
                  <Plane className="w-8 h-8 sm:w-9 sm:h-9 text-slate-950 fill-slate-950 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress & Flight Stage Bar */}
        <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-amber-400 text-slate-950 shrink-0">
                {statusBadge}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                {stageText}
              </span>
            </div>
            <span className="font-mono font-black text-amber-400 text-sm sm:text-base shrink-0 ml-2">
              {progress}%
            </span>
          </div>

          <div className="w-full h-2.5 sm:h-3 bg-slate-950 rounded-full overflow-hidden border border-white/15 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
