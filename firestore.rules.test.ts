/**
 * Security Rules Verification Suite for Tokyo Expedition Profiles & Stamp Missions
 * Verifies that all Dirty Dozen payloads return PERMISSION_DENIED.
 */

export interface DirtyPayloadTest {
  id: number;
  name: string;
  path: string;
  operation: 'create' | 'update' | 'delete' | 'get' | 'list';
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyPayloadTest[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Profile',
    path: '/profiles/kakao_hyunwoo_mom',
    operation: 'update',
    payload: {
      memberId: 'kakao_hyunwoo_mom',
      nickname: '현우맘',
      defaultNickname: '현우맘',
      avatarId: 'mom_1',
      avatarEmoji: '👩',
      isAdmin: true
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 2,
    name: 'Shadow Field Injection on StampMission',
    path: '/stampMissions/mission_d1_1',
    operation: 'create',
    payload: {
      missionId: 'mission_d1_1',
      tripId: 'tokyo_2027',
      dayNumber: 1,
      title: '아사쿠사 인증샷',
      placeTag: '아사쿠사',
      rewardPoint: 2,
      hyunwooStamped: true,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '최고!',
      updatedBy: '현우맘',
      isDeleted: false,
      bonusHack: 999
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 3,
    name: 'ID Poisoning on StampMission',
    path: '/stampMissions/bad$id!',
    operation: 'create',
    payload: {
      missionId: 'bad$id!',
      tripId: 'tokyo_2027',
      dayNumber: 1,
      title: '미션',
      placeTag: '도쿄',
      rewardPoint: 1,
      hyunwooStamped: false,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 4,
    name: 'Cross-Trip Spoofing',
    path: '/stampMissions/mission_d1_1',
    operation: 'create',
    payload: {
      missionId: 'mission_d1_1',
      tripId: 'osaka_9999',
      dayNumber: 1,
      title: '미션',
      placeTag: '오사카',
      rewardPoint: 1,
      hyunwooStamped: false,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 5,
    name: 'Out-of-Bounds Reward Points',
    path: '/stampMissions/mission_d1_1',
    operation: 'update',
    payload: {
      missionId: 'mission_d1_1',
      tripId: 'tokyo_2027',
      dayNumber: 1,
      title: '미션',
      placeTag: '도쿄',
      rewardPoint: 100,
      hyunwooStamped: true,
      sehyunStamped: true,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 6,
    name: 'Out-of-Bounds Day Number',
    path: '/stampMissions/mission_d1_1',
    operation: 'create',
    payload: {
      missionId: 'mission_d1_1',
      tripId: 'tokyo_2027',
      dayNumber: 99,
      title: '미션',
      placeTag: '도쿄',
      rewardPoint: 2,
      hyunwooStamped: false,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 7,
    name: 'Oversized Title Denial of Wallet',
    path: '/stampMissions/mission_d1_1',
    operation: 'update',
    payload: {
      missionId: 'mission_d1_1',
      tripId: 'tokyo_2027',
      dayNumber: 1,
      title: 'A'.repeat(500),
      placeTag: '도쿄',
      rewardPoint: 2,
      hyunwooStamped: false,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 8,
    name: 'Timestamp Forgery',
    path: '/stampMissions/mission_d1_1',
    operation: 'update',
    payload: {
      missionId: 'mission_d1_1',
      tripId: 'tokyo_2027',
      dayNumber: 1,
      title: '미션',
      placeTag: '도쿄',
      rewardPoint: 2,
      hyunwooStamped: true,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false,
      updatedAt: '2099-01-01T00:00:00Z'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 9,
    name: 'Immutable Key Mutation on Update',
    path: '/stampMissions/mission_d1_1',
    operation: 'update',
    payload: {
      missionId: 'mission_d1_2',
      tripId: 'tokyo_2027',
      dayNumber: 1,
      title: '미션',
      placeTag: '도쿄',
      rewardPoint: 2,
      hyunwooStamped: true,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 10,
    name: 'Type Poisoning on Stamp Booleans',
    path: '/stampMissions/mission_d1_1',
    operation: 'update',
    payload: {
      missionId: 'mission_d1_1',
      tripId: 'tokyo_2027',
      dayNumber: 1,
      title: '미션',
      placeTag: '도쿄',
      rewardPoint: 2,
      hyunwooStamped: 'yes',
      sehyunStamped: false,
      hyunwooRequested: 'true',
      sehyunRequested: false,
      praiseNote: '',
      updatedBy: '현우맘',
      isDeleted: false
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 11,
    name: 'Hard Delete Attempt on StampMission',
    path: '/stampMissions/mission_d1_1',
    operation: 'delete',
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 12,
    name: 'Unmapped Collection Write',
    path: '/unmappedHack/doc1',
    operation: 'create',
    payload: { hacked: true },
    expectedResult: 'PERMISSION_DENIED'
  }
];
