import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  BellRing,
  CheckCircle2,
  Lock,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Stamp,
  Trash2,
  Trophy,
  X,
  MessageSquareHeart,
  Check
} from 'lucide-react';
import {
  StampMissionItem,
  PRAISE_BADGE_TIERS,
  getBoyBadgeStatus,
  MAX_TITLE_LENGTH,
  MAX_PLACE_TAG_LENGTH,
  MAX_PRAISE_NOTE_LENGTH
} from '../services/stampMissionService';
import { ScheduleThemeId, SCHEDULE_THEMES } from '../data/scheduleThemes';
import { getEffectivePresetMembers, subscribeToProfiles } from '../services/kakaoAuth';
import { getCharacterAvatarById, CharacterAvatarOption } from '../data/characterAvatars';
import { KakaoAuthUser } from '../types/auth';

interface StampMissionFloatingButtonProps {
  missions: StampMissionItem[];
  onClick: () => void;
  scheduleThemeId: ScheduleThemeId;
  currentUser?: KakaoAuthUser | null;
  isLandingPage?: boolean;
}

export const StampMissionFloatingButton: React.FC<StampMissionFloatingButtonProps> = ({
  missions,
  onClick,
  scheduleThemeId,
  currentUser,
  isLandingPage = false
}) => {
  const theme = SCHEDULE_THEMES[scheduleThemeId] || SCHEDULE_THEMES['classic-light'];

  const activeMissions = useMemo(
    () => missions.filter((m) => !m.isDeleted),
    [missions]
  );

  const hyunwooCount = useMemo(
    () => activeMissions.filter((m) => m.hyunwooStamped).length,
    [activeMissions]
  );
  const sehyunCount = useMemo(
    () => activeMissions.filter((m) => m.sehyunStamped).length,
    [activeMissions]
  );
  const hyunwooReqCount = useMemo(
    () => activeMissions.filter((m) => !m.hyunwooStamped && m.hyunwooRequested).length,
    [activeMissions]
  );
  const sehyunReqCount = useMemo(
    () => activeMissions.filter((m) => !m.sehyunStamped && m.sehyunRequested).length,
    [activeMissions]
  );

  const totalCount = activeMissions.length;
  const totalPendingRequests = hyunwooReqCount + sehyunReqCount;

  const mySonRequestCount = useMemo(() => {
    if (currentUser?.id === 'kakao_hyunwoo_mom') return hyunwooReqCount;
    if (currentUser?.id === 'kakao_sehyun_mom') return sehyunReqCount;
    return totalPendingRequests;
  }, [currentUser?.id, hyunwooReqCount, sehyunReqCount, totalPendingRequests]);

  const buttonSurfaceClass = useMemo(() => {
    switch (scheduleThemeId) {
      case 'tokyo-night-glass':
        return 'bg-[#111C16]/95 border-[#BEF264]/60 text-[#F7FEE7] shadow-[0_10px_28px_rgba(163,230,53,0.28)] hover:border-[#D9F99D]';
      case 'intro-thunder':
        return 'bg-zinc-950/95 border-amber-400/70 text-amber-200 shadow-[0_10px_28px_rgba(250,204,21,0.3)] hover:border-amber-300';
      case 'cyber-akiba':
        return 'bg-[#090B1A]/95 border-cyan-400/70 text-cyan-100 shadow-[0_10px_28px_rgba(6,182,212,0.3)] hover:border-cyan-300';
      case 'sakura-editorial':
        return 'bg-[#1A0D18]/95 border-pink-400/60 text-pink-100 shadow-[0_10px_28px_rgba(244,114,182,0.3)] hover:border-pink-300';
      case 'classic-light':
      default:
        return 'bg-slate-900/95 border-indigo-400/50 text-white shadow-[0_10px_25px_rgba(15,23,42,0.28)] hover:bg-slate-800';
    }
  }, [scheduleThemeId]);

  const iconAccentClass = useMemo(() => {
    switch (scheduleThemeId) {
      case 'tokyo-night-glass':
        return 'bg-[#D9F99D] text-[#0B150F]';
      case 'intro-thunder':
        return 'bg-amber-400 text-black';
      case 'cyber-akiba':
        return 'bg-cyan-400 text-slate-950';
      case 'sakura-editorial':
        return 'bg-pink-400 text-slate-950';
      case 'classic-light':
      default:
        return 'bg-amber-400 text-slate-950';
    }
  }, [scheduleThemeId]);

  return (
    <div
      className={`fixed right-3.5 sm:right-6 z-40 ${
        isLandingPage ? 'bottom-5 sm:bottom-6' : 'bottom-20 md:bottom-6'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`relative group flex items-center gap-2.5 pl-2.5 pr-3.5 py-2.5 min-h-[48px] rounded-2xl border backdrop-blur-md cursor-pointer transition-transform duration-150 active:scale-95 hover:-translate-y-0.5 ${buttonSurfaceClass}`}
        title="소년 원정대 일일 스탬프 미션 & 칭찬 배지 보드 열기"
      >
        {mySonRequestCount > 0 && (
          <span className="absolute -top-2 -right-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black tracking-tight shadow-md flex items-center gap-1 animate-bounce">
            <BellRing className="w-3 h-3" />
            <span>요청 {mySonRequestCount}</span>
          </span>
        )}

        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black shadow-xs transition-transform duration-150 group-hover:scale-105 ${iconAccentClass}`}
        >
          <Trophy className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="text-left leading-tight">
          <div className="text-xs sm:text-sm font-black tracking-tight whitespace-nowrap flex items-center gap-1.5">
            <span>스탬프 미션</span>
            <span
              className={`text-[11px] font-mono tabular-nums font-bold ${
                theme.isDark ? theme.accentText : 'text-amber-300'
              }`}
            >
              {hyunwooCount + sehyunCount}/{totalCount * 2}
            </span>
          </div>
          <div className="text-[10px] opacity-80 font-mono tabular-nums whitespace-nowrap">
            현우 {hyunwooCount} · 세현 {sehyunCount}
            {totalPendingRequests > 0 ? ` · 요청 ${totalPendingRequests}건` : ''}
          </div>
        </div>
      </button>
    </div>
  );
};

