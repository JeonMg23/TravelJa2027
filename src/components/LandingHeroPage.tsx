import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  MapPin,
  Utensils,
  Camera,
  Navigation,
  Compass,
  Smile,
  Gamepad2,
  Skull,
  Award,
  AlertTriangle,
  Plane,
  ChevronRight,
  TrendingUp,
  Volume2,
  HelpCircle,
  Laugh,
  Clock,
  CheckSquare
} from 'lucide-react';
import { TripDay } from '../types/travel';

interface LandingHeroPageProps {
  days: TripDay[];
  onStartTrip: (dayNumber?: number) => void;
  onOpenMap: () => void;
  onOpenChecklist?: () => void;
}

// Playful quotes for teen boys
const BOY_SURVIVAL_TIPS = [
  { icon: '🔋', title: '보조배터리 필수', desc: '사진 찍다 배터리 나가면 길 잃고 미아 됨. 무조건 만충!' },
  { icon: '🍜', title: '라멘 국물까지 원샷 금지', desc: '염분 폭발해서 다음 날 아침 얼굴 두 배 됨 주의' },
  { icon: '👟', title: '발바닥 파스 챙겨라', desc: '하루 2만 보 걷고 밤에 다리 털릴 예정. 슬리퍼 신고 오지 마라' },
  { icon: '💴', title: '가챠(뽑기) 탕진 주의', desc: '아키하바라에서 100엔 동전 넣다 보면 지갑 탈탈 털림' }
];

// Fun member roles
const GANG_CHARACTERS = [
  { emoji: '😎', role: '인간 네비게이터', quote: '“나만 따라와라 (사실 구글맵 3초마다 봄)”', bg: 'bg-amber-100 border-amber-400 text-amber-950' },
  { emoji: '🍖', role: '먹방 폭격기', quote: '“밥 먹은 지 1시간 됐는데 또 편의점 가자고?”', bg: 'bg-orange-100 border-orange-400 text-orange-950' },
  { emoji: '📸', role: '릴스/셀카 중독자', quote: '“야 잠깐 멈춰봐 폼 나게 한 컷 찍어줌”', bg: 'bg-emerald-100 border-emerald-400 text-emerald-950' },
  { emoji: '😴', role: '아침 기상 실패자', quote: '“5분만 더... 오늘 일정 하나 빼면 안 됨?”', bg: 'bg-purple-100 border-purple-400 text-purple-950' }
];

