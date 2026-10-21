import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';
import {
  KakaoAuthUser,
  DeviceInfo,
  DeviceCategory,
  KakaoUserRole,
  RecognizedDeviceModelId
} from '../types/auth';
import { setStoredBudgetPasscode } from './budgetAuth';
import { db, handleFirestoreError, OperationType } from './firebase';

const KAKAO_USER_STORAGE_KEY = 'tokyo_trip_kakao_user';
const KAKAO_APP_KEY_STORAGE = 'tokyo_trip_kakao_app_key';
const PROFILE_OVERRIDES_STORAGE_KEY = 'tokyo_trip_profile_overrides';
const DEVICE_MODEL_OVERRIDE_STORAGE_KEY = 'tokyo_trip_device_model_override';

// Blueprint validation constants (synced verbatim with firebase-blueprint.json & firestore.rules)
export const ALLOWED_MEMBER_IDS = [
  'kakao_hyunwoo_mom',
  'kakao_sehyun_mom',
  'kakao_hyunwoo',
  'kakao_sehyun'
] as const;
export const MAX_NICKNAME_LENGTH = 40;
export const MAX_AVATAR_ID_LENGTH = 64;
export const AVATAR_ID_PATTERN = /^[a-zA-Z0-9_\-]+$/;
export const MAX_EMOJI_LENGTH = 16;
export const MAX_PROFILE_IMAGE_LENGTH = 500000;

// Cross-tab BroadcastChannel for instant multi-tab profile sync
let profileBroadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    profileBroadcastChannel = new BroadcastChannel('tokyo_trip_profile_sync_channel');
    profileBroadcastChannel.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PROFILES_UPDATED' && event.data.overrides) {
        try {
          localStorage.setItem(
            PROFILE_OVERRIDES_STORAGE_KEY,
            JSON.stringify(event.data.overrides)
          );
          syncStoredKakaoUserWithOverrides(event.data.overrides);
          notifyProfileChange();
        } catch {
          // ignore storage errors
        }
      }
    });
  }
} catch {
  profileBroadcastChannel = null;
}

// High-Entropy Client Hints cache for Android Chrome / Samsung / Edge model identification
let cachedClientHintModel = '';
let clientHintsRequested = false;

export function requestHighEntropyDeviceModel(onResolved?: (model: string) => void): void {
  if (typeof window === 'undefined') return;
  const nav = navigator as any;
  if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === 'function') {
    if (!clientHintsRequested || onResolved) {
      clientHintsRequested = true;
      nav.userAgentData
        .getHighEntropyValues(['model', 'platform', 'platformVersion'])
        .then((values: any) => {
          if (values && typeof values.model === 'string' && values.model.trim()) {
            cachedClientHintModel = values.model.trim();
            if (onResolved) onResolved(cachedClientHintModel);
            notifyProfileChange();
          }
        })
        .catch(() => {});
    }
  }
}

export function getStoredDeviceModelOverride(): RecognizedDeviceModelId | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(DEVICE_MODEL_OVERRIDE_STORAGE_KEY);
    if (
      val === 'pc_desktop' ||
      val === 'iphone_12_pro_max' ||
      val === 'galaxy_fold_8' ||
      val === 'other_mobile'
    ) {
      return val;
    }
  } catch {}
  return null;
}

export function setStoredDeviceModelOverride(modelId: RecognizedDeviceModelId | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!modelId) {
      localStorage.removeItem(DEVICE_MODEL_OVERRIDE_STORAGE_KEY);
    } else {
      localStorage.setItem(DEVICE_MODEL_OVERRIDE_STORAGE_KEY, modelId);
    }
    notifyProfileChange();
  } catch {}
}

