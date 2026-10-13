import React, { useEffect, useState } from 'react';
import { Plane, Sparkles, Navigation, Cloud, MapPin, FastForward, Compass } from 'lucide-react';

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
  // progress goes from 0% to 100%
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('대한민국 인천국제공항(ICN) 탑승 수속 및 이륙 준비 중...');
  const [statusBadge, setStatusBadge] = useState('출발 준비 🛫');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1.6 seconds total fast flight journey (shortened by 2 seconds for snappy transition)
    const startTime = Date.now();
    const duration = 1600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 20) {
        setStatusBadge('인천 이륙 🛫');
        setStageText('🇰🇷 대한민국 인천국제공항(ICN) 활주로 이륙! 개구쟁이 원정대 출발!');
      } else if (pct < 45) {
        setStatusBadge('동해 상공 순항 ☁️');
        setStageText('동해 상공 10,000m 고도 순항 중! 울릉도·독도 상공 통과!');
      } else if (pct < 70) {
        setStatusBadge('일본 열도 진입 🗻');
        setStageText('🇯🇵 일본 열도 진입! 후지산 설경 감상 및 나리타 착륙 하강 시작!');
      } else if (pct < 95) {
        setStatusBadge('나리타 착륙 🛬');
        setStageText('도쿄 나리타 국제공항(NRT) 활주로 안전 착륙 완료! 도쿄 원정 개시!');
      } else {
        setStatusBadge('도쿄 도착 완료! 🎉');
        if (targetView === 'map') {
          setStageText('개구쟁이들의 도쿄 대모험 구글 동선 지도 화면으로 진입합니다! 🗺️');
        } else {
          setStageText(`개구쟁이들의 도쿄 대모험 Day ${targetDayNumber} 화면으로 진입합니다!`);
        }
      }

      if (pct >= 100) {
        clearInterval(interval);
        // Start smooth fade out into the app
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete, targetDayNumber, targetView]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  // Precise Coordinates matching the High-Fidelity East Asia Aeronautical Map:
  // ViewBox: 0 0 1000 520
  // Incheon Airport (ICN): X = 158, Y = 230 (in %: X = 15.8%, Y = 44.2%)
  // Narita Airport (NRT): X = 770, Y = 275 (in %: X = 77.0%, Y = 52.9%)
  const startX = 15.8;
  const startY = 44.2;
  const endX = 77.0;
  const endY = 52.9;

  const t = progress / 100;
  // Dynamic position along the high-altitude parabolic flight curve:
  const currentX = startX + t * (endX - startX);
  // Parabolic arch across East Sea: arch peak reaches ~18% altitude
  const currentY = (startY + (endY - startY) * t) - 28 * Math.sin(t * Math.PI);
  // Flight angle calculation
  const planeAngle = progress < 20 ? 18 : progress < 55 ? 6 : progress < 85 ? 12 : 4;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#060b17] via-[#0b1329] to-[#040813] text-white transition-opacity duration-500 selection:bg-amber-400 selection:text-black ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Atmosphere: Twinkling Stars & Ambient Floating Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Twinkling Stars */}
        <div className="absolute top-6 left-[8%] w-1.5 h-1.5 bg-sky-200 rounded-full animate-ping opacity-60" />
        <div className="absolute top-14 left-[42%] w-2 h-2 bg-amber-200 rounded-full animate-pulse opacity-40" />
        <div className="absolute top-10 right-[22%] w-1.5 h-1.5 bg-rose-200 rounded-full animate-ping opacity-50" />
        <div className="absolute top-24 right-[8%] w-2 h-2 bg-yellow-200 rounded-full opacity-40" />

        {/* Ambient Drifting Clouds */}
        <div
          className="absolute top-1/4 -left-16 text-white/5 transition-transform duration-1000 ease-linear"
          style={{ transform: `translateX(${progress * 4}px)` }}
        >
          <Cloud className="w-52 h-52 fill-white/5" />
        </div>
        <div
          className="absolute top-1/2 -right-20 text-white/5 transition-transform duration-1000 ease-linear"
          style={{ transform: `translateX(-${progress * 4}px)` }}
        >
          <Cloud className="w-64 h-64 fill-white/5" />
        </div>

        {/* Radial Vignette Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-transparent to-black/80" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 text-black border-2 border-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-[0_0_20px_rgba(251,191,36,0.6)] -rotate-6">
            ✈️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-base sm:text-xl tracking-tight text-white drop-shadow-md">
                개구쟁이 도쿄 급행 에어라인
              </span>
              <span className="bg-red-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-white shadow-xs">
                BOYS-777편
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              대한민국 인천(ICN) ✈ 일본 도쿄 나리타(NRT) 직항 비행
            </p>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 shadow-lg"
        >
          <span>스킵</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Map Visualizer with Distinct, Recognizable Korea and Japan Maps */}
      <div className="relative z-10 w-full max-w-6xl px-3 sm:px-6 flex-1 flex flex-col justify-center my-2 sm:my-3">
        {/* Radar Map Card Container */}
        <div className="relative w-full h-[370px] sm:h-[430px] md:h-[470px] rounded-3xl bg-[#070e1c]/95 border-2 border-cyan-500/35 backdrop-blur-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          
          {/* Detailed Nautical Navigation Grid & Latitude/Longitude Lines */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#38bdf825_1px,transparent_1px),linear-gradient(to_bottom,#38bdf825_1px,transparent_1px)] bg-[size:36px_36px]" />

          {/* Compass Rose in Corner */}
          <div className="absolute top-4 right-4 text-cyan-400/40 flex flex-col items-center pointer-events-none">
            <Compass className="w-8 h-8 animate-[spin_30s_linear_infinite]" />
            <span className="text-[9px] font-mono font-bold mt-0.5">N 37° E 135°</span>
          </div>

          {/* Ocean Water Depths & East Sea Sea Water Label */}
          <div className="absolute left-[45%] top-[48%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-60">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] sm:text-xs font-black tracking-widest text-cyan-200 font-mono">
                동해 (EAST SEA) 상공
              </span>
            </div>
            <span className="text-[10px] text-sky-400/80 block mt-1 font-mono">
              순항 고도 10,000M · 속도 890 km/h
            </span>
          </div>

          {/* West Sea (서해 / 황해) Label */}
          <div className="absolute left-[7%] top-[50%] -translate-y-1/2 text-center pointer-events-none opacity-40">
            <span className="text-[10px] sm:text-xs font-extrabold text-sky-300 font-mono tracking-wider block">
              서해 (WEST SEA)
            </span>
          </div>

          {/* South Sea (남해) Label */}
          <div className="absolute left-[20%] top-[82%] -translate-x-1/2 text-center pointer-events-none opacity-40">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-sky-300 font-mono tracking-wider block">
              남해 (SOUTH SEA)
            </span>
          </div>

          {/* =========================================================================
              HIGH-FIDELITY SVG MAP: AUTHENTIC KOREAN PENINSULA & JAPAN ARCHIPELAGO
              Geographically calibrated contours with iconic natural landmarks:
              - Baekdu Mountain & Yalu/Tumen rivers
              - Gangwon East Coast & Pohang Homigot (Tiger's tail)
              - Busan & South Coast rias down to Haenam Ttangkkeut
              - Chungnam Taean Peninsula (prominent westward jutting)
              - Gyeonggi Bay & Incheon Airport (Yeongjongdo Island)
              - Hwanghae Jangsangot & Ongjin Peninsula
              - Jeju Island (with Mt. Halla) & Ulleungdo / Dokdo
             ========================================================================= */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 520"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Vibrant Grad for Korea (Deep Rich Navy to Luminous Electric Cyan-Blue) */}
              <linearGradient id="koreaFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#0369a1" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#075985" stopOpacity="0.95" />
              </linearGradient>

              {/* South Korea (대한민국) territorial highlight */}
              <linearGradient id="southKoreaHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
              </linearGradient>

              {/* Vibrant Grad for Japan (Rich Crimson / Cherry Red with Rose Outline) */}
              <linearGradient id="japanFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#be123c" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#e11d48" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#9f1239" stopOpacity="0.95" />
              </linearGradient>

              {/* Flight Neon Jet Beam Gradient */}
              <linearGradient id="flightJetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>

              {/* Glow Filters */}
              <filter id="neonGlowBlue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neonGlowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* -------------------------------------------------------------
                1. KOREA MAP: AUTHENTIC, ANGULAR & ICONIC KOREAN PENINSULA (각진 형태의 정밀 한반도)
               ------------------------------------------------------------- */}
            <g id="korea-authentic-peninsula">
              {/* Mainland Korean Peninsula Crisp Angular Contour (한반도 각진 고유 지형 실루엣):
                  - Mt. Baekdu sharp apex (백두산 정점)
                  - Duman River northeast border to Tumen mouth (두만강 하구 나진·선봉)
                  - Hamgyong east coast slanting to Wonsan Bay waist indent (원산만 개미허리)
                  - Gangwon East Coast straight Taebaek spine (태백산맥 동해안)
                  - Pohang Homigot (호미곶 - 각지게 튀어나온 호랑이 꼬리!)
                  - Busan southeast corner (동남단 부산)
                  - South Coast rias to Haenam Ttangkkeut (남해안 각진 땅끝마을 모서리)
                  - West coast to Taean Peninsula (서쪽으로 뚜렷하게 각지게 튀어나온 태안반도!)
                  - Gyeonggi Bay indent at Incheon (인천 경기만)
                  - Hwanghae Jangsangot beak (장산곶 각진 돌출부)
                  - Seohan Bay to Sinuiju Amnok River mouth (신의주 압록강 하구)
                  - Amnok River ascending northeast back to Mt. Baekdu
              */}
              <path
                d="
                  M 218 38
                  L 252 50
                  L 278 60
                  L 296 70
                  L 282 92
                  L 264 120
                  L 245 148
                  L 226 172
                  L 238 196
                  L 248 220
                  L 256 244
                  L 264 270
                  L 272 290
                  L 276 298
                  L 302 298
                  L 298 308
                  L 278 312
                  L 274 330
                  L 265 352
                  L 248 358
                  L 230 365
                  L 212 368
                  L 192 372
                  L 172 376
                  L 154 384
                  L 148 365
                  L 144 340
                  L 142 315
                  L 140 292
                  L 144 276
                  L 128 274
                  L 110 268
                  L 112 254
                  L 132 250
                  L 148 244
                  L 155 234
                  L 154 220
                  L 136 212
                  L 116 206
                  L 96 194
                  L 104 180
                  L 122 165
                  L 128 145
                  L 118 126
                  L 106 108
                  L 130 92
                  L 156 74
                  L 184 56
                  Z
                "
                fill="url(#koreaFill)"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinejoin="miter"
                strokeMiterlimit="4"
                filter="url(#neonGlowBlue)"
              />

              {/* South Korea (대한민국) territory highlight layer (South of DMZ) */}
              <path
                d="
                  M 148 214
                  L 154 220
                  L 155 234
                  L 148 244
                  L 132 250
                  L 112 254
                  L 110 268
                  L 128 274
                  L 144 276
                  L 140 292
                  L 142 315
                  L 144 340
                  L 148 365
                  L 154 384
                  L 172 376
                  L 192 372
                  L 212 368
                  L 230 365
                  L 248 358
                  L 265 352
                  L 274 330
                  L 278 312
                  L 298 308
                  L 302 298
                  L 276 298
                  L 272 290
                  L 264 270
                  L 256 244
                  L 248 220
                  L 238 196
                  L 192 205
                  Z
                "
                fill="url(#southKoreaHighlight)"
                stroke="#67e8f9"
                strokeWidth="1.6"
                opacity="0.85"
              />

              {/* Military Demarcation Line (DMZ / 휴전선) */}
              <path
                d="M 148 214 L 192 205 L 238 196"
                fill="none"
                stroke="#facc15"
                strokeWidth="2.4"
                strokeDasharray="5 3"
                opacity="0.9"
              />
              <text x="195" y="198" textAnchor="middle" fill="#fef08a" fontSize="7.5" fontWeight="bold">
                DMZ (휴전선 38°선)
              </text>

              {/* Taebaek Mountain Spine (태백산맥) sharp stylized ridge */}
              <path
                d="M 238 196 L 246 225 L 254 260 L 260 286 L 262 330"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                opacity="0.6"
              />

              {/* Sobaek Mountain Spine (소백산맥 지리산맥) */}
              <path
                d="M 252 255 L 235 285 L 216 320 L 202 350"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                opacity="0.4"
              />

              {/* Geographic feature markers & callouts for Korea */}
              {/* Baekdu Mountain (백두산) */}
              <g id="baekdusan-marker">
                <circle cx="218" cy="38" r="3.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.2" />
                <text x="218" y="28" textAnchor="middle" fill="#bae6fd" fontSize="8" fontWeight="extrabold">
                  백두산 (2,744m)
                </text>
              </g>

              {/* Homigot Tiger Tail (호미곶 - 각진 호랑이 꼬리 강조!) */}
              <g id="homigot-marker">
                <circle cx="302" cy="298" r="3" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                <path d="M 302 298 L 314 290" stroke="#facc15" strokeWidth="1.2" />
                <rect x="314" y="280" width="76" height="18" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1" opacity="0.9" />
                <text x="352" y="293" textAnchor="middle" fill="#fef08a" fontSize="7.5" fontWeight="black">
                  호미곶 (호랑이 꼬리)
                </text>
              </g>

              {/* Taean Peninsula (태안반도 - 각진 서해 돌출부 강조!) */}
              <g id="taean-marker">
                <circle cx="110" cy="268" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <path d="M 110 268 L 96 268" stroke="#38bdf8" strokeWidth="1" />
                <rect x="52" y="258" width="44" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                <text x="74" y="271" textAnchor="middle" fill="#7dd3fc" fontSize="7.5" fontWeight="bold">
                  태안반도
                </text>
              </g>

              {/* Haenam Ttangkkeut (땅끝마을) */}
              <g id="haenam-marker">
                <circle cx="154" cy="384" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
                <text x="154" y="396" textAnchor="middle" fill="#7dd3fc" fontSize="7.5" fontWeight="bold">
                  해남(땅끝마을)
                </text>
              </g>

              {/* Seoul Capital (서울) */}
              <g id="seoul-city">
                <circle cx="178" cy="222" r="3.8" fill="#facc15" stroke="#ffffff" strokeWidth="1.2" />
                <text x="187" y="220" textAnchor="start" fill="#fef08a" fontSize="8.5" fontWeight="900">
                  ★ 서울 (Seoul)
                </text>
              </g>

              {/* Busan City (부산) */}
              <g id="busan-city">
                <circle cx="265" cy="350" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <text x="258" y="346" textAnchor="end" fill="#e0f2fe" fontSize="7.5" fontWeight="bold">
                  부산
                </text>
              </g>

              {/* Gangneung (강릉) */}
              <circle cx="256" cy="244" r="2.2" fill="#7dd3fc" />
              <text x="252" y="247" textAnchor="end" fill="#bae6fd" fontSize="7" fontWeight="medium">
                강릉
              </text>

              {/* -------------------------------------------------------------
                  KOREAN ISLANDS: JEJU, ULLEUNGDO, DOKDO, GANGHWA, GEOJE
                 ------------------------------------------------------------- */}
              {/* Jeju Island (제주도 - 한라산 포함) */}
              <g id="jeju-island">
                <ellipse
                  cx="165"
                  cy="432"
                  rx="26"
                  ry="14"
                  transform="rotate(-5 165 432)"
                  fill="url(#koreaFill)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  filter="url(#neonGlowBlue)"
                />
                {/* Mt. Halla Peak (한라산 1,947m) */}
                <circle cx="165" cy="432" r="3.5" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                <text x="165" y="444" textAnchor="middle" fill="#e0f2fe" fontSize="8.5" fontWeight="900">
                  제주도 (한라산)
                </text>
              </g>

              {/* Ulleungdo (울릉도) */}
              <ellipse
                cx="322"
                cy="245"
                rx="6"
                ry="5"
                fill="url(#koreaFill)"
                stroke="#38bdf8"
                strokeWidth="1.8"
                filter="url(#neonGlowBlue)"
              />
              <text x="322" y="238" textAnchor="middle" fill="#7dd3fc" fontSize="8" fontWeight="bold">
                울릉도
              </text>

              {/* Dokdo (독도 - 동도, 서도) */}
              <g id="dokdo-islands">
                <ellipse cx="346" cy="254" rx="3.5" ry="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <ellipse cx="352" cy="252" rx="3.8" ry="3.2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <text x="350" y="244" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="900">
                  독도 🇰🇷
                </text>
                <text x="350" y="264" textAnchor="middle" fill="#bae6fd" fontSize="6.5" fontWeight="bold">
                  (우리 땅 독도)
                </text>
              </g>

              {/* Geoje Island (거제도) */}
              <ellipse cx="248" cy="368" rx="8" ry="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.2" />

              {/* Ganghwa Island (강화도) & Yeongjong Island (인천공항 섬) */}
              <ellipse cx="152" cy="216" rx="6" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.2" />
              <ellipse cx="158" cy="230" rx="7" ry="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

              {/* Distinct Korea Map Header Title Tag */}
              <g id="korea-country-badge">
                <rect x="95" y="16" width="135" height="26" rx="8" fill="#0b1528" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
                <text x="162" y="33" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="900" letterSpacing="0.8">
                  🇰🇷 대한민국 (한반도)
                </text>
              </g>
            </g>

            {/* -------------------------------------------------------------
                2. JAPAN MAP (Japanese Archipelago: Hokkaido, Honshu, Shikoku, Kyushu)
               ------------------------------------------------------------- */}
            <g id="japan-clear-map">
              {/* Hokkaido (홋카이도) */}
              <path
                d="
                  M 830 55
                  C 845 42, 870 35, 895 38
                  C 920 42, 945 52, 960 70
                  C 955 88, 940 102, 915 118
                  C 885 130, 860 135, 842 125
                  C 830 115, 820 95, 818 78
                  Z
                "
                fill="url(#japanFill)"
                stroke="#fb7185"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#neonGlowRed)"
              />
              <text x="885" y="85" textAnchor="middle" fill="#ffe4e6" fontSize="11" fontWeight="extrabold">
                홋카이도
              </text>

              {/* Honshu (혼슈 - Tokyo, Narita, Mt. Fuji, Osaka, Kyoto) */}
              <path
                d="
                  M 845 145
                  C 865 170, 878 200, 872 230
                  C 866 260, 845 285, 810 305
                  C 775 325, 730 345, 685 360
                  C 645 372, 615 378, 585 370
                  C 595 352, 625 342, 665 328
                  C 705 312, 742 292, 768 268
                  C 790 244, 804 205, 822 165
                  Z
                "
                fill="url(#japanFill)"
                stroke="#fb7185"
                strokeWidth="3"
                strokeLinejoin="round"
                filter="url(#neonGlowRed)"
              />

              {/* Shikoku (시코쿠) */}
              <path
                d="M 640 380 C 675 370, 705 376, 700 398 C 685 412, 648 406, 640 380 Z"
                fill="url(#japanFill)"
                stroke="#fb7185"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#neonGlowRed)"
              />
              <text x="670" y="394" textAnchor="middle" fill="#ffe4e6" fontSize="8" fontWeight="bold">
                시코쿠
              </text>

              {/* Kyushu (규슈 - Fukuoka, Nagasaki) */}
              <path
                d="M 575 375 C 600 370, 612 392, 604 422 C 594 445, 568 438, 560 412 C 555 392, 565 380, 575 375 Z"
                fill="url(#japanFill)"
                stroke="#fb7185"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#neonGlowRed)"
              />
              <text x="582" y="408" textAnchor="middle" fill="#ffe4e6" fontSize="8" fontWeight="bold">
                규슈
              </text>

              {/* Tsushima Island (대마도) */}
              <ellipse cx="535" cy="358" rx="4.5" ry="9" transform="rotate(25 535 358)" fill="#e11d48" stroke="#fb7185" strokeWidth="1" />
              <text x="535" y="344" textAnchor="middle" fill="#fda4af" fontSize="6.5" fontWeight="bold">
                대마도
              </text>

              {/* Map Title Tag for Japan */}
              <rect x="830" y="165" width="70" height="24" rx="6" fill="#0f172a" stroke="#fb7185" strokeWidth="1.5" opacity="0.9" />
              <text x="865" y="181" textAnchor="middle" fill="#fb7185" fontSize="12" fontWeight="900" letterSpacing="1">
                🇯🇵 일본
              </text>
            </g>

            {/* -------------------------------------------------------------
                3. FLIGHT TRAJECTORY ARCH (From Korea Incheon 158,230 to Narita 770,275)
               ------------------------------------------------------------- */}
            {/* Background dashed corridor */}
            <path
              d="M 158 230 Q 460 40 770 275"
              fill="none"
              stroke="#ffffff25"
              strokeWidth="4"
              strokeDasharray="9 9"
            />

            {/* Bright Neon Active Flight Arc with glow */}
            <path
              d="M 158 230 Q 460 40 770 275"
              fill="none"
              stroke="url(#flightJetGradient)"
              strokeWidth="5.5"
              strokeDasharray="1150"
              strokeDashoffset={1150 - (progress / 100) * 1150}
              strokeLinecap="round"
              filter="url(#routeGlow)"
            />
          </svg>

          {/* =========================================================================
              AIRPORT PIN 1: INCHEON AIRPORT (ICN) ON KOREA MAP
             ========================================================================= */}
          <div
            className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${startX}%`, top: `${startY}%` }}
          >
            {/* Pulsing Radar Ring & Airport Badge */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 bg-sky-400/30 rounded-full animate-ping" />
              <div className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 border-2 border-white text-white shadow-[0_0_20px_rgba(56,189,248,0.9)] flex items-center gap-1.5">
                <img src="/korea-flag.svg" alt="대한민국 국기" className="w-5 h-3.5 object-cover rounded-xs inline-block" />
                <span className="font-mono font-black text-xs sm:text-sm tracking-wider">ICN</span>
              </div>
            </div>

            {/* Marker Label Box */}
            <div className="mt-2 bg-slate-950/95 border border-sky-400/60 rounded-lg px-2.5 py-1 shadow-lg text-center backdrop-blur-md whitespace-nowrap">
              <span className="text-xs font-black text-sky-200 block">한국 지도 · 인천공항</span>
              <span className="text-[10px] text-sky-400 font-extrabold">출발지 (이륙 활주로)</span>
            </div>
          </div>

          {/* =========================================================================
              AIRPORT PIN 2: NARITA AIRPORT (NRT) ON JAPAN MAP
             ========================================================================= */}
          <div
            className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${endX}%`, top: `${endY}%` }}
          >
            {/* Animated Target Radar Ring & Airport Badge */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-18 h-18 bg-rose-500/35 rounded-full animate-ping" />
              <div className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 border-2 border-white text-white shadow-[0_0_22px_rgba(244,63,94,0.95)] flex items-center gap-1.5 animate-bounce">
                <span className="text-base sm:text-lg">🇯🇵</span>
                <span className="font-mono font-black text-xs sm:text-sm tracking-wider">NRT</span>
              </div>
            </div>

            {/* Marker Label Box */}
            <div className="mt-2 bg-slate-950/95 border border-rose-400/60 rounded-lg px-2.5 py-1 shadow-lg text-center backdrop-blur-md whitespace-nowrap">
              <span className="text-xs font-black text-rose-200 block">일본 지도 · 나리타공항</span>
              <span className="text-[10px] text-rose-400 font-extrabold">도착지 (착륙 활주로)</span>
            </div>
          </div>

          {/* =========================================================================
              LANDMARK: MT. FUJI (후지산) ON JAPAN HONSHU
             ========================================================================= */}
          <div
            className="absolute z-10 flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-90"
            style={{ left: '72%', top: '60%' }}
          >
            <span className="text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">🗻</span>
            <span className="text-[10px] font-extrabold text-amber-200 bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/20 mt-0.5 whitespace-nowrap">
              후지산 3,776m
            </span>
          </div>

          {/* =========================================================================
              FLYING AIRPLANE JET (Flies seamlessly from Korea ICN to Japan NRT)
             ========================================================================= */}
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 pointer-events-none"
            style={{
              left: `${currentX}%`,
              top: `${currentY}%`,
              transform: `translate(-50%, -50%) rotate(${planeAngle}deg)`
            }}
          >
            <div className="relative">
              {/* Jet Vapor Contrail Streams */}
              <div className="absolute -left-14 sm:-left-20 top-1/2 -translate-y-1/2 w-16 sm:w-24 h-2.5 bg-gradient-to-l from-cyan-400 via-amber-300 to-transparent rounded-full opacity-90 blur-[1px] animate-pulse" />
              <div className="absolute -left-18 sm:-left-24 top-1/2 -translate-y-1/2 w-20 sm:w-28 h-1.5 bg-white/80 rounded-full blur-[0.5px]" />

              {/* Main Animated Plane Icon */}
              <div className="relative w-15 h-15 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-white shadow-[0_0_35px_rgba(251,191,36,1)] flex items-center justify-center rotate-45 transform">
                <Plane className="w-9 h-9 sm:w-12 sm:h-12 text-slate-950 fill-slate-950 -rotate-45" />
                <span className="absolute -top-1 -right-1 text-xs sm:text-sm">💨</span>
              </div>

              {/* Ping radar effect around plane */}
              <div className="absolute -inset-2.5 rounded-full border-2 border-amber-300 animate-ping opacity-45 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Live Flight Telemetry & Progress Dashboard */}
        <div className="mt-3 sm:mt-4 bg-[#070e1c]/90 border border-white/20 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md shadow-xl">
          {/* Status Label & Flight Percentage */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-amber-400 text-black shadow-xs shrink-0">
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

          {/* Progress Bar Container */}
          <div className="w-full h-3 sm:h-3.5 bg-slate-950 rounded-full overflow-hidden border border-white/20 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_16px_rgba(251,191,36,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Flight Details Badges */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-[11px] text-slate-300">
            <div className="bg-slate-950/70 rounded-xl py-1.5 px-1.5 sm:px-2 border border-white/10">
              <span className="text-slate-400 block text-[9px]">지도 항로</span>
              <span className="font-mono font-bold text-sky-300">🇰🇷 대한민국 ➔ 🇯🇵 일본</span>
            </div>
            <div className="bg-slate-950/70 rounded-xl py-1.5 px-1.5 sm:px-2 border border-white/10">
              <span className="text-slate-400 block text-[9px]">비행 거리</span>
              <span className="font-mono font-bold text-white">약 1,260 km</span>
            </div>
            <div className="bg-slate-950/70 rounded-xl py-1.5 px-1.5 sm:px-2 border border-white/10">
              <span className="text-slate-400 block text-[9px]">탑승 크루</span>
              <span className="font-bold text-amber-300">개구쟁이 4총사 ⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Tip */}
      <footer className="relative z-10 w-full max-w-6xl px-4 sm:px-6 pb-4 sm:pb-6 text-center">
        <p className="text-xs text-slate-400 font-medium">
          비행 완료 시 개구쟁이들의 일본 도쿄 5박 6일 구글 동선 및 일정표로 자동 전환됩니다. 🧳✨
        </p>
      </footer>
    </div>
  );
};
