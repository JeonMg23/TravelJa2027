import React, { useState, useEffect } from 'react';
import { KakaoAuthUser } from '../types/auth';
import { createKakaoUserFromPreset } from '../services/kakaoAuth';
import { X } from 'lucide-react';

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

// 5 Curated High-Definition Tokyo Cityscape & Night View Photos (Crossfade Slideshow)
// 스마트폰에서는 세로 9:16 랜드마크 중심 사진으로 건축물이 짤리지 않고 상단에 선명하게 표시됨
interface TokyoBackground {
  title: string;
  desktopUrl: string;
  mobileUrl: string;
  mobilePosition: string;
  desktopPosition: string;
}

const TOKYO_BACKGROUNDS: TokyoBackground[] = [
  {
    title: '도쿄 타워 야경',
    desktopUrl: tokyoTowerDesktopImg,
    mobileUrl: tokyoTowerMobileImg,
    mobilePosition: 'center 15%',
    desktopPosition: 'center center'
  },
  {
    title: '도쿄 스카이트리 & 스미다가와 야경',
    desktopUrl: tokyoSkytreeDesktopImg,
    mobileUrl: tokyoSkytreeMobileImg,
    mobilePosition: 'center 12%',
    desktopPosition: 'center center'
  },
  {
    title: '아사쿠사 센소지 & 오층탑 라이트업',
    desktopUrl: sensojiTempleDesktopImg,
    mobileUrl: sensojiPagodaMobileImg,
    mobilePosition: 'center 18%',
    desktopPosition: 'center center'
  },
  {
    title: '도쿄 일몰 노을 & 도시 전경',
    desktopUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1080&q=80',
    mobilePosition: 'center center',
    desktopPosition: 'center center'
  },
  {
    title: '레인보우 브릿지 & 오다이바 야경',
    desktopUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1920&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1080&q=80',
    mobilePosition: 'center center',
    desktopPosition: 'center center'
  }
];

// 4 Netflix-style Profiles for Tokyo Expedition (Black & Gold Theme with Distinct Character Roles)
interface ProfileItem {
  id: string;
  name: string;
  role: string;
  roleBadge: string;
  bgGradient: string;
  cardBorder: string;
  avatarSvg: React.ReactNode;
}

