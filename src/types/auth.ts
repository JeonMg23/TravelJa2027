export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export type RecognizedDeviceModelId =
  | 'pc_desktop'
  | 'iphone_12_pro_max'
  | 'galaxy_fold_8'
  | 'other_mobile';

export interface DeviceInfo {
  type: DeviceCategory;
  name: string; // e.g. "아이폰 12 프로 맥스", "갤럭시 폴드8", "PC / 데스크톱"
  modelId?: RecognizedDeviceModelId;
  rawModelCode?: string; // e.g. "SM-F976N", "iPhone (428x926)", "Desktop"
  accessRoleLabel?: string; // e.g. "전체관리자 · 전체 허용", "현우맘 전용 기기", "PC · 전체 허용"
  browser: string; // e.g. "모바일 브라우저", "카카오 인앱 브라우저", "Chrome / Safari"
  os: string; // e.g. "iOS", "Android", "macOS", "Windows"
  screenResolution: string; // e.g. "428x926"
}

export type KakaoUserRole = 'HYUNWOO' | 'SEHYUN' | 'MEMBER' | 'GUEST';

export interface KakaoAuthUser {
  id: string;
  nickname: string;
  avatarColor: string;
  avatarEmoji?: string;
  avatarId?: string;
  profileImageUrl?: string;
  role: KakaoUserRole;
  budgetPasscode: '3539' | '0901' | '1111';
  roleLabel: string;
  device: DeviceInfo;
  connectedAt: string;
  loginMethod: 'kakao_quick' | 'kakao_sdk' | 'kakao_custom';
}
