/**
 * Security Rules Verification Suite for Tokyo Expedition Profiles
 * Verifies that all Dirty Dozen payloads return PERMISSION_DENIED.
 */

export interface DirtyPayloadTest {
  id: number;
  name: string;
  path: string;
  operation: 'create' | 'update' | 'delete' | 'get' | 'list';
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TESTS: DirtyPayloadTest[] = [
  {
    id: 1,
    name: 'ID Poisoning - Arbitrary Member ID outside preset allowlist',
    path: '/profiles/attacker_999',
    operation: 'create',
    payload: {
      memberId: 'attacker_999',
      nickname: '해커',
      defaultNickname: '현우',
      avatarId: 'smurf_jokey',
      avatarEmoji: '🎁',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 2,
    name: 'Shadow Field Injection on Create (isVerified: true)',
    path: '/profiles/kakao_hyunwoo',
    operation: 'create',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '현우',
      defaultNickname: '현우',
      avatarId: 'smurf_jokey',
      avatarEmoji: '🎁',
      updatedAt: 'SERVER_TIMESTAMP',
      isVerified: true
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Update (role: ADMIN)',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '현우',
      defaultNickname: '현우',
      avatarId: 'valorant_jett',
      avatarEmoji: '🗡️',
      updatedAt: 'SERVER_TIMESTAMP',
      role: 'ADMIN'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 4,
    name: 'Immutable memberId Tampering on Update',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_sehyun',
      nickname: '현우',
      defaultNickname: '현우',
      avatarId: 'valorant_jett',
      avatarEmoji: '🗡️',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 5,
    name: 'Immutable defaultNickname Tampering on Update',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '현우',
      defaultNickname: '해커',
      avatarId: 'valorant_jett',
      avatarEmoji: '🗡️',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 6,
    name: 'Nickname Boundary Overflow (> 40 chars)',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '가'.repeat(50),
      defaultNickname: '현우',
      avatarId: 'valorant_jett',
      avatarEmoji: '🗡️',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 7,
    name: 'Empty Nickname String',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '',
      defaultNickname: '현우',
      avatarId: 'valorant_jett',
      avatarEmoji: '🗡️',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 8,
    name: 'Invalid avatarId Regex Injection',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '현우',
      defaultNickname: '현우',
      avatarId: '../evil/script',
      avatarEmoji: '🗡️',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 9,
    name: 'Forged Client Timestamp instead of request.time',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '현우',
      defaultNickname: '현우',
      avatarId: 'valorant_jett',
      avatarEmoji: '🗡️',
      updatedAt: '2099-01-01T00:00:00Z'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 10,
    name: 'Value Poisoning on profileImageUrl (non-string)',
    path: '/profiles/kakao_hyunwoo',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo',
      nickname: '현우',
      defaultNickname: '현우',
      avatarId: 'valorant_jett',
      avatarEmoji: '🗡️',
      profileImageUrl: 12345,
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 11,
    name: 'Unauthorized Profile Document Deletion',
    path: '/profiles/kakao_hyunwoo_mom',
    operation: 'delete',
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 12,
    name: 'Unauthorized Write to /test/connection',
    path: '/test/connection',
    operation: 'create',
    payload: { status: 'hacked' },
    expectedResult: 'PERMISSION_DENIED'
  }
];