// Real-time device and smartphone model detection (갤럭시 폴드8, 아이폰 12 프로 맥스, PC 등 식별)
export function detectDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      name: 'PC / 데스크톱',
      modelId: 'pc_desktop',
      rawModelCode: 'Desktop',
      accessRoleLabel: 'PC · 전체 모두 접근 가능',
      browser: '서버 렌더링',
      os: 'Unknown',
      screenResolution: '1920x1080'
    };
  }

  requestHighEntropyDeviceModel();

  const ua = navigator.userAgent || '';
  const width = window.innerWidth;
  const height = window.innerHeight;
  const sw = window.screen?.width || width;
  const sh = window.screen?.height || height;
  const minDim = Math.min(sw, sh);
  const maxDim = Math.max(sw, sh);
  const dpr = window.devicePixelRatio || 1;
  const resolution = `${sw}x${sh}`;

  let os = '기타 OS';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = '웹 브라우저';
  if (/KAKAOTALK/i.test(ua)) browser = '카카오톡 인앱';
  else if (/SamsungBrowser/i.test(ua)) browser = '삼성 인터넷';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Whale/i.test(ua)) browser = '네이버 웨일';

  const combinedModelSource = `${ua} ${cachedClientHintModel}`.trim();

  // Check if Samsung Galaxy Z Fold series (SM-F9xx, Fold8, Fold, or Android foldable screen aspect ratio)
  const isGalaxyFoldByString =
    /SM-F9\d\d|Fold\s*8|Galaxy\s*Z?\s*Fold/i.test(combinedModelSource);
  const isGalaxyFoldUnfoldedScreen =
    os === 'Android' &&
    minDim >= 560 &&
    minDim <= 920 &&
    maxDim >= 650 &&
    maxDim <= 980 &&
    maxDim / Math.max(1, minDim) <= 1.42;
  const isGalaxyFoldCoverScreen =
    os === 'Android' &&
    minDim >= 320 &&
    minDim <= 405 &&
    maxDim / Math.max(1, minDim) >= 2.28;

  const isGalaxyFold =
    isGalaxyFoldByString || isGalaxyFoldUnfoldedScreen || isGalaxyFoldCoverScreen;

  // Tablet classification (excluding Galaxy Fold which is a foldable smartphone)
  const isTablet =
    !isGalaxyFold &&
    (/iPad/i.test(ua) ||
      (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
      (navigator.maxTouchPoints > 1 && width >= 768 && width <= 1024 && os === 'macOS'));

  // Mobile smartphone classification
  const isMobile =
    isGalaxyFold ||
    (!isTablet &&
      (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer/i.test(
        ua
      ) ||
        (width < 768 && navigator.maxTouchPoints > 0)));

  let type: DeviceCategory = 'desktop';
  let name =
    os === 'macOS'
      ? 'PC (Mac)'
      : os === 'Windows'
      ? 'PC (Windows)'
      : 'PC / 데스크톱';
  let modelId: RecognizedDeviceModelId = 'pc_desktop';
  let rawModelCode = cachedClientHintModel || 'Desktop';
  let accessRoleLabel = 'PC · 전체 모두 접근 가능';

  if (isMobile || isTablet) {
    type = isTablet ? 'tablet' : 'mobile';

    if (isGalaxyFold) {
      modelId = 'galaxy_fold_8';
      name = '갤럭시 폴드8';
      const matchedFoldCode = combinedModelSource.match(/SM-F9[0-9A-Z]+/i)?.[0];
      rawModelCode = matchedFoldCode || cachedClientHintModel || `SM-F976N (${resolution})`;
      accessRoleLabel = '현우맘 전용 허용 기기';
    } else if (os === 'iOS' && /iPhone/i.test(ua)) {
      // iPhone 12 Pro Max detection:
      // Native logical resolution is 428x926 (3x DPR), or 375x812 (3x DPR in iOS Display Zoom mode), or explicit UA match
      const isIPhone12ProMax =
        (minDim === 428 && maxDim === 926) ||
        (minDim === 375 && maxDim === 812 && dpr >= 3) ||
        /iPhone13,4|12\s*Pro\s*Max/i.test(combinedModelSource);

      if (isIPhone12ProMax) {
        modelId = 'iphone_12_pro_max';
        name = '아이폰 12 프로 맥스';
        rawModelCode = `iPhone 12 Pro Max (${resolution})`;
        accessRoleLabel = '전체관리자 · 전체 모두 접근 가능';
      } else {
        modelId = 'other_mobile';
        if (minDim === 440 && maxDim === 956) name = '아이폰 16 프로 맥스';
        else if (minDim === 430 && maxDim === 932) name = '아이폰 14/15 프로 맥스';
        else if (minDim === 393 && maxDim === 852) name = '아이폰 15 / 16 Pro';
        else if (minDim === 390 && maxDim === 844) name = '아이폰 12 / 13 / 14';
        else if (minDim === 414 && maxDim === 896) name = '아이폰 11 / XR / XS Max';
        else if (minDim === 375 && maxDim === 667) name = '아이폰 SE';
        else name = `아이폰 (${resolution})`;
        rawModelCode = `iPhone (${resolution})`;
        accessRoleLabel = '접근 제한 기종';
      }
    } else if (os === 'Android') {
      modelId = 'other_mobile';
      const smMatch = combinedModelSource.match(/SM-[A-Z0-9]+/i)?.[0]?.toUpperCase();
      if (smMatch) {
        if (smMatch.startsWith('SM-S948')) name = '갤럭시 S26 울트라';
        else if (smMatch.startsWith('SM-S94')) name = '갤럭시 S26';
        else if (smMatch.startsWith('SM-S938')) name = '갤럭시 S25 울트라';
        else if (smMatch.startsWith('SM-S93')) name = '갤럭시 S25';
        else if (smMatch.startsWith('SM-S928')) name = '갤럭시 S24 울트라';
        else if (smMatch.startsWith('SM-S92')) name = '갤럭시 S24';
        else if (smMatch.startsWith('SM-S918')) name = '갤럭시 S23 울트라';
        else if (smMatch.startsWith('SM-S91')) name = '갤럭시 S23';
        else if (smMatch.startsWith('SM-F7')) name = '갤럭시 Z 플립';
        else name = `갤럭시 (${smMatch})`;
        rawModelCode = smMatch;
      } else if (cachedClientHintModel) {
        name = `안드로이드 (${cachedClientHintModel})`;
        rawModelCode = cachedClientHintModel;
      } else {
        name = isTablet ? `갤럭시 탭 (${resolution})` : `안드로이드 스마트폰 (${resolution})`;
        rawModelCode = `Android (${resolution})`;
      }
      accessRoleLabel = '접근 제한 기종';
    } else {
      modelId = 'other_mobile';
      name = isTablet ? `iPad / 태블릿 (${resolution})` : `모바일 기기 (${resolution})`;
      rawModelCode = `${os} (${resolution})`;
      accessRoleLabel = '접근 제한 기종';
    }
  }

  // Apply manual device model override if configured by administrator
  const overrideModelId = getStoredDeviceModelOverride();
  if (overrideModelId) {
    modelId = overrideModelId;
    if (overrideModelId === 'iphone_12_pro_max') {
      type = 'mobile';
      name = '아이폰 12 프로 맥스';
      accessRoleLabel = '전체관리자 · 전체 모두 접근 가능';
    } else if (overrideModelId === 'galaxy_fold_8') {
      type = 'mobile';
      name = '갤럭시 폴드8';
      accessRoleLabel = '현우맘 전용 허용 기기';
    } else if (overrideModelId === 'pc_desktop') {
      type = 'desktop';
      name = 'PC / 데스크톱';
      accessRoleLabel = 'PC · 전체 모두 접근 가능';
    } else if (overrideModelId === 'other_mobile') {
      type = 'mobile';
      if (name.startsWith('PC') || name === '아이폰 12 프로 맥스' || name === '갤럭시 폴드8') {
        name = `일반 스마트폰 (${resolution})`;
      }
      accessRoleLabel = '접근 제한 기종';
    }
  }

  return {
    type,
    name,
    modelId,
    rawModelCode,
    accessRoleLabel,
    browser,
    os,
    screenResolution: resolution
  };
}

