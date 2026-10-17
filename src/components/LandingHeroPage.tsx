import React, { useState, useEffect } from 'react';
import {
  Zap,
  ArrowRight,
  MapPin,
  Navigation,
  ChevronRight,
  Clock,
  CheckSquare,
  Smartphone,
  Users
} from 'lucide-react';
import { TripDay } from '../types/travel';
import { MobileInstallModal } from './MobileInstallModal';
import { ProfileEditModal } from './ProfileEditModal';
import { getCharacterAvatarById } from '../data/characterAvatars';
import { KakaoAuthUser } from '../types/auth';
import tokyoTowerDesktopImg from '../assets/images/tokyo_tower_night_1792063728180.jpg';
import tokyoTowerMobileImg from '../assets/images/tokyo_tower_mobile_1792145945594.jpg';

interface LandingHeroPageProps {
  days: TripDay[];
  onStartTrip: (dayNumber?: number) => void;
  onOpenMap: () => void;
  onOpenChecklist?: () => void;
  currentUser?: KakaoAuthUser | null;
  onOpenLogin?: () => void;
  onSelectUser?: (user: KakaoAuthUser) => void;
  onReplayIntro?: () => void;
}

// Playful quotes for teen boys
const BOY_SURVIVAL_TIPS = [
  { icon: '🔋', title: '보조배터리 필수', desc: '사진 찍다 배터리 나가면 길 잃고 미아 됨. 무조건 만충!' },
  { icon: '🍜', title: '라멘 국물 원샷 금지', desc: '염분 폭발해서 다음 날 아침 얼굴 두 배 됨 주의' },
  { icon: '👟', title: '발바닥 파스 챙겨라', desc: '하루 2만 보 걷고 밤에 다리 털릴 예정. 슬리퍼 신고 오지 마라' },
  { icon: '💴', title: '가챠(뽑기) 탕진 주의', desc: '아키하바라에서 100엔 동전 넣다 보면 지갑 탈탈 털림' }
];

// Fun member roles
const GANG_CHARACTERS = [
  { emoji: '😎', role: '인간 네비게이터', quote: '“나만 따라와라 (사실 구글맵 3초마다 봄)”', accent: 'from-amber-500/20 to-black border-amber-500/40 text-amber-200' },
  { emoji: '🍖', role: '먹방 폭격기', quote: '“밥 먹은 지 1시간 됐는데 또 편의점 가자고?”', accent: 'from-orange-500/20 to-black border-orange-500/40 text-orange-200' },
  { emoji: '📸', role: '릴스/셀카 중독자', quote: '“야 잠깐 멈춰봐 폼 나게 한 컷 찍어줌”', accent: 'from-emerald-500/20 to-black border-emerald-500/40 text-emerald-200' },
  { emoji: '😴', role: '아침 기상 실패자', quote: '“5분만 더... 오늘 일정 하나 빼면 안 됨?”', accent: 'from-purple-500/20 to-black border-purple-500/40 text-purple-200' }
];

