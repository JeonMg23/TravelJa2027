import React, { useState, useEffect } from 'react';
import { KakaoAuthUser, DeviceInfo } from '../types/auth';
import {
  createKakaoUserFromPreset,
  getEffectivePresetMembers,
  fetchServerProfiles,
  subscribeToProfiles,
  detectDeviceInfo,
  checkProfileDeviceAccess,
  requestHighEntropyDeviceModel
} from '../services/kakaoAuth';
import { getCharacterAvatarById } from '../data/characterAvatars';
import { X, MapPin, ChevronRight, AlertTriangle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: KakaoAuthUser) => void;
  onContinueAsGuest?: () => void;
  initialUser?: KakaoAuthUser | null;
  onClose?: () => void;
  canDismiss?: boolean;
  onReplayIntro?: () => void;
}

import tokyoTowerDesktopImg from '../assets/images/tokyo_tower_night_1792063728180.jpg';
import tokyoTowerMobileImg from '../assets/images/tokyo_tower_mobile_1792145945594.jpg';

import tokyoSkytreeDesktopImg from '../assets/images/tokyo_skytree_night_1792063728807.jpg';
import tokyoSkytreeMobileImg from '../assets/images/tokyo_skytree_mobile_1792145946265.jpg';

import sensojiTempleDesktopImg from '../assets/images/sensoji_temple_night_1792063729029.jpg';
import sensojiPagodaMobileImg from '../assets/images/sensoji_pagoda_mobile_1792145947030.jpg';

// 9 Curated High-Definition Photos from the Actual 2027 Tokyo Trip Itinerary (Days 1–5)
interface TokyoBackground {
  id: string;
  dayLabel: string;
  dateLabel: string;
  title: string;
  subtitle: string;
  desktopUrl: string;
  mobileUrl: string;
  mobilePosition: string;
  desktopPosition: string;
}