const PROFILES: ProfileItem[] = [
  {
    id: 'kakao_hyunwoo_mom',
    name: '현우맘',
    role: '원정 가이드 🌸',
    roleBadge: 'text-amber-300',
    // 흑요석 블랙 & 로즈 골드 그라데이션
    bgGradient: 'from-black via-[#2e1d14] to-[#c69234]',
    cardBorder: 'border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.25)]',
    avatarSvg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none">
        {/* Cute Mom Character Face */}
        <circle cx="50" cy="50" r="38" fill="#FFF1F2" />
        {/* Soft Rosy Cheeks */}
        <ellipse cx="33" cy="58" rx="6" ry="4" fill="#FDA4AF" opacity="0.85" />
        <ellipse cx="67" cy="58" rx="6" ry="4" fill="#FDA4AF" opacity="0.85" />
        {/* Hair bangs */}
        <path d="M 22 45 Q 50 20 78 45 Q 65 30 50 32 Q 35 30 22 45 Z" fill="#3B1812" />
        <path d="M 18 52 Q 22 28 50 24 Q 78 28 82 52 Q 86 68 80 78 Q 74 62 76 50 Q 72 34 50 34 Q 28 34 24 50 Q 26 62 20 78 Q 14 68 18 52 Z" fill="#3B1812" />
        {/* Smiling Warm Eyes */}
        <path d="M 32 48 Q 40 43 44 49" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <path d="M 56 49 Q 60 43 68 48" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        {/* Sweet Smile */}
        <path d="M 43 60 Q 50 67 57 60" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
        {/* Golden Heart Hairpin */}
        <path d="M 69 28 C 67 23 61 25 63 29 L 69 35 L 75 29 C 77 25 71 23 69 28 Z" fill="#FACC15" stroke="#FEF08A" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'kakao_sehyun_mom',
    name: '세현맘',
    role: '맛집 탐색대장 💜',
    roleBadge: 'text-yellow-300',
    // 흑요석 블랙 & 로얄 바이올렛 골드 그라데이션
    bgGradient: 'from-black via-[#26152b] to-[#d4af37]',
    cardBorder: 'border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.25)]',
    avatarSvg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none">
        {/* Elegant Mom Character Face */}
        <circle cx="50" cy="50" r="38" fill="#FDF4FF" />
        {/* Soft Peach Cheeks */}
        <ellipse cx="32" cy="58" rx="6" ry="4" fill="#F0ABFC" opacity="0.85" />
        <ellipse cx="68" cy="58" rx="6" ry="4" fill="#F0ABFC" opacity="0.85" />
        {/* Stylish Hair */}
        <path d="M 20 50 Q 25 24 50 22 Q 75 24 80 50 Q 84 66 82 76 Q 74 58 75 46 Q 68 30 50 30 Q 32 30 25 46 Q 26 58 18 76 Q 16 66 20 50 Z" fill="#2E1038" />
        <path d="M 28 38 Q 45 32 54 44 Q 65 34 74 40" stroke="#2E1038" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Sparkling Big Eyes */}
        <ellipse cx="38" cy="49" rx="3.5" ry="4.5" fill="#1E293B" />
        <circle cx="39.5" cy="47.5" r="1.5" fill="#FFFFFF" />
        <ellipse cx="62" cy="49" rx="3.5" ry="4.5" fill="#1E293B" />
        <circle cx="63.5" cy="47.5" r="1.5" fill="#FFFFFF" />
        {/* Joyful Smile */}
        <path d="M 42 61 Q 50 68 58 61" stroke="#A21CAF" strokeWidth="3" strokeLinecap="round" />
        {/* Golden Jewel Flower Pin */}
        <circle cx="73" cy="30" r="4.5" fill="#FACC15" />
        <circle cx="73" cy="30" r="2" fill="#EAB308" />
        <circle cx="73" cy="30" r="0.8" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: 'kakao_hyunwoo',
    name: '현우',
    role: '열혈 모험가 ⚡',
    roleBadge: 'text-amber-400 font-bold',
    // 흑요석 블랙 & 일렉트릭 썬더 골드 그라데이션
    bgGradient: 'from-black via-[#162033] to-[#facc15]',
    cardBorder: 'border-yellow-400/80 shadow-[0_0_18px_rgba(250,204,21,0.35)]',
    avatarSvg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none">
        {/* Adventurous Boy Face */}
        <circle cx="50" cy="50" r="38" fill="#F0F9FF" />
        {/* Boyish short hair & cap */}
        <path d="M 24 45 Q 50 20 76 45 Q 68 28 50 26 Q 32 28 24 45 Z" fill="#0C2540" />
        <path d="M 22 36 Q 50 18 78 36 L 82 42 L 18 42 Z" fill="#0F3860" />
        {/* Cap visor */}
        <path d="M 14 42 Q 50 36 86 42 L 80 47 Q 50 42 20 47 Z" fill="#0A223B" />
        {/* Iconic Golden Lightning Bolt on Cap */}
        <path d="M 50 25 L 46 33 L 51 33 L 48 40 L 56 31 L 51 31 Z" fill="#FACC15" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Cheerful Adventurer Eyes */}
        <ellipse cx="37" cy="53" rx="4" ry="5" fill="#0F172A" />
        <circle cx="38.5" cy="51.5" r="1.8" fill="#FFFFFF" />
        <ellipse cx="63" cy="53" rx="4" ry="5" fill="#0F172A" />
        <circle cx="64.5" cy="51.5" r="1.8" fill="#FFFFFF" />
        {/* Playful Cheeks */}
        <ellipse cx="31" cy="61" rx="5" ry="3" fill="#BAE6FD" />
        <ellipse cx="69" cy="61" rx="5" ry="3" fill="#BAE6FD" />
        {/* Confident Open Smile */}
        <path d="M 40 64 Q 50 75 60 64 Z" fill="#E11D48" />
      </svg>
    )
  },
  {
    id: 'kakao_sehyun',
    name: '세현',
    role: '장난꾸러기 🎧',
    roleBadge: 'text-emerald-300',
    // 흑요석 블랙 & 네온 제이드 골드 그라데이션
    bgGradient: 'from-black via-[#0d261e] to-[#eab308]',
    cardBorder: 'border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.25)]',
    avatarSvg: (
      <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none">
        {/* Playful Explorer Boy Face */}
        <circle cx="50" cy="50" r="38" fill="#F0FDF4" />
        {/* Cute hair */}
        <path d="M 26 44 Q 50 24 74 44 Q 66 30 50 28 Q 34 30 26 44 Z" fill="#0B2B20" />
        {/* Gold & Jade DJ Headphones */}
        <path d="M 20 48 Q 20 22 50 20 Q 80 22 80 48" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="14" y="44" width="9" height="18" rx="4.5" fill="#047857" stroke="#FACC15" strokeWidth="1.2" />
        <rect x="77" y="44" width="9" height="18" rx="4.5" fill="#047857" stroke="#FACC15" strokeWidth="1.2" />
        {/* Cheerful Wink & Sparkling Eye */}
        <path d="M 33 53 Q 39 47 45 53" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="63" cy="52" rx="4" ry="5" fill="#0F172A" />
        <circle cx="64.5" cy="50.5" r="1.8" fill="#FFFFFF" />
        {/* Soft Cheeks */}
        <ellipse cx="33" cy="61" rx="5" ry="3.5" fill="#A7F3D0" />
        <ellipse cx="67" cy="61" rx="5" ry="3.5" fill="#A7F3D0" />
        {/* Bright Smile */}
        <path d="M 42 63 Q 50 72 58 63" stroke="#047857" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </svg>
    )
  }
];

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload Tokyo cityscape images (both desktop & mobile versions) & smoothly cycle every 5 seconds
  useEffect(() => {
    TOKYO_BACKGROUNDS.forEach((item) => {
      const img1 = new Image();
      img1.src = item.desktopUrl;
      const img2 = new Image();
      img2.src = item.mobileUrl;
    });

    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % TOKYO_BACKGROUNDS.length);
    }, 5200);

    return () => clearInterval(interval);
  }, []);

  // One-click instant login as selected profile
  const handleSelectProfile = (presetId: string) => {
    setSelectedId(presetId);
    const user = createKakaoUserFromPreset(presetId);
    // Smooth responsive tactile press feedback before entering
    setTimeout(() => {
      onLoginSuccess(user);
    }, 120);
  };

  return (
    <div
      className="fixed inset-0 w-full min-h-screen bg-black text-white flex flex-col justify-end font-sans select-none z-[9999] overflow-hidden"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '-webkit-fill-available'
      }}
    >
      {/* 1. Tokyo Cityscape & Night View Photos (5-image smooth crossfade) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {TOKYO_BACKGROUNDS.map((bg, idx) => {
          const isActive = idx === currentBgIndex;
          const bgUrl = isMobile ? bg.mobileUrl : bg.desktopUrl;
          const bgPos = isMobile ? bg.mobilePosition : bg.desktopPosition;

          return (
            <div
              key={bg.title}
              className={`absolute inset-0 bg-cover transition-all duration-1200 ease-in-out transform ${
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

        {/* Cinematic Netflix-style Vignette Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* Optional dismiss button if opened modally */}
      {canDismiss && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-sm transition-all cursor-pointer"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* 2. Netflix Mobile Profile Selector (Positioned cleanly at bottom above safe area) */}
      <div
        className="relative z-20 w-full max-w-xl mx-auto px-4 pb-8 sm:pb-12 flex flex-col items-center"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}
      >
        {/* "프로필을 선택하세요" Header Text (Exactly as requested) */}
        <h2 className="text-base sm:text-lg font-medium text-white/95 tracking-tight mb-5 sm:mb-6 text-center drop-shadow-md">
          프로필을 선택하세요
        </h2>

        {/* 4 Profile Buttons in a Row (현우맘, 세현맘, 현우, 세현) */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-6 w-full">
          {PROFILES.map((profile) => {
            const isPressed = selectedId === profile.id;

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleSelectProfile(profile.id)}
                className="group flex flex-col items-center cursor-pointer transition-all duration-150 outline-none active:scale-95"
              >
                {/* Netflix Squircle Avatar Card (Black & Gold Theme) */}
                <div
                  className={`relative w-16 h-16 sm:w-22 sm:h-22 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${
                    profile.bgGradient
                  } p-1 transition-all duration-200 overflow-hidden flex items-center justify-center border-2 ${
                    isPressed
                      ? 'border-yellow-300 ring-4 ring-yellow-400/60 scale-105 shadow-[0_0_25px_rgba(250,204,21,0.7)]'
                      : `${profile.cardBorder} group-hover:border-yellow-300 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(250,204,21,0.45)]`
                  }`}
                >
                  {/* Avatar SVG Portrait */}
                  {profile.avatarSvg}

                  {/* Inner bevel overlay with subtle golden rim */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-black/30 via-transparent to-yellow-400/15 pointer-events-none" />
                </div>

                {/* Profile Name Text below avatar */}
                <span
                  className={`mt-2 text-xs sm:text-sm font-semibold tracking-tight text-center transition-colors duration-150 ${
                    isPressed
                      ? 'text-yellow-300 font-bold'
                      : 'text-white/95 group-hover:text-yellow-200'
                  }`}
                >
                  {profile.name}
                </span>

                {/* Character distinct role tag */}
                <span className={`text-[10px] sm:text-[11px] font-medium ${profile.roleBadge} mt-0.5 whitespace-nowrap`}>
                  {profile.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