export const LandingHeroPage: React.FC<LandingHeroPageProps> = ({
  days,
  onStartTrip,
  onOpenMap,
  onOpenChecklist,
  currentUser,
  onOpenLogin,
  onSelectUser,
  onReplayIntro
}) => {
  const [funSoundPlayed, setFunSoundPlayed] = useState<string | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const currentAvatar = getCharacterAvatarById(currentUser?.avatarId, currentUser?.id);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          label: '🎉 오늘 일본 도쿄 대모험이 시작되었습니다! ✈️🇯🇵'
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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-yellow-400 selection:text-black relative overflow-x-hidden">
      {/* Toast Notification */}
      {funSoundPlayed && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-zinc-900/95 text-yellow-300 px-5 py-3 rounded-2xl font-bold text-sm border border-yellow-400/50 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center gap-2">
          <span>📢</span>
          <span>{funSoundPlayed}</span>
        </div>
      )}

      {/* 1. Top Cinematic Navigation Bar (넷플릭스 스타일 글래스모피즘 헤더) */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-2xl border-b border-white/10 px-3 sm:px-8 py-2.5 sm:py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3">
          {/* Logo & Identity (인트로의 번개 볼트 & 도쿄원정대 폰트 연결) */}
          <div className="flex items-center justify-between gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              {/* Black background golden lightning bolt icon button (아래 엠블럼과 동일한 블랙 바탕 + 골든 번개볼트) */}
              <button
                onClick={() => setIsMobileModalOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black/70 border border-yellow-400/50 backdrop-blur-xl flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
                title="스마트폰 홈화면 앱 설치 & 바로가기"
              >
                <svg
                  className="w-full h-full drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="headerYellowBoltGrad" x1="0%" y1="0%" x2="70%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#FEF08A" />
                      <stop offset="65%" stopColor="#FACC15" />
                      <stop offset="100%" stopColor="#EAB308" />
                    </linearGradient>
                    <filter id="headerBoltFilter" x="-20%" y="-20%" width="140%" height="140%">
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
                    fill="url(#headerYellowBoltGrad)"
                    stroke="#FFFBEB"
                    strokeWidth="10"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter="url(#headerBoltFilter)"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-base sm:text-xl font-black tracking-tight text-white whitespace-nowrap"
                  style={{ textShadow: '0 0 15px rgba(255,255,255,0.8)' }}
                >
                  도쿄 원정대 <span className="text-yellow-400 font-mono">2027</span>
                </span>
                <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 shadow-[0_0_10px_rgba(250,204,21,0.25)]">
                  우당탕탕!
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pt-0.5 md:pt-0">
            {/* Logged in Profile Badge (클릭 시 프로필 닉네임 및 캐릭터 이미지 변경 모달 오픈) */}
            <button
              onClick={() => setIsProfileEditOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl border border-yellow-400/40 backdrop-blur-md transition-all cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(250,204,21,0.18)] group"
              title={
                currentUser
                  ? `${currentUser.nickname} 프로필 (클릭하여 닉네임 및 캐릭터 변경)`
                  : '프로필 닉네임 및 캐릭터 설정'
              }
            >
              {currentUser ? (
                <>
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentAvatar.bgGradient} p-0.5 border border-yellow-300/70 flex items-center justify-center overflow-hidden shrink-0 shadow-sm`}
                  >
                    {currentUser.profileImageUrl ? (
                      <img
                        src={currentUser.profileImageUrl}
                        alt={currentUser.nickname}
                        className="w-full h-full object-cover rounded-md"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      currentAvatar.renderSvg('w-full h-full')
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="truncate max-w-[100px] sm:max-w-[130px] text-yellow-300 font-bold group-hover:text-yellow-200 text-xs">
                      {currentUser.nickname}
                    </span>
                    <span className="text-[9px] text-slate-300 font-medium">
                      {currentAvatar.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-black font-extrabold bg-yellow-400 group-hover:bg-yellow-300 px-1.5 py-0.5 rounded-md transition-colors">
                    변경 ✏️
                  </span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-yellow-400" />
                  <span>프로필 선택 · 꾸미기</span>
                </>
              )}
            </button>

            {/* App Install Button */}
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
              <span>앱 설치</span>
            </button>

            {/* Desktop D-Day Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-amber-300">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>출발 {dDay.dDayText}</span>
              <span className="text-white/20">|</span>
              <span className="text-white">{dDay.days}일 {String(dDay.hours).padStart(2, '0')}시간 남음</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Tokyo Night Backdrop + Golden Lightning (인트로 & 로그인 페이지와 일치하는 시네마틱 밤하늘) */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 overflow-hidden border-b border-white/10">
        {/* Full-bleed Tokyo Tower Night Backdrop (로그인 화면과 동일한 도쿄 타워 야경 & 비네트) */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-1000 ease-out scale-100 filter brightness-95"
          style={{
            backgroundImage: `url(${isMobile ? tokyoTowerMobileImg : tokyoTowerDesktopImg})`,
            backgroundPosition: isMobile ? 'center 15%' : 'center center'
          }}
        />

        {/* Cinematic Netflix Vignettes matching LoginPage */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/80 to-transparent" />

        {/* Golden Central Radiant Aura matching Intro Page */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Glowing Golden Lightning Bolt Emblem (인트로의 시그니처 황금 번개와 일치) */}
          <div className="flex justify-center mb-6">
            <div className="relative inline-flex items-center justify-center p-3 rounded-3xl bg-black/50 border border-yellow-400/40 backdrop-blur-xl shadow-[0_0_35px_rgba(250,204,21,0.4)] hover:scale-105 transition-transform duration-300">
              <svg
                className="w-14 h-14 sm:w-18 sm:h-18 drop-shadow-[0_0_24px_rgba(250,204,21,0.95)]"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="heroYellowBoltGrad" x1="0%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#FEF08A" />
                    <stop offset="65%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#EAB308" />
                  </linearGradient>
                  <filter id="heroBoltFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#FACC15" floodOpacity="0.9" />
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
                  fill="url(#heroYellowBoltGrad)"
                  stroke="#FFFBEB"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter="url(#heroBoltFilter)"
                />
              </svg>
            </div>
          </div>

          {/* Expedition Date & Motto Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-yellow-400/50 text-yellow-300 text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(250,204,21,0.25)] backdrop-blur-md mb-6">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
            <span>2027.01.13 ~ 01.18 · 개구쟁이 소년들과 엄마들의 도쿄 대원정</span>
          </div>

          {/* Main Headline (인트로의 별빛 타이포그래피 계승) */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] mb-5 select-none"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(250,204,21,0.4)'
            }}
          >
            도쿄 원정대 <span className="font-mono text-yellow-400">2027</span> <br />
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(250,204,21,0.55)]">
              우당탕탕! 일본 대모험
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg font-medium text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-md">
            길 잃어도 신나고 라멘 국물 튀어도 즐겁다! <br />
            아사쿠사부터 디즈니씨, 해리포터 스튜디오, 시부야·신주쿠 야경까지 <br className="hidden sm:inline" />
            <span className="text-yellow-300 font-bold border-b border-yellow-400/50">최적화 구글맵 동선 + 실시간 맛집 가이드</span> 완벽 장착 완료!
          </p>

          {/* D-DAY Flight Mission Countdown Terminal (다크 글래스모피즘 HUD) */}
          <div className="max-w-xl mx-auto mb-10 bg-zinc-950/80 backdrop-blur-2xl rounded-3xl border border-white/15 p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-2xl bg-black/85 border border-yellow-400/50 backdrop-blur-xl flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(250,204,21,0.4)] shrink-0">
                  <svg
                    className="w-full h-full drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="ddayYellowBoltGrad" x1="0%" y1="0%" x2="70%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#FEF08A" />
                        <stop offset="65%" stopColor="#FACC15" />
                        <stop offset="100%" stopColor="#EAB308" />
                      </linearGradient>
                      <filter id="ddayBoltFilter" x="-20%" y="-20%" width="140%" height="140%">
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
                      fill="url(#ddayYellowBoltGrad)"
                      stroke="#FFFBEB"
                      strokeWidth="10"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter="url(#ddayBoltFilter)"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                    <span>도쿄 원정 출발 D-DAY 카운트다운</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    2027.01.13 (수) 09:00 인천 ✈️ 11:30 나리타 착륙
                  </div>
                </div>
              </div>
              <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-xl font-black text-base sm:text-xl shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                {dDay.dDayText}
              </div>
            </div>

            {/* 4 Digital Timer Cards */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
              <div className="bg-white/5 border border-white/10 p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-yellow-300 tabular-nums font-mono">
                  {dDay.days}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1">남은 일(Days)</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-sky-400 tabular-nums font-mono">
                  {String(dDay.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1">시간(Hours)</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-emerald-400 tabular-nums font-mono">
                  {String(dDay.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1">분(Mins)</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-rose-400 tabular-nums font-mono animate-pulse">
                  {String(dDay.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1">초(Secs)</span>
              </div>
            </div>

            {/* Departure Info Banner */}
            <div className="mt-4 text-center text-xs font-medium text-slate-300 bg-white/5 py-2 px-3 rounded-xl border border-white/10">
              {dDay.label}
            </div>
          </div>

          {/* 5. Main Action Buttons (초대형 골든 액션 버튼) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-12">
            <button
              onClick={() => onStartTrip(1)}
              className="w-full sm:w-auto px-9 py-4.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-lg rounded-2xl shadow-[0_0_35px_rgba(250,204,21,0.5)] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Zap className="w-5 h-5 fill-black group-hover:rotate-12 transition-transform" />
              <span>원정 시작하기 (Day 1)</span>
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => onOpenMap()}
              className="w-full sm:w-auto px-7 py-4.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-2xl border border-white/20 backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Navigation className="w-5 h-5 text-sky-400" />
              <span>구글 동선 지도 열기</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto pt-6 border-t border-white/10">
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono">{dDay.dDayText}</div>
              <div className="text-xs font-medium text-slate-400 mt-1">⏳ 출발 카운트다운</div>
            </div>
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">5박 6일</div>
              <div className="text-xs font-medium text-slate-400 mt-1">🔥 끝장나는 일정</div>
            </div>
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">24+ 곳</div>
              <div className="text-xs font-medium text-slate-400 mt-1">🎮 핫플 & 맛집 폭격</div>
            </div>
            <div className="bg-zinc-950/70 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs font-medium text-slate-400 mt-1">🗺️ 길치 탈출 구글맵</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 5박 6일 일자별 공략 코스 (넷플릭스 에피소드 스타일 카드) */}
      <section className="py-16 px-4 sm:px-6 bg-zinc-950 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-block bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold text-xs px-3.5 py-1 rounded-full mb-2.5 shadow-[0_0_12px_rgba(250,204,21,0.2)]">
                DAILY MISSION · EPISODES
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                5박 6일 일자별 공략 코스
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                원하는 날짜 카드를 누르면 그날의 작전 지도로 직행합니다.
              </p>
            </div>
            <button
              onClick={() => onStartTrip(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-yellow-300 font-bold text-xs sm:text-sm rounded-xl border border-white/15 transition-all self-start sm:self-auto cursor-pointer"
            >
              <span>전체 일정 타임라인으로 바로가기</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {days.map((day) => {
              const spotNames = day.spots.map((s) => s.name).join(' → ');

              const dayBadge =
                day.dayNumber === 1 ? '🛬 도쿄 상륙 작전' :
                day.dayNumber === 2 ? '🛍️ 쇼핑 & 인파 생존' :
                day.dayNumber === 3 ? '🗻 후지산 절경 & 도쿄역' :
                day.dayNumber === 4 ? '🧙 마법 스튜디오 & 시부야' :
                day.dayNumber === 5 ? '🍜 먹방 & 롯폰기 힐스' : '🛫 최후의 쇼핑 후 복귀';

              return (
                <div
                  key={day.dayNumber}
                  onClick={() => onStartTrip(day.dayNumber)}
                  className="bg-black/80 hover:bg-zinc-900 border border-white/10 hover:border-yellow-400/50 rounded-3xl p-5 sm:p-6 shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group backdrop-blur-md"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-lg bg-yellow-400 text-black text-xs font-black shadow-[0_0_12px_rgba(250,204,21,0.4)]">
                        DAY {day.dayNumber}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-400">
                        {day.fullDate.split(' ')[0]}
                      </span>
                    </div>

                    <div className="inline-block text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-md px-2 py-0.5 mb-2.5">
                      {dayBadge}
                    </div>

                    {/* Theme */}
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                      {day.theme}
                    </h3>

                    {/* Description */}
                    <p className="text-xs font-medium text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {day.description}
                    </p>

                    {/* Spots list */}
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 mb-4">
                      <div className="text-[11px] font-bold text-yellow-400 flex items-center gap-1.5 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                        <span>타격 목표 ({day.spots.length}곳)</span>
                      </div>
                      <p className="text-xs font-medium text-slate-300 line-clamp-2 leading-relaxed">
                        {spotNames}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-yellow-400 group-hover:text-yellow-300">
                    <span>Day {day.dayNumber} 코스 파헤치기 ⚡</span>
                    <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Boys Crew Types & Survival Rules Section */}
      <section className="py-16 px-4 sm:px-6 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold text-xs px-3.5 py-1 rounded-full mb-2.5">
              CREW TYPES
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              우리 원정대 유형 분석! (너는 누구냐?)
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
              친구들을 눌러서 한마디 외쳐보세요!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GANG_CHARACTERS.map((char, i) => (
              <button
                key={i}
                onClick={() => triggerFunReaction(`${char.role}: ${char.quote}`)}
                className={`bg-gradient-to-b ${char.accent} p-5 rounded-2xl border backdrop-blur-sm hover:scale-105 active:scale-95 transition-all text-left flex flex-col justify-between cursor-pointer shadow-lg`}
              >
                <div>
                  <div className="text-4xl mb-3">{char.emoji}</div>
                  <div className="font-bold text-base text-white mb-1">{char.role}</div>
                  <div className="text-xs font-medium text-slate-300 leading-snug">
                    {char.quote}
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-white/15 text-[11px] font-bold text-yellow-300 flex items-center justify-between">
                  <span>외치기 📢</span>
                  <span>CLICK!</span>
                </div>
              </button>
            ))}
          </div>

          {/* Survival Rules Card */}
          <div className="mt-12 bg-zinc-950/80 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  도쿄 원정대 절대 생존 4대 수칙
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  이것만 지키면 경찰서 갈 일도 없고 친구랑 멱살 잡을 일도 없다!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BOY_SURVIVAL_TIPS.map((tip, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-2xl mb-2">{tip.icon}</div>
                  <div className="text-sm font-bold text-white mb-1">{tip.title}</div>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>

            {/* Travel Essentials Checklist Banner */}
            {onOpenChecklist && (
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-yellow-400/10 p-5 rounded-2xl border border-yellow-400/30">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎒</span>
                  <div>
                    <div className="text-sm font-bold text-white">
                      여행 필수 준비물 챙겼어? (속옷, 양말, 칫솔, 비상약, 모자, 선글라스 등)
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      놓치기 쉬운 36가지 필수품을 카테고리별로 꼼꼼하게 체크해 보세요!
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenChecklist}
                  className="w-full sm:w-auto px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <CheckSquare className="w-4 h-4 text-black" />
                  <span>준비물 체크리스트 열기</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Secret Weapon Features (특수 무기 기능 4종) */}
      <section className="py-16 px-4 sm:px-6 bg-zinc-950 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold text-xs px-3.5 py-1 rounded-full mb-2.5">
              GEAR & SKILLS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              원정대를 위한 스마트 특수 무기 4종
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-yellow-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-black text-xl mb-3 text-amber-300">
                🗺️
              </div>
              <h3 className="font-bold text-base text-white mb-1.5">길치 탈출 파란 동선선</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                1, 2, 3 순서대로 점 찍고 선으로 이어줌. 구글 길찾기 버튼 누르면 전철 환승까지 실시간 안내!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-yellow-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-400/20 border border-orange-400/40 flex items-center justify-center font-black text-xl mb-3 text-orange-300">
                🍜
              </div>
              <h3 className="font-bold text-base text-white mb-1.5">원클릭 맛집 추가 & 삭제</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                배고플 때 맛집 클릭 시 동선에 즉시 추가! 다시 누르면 쏙 삭제되는 스마트 실시간 토글!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-yellow-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-400/20 border border-sky-400/40 flex items-center justify-center font-black text-xl mb-3 text-sky-300">
                ☔
              </div>
              <h3 className="font-bold text-base text-white mb-1.5">비 올 때 실내 대피령</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                도쿄 날씨 실시간 연동. 비 오면 우산 쓰고 덜덜 떨지 말고 대형 몰·아케이드로 경로 자동 변경!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-yellow-400/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center font-black text-xl mb-3 text-emerald-300">
                💸
              </div>
              <h3 className="font-bold text-base text-white mb-1.5">싸움 방지 N빵 계산기</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                누가 결제했는지 즉시 기록. 엔화/원화 자동 환산해서 1엔도 틀리지 않고 평화로운 정산!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom Final CTA (시네마틱 엔딩) */}
      <section className="py-16 bg-black text-white text-center px-4 relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3.5 mb-4 animate-bounce">
            <span className="text-4xl select-none" role="img" aria-label="번개">
              ⚡
            </span>
            <img
              src="/cute-airplane.svg"
              alt="도쿄행 비행기"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain inline-block align-middle filter drop-shadow-[0_0_15px_rgba(56,189,248,0.6)] hover:scale-110 transition-transform"
            />
            <span className="text-4xl select-none" role="img" aria-label="로케트">
              🚀
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            준비됐나? 개구쟁이들 도쿄로 출발!
          </h2>
          <p className="text-xs sm:text-base font-medium text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
            망설일 시간 없다. 지금 바로 일정 확인하고 도쿄 여행의 모든 것을 만끽하자!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onStartTrip(1)}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.5)] active:scale-95 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>도쿄 1일차 바로 시작하기!</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
            {onOpenLogin && !currentUser && (
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-base rounded-2xl border border-white/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
              >
                <Users className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>프로필 선택하고 입장</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black border-t border-white/10 text-center text-xs font-medium text-slate-500">
        <p>⚡ 도쿄 원정대 2027 (우당탕탕 도쿄 5박 6일 일본여행) · 구글 지도 & 실시간 맛집 연동 스마트 플래너 ⚡</p>
      </footer>

      {/* Mobile App Install & ZIP Package Modal */}
      <MobileInstallModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
      />

      {/* Profile Nickname & Character Avatar Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        currentUser={currentUser || null}
        onUpdateUser={(updatedUser) => {
          if (onSelectUser) {
            onSelectUser(updatedUser);
          }
          triggerFunReaction(`✨ ${updatedUser.nickname} 프로필 및 캐릭터가 적용되었습니다!`);
        }}
        onOpenFullLogin={onOpenLogin}
      />
    </div>
  );
};