export interface ProfileDeviceAccessResult {
  allowed: boolean;
  badgeText: string;
  reason: string;
}

/**
 * 기종별 프로필 접근 제한 정책:
 * 1) PC (pc_desktop): 전체 프로필 모두 접근 가능
 * 2) 전체관리자 (iphone_12_pro_max - 아이폰 12 프로 맥스): 전체 프로필 모두 접근 가능
 * 3) 현우맘 (kakao_hyunwoo_mom): 스마트폰에서는 갤럭시 폴드8 (또는 전체관리자 아이폰 12 프로 맥스)만 접근 가능
 * 4) 그 외 스마트폰 기종 / 프로필: 현재 제한 ("일단 이렇게만 해줘")
 */
export function checkProfileDeviceAccess(
  profileId: string,
  deviceInput?: DeviceInfo
): ProfileDeviceAccessResult {
  const device = deviceInput || detectDeviceInfo();
  const modelId = device.modelId || (device.type === 'desktop' ? 'pc_desktop' : 'other_mobile');

  // 1. PC는 전체 모두 가능
  if (modelId === 'pc_desktop' || device.type === 'desktop') {
    return {
      allowed: true,
      badgeText: 'PC 접속 가능',
      reason: 'PC에서는 모든 프로필에 접근할 수 있습니다.'
    };
  }

  // 2. 전체관리자 (아이폰 12 프로 맥스)는 전체 모두 접근 가능
  if (modelId === 'iphone_12_pro_max') {
    return {
      allowed: true,
      badgeText: '전체관리자 허용',
      reason: '전체관리자 기기(아이폰 12 프로 맥스)는 모든 프로필에 접근할 수 있습니다.'
    };
  }

  // 3. 갤럭시 폴드8은 현우맘 프로필만 접근 가능
  if (modelId === 'galaxy_fold_8') {
    if (profileId === 'kakao_hyunwoo_mom') {
      return {
        allowed: true,
        badgeText: '갤럭시폴드8 인증됨',
        reason: '현우맘 전용 기기(갤럭시 폴드8)로 접속 가능합니다.'
      };
    }
    return {
      allowed: false,
      badgeText: '접근 제한 (현우맘 전용폰)',
      reason: `현재 접속 기종(${device.name})에서는 [현우맘] 프로필만 접속할 수 있습니다. (전체 접근: 아이폰 12 프로 맥스 / PC)`
    };
  }

  // 4. 기타 스마트폰 기종
  if (profileId === 'kakao_hyunwoo_mom') {
    return {
      allowed: false,
      badgeText: '갤럭시폴드8 전용',
      reason: `[현우맘] 프로필은 갤럭시 폴드8, 아이폰 12 프로 맥스(전체관리자), 또는 PC에서만 접근할 수 있습니다. (현재 기종: ${device.name})`
    };
  }

  return {
    allowed: false,
    badgeText: '접근 제한 기종',
    reason: `현재 접속 기종(${device.name})은 프로필 접근이 제한되어 있습니다. (아이폰 12 프로 맥스 전체관리자 또는 PC에서만 접근 가능)`
  };
}

