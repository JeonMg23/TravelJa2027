import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

// Blueprint validation constants (synced verbatim with firebase-blueprint.json & firestore.rules)
export const TRIP_ID = 'tokyo_2027' as const;
export const MAX_MISSION_ID_LENGTH = 64;
export const MISSION_ID_PATTERN = /^[a-zA-Z0-9_\-]+$/;
export const MAX_TITLE_LENGTH = 80;
export const MAX_PLACE_TAG_LENGTH = 40;
export const MAX_PRAISE_NOTE_LENGTH = 120;
export const MAX_UPDATED_BY_LENGTH = 40;

const STORAGE_KEY_STAMP_MISSIONS = 'tokyo_trip_stamp_missions_v1';

export interface StampMissionItem {
  missionId: string;
  tripId: 'tokyo_2027';
  dayNumber: number; // 0: 엄마 특별 칭찬, 1..6: Day 1 ~ Day 6
  title: string;
  placeTag: string;
  rewardPoint: number; // 1..5
  hyunwooStamped: boolean;
  sehyunStamped: boolean;
  hyunwooRequested: boolean;
  sehyunRequested: boolean;
  praiseNote: string;
  updatedBy: string;
  isDeleted: boolean;
  isCustom?: boolean;
}

export interface PraiseBadgeTier {
  level: number;
  title: string;
  subtitle: string;
  minPoints: number;
  iconLabel: string;
  accentClass: string;
}

export const PRAISE_BADGE_TIERS: PraiseBadgeTier[] = [
  {
    level: 1,
    title: '도쿄 초보 탐험가',
    subtitle: '설레는 도쿄 원정 첫걸음 시작',
    minPoints: 0,
    iconLabel: 'Lv.1',
    accentClass: 'text-sky-400 border-sky-400/40 bg-sky-500/10'
  },
  {
    level: 2,
    title: '전철 환승 & 길찾기 대장',
    subtitle: '복잡한 도쿄 역도 척척 통과하는 에이스',
    minPoints: 8,
    iconLabel: 'Lv.2',
    accentClass: 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10'
  },
  {
    level: 3,
    title: '디즈니·마법학교 정복자',
    subtitle: '디즈니씨와 해리포터 스튜디오 완전 정복',
    minPoints: 18,
    iconLabel: 'Lv.3',
    accentClass: 'text-purple-400 border-purple-400/40 bg-purple-500/10'
  },
  {
    level: 4,
    title: '도쿄 레전드 원정대원',
    subtitle: '5박 6일 모든 미션을 완수한 최고의 소년 영웅',
    minPoints: 30,
    iconLabel: 'MAX',
    accentClass: 'text-amber-400 border-amber-400/50 bg-amber-500/15'
  }
];