const TOKYO_BACKGROUNDS: TokyoBackground[] = [
  {
    id: 'day1-sensoji',
    dayLabel: 'DAY 1',
    dateLabel: '1월 13일 (수)',
    title: '아사쿠사 센소지 & 오층탑 라이트업 야경',
    subtitle: '우에노 산책 후 아사쿠사 전통 거리 & 사원 야경 투어',
    desktopUrl: sensojiTempleDesktopImg,
    mobileUrl: sensojiPagodaMobileImg,
    mobilePosition: 'center 18%',
    desktopPosition: 'center center'
  },
  {
    id: 'day1-skytree',
    dayLabel: 'DAY 1',
    dateLabel: '1월 13일 (수)',
    title: '도쿄 스카이트리 & 스미다가와 야경',
    subtitle: '오시아게 소라마치 미식 투어 & 634m 타워 일루미네이션',
    desktopUrl: tokyoSkytreeDesktopImg,
    mobileUrl: tokyoSkytreeMobileImg,
    mobilePosition: 'center 12%',
    desktopPosition: 'center center'
  },
  {
    id: 'day2-disneysea',
    dayLabel: 'DAY 2',
    dateLabel: '1월 14일 (목)',
    title: '도쿄 디즈니씨 메디테러니언 하버 야경',
    subtitle: '오전 7시 오픈런 종일 코스 · 프로메테우스 화산 & 하버 나이트뷰',
    desktopUrl: '/backgrounds/day2_disneysea_night.jpg',
    mobileUrl: '/backgrounds/day2_disneysea_night.jpg',
    mobilePosition: 'center 35%',
    desktopPosition: 'center 40%'
  },
  {
    id: 'day3-fuji',
    dayLabel: 'DAY 3',
    dateLabel: '1월 15일 (금)',
    title: '가와구치코 호수 & 만년설 후지산 절경',
    subtitle: '후지산 1일 버스 투어 · 가와구치코 호숫가 & 오시노핫카이',
    desktopUrl: '/backgrounds/day3_fuji_kawaguchiko.jpg',
    mobileUrl: '/backgrounds/day3_fuji_kawaguchiko.jpg',
    mobilePosition: '62% 35%',
    desktopPosition: 'center 38%'
  },
  {
    id: 'day3-tokyostation',
    dayLabel: 'DAY 3',
    dateLabel: '1월 15일 (금)',
    title: '도쿄역 마루노우치 적벽돌 역사 야경',
    subtitle: '후지산 투어 복귀 후 KITTE 전망대 & 마루노우치 일루미네이션',
    desktopUrl: '/backgrounds/day3_tokyo_station_night.jpg',
    mobileUrl: '/backgrounds/day3_tokyo_station_night.jpg',
    mobilePosition: 'center 42%',
    desktopPosition: 'center 45%'
  },
  {
    id: 'day4-harrypotter',
    dayLabel: 'DAY 4',
    dateLabel: '1월 16일 (토)',
    title: '워너 브라더스 해리포터 스튜디오 도쿄',
    subtitle: '9와 3/4 승강장 호그와트 급행열차 & 대연회장 마법 세계 투어',
    desktopUrl: '/backgrounds/day4_harry_potter_studio.jpg',
    mobileUrl: '/backgrounds/day4_harry_potter_studio.jpg',
    mobilePosition: '32% center',
    desktopPosition: 'center center'
  },
  {
    id: 'day4-shibuya',
    dayLabel: 'DAY 4',
    dateLabel: '1월 16일 (토)',
    title: '시부야 스카이 전망대 & 스크램블 교차로 야경',
    subtitle: '신주쿠 & 시부야 도심 한복판을 내려다보는 360도 루프탑 야경',
    desktopUrl: '/backgrounds/day4_shibuya_sky_night.jpg',
    mobileUrl: '/backgrounds/day4_shibuya_sky_night.jpg',
    mobilePosition: 'center center',
    desktopPosition: 'center center'
  },
  {
    id: 'day5-tokyotower',
    dayLabel: 'DAY 5',
    dateLabel: '1월 17일 (일)',
    title: '롯폰기 힐스 모리타워 & 도쿄타워 야경',
    subtitle: '도쿄 클래식 코스 하이라이트 · 황금빛 도쿄타워 파노라마 야경',
    desktopUrl: tokyoTowerDesktopImg,
    mobileUrl: tokyoTowerMobileImg,
    mobilePosition: 'center 15%',
    desktopPosition: 'center center'
  },
  {
    id: 'day5-ginza',
    dayLabel: 'DAY 5',
    dateLabel: '1월 17일 (일)',
    title: '긴자 와코 시계탑 & 추오도리 야경',
    subtitle: '쓰키지 장외시장 미식 산책 후 긴자·오모테산도 화려한 밤거리',
    desktopUrl: '/backgrounds/day5_ginza_night.jpg',
    mobileUrl: '/backgrounds/day5_ginza_night.jpg',
    mobilePosition: '38% 35%',
    desktopPosition: 'center 40%'
  }
];

// 4 Netflix-style Profiles for Tokyo Expedition (Disney Princess Moms & Playful Smurf Boys)
interface ProfileRoleMeta {
  id: string;
  role: string;
  roleBadge: string;
}