export interface PresetMember {
  id: string;
  nickname: string;
  defaultNickname: string;
  role: KakaoUserRole;
  roleLabel: string;
  avatarColor: string;
  avatarEmoji: string;
  avatarId: string;
  profileImageUrl?: string;
  budgetPasscode: '3539' | '0901' | '1111';
  description: string;
  tag: string;
}

export const KAKAO_PRESET_MEMBERS: PresetMember[] = [
  {
    id: 'kakao_hyunwoo_mom',
    nickname: '현우맘',
    defaultNickname: '현우맘',
    role: 'HYUNWOO',
    roleLabel: '현우가족 대표 · 관리자',
    avatarColor: 'bg-amber-500',
    avatarEmoji: '👑',
    avatarId: 'disney_rapunzel',
    budgetPasscode: '3539',
    description: '현우가족 전용 및 공동경비 관리자 (삼성카드 결제/정산 권한)',
    tag: '디즈니 공주'
  },
  {
    id: 'kakao_sehyun_mom',
    nickname: '세현맘',
    defaultNickname: '세현맘',
    role: 'SEHYUN',
    roleLabel: '세현가족 대표 · 관리자',
    avatarColor: 'bg-sky-500',
    avatarEmoji: '❄️',
    avatarId: 'disney_elsa',
    budgetPasscode: '0901',
    description: '세현가족 전용 및 공동경비 관리자 (신한카드 결제/정산 권한)',
    tag: '디즈니 공주'
  },
  {
    id: 'kakao_hyunwoo',
    nickname: '현우',
    defaultNickname: '현우',
    role: 'MEMBER',
    roleLabel: '도쿄 원정대원',
    avatarColor: 'bg-blue-500',
    avatarEmoji: '🎁',
    avatarId: 'smurf_jokey',
    budgetPasscode: '1111',
    description: '도쿄 디즈니씨 DPA 및 JR 교통 환승·동선 탐험 대원',
    tag: '개구쟁이 스머프'
  },
  {
    id: 'kakao_sehyun',
    nickname: '세현',
    defaultNickname: '세현',
    role: 'MEMBER',
    roleLabel: '도쿄 원정대원',
    avatarColor: 'bg-emerald-500',
    avatarEmoji: '👓',
    avatarId: 'smurf_brainy',
    budgetPasscode: '1111',
    description: '시부야 스카이 & 롯폰기 포토존·체크리스트 전담 대원',
    tag: '개구쟁이 스머프'
  }
];

type ProfileChangeListener = () => void;
const profileListeners = new Set<ProfileChangeListener>();

export function subscribeToProfiles(listener: ProfileChangeListener): () => void {
  profileListeners.add(listener);
  ensureRealtimeFirestoreProfileListener();
  return () => {
    profileListeners.delete(listener);
  };
}

export function notifyProfileChange(): void {
  profileListeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error('Error notifying profile listener:', e);
    }
  });
}

export interface ProfileOverride {
  nickname?: string;
  avatarId?: string;
  avatarEmoji?: string;
  profileImageUrl?: string;
}

