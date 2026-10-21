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
  Users,
  Palette,
  UtensilsCrossed,
  Store,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TripDay } from '../types/travel';
import { MobileInstallModal } from './MobileInstallModal';
import { ProfileEditModal } from './ProfileEditModal';
import { getCharacterAvatarById } from '../data/characterAvatars';
import { getEffectivePresetMembers, subscribeToProfiles } from '../services/kakaoAuth';
import { KakaoAuthUser } from '../types/auth';
import { ScheduleThemeId, SCHEDULE_THEMES } from '../data/scheduleThemes';
import { getLandingTheme } from '../data/landingThemes';
import { ScheduleThemeSwitcher } from './ScheduleThemeSwitcher';
import {
  TOKYO_FOOD_CATEGORIES,
  TOKYO_FOOD_ITEMS,
  TokyoFoodCategoryId
} from '../data/tokyoFoodGuideData';
import tokyoTowerDesktopImg from '../assets/images/tokyo_tower_night_1792063728180.jpg';
import tokyoTowerMobileImg from '../assets/images/tokyo_tower_mobile_1792145945594.jpg';

interface LandingHeroPageProps {
  days: TripDay[];
  onStartTrip: (dayNumber?: number) => void;
  onOpenMap: () => void;
  onOpenChecklist?: () => void;
  onOpenFoodGuide?: (category?: TokyoFoodCategoryId, foodId?: string) => void;
  currentUser?: KakaoAuthUser | null;
  onOpenLogin?: () => void;
  onSelectUser?: (user: KakaoAuthUser) => void;
  onReplayIntro?: () => void;
  scheduleThemeId?: ScheduleThemeId;
  onSelectScheduleTheme?: (themeId: ScheduleThemeId) => void;
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
  onOpenFoodGuide,
  currentUser,
  onOpenLogin,
  onSelectUser,
  scheduleThemeId = 'intro-thunder',
  onSelectScheduleTheme
}) => {
  const [funSoundPlayed, setFunSoundPlayed] = useState<string | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [previewFoodCategory, setPreviewFoodCategory] = useState<TokyoFoodCategoryId>('ALL');
  const [isDailyCourseExpanded, setIsDailyCourseExpanded] = useState<boolean>(false);
  const [isFoodShowcaseExpanded, setIsFoodShowcaseExpanded] = useState<boolean>(false);
  const [, setProfileSyncTick] = useState(0);

  // Active theme configurations
  const effectiveThemeId = scheduleThemeId || 'intro-thunder';
  const landingTheme = getLandingTheme(effectiveThemeId);
  const currentScheduleTheme = SCHEDULE_THEMES[effectiveThemeId] || SCHEDULE_THEMES['intro-thunder'];

  useEffect(() => {
    const unsubscribe = subscribeToProfiles(() => {
      setProfileSyncTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const effectivePreset = currentUser
    ? getEffectivePresetMembers().find((m) => m.id === currentUser.id)
    : undefined;
  const displayNickname = effectivePreset?.nickname || currentUser?.nickname || '';
  const displayAvatarId = effectivePreset?.avatarId || currentUser?.avatarId;
  const displayProfileImageUrl = effectivePreset
    ? effectivePreset.profileImageUrl
    : currentUser?.profileImageUrl;
  const currentAvatar = getCharacterAvatarById(displayAvatarId, currentUser?.id);

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

  // Themed dynamic SVG bolt generator
  const renderThemedBolt = (idPrefix: string, sizeClass = 'w-full h-full', strokeWidth = 10) => {
    const grad = landingTheme.boltGrad;
    return (
      <svg
        className={sizeClass}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${idPrefix}Grad`} x1="0%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor={grad.stop0} />
            <stop offset="25%" stopColor={grad.stop1} />
            <stop offset="65%" stopColor={grad.stop2} />
            <stop offset="100%" stopColor={grad.stop3} />
          </linearGradient>
          <filter id={`${idPrefix}Filter`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={grad.floodColor} floodOpacity="0.9" />
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
          fill={`url(#${idPrefix}Grad)`}
          stroke={grad.strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${idPrefix}Filter)`}
        />
      </svg>
    );
  };

  return (
    <div className={`min-h-screen ${landingTheme.rootBg} flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300`}>
      {/* Toast Notification */}
      {funSoundPlayed && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-zinc-900/95 text-amber-300 px-5 py-3 rounded-2xl font-bold text-sm border border-amber-400/50 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center gap-2">
          <span>📢</span>
          <span>{funSoundPlayed}</span>
        </div>
      )}

      {/* 1. Top Cinematic Navigation Bar */}
      <header className={`sticky top-0 z-40 ${landingTheme.headerBg} border-b ${landingTheme.headerBorder} px-3 sm:px-8 py-2.5 sm:py-3.5 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              {/* Lightning bolt icon button */}
              <button
                onClick={() => setIsMobileModalOpen(true)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${landingTheme.boltBoxBg} backdrop-blur-xl flex items-center justify-center p-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0`}
                title="스마트폰 홈화면 앱 설치 & 바로가기"
              >
                {renderThemedBolt('headerBolt', 'w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]')}
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-base sm:text-xl font-black tracking-tight ${landingTheme.headerBrandTitle} whitespace-nowrap`}
                  style={{ textShadow: landingTheme.isDark ? '0 0 15px rgba(255,255,255,0.8)' : undefined }}
                >
                  도쿄 원정대 <span className="font-mono text-amber-400">2027</span>
                </span>
                <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 border ${landingTheme.headerBrandBadge}`}>
                  우당탕탕!
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools, Theme Shortcut & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pt-0.5 md:pt-0">
            {/* Quick Theme Switcher Shortcut Button */}
            {onSelectScheduleTheme && (
              <button
                onClick={() => {
                  const el = document.getElementById('landing-theme-switcher');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-xl border backdrop-blur-md transition-all cursor-pointer whitespace-nowrap shadow-2xs hover:scale-105 active:scale-95 ${landingTheme.headerUserBtn}`}
                title="도쿄 여행 디자인 테마 변경하기 (첫페이지)"
              >
                <Palette className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">테마:</span>
                <span className="font-extrabold">{currentScheduleTheme.shortName}</span>
              </button>
            )}

            {/* Logged in Profile Badge */}
            <button
              onClick={() => setIsProfileEditOpen(true)}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-xl border backdrop-blur-md transition-all cursor-pointer whitespace-nowrap shadow-2xs group ${landingTheme.headerUserBtn}`}
              title={
                currentUser
                  ? `${displayNickname} 프로필 (클릭하여 닉네임 및 캐릭터 변경)`
                  : '프로필 닉네임 및 캐릭터 설정'
              }
            >
              {currentUser ? (
                <>
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentAvatar.bgGradient} p-0 border border-amber-300/70 flex items-center justify-center overflow-hidden shrink-0 shadow-xs`}
                  >
                    {displayProfileImageUrl ? (
                      <img
                        src={displayProfileImageUrl}
                        alt={displayNickname}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      currentAvatar.renderSvg('w-full h-full')
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="truncate max-w-[90px] sm:max-w-[130px] font-bold text-xs">
                      {displayNickname}
                    </span>
                    <span className="text-[9px] opacity-80 font-medium">
                      {currentAvatar.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-900 font-extrabold bg-amber-400 group-hover:bg-amber-300 px-1.5 py-0.5 rounded-md transition-colors">
                    변경 ✏️
                  </span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>프로필 선택 · 꾸미기</span>
                </>
              )}
            </button>

            {/* App Install Button */}
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border rounded-xl transition-all cursor-pointer whitespace-nowrap ${landingTheme.headerInstallBtn}`}
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>앱 설치</span>
            </button>

            {/* Desktop D-Day Pill */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${landingTheme.headerDdayPill}`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>출발 {dDay.dDayText}</span>
              <span className="opacity-40">|</span>
              <span>{dDay.days}일 {String(dDay.hours).padStart(2, '0')}시간 남음</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Tokyo Tower Night Backdrop + Themed Lightning & Aura */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 overflow-hidden border-b border-white/10">
        {/* Full-bleed Tokyo Tower Night Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-1000 ease-out scale-100 filter brightness-95"
          style={{
            backgroundImage: `url(${isMobile ? tokyoTowerMobileImg : tokyoTowerDesktopImg})`,
            backgroundPosition: isMobile ? 'center 15%' : 'center center'
          }}
        />

        {/* Cinematic Vignettes matching active theme */}
        <div className={`absolute inset-0 ${landingTheme.heroBgOverlay}`} />
        <div className={`absolute inset-0 bg-gradient-to-t ${landingTheme.heroVignetteBottom}`} />
        <div className={`absolute top-0 left-0 right-0 h-36 bg-gradient-to-b ${landingTheme.heroVignetteTop}`} />

        {/* Themed Central Radiant Aura */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] ${landingTheme.heroAura} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Glowing Lightning Bolt Emblem */}
          <div className="flex justify-center mb-6">
            <div className={`relative inline-flex items-center justify-center p-3 rounded-3xl ${landingTheme.heroEmblemBox} backdrop-blur-xl hover:scale-105 transition-transform duration-300`}>
              {renderThemedBolt('heroBolt', 'w-14 h-14 sm:w-18 sm:h-18 drop-shadow-[0_0_24px_rgba(255,255,255,0.85)]', 8)}
            </div>
          </div>

          {/* Expedition Date & Motto Badge (대원정 -> 원정대 수정 완료) */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${landingTheme.mottoBadge} text-xs sm:text-sm font-bold backdrop-blur-md mb-6 transition-colors duration-300`}>
            <Zap className={`w-4 h-4 ${landingTheme.mottoIconColor} animate-pulse`} />
            <span>2027.01.13 ~ 01.18 · 개구쟁이 소년들과 엄마들의 도쿄 원정대</span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-4xl sm:text-6xl lg:text-7xl font-black ${landingTheme.heroTitle} tracking-tight leading-[1.15] mb-5 select-none`}
            style={{ textShadow: landingTheme.heroTitleShadow }}
          >
            도쿄 원정대 <span className="font-mono text-amber-400">2027</span> <br />
            <span className={landingTheme.heroTitleGradient}>
              우당탕탕! 일본 대모험
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-sm sm:text-lg font-medium ${landingTheme.heroSubtitle} max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-md`}>
            길 잃어도 신나고 라멘 국물 튀어도 즐겁다! <br />
            아사쿠사부터 디즈니씨, 해리포터 스튜디오, 시부야·신주쿠 야경까지 <br className="hidden sm:inline" />
            <span className="font-bold border-b border-current pb-0.5">최적화 구글맵 동선 + 실시간 맛집 가이드</span> 완벽 장착 완료!
          </p>

          {/* D-DAY Flight Mission Countdown Terminal */}
          <div className={`max-w-xl mx-auto mb-10 ${landingTheme.ddayBox} backdrop-blur-2xl rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all duration-300`}>
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-left">
                <div className={`w-10 h-10 rounded-2xl ${landingTheme.boltBoxBg} backdrop-blur-xl flex items-center justify-center p-1.5 shrink-0`}>
                  {renderThemedBolt('ddayBolt', 'w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]')}
                </div>
                <div>
                  <div className={`text-xs font-bold ${landingTheme.ddayTitle} flex items-center gap-1.5`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>도쿄 원정 출발 D-DAY 카운트다운</span>
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold ${landingTheme.ddaySubtitle}`}>
                    2027.01.13 (수) 09:00 인천 ✈️ 11:30 나리타 착륙
                  </div>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-xl font-black text-base sm:text-xl ${landingTheme.ddayBadge}`}>
                {dDay.dDayText}
              </div>
            </div>

            {/* 4 Digital Timer Cards */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
              <div className={`${landingTheme.ddayTimerBox} p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center border`}>
                <span className={`text-2xl sm:text-4xl font-black ${landingTheme.ddayNumberDays} tabular-nums font-mono`}>
                  {dDay.days}
                </span>
                <span className={`text-[10px] sm:text-xs font-medium ${landingTheme.ddayTimerLabel} mt-1`}>남은 일(Days)</span>
              </div>
              <div className={`${landingTheme.ddayTimerBox} p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center border`}>
                <span className="text-2xl sm:text-4xl font-black text-sky-400 tabular-nums font-mono">
                  {String(dDay.hours).padStart(2, '0')}
                </span>
                <span className={`text-[10px] sm:text-xs font-medium ${landingTheme.ddayTimerLabel} mt-1`}>시간(Hours)</span>
              </div>
              <div className={`${landingTheme.ddayTimerBox} p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center border`}>
                <span className="text-2xl sm:text-4xl font-black text-emerald-400 tabular-nums font-mono">
                  {String(dDay.minutes).padStart(2, '0')}
                </span>
                <span className={`text-[10px] sm:text-xs font-medium ${landingTheme.ddayTimerLabel} mt-1`}>분(Mins)</span>
              </div>
              <div className={`${landingTheme.ddayTimerBox} p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center border`}>
                <span className="text-2xl sm:text-4xl font-black text-rose-400 tabular-nums font-mono animate-pulse">
                  {String(dDay.seconds).padStart(2, '0')}
                </span>
                <span className={`text-[10px] sm:text-xs font-medium ${landingTheme.ddayTimerLabel} mt-1`}>초(Secs)</span>
              </div>
            </div>

            {/* Departure Info Banner */}
            <div className={`mt-4 text-center text-xs font-medium py-2 px-3 rounded-xl border ${landingTheme.ddayInfoBanner}`}>
              {dDay.label}
            </div>
          </div>

          {/* 3. Main Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3.5 max-w-3xl mx-auto mb-8 sm:mb-10">
            <button
              onClick={() => onStartTrip(1)}
              className={`w-full sm:w-auto px-8 py-4.5 ${landingTheme.primaryBtn} font-black text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group`}
            >
              <Zap className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
              <span>원정 시작하기 (Day 1)</span>
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => onOpenMap()}
              className={`w-full sm:w-auto px-6 py-4.5 ${landingTheme.secondaryBtn} font-bold text-base rounded-2xl backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
            >
              <Navigation className="w-5 h-5 text-sky-400" />
              <span>구글 동선 지도 열기</span>
            </button>

            {onOpenFoodGuide && (
              <button
                onClick={() => onOpenFoodGuide('ALL')}
                className={`w-full sm:w-auto px-6 py-4.5 ${landingTheme.secondaryBtn} font-bold text-base rounded-2xl backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
              >
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                <span>도쿄 음식 · 디저트 도감</span>
              </button>
            )}
          </div>

          {/* 4. Moved from Schedule Page: Interactive 5-Theme Switcher on First Page */}
          {onSelectScheduleTheme && (
            <div id="landing-theme-switcher" className="max-w-4xl mx-auto mb-10 w-full text-left scroll-mt-20">
              <ScheduleThemeSwitcher
                currentThemeId={effectiveThemeId}
                onSelectTheme={onSelectScheduleTheme}
                title="🎨 도쿄 여행 5대 디자인 테마 선택"
                subtitle="첫페이지부터 일정 타임라인, 동선 지도, 가계부 전체에 실시간 적용됩니다!"
                defaultExpanded={true}
              />
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto pt-6 border-t border-white/10">
            <div className={`${landingTheme.statsCardBg} p-4 rounded-2xl border ${landingTheme.statsCardBorder}`}>
              <div className={`text-2xl sm:text-3xl font-black ${landingTheme.statsCardNum1} font-mono`}>{dDay.dDayText}</div>
              <div className={`text-xs font-medium ${landingTheme.statsCardText} mt-1`}>⏳ 출발 카운트다운</div>
            </div>
            <div className={`${landingTheme.statsCardBg} p-4 rounded-2xl border ${landingTheme.statsCardBorder}`}>
              <div className={`text-2xl sm:text-3xl font-black ${landingTheme.statsCardNum2}`}>5박 6일</div>
              <div className={`text-xs font-medium ${landingTheme.statsCardText} mt-1`}>🔥 끝장나는 일정</div>
            </div>
            <div className={`${landingTheme.statsCardBg} p-4 rounded-2xl border ${landingTheme.statsCardBorder}`}>
              <div className={`text-2xl sm:text-3xl font-black ${landingTheme.statsCardNum3} font-mono`}>24+ 곳</div>
              <div className={`text-xs font-medium ${landingTheme.statsCardText} mt-1`}>🎮 핫플 & 맛집 폭격</div>
            </div>
            <div className={`${landingTheme.statsCardBg} p-4 rounded-2xl border ${landingTheme.statsCardBorder}`}>
              <div className={`text-2xl sm:text-3xl font-black ${landingTheme.statsCardNum4} font-mono`}>100%</div>
              <div className={`text-xs font-medium ${landingTheme.statsCardText} mt-1`}>🗺️ 길치 탈출 구글맵</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5박 6일 일자별 공략 코스 (에피소드 스타일 카드) */}
      <section className={`py-14 px-4 sm:px-6 ${landingTheme.sectionDailyBg} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-4">
            <div>
              <div className={`inline-block font-bold text-xs px-3.5 py-1 rounded-full mb-2.5 border ${landingTheme.dailySectionBadge}`}>
                DAILY MISSION · EPISODES
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black ${landingTheme.dailySectionTitle}`}>
                5박 6일 일자별 공략 코스
              </h2>
              <p className={`text-xs sm:text-sm font-medium ${landingTheme.dailySectionSubtitle} mt-1`}>
                원하는 날짜 카드를 누르면 그날의 작전 지도로 직행합니다.
              </p>
            </div>
            <button
              onClick={() => onStartTrip(1)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl border transition-all self-start sm:self-auto cursor-pointer shrink-0 ${landingTheme.dailyAllBtn}`}
            >
              <span>전체 일정 타임라인으로 바로가기</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Collapsible Toggle Bar right below the Daily Mission header */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsDailyCourseExpanded((prev) => !prev)}
              aria-expanded={isDailyCourseExpanded}
              className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                landingTheme.isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 text-left">
                <span className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-base shrink-0">
                  🗓️
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-black flex items-center gap-2 flex-wrap">
                    <span>
                      5박 6일 일자별 공략 코스 카드 {isDailyCourseExpanded ? '접기 (닫기)' : '펼쳐보기'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950">
                      DAY 1 ~ DAY {days.length}
                    </span>
                  </div>
                  <p className={`text-[11px] sm:text-xs font-medium mt-0.5 ${landingTheme.dailySectionSubtitle}`}>
                    {isDailyCourseExpanded
                      ? '화면을 간결하게 보려면 버튼을 눌러 일자별 공략 코스 카드를 닫을 수 있습니다.'
                      : '클릭하면 DAY 1부터 DAY 6까지 일자별 핵심 테마와 타격 목표 코스 카드가 펼쳐집니다.'}
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shrink-0 self-end sm:self-center transition-colors ${
                  isDailyCourseExpanded
                    ? landingTheme.isDark
                      ? 'bg-white/15 text-amber-300 border border-amber-400/40'
                      : 'bg-slate-200 text-slate-800'
                    : 'bg-amber-400 text-slate-950 shadow-sm'
                }`}
              >
                <span>{isDailyCourseExpanded ? '코스 목록 닫기' : '코스 목록 펼치기'}</span>
                {isDailyCourseExpanded ? (
                  <ChevronUp className="w-4 h-4 stroke-[3]" />
                ) : (
                  <ChevronDown className="w-4 h-4 stroke-[3]" />
                )}
              </div>
            </button>
          </div>

          {isDailyCourseExpanded && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in duration-200">
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
                      className={`${landingTheme.episodeCardBg} ${landingTheme.episodeCardHover} rounded-3xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between cursor-pointer group backdrop-blur-md`}
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-black ${landingTheme.episodeDayBadge}`}>
                            DAY {day.dayNumber}
                          </span>
                          <span className="text-xs font-mono font-medium opacity-70">
                            {day.fullDate.split(' ')[0]}
                          </span>
                        </div>

                        <div className={`inline-block text-[11px] font-bold rounded-md px-2 py-0.5 mb-2.5 border ${landingTheme.episodeSubBadge}`}>
                          {dayBadge}
                        </div>

                        {/* Theme */}
                        <h3 className={`text-base sm:text-lg font-bold mb-2 transition-colors ${landingTheme.episodeTitle} ${landingTheme.episodeTitleHover}`}>
                          {day.theme}
                        </h3>

                        {/* Description */}
                        <p className={`text-xs font-medium mb-4 line-clamp-2 leading-relaxed ${landingTheme.episodeDesc}`}>
                          {day.description}
                        </p>

                        {/* Spots list */}
                        <div className={`p-3 rounded-2xl border mb-4 ${landingTheme.episodeSpotsBox}`}>
                          <div className={`text-[11px] font-bold flex items-center gap-1.5 mb-1.5 ${landingTheme.episodeSpotsTitle}`}>
                            <MapPin className="w-3.5 h-3.5" />
                            <span>타격 목표 ({day.spots.length}곳)</span>
                          </div>
                          <p className={`text-xs font-medium line-clamp-2 leading-relaxed ${landingTheme.episodeSpotsText}`}>
                            {spotNames}
                          </p>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className={`pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold ${landingTheme.episodeCtaText}`}>
                        <span>Day {day.dayNumber} 코스 파헤치기 ⚡</span>
                        <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Collapse Button for convenience after scrolling through course cards */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsDailyCourseExpanded(false)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                    landingTheme.isDark
                      ? 'bg-white/10 hover:bg-white/15 text-amber-300 border-amber-400/40'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                  }`}
                >
                  <span>5박 6일 일자별 공략 코스 접기 (닫기)</span>
                  <ChevronUp className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5-B. Tokyo Famous Food, Street Snacks & Desserts Categorized Photo Showcase */}
      <section className={`py-14 px-4 sm:px-6 border-t border-white/10 ${landingTheme.sectionWeaponsBg} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <div className={`inline-block font-bold text-xs px-3.5 py-1 rounded-full mb-2.5 border ${landingTheme.dailySectionBadge}`}>
                TOKYO GOURMET & DESSERT GUIDE
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black ${landingTheme.dailySectionTitle}`}>
                도쿄 대표 음식 · 길거리 간식 · 디저트 도감
              </h2>
              <p className={`text-xs sm:text-sm font-medium ${landingTheme.dailySectionSubtitle} mt-1`}>
                실제 사진을 바탕으로 라멘·규카츠부터 아사쿠사 메론빵, 생딸기 모찌, 버터맥주, 편의점 야식까지 카테고리별로 한눈에 확인하세요!
              </p>
            </div>

            {onOpenFoodGuide && (
              <button
                type="button"
                onClick={() => onOpenFoodGuide(previewFoodCategory)}
                className={`inline-flex items-center gap-2 px-5 py-3 font-black text-xs sm:text-sm rounded-xl transition-all self-start md:self-auto cursor-pointer shrink-0 ${landingTheme.primaryBtn}`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>먹거리 · 디저트 전체 상세 & 일본어 주문카드 열기</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Collapsible Toggle Bar right below the Order Card header */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsFoodShowcaseExpanded((prev) => !prev)}
              aria-expanded={isFoodShowcaseExpanded}
              className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                landingTheme.isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 text-left">
                <span className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-base shrink-0">
                  🍜
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-black flex items-center gap-2 flex-wrap">
                    <span>
                      도쿄 대표 음식 · 디저트 사진 및 정보 {isFoodShowcaseExpanded ? '접기 (닫기)' : '펼쳐보기'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950">
                      총 {TOKYO_FOOD_ITEMS.length}선
                    </span>
                  </div>
                  <p className={`text-[11px] sm:text-xs font-medium mt-0.5 ${landingTheme.dailySectionSubtitle}`}>
                    {isFoodShowcaseExpanded
                      ? '화면을 간결하게 보려면 버튼을 눌러 대표 음식 카드 목록을 닫을 수 있습니다.'
                      : '클릭하면 카테고리별(식사·길거리간식·디저트·테마파크·편의점) 대표 음식 사진과 맛집 정보가 펼쳐집니다.'}
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shrink-0 self-end sm:self-center transition-colors ${
                  isFoodShowcaseExpanded
                    ? landingTheme.isDark
                      ? 'bg-white/15 text-amber-300 border border-amber-400/40'
                      : 'bg-slate-200 text-slate-800'
                    : 'bg-amber-400 text-slate-950 shadow-sm'
                }`}
              >
                <span>{isFoodShowcaseExpanded ? '음식 목록 닫기' : '음식 목록 펼치기'}</span>
                {isFoodShowcaseExpanded ? (
                  <ChevronUp className="w-4 h-4 stroke-[3]" />
                ) : (
                  <ChevronDown className="w-4 h-4 stroke-[3]" />
                )}
              </div>
            </button>
          </div>

          {/* Collapsible Content: Category Filter Buttons + Categorized Photo Cards Grid */}
          {isFoodShowcaseExpanded && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in duration-200">
              {/* Interactive Category Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
                {TOKYO_FOOD_CATEGORIES.map((cat) => {
                  const isSelected = previewFoodCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPreviewFoodCategory(cat.id)}
                      className={`px-4 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                          : landingTheme.isDark
                          ? 'bg-white/5 text-slate-200 border-white/15 hover:bg-white/10'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Categorized Photo Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {(previewFoodCategory === 'ALL'
                  ? TOKYO_FOOD_ITEMS
                  : TOKYO_FOOD_ITEMS.filter((item) => item.category === previewFoodCategory)
                ).map((food) => (
                  <div
                    key={food.id}
                    onClick={() => onOpenFoodGuide && onOpenFoodGuide(food.category, food.id)}
                    className={`${landingTheme.episodeCardBg} ${landingTheme.episodeCardHover} rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-200`}
                  >
                    <div>
                      {/* Real Food Photo */}
                      <div className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${food.fallbackGradient}`}>
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30 pointer-events-none" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-black/75 text-amber-300 border border-amber-400/40 text-[11px] font-black">
                              Day {food.dayNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-black/75 text-white text-[11px] font-bold">
                              {food.categoryLabel.split('·')[1]?.trim() || food.categoryLabel}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-amber-400/95 text-slate-950 text-[11px] font-black truncate max-w-[55%]">
                            {food.ratingScore} {food.recommendBadge}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <div className="text-[11px] font-semibold text-amber-300 truncate">
                            {food.japaneseName}
                          </div>
                          <h3 className="text-sm font-black leading-snug line-clamp-1">
                            {food.name}
                          </h3>
                        </div>
                      </div>

                      {/* Description & Shop Info */}
                      <div className="p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                          <span className="font-bold text-amber-500 dark:text-amber-300">
                            {food.priceJpy}
                          </span>
                          <span className="opacity-75 text-[11px]">{food.priceKrwApprox}</span>
                        </div>
                        <div className={`text-[11px] font-semibold flex items-center gap-1 truncate ${landingTheme.episodeDesc}`}>
                          <Store className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{food.famousShop}</span>
                        </div>
                        {food.eggAllergyInfo?.hasDirectEgg && (
                          <div className="px-2 py-1 rounded-lg bg-rose-500/15 border border-rose-400/40 text-rose-500 dark:text-rose-300 text-[11px] font-bold flex items-center gap-1">
                            <span className="shrink-0">🥚</span>
                            <span className="truncate">현우 계란 주의: {food.eggAllergyInfo.eggTypeLabel}</span>
                          </div>
                        )}
                        <p className={`text-xs line-clamp-2 leading-relaxed ${landingTheme.episodeDesc}`}>
                          {food.summary}
                        </p>
                      </div>
                    </div>

                    <div className={`px-3.5 py-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-bold ${landingTheme.episodeCtaText}`}>
                      <span>클릭 시 이 음식 상세 & 일본어 주문카드 바로 보기</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Collapse Button for convenience after scrolling through cards */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsFoodShowcaseExpanded(false)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                    landingTheme.isDark
                      ? 'bg-white/10 hover:bg-white/15 text-amber-300 border-amber-400/40'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                  }`}
                >
                  <span>도쿄 대표 음식 · 디저트 목록 접기 (닫기)</span>
                  <ChevronUp className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Boys Crew Types & Survival Rules Section */}
      <section className={`py-16 px-4 sm:px-6 ${landingTheme.sectionCrewBg} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className={`inline-block font-bold text-xs px-3.5 py-1 rounded-full mb-2.5 border ${landingTheme.crewSectionBadge}`}>
              CREW TYPES
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${landingTheme.crewSectionTitle}`}>
              우리 원정대 유형 분석! (너는 누구냐?)
            </h2>
            <p className={`text-xs sm:text-sm font-medium ${landingTheme.crewSectionSubtitle} mt-1`}>
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
                <div className="mt-4 pt-2 border-t border-white/15 text-[11px] font-bold text-amber-300 flex items-center justify-between">
                  <span>외치기 📢</span>
                  <span>CLICK!</span>
                </div>
              </button>
            ))}
          </div>

          {/* Survival Rules Card */}
          <div className={`mt-12 rounded-3xl p-6 sm:p-8 backdrop-blur-xl border ${landingTheme.survivalCardBg}`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className={`text-lg sm:text-xl font-black ${landingTheme.survivalItemTitle}`}>
                  도쿄 원정대 절대 생존 4대 수칙
                </h3>
                <p className={`text-xs font-medium ${landingTheme.survivalItemDesc}`}>
                  이것만 지키면 경찰서 갈 일도 없고 친구랑 멱살 잡을 일도 없다!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BOY_SURVIVAL_TIPS.map((tip, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${landingTheme.survivalItemBg}`}>
                  <div className="text-2xl mb-2">{tip.icon}</div>
                  <div className={`text-sm font-bold mb-1 ${landingTheme.survivalItemTitle}`}>{tip.title}</div>
                  <p className={`text-xs font-medium leading-relaxed ${landingTheme.survivalItemDesc}`}>{tip.desc}</p>
                </div>
              ))}
            </div>

            {/* Travel Essentials Checklist Banner */}
            {onOpenChecklist && (
              <div className={`mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border ${landingTheme.checklistBanner}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎒</span>
                  <div>
                    <div className={`text-sm font-bold ${landingTheme.checklistTitle}`}>
                      여행 필수 준비물 챙겼어? (속옷, 양말, 칫솔, 비상약, 모자, 선글라스 등)
                    </div>
                    <div className={`text-xs font-medium mt-0.5 ${landingTheme.checklistDesc}`}>
                      놓치기 쉬운 36가지 필수품을 카테고리별로 꼼꼼하게 체크해 보세요!
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenChecklist}
                  className={`w-full sm:w-auto px-5 py-2.5 font-black text-xs sm:text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${landingTheme.checklistBtn}`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>준비물 체크리스트 열기</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Secret Weapon Features (특수 무기 기능 4종) */}
      <section className={`py-16 px-4 sm:px-6 ${landingTheme.sectionWeaponsBg} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className={`inline-block font-bold text-xs px-3.5 py-1 rounded-full mb-2.5 border ${landingTheme.weaponsSectionBadge}`}>
              GEAR & SKILLS
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${landingTheme.weaponsSectionTitle}`}>
              원정대를 위한 스마트 특수 무기 4종
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-colors ${landingTheme.weaponCardBg}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-black text-xl mb-3 text-amber-300">
                🗺️
              </div>
              <h3 className={`font-bold text-base mb-1.5 ${landingTheme.weaponCardTitle}`}>길치 탈출 파란 동선선</h3>
              <p className={`text-xs font-medium leading-relaxed ${landingTheme.weaponCardDesc}`}>
                1, 2, 3 순서대로 점 찍고 선으로 이어줌. 구글 길찾기 버튼 누르면 전철 환승까지 실시간 안내!
              </p>
            </div>

            <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-colors ${landingTheme.weaponCardBg}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-400/20 border border-orange-400/40 flex items-center justify-center font-black text-xl mb-3 text-orange-300">
                🍜
              </div>
              <h3 className={`font-bold text-base mb-1.5 ${landingTheme.weaponCardTitle}`}>원클릭 맛집 추가 & 삭제</h3>
              <p className={`text-xs font-medium leading-relaxed ${landingTheme.weaponCardDesc}`}>
                배고플 때 맛집 클릭 시 동선에 즉시 추가! 다시 누르면 쏙 삭제되는 스마트 실시간 토글!
              </p>
            </div>

            <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-colors ${landingTheme.weaponCardBg}`}>
              <div className="w-10 h-10 rounded-xl bg-sky-400/20 border border-sky-400/40 flex items-center justify-center font-black text-xl mb-3 text-sky-300">
                ☔
              </div>
              <h3 className={`font-bold text-base mb-1.5 ${landingTheme.weaponCardTitle}`}>비 올 때 실내 대피령</h3>
              <p className={`text-xs font-medium leading-relaxed ${landingTheme.weaponCardDesc}`}>
                도쿄 날씨 실시간 연동. 비 오면 우산 쓰고 덜덜 떨지 말고 대형 몰·아케이드로 경로 자동 변경!
              </p>
            </div>

            <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-colors ${landingTheme.weaponCardBg}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center font-black text-xl mb-3 text-emerald-300">
                💸
              </div>
              <h3 className={`font-bold text-base mb-1.5 ${landingTheme.weaponCardTitle}`}>싸움 방지 N빵 계산기</h3>
              <p className={`text-xs font-medium leading-relaxed ${landingTheme.weaponCardDesc}`}>
                누가 결제했는지 즉시 기록. 엔화/원화 자동 환산해서 1엔도 틀리지 않고 평화로운 정산!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom Final CTA */}
      <section className={`py-16 ${landingTheme.sectionFinalBg} text-center px-4 relative overflow-hidden transition-colors duration-300`}>
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
          <h2 className={`text-2xl sm:text-4xl font-black mb-3 tracking-tight ${landingTheme.finalTitle}`}>
            준비됐나? 개구쟁이들 도쿄로 출발!
          </h2>
          <p className={`text-xs sm:text-base font-medium mb-8 max-w-lg mx-auto leading-relaxed ${landingTheme.finalSubtitle}`}>
            망설일 시간 없다. 지금 바로 일정 확인하고 도쿄 여행의 모든 것을 만끽하자!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onStartTrip(1)}
              className={`w-full sm:w-auto px-8 sm:px-10 py-4 ${landingTheme.finalPrimaryBtn} font-black text-lg rounded-2xl active:scale-95 transition-all inline-flex items-center justify-center gap-3 cursor-pointer`}
            >
              <span>도쿄 1일차 바로 시작하기!</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
            {onOpenLogin && !currentUser && (
              <button
                onClick={onOpenLogin}
                className={`w-full sm:w-auto px-6 py-4 ${landingTheme.secondaryBtn} font-bold text-base rounded-2xl backdrop-blur-md active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer`}
              >
                <Users className="w-5 h-5 text-amber-400 shrink-0" />
                <span>프로필 선택하고 입장</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 ${landingTheme.footerBg} border-t ${landingTheme.footerBorder} text-center text-xs font-medium ${landingTheme.footerText} transition-colors duration-300`}>
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
