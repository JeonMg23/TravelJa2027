export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceCategory;
  name: string; // e.g. "스마트폰 (모바일 브라우저)", "태블릿 (iPad / 갤럭시 탭)", "PC / 노트북"
  browser: string; // e.g. "모바일 브라우저", "카카오 인앱 브라우저", "Chrome / Safari"
  os: string; // e.g. "iOS", "Android", "macOS", "Windows"
  screenResolution: string; // e.g. "390x844"
}

export type KakaoUserRole = 'HYUNWOO' | 'SEHYUN' | 'MEMBER' | 'GUEST';

export interface KakaoAuthUser {
  id: string;
  nickname: string;
  avatarColor: string;
  avatarEmoji?: string;
  profileImageUrl?: string;
  role: KakaoUserRole;
  budgetPasscode: '3539' | '0901' | '1111';
  roleLabel: string;
  device: DeviceInfo;
  connectedAt: string;
  loginMethod: 'kakao_quick' | 'kakao_sdk' | 'kakao_custom';
}
