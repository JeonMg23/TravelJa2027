import { KakaoAuthUser, DeviceInfo, DeviceCategory, KakaoUserRole } from '../types/auth';
import { setStoredBudgetPasscode } from './budgetAuth';

const KAKAO_USER_STORAGE_KEY = 'tokyo_trip_kakao_user';
const KAKAO_APP_KEY_STORAGE = 'tokyo_trip_kakao_app_key';

// Real-time device and platform detection for smartphone/tablet/desktop identification
export function detectDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      name: 'PC / 데스크톱',
      browser: '서버 렌더링',
      os: 'Unknown',
      screenResolution: '1920x1080'
    };
  }

  const ua = navigator.userAgent || '';
  const width = window.innerWidth;
  const height = window.innerHeight;
  const resolution = `${window.screen?.width || width}x${window.screen?.height || height}`;

  let os = '기타 OS';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = '웹 브라우저';
  if (/KAKAOTALK/i.test(ua)) browser = '카카오톡 인앱 브라우저';
  else if (/SamsungBrowser/i.test(ua)) browser = '삼성 인터넷';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome 브라우저';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari 브라우저';
  else if (/Edg/i.test(ua)) browser = 'Edge 브라우저';
  else if (/Whale/i.test(ua)) browser = '네이버 웨일';

  // Tablet classification (iPad or Android tablet or touch-enabled medium screen)
  const isTablet =
    /iPad/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    (navigator.maxTouchPoints > 1 && width >= 768 && width <= 1024);

  // Mobile smartphone classification
  const isMobile =
    !isTablet &&
    (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer/i.test(
      ua
    ) ||
      (width < 768 && navigator.maxTouchPoints > 0));

  let type: DeviceCategory = 'desktop';
  let name = 'PC / 노트북';

  if (isTablet) {
    type = 'tablet';
    name = os === 'iOS' ? 'iPad 태블릿' : '갤럭시 탭 / 안드로이드 태블릿';
  } else if (isMobile) {
    type = 'mobile';
    name = os === 'iOS' ? 'iPhone 스마트폰' : '갤럭시 / 안드로이드 스마트폰';
  }

  return {
    type,
    name,
    browser,
    os,
    screenResolution: resolution
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

const PROFILE_OVERRIDES_STORAGE_KEY = 'tokyo_trip_profile_overrides';

type ProfileChangeListener = () => void;
const profileListeners = new Set<ProfileChangeListener>();

export function subscribeToProfiles(listener: ProfileChangeListener): () => void {
  profileListeners.add(listener);
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

export function saveProfileOverride(memberId: string, override: ProfileOverride): void {
  try {
    const current = getProfileOverrides();
    current[memberId] = {
      ...current[memberId],
      ...override
    };
    if (!override.profileImageUrl) {
      delete current[memberId].profileImageUrl;
    }
    localStorage.setItem(PROFILE_OVERRIDES_STORAGE_KEY, JSON.stringify(current));
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
    notifyProfileChange();
  } catch (err) {
    console.warn('Failed to reset profile override:', err);
  }
}

// Fetch all profiles from server DB (profiles_db.json) and synchronize local cache
export async function fetchServerProfiles(): Promise<Record<string, ProfileOverride>> {
  try {
    const res = await fetch('/api/profiles');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && data.profiles) {
      const overrides: Record<string, ProfileOverride> = {};
      Object.keys(data.profiles).forEach((key) => {
        const item = data.profiles[key];
        overrides[key] = {
          nickname: item.nickname,
          avatarId: item.avatarId,
          avatarEmoji: item.avatarEmoji,
          profileImageUrl: item.profileImageUrl || undefined
        };
        if (!item.profileImageUrl) {
          delete overrides[key].profileImageUrl;
        }
      });
      localStorage.setItem(PROFILE_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
      notifyProfileChange();
      return overrides;
    }
  } catch (err) {
    console.warn('Failed to fetch server profiles, keeping local cache:', err);
  }
  return getProfileOverrides();
}

// Save profile change both to local cache and to server DB for all users
export async function saveProfileOverrideToServer(
  memberId: string,
  override: ProfileOverride
): Promise<boolean> {
  // 1. Immediately apply to local cache
  saveProfileOverride(memberId, override);

  // 2. Persist to Express server DB (profiles_db.json)
  try {
    const res = await fetch(`/api/profiles/${encodeURIComponent(memberId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(override)
    });
    if (!res.ok) {
      console.warn(`Server profile sync returned status ${res.status}`);
      return false;
    }
    const data = await res.json();
    notifyProfileChange();
    return !!data.success;
  } catch (err) {
    console.warn('Failed to persist profile to server DB:', err);
    return false;
  }
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
      profileImageUrl: custom.profileImageUrl
    };
  });
}

export function getStoredKakaoUser(): KakaoAuthUser | null {
  try {
    const raw = localStorage.getItem(KAKAO_USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as KakaoAuthUser;
      if (parsed && parsed.nickname) {
        const overrides = getProfileOverrides();
        const custom = overrides[parsed.id];
        const preset = KAKAO_PRESET_MEMBERS.find((m) => m.id === parsed.id);
        return {
          ...parsed,
          nickname: custom?.nickname?.trim() || parsed.nickname,
          avatarId: custom?.avatarId || parsed.avatarId || preset?.avatarId || 'disney_rapunzel',
          avatarEmoji: custom?.avatarEmoji || parsed.avatarEmoji || preset?.avatarEmoji || '👑',
          profileImageUrl: custom?.profileImageUrl ?? parsed.profileImageUrl
        };
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
  const trimmedNickname = updates.nickname.trim() || user.nickname;
  const override: ProfileOverride = {
    nickname: trimmedNickname,
    avatarId: updates.avatarId,
    avatarEmoji: updates.avatarEmoji,
    profileImageUrl: updates.profileImageUrl
  };

  // 1. Immediately update local storage and notify UI
  saveProfileOverride(user.id, override);

  // 2. Persist to Express server DB (profiles_db.json) asynchronously
  saveProfileOverrideToServer(user.id, override).catch((err) => {
    console.warn('Async server profile update failed:', err);
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
    nickname: nickname.trim(),
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
