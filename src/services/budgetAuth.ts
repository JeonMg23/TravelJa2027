import { BudgetItem } from '../types/travel';

export type BudgetAuthRole = 'READ_ONLY' | 'HYUNWOO' | 'SEHYUN' | null;

export interface RoleInfo {
  role: BudgetAuthRole;
  label: string;
  badgeColor: string;
  description: string;
  allowedSummary: string;
}

export const ROLE_DEFINITIONS: Record<string, RoleInfo> = {
  '1111': {
    role: 'READ_ONLY',
    label: '조회 전용 모드',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    description: '가계부, 통계, 정산 및 영수증 전체 열람 전용',
    allowedSummary: '내역 열람 전용 (등록·수정·삭제 불가)'
  },
  '3539': {
    role: 'HYUNWOO',
    label: '현우가족 관리 모드',
    badgeColor: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
    description: '현우가족 전용 및 공동경비 등록/수정/삭제 권한',
    allowedSummary: '현우가족 & 공동경비 등록·수정·삭제 가능 (세현가족 전용 항목 제외)'
  },
  '0901': {
    role: 'SEHYUN',
    label: '세현가족 관리 모드',
    badgeColor: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
    description: '세현가족 전용 및 공동경비 등록/수정/삭제 권한',
    allowedSummary: '세현가족 & 공동경비 등록·수정·삭제 가능 (현우가족 전용 항목 제외)'
  }
};

const STORAGE_KEY = 'tokyo_budget_passcode';

export function getStoredBudgetPasscode(): string | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val && ['1111', '3539', '0901'].includes(val)) {
      return val;
    }
  } catch {
    // Graceful fallback if localStorage is disabled in restricted browser environments
  }
  return null;
}

export function setStoredBudgetPasscode(passcode: string | null): void {
  try {
    if (passcode && ['1111', '3539', '0901'].includes(passcode)) {
      localStorage.setItem(STORAGE_KEY, passcode);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Graceful fallback if localStorage is disabled in restricted browser environments
  }
}

export function getRoleFromPasscode(passcode: string): BudgetAuthRole {
  if (passcode === '1111') return 'READ_ONLY';
  if (passcode === '3539') return 'HYUNWOO';
  if (passcode === '0901') return 'SEHYUN';
  return null;
}

export function getRoleInfo(role: BudgetAuthRole): RoleInfo | null {
  if (role === 'READ_ONLY') return ROLE_DEFINITIONS['1111'];
  if (role === 'HYUNWOO') return ROLE_DEFINITIONS['3539'];
  if (role === 'SEHYUN') return ROLE_DEFINITIONS['0901'];
  return null;
}

/**
 * Check if the active role is permitted to modify (edit/delete) a budget item
 */
export function canManageItem(role: BudgetAuthRole, item: BudgetItem): boolean {
  if (!role || role === 'READ_ONLY') return false;

  // Hyunwoo Family Manager: Can manage shared cash, shared card, deposits, and Hyunwoo personal items
  if (role === 'HYUNWOO') {
    if (item.scope === 'SEHYEON') return false;
    return true;
  }

  // Sehyun Family Manager: Can manage shared cash, shared card, deposits, and Sehyun personal items
  if (role === 'SEHYUN') {
    if (item.scope === 'HYEONWOO') return false;
    return true;
  }

  return false;
}

/**
 * Check if active role is permitted to register a specific payment category
 */
export function canRegisterScope(
  role: BudgetAuthRole,
  paymentType:
    | 'CASH'
    | 'CASH_HYEONWOO'
    | 'CASH_SEHYEON'
    | 'CARD_SHARED'
    | 'CARD_HYEONWOO'
    | 'CARD_SEHYEON'
): boolean {
  if (!role || role === 'READ_ONLY') return false;

  if (role === 'HYUNWOO') {
    return paymentType !== 'CARD_SEHYEON' && paymentType !== 'CASH_SEHYEON';
  }

  if (role === 'SEHYUN') {
    return paymentType !== 'CARD_HYEONWOO' && paymentType !== 'CASH_HYEONWOO';
  }

  return false;
}
