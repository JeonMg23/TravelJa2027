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
  role: KakaoUserRole;
  roleLabel: string;
  avatarColor: string;
  avatarEmoji: string;
  budgetPasscode: '3539' | '0901' | '1111';
  description: string;
  tag: string;
}

export const KAKAO_PRESET_MEMBERS: PresetMember[] = [
  {
    id: 'kakao_hyunwoo_mom',
    nickname: '현우맘',
    role: 'HYUNWOO',
    roleLabel: '현우가족 대표 · 관리자',
    avatarColor: 'bg-blue-600',
    avatarEmoji: '👩',
    budgetPasscode: '3539',
    description: '현우가족 전용 및 공동경비 관리자 (삼성카드 결제/정산 권한)',
    tag: '관리자'
  },
  {
    id: 'kakao_sehyun_mom',
    nickname: '세현맘',
    role: 'SEHYUN',
    roleLabel: '세현가족 대표 · 관리자',
    avatarColor: 'bg-rose-500',
    avatarEmoji: '👩',
    budgetPasscode: '0901',
    description: '세현가족 전용 및 공동경비 관리자 (신한카드 결제/정산 권한)',
    tag: '관리자'
  },
  {
    id: 'kakao_hyunwoo',
    nickname: '현우',
    role: 'MEMBER',
    roleLabel: '도쿄 원정대원',
    avatarColor: 'bg-indigo-600',
    avatarEmoji: '👦',
    budgetPasscode: '1111',
    description: '도쿄 디즈니씨 DPA 및 JR 교통 환승·동선 탐험 대원',
    tag: '원정대원'
  },
  {
    id: 'kakao_sehyun',
    nickname: '세현',
    role: 'MEMBER',
    roleLabel: '도쿄 원정대원',
    avatarColor: 'bg-emerald-600',
    avatarEmoji: '🧒',
    budgetPasscode: '1111',
    description: '시부야 스카이 & 롯폰기 포토존·체크리스트 전담 대원',
    tag: '원정대원'
  }
];

export function getStoredKakaoUser(): KakaoAuthUser | null {
  try {
    const raw = localStorage.getItem(KAKAO_USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.nickname) {
        return parsed as KakaoAuthUser;
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
  const preset = KAKAO_PRESET_MEMBERS.find((m) => m.id === presetId) || KAKAO_PRESET_MEMBERS[0];
  const device = detectDeviceInfo();
  const now = new Date();
  const timeStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const user: KakaoAuthUser = {
    id: preset.id,
    nickname: preset.nickname,
    avatarColor: preset.avatarColor,
    avatarEmoji: preset.avatarEmoji,
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
