import React, { useState, useEffect } from 'react';
import { KakaoAuthUser } from '../types/auth';
import { createKakaoUserFromPreset, getEffectivePresetMembers } from '../services/kakaoAuth';
import { getCharacterAvatarById } from '../data/characterAvatars';
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

  const effectiveMembers = getEffectivePresetMembers();

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

        {/* 4 Profile Buttons in a Row (현우맘: 디즈니 공주, 세현맘: 디즈니 공주, 현우: 개구쟁이 스머프, 세현: 개구쟁이 스머프) */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-6 w-full">
          {effectiveMembers.map((member) => {
            const isPressed = selectedId === member.id;
            const charAvatar = getCharacterAvatarById(member.avatarId, member.id);
            const roleMeta = PROFILE_ROLE_META[member.id];
            const roleText =
              member.avatarId !== (member.id === 'kakao_hyunwoo_mom' ? 'disney_rapunzel' : member.id === 'kakao_sehyun_mom' ? 'disney_elsa' : member.id === 'kakao_hyunwoo' ? 'smurf_jokey' : 'smurf_brainy')
                ? `${charAvatar.emoji} ${charAvatar.name}`
                : roleMeta?.role || `${charAvatar.emoji} ${charAvatar.name}`;

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelectProfile(member.id)}
                className="group flex flex-col items-center cursor-pointer transition-all duration-150 outline-none active:scale-95"
              >
                {/* Netflix Squircle Avatar Card */}
                <div
                  className={`relative w-16 h-16 sm:w-22 sm:h-22 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${
                    charAvatar.bgGradient
                  } p-1 transition-all duration-200 overflow-hidden flex items-center justify-center border-2 ${
                    isPressed
                      ? 'border-yellow-300 ring-4 ring-yellow-400/60 scale-105 shadow-[0_0_25px_rgba(250,204,21,0.7)]'
                      : `${charAvatar.cardBorder} group-hover:border-yellow-300 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(250,204,21,0.45)]`
                  }`}
                >
                  {/* Avatar Portrait (Custom uploaded photo or SVG Character) */}
                  {member.profileImageUrl ? (
                    <img
                      src={member.profileImageUrl}
                      alt={member.nickname}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    charAvatar.renderSvg('w-full h-full p-0.5')
                  )}

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