interface RoundCharacterStampButtonProps {
  missionId: string;
  boyKey: 'HYUNWOO' | 'SEHYUN';
  boyNickname: string;
  momNickname: string;
  boyCharacter: CharacterAvatarOption;
  boyCustomImageUrl?: string;
  momCharacter: CharacterAvatarOption;
  momCustomImageUrl?: string;
  isStamped: boolean;
  isRequested: boolean;
  rewardPoint: number;
  canMomStamp: boolean;
  canBoyRequest: boolean;
  isDark: boolean;
  isJustAnimated: boolean;
  onAction: () => void;
}

const RoundCharacterStampButton: React.FC<RoundCharacterStampButtonProps> = ({
  missionId,
  boyKey,
  boyNickname,
  momNickname,
  boyCharacter,
  boyCustomImageUrl,
  momCharacter,
  momCustomImageUrl,
  isStamped,
  isRequested,
  rewardPoint,
  canMomStamp,
  canBoyRequest,
  isDark,
  isJustAnimated,
  onAction
}) => {
  const isHyunwoo = boyKey === 'HYUNWOO';
  const waitingForMom = !isStamped && isRequested;
  const isInteractive = canMomStamp || (canBoyRequest && !isStamped);
  const arcPathId = `stamp-arc-${missionId}-${boyKey}`;

  // Determine circular outer rim styling (Real Rubber Stamp look)
  const stampCircleClass = isStamped
    ? isHyunwoo
      ? 'border-[3.5px] border-rose-500 ring-3 ring-amber-400/90 shadow-[0_8px_24px_rgba(244,63,94,0.45)] -rotate-6'
      : 'border-[3.5px] border-rose-500 ring-3 ring-amber-400/90 shadow-[0_8px_24px_rgba(244,63,94,0.45)] rotate-3'
    : waitingForMom
    ? 'border-[3px] border-dashed border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_18px_rgba(251,191,36,0.4)]'
    : isDark
    ? 'border-[2.5px] border-dashed border-slate-500/80 bg-slate-900/70 hover:border-slate-400'
    : 'border-[2.5px] border-dashed border-slate-300 bg-slate-100/90 hover:border-slate-400';

  // Helper caption below the round stamp
  const statusCaption = useMemo(() => {
    if (isStamped) {
      if (canMomStamp) return `${momNickname} 도장 완료 (터치 시 취소)`;
      return `${momNickname} 참잘했어요 완료!`;
    }
    if (waitingForMom) {
      if (canMomStamp) return `${boyNickname} 요청! 도장 쾅 찍기`;
      if (canBoyRequest) return `${momNickname} 확인 대기중 (취소)`;
      return `${momNickname} 확인 대기중`;
    }
    if (canMomStamp) return `터치해서 컬러 도장 쾅!`;
    if (canBoyRequest) return `터치해서 ${momNickname}께 요청`;
    return `${momNickname} 전용 도장`;
  }, [isStamped, waitingForMom, canMomStamp, canBoyRequest, momNickname, boyNickname]);

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      {/* Main Round Physical Rubber Stamp Button */}
      <button
        type="button"
        onClick={onAction}
        className={`relative group w-24 h-24 sm:w-26 sm:h-26 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none ${stampCircleClass} ${
          isInteractive
            ? 'cursor-pointer active:scale-90 hover:scale-105'
            : 'cursor-not-allowed opacity-85'
        } ${isJustAnimated ? 'scale-115' : ''}`}
        title={
          canMomStamp
            ? isStamped
              ? `${boyNickname} 도장 취소하기`
              : `${boyNickname} 미션 참잘했어요 컬러 도장 찍어주기`
            : canBoyRequest
            ? isStamped
              ? `${momNickname}이 도장을 찍어주었어요!`
              : waitingForMom
              ? `${momNickname}에게 보낸 스탬프 요청 취소하기`
              : `${momNickname}에게 스탬프 도장 요청하기`
            : `${boyNickname} 도장은 ${momNickname}만 찍어줄 수 있습니다`
        }
      >
        {/* 1. Character Portrait Layer (Grayscale before Mom stamps -> Vibrant Full Color after Mom stamps!) */}
        <div
          className={`absolute inset-1 rounded-full overflow-hidden transition-all duration-300 ${
            isStamped
              ? `bg-gradient-to-br ${boyCharacter.bgGradient} grayscale-0 saturate-125 contrast-105 opacity-100`
              : 'bg-slate-800 grayscale contrast-125 brightness-95 opacity-55 group-hover:opacity-75'
          }`}
        >
          {boyCustomImageUrl ? (
            <img
              src={boyCustomImageUrl}
              alt={boyNickname}
              referrerPolicy="no-referrer"
              draggable={false}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isStamped ? 'grayscale-0 scale-105' : 'grayscale'
              }`}
            />
          ) : (
            <img
              src={boyCharacter.imageUrl}
              alt={boyCharacter.name}
              referrerPolicy="no-referrer"
              draggable={false}
              className={`w-full h-full object-cover transition-all duration-300 ${
                boyCharacter.imagePositionClass
              } ${isStamped ? 'grayscale-0' : 'grayscale'}`}
            />
          )}

          {/* Subtle vignette scrim for curved stamp text legibility */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isStamped
                ? 'bg-gradient-to-b from-black/45 via-transparent to-rose-950/75'
                : 'bg-gradient-to-b from-black/55 via-black/15 to-black/75'
            }`}
          />
        </div>

        {/* 2. Authentic Inner Rubber Stamp Double Ring & Curved Arc Inscription (SVG) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <path id={arcPathId} d="M 14,50 A 36,36 0 1,1 86,50" fill="none" />
          </defs>
          {/* Inner notched stamp ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={
              isStamped
                ? 'rgba(254, 240, 138, 0.9)'
                : waitingForMom
                ? 'rgba(251, 191, 36, 0.85)'
                : 'rgba(255, 255, 255, 0.45)'
            }
            strokeWidth="1.4"
            strokeDasharray={isStamped ? '3 2' : '4 3'}
          />
          <text
            fill={
              isStamped
                ? '#FEF08A'
                : waitingForMom
                ? '#FDE047'
                : '#E2E8F0'
            }
            fontSize="7.2"
            fontWeight="900"
            letterSpacing="0.8"
          >
            <textPath href={`#${arcPathId}`} startOffset="50%" textAnchor="middle">
              {isStamped
                ? `★ ${momNickname} 참잘했어요 ★`
                : waitingForMom
                ? `★ ${boyNickname} 도장 요청중 ★`
                : `☆ ${boyNickname} 미션 스탬프 ☆`}
            </textPath>
          </text>
        </svg>

        {/* 3. Mom's Mini Character Approval Seal Coin (Top-Right Rim)
            Also Grayscale before stamping -> Turns Full Color when Mom stamps! */}
        <div
          className={`absolute -top-1 -right-1 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 overflow-hidden shadow-md transition-all duration-300 z-10 ${
            isStamped
              ? `bg-gradient-to-br ${momCharacter.bgGradient} border-amber-300 grayscale-0 scale-105 ring-2 ring-rose-500`
              : waitingForMom
              ? 'bg-slate-800 border-amber-400 grayscale animate-bounce'
              : 'bg-slate-800 border-slate-400/80 grayscale opacity-75'
          }`}
          title={`담당 엄마 캐릭터: ${momNickname} (${momCharacter.name})`}
        >
          {momCustomImageUrl ? (
            <img
              src={momCustomImageUrl}
              alt={momNickname}
              referrerPolicy="no-referrer"
              draggable={false}
              className={`w-full h-full object-cover ${
                isStamped ? 'grayscale-0' : 'grayscale'
              }`}
            />
          ) : (
            <img
              src={momCharacter.imageUrl}
              alt={momCharacter.name}
              referrerPolicy="no-referrer"
              draggable={false}
              className={`w-full h-full object-cover ${momCharacter.imagePositionClass} ${
                isStamped ? 'grayscale-0' : 'grayscale'
              }`}
            />
          )}
          {isStamped && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-rose-600 text-amber-200 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
            </div>
          )}
        </div>

        {/* 4. Top-Left Reward Points Or Request Bell Badge */}
        {isStamped ? (
          <div className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-full bg-rose-600 border border-amber-300 text-amber-200 text-[10px] font-black font-mono tabular-nums shadow-md z-10 -rotate-12">
            +{rewardPoint}P
          </div>
        ) : waitingForMom ? (
          <div className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 border border-white text-[10px] font-black shadow-md flex items-center gap-0.5 z-10 animate-bounce">
            <BellRing className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>요청!</span>
          </div>
        ) : !isInteractive ? (
          <div className="absolute -top-0.5 -left-0.5 w-6 h-6 rounded-full bg-slate-800/90 border border-slate-500/60 text-slate-300 flex items-center justify-center z-10">
            <Lock className="w-3 h-3" />
          </div>
        ) : null}

        {/* 5. Bottom Stamp Seal Ribbon Inside Circle */}
        <div className="absolute bottom-2 inset-x-1.5 flex justify-center pointer-events-none z-10">
          {isStamped ? (
            <div className="px-2 py-0.5 rounded-md bg-rose-600/95 border border-amber-300 text-white text-[10px] font-black tracking-tight shadow-md flex items-center gap-0.5 whitespace-nowrap">
              <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
              <span>참잘했어요!</span>
            </div>
          ) : waitingForMom ? (
            <div
              className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-tight shadow-md flex items-center gap-0.5 whitespace-nowrap ${
                canMomStamp
                  ? 'bg-amber-400 text-slate-950 border border-white animate-pulse'
                  : 'bg-amber-500/90 text-slate-950 border border-amber-200'
              }`}
            >
              {canMomStamp ? (
                <>
                  <Stamp className="w-2.5 h-2.5 shrink-0" />
                  <span>도장 찍기!</span>
                </>
              ) : (
                <>
                  <BellRing className="w-2.5 h-2.5 shrink-0" />
                  <span>요청 대기중</span>
                </>
              )}
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-md bg-black/70 border border-white/25 text-slate-200 text-[10px] font-bold tracking-tight flex items-center gap-0.5 whitespace-nowrap">
              {canMomStamp ? (
                <>
                  <Stamp className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                  <span>도장 쾅!</span>
                </>
              ) : canBoyRequest ? (
                <>
                  <Send className="w-2.5 h-2.5 text-sky-300 shrink-0" />
                  <span>스탬프 요청</span>
                </>
              ) : (
                <span>흑백 미완성</span>
              )}
            </div>
          )}
        </div>

        {/* 6. Celebratory Burst Overlay when just clicked */}
        {isJustAnimated && (
          <div className="absolute -inset-2 rounded-full border-4 border-amber-300 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Bottom Name & Role Action Label */}
      <div className="text-center leading-tight">
        <div className="text-xs font-black flex items-center justify-center gap-1">
          <span
            className={
              isStamped
                ? isHyunwoo
                  ? 'text-blue-500 dark:text-blue-300'
                  : 'text-emerald-600 dark:text-emerald-300'
                : 'opacity-80'
            }
          >
            {boyNickname} 도장
          </span>
          {isStamped && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
        </div>
        <div
          className={`text-[10px] font-semibold mt-0.5 whitespace-nowrap ${
            waitingForMom && canMomStamp
              ? 'text-amber-500 dark:text-amber-300 font-black'
              : 'opacity-70'
          }`}
        >
          {statusCaption}
        </div>
      </div>
    </div>
  );
};

interface StampMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: StampMissionItem[];
  onToggleStamp: (missionId: string, boy: 'HYUNWOO' | 'SEHYUN') => void;
  onToggleStampRequest: (missionId: string, boy: 'HYUNWOO' | 'SEHYUN') => void;
  onApproveAllRequestsForBoy: (boy: 'HYUNWOO' | 'SEHYUN') => void;
  onUpdatePraiseNote: (missionId: string, praiseNote: string) => void;
  onAddMission: (newMission: {
    dayNumber: number;
    title: string;
    placeTag: string;
    rewardPoint: number;
    praiseNote: string;
  }) => void;
  onDeleteMission: (missionId: string) => void;
  onResetMissions: () => void;
  scheduleThemeId: ScheduleThemeId;
  currentUser?: KakaoAuthUser | null;
  initialDayFilter?: number | 'ALL' | 'REQUESTED';
}

export const StampMissionModal: React.FC<StampMissionModalProps> = ({
  isOpen,
  onClose,
  missions,
  onToggleStamp,
  onToggleStampRequest,
  onApproveAllRequestsForBoy,
  onUpdatePraiseNote,
  onAddMission,
  onDeleteMission,
  onResetMissions,
  scheduleThemeId,
  currentUser,
  initialDayFilter = 'ALL'
}) => {
  const theme = SCHEDULE_THEMES[scheduleThemeId] || SCHEDULE_THEMES['classic-light'];
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'ALL' | 'REQUESTED'>(
    initialDayFilter
  );
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newDayNumber, setNewDayNumber] = useState<number>(1);
  const [newTitle, setNewTitle] = useState('');
  const [newPlaceTag, setNewPlaceTag] = useState('도쿄 탐험');
  const [newRewardPoint, setNewRewardPoint] = useState<number>(2);
  const [newPraiseNote, setNewPraiseNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [justAnimatedKey, setJustAnimatedKey] = useState<string | null>(null);
  const [profileSyncTick, setProfileSyncTick] = useState(0);

  // Sync character avatars in real time if updated in ProfileEditModal / Firestore
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToProfiles(() => {
      setProfileSyncTick((t) => t + 1);
    });
    return unsubscribe;
  }, [isOpen]);

  const effectiveMembers = useMemo(
    () => getEffectivePresetMembers(),
    [isOpen, currentUser, profileSyncTick]
  );

  const hyunwooMomProfile = useMemo(
    () =>
      effectiveMembers.find((m) => m.id === 'kakao_hyunwoo_mom') || {
        id: 'kakao_hyunwoo_mom',
        nickname: '현우맘',
        avatarEmoji: '👑',
        avatarId: 'disney_rapunzel',
        profileImageUrl: undefined
      },
    [effectiveMembers]
  );
  const sehyunMomProfile = useMemo(
    () =>
      effectiveMembers.find((m) => m.id === 'kakao_sehyun_mom') || {
        id: 'kakao_sehyun_mom',
        nickname: '세현맘',
        avatarEmoji: '❄️',
        avatarId: 'disney_elsa',
        profileImageUrl: undefined
      },
    [effectiveMembers]
  );
  const hyunwooProfile = useMemo(
    () =>
      effectiveMembers.find((m) => m.id === 'kakao_hyunwoo') || {
        id: 'kakao_hyunwoo',
        nickname: '현우',
        avatarEmoji: '🎁',
        avatarId: 'smurf_jokey',
        profileImageUrl: undefined
      },
    [effectiveMembers]
  );
  const sehyunProfile = useMemo(
    () =>
      effectiveMembers.find((m) => m.id === 'kakao_sehyun') || {
        id: 'kakao_sehyun',
        nickname: '세현',
        avatarEmoji: '👓',
        avatarId: 'smurf_brainy',
        profileImageUrl: undefined
      },
    [effectiveMembers]
  );

  // Character illustrations selected on Login / Profile Edit
  const hyunwooCharacter = useMemo(
    () => getCharacterAvatarById(hyunwooProfile.avatarId, 'kakao_hyunwoo'),
    [hyunwooProfile.avatarId]
  );
  const sehyunCharacter = useMemo(
    () => getCharacterAvatarById(sehyunProfile.avatarId, 'kakao_sehyun'),
    [sehyunProfile.avatarId]
  );
  const hyunwooMomCharacter = useMemo(
    () => getCharacterAvatarById(hyunwooMomProfile.avatarId, 'kakao_hyunwoo_mom'),
    [hyunwooMomProfile.avatarId]
  );
  const sehyunMomCharacter = useMemo(
    () => getCharacterAvatarById(sehyunMomProfile.avatarId, 'kakao_sehyun_mom'),
    [sehyunMomProfile.avatarId]
  );

  // Strict Role Determination
  const activeMemberId = currentUser?.id || null;
  const isHyunwooMom = activeMemberId === 'kakao_hyunwoo_mom';
  const isSehyunMom = activeMemberId === 'kakao_sehyun_mom';
  const isHyunwoo = activeMemberId === 'kakao_hyunwoo';
  const isSehyun = activeMemberId === 'kakao_sehyun';
  const isAnyMom = isHyunwooMom || isSehyunMom;

  const currentLoggedCharacter = useMemo(
    () =>
      getCharacterAvatarById(
        currentUser?.avatarId,
        currentUser?.id || 'kakao_hyunwoo_mom'
      ),
    [currentUser?.avatarId, currentUser?.id]
  );

  const activeMissions = useMemo(
    () => missions.filter((m) => !m.isDeleted),
    [missions]
  );

  const hyunwooPoints = useMemo(
    () =>
      activeMissions.reduce(
        (sum, m) => sum + (m.hyunwooStamped ? m.rewardPoint : 0),
        0
      ),
    [activeMissions]
  );

  const sehyunPoints = useMemo(
    () =>
      activeMissions.reduce(
        (sum, m) => sum + (m.sehyunStamped ? m.rewardPoint : 0),
        0
      ),
    [activeMissions]
  );

  const hyunwooStampCount = useMemo(
    () => activeMissions.filter((m) => m.hyunwooStamped).length,
    [activeMissions]
  );

  const sehyunStampCount = useMemo(
    () => activeMissions.filter((m) => m.sehyunStamped).length,
    [activeMissions]
  );

  const hyunwooPendingRequests = useMemo(
    () => activeMissions.filter((m) => !m.hyunwooStamped && m.hyunwooRequested),
    [activeMissions]
  );

  const sehyunPendingRequests = useMemo(
    () => activeMissions.filter((m) => !m.sehyunStamped && m.sehyunRequested),
    [activeMissions]
  );

  const totalPendingRequestsCount =
    hyunwooPendingRequests.length + sehyunPendingRequests.length;

  const hyunwooBadge = useMemo(() => getBoyBadgeStatus(hyunwooPoints), [hyunwooPoints]);
  const sehyunBadge = useMemo(() => getBoyBadgeStatus(sehyunPoints), [sehyunPoints]);

  const filteredMissions = useMemo(() => {
    if (selectedDayFilter === 'ALL') return activeMissions;
    if (selectedDayFilter === 'REQUESTED') {
      return activeMissions.filter(
        (m) =>
          (!m.hyunwooStamped && m.hyunwooRequested) ||
          (!m.sehyunStamped && m.sehyunRequested)
      );
    }
    return activeMissions.filter((m) => m.dayNumber === selectedDayFilter);
  }, [activeMissions, selectedDayFilter]);

  if (!isOpen) return null;

  const triggerStampFeedback = (key: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([35, 25, 65]);
      }
    } catch {
      // ignore vibration errors
    }
    setJustAnimatedKey(key);
    setTimeout(() => {
      setJustAnimatedKey((prev) => (prev === key ? null : prev));
    }, 320);
  };

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    onAddMission({
      dayNumber: newDayNumber,
      title: trimmedTitle.slice(0, MAX_TITLE_LENGTH),
      placeTag: (newPlaceTag.trim() || '도쿄 미션').slice(0, MAX_PLACE_TAG_LENGTH),
      rewardPoint: newRewardPoint,
      praiseNote: newPraiseNote.trim().slice(0, MAX_PRAISE_NOTE_LENGTH)
    });

    setNewTitle('');
    setNewPraiseNote('');
    setIsAddFormOpen(false);
    setSelectedDayFilter(newDayNumber);
  };

  const handleSavePraiseNote = (missionId: string) => {
    onUpdatePraiseNote(missionId, editingNoteText.trim().slice(0, MAX_PRAISE_NOTE_LENGTH));
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const dayTabs: { label: string; value: number | 'ALL' | 'REQUESTED'; badgeCount?: number }[] = [
    { label: '전체 미션', value: 'ALL' },
    {
      label: '스탬프 요청 대기',
      value: 'REQUESTED',
      badgeCount: totalPendingRequestsCount
    },
    { label: '엄마 칭찬', value: 0 },
    { label: 'Day 1', value: 1 },
    { label: 'Day 2', value: 2 },
    { label: 'Day 3', value: 3 },
    { label: 'Day 4', value: 4 },
    { label: 'Day 5', value: 5 },
    { label: 'Day 6', value: 6 }
  ];

  const defaultMissionIds = new Set([
    'mission_d1_1',
    'mission_d1_2',
    'mission_d1_3',
    'mission_d2_1',
    'mission_d2_2',
    'mission_d2_3',
    'mission_d3_1',
    'mission_d3_2',
    'mission_d3_3',
    'mission_d4_1',
    'mission_d4_2',
    'mission_d5_1',
    'mission_d5_2',
    'mission_d6_1',
    'mission_d6_2',
    'mission_praise_1',
    'mission_praise_2',
    'mission_praise_3'
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-4xl max-h-[92dvh] sm:max-h-[88dvh] rounded-t-3xl sm:rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-colors ${
          theme.isDark
            ? `${theme.cardBg} ${theme.cardBorder} text-white`
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-400/40 rounded-full mx-auto mt-2.5 shrink-0" />

        {/* Modal Header (User Switcher Removed as Requested) */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-3 shrink-0 ${
            theme.isDark ? theme.dividerBorder : 'border-slate-200'
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium opacity-80">
              <span>소년 원정대 캐릭터 스탬프 보드</span>
              <span aria-hidden="true">·</span>
              <span>도장 전 흑백 → 엄마가 찍어주면 컬러 변신!</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
              <h2 className="text-lg sm:text-xl font-black tracking-tight truncate flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                <span>일차별 스탬프 미션 & 칭찬 배지 보드</span>
              </h2>

              {/* Read-only Current Logged-In User Badge (No User Switcher) */}
              {currentUser && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
                    theme.isDark
                      ? 'bg-white/10 border-white/15 text-slate-200'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full overflow-hidden bg-gradient-to-br ${currentLoggedCharacter.bgGradient} shrink-0`}
                  >
                    {currentUser.profileImageUrl ? (
                      <img
                        src={currentUser.profileImageUrl}
                        alt={currentUser.nickname}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={currentLoggedCharacter.imageUrl}
                        alt={currentLoggedCharacter.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${currentLoggedCharacter.imagePositionClass}`}
                      />
                    )}
                  </div>
                  <span>{currentUser.nickname} 접속중</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              theme.isDark
                ? 'hover:bg-white/10 text-slate-300'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
          {/* Mom Incoming Stamp Request Alert Banner */}
          {isHyunwooMom && hyunwooPendingRequests.length > 0 && (
            <div className="rounded-2xl border-2 border-blue-400 bg-blue-500/15 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 border-blue-300 bg-gradient-to-br ${hyunwooCharacter.bgGradient} shrink-0 shadow-sm`}
                >
                  <img
                    src={hyunwooProfile.profileImageUrl || hyunwooCharacter.imageUrl}
                    alt={hyunwooProfile.nickname}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${
                      hyunwooProfile.profileImageUrl ? '' : hyunwooCharacter.imagePositionClass
                    }`}
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-200">
                    {hyunwooProfile.nickname} 대원이 {hyunwooMomProfile.nickname}에게 스탬프 도장{' '}
                    {hyunwooPendingRequests.length}건을 요청했어요!
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">
                    흑백 스탬프 도장을 터치해 컬러 참잘했어요 도장으로 찍어주세요!
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedDayFilter('REQUESTED')}
                  className="px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold bg-white/15 border border-blue-400/50 hover:bg-white/25 cursor-pointer"
                >
                  요청 미션 보기
                </button>
                <button
                  type="button"
                  onClick={() => onApproveAllRequestsForBoy('HYUNWOO')}
                  className="px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Stamp className="w-4 h-4" />
                  <span>{hyunwooPendingRequests.length}건 모두 컬러 도장 찍기</span>
                </button>
              </div>
            </div>
          )}

          {isSehyunMom && sehyunPendingRequests.length > 0 && (
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-500/15 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-300 bg-gradient-to-br ${sehyunCharacter.bgGradient} shrink-0 shadow-sm`}
                >
                  <img
                    src={sehyunProfile.profileImageUrl || sehyunCharacter.imageUrl}
                    alt={sehyunProfile.nickname}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${
                      sehyunProfile.profileImageUrl ? '' : sehyunCharacter.imagePositionClass
                    }`}
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-200">
                    {sehyunProfile.nickname} 대원이 {sehyunMomProfile.nickname}에게 스탬프 도장{' '}
                    {sehyunPendingRequests.length}건을 요청했어요!
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">
                    흑백 스탬프 도장을 터치해 컬러 참잘했어요 도장으로 찍어주세요!
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedDayFilter('REQUESTED')}
                  className="px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold bg-white/15 border border-emerald-400/50 hover:bg-white/25 cursor-pointer"
                >
                  요청 미션 보기
                </button>
                <button
                  type="button"
                  onClick={() => onApproveAllRequestsForBoy('SEHYUN')}
                  className="px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Stamp className="w-4 h-4" />
                  <span>{sehyunPendingRequests.length}건 모두 컬러 도장 찍기</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. Boys Dual Hero Status Cards with Selected Character Avatars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Hyunwoo Card */}
            <div
              className={`rounded-2xl border p-4 transition-all ${
                theme.isDark
                  ? 'bg-blue-950/30 border-blue-400/35'
                  : 'bg-blue-50/70 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-13 h-13 rounded-full overflow-hidden border-2 border-blue-400 bg-gradient-to-br ${hyunwooCharacter.bgGradient} shadow-sm`}
                    >
                      <img
                        src={hyunwooProfile.profileImageUrl || hyunwooCharacter.imageUrl}
                        alt={hyunwooProfile.nickname}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${
                          hyunwooProfile.profileImageUrl ? '' : hyunwooCharacter.imagePositionClass
                        }`}
                      />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-amber-300 bg-gradient-to-br ${hyunwooMomCharacter.bgGradient} shadow-xs`}
                      title={`도장 담당: ${hyunwooMomProfile.nickname} (${hyunwooMomCharacter.name})`}
                    >
                      <img
                        src={hyunwooMomProfile.profileImageUrl || hyunwooMomCharacter.imageUrl}
                        alt={hyunwooMomProfile.nickname}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${
                          hyunwooMomProfile.profileImageUrl
                            ? ''
                            : hyunwooMomCharacter.imagePositionClass
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium opacity-80">
                      캐릭터: {hyunwooCharacter.name} · 담당: {hyunwooMomProfile.nickname}
                    </div>
                    <div className="text-base sm:text-lg font-black flex items-center gap-2">
                      <span>{hyunwooProfile.nickname} 대원</span>
                      {hyunwooPendingRequests.length > 0 && (
                        <span className="text-[11px] font-bold text-amber-500 dark:text-amber-300">
                          (요청 {hyunwooPendingRequests.length}건)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xl sm:text-2xl font-black text-blue-500 dark:text-blue-300">
                    {hyunwooPoints}점
                  </div>
                  <div className="text-xs opacity-75">
                    컬러 도장 {hyunwooStampCount}/{activeMissions.length}개
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-blue-400/20 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>현재 칭호: {hyunwooBadge.currentTier.title}</span>
                </span>
                <span className="font-mono tabular-nums opacity-75">
                  {hyunwooBadge.nextTier
                    ? `다음 등급까지 ${hyunwooBadge.nextTier.minPoints - hyunwooPoints}점`
                    : '최고 등급 달성!'}
                </span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-black/20 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${hyunwooBadge.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Sehyun Card */}
            <div
              className={`rounded-2xl border p-4 transition-all ${
                theme.isDark
                  ? 'bg-emerald-950/30 border-emerald-400/35'
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-13 h-13 rounded-full overflow-hidden border-2 border-emerald-400 bg-gradient-to-br ${sehyunCharacter.bgGradient} shadow-sm`}
                    >
                      <img
                        src={sehyunProfile.profileImageUrl || sehyunCharacter.imageUrl}
                        alt={sehyunProfile.nickname}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${
                          sehyunProfile.profileImageUrl ? '' : sehyunCharacter.imagePositionClass
                        }`}
                      />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-amber-300 bg-gradient-to-br ${sehyunMomCharacter.bgGradient} shadow-xs`}
                      title={`도장 담당: ${sehyunMomProfile.nickname} (${sehyunMomCharacter.name})`}
                    >
                      <img
                        src={sehyunMomProfile.profileImageUrl || sehyunMomCharacter.imageUrl}
                        alt={sehyunMomProfile.nickname}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${
                          sehyunMomProfile.profileImageUrl
                            ? ''
                            : sehyunMomCharacter.imagePositionClass
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium opacity-80">
                      캐릭터: {sehyunCharacter.name} · 담당: {sehyunMomProfile.nickname}
                    </div>
                    <div className="text-base sm:text-lg font-black flex items-center gap-2">
                      <span>{sehyunProfile.nickname} 대원</span>
                      {sehyunPendingRequests.length > 0 && (
                        <span className="text-[11px] font-bold text-amber-500 dark:text-amber-300">
                          (요청 {sehyunPendingRequests.length}건)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-300">
                    {sehyunPoints}점
                  </div>
                  <div className="text-xs opacity-75">
                    컬러 도장 {sehyunStampCount}/{activeMissions.length}개
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-emerald-400/20 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>현재 칭호: {sehyunBadge.currentTier.title}</span>
                </span>
                <span className="font-mono tabular-nums opacity-75">
                  {sehyunBadge.nextTier
                    ? `다음 등급까지 ${sehyunBadge.nextTier.minPoints - sehyunPoints}점`
                    : '최고 등급 달성!'}
                </span>
              </div>
              <div className="mt-2 w-full h-2 rounded-full bg-black/20 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${sehyunBadge.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Praise Badge Progression Showcase */}
          <div
            className={`rounded-2xl border p-4 ${
              theme.isDark
                ? `${theme.subCardBg} ${theme.subCardBorder}`
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>원정대 칭찬 배지 컬렉션 (엄마가 찍어준 컬러 도장 점수로 승급)</span>
              </div>
              <div className="text-xs font-mono tabular-nums opacity-70">
                총 {PRAISE_BADGE_TIERS.length}단계
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRAISE_BADGE_TIERS.map((tier) => {
                const hyunwooUnlocked = hyunwooPoints >= tier.minPoints;
                const sehyunUnlocked = sehyunPoints >= tier.minPoints;
                const anyUnlocked = hyunwooUnlocked || sehyunUnlocked;

                return (
                  <div
                    key={tier.level}
                    className={`rounded-xl border p-3 transition-all ${
                      anyUnlocked
                        ? theme.isDark
                          ? 'bg-white/10 border-amber-400/50'
                          : 'bg-white border-amber-400 shadow-2xs'
                        : 'opacity-55 border-dashed border-slate-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums mb-1">
                      <span className="font-black text-amber-500 dark:text-amber-300">
                        {tier.iconLabel}
                      </span>
                      <span className="opacity-75">{tier.minPoints}점 이상</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold truncate">
                      {tier.title}
                    </div>
                    <div className="text-[11px] opacity-75 mt-0.5 line-clamp-1">
                      {tier.subtitle}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-400/15 text-[11px] font-medium flex items-center gap-1.5">
                      <span
                        className={
                          hyunwooUnlocked
                            ? 'text-blue-500 dark:text-blue-300 font-bold'
                            : 'opacity-45'
                        }
                      >
                        {hyunwooProfile.nickname} {hyunwooUnlocked ? '획득' : '대기'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          sehyunUnlocked
                            ? 'text-emerald-600 dark:text-emerald-300 font-bold'
                            : 'opacity-45'
                        }
                      >
                        {sehyunProfile.nickname} {sehyunUnlocked ? '획득' : '대기'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Day Filter Bar & Quick Add Mission Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {dayTabs.map((tab) => {
                const isActive = selectedDayFilter === tab.value;
                return (
                  <button
                    key={String(tab.value)}
                    type="button"
                    onClick={() => setSelectedDayFilter(tab.value)}
                    className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? theme.isDark
                          ? theme.viewBtnTimelineActive
                          : 'bg-slate-900 text-white shadow-xs'
                        : theme.isDark
                        ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {typeof tab.badgeCount === 'number' && tab.badgeCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black font-mono tabular-nums">
                        {tab.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAnyMom && (
              <button
                type="button"
                onClick={() => setIsAddFormOpen((prev) => !prev)}
                className={`px-3.5 py-2 min-h-[42px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  isAddFormOpen
                    ? 'bg-rose-500 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{isAddFormOpen ? '추가 창 닫기' : '새 미션 · 엄마 칭찬 추가'}</span>
              </button>
            )}
          </div>

          {/* 4. Add Custom Mission / Praise Form */}
          {isAddFormOpen && (
            <form
              onSubmit={handleCreateMission}
              className={`rounded-2xl border p-4 space-y-3.5 animate-in fade-in duration-150 ${
                theme.isDark
                  ? 'bg-white/5 border-amber-400/40'
                  : 'bg-amber-50/60 border-amber-200'
              }`}
            >
              <div className="text-sm font-bold flex items-center justify-between">
                <span>새로운 원정 미션 또는 엄마 칭찬 배지 등록</span>
                <span className="text-xs font-normal opacity-75">
                  등록 시 모든 가족 스마트폰에 즉시 공유됩니다
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">
                    일차 / 구분
                  </label>
                  <select
                    value={newDayNumber}
                    onChange={(e) => setNewDayNumber(Number(e.target.value))}
                    className={`w-full h-11 px-3 rounded-xl border text-xs font-bold ${
                      theme.isDark
                        ? 'bg-slate-900 border-white/20 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value={0}>엄마 특별 칭찬 배지</option>
                    <option value={1}>Day 1 (아사쿠사·스카이트리)</option>
                    <option value={2}>Day 2 (도쿄 디즈니씨)</option>
                    <option value={3}>Day 3 (해리포터·시부야)</option>
                    <option value={4}>Day 4 (후지산 투어)</option>
                    <option value={5}>Day 5 (쓰키지·롯폰기)</option>
                    <option value={6}>Day 6 (마지막 날·귀국)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">
                    장소 · 카테고리 태그
                  </label>
                  <input
                    type="text"
                    value={newPlaceTag}
                    maxLength={MAX_PLACE_TAG_LENGTH}
                    onChange={(e) => setNewPlaceTag(e.target.value)}
                    placeholder="예: 디즈니씨 · 포토미션"
                    className={`w-full h-11 px-3 rounded-xl border text-xs ${
                      theme.isDark
                        ? 'bg-slate-900 border-white/20 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">
                    보상 스탬프 점수
                  </label>
                  <select
                    value={newRewardPoint}
                    onChange={(e) => setNewRewardPoint(Number(e.target.value))}
                    className={`w-full h-11 px-3 rounded-xl border text-xs font-bold ${
                      theme.isDark
                        ? 'bg-slate-900 border-white/20 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value={1}>+1점 (기본 미션)</option>
                    <option value={2}>+2점 (추천 미션)</option>
                    <option value={3}>+3점 (핵심 미션)</option>
                    <option value={5}>+5점 (특급 칭찬 미션)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">
                    미션 제목 (필수)
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    maxLength={MAX_TITLE_LENGTH}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="예: 식당에서 일본어로 '고치소사마데시타(잘 먹었습니다)' 인사하기"
                    className={`w-full h-11 px-3 rounded-xl border text-xs ${
                      theme.isDark
                        ? 'bg-slate-900 border-white/20 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">
                    엄마의 한줄 응원 메모 (선택)
                  </label>
                  <input
                    type="text"
                    value={newPraiseNote}
                    maxLength={MAX_PRAISE_NOTE_LENGTH}
                    onChange={(e) => setNewPraiseNote(e.target.value)}
                    placeholder="예: 성공하면 저녁에 좋아하는 가챠 뽑기 찬스!"
                    className={`w-full h-11 px-3 rounded-xl border text-xs ${
                      theme.isDark
                        ? 'bg-slate-900 border-white/20 text-white placeholder:text-slate-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold opacity-75 hover:opacity-100 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 min-h-[40px] rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow-xs"
                >
                  미션 보드에 등록하기
                </button>
              </div>
            </form>
          )}

          {/* 5. Mission Stamp Cards List with Real Round Character Stamps */}
          {filteredMissions.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 text-center space-y-2 ${
                theme.isDark
                  ? 'bg-white/5 border-white/10 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="text-sm font-bold">
                현재 대기 중인 스탬프 요청 미션이 없습니다.
              </div>
              <div className="text-xs opacity-75">
                {hyunwooProfile.nickname}·{sehyunProfile.nickname} 대원이 흑백 도장 버튼을 눌러 스탬프를 요청하면 이곳에 표시됩니다.
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredMissions.map((mission) => {
                const bothCompleted = mission.hyunwooStamped && mission.sehyunStamped;
                const isCustomMission = !defaultMissionIds.has(mission.missionId);
                const isEditingThisNote = editingNoteId === mission.missionId;
                const hyunwooWaiting = !mission.hyunwooStamped && mission.hyunwooRequested;
                const sehyunWaiting = !mission.sehyunStamped && mission.sehyunRequested;

                return (
                  <div
                    key={mission.missionId}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      bothCompleted
                        ? theme.isDark
                          ? 'bg-amber-500/10 border-amber-400/50'
                          : 'bg-amber-50/50 border-amber-300'
                        : (isHyunwooMom && hyunwooWaiting) || (isSehyunMom && sehyunWaiting)
                        ? theme.isDark
                          ? 'bg-rose-500/10 border-rose-400/60'
                          : 'bg-rose-50/50 border-rose-300'
                        : theme.isDark
                        ? `${theme.subCardBg} ${theme.subCardBorder}`
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Metadata & Title */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs opacity-80 font-medium">
                          <span className="font-bold text-amber-500 dark:text-amber-300">
                            {mission.dayNumber === 0 ? '엄마 특별 칭찬' : `Day ${mission.dayNumber}`}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{mission.placeTag}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums font-bold">
                            +{mission.rewardPoint}점
                          </span>
                          {hyunwooWaiting && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-blue-500 dark:text-blue-300 font-bold">
                                {hyunwooProfile.nickname} 도장 요청중
                              </span>
                            </>
                          )}
                          {sehyunWaiting && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-600 dark:text-emerald-300 font-bold">
                                {sehyunProfile.nickname} 도장 요청중
                              </span>
                            </>
                          )}
                          {bothCompleted && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-rose-500 dark:text-amber-300 font-bold">
                                형제 컬러 도장 완성!
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-bold leading-snug">
                            {mission.title}
                          </h3>
                          {isCustomMission && isAnyMom && (
                            <button
                              type="button"
                              onClick={() => onDeleteMission(mission.missionId)}
                              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:text-rose-400 cursor-pointer shrink-0"
                              title="커스텀 미션 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Mom Praise Note Display / Inline Edit */}
                        {isEditingThisNote ? (
                          <div className="pt-1.5 flex items-center gap-2">
                            <input
                              type="text"
                              value={editingNoteText}
                              maxLength={MAX_PRAISE_NOTE_LENGTH}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                              placeholder="엄마의 칭찬 한마디를 입력하세요"
                              className={`flex-1 h-9 px-3 rounded-lg border text-xs ${
                                theme.isDark
                                  ? 'bg-slate-900 border-white/20 text-white'
                                  : 'bg-slate-50 border-slate-300 text-slate-900'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => handleSavePraiseNote(mission.missionId)}
                              className="px-3 h-9 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>저장</span>
                            </button>
                          </div>
                        ) : (
                          <div className="pt-1 flex items-center gap-2 text-xs opacity-80">
                            <MessageSquareHeart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                            <span className="truncate">
                              {mission.praiseNote || '칭찬 메모를 남겨보세요'}
                            </span>
                            {isAnyMom && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(mission.missionId);
                                  setEditingNoteText(mission.praiseNote || '');
                                }}
                                className="text-[11px] underline opacity-75 hover:opacity-100 whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                메모 수정
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Two Round Physical Rubber Stamp Buttons (Hyunwoo & Sehyun) */}
                      <div className="flex items-center justify-around sm:justify-end gap-5 sm:gap-6 pt-2 sm:pt-0 shrink-0">
                        {/* HYUNWOO ROUND STAMP */}
                        <RoundCharacterStampButton
                          missionId={mission.missionId}
                          boyKey="HYUNWOO"
                          boyNickname={hyunwooProfile.nickname}
                          momNickname={hyunwooMomProfile.nickname}
                          boyCharacter={hyunwooCharacter}
                          boyCustomImageUrl={hyunwooProfile.profileImageUrl}
                          momCharacter={hyunwooMomCharacter}
                          momCustomImageUrl={hyunwooMomProfile.profileImageUrl}
                          isStamped={mission.hyunwooStamped}
                          isRequested={Boolean(mission.hyunwooRequested)}
                          rewardPoint={mission.rewardPoint}
                          canMomStamp={isHyunwooMom}
                          canBoyRequest={isHyunwoo}
                          isDark={theme.isDark}
                          isJustAnimated={justAnimatedKey === `${mission.missionId}_HYUNWOO`}
                          onAction={() => {
                            triggerStampFeedback(`${mission.missionId}_HYUNWOO`);
                            if (isHyunwoo) {
                              if (!mission.hyunwooStamped) {
                                onToggleStampRequest(mission.missionId, 'HYUNWOO');
                              } else {
                                onToggleStamp(mission.missionId, 'HYUNWOO');
                              }
                            } else {
                              onToggleStamp(mission.missionId, 'HYUNWOO');
                            }
                          }}
                        />

                        {/* SEHYUN ROUND STAMP */}
                        <RoundCharacterStampButton
                          missionId={mission.missionId}
                          boyKey="SEHYUN"
                          boyNickname={sehyunProfile.nickname}
                          momNickname={sehyunMomProfile.nickname}
                          boyCharacter={sehyunCharacter}
                          boyCustomImageUrl={sehyunProfile.profileImageUrl}
                          momCharacter={sehyunMomCharacter}
                          momCustomImageUrl={sehyunMomProfile.profileImageUrl}
                          isStamped={mission.sehyunStamped}
                          isRequested={Boolean(mission.sehyunRequested)}
                          rewardPoint={mission.rewardPoint}
                          canMomStamp={isSehyunMom}
                          canBoyRequest={isSehyun}
                          isDark={theme.isDark}
                          isJustAnimated={justAnimatedKey === `${mission.missionId}_SEHYUN`}
                          onAction={() => {
                            triggerStampFeedback(`${mission.missionId}_SEHYUN`);
                            if (isSehyun) {
                              if (!mission.sehyunStamped) {
                                onToggleStampRequest(mission.missionId, 'SEHYUN');
                              } else {
                                onToggleStamp(mission.missionId, 'SEHYUN');
                              }
                            } else {
                              onToggleStamp(mission.missionId, 'SEHYUN');
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
            theme.isDark ? theme.dividerBorder : 'border-slate-200'
          }`}
        >
          {isAnyMom ? (
            !confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>도장 상태 초기화</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400">
                  모든 도장 및 요청 기록을 처음(흑백) 상태로 초기화할까요?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetMissions();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold cursor-pointer"
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-500/20 text-xs font-semibold cursor-pointer"
                >
                  취소
                </button>
              </div>
            )
          ) : (
            <div className="text-xs opacity-75">
              흑백 동그란 도장을 터치해 엄마에게 요청하면, 엄마가 확인 후 컬러 도장을 찍어줍니다.
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold cursor-pointer ${
              theme.isDark
                ? 'bg-white text-slate-900 hover:bg-slate-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