function sanitizeProfileOverride(
  memberId: string,
  override: ProfileOverride
): {
  nickname: string;
  defaultNickname: string;
  avatarId: string;
  avatarEmoji: string;
  profileImageUrl?: string;
} {
  const preset =
    KAKAO_PRESET_MEMBERS.find((m) => m.id === memberId) || KAKAO_PRESET_MEMBERS[0];

  const rawNickname = (override.nickname ?? preset.nickname).trim();
  const safeNickname =
    rawNickname.length >= 1
      ? rawNickname.slice(0, MAX_NICKNAME_LENGTH)
      : preset.nickname;

  const rawAvatarId = (override.avatarId ?? preset.avatarId).trim();
  const safeAvatarId =
    rawAvatarId.length >= 1 &&
    rawAvatarId.length <= MAX_AVATAR_ID_LENGTH &&
    AVATAR_ID_PATTERN.test(rawAvatarId)
      ? rawAvatarId
      : preset.avatarId;

  const rawEmoji = (override.avatarEmoji ?? preset.avatarEmoji).trim();
  const safeEmoji =
    rawEmoji.length >= 1 ? rawEmoji.slice(0, MAX_EMOJI_LENGTH) : preset.avatarEmoji;

  const rawImg = override.profileImageUrl?.trim();
  const safeProfileImageUrl =
    rawImg && rawImg.length >= 1 && rawImg.length <= MAX_PROFILE_IMAGE_LENGTH
      ? rawImg
      : undefined;

  return {
    nickname: safeNickname,
    defaultNickname: preset.defaultNickname,
    avatarId: safeAvatarId,
    avatarEmoji: safeEmoji,
    profileImageUrl: safeProfileImageUrl
  };
}

export function getProfileOverrides(): Record<string, ProfileOverride> {
  try {
    const raw = localStorage.getItem(PROFILE_OVERRIDES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) || {};
    }
  } catch (err) {
    console.warn('Failed to read profile overrides:', err);
  }
  return {};
}