const PROFILE_ROLE_META: Record<string, ProfileRoleMeta> = {
  kakao_hyunwoo_mom: {
    id: 'kakao_hyunwoo_mom',
    role: '디즈니 공주 👑',
    roleBadge: 'text-amber-300 font-bold'
  },
  kakao_sehyun_mom: {
    id: 'kakao_sehyun_mom',
    role: '디즈니 공주 ❄️',
    roleBadge: 'text-sky-300 font-bold'
  },
  kakao_hyunwoo: {
    id: 'kakao_hyunwoo',
    role: '개구쟁이 스머프 🍄',
    roleBadge: 'text-sky-300 font-bold'
  },
  kakao_sehyun: {
    id: 'kakao_sehyun',
    role: '개구쟁이 스머프 👓',
    roleBadge: 'text-emerald-300 font-bold'
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onClose,
  canDismiss = false
}) => {
  const [currentBgIndex, setCurrentBgIndex] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return true;
  });

  const [effectiveMembers, setEffectiveMembers] = useState(() => getEffectivePresetMembers());
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => detectDeviceInfo());
  const [accessDeniedAlert, setAccessDeniedAlert] = useState<{
    profileName: string;
  } | null>(null);

  useEffect(() => {
    // 0. Request High-Entropy Client Hints for exact Android Galaxy Fold8 model code
    requestHighEntropyDeviceModel(() => {
      setDeviceInfo(detectDeviceInfo());
    });

    // 1. Fetch latest shared profiles from Express server DB (profiles_db.json)
    fetchServerProfiles()
      .then(() => {
        setEffectiveMembers(getEffectivePresetMembers());
      })
      .catch(() => {});

    // 2. Subscribe to profile & device updates across components
    const unsubscribe = subscribeToProfiles(() => {
      setEffectiveMembers(getEffectivePresetMembers());
      setDeviceInfo(detectDeviceInfo());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setDeviceInfo(detectDeviceInfo());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload all 9 Tokyo itinerary images & cycle dynamically every 1.8 seconds (1800ms)
  useEffect(() => {
    TOKYO_BACKGROUNDS.forEach((item) => {
      const img1 = new Image();
      img1.src = item.desktopUrl;
      const img2 = new Image();
      img2.src = item.mobileUrl;
    });

    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % TOKYO_BACKGROUNDS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Auto-hide access denied alert after 3.5 seconds
  useEffect(() => {
    if (!accessDeniedAlert) return;
    const timer = setTimeout(() => {
      setAccessDeniedAlert(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [accessDeniedAlert]);

  // One-click instant login as selected profile (with device model access restriction check)
  const handleSelectProfile = (presetId: string, nickname: string) => {
    const accessCheck = checkProfileDeviceAccess(presetId, deviceInfo);
    if (!accessCheck.allowed) {
      setAccessDeniedAlert({
        profileName: nickname
      });
      return;
    }

    setAccessDeniedAlert(null);
    setSelectedId(presetId);
    const user = createKakaoUserFromPreset(presetId);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 120);
  };

  const activeBg = TOKYO_BACKGROUNDS[currentBgIndex] || TOKYO_BACKGROUNDS[0];

  return (
    <div
      className="fixed inset-0 w-full min-h-screen bg-black text-white flex flex-col justify-between font-sans select-none z-[9999] overflow-hidden"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '-webkit-fill-available'
      }}
    >
      {/* 1. 9 Itinerary Destinations & Night View Photos (Fast 1.8s Crossfade) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {TOKYO_BACKGROUNDS.map((bg, idx) => {
          const isActive = idx === currentBgIndex;
          const bgUrl = isMobile ? bg.mobileUrl : bg.desktopUrl;
          const bgPos = isMobile ? bg.mobilePosition : bg.desktopPosition;

          return (
            <div
              key={bg.id}
              className={`absolute inset-0 bg-cover transition-all duration-600 ease-out transform ${
                isActive
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url(${bgUrl})`,
                backgroundPosition: bgPos
              }}
            />
          );
        })}

        {/* Cinematic Contrast Vignette Overlay */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
      </div>

      {/* 2. Top Itinerary Day & Location Caption Bar */}
      <div
        className="relative z-20 w-full max-w-xl mx-auto px-4 pt-4 sm:pt-6 flex flex-col gap-2"
        style={{ marginTop: 'max(0.25rem, env(safe-area-inset-top, 0.25rem))' }}
      >
        {/* Fast 9-Slide Progress Indicator Bars */}
        <div className="flex items-center gap-1.5 w-full">
          {TOKYO_BACKGROUNDS.map((item, idx) => {
            const isCurrent = idx === currentBgIndex;
            const isPast = idx < currentBgIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentBgIndex(idx)}
                aria-label={`${item.dayLabel} ${item.title}`}
                className="flex-1 py-2 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.85)]'
                      : isPast
                      ? 'bg-white/60 group-hover:bg-white/80'
                      : 'bg-white/25 group-hover:bg-white/45'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Active Itinerary Day & Spot Name Display */}
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setCurrentBgIndex((prev) => (prev + 1) % TOKYO_BACKGROUNDS.length)
            }
            className="text-left group cursor-pointer focus:outline-none"
            title="클릭하여 다음 여행지 사진 보기"
          >
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-tight">
              <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="text-yellow-300 font-mono">{activeBg.dayLabel}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span className="text-white/80 font-medium">{activeBg.dateLabel}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span className="text-white/60 font-mono text-[11px] tabular-nums">
                {currentBgIndex + 1}/{TOKYO_BACKGROUNDS.length}
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] group-hover:text-yellow-200 transition-colors">
                {activeBg.title}
              </h1>
              <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-yellow-300 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            <p className="text-[11px] sm:text-xs text-white/75 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] line-clamp-1">
              {activeBg.subtitle}
            </p>
          </button>

          {/* Optional dismiss button if opened modally */}
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/45 hover:bg-black/65 text-white/80 hover:text-white backdrop-blur-sm transition-all cursor-pointer shrink-0"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Netflix Mobile Profile Selector (Positioned cleanly at bottom above safe area) */}
      <div
        className="relative z-20 w-full max-w-xl mx-auto px-4 pb-8 sm:pb-12 flex flex-col items-center"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}
      >
        {/* Access Denied Toast Alert when clicking a restricted profile (단일 문구만 표시) */}
        {accessDeniedAlert && (
          <div className="w-fit max-w-md mb-4 px-4 py-2 rounded-full bg-rose-950/90 border border-rose-400/60 backdrop-blur-md shadow-[0_8px_30px_rgba(225,29,72,0.45)] flex items-center gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
            <div className="text-xs sm:text-sm font-extrabold text-rose-200 whitespace-nowrap">
              🔒 [{accessDeniedAlert.profileName}] 프로필 접근 제한
            </div>
            <button
              type="button"
              onClick={() => setAccessDeniedAlert(null)}
              className="text-rose-300 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* "프로필을 선택하세요" Header Text */}
        <h2 className="text-base sm:text-lg font-medium text-white/95 tracking-tight mb-4 sm:mb-6 text-center drop-shadow-md">
          프로필을 선택하세요
        </h2>

        {/* 4 Profile Buttons in a Row */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-6 w-full">
          {effectiveMembers.map((member) => {
            const isPressed = selectedId === member.id;
            const charAvatar = getCharacterAvatarById(member.avatarId, member.id);
            const roleMeta = PROFILE_ROLE_META[member.id];

            const roleText =
              member.avatarId !==
              (member.id === 'kakao_hyunwoo_mom'
                ? 'disney_rapunzel'
                : member.id === 'kakao_sehyun_mom'
                ? 'disney_elsa'
                : member.id === 'kakao_hyunwoo'
                ? 'smurf_jokey'
                : 'smurf_brainy')
                ? `${charAvatar.emoji} ${charAvatar.name}`
                : roleMeta?.role || `${charAvatar.emoji} ${charAvatar.name}`;

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelectProfile(member.id, member.nickname)}
                className="group flex flex-col items-center cursor-pointer transition-all duration-150 outline-none active:scale-95"
              >
                {/* Netflix Squircle Avatar Card */}
                <div
                  className={`relative w-16 h-16 sm:w-22 sm:h-22 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${
                    charAvatar.bgGradient
                  } p-0 transition-all duration-200 overflow-hidden flex items-center justify-center border-2 ${
                    isPressed
                      ? 'border-yellow-300 ring-4 ring-yellow-400/60 scale-105 shadow-[0_0_25px_rgba(250,204,21,0.7)]'
                      : `${charAvatar.cardBorder} group-hover:border-yellow-300 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(250,204,21,0.45)]`
                  }`}
                >
                  {/* Avatar Portrait (Custom uploaded photo or Movie/Game Character) */}
                  {member.profileImageUrl ? (
                    <img
                      src={member.profileImageUrl}
                      alt={member.nickname}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    charAvatar.renderSvg(
                      'w-full h-full group-hover:scale-105 transition-transform duration-300'
                    )
                  )}

                  {/* Inner bevel overlay with subtle golden rim */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-black/25 via-transparent to-yellow-400/10 pointer-events-none" />
                </div>

                {/* Profile Name Text below avatar */}
                <span
                  className={`mt-2 text-xs sm:text-sm font-semibold tracking-tight text-center transition-colors duration-150 ${
                    isPressed
                      ? 'text-yellow-300 font-bold'
                      : 'text-white/95 group-hover:text-yellow-200'
                  }`}
                >
                  {member.nickname}
                </span>

                {/* Character distinct role tag */}
                <span
                  className={`text-[10px] sm:text-[11px] font-medium ${
                    roleMeta?.roleBadge || charAvatar.badgeColor
                  } mt-0.5 whitespace-nowrap`}
                >
                  {roleText}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