export const DEFAULT_STAMP_MISSIONS: StampMissionItem[] = [
  {
    missionId: 'mission_d1_1',
    tripId: TRIP_ID,
    dayNumber: 1,
    title: '나리타 공항에서 소부선 쾌속 열차 무사 탑승하기',
    placeTag: '나리타공항 · 이동미션',
    rewardPoint: 1,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '긴시초까지 환승 없이 한 번에 출발!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d1_2',
    tripId: TRIP_ID,
    dayNumber: 1,
    title: '아사쿠사 센소지 가미나리몬 대제등 앞 형제 인증샷',
    placeTag: '아사쿠사 · 포토미션',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '도쿄 도착 첫 랜드마크 정복!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d1_3',
    tripId: TRIP_ID,
    dayNumber: 1,
    title: '도쿄 스카이트리 전망대 야경 눈으로 담기',
    placeTag: '스카이트리 · 야경미션',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '634m 높이에서 도쿄 불빛 찾기',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d2_1',
    tripId: TRIP_ID,
    dayNumber: 2,
    title: '디즈니씨 판타지 스프링스 & 인기 어트랙션 정복',
    placeTag: '디즈니씨 · 어트랙션',
    rewardPoint: 3,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '일찍 일어난 보람 100배!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d2_2',
    tripId: TRIP_ID,
    dayNumber: 2,
    title: '디즈니씨 시그니처 간식 맛있게 나눠 먹기',
    placeTag: '디즈니씨 · 간식미션',
    rewardPoint: 1,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '당 충전하고 에너지 풀충전!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d2_3',
    tripId: TRIP_ID,
    dayNumber: 2,
    title: '다리 아파도 끝까지 웃으며 야간 쇼 감상하기',
    placeTag: '디즈니씨 · 체력왕',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '오늘의 강철 체력 인정!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d3_1',
    tripId: TRIP_ID,
    dayNumber: 3,
    title: '해리포터 9와 3/4 승강장 카트 밀기 포즈 촬영',
    placeTag: '해리포터 · 포토미션',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '호그와트 입학 허가 완료!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d3_2',
    tripId: TRIP_ID,
    dayNumber: 3,
    title: '버터맥주 마시고 거품 수염 인증샷 남기기',
    placeTag: '해리포터 · 체험미션',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '달콤한 버터맥주 건배!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d3_3',
    tripId: TRIP_ID,
    dayNumber: 3,
    title: '시부야 스카이 전망대에서 스크램블 교차로 내려다보기',
    placeTag: '시부야 · 전망미션',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '도쿄 최고의 뷰 포인트 달성!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d4_1',
    tripId: TRIP_ID,
    dayNumber: 4,
    title: '가와구치코 호수에서 후지산 배경으로 멋진 점프샷',
    placeTag: '후지산 · 포토미션',
    rewardPoint: 3,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '웅장한 후지산 기운 듬뿍 받기!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d4_2',
    tripId: TRIP_ID,
    dayNumber: 4,
    title: '투어 버스 이동 중 매너 지키고 컨디션 잘 챙기기',
    placeTag: '후지산 · 매너왕',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '의젓한 원정대원 매너 최고!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d5_1',
    tripId: TRIP_ID,
    dayNumber: 5,
    title: '쓰키지 시장에서 신선한 초밥·계란말이 맛보기',
    placeTag: '쓰키지 · 미식미션',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '도쿄 미식 탐험가 등극!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d5_2',
    tripId: TRIP_ID,
    dayNumber: 5,
    title: '롯폰기 힐스 또는 도쿄타워 야경 앞에서 원정대 포즈',
    placeTag: '롯폰기 · 야경미션',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '도쿄의 마지막 밤을 화려하게!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d6_1',
    tripId: TRIP_ID,
    dayNumber: 6,
    title: '내 가방과 소중한 기념품 스스로 빠짐없이 챙기기',
    placeTag: '긴시초 · 자립왕',
    rewardPoint: 2,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '스스로 짐도 잘 챙기는 멋진 형제!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_d6_2',
    tripId: TRIP_ID,
    dayNumber: 6,
    title: '엄마들에게 "도쿄 여행 데려와 주셔서 감사합니다" 안아주기',
    placeTag: '귀국길 · 효도미션',
    rewardPoint: 3,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '엄마들 피로가 눈 녹듯 사라지는 순간!',
    updatedBy: '원정대 시스템',
    isDeleted: false
  },
  {
    missionId: 'mission_praise_1',
    tripId: TRIP_ID,
    dayNumber: 0,
    title: '하루 1만 보 이상 불평 없이 씩씩하게 걸은 강철 체력상',
    placeTag: '엄마칭찬 · 체력왕',
    rewardPoint: 3,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '현우맘·세현맘이 수여하는 특별 체력 배지!',
    updatedBy: '현우맘·세현맘',
    isDeleted: false
  },
  {
    missionId: 'mission_praise_2',
    tripId: TRIP_ID,
    dayNumber: 0,
    title: '여행 내내 서로 챙겨주고 양보한 든든한 우애상',
    placeTag: '엄마칭찬 · 우애왕',
    rewardPoint: 3,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '둘이 함께라서 더 즐거웠던 도쿄 원정대!',
    updatedBy: '현우맘·세현맘',
    isDeleted: false
  },
  {
    missionId: 'mission_praise_3',
    tripId: TRIP_ID,
    dayNumber: 0,
    title: '복잡한 도쿄 전철 환승과 길찾기를 도와준 내비게이션상',
    placeTag: '엄마칭찬 · 길찾기왕',
    rewardPoint: 3,
    hyunwooStamped: false,
    sehyunStamped: false,
    hyunwooRequested: false,
    sehyunRequested: false,
    praiseNote: '엄마들보다 길을 더 잘 찾는 든든한 아들들!',
    updatedBy: '현우맘·세현맘',
    isDeleted: false
  }
];