export const LandingHeroPage: React.FC<LandingHeroPageProps> = ({
  days,
  onStartTrip,
  onOpenMap,
  onOpenChecklist
}) => {
  const [funSoundPlayed, setFunSoundPlayed] = useState<string | null>(null);

  // Departure date: 2027년 1월 13일 09:00:00 (KST / JST)
  const DEPARTURE_TIMESTAMP = new Date('2027-01-13T09:00:00+09:00').getTime();
  const TRIP_END_TIMESTAMP = new Date('2027-01-18T23:59:59+09:00').getTime();

  const calculateDDay = () => {
    const now = Date.now();
    const diffMs = DEPARTURE_TIMESTAMP - now;

    if (diffMs <= 0) {
      if (now <= TRIP_END_TIMESTAMP) {
        return {
          dDayText: 'D-DAY!',
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          status: 'ongoing' as const,
          label: '🎉 D-DAY! 오늘 일본 도쿄 대모험이 시작되었습니다! ✈️🇯🇵'
        };
      }
      return {
        dDayText: '완료 ✨',
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: 'finished' as const,
        label: '✨ 5박 6일 도쿄 여행 일정이 완료되었습니다!'
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return {
      dDayText: `D-${d}`,
      days: d,
      hours: h,
      minutes: m,
      seconds: s,
      status: 'upcoming' as const,
      label: `${d}일 ${h}시간 ${m}분 ${s}초 후 인천공항에서 도쿄로 출발합니다!`
    };
  };

  const [dDay, setDDay] = useState(calculateDDay);

  useEffect(() => {
    const timer = setInterval(() => {
      setDDay(calculateDDay());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerFunReaction = (text: string) => {
    setFunSoundPlayed(text);
    setTimeout(() => setFunSoundPlayed(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-slate-900 flex flex-col font-sans selection:bg-amber-300 selection:text-black relative overflow-x-hidden">
      {/* Playful Floating Sticker Toast */}
      {funSoundPlayed && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-black text-amber-300 px-5 py-3 rounded-2xl font-black text-sm border-2 border-amber-400 shadow-[4px_4px_0px_#f59e0b] flex items-center gap-2">
          <span>📢</span>
          <span>{funSoundPlayed}</span>
        </div>
      )}

      {/* Top Street Style Nav */}
      <header className="border-b-4 border-black bg-amber-300 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-[0_4px_0_#000]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-black text-amber-300 rounded-2xl border-2 border-black flex items-center justify-center font-black text-2xl shadow-[3px_3px_0_#fff] rotate-[-4deg] hover:rotate-12 transition-transform cursor-pointer">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-black font-sans">
                  개구쟁이들의 일본여행
                </span>
                <span className="bg-red-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0_#000] rotate-3">
                  우당탕탕!
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:block">
                개구쟁이 친구들의 도쿄 5박 6일 좌충우돌 생존기
              </span>
            </div>
          </div>

          {/* Quick Actions & Header D-Day */}
          <div className="flex items-center gap-2.5">
            {/* Header D-Day Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black text-amber-300 border-2 border-black shadow-[2px_2px_0_#fff] text-xs font-black">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>출발 {dDay.dDayText}</span>
              <span className="text-slate-500">|</span>
              <span className="tabular-nums text-white font-mono">{dDay.days}일 {String(dDay.hours).padStart(2, '0')}시간 남음</span>
            </div>

            <button
              onClick={() => onOpenMap()}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-black text-black bg-white hover:bg-slate-100 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>동선 지도</span>
            </button>
            <button
              onClick={() => onStartTrip(1)}
              className="px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-black text-black bg-[#4ade80] hover:bg-[#22c55e] rounded-xl border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🚀 출발하기!</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Comic / Boyish Street Graffiti Style */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-20 px-4 sm:px-6 border-b-4 border-black bg-gradient-to-b from-[#FFFDF0] via-[#FEF3C7] to-[#FDE68A] overflow-hidden">
        {/* Background Comic Halftone & Doodles */}
        <div className="absolute top-6 left-8 text-4xl opacity-30 select-none rotate-12">💥</div>
        <div className="absolute top-20 right-12 text-5xl opacity-30 select-none -rotate-12">🔥</div>
        <div className="absolute bottom-10 left-16 text-4xl opacity-25 select-none -rotate-6">👾</div>
        <div className="absolute top-1/2 right-6 text-4xl opacity-25 select-none rotate-45">🍜</div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-amber-300 text-xs sm:text-sm font-black border-2 border-amber-400 shadow-[3px_3px_0_#d97706] mb-6 rotate-[-1deg] hover:rotate-1 transition-transform">
            <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>2027.01.13 ~ 01.18 · 개구쟁이 소년들과 엄마들의 도쿄 원정대!</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-black tracking-tight leading-[1.15] mb-6">
            개구쟁이들의 <br className="sm:hidden" />
            <span className="relative inline-block mx-1">
              <span className="relative z-10 text-amber-500 [-webkit-text-stroke:2px_black] sm:[-webkit-text-stroke:3px_black] drop-shadow-[4px_4px_0_#000]">
                우당탕탕!
              </span>
            </span>
            <br />
            일본여행 대모험
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl font-bold text-slate-800 max-w-2xl mx-auto mb-7 leading-relaxed">
            길 잃어도 괜찮고 라멘 국물 튀어도 신난다! <br />
            아키하바라 피규어부터 시부야 스크램블, 신주쿠 야경까지 <br className="hidden sm:inline" />
            <span className="bg-amber-300 px-1 border-b-2 border-black">구글맵 동선 + 추천 먹방</span> 완벽 장착 완료!
          </p>

          {/* D-DAY Live Countdown Box */}
          <div className="max-w-xl mx-auto mb-9 bg-white/95 backdrop-blur-xs rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] p-4 sm:p-5 relative overflow-hidden">
            {/* Top header row */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-black/10">
              <div className="flex items-center gap-2 sm:gap-2.5 text-left">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF4757] text-white flex items-center justify-center font-black text-lg border-2 border-black shadow-[2px_2px_0_#000] animate-pulse shrink-0">
                  ✈️
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-rose-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>여행 출발 D-DAY 카운트다운</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900">
                    2027.01.13 ~ 01.18 · 도쿄 5박 6일
                  </div>
                </div>
              </div>
              <div className="bg-[#FF4757] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl font-black text-base sm:text-xl border-2 border-black shadow-[2px_2px_0_#000] rotate-2 shrink-0">
                {dDay.dDayText}
              </div>
            </div>

            {/* 4 Digital Timer Cards */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-[#FEF3C7] p-2 sm:p-3 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-black tabular-nums tracking-tight font-mono">
                  {dDay.days}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-slate-700 mt-0.5">남은 일(Days)</span>
              </div>
              <div className="bg-[#E0F2FE] p-2 sm:p-3 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-blue-700 tabular-nums tracking-tight font-mono">
                  {String(dDay.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-slate-700 mt-0.5">시간(Hours)</span>
              </div>
              <div className="bg-[#DCFCE7] p-2 sm:p-3 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-emerald-700 tabular-nums tracking-tight font-mono">
                  {String(dDay.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-slate-700 mt-0.5">분(Mins)</span>
              </div>
              <div className="bg-[#FFE4E6] p-2 sm:p-3 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-rose-600 tabular-nums tracking-tight font-mono animate-pulse">
                  {String(dDay.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-slate-700 mt-0.5">초(Secs)</span>
              </div>
            </div>

            {/* Subtext info */}
            <div className="mt-3 text-center text-[11px] sm:text-xs font-bold text-slate-700 bg-amber-50 py-1.5 px-2 rounded-lg border border-amber-200">
              {dDay.label}
            </div>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
            <button
              onClick={() => onStartTrip(1)}
              className="w-full sm:w-auto px-8 py-4 bg-[#FF4757] hover:bg-[#ff3838] text-white font-black text-lg rounded-2xl border-4 border-black shadow-[5px_5px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Gamepad2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>원정 시작하기 (Day 1)</span>
              <ArrowRight className="w-6 h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenMap()}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-100 text-black font-black text-base rounded-2xl border-4 border-black shadow-[5px_5px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-5 h-5 text-blue-600" />
              <span>구글 동선 맵 열기</span>
            </button>
          </div>

          {/* Fun stats tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t-2 border-dashed border-black/40">
            <div className="bg-white p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]">
              <div className="text-2xl sm:text-3xl font-black text-rose-600">{dDay.dDayText}</div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">⏳ 출발 카운트다운</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]">
              <div className="text-2xl sm:text-3xl font-black text-black">5박 6일</div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">🔥 끝장나는 일정</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]">
              <div className="text-2xl sm:text-3xl font-black text-blue-600">24+ 곳</div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">🎮 핫플 & 맛집 폭격</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]">
              <div className="text-2xl sm:text-3xl font-black text-amber-500">100%</div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">🗺️ 길치 구출 구글맵</div>
            </div>
          </div>
        </div>
      </section>

      {/* Boys Crew Types & Survival Rules Section */}
      <section className="py-14 px-4 sm:px-6 bg-[#E0F2FE] border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-md border border-black shadow-[2px_2px_0_#000] -rotate-2 mb-2">
              CREW TYPES
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              우리 원정대 유형 분석! (너는 누구냐?)
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
              친구들을 눌러서 한마디 외쳐보세요!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GANG_CHARACTERS.map((char, i) => (
              <button
                key={i}
                onClick={() => triggerFunReaction(`${char.role}: ${char.quote}`)}
                className={`${char.bg} p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0_#000] hover:scale-105 active:scale-95 transition-all text-left flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  <div className="text-4xl mb-3">{char.emoji}</div>
                  <div className="font-black text-base text-black mb-1">{char.role}</div>
                  <div className="text-xs font-bold text-slate-700 leading-snug">
                    {char.quote}
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-black/20 text-[11px] font-black text-slate-900 flex items-center justify-between">
                  <span>외치기 📢</span>
                  <span>CLICK!</span>
                </div>
              </button>
            ))}
          </div>

          {/* Survival Rules */}
          <div className="mt-12 bg-white rounded-2xl border-3 border-black p-6 sm:p-8 shadow-[6px_6px_0_#000]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-black">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-black">
                  도쿄 원정대 절대 생존 4대 수칙
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  이것만 지키면 경찰서 갈 일도 없고 친구랑 멱살 잡을 일도 없다!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BOY_SURVIVAL_TIPS.map((tip, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]">
                  <div className="text-2xl mb-2">{tip.icon}</div>
                  <div className="text-sm font-black text-black mb-1">{tip.title}</div>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>

            {/* Travel Essentials Checklist Banner */}
            {onOpenChecklist && (
              <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50/80 p-4 sm:p-5 rounded-2xl border-2 border-black shadow-[3px_3px_0_#000]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎒</span>
                  <div>
                    <div className="text-sm font-black text-black">
                      여행 필수 준비물 챙겼어? (속옷, 양말, 칫솔, 비상약, 모자, 썬글라스 등)
                    </div>
                    <div className="text-xs text-slate-700 font-bold mt-0.5">
                      놓치기 쉬운 36가지 필수품을 카테고리별로 꼼꼼하게 체크해 보세요!
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenChecklist}
                  className="w-full sm:w-auto px-5 py-2.5 bg-black hover:bg-slate-800 text-amber-300 font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_#f59e0b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <CheckSquare className="w-4 h-4 text-amber-300" />
                  <span>준비물 체크리스트 열기</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6-Day Comic Road Grid */}
      <section className="py-14 px-4 sm:px-6 bg-[#FEF08A] border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-block bg-red-500 text-white font-black text-xs px-3 py-1 rounded-md border border-black shadow-[2px_2px_0_#000] rotate-1 mb-2">
                DAILY MISSION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black">
                5박 6일 일자별 공략 코스!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                원하는 날짜 카드를 누르면 그날의 작전 지도로 직행합니다.
              </p>
            </div>
            <button
              onClick={() => onStartTrip(1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-amber-300 font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[3px_3px_0_#f59e0b] hover:bg-slate-900 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>전체 일정 타임라인으로 바로가기</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day) => {
              const spotNames = day.spots.map((s) => s.name).join(' → ');

              // Fun badges per day
              const dayBadge = 
                day.dayNumber === 1 ? '🛬 도쿄 상륙 작전' :
                day.dayNumber === 2 ? '🛍️ 쇼핑 & 인파 생존' :
                day.dayNumber === 3 ? '🗻 후지산 절경 & 도쿄역' :
                day.dayNumber === 4 ? '🧙 마법 스튜디오 & 시부야' :
                day.dayNumber === 5 ? '🍜 먹방 & 힐링(?)' : '🛫 최후의 쇼핑 후 복귀';

              return (
                <div
                  key={day.dayNumber}
                  onClick={() => onStartTrip(day.dayNumber)}
                  className="bg-white border-3 border-black rounded-2xl p-5 shadow-[5px_5px_0_#000] hover:shadow-[7px_7px_0_#000] hover:-translate-y-1 hover:translate-x-0.5 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-lg bg-black text-amber-300 text-xs font-black border border-black shadow-[2px_2px_0_#fff]">
                        DAY {day.dayNumber}
                      </span>
                      <span className="text-xs font-black text-slate-500">
                        {day.fullDate.split(' ')[0]}
                      </span>
                    </div>

                    <div className="inline-block text-[11px] font-black text-red-600 bg-red-100 border border-red-300 rounded px-2 py-0.5 mb-2">
                      {dayBadge}
                    </div>

                    {/* Theme */}
                    <h3 className="text-base font-black text-black mb-1 group-hover:text-blue-600 transition-colors">
                      {day.theme}
                    </h3>

                    {/* Description */}
                    <p className="text-xs font-bold text-slate-600 mb-4 line-clamp-2">
                      {day.description}
                    </p>

                    {/* Spots list */}
                    <div className="bg-[#FFFDF0] p-3 rounded-xl border-2 border-black/80 mb-4">
                      <div className="text-[11px] font-black text-slate-700 flex items-center gap-1 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>타격 목표 ({day.spots.length}곳)</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                        {spotNames}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-xs font-black text-blue-600 group-hover:text-blue-800">
                    <span>Day {day.dayNumber} 코스 파헤치기 ⚡</span>
                    <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Secret Weapon Features */}
      <section className="py-14 px-4 sm:px-6 bg-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-block bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-md border border-black shadow-[2px_2px_0_#000] -rotate-1 mb-2">
              GEAR & SKILLS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              개구쟁이들을 위한 특수 무기 기능 4종
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 border-3 border-black shadow-[4px_4px_0_#000]">
              <div className="w-10 h-10 rounded-xl bg-amber-300 border-2 border-black flex items-center justify-center font-black text-xl mb-3 shadow-[2px_2px_0_#000]">
                🗺️
              </div>
              <h3 className="font-black text-base text-black mb-1">길치 탈출 파란 동선선</h3>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                1, 2, 3 순서대로 점 찍고 선으로 이어줌. 구글 길찾기 버튼 누르면 전철 환승까지 다 나옴!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-50 border-3 border-black shadow-[4px_4px_0_#000]">
              <div className="w-10 h-10 rounded-xl bg-orange-300 border-2 border-black flex items-center justify-center font-black text-xl mb-3 shadow-[2px_2px_0_#000]">
                🍜
              </div>
              <h3 className="font-black text-base text-black mb-1">원클릭 맛집 추가 & 삭제</h3>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                배고플 때 맛집 클릭 시 동선에 즉시 추가! 다시 누르면 쏙 삭제되는 스마트 토글!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border-3 border-black shadow-[4px_4px_0_#000]">
              <div className="w-10 h-10 rounded-xl bg-sky-300 border-2 border-black flex items-center justify-center font-black text-xl mb-3 shadow-[2px_2px_0_#000]">
                ☔
              </div>
              <h3 className="font-black text-base text-black mb-1">비 올 때 실내 대피령</h3>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                도쿄 날씨 실시간 연동. 비 오면 우산 쓰고 덜덜 떨지 말고 대형 몰·아케이드로 경로 자동 변경!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border-3 border-black shadow-[4px_4px_0_#000]">
              <div className="w-10 h-10 rounded-xl bg-emerald-300 border-2 border-black flex items-center justify-center font-black text-xl mb-3 shadow-[2px_2px_0_#000]">
                💸
              </div>
              <h3 className="font-black text-base text-black mb-1">싸움 방지 N빵 계산기</h3>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                누가 편의점 결제했는지 바로 기록. 엔화/원화 자동 환산해서 1원도 안 틀리고 정산!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-black text-white text-center px-4 relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-5xl mb-3 animate-bounce">⚡🎌🚀</div>
          <h2 className="text-2xl sm:text-4xl font-black text-amber-300 mb-3 tracking-tight">
            준비됐나? 개구쟁이들 도쿄로 출발!
          </h2>
          <p className="text-xs sm:text-base font-bold text-slate-300 mb-8 max-w-lg mx-auto">
            망설일 시간 없다. 지금 바로 일정 확인하고 친구들한테 단톡방 링크 뿌려라!
          </p>
          <button
            onClick={() => onStartTrip(1)}
            className="px-8 sm:px-10 py-4 bg-amber-400 hover:bg-amber-300 text-black font-black text-lg rounded-2xl border-4 border-white shadow-[6px_6px_0_#ff4757] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all inline-flex items-center gap-3 cursor-pointer"
          >
            <span>도쿄 1일차 바로 시작하기!</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </section>

      {/* Street Footer */}
      <footer className="py-5 bg-amber-400 border-t-4 border-black text-center text-xs font-black text-black">
        <p>⚡ 개구쟁이들의 일본여행 (우당탕탕 도쿄 5박 6일 원정대) · 구글 지도 & 맛집 연동 스마트 플래너 ⚡</p>
      </footer>
    </div>
  );
};