function syncStoredKakaoUserWithOverrides(
  overrides: Record<string, ProfileOverride>
): void {
  try {
    const raw = localStorage.getItem(KAKAO_USER_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as KakaoAuthUser;
    if (!parsed || !parsed.id) return;

    const custom = overrides[parsed.id];
    const preset = KAKAO_PRESET_MEMBERS.find((m) => m.id === parsed.id);
    if (!custom && !preset) return;

    const nextUser: KakaoAuthUser = {
      ...parsed,
      nickname: custom?.nickname?.trim() || preset?.nickname || parsed.nickname,
      avatarId: custom?.avatarId || preset?.avatarId || parsed.avatarId || 'disney_rapunzel',
      avatarEmoji: custom?.avatarEmoji || preset?.avatarEmoji || parsed.avatarEmoji || '👑'
    };

    if (custom?.profileImageUrl) {
      nextUser.profileImageUrl = custom.profileImageUrl;
    } else {
      delete nextUser.profileImageUrl;
    }

    localStorage.setItem(KAKAO_USER_STORAGE_KEY, JSON.stringify(nextUser));
  } catch {
    // ignore storage sync errors
  }
}

export function saveProfileOverride(memberId: string, override: ProfileOverride): void {
  try {
    const current = getProfileOverrides();
    const sanitized = sanitizeProfileOverride(memberId, override);
    current[memberId] = {
      nickname: sanitized.nickname,
      avatarId: sanitized.avatarId,
      avatarEmoji: sanitized.avatarEmoji,
      ...(sanitized.profileImageUrl ? { profileImageUrl: sanitized.profileImageUrl } : {})
    };
    localStorage.setItem(PROFILE_OVERRIDES_STORAGE_KEY, JSON.stringify(current));
    syncStoredKakaoUserWithOverrides(current);
    profileBroadcastChannel?.postMessage({
      type: 'PROFILES_UPDATED',
      overrides: current
    });
    notifyProfileChange();
  } catch (err) {
    console.warn('Failed to save profile override:', err);
  }
}

export function resetProfileOverride(memberId: string): void {
  try {
    const current = getProfileOverrides();
    delete current[memberId];
    localStorage.setItem(PROFILE_OVERRIDES_STORAGE_KEY, JSON.stringify(current));
    syncStoredKakaoUserWithOverrides(current);
    notifyProfileChange();
  } catch (err) {
    console.warn('Failed to reset profile override:', err);
  }
}

// Real-time Firestore listener state
let firestoreUnsubscribe: (() => void) | null = null;
let hasSeededInitialProfiles = false;

async function writeMemberProfileToFirestore(
  memberId: string,
  override: ProfileOverride
): Promise<void> {
  if (!ALLOWED_MEMBER_IDS.includes(memberId as (typeof ALLOWED_MEMBER_IDS)[number])) {
    return;
  }
  const sanitized = sanitizeProfileOverride(memberId, override);
  const payload: Record<string, unknown> = {
    memberId,
    nickname: sanitized.nickname,
    defaultNickname: sanitized.defaultNickname,
    avatarId: sanitized.avatarId,
    avatarEmoji: sanitized.avatarEmoji,
    updatedAt: serverTimestamp()
  };
  if (sanitized.profileImageUrl) {
    payload.profileImageUrl = sanitized.profileImageUrl;
  }

  const path = `profiles/${memberId}`;
  try {
    await setDoc(doc(db, 'profiles', memberId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

function applyFirestoreDocsToCache(
  docsData: Array<Record<string, unknown>>
): Record<string, ProfileOverride> {
  const currentOverrides = getProfileOverrides();
  const nextOverrides: Record<string, ProfileOverride> = { ...currentOverrides };

  docsData.forEach((item) => {
    const memberId = typeof item.memberId === 'string' ? item.memberId : '';
    if (!memberId) return;
    const sanitized = sanitizeProfileOverride(memberId, {
      nickname: typeof item.nickname === 'string' ? item.nickname : undefined,
      avatarId: typeof item.avatarId === 'string' ? item.avatarId : undefined,
      avatarEmoji: typeof item.avatarEmoji === 'string' ? item.avatarEmoji : undefined,
      profileImageUrl:
        typeof item.profileImageUrl === 'string' && item.profileImageUrl.trim()
          ? item.profileImageUrl.trim()
          : undefined
    });
    nextOverrides[memberId] = {
      nickname: sanitized.nickname,
      avatarId: sanitized.avatarId,
      avatarEmoji: sanitized.avatarEmoji,
      ...(sanitized.profileImageUrl ? { profileImageUrl: sanitized.profileImageUrl } : {})
    };
  });

  const prevRaw = localStorage.getItem(PROFILE_OVERRIDES_STORAGE_KEY);
  const nextRaw = JSON.stringify(nextOverrides);
  if (prevRaw !== nextRaw) {
    localStorage.setItem(PROFILE_OVERRIDES_STORAGE_KEY, nextRaw);
    syncStoredKakaoUserWithOverrides(nextOverrides);
    notifyProfileChange();
  } else {
    syncStoredKakaoUserWithOverrides(nextOverrides);
  }

  return nextOverrides;
}

export function ensureRealtimeFirestoreProfileListener(): void {
  if (typeof window === 'undefined' || firestoreUnsubscribe) {
    return;
  }

  const profilesQuery = query(
    collection(db, 'profiles'),
    where('memberId', 'in', [...ALLOWED_MEMBER_IDS])
  );

  firestoreUnsubscribe = onSnapshot(
    profilesQuery,
    (snapshot) => {
      if (snapshot.empty && !hasSeededInitialProfiles) {
        hasSeededInitialProfiles = true;
        const localOverrides = getProfileOverrides();
        KAKAO_PRESET_MEMBERS.forEach((member) => {
          const existingLocal = localOverrides[member.id] || {
            nickname: member.nickname,
            avatarId: member.avatarId,
            avatarEmoji: member.avatarEmoji,
            profileImageUrl: member.profileImageUrl
          };
          writeMemberProfileToFirestore(member.id, existingLocal).catch(() => {});
        });
        return;
      }

      const docsData = snapshot.docs.map((d) => d.data() as Record<string, unknown>);
      applyFirestoreDocsToCache(docsData);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'profiles');
      } catch {
        // Logged by handleFirestoreError; keep app functional with local cache
      }
    }
  );
}

// Fetch all profiles from Firebase Cloud Firestore (with Express API fallback) and synchronize local cache
export async function fetchServerProfiles(): Promise<Record<string, ProfileOverride>> {
  ensureRealtimeFirestoreProfileListener();

  // 1. Primary Cloud DB: Firebase Cloud Firestore
  try {
    const profilesQuery = query(
      collection(db, 'profiles'),
      where('memberId', 'in', [...ALLOWED_MEMBER_IDS])
    );
    let snapshot;
    try {
      snapshot = await getDocs(profilesQuery);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'profiles');
    }

    if (snapshot && !snapshot.empty) {
      const docsData = snapshot.docs.map((d) => d.data() as Record<string, unknown>);
      return applyFirestoreDocsToCache(docsData);
    }
  } catch {
    // Fallback to server API / local cache if Firestore query fails
  }

  // 2. Secondary fallback: Express / Serverless API
  try {
    const res = await fetch('/api/profiles', {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.success && data.profiles) {
        const docsList = Object.keys(data.profiles).map((key) => ({
          memberId: key,
          ...data.profiles[key]
        }));
        return applyFirestoreDocsToCache(docsList);
      }
    }
  } catch {
    // Offline or static preview: fallback to local cache
  }

  return getProfileOverrides();
}

// Save profile change to local cache, Firebase Cloud Firestore, and Express API for all users & devices
export async function saveProfileOverrideToServer(
  memberId: string,
  override: ProfileOverride
): Promise<boolean> {
  // 1. Immediately apply to local cache & broadcast to tabs
  saveProfileOverride(memberId, override);

  let savedToCloud = false;

  // 2. Primary Cloud Persistence: Firebase Cloud Firestore (shared across all devices & deployments)
  try {
    await writeMemberProfileToFirestore(memberId, override);
    savedToCloud = true;
  } catch (err) {
    console.warn('Firestore profile write error:', err);
  }

  // 3. Secondary Persistence: Express / Serverless DB (profiles_db.json)
  try {
    const sanitized = sanitizeProfileOverride(memberId, override);
    const res = await fetch(`/api/profiles/${encodeURIComponent(memberId)}`, {
      method: 'PUT',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        nickname: sanitized.nickname,
        avatarId: sanitized.avatarId,
        avatarEmoji: sanitized.avatarEmoji,
        profileImageUrl: sanitized.profileImageUrl || ''
      })
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data?.success) {
        savedToCloud = true;
      }
    }
  } catch {
    // Ignore secondary API error if running on static host
  }

  notifyProfileChange();
  return savedToCloud;
}