// Cross-tab BroadcastChannel for instant local tab sync
let stampBroadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    stampBroadcastChannel = new BroadcastChannel('tokyo_trip_stamp_missions_channel');
  }
} catch {
  stampBroadcastChannel = null;
}

export function sanitizeStampMissionPayload(item: StampMissionItem): {
  missionId: string;
  tripId: 'tokyo_2027';
  dayNumber: number;
  title: string;
  placeTag: string;
  rewardPoint: number;
  hyunwooStamped: boolean;
  sehyunStamped: boolean;
  hyunwooRequested: boolean;
  sehyunRequested: boolean;
  praiseNote: string;
  updatedBy: string;
  isDeleted: boolean;
} {
  const rawId = (item.missionId || '').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
  const safeId =
    rawId.length >= 1 && rawId.length <= MAX_MISSION_ID_LENGTH && MISSION_ID_PATTERN.test(rawId)
      ? rawId
      : `mission_custom_${Date.now()}`;

  const safeDay =
    typeof item.dayNumber === 'number' && Number.isInteger(item.dayNumber)
      ? Math.max(0, Math.min(6, item.dayNumber))
      : 1;

  const rawTitle = (item.title || '').trim();
  const safeTitle = rawTitle.length >= 1 ? rawTitle.slice(0, MAX_TITLE_LENGTH) : '도쿄 원정 미션';

  const rawTag = (item.placeTag || '').trim();
  const safeTag = rawTag.length >= 1 ? rawTag.slice(0, MAX_PLACE_TAG_LENGTH) : '도쿄 탐험';

  const safeReward =
    typeof item.rewardPoint === 'number' && Number.isInteger(item.rewardPoint)
      ? Math.max(1, Math.min(5, item.rewardPoint))
      : 2;

  const rawNote = (item.praiseNote || '').trim();
  const safeNote = rawNote.slice(0, MAX_PRAISE_NOTE_LENGTH);

  const rawUpdatedBy = (item.updatedBy || '원정대원').trim();
  const safeUpdatedBy =
    rawUpdatedBy.length >= 1 ? rawUpdatedBy.slice(0, MAX_UPDATED_BY_LENGTH) : '원정대원';

  return {
    missionId: safeId,
    tripId: TRIP_ID,
    dayNumber: safeDay,
    title: safeTitle,
    placeTag: safeTag,
    rewardPoint: safeReward,
    hyunwooStamped: Boolean(item.hyunwooStamped),
    sehyunStamped: Boolean(item.sehyunStamped),
    hyunwooRequested: Boolean(item.hyunwooRequested),
    sehyunRequested: Boolean(item.sehyunRequested),
    praiseNote: safeNote,
    updatedBy: safeUpdatedBy,
    isDeleted: Boolean(item.isDeleted)
  };
}

export function loadLocalStampMissions(): StampMissionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAMP_MISSIONS);
    if (raw) {
      const parsed: StampMissionItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return mergeWithDefaults(parsed);
      }
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_STAMP_MISSIONS;
}

export function saveLocalStampMissions(items: StampMissionItem[], broadcast = true): void {
  try {
    localStorage.setItem(STORAGE_KEY_STAMP_MISSIONS, JSON.stringify(items));
    if (broadcast && stampBroadcastChannel) {
      stampBroadcastChannel.postMessage({
        type: 'STAMP_MISSIONS_UPDATED',
        items,
        timestamp: Date.now()
      });
    }
  } catch {
    // ignore storage errors
  }
}

function mergeWithDefaults(remoteOrSaved: StampMissionItem[]): StampMissionItem[] {
  const byId = new Map<string, StampMissionItem>();
  for (const item of remoteOrSaved) {
    if (item && item.missionId) {
      byId.set(item.missionId, item);
    }
  }

  const defaultIds = new Set(DEFAULT_STAMP_MISSIONS.map((d) => d.missionId));
  const mergedDefaults = DEFAULT_STAMP_MISSIONS.map((def) => {
    const existing = byId.get(def.missionId);
    if (!existing) return def;
    return {
      ...def,
      hyunwooStamped: Boolean(existing.hyunwooStamped),
      sehyunStamped: Boolean(existing.sehyunStamped),
      hyunwooRequested: Boolean(existing.hyunwooRequested),
      sehyunRequested: Boolean(existing.sehyunRequested),
      praiseNote: existing.praiseNote ?? def.praiseNote,
      updatedBy: existing.updatedBy || def.updatedBy,
      isDeleted: Boolean(existing.isDeleted)
    };
  });

  const customItems = remoteOrSaved
    .filter((item) => item && item.missionId && !defaultIds.has(item.missionId))
    .map((item) => ({
      ...sanitizeStampMissionPayload(item),
      isCustom: true
    }));

  return [...mergedDefaults, ...customItems];
}

export async function saveStampMissionToFirestore(item: StampMissionItem): Promise<void> {
  const clean = sanitizeStampMissionPayload(item);
  const path = `stampMissions/${clean.missionId}`;
  try {
    await setDoc(doc(db, 'stampMissions', clean.missionId), {
      ...clean,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToStampMissions(
  onUpdate: (missions: StampMissionItem[]) => void
): () => void {
  const path = 'stampMissions';
  const q = query(collection(db, path), where('tripId', '==', TRIP_ID));

  const unsubscribeFirestore = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        return;
      }
      const remoteItems: StampMissionItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && typeof data.missionId === 'string') {
          remoteItems.push({
            missionId: data.missionId,
            tripId: TRIP_ID,
            dayNumber: typeof data.dayNumber === 'number' ? data.dayNumber : 1,
            title: typeof data.title === 'string' ? data.title : '도쿄 미션',
            placeTag: typeof data.placeTag === 'string' ? data.placeTag : '도쿄 탐험',
            rewardPoint: typeof data.rewardPoint === 'number' ? data.rewardPoint : 2,
            hyunwooStamped: Boolean(data.hyunwooStamped),
            sehyunStamped: Boolean(data.sehyunStamped),
            hyunwooRequested: Boolean(data.hyunwooRequested),
            sehyunRequested: Boolean(data.sehyunRequested),
            praiseNote: typeof data.praiseNote === 'string' ? data.praiseNote : '',
            updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : '원정대원',
            isDeleted: Boolean(data.isDeleted)
          });
        }
      });

      if (remoteItems.length > 0) {
        const currentLocal = loadLocalStampMissions();
        const remoteMap = new Map(remoteItems.map((r) => [r.missionId, r]));
        const combined = currentLocal.map((loc) => remoteMap.get(loc.missionId) || loc);
        for (const rem of remoteItems) {
          if (!combined.some((c) => c.missionId === rem.missionId)) {
            combined.push(rem);
          }
        }
        const finalMerged = mergeWithDefaults(combined);
        saveLocalStampMissions(finalMerged, false);
        onUpdate(finalMerged);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Logged structured FirestoreErrorInfo for debugging while keeping UI responsive
      }
    }
  );

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.type === 'STAMP_MISSIONS_UPDATED' && Array.isArray(event.data.items)) {
      onUpdate(event.data.items);
    }
  };

  if (stampBroadcastChannel) {
    stampBroadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    unsubscribeFirestore();
    if (stampBroadcastChannel) {
      stampBroadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

export function getBoyBadgeStatus(points: number): {
  currentTier: PraiseBadgeTier;
  nextTier: PraiseBadgeTier | null;
  progressPercent: number;
} {
  let currentTier = PRAISE_BADGE_TIERS[0];
  let nextTier: PraiseBadgeTier | null = null;

  for (let i = 0; i < PRAISE_BADGE_TIERS.length; i++) {
    if (points >= PRAISE_BADGE_TIERS[i].minPoints) {
      currentTier = PRAISE_BADGE_TIERS[i];
      nextTier = PRAISE_BADGE_TIERS[i + 1] || null;
    }
  }

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100
    };
  }

  const span = Math.max(1, nextTier.minPoints - currentTier.minPoints);
  const gained = Math.max(0, points - currentTier.minPoints);
  const progressPercent = Math.min(100, Math.round((gained / span) * 100));

  return {
    currentTier,
    nextTier,
    progressPercent
  };
}