export function getEffectivePresetMembers(): PresetMember[] {
  const overrides = getProfileOverrides();
  return KAKAO_PRESET_MEMBERS.map((member) => {
    const custom = overrides[member.id];
    if (!custom) return member;
    return {
      ...member,
      nickname: custom.nickname?.trim() || member.nickname,
      avatarId: custom.avatarId || member.avatarId,
      avatarEmoji: custom.avatarEmoji || member.avatarEmoji,
      profileImageUrl: custom.profileImageUrl || undefined
    };
  });
}

export function getStoredKakaoUser(): KakaoAuthUser | null {
  try {
    const raw = localStorage.getItem(KAKAO_USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as KakaoAuthUser;
      if (parsed && parsed.id) {
        const overrides = getProfileOverrides();
        const custom = overrides[parsed.id];
        const preset = KAKAO_PRESET_MEMBERS.find((m) => m.id === parsed.id);
        if (preset) {
          return {
            ...parsed,
            nickname: custom?.nickname?.trim() || preset.nickname,
            avatarId: custom?.avatarId || preset.avatarId,
            avatarEmoji: custom?.avatarEmoji || preset.avatarEmoji,
            profileImageUrl: custom?.profileImageUrl || undefined
          };
        }
        if (parsed.nickname) {
          return {
            ...parsed,
            nickname: custom?.nickname?.trim() || parsed.nickname,
            avatarId: custom?.avatarId || parsed.avatarId || 'disney_rapunzel',
            avatarEmoji: custom?.avatarEmoji || parsed.avatarEmoji || '👑',
            profileImageUrl: custom ? custom.profileImageUrl : parsed.profileImageUrl
          };
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load stored Kakao user:', err);
  }
  return null;
}

export function saveKakaoUser(user: KakaoAuthUser): void {
  try {
    localStorage.setItem(KAKAO_USER_STORAGE_KEY, JSON.stringify(user));
    // Automatically configure budget authorization passcode based on user's role
    setStoredBudgetPasscode(user.budgetPasscode);
  } catch (err) {
    console.warn('Failed to save Kakao user:', err);
  }
}

export function updateKakaoUserProfile(
  user: KakaoAuthUser,
  updates: {
    nickname: string;
    avatarId: string;
    avatarEmoji?: string;
    profileImageUrl?: string;
  }
): KakaoAuthUser {
  const trimmedNickname = (updates.nickname.trim() || user.nickname).slice(
    0,
    MAX_NICKNAME_LENGTH
  );
  const override: ProfileOverride = {
    nickname: trimmedNickname,
    avatarId: updates.avatarId,
    avatarEmoji: updates.avatarEmoji,
    profileImageUrl: updates.profileImageUrl
  };

  // 1. Immediately update local storage & persist to Firebase Cloud Firestore + Express DB
  saveProfileOverrideToServer(user.id, override).catch((err) => {
    console.warn('Async cloud profile update failed:', err);
  });

  const updatedUser: KakaoAuthUser = {
    ...user,
    nickname: trimmedNickname,
    avatarId: updates.avatarId,
    avatarEmoji: updates.avatarEmoji || user.avatarEmoji,
    profileImageUrl: updates.profileImageUrl || undefined
  };

  if (!updates.profileImageUrl) {
    delete updatedUser.profileImageUrl;
  }

  saveKakaoUser(updatedUser);
  return updatedUser;
}

export function clearKakaoUser(): void {
  try {
    localStorage.removeItem(KAKAO_USER_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear Kakao user:', err);
  }
}

export function getStoredKakaoAppKey(): string {
  try {
    return localStorage.getItem(KAKAO_APP_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveStoredKakaoAppKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(KAKAO_APP_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(KAKAO_APP_KEY_STORAGE);
    }
  } catch {}
}

export function createKakaoUserFromPreset(presetId: string): KakaoAuthUser {
  const effectiveMembers = getEffectivePresetMembers();
  const preset = effectiveMembers.find((m) => m.id === presetId) || effectiveMembers[0];
  const device = detectDeviceInfo();
  const now = new Date();
  const timeStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const user: KakaoAuthUser = {
    id: preset.id,
    nickname: preset.nickname,
    avatarColor: preset.avatarColor,
    avatarEmoji: preset.avatarEmoji,
    avatarId: preset.avatarId,
    profileImageUrl: preset.profileImageUrl,
    role: preset.role,
    budgetPasscode: preset.budgetPasscode,
    roleLabel: preset.roleLabel,
    device,
    connectedAt: timeStr,
    loginMethod: 'kakao_quick'
  };

  if (!preset.profileImageUrl) {
    delete user.profileImageUrl;
  }

  saveKakaoUser(user);
  return user;
}

export function createCustomKakaoUser(
  nickname: string,
  role: KakaoUserRole = 'MEMBER',
  avatarEmoji: string = '🎒'
): KakaoAuthUser {
  const device = detectDeviceInfo();
  const now = new Date();
  const timeStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const isHyunwooMom = role === 'HYUNWOO' || nickname.includes('현우맘');
  const isSehyunMom = role === 'SEHYUN' || nickname.includes('세현맘');
  const isHyunwooKid = !isHyunwooMom && nickname.includes('현우');
  const isSehyunKid = !isSehyunMom && nickname.includes('세현');

  let finalRole: KakaoUserRole = role;
  let budgetPasscode: '3539' | '0901' | '1111' = '1111';
  let roleLabel = '도쿄 원정대원';
  let avatarColor = 'bg-amber-500';

  if (isHyunwooMom) {
    finalRole = 'HYUNWOO';
    budgetPasscode = '3539';
    roleLabel = '현우맘 (관리자)';
    avatarColor = 'bg-blue-600';
  } else if (isSehyunMom) {
    finalRole = 'SEHYUN';
    budgetPasscode = '0901';
    roleLabel = '세현맘 (관리자)';
    avatarColor = 'bg-rose-500';
  } else if (isHyunwooKid) {
    finalRole = 'MEMBER';
    budgetPasscode = '1111';
    roleLabel = '현우 (원정대원)';
    avatarColor = 'bg-indigo-600';
  } else if (isSehyunKid) {
    finalRole = 'MEMBER';
    budgetPasscode = '1111';
    roleLabel = '세현 (원정대원)';
    avatarColor = 'bg-emerald-600';
  } else {
    const colors = ['bg-amber-500', 'bg-indigo-600', 'bg-emerald-600', 'bg-rose-500', 'bg-cyan-600'];
    avatarColor = colors[nickname.length % colors.length];
  }

  const user: KakaoAuthUser = {
    id: `kakao_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    nickname: nickname.trim().slice(0, MAX_NICKNAME_LENGTH),
    avatarColor,
    avatarEmoji,
    role: finalRole,
    budgetPasscode,
    roleLabel,
    device,
    connectedAt: timeStr,
    loginMethod: 'kakao_custom'
  };

  saveKakaoUser(user);
  return user;
}

// Start real-time Firestore profile sync automatically in browser
if (typeof window !== 'undefined') {
  ensureRealtimeFirestoreProfileListener();
}

// Kakao JavaScript SDK Dynamic Loader and Auth Handler
declare global {
  interface Window {
    Kakao?: any;
  }
}

export async function loadKakaoSdk(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
    return true;
  }

  return new Promise((resolve) => {
    if (document.getElementById('kakao-sdk-script')) {
      if (window.Kakao) resolve(true);
      else {
        const check = setInterval(() => {
          if (window.Kakao) {
            clearInterval(check);
            resolve(true);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(check);
          resolve(false);
        }, 3000);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-sdk-script';
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
    script.integrity = 'sha384-DKYJZ8NLiAQUahySTgJQ2QRwv5RxoRF6U983Uv5wvK5BQ3CPY0544C300CSbV0Z6';
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Kakao JS SDK network load skipped, fallback to quick connect');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}
