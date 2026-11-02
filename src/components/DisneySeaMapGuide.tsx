import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Navigation,
  Sparkles,
  Utensils,
  Ticket,
  Footprints,
  Ship,
  Train,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Compass,
  ZoomIn,
  ZoomOut,
  Eye,
  Camera,
  Map as MapIcon
} from 'lucide-react';

export type DisneyRouteCourseId = 'standard-openrun' | 'boys-thrill' | 'mom-stamina-save';

export interface DisneyZoneNode {
  id: string;
  portNumber: number;
  name: string;
  shortPinTitle: string;
  japaneseName: string;
  englishName: string;
  x: number; // Official Map SVG 0..800
  y: number; // Official Map SVG 0..450
  lat: number;
  lng: number;
  badgeColor: string;
  glowColor: string;
  iconEmoji: string;
  realPhotoUrl: string;
  secondaryPhotoUrl?: string;
  secondaryPhotoLabel?: string;
  buildingLookSummary: string;
  firstTimerLandmarkTip: string;
  keyAttractions: {
    name: string;
    passType: 'DPA (유료 우선)' | '40주년 PP (무료 우선)' | '스탠바이 (일반 대기)' | '야간 하이라이트 쇼';
    thrillLevel: string;
    buildingLook: string;
    desc: string;
  }[];
  mustEatSnacks: {
    name: string;
    shop: string;
    price: string;
    eggSafeNote?: string;
  }[];
  transitInsideTip: string;
}

export interface DisneyRouteStep {
  stepNumber: number;
  timeRange: string;
  zoneId: string;
  zoneName: string;
  title: string;
  actionBadge: string;
  howToMove: string;
  visualDirectionTip: string;
  detailTip: string;
}

export interface DisneyRouteCourse {
  id: DisneyRouteCourseId;
  title: string;
  subtitle: string;
  badge: string;
  shortLabel: string;
  targetWho: string;
  totalWalkEstimate: string;
  routeSummary: string;
  steps: DisneyRouteStep[];
}

// Exact coordinates calibrated to the official Tokyo DisneySea Korean Guide Map (800 x 450)
export const MAIN_ENTRANCE_COORD = { x: 208, y: 392 };

export const DISNEYSEA_ZONES: DisneyZoneNode[] = [
  {
    id: 'mediterranean-harbor',
    portNumber: 1,
    name: '메디테러니언 하버 (정문·소어린)',
    shortPinTitle: '소어린·하버',
    japaneseName: 'メディテレーニアンハーバー',
    englishName: 'Mediterranean Harbor',
    x: 318,
    y: 285,
    lat: 35.62605,
    lng: 139.88505,
    badgeColor: 'from-amber-400 to-orange-500 text-slate-950',
    glowColor: '#f59e0b',
    iconEmoji: '🏛️',
    realPhotoUrl: '/images/disneysea/mediterranean.jpg',
    secondaryPhotoUrl: '/images/disneysea/prometheus.jpg',
    secondaryPhotoLabel: '하버 너머로 보이는 프로메테우스 화산',
    buildingLookSummary:
      '입구 파란 대형 지구본 분수(아쿠아스피어)를 지나면 나오는 붉은 지붕의 이탈리아 항구 마을 & 오른쪽 언덕 위 파란 돔 지붕의 소어린 박물관 건물',
    firstTimerLandmarkTip:
      '공식 지도 하단 파란 지구본(정문)을 지나 아치 터널을 통과한 뒤, 호수 오른쪽 오르막길로 올라가면 파란 둥근 지붕의 [소어린] 건물이 바로 보입니다!',
    keyAttractions: [
      {
        name: '소어린: 판타스틱 플라이트 (Soaring)',
        passType: 'DPA (유료 우선)',
        thrillLevel: '★☆☆☆☆ (감동 비행 시뮬레이터 · 가족 만장일치 1위)',
        buildingLook: '언덕 위 파란색 반구형 돔 지붕과 하얀 기둥이 있는 르네상스 박물관 대저택 외관',
        desc: '행글라이더를 타고 전 세계 명소와 도쿄 상공을 나는 초대형 돔 스크린 어트랙션. 오픈런 1순위 또는 DPA 필수!'
      },
      {
        name: '디즈니씨 트랜짓 스팀보트 (유람선)',
        passType: '스탠바이 (일반 대기)',
        thrillLevel: '★☆☆☆☆ (체력 세이브 수상 이동수단)',
        buildingLook: '항구 물가에 빨간 물레방아 바퀴가 달린 하얀 증기선 선착장',
        desc: '하버에서 파크 북쪽(로스트 리버 델타·판타지 스프링스 입구)까지 한 번에 태워주는 증기선!'
      },
      {
        name: '빌리브! 씨 오브 드림스 (19:15 야간 해상 쇼)',
        passType: '야간 하이라이트 쇼',
        thrillLevel: '★★★★★ (초대형 수상 레이저·불꽃·프로젝션 쇼)',
        buildingLook: '중앙 거대 호수 전체와 미라코스타 호텔 외벽 전체가 무대로 변신',
        desc: '18:30부터 하버 석축 계단에 자리 잡고 감상하는 디즈니씨 최고의 피날레 쇼.'
      }
    ],
    mustEatSnacks: [
      {
        name: '크림 브륄레 풍 츄러스 (밀크티/시나몬)',
        shop: '잠비니 브라더스 리스토란테 / 베이사이드 테이크아웃',
        price: '¥600',
        eggSafeNote: '현우 주의: 츄러스 반죽·커스터드 크림에 계란 성분이 포함될 수 있어 현장 알레르기 표기 확인 권장'
      },
      {
        name: '미키 아이스바 (트로피컬 후르츠 / 피치)',
        shop: '하버 주변 아이스크림 왜건',
        price: '¥400',
        eggSafeNote: '현우 안심 추천! 과일 샤베트 타입 아이스바는 계란 무첨가(Egg-Free) 간식으로 현우에게 강추'
      }
    ],
    transitInsideTip:
      '입장 게이트 통과 직후 걸음을 멈추지 말고 소어린 방향으로 이동하면서 스마트폰 앱으로 패스(DPA/PP)를 발권하세요!'
  },
  {
    id: 'american-waterfront',
    portNumber: 2,
    name: '아메리칸 워터프런트 (토이스토리·타워오브테러)',
    shortPinTitle: '토이스토리·타워',
    japaneseName: 'アメリカンウォーターフロント',
    englishName: 'American Waterfront',
    x: 115,
    y: 205,
    lat: 35.62472,
    lng: 139.88192,
    badgeColor: 'from-rose-500 to-red-600 text-white',
    glowColor: '#f43f5e',
    iconEmoji: '🚢',
    realPhotoUrl: '/images/disneysea/tower_of_terror.jpg',
    secondaryPhotoUrl: '/images/disneysea/toy_story.jpg',
    secondaryPhotoLabel: '토이스토리 매니아 & S.S. 콜럼비아호',
    buildingLookSummary:
      '공식 지도 왼쪽 끝에 크게 그려진 검은·흰색 대형 여객선(S.S. 콜럼비아호), 보라빛 고층 호텔(타워 오브 테러), 거대한 우디 얼굴 입구(토이스토리 매니아)',
    firstTimerLandmarkTip:
      '정문에서 왼쪽으로 가면 지도 왼쪽 끝에 그려진 초대형 여객선(S.S. 콜럼비아호)과 보라빛 고층 호텔(타워 오브 테러), 우디 얼굴 입구(토이스토리 매니아)가 모여 있습니다!',
    keyAttractions: [
      {
        name: '토이스토리 매니아! (Toy Story Mania!)',
        passType: 'DPA (유료 우선)',
        thrillLevel: '★★☆☆☆ (3D 슈팅 대결 · 현우·세현 승부욕 폭발)',
        buildingLook: '카우보이 모자를 쓴 초대형 우디 얼굴 입구와 화려한 전구 카니발 간판',
        desc: '트램을 타고 3D 안경을 쓴 채 총을 쏘며 점수를 겨루는 슈팅 게임! 중학생 형제 최고 인기 코스.'
      },
      {
        name: '타워 오브 테러 (Tower of Terror)',
        passType: 'DPA (유료 우선)',
        thrillLevel: '★★★★★ (수직 급강하 엘리베이터 · 최고 스릴)',
        buildingLook: '높이 59m의 적갈색·보라빛 무어식 고딕 고층 호텔 건물',
        desc: '저주받은 호텔 하이타워 최상층에서 파크 전경을 보여준 직후 수직 낙하하는 스릴 어트랙션!'
      },
      {
        name: '디즈니씨 일렉트릭 레일웨이 (고가 전철)',
        passType: '스탠바이 (일반 대기)',
        thrillLevel: '★☆☆☆☆ (체력 아끼는 파크 내 고가 전철)',
        buildingLook: '붉은 벽돌 2층 역사와 고가 철교 위를 달리는 빨간 빈티지 전철',
        desc: '아메리칸 워터프런트 역에서 포트 디스커버리 역까지 고가 철교를 따라 편하게 이동!'
      }
    ],
    mustEatSnacks: [
      {
        name: '리틀 그린맨 모찌 (초코·딸기·커스터드 3구)',
        shop: '마마 비스코티즈 베이커리 / 왜건',
        price: '¥400',
        eggSafeNote: '현우 주의: 커스터드 맛 필링에 계란 함유. 현우는 초코·딸기 맛만 먹거나 훈제 칠면조 다리 추천!'
      },
      {
        name: '스모크 터키레그 (훈제 칠면조 다리) & 포크 라이스롤',
        shop: '리버티 랜딩 다이너 / 리프레쉬먼트 스테이션',
        price: '¥900',
        eggSafeNote: '현우 든든 간식 추천! 훈제 칠면조 다리와 삼겹살 밥말이(포크 라이스롤)는 계란 없이 든든하게 섭취 가능'
      }
    ],
    transitInsideTip:
      '토이스토리 매니아와 타워 오브 테러를 탄 뒤 바로 앞 [일렉트릭 레일웨이 전철]을 타면 포트 디스커버리까지 다리 안 아프게 이동합니다!'
  },
  {
    id: 'port-discovery',
    portNumber: 3,
    name: '포트 디스커버리 (니모·아쿠아토피아·전철역)',
    shortPinTitle: '니모·전철역',
    japaneseName: 'ポートディスカバリー',
    englishName: 'Port Discovery',
    x: 268,
    y: 112,
    lat: 35.62585,
    lng: 139.88145,
    badgeColor: 'from-yellow-400 to-amber-500 text-slate-950',
    glowColor: '#eab308',
    iconEmoji: '🐠',
    realPhotoUrl: '/images/disneysea/port_discovery.jpg',
    secondaryPhotoUrl: '/images/disneysea/electric_railway.jpg',
    secondaryPhotoLabel: '일렉트릭 레일웨이 전철역',
    buildingLookSummary:
      '공식 지도 좌측 상단 노란 라벨 오른쪽에 그려진 파란 둥근 지붕 해양연구소(니모 시라이더)와 원형 워터 라군(아쿠아토피아)',
    firstTimerLandmarkTip:
      '원형 바다 호수 위로 회전하는 보트(아쿠아토피아)가 보이고, 그 뒤편 파란·황금색 미래형 해양연구소 건물이 [니모 & 프렌즈 시라이더]입니다.',
    keyAttractions: [
      {
        name: '니모 & 프렌즈 시라이더 (Nemo & Friends Searider)',
        passType: '40주년 PP (무료 우선)',
        thrillLevel: '★★☆☆☆ (실내 잠수정 시뮬레이터 · 시원한 휴식 겸용)',
        buildingLook: '파란 둥근 돔 지붕과 황금색 기상 관측탑이 솟아 있는 해양연구소 건물',
        desc: '물고기 크기로 줄어드는 잠수정을 타고 니모·도리와 함께 바닷속을 탐험하는 4D 시뮬레이터.'
      },
      {
        name: '아쿠아토피아 (Aquatopia)',
        passType: '스탠바이 (일반 대기)',
        thrillLevel: '★★☆☆☆ (물 위를 예측불허로 회전하는 워터카)',
        buildingLook: '포트 디스커버리 중앙 얕은 원형 수로 위를 자동으로 돌아다니는 3인승 보트',
        desc: '대기줄이 짧고 시원한 물바람을 맞으며 타기 좋은 야외 워터 어트랙션.'
      }
    ],
    mustEatSnacks: [
      {
        name: '우키와만 (도날드 구명튜브 모양 통새우 만두)',
        shop: '시사이드 스낵 (해안가 매점)',
        price: '¥600',
        eggSafeNote: '현우 주의: 만두피·새우 반죽에 난백(계란흰자)이 소량 들어갈 수 있어 구매 시 확인 권장'
      }
    ],
    transitInsideTip:
      '전철(일렉트릭 레일웨이) 종점 역이 바로 이곳입니다! 여기서 오른쪽 정글 다리만 건너면 인디아나 존스(로스트 리버 델타)로 바로 이어집니다.'
  },
  {
    id: 'lost-river-delta',
    portNumber: 4,
    name: '로스트 리버 델타 (인디아나 존스·레이징 스피리츠)',
    shortPinTitle: '인디아나존스',
    japaneseName: 'ロストリバーデルタ',
    englishName: 'Lost River Delta',
    x: 478,
    y: 108,
    lat: 35.62855,
    lng: 139.88245,
    badgeColor: 'from-emerald-500 to-green-700 text-white',
    glowColor: '#10b981',
    iconEmoji: '🏺',
    realPhotoUrl: '/images/disneysea/indiana_jones.jpg',
    secondaryPhotoUrl: '/images/disneysea/raging_spirits.jpg',
    secondaryPhotoLabel: '레이징 스피리츠 360도 롤러코스터',
    buildingLookSummary:
      '공식 지도 상단 초록 라벨 아래에 크게 그려진 갈색 마야 피라미드 신전(인디아나 존스)과 360도 회전 롤러코스터(레이징 스피리츠)',
    firstTimerLandmarkTip:
      '정글 강변에 우뚝 솟은 거대한 고대 마야 계단식 돌 피라미드(인디아나 존스)와 바로 오른쪽 옆 불타는 유적지 롤러코스터(레이징 스피리츠)가 나란히 있습니다!',
    keyAttractions: [
      {
        name: '인디아나 존스 어드벤처: 크리스탈 스컬의 마궁',
        passType: '40주년 PP (무료 우선)',
        thrillLevel: '★★★★☆ (고속 정글 오프로드 지프차 · 남학생 만족도 최상)',
        buildingLook: '정글 숲 위로 우뚝 솟은 거대한 회갈색 계단식 마야 피라미드 석조 신전',
        desc: '12인승 군용 지프차를 타고 해골 신전 내부를 초고속으로 질주하며 거대 바위와 불꽃을 피하는 명작!'
      },
      {
        name: '레이징 스피리츠 (Raging Spirits)',
        passType: '40주년 PP (무료 우선)',
        thrillLevel: '★★★★★ (디즈니씨 유일 360도 수직 루프 롤러코스터)',
        buildingLook: '고대 석상 유적에서 불꽃과 물안개가 솟구치고 360도 원형 코스터 트랙이 보이는 구조물',
        desc: '불과 물의 신전 유적을 360도 회전하며 달리는 야외 스릴 롤러코스터. 판타지 스프링스 입구 바로 옆!'
      }
    ],
    mustEatSnacks: [
      {
        name: '스파이시 스모크 치킨레그 & 유카탄 소시지독',
        shop: '로스트 리버 쿡하우스 / 익스페디션 이트',
        price: '¥600',
        eggSafeNote: '현우 강추 간식! 매콤 훈제 치킨다리와 소시지독은 계란 걱정 없이 걸어 다니며 먹기 최고입니다'
      }
    ],
    transitInsideTip:
      '하버에서 걸어오면 15분 걸리지만 [트랜짓 스팀보트] 유람선을 타면 이곳 선착장 바로 앞에 내려주어 체력을 엄청 아낄 수 있습니다!'
  },
  {
    id: 'fantasy-springs',
    portNumber: 5,
    name: '판타지 스프링스 (신규! 겨울왕국·라푼젤·피터팬)',
    shortPinTitle: '판타지스프링스',
    japaneseName: 'ファンタジースプリングス',
    englishName: 'Fantasy Springs',
    x: 665,
    y: 142,
    lat: 35.62995,
    lng: 139.88425,
    badgeColor: 'from-sky-500 via-indigo-600 to-purple-600 text-white',
    glowColor: '#38bdf8',
    iconEmoji: '❄️',
    realPhotoUrl: '/images/disneysea/frozen_kingdom.jpg',
    secondaryPhotoUrl: '/images/disneysea/rapunzel_forest.jpg',
    secondaryPhotoLabel: '라푼젤의 탑 & 피터팬 네버랜드',
    buildingLookSummary:
      '공식 지도 우측 상단에 확장된 신규 구역! 오른쪽 끝 하얀 눈 덮인 산(겨울왕국 얼음궁전·아렌델 성), 숲속 라푼젤의 탑, 피터팬 해적선',
    firstTimerLandmarkTip:
      '로스트 리버 델타와 아라비안 코스트 사이 통로로 들어가면 오른쪽 끝에 하얀 눈 덮인 산과 아렌델 성(겨울왕국), 가운데에 라푼젤의 탑, 왼쪽에 피터팬 해적선이 펼쳐집니다!',
    keyAttractions: [
      {
        name: '안나와 엘사의 프로즌 저니 (겨울왕국)',
        passType: 'DPA (유료 우선)',
        thrillLevel: '★★☆☆☆ (최신 애니매트로닉스 보트 라이드 · 최고 인기작)',
        buildingLook: '지도 우측 끝 눈 덮인 노스마운틴 꼭대기의 얼음궁전과 아렌델 왕국 성',
        desc: '보트를 타고 Let It Go 등 명곡과 함께 겨울왕국 명장면을 체험하는 디즈니씨 최고 인기 어트랙션!'
      },
      {
        name: '라푼젤의 랜턴 페스티벌 (Rapunzel)',
        passType: 'DPA (유료 우선)',
        thrillLevel: '★☆☆☆☆ (수백 개의 황금 풍등이 떠 있는 환상적인 보트 투어)',
        buildingLook: '계곡 절벽 위에 우뚝 솟은 높은 돌탑(라푼젤의 탑)과 보트 선착장',
        desc: '실제 라푼젤의 높은 탑에서 노래하는 라푼젤을 보고 수백 개 풍등 속을 지나는 힐링 코스.'
      },
      {
        name: '피터팬의 네버랜드 어드벤처 (Peter Pan)',
        passType: 'DPA (유료 우선)',
        thrillLevel: '★★★☆☆ (3D 안경 착용 하늘 비행 다크라이드 · 현우·세현 취향 저격)',
        buildingLook: '해골 바위와 후크 선장의 붉은 돛 해적선(졸리 로저호) 맞은편 숲속 건물',
        desc: '팅커벨의 요정 가루를 맞고 보트가 하늘로 떠올라 후크 선장과 대결하는 최첨단 3D 어트랙션!'
      }
    ],
    mustEatSnacks: [
      {
        name: '로스트 비프 팝콘 & 스너글링 덕클링 버거',
        shop: '판타지 스프링스 팝콘 왜건 / 스너글링 덕클링',
        price: '¥400 ~ ¥1,490',
        eggSafeNote: '현우 추천: 판타지 스프링스 한정 로스트 비프 맛 팝콘은 계란 없이 고소하고 짭짤해 간식으로 최고!'
      }
    ],
    transitInsideTip:
      '파크 가장 오른쪽 끝이므로 인디아나 존스/레이징 스피리츠 일정과 묶어서 한 번에 다녀오면 동선 낭비가 전혀 없습니다!'
  },
  {
    id: 'arabian-coast',
    portNumber: 6,
    name: '아라비안 코스트 (알라딘 궁전·신드바드)',
    shortPinTitle: '아라비안코스트',
    japaneseName: 'アラビアンコースト',
    englishName: 'Arabian Coast',
    x: 528,
    y: 192,
    lat: 35.62755,
    lng: 139.88615,
    badgeColor: 'from-violet-500 to-purple-700 text-white',
    glowColor: '#a855f7',
    iconEmoji: '🕌',
    realPhotoUrl: '/images/disneysea/arabian_coast.jpg',
    buildingLookSummary:
      '공식 지도 보라색 라벨 바로 위에 그려진 푸른색·황금색 양파 모양 둥근 돔 지붕의 알라딘 궁전과 2층 회전목마',
    firstTimerLandmarkTip:
      '판타지 스프링스 입구에서 아래로 내려오면 이국적인 푸른색·황금색 둥근 아라비아 궁전 돔 지붕과 2층 회전목마 건물이 바로 나타납니다!',
    keyAttractions: [
      {
        name: '신드바드 스토리북 보야지 (Sindbad)',
        passType: '스탠바이 (일반 대기)',
        thrillLevel: '★☆☆☆☆ (대기 5~15분! 다리 쉴 겸 타는 10분 실내 보트)',
        buildingLook: '푸른 타일 아치 입구와 황금 반달 장식이 있는 아라비아 항구풍 건물',
        desc: '아기 호랑이 찬두와 함께 항해하는 실내 보트 라이드. 대기시간이 짧고 에어컨이 시원해 휴식 코스로 최고!'
      },
      {
        name: '캐러밴 카루셀 (2층 회전목마) & 매직 램프 시어터',
        passType: '40주년 PP (무료 우선)',
        thrillLevel: '★☆☆☆☆ (지니를 만나는 마술 극장 & 2층 회전목마)',
        buildingLook: '궁전 안뜰 중앙의 거대한 푸른·황금빛 돔 천막 건물(2층 회전목마)',
        desc: '알라딘의 지니를 직접 탈 수 있는 2층 회전목마와 3D 마술쇼를 결합한 극장.'
      }
    ],
    mustEatSnacks: [
      {
        name: '캐시바 푸드코트 전통 난 & 치킨/비프 커리 세트',
        shop: '캐시바 푸드코트 (Casbah Food Court)',
        price: '¥1,100 ~ ¥1,580',
        eggSafeNote: '현우 안심 식사 추천! 기본 커리 & 구운 난 세트는 계란 없이 든든하게 점심/저녁 식사 가능'
      },
      {
        name: '카레 맛 팝콘',
        shop: '아라비안 코스트 입구 팝콘 왜건',
        price: '¥400',
        eggSafeNote: '현우 안심 간식! 중독성 강한 카레 향 팝콘 (계란 무첨가)'
      }
    ],
    transitInsideTip:
      '판타지 스프링스에서 내려오는 길목에 바로 붙어 있어 점심 식사(커리) 또는 오후 휴식 코스로 최적입니다.'
  },
  {
    id: 'mermaid-lagoon',
    portNumber: 7,
    name: '머메이드 라군 (트라이톤 조개 궁전·실내 휴식)',
    shortPinTitle: '머메이드라군',
    japaneseName: 'マーメイドラグーン',
    englishName: 'Mermaid Lagoon',
    x: 418,
    y: 188,
    lat: 35.62745,
    lng: 139.88445,
    badgeColor: 'from-pink-400 to-rose-500 text-slate-950',
    glowColor: '#ec4899',
    iconEmoji: '🐚',
    realPhotoUrl: '/images/disneysea/mermaid_lagoon.jpg',
    buildingLookSummary:
      '공식 지도 정중앙 분홍색 라벨 아래에 그려진 분홍·주황·민트색 거대한 조개껍질과 산호초 첨탑 모양의 화려한 트라이톤 왕 궁전',
    firstTimerLandmarkTip:
      '화산 바로 옆에 거대한 분홍색·민트색 조개껍데기와 산호초 모양의 알록달록한 성이 서 있어서 처음 가도 1초 만에 찾을 수 있습니다! 안으로 들어가면 거대한 실내 지하 광장이 나옵니다.',
    keyAttractions: [
      {
        name: '트라이톤 왕국의 언더 더 씨 (실내 테마파크 존)',
        passType: '스탠바이 (일반 대기)',
        thrillLevel: '★☆☆☆☆ (에어컨/난방 완비 실내 놀이터 & 휴식 성지)',
        buildingLook: '분홍·청록색 거대 소라껍질 첨탑과 황금 삼지창이 장식된 킹 트라이톤 캐슬 내부 지하 광장',
        desc: '귀여운 실내 라이드와 670석 규모 실내 카페(칼립소 키친)가 있어 엄마 다리 쉬기 1등 장소!'
      },
      {
        name: '플라운더의 플라잉 피쉬 코스터',
        passType: '스탠바이 (일반 대기)',
        thrillLevel: '★★☆☆☆ (가볍고 상쾌한 야외 미니 롤러코스터)',
        buildingLook: '조개 궁전 바깥쪽 물가 위에 설치된 노란 물고기 모양 롤러코스터',
        desc: '날치를 타고 물가를 스치듯 달리는 아기자기한 야외 코스터.'
      }
    ],
    mustEatSnacks: [
      {
        name: '세바스찬의 칼립소 키친 (조개 모양 피자·쉬림프 세트)',
        shop: '세바스찬의 칼립소 키친 (실내 지하 1층)',
        price: '¥950 ~ ¥1,490',
        eggSafeNote: '현우 주의: 조개 모양 빵·튀김옷에 계란 포함 가능성 있음. 현우는 감자튀김·소시지·음료 위주 추천!'
      }
    ],
    transitInsideTip:
      '오후 2시~4시 가장 피곤할 때 이곳 실내(언더 더 씨)에 들어와 소파 좌석에서 시원한 음료를 마시며 30분 충전하세요!'
  },
  {
    id: 'mysterious-island',
    portNumber: 8,
    name: '미스테리어스 아일랜드 (프로메테우스 화산·센터오브디어스)',
    shortPinTitle: '화산·센터오브디어스',
    japaneseName: 'ミステリアスアイランド',
    englishName: 'Mysterious Island',
    x: 288,
    y: 156,
    lat: 35.62675,
    lng: 139.88415,
    badgeColor: 'from-teal-500 to-emerald-700 text-white',
    glowColor: '#14b8a6',
    iconEmoji: '🌋',
    realPhotoUrl: '/images/disneysea/prometheus.jpg',
    buildingLookSummary:
      '공식 지도 중앙에 붉은 용암이 흐르는 거대한 갈색 바위 활화산(프로메테우스 화산)과 화산 호수의 잠수함 기지',
    firstTimerLandmarkTip:
      '디즈니씨 어디서나 보이는 정중앙 51m 활화산입니다! 길을 잃으면 무조건 이 화산을 보고 방향을 잡으세요. 화산 동굴 터널 안으로 들어가면 [센터 오브 디 어스] 입구가 나옵니다!',
    keyAttractions: [
      {
        name: '센터 오브 디 어스 (Center of the Earth)',
        passType: 'DPA (유료 우선)',
        thrillLevel: '★★★★★ (화산 분화구 밖으로 시속 75km 급발진! 디즈니씨 스릴 1위)',
        buildingLook: '프로메테우스 화산 분화구 안쪽 동굴 벽면에 뚫린 지열 탐사기지 입구',
        desc: '지하 세계를 탐험하다가 거대 괴물을 만나 화산 꼭대기 분화구 밖으로 시속 75km로 튕겨 나가는 최고 스릴 어트랙션!'
      },
      {
        name: '해저 2만 마일 (20,000 Leagues Under the Sea)',
        passType: '40주년 PP (무료 우선)',
        thrillLevel: '★★☆☆☆ (서치라이트를 직접 비추며 심해를 탐험하는 소형 잠수정)',
        buildingLook: '화산 아래 호수 옆 철제 크레인과 원통형 잠수함이 매달려 있는 네모 선장의 기지',
        desc: '가족 4명이 한 잠수정에 함께 타고 서치라이트로 심해 괴물과 아틀란티스 유적을 비춰보는 어트랙션.'
      }
    ],
    mustEatSnacks: [
      {
        name: '교자 도그 (화산 명물 긴 만두 번)',
        shop: '노틸러스 갤리 (화산 호수 아래 잠수함 선착장 옆)',
        price: '¥600',
        eggSafeNote: '현우 안심 간식 체크: 돼지고기·양배추 만두소가 꽉 찬 찐빵 형태 (현장 알레르기 표기 확인 가능)'
      },
      {
        name: '볼케이니아 레스토랑 중화요리 세트 (마파두부·볶음밥·탕수육)',
        shop: '볼케이니아 레스토랑 (화산 동굴 내부)',
        price: '¥1,380 ~ ¥2,180',
        eggSafeNote: '현우 식사 팁: 계란볶음밥 대신 흰쌀밥(ライス) + 마파두부/고추잡채 단품 조합으로 주문하면 계란 없이 든든!'
      }
    ],
    transitInsideTip:
      '파크 정중앙 허브 역할을 합니다! 동서남북 어디로든 화산 안쪽 터널 길을 통과하면 이동 거리를 절반으로 줄일 수 있습니다.'
  }
];

export const DISNEYSEA_ROUTE_COURSES: DisneyRouteCourse[] = [
  {
    id: 'standard-openrun',
    title: '코스 1. 07:00 오픈런 정석 풀코스 (소어린 + 판타지 스프링스)',
    subtitle: '가족 4인 밸런스 최고 · 핵심 대작 어트랙션 & 야간 해상 쇼 완벽 정복',
    badge: '추천 1순위',
    shortLabel: '🏆 정석 오픈런 코스',
    targetWho: '엄마 · 현우 · 세현 · 이모 4인 전원 만족 밸런스 코스',
    totalWalkEstimate: '스팀보트 1회 + 전철 1회 포함 (도보 부담 대폭 절감)',
    routeSummary:
      '정문 입구 → ① 메디테러니언 하버(소어린) → 🚢 증기선 → ② 로스트 리버 델타(인디아나존스) → ③ 판타지 스프링스(겨울왕국·피터팬) → ④ 머메이드 라군(실내 휴식) → ⑤ 아메리칸 워터프런트(토이스토리·타워오브테러) → ⑥ 미스테리어스 아일랜드(화산 센터오브디어스) → ⑦ 야간 해상 쇼',
    steps: [
      {
        stepNumber: 1,
        timeRange: '07:00 ~ 10:00',
        zoneId: 'mediterranean-harbor',
        zoneName: '① 메디테러니언 하버 (정문 지구본 → 소어린)',
        title: '입장 즉시 판타지스프링스 DPA 발권 & [소어린] 오픈런',
        actionBadge: '입장 직후 앱 발권 + 오픈런',
        howToMove: '정문 게이트 통과 → 미라코스타 아치 통과 후 우측 언덕길 도보 5분',
        visualDirectionTip:
          '공식 지도 하단 파란 지구본(정문)을 지나 갈색 [메디테러니언 하버] 라벨 오른쪽 언덕 위 파란 돔 지붕 건물이 [소어린]입니다.',
        detailTip:
          '전원 QR 스캔 직후 걸어가면서 ① [겨울왕국 프로즌 저니] DPA(유료)와 ② [인디아나 존스] 40주년 PP(무료)를 동시에 발권하고 소어린 대기줄로 직행합니다!'
      },
      {
        stepNumber: 2,
        timeRange: '10:15 ~ 12:15',
        zoneId: 'lost-river-delta',
        zoneName: '④ 로스트 리버 델타 (정글 마야 피라미드 신전)',
        title: '증기선 타고 북쪽 정글로 이동 → [인디아나 존스] & 치킨레그',
        actionBadge: '🚢 스팀보트 탑승 (체력 세이브)',
        howToMove: '하버 선착장에서 [트랜짓 스팀보트] 유람선 탑승 (약 7분 수상 이동)',
        visualDirectionTip:
          '공식 지도 상단 초록색 [로스트 리버 델타] 라벨 바로 아래에 그려진 거대한 갈색 마야 피라미드 신전이 [인디아나 존스]입니다.',
        detailTip:
          '유람선을 타면 파크 남쪽에서 북쪽 끝까지 한 번에 이동해 다리가 전혀 안 아픕니다! 아침에 뽑아둔 PP로 인디아나 존스를 탑승하고 스파이시 치킨레그(계란 무첨가)를 맛보세요.'
      },
      {
        stepNumber: 3,
        timeRange: '12:15 ~ 14:45',
        zoneId: 'fantasy-springs',
        zoneName: '⑤ 판타지 스프링스 (겨울왕국 · 라푼젤 · 피터팬)',
        title: '신규 테마포트! [겨울왕국 프로즌 저니] & [피터팬 / 라푼젤]',
        actionBadge: '❄️ 신규 구역 집중 탐험',
        howToMove: '로스트 리버 델타 오른쪽 옆 통로로 도보 3분 진입',
        visualDirectionTip:
          '공식 지도 우측 상단 남색 [판타지 스프링스] 구역입니다! 오른쪽 끝 하얀 눈 덮인 산이 겨울왕국, 가운데가 라푼젤 탑과 피터팬입니다.',
        detailTip:
          '오전에 발권한 DPA 시간에 맞춰 겨울왕국/피터팬을 탑승하고, 아래쪽 아라비안 코스트 캐시바 푸드코트에서 난&커리(현우 계란 안전)로 점심을 해결하세요.'
      },
      {
        stepNumber: 4,
        timeRange: '14:45 ~ 16:00',
        zoneId: 'mermaid-lagoon',
        zoneName: '⑦ 머메이드 라군 (분홍·민트색 거대 조개껍질 궁전)',
        title: '조개껍질 궁전 지하 [언더 더 씨] 실내 휴식 & 카페 타임',
        actionBadge: '☕ 엄마·이모 다리 휴식 타임',
        howToMove: '판타지 스프링스 → 아라비안 코스트 경유 도보 5분',
        visualDirectionTip:
          '공식 지도 중앙 분홍색 [머메이드 라군] 라벨 바로 아래에 그려진 알록달록한 소라·조개껍질 성 입구로 들어가면 실내 광장이 나옵니다.',
        detailTip:
          '오후 3시경 가장 피곤할 타이밍! 실내 에어컨이 나오는 트라이톤 왕국 지하 광장(칼립소 키친)에서 시원한 음료를 마시며 40분간 다리를 푹 쉬어줍니다.'
      },
      {
        stepNumber: 5,
        timeRange: '16:00 ~ 18:00',
        zoneId: 'american-waterfront',
        zoneName: '② 아메리칸 워터프런트 (S.S.콜럼비아호 · 토이스토리 · 타워오브테러)',
        title: '전철 타고 이동 → [토이스토리 매니아] 3D 대결 & [타워 오브 테러]',
        actionBadge: '🚃 고가 전철 이동 + 액티비티',
        howToMove: '포트 디스커버리 역에서 [일렉트릭 레일웨이] 빨간 고가 전철 탑승 (5분)',
        visualDirectionTip:
          '공식 지도 좌측 자주색 [아메리칸 워터프런트] 구역입니다! 큰 여객선(S.S. 콜럼비아호)과 보라빛 호텔(타워 오브 테러), 우디 얼굴 입구(토이스토리)가 모여 있습니다.',
        detailTip:
          '현우와 세현이가 가장 좋아하는 3D 슈팅 대결 [토이스토리 매니아]와 수직 낙하 [타워 오브 테러]를 즐기고, 석양빛 S.S. 콜럼비아호 앞에서 인증샷을 남기세요.'
      },
      {
        stepNumber: 6,
        timeRange: '18:00 ~ 19:00',
        zoneId: 'mysterious-island',
        zoneName: '⑧ 미스테리어스 아일랜드 (정중앙 프로메테우스 화산)',
        title: '화산 분화구 급발진 [센터 오브 디 어스] & 화산 만두(교자도그)',
        actionBadge: '🌋 야간 화산 스릴 하이라이트',
        howToMove: '하버 다리를 건너 파크 정중앙 화산 동굴 터널로 도보 6분',
        visualDirectionTip:
          '공식 지도 중앙 청록색 [미스테리어스 아일랜드] 라벨 위, 붉은 용암이 흐르는 거대한 갈색 바위 화산 안으로 들어가면 입구가 나옵니다.',
        detailTip:
          '해 질 녘에 센터 오브 디 어스를 타면 화산 꼭대기 밖으로 튕겨 나갈 때 반짝이는 디즈니씨 야경이 한눈에 보입니다!'
      },
      {
        stepNumber: 7,
        timeRange: '19:00 ~ 20:30',
        zoneId: 'mediterranean-harbor',
        zoneName: '① 메디테러니언 하버 (중앙 호수 & 정문 출구)',
        title: '야간 해상 쇼 [빌리브! 씨 오브 드림스] 관람 후 숙소 복귀',
        actionBadge: '🎆 피날레 해상 불꽃·레이저 쇼',
        howToMove: '화산 터널에서 남쪽 출구로 나오면 바로 메디테러니언 하버 호수 광장',
        visualDirectionTip:
          '화산 바로 아래쪽 넓은 파란 바다 호수(메디테러니언 하버) 둘레 난간 어디서든 쇼를 관람할 수 있으며, 끝나면 정문 지구본 쪽으로 퇴장합니다.',
        detailTip:
          '19:15 시작하는 초대형 야간 해상 쇼를 감상한 뒤, 인파가 한꺼번에 몰리기 직전 정문으로 퇴장해 긴시쵸 롯데시티호텔로 복귀합니다.'
      }
    ]
  },
  {
    id: 'boys-thrill',
    title: '코스 2. 현우·세현 강추! 스릴 & 3D 액션 집중 코스',
    subtitle: '중학생 남학생 만족도 200%! 롤러코스터·급강하·3D 슈팅 총집합',
    badge: '현우·세현 특화',
    shortLabel: '🎢 현우·세현 스릴 코스',
    targetWho: '스릴 넘치는 어트랙션과 슈팅 게임을 좋아하는 현우 & 세현 중심',
    totalWalkEstimate: '전철 1회 + 스팀보트 1회 연계 (액션 어트랙션 6대 제패)',
    routeSummary:
      '정문 → ① 아메리칸 워터프런트(토이스토리·타워오브테러) → 🚃 전철 → ② 포트 디스커버리(니모) → ③ 로스트 리버 델타(인디아나존스·레이징스피리츠) → ④ 판타지 스프링스(피터팬 3D·겨울왕국) → ⑤ 미스테리어스 아일랜드(화산 센터오브디어스) → ⑥ 메디테러니언 하버(소어린·야간쇼)',
    steps: [
      {
        stepNumber: 1,
        timeRange: '09:00 ~ 10:30',
        zoneId: 'american-waterfront',
        zoneName: '② 아메리칸 워터프런트 (우디 입구 & 타워 오브 테러)',
        title: '[토이스토리 매니아!] 점수 대결 & [타워 오브 테러] 수직 낙하',
        actionBadge: '🎯 형제 3D 슈팅 배틀 + 급강하',
        howToMove: '정문 입장 후 좌측 아메리칸 워터프런트 거리로 도보 6분',
        visualDirectionTip:
          '공식 지도 좌측 자주색 [아메리칸 워터프런트] 라벨 아래쪽이 타워 오브 테러와 토이스토리 매니아 구역입니다.',
        detailTip:
          '아침 에너지가 넘칠 때 현우 vs 세현 토이스토리 3D 슈팅 점수 내기를 먼저 하고, 바로 옆 59m 호텔 엘리베이터 급강하 [타워 오브 테러]를 연속 공략합니다.'
      },
      {
        stepNumber: 2,
        timeRange: '10:30 ~ 11:15',
        zoneId: 'port-discovery',
        zoneName: '③ 포트 디스커버리 (전철역 & 니모 시라이더)',
        title: '고가 전철 탑승 → [니모 & 프렌즈 시라이더] 잠수정 탑승',
        actionBadge: '🚃 고가 전철 + 4D 잠수정',
        howToMove: '아메리칸 워터프런트 역에서 [일렉트릭 레일웨이] 빨간 전철 탑승',
        visualDirectionTip:
          '공식 지도 좌측 상단 노란색 [포트 디스커버리] 라벨 오른쪽의 파란 둥근 지붕 건물이 [니모 시라이더]입니다.',
        detailTip:
          '2층 높이 철교를 달리는 빈티지 전철을 타고 미래 항구 풍경을 감상하며 도착한 뒤, 니모 잠수정 시뮬레이터를 탑승합니다.'
      },
      {
        stepNumber: 3,
        timeRange: '11:30 ~ 13:45',
        zoneId: 'lost-river-delta',
        zoneName: '④ 로스트 리버 델타 (마야 피라미드 & 360도 코스터)',
        title: '[인디아나 존스 마궁] + 360도 루프 [레이징 스피리츠] 연속 탑승!',
        actionBadge: '🔥 정글 2대 스릴 어트랙션 제패',
        howToMove: '포트 디스커버리에서 오른쪽 정글 다리 건너 도보 4분',
        visualDirectionTip:
          '공식 지도 상단 초록색 [로스트 리버 델타] 라벨 아래에 크게 그려진 갈색 마야 피라미드 신전과 롤러코스터입니다.',
        detailTip:
          '40주년 PP(무료 우선권)를 활용해 인디아나 존스 오프로드 지프차와 360도 회전 롤러코스터 레이징 스피리츠를 연달아 탑승하고 스파이시 치킨레그를 먹습니다.'
      },
      {
        stepNumber: 4,
        timeRange: '14:00 ~ 16:30',
        zoneId: 'fantasy-springs',
        zoneName: '⑤ 판타지 스프링스 (피터팬 네버랜드 & 겨울왕국)',
        title: '[피터팬의 네버랜드 어드벤처] 3D 비행 & [겨울왕국]',
        actionBadge: '🏴‍☠️ 최첨단 3D 비행 액션',
        howToMove: '레이징 스피리츠 바로 옆 판타지 스프링스 통로 진입',
        visualDirectionTip:
          '공식 지도 우측 상단 남색 [판타지 스프링스] 라벨 아래쪽 숲과 해적선 구역이 피터팬, 오른쪽 눈 덮인 산이 겨울왕국입니다.',
        detailTip:
          '몰입형 3D 비행 어트랙션인 [피터팬의 네버랜드 어드벤처]는 현우·세현이가 무조건 감탄하는 최신작입니다!'
      },
      {
        stepNumber: 5,
        timeRange: '16:45 ~ 18:30',
        zoneId: 'mysterious-island',
        zoneName: '⑧ 미스테리어스 아일랜드 (정중앙 프로메테우스 화산)',
        title: '시속 75km 화산 분화구 탈출! [센터 오브 디 어스]',
        actionBadge: '🌋 디즈니씨 최고 속도 스릴 1위',
        howToMove: '판타지 스프링스 → 머메이드 라군 옆을 지나 중앙 화산으로 도보 7분',
        visualDirectionTip:
          '공식 지도 정중앙에 붉은 용암이 흐르는 거대한 갈색 프로메테우스 화산 안쪽 동굴로 들어갑니다.',
        detailTip:
          '디즈니씨에서 가장 빠른 시속 75km로 화산 중턱 분화구를 뚫고 날아오르는 하이라이트! 탑승 후 볼케이니아 레스토랑에서 저녁 식사를 합니다.'
      },
      {
        stepNumber: 6,
        timeRange: '18:45 ~ 20:15',
        zoneId: 'mediterranean-harbor',
        zoneName: '① 메디테러니언 하버 (소어린 & 중앙 호수 야간 쇼)',
        title: '[소어린: 판타스틱 플라이트] 야간 비행 & 해상 쇼 관람',
        actionBadge: '✨ 감동의 피날레',
        howToMove: '화산 남쪽 출구에서 소어린 언덕으로 도보 4분',
        visualDirectionTip:
          '공식 지도 하단 갈색 [메디테러니언 하버] 라벨 위쪽 호수와 오른쪽 소어린 언덕입니다.',
        detailTip:
          '스릴 어트랙션을 모두 정복한 뒤 소어린 비행과 야간 해상 쇼로 완벽하게 하루를 마무리합니다.'
      }
    ]
  },
  {
    id: 'mom-stamina-save',
    title: '코스 3. 엄마 체력 세이브! 증기선 & 전철 200% 활용 코스',
    subtitle: '하루 2만 보 걷기는 NO! 배와 전철을 타고 우아하게 도는 힐링 동선',
    badge: '체력 보호 특화',
    shortLabel: '🚢 엄마 체력세이브 코스',
    targetWho: '오래 걷거나 서 있는 피로를 줄이고 싶은 엄마·이모 맞춤 코스',
    totalWalkEstimate: '스팀보트 2회 + 전철 1회 + 실내 좌석 휴식 2회 포함',
    routeSummary:
      '정문 → ① 메디테러니언 하버(소어린) → 🚢 증기선 → ② 판타지 스프링스(겨울왕국·라푼젤) → ③ 아라비안 코스트(커리·신드바드) & 머메이드 라군(실내 카페) → 🚃 전철 → ④ 아메리칸 워터프런트(S.S.콜럼비아호·토이스토리) → ⑤ 하버 야간 쇼',
    steps: [
      {
        stepNumber: 1,
        timeRange: '09:00 ~ 10:30',
        zoneId: 'mediterranean-harbor',
        zoneName: '① 메디테러니언 하버 (소어린 & 증기선 선착장)',
        title: '[소어린] 탑승 후 베네치아 운하 산책 & 유람선 선착장 이동',
        actionBadge: '🏛️ 감동 비행 + 여유로운 출발',
        howToMove: '정문 입장 후 우측 하버 산책로 도보 5분',
        visualDirectionTip:
          '공식 지도 하단 갈색 [메디테러니언 하버] 구역에서 소어린을 탄 뒤 하버 선착장에서 배를 탑니다.',
        detailTip:
          '격렬한 흔들림 없이 누구나 감동하는 [소어린]을 먼저 탑승한 뒤, 걸어서 북쪽으로 가지 않고 바로 하버 유람선 선착장으로 갑니다.'
      },
      {
        stepNumber: 2,
        timeRange: '10:30 ~ 13:30',
        zoneId: 'fantasy-springs',
        zoneName: '⑤ 판타지 스프링스 (겨울왕국 & 라푼젤 보트)',
        title: '증기선으로 편하게 북쪽 이동 → [겨울왕국] & [라푼젤 보트]',
        actionBadge: '🚢 스팀보트 수상 이동 (도보 생략)',
        howToMove: '하버에서 [트랜짓 스팀보트] 유람선 탑승 → 북쪽 선착장 하차 후 도보 4분',
        visualDirectionTip:
          '배에서 내려 오른쪽으로 조금만 걸으면 공식 지도 우측 상단 [판타지 스프링스] 구역으로 바로 들어갑니다.',
        detailTip:
          '파크 남북 구간을 배를 타고 앉아서 이동합니다! 판타지 스프링스에서는 보트를 타고 앉아서 감상하는 [겨울왕국]과 [라푼젤의 랜턴 페스티벌]을 즐깁니다.'
      },
      {
        stepNumber: 3,
        timeRange: '13:30 ~ 15:30',
        zoneId: 'arabian-coast',
        zoneName: '⑥ 아라비안 코스트 & ⑦ 머메이드 라군 (실내 휴식)',
        title: '캐시바 푸드코트 실내 점심 & [신드바드 10분 보트] + 조개궁전 카페',
        actionBadge: '🛋️ 실내 에어컨 좌석 휴식 + 힐링 보트',
        howToMove: '판타지 스프링스에서 아래쪽 아라비안 코스트로 도보 4분',
        visualDirectionTip:
          '공식 지도 우측 보라색 [아라비안 코스트]와 분홍색 [머메이드 라군]이 나란히 붙어 있습니다.',
        detailTip:
          '넓은 실내 좌석이 있는 캐시바 푸드코트에서 여유롭게 식사하고, 대기줄이 5분밖에 안 되는 10분짜리 실내 보트 [신드바드]와 머메이드 라군 실내 카페에서 충분히 다리를 쉽니다.'
      },
      {
        stepNumber: 4,
        timeRange: '15:45 ~ 17:45',
        zoneId: 'american-waterfront',
        zoneName: '② 아메리칸 워터프런트 (고가 전철 · S.S.콜럼비아호 · 토이스토리)',
        title: '빨간 고가 전철 탑승 → [토이스토리 매니아] & S.S. 콜럼비아호 갑판',
        actionBadge: '🚃 일렉트릭 레일웨이 전철 이동',
        howToMove: '포트 디스커버리 역에서 [일렉트릭 레일웨이] 전철 탑승 → 아메리칸 워터프런트 하차',
        visualDirectionTip:
          '노란색 [포트 디스커버리] 역에서 전철을 타면 좌측 자주색 [아메리칸 워터프런트] 여객선 앞에 내려줍니다.',
        detailTip:
          '전철을 이용해 다리 힘을 아끼고, 현우·세현이가 타워 오브 테러를 타는 동안 엄마·이모는 S.S. 콜럼비아호 갑판이나 뉴욕 델리 테라스에서 커피 타임을 가질 수 있습니다.'
      },
      {
        stepNumber: 5,
        timeRange: '18:00 ~ 20:15',
        zoneId: 'mediterranean-harbor',
        zoneName: '① 메디테러니언 하버 (중앙 호수 테라스 & 정문 퇴장)',
        title: '하버 레스토랑 저녁 식사 & [빌리브! 씨 오브 드림스] 야간 쇼',
        actionBadge: '🎆 저녁 식사 + 야간 해상 쇼',
        howToMove: '아메리칸 워터프런트에서 하버 광장으로 도보 3분',
        visualDirectionTip:
          '공식 지도 하단 갈색 [메디테러니언 하버] 호수 광장에서 쇼를 보고 바로 아래 정문으로 퇴장합니다.',
        detailTip:
          '정문 근처 하버 테라스에서 일찍 자리를 잡고 앉아 다리를 쉬면서 19:15 야간 해상 쇼를 감상한 뒤 가장 먼저 쾌적하게 퇴장합니다!'
      }
    ]
  }
];

interface DisneySeaMapGuideProps {
  isDark?: boolean;
}

export const DisneySeaMapGuide: React.FC<DisneySeaMapGuideProps> = ({ isDark = false }) => {
  const [selectedCourseId, setSelectedCourseId] =
    useState<DisneyRouteCourseId>('standard-openrun');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('mediterranean-harbor');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [mapMode, setMapMode] = useState<'official-map' | 'building-gallery' | 'google-satellite'>(
    'official-map'
  );
  const [showRouteOverlay, setShowRouteOverlay] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false);
  const [fullscreenMapOnly, setFullscreenMapOnly] = useState<boolean>(true);

  useEffect(() => {
    if (!isFullscreenModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenModalOpen]);

  const currentCourse =
    DISNEYSEA_ROUTE_COURSES.find((c) => c.id === selectedCourseId) ||
    DISNEYSEA_ROUTE_COURSES[0];

  const selectedZone =
    DISNEYSEA_ZONES.find((z) => z.id === selectedZoneId) || DISNEYSEA_ZONES[0];

  const handleSelectCourse = (courseId: DisneyRouteCourseId) => {
    setSelectedCourseId(courseId);
    setActiveStepIndex(0);
    const course = DISNEYSEA_ROUTE_COURSES.find((c) => c.id === courseId);
    if (course && course.steps.length > 0) {
      setSelectedZoneId(course.steps[0].zoneId);
    }
  };

  const handleSelectStep = (stepIndex: number, zoneId: string) => {
    setActiveStepIndex(stepIndex);
    setSelectedZoneId(zoneId);
  };

  // Build SVG polyline coordinates starting from Main Entrance -> Step 1 -> Step 2 -> ...
  const routeWaypoints = [
    { x: MAIN_ENTRANCE_COORD.x, y: MAIN_ENTRANCE_COORD.y, label: '정문 출발', isEntrance: true },
    ...currentCourse.steps
      .map((step) => {
        const z = DISNEYSEA_ZONES.find((zone) => zone.id === step.zoneId);
        return z
          ? {
              x: z.x,
              y: z.y,
              label: `${step.stepNumber}`,
              stepNumber: step.stepNumber,
              isEntrance: false
            }
          : null;
      })
      .filter(
        (
          p
        ): p is {
          x: number;
          y: number;
          label: string;
          stepNumber: number;
          isEntrance: boolean;
        } => p !== null
      )
  ];

  const renderMapAndGuideContent = (isLargeModal: boolean) => (
    <div className="@container space-y-4 break-keep">
      {/* 1. Top Control Header: Official Map View Switcher + Recommended Route Selector */}
      <div className="rounded-2xl p-3.5 sm:p-4 border bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-amber-400/40 text-white shadow-lg">
        <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
          <div className="w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider whitespace-nowrap shrink-0">
                OFFICIAL TOKYO DISNEYSEA MAP
              </span>
              <span className="text-xs font-bold text-sky-300 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>도쿄 디즈니 제공 공식 한국어 가이드맵 + 추천 이동경로</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1.5 leading-snug break-keep">
              🏰 도쿄 디즈니씨 공식 가이드맵 & 추천 이동경로 내비게이터
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed break-keep">
              도쿄 디즈니 리조트 공식 한국어 가이드맵(판타지 스프링스 포함 8대 테마포트) 위에 가족 맞춤형 추천 이동경로와 건물 사진을 결합했습니다!
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <button
              type="button"
              onClick={() => setMapMode('official-map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                mapMode === 'official-map'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 shrink-0" />
              <span>공식 가이드맵 + 동선</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('building-gallery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                mapMode === 'building-gallery'
                  ? 'bg-pink-400 text-slate-950 shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Camera className="w-3.5 h-3.5 shrink-0" />
              <span>실제 건물 사진 도감</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('google-satellite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                mapMode === 'google-satellite'
                  ? 'bg-sky-400 text-slate-950 shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <span>🛰️ 실제 위성 지도</span>
            </button>
            {!isLargeModal && (
              <button
                type="button"
                onClick={() => {
                  setFullscreenMapOnly(true);
                  setIsFullscreenModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-md flex items-center gap-1.5 cursor-pointer ring-2 ring-amber-300/60 whitespace-nowrap ml-auto"
                title="좌우분할 화면에서도 화면 전체로 꽉 차게 보기"
              >
                <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                <span>전체화면 보기</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Recommended Route Selector Tabs */}
        <div className="mt-3">
          <div className="text-[11px] font-bold text-amber-300 mb-2 flex items-center justify-between gap-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5" />
              <span>추천 이동경로 코스 선택 (클릭 시 공식 가이드맵 위에 이동 순서 화살표가 표시됩니다)</span>
            </span>
            {mapMode === 'official-map' && (
              <button
                type="button"
                onClick={() => setShowRouteOverlay((prev) => !prev)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black border cursor-pointer flex items-center gap-1 ${
                  showRouteOverlay
                    ? 'bg-amber-400/20 text-amber-200 border-amber-400/60'
                    : 'bg-white/10 text-slate-300 border-white/20'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>
                  {showRouteOverlay
                    ? '동선 화살표·핀: 표시 중 (클릭 시 순수 원본맵)'
                    : '순수 공식 가이드맵 원본 보기 중 (클릭 시 동선 표시)'}
                </span>
              </button>
            )}
          </div>
          <div
            className={`grid gap-2 ${
              isLargeModal ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 @2xl:grid-cols-3'
            }`}
          >
            {DISNEYSEA_ROUTE_COURSES.map((course) => {
              const isSelected = course.id === selectedCourseId;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => handleSelectCourse(course.id)}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400/25 to-sky-400/20 border-amber-400 shadow-md ring-1 ring-amber-400/60'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-white/10 text-amber-300'
                        }`}
                      >
                        {course.shortLabel}
                      </span>
                      <span className="text-[10px] font-mono text-sky-300 font-bold">
                        {course.steps.length}단계 루트
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1 mt-1">
                      {course.title}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1 line-clamp-1">
                    {course.totalWalkEstimate}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Visual View: (A) Official Tokyo DisneySea Guide Map + Route Overlay */}
      {mapMode === 'official-map' ? (
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-500/60 bg-white shadow-2xl">
          {/* Top Bar inside Map */}
          <div className="px-3.5 py-2 bg-gradient-to-r from-[#0c2d57] via-[#134074] to-[#0c2d57] border-b border-amber-400/50 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[11px]">
                공식 가이드맵
              </span>
              <span className="font-black text-amber-200">
                🗺️ 도쿄 디즈니씨 공식 한국어 전체 지도 ({currentCourse.shortLabel} 오버레이)
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-950/70 px-2 py-1 rounded-lg border border-white/15 text-[11px]">
              <button
                type="button"
                onClick={() => setZoomScale(1)}
                className={`px-1.5 py-0.5 rounded font-bold cursor-pointer ${
                  zoomScale === 1
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                100% 전체
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(1.4)}
                className={`px-1.5 py-0.5 rounded font-bold cursor-pointer flex items-center gap-0.5 ${
                  zoomScale === 1.4
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <ZoomIn className="w-3 h-3" /> 140% 확대
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(1.85)}
                className={`px-1.5 py-0.5 rounded font-bold cursor-pointer flex items-center gap-0.5 ${
                  zoomScale === 1.85
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <ZoomIn className="w-3 h-3" /> 185% 초근접
              </button>
              {zoomScale > 1 && (
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="px-1.5 py-0.5 rounded text-rose-300 hover:bg-white/10 font-bold cursor-pointer flex items-center gap-0.5"
                >
                  <ZoomOut className="w-3 h-3" /> 초기화
                </button>
              )}
              {!isLargeModal && (
                <button
                  type="button"
                  onClick={() => {
                    setFullscreenMapOnly(true);
                    setIsFullscreenModalOpen(true);
                  }}
                  className="ml-1 px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>전체화면</span>
                </button>
              )}
            </div>
          </div>

          {/* Legend Strip */}
          <div className="px-3.5 py-1.5 bg-amber-50 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-800 font-bold">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-rose-700 font-black">
                <span className="w-4 h-1 bg-rose-600 inline-block rounded" /> 추천 이동경로 순서 (정문 출발 → ①~⑦)
              </span>
              <span className="flex items-center gap-1 text-sky-800">
                <span className="w-4 h-1 bg-sky-500 inline-block rounded" /> 🚢 스팀보트 유람선 수로
              </span>
              <span className="flex items-center gap-1 text-purple-800">
                <span className="w-4 h-1 bg-purple-600 inline-block rounded" /> 🚃 일렉트릭 레일웨이 전철
              </span>
            </div>
            <span className="text-indigo-900 font-extrabold">
              💡 지도 위 구역 핀을 클릭하면 해당 구역 실제 건물 사진과 대표 어트랙션·간식이 표시됩니다!
            </span>
          </div>

          {/* Official Tokyo DisneySea Korean Map Image + Exact 16:9 SVG & HTML Overlay */}
          <div className="w-full overflow-auto bg-white select-none">
            <div
              style={{
                width: `${zoomScale * 100}%`,
                minWidth: zoomScale > 1 ? `${zoomScale * 760}px` : '620px'
              }}
              className="relative aspect-[16/9] w-full mx-auto transition-all duration-200"
            >
              {/* Official Tokyo DisneySea Korean Guide Map Image (800 x 450) */}
              <img
                src="/images/disneysea/2024_tds_kr.jpg"
                alt="도쿄 디즈니씨 공식 한국어 가이드맵"
                className="w-full h-full object-contain block pointer-events-none"
              />

              {/* SVG Route & Transit Lines Overlay (Exact 800 x 450 Coordinate Space) */}
              {showRouteOverlay && (
                <svg
                  viewBox="0 0 800 450"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <filter id="officialRouteShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="2.5"
                        floodColor="#0f172a"
                        floodOpacity="0.65"
                      />
                    </filter>
                    <marker
                      id="routeArrowActive"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5.5"
                      markerHeight="5.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                    </marker>
                    <marker
                      id="routeArrowNormal"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
                    </marker>
                  </defs>

                  {/* 1. Internal Transit Line A: DisneySea Transit Steamboat Waterway */}
                  <path
                    d="M 265 275 Q 218 190 385 112"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <path
                    d="M 265 275 Q 218 190 385 112"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                  />

                  {/* 2. Internal Transit Line B: DisneySea Electric Railway */}
                  <path
                    d="M 145 202 Q 190 148 250 118"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <path
                    d="M 145 202 Q 190 148 250 118"
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />

                  {/* 3. Recommended Route Segments (Main Entrance -> Step 1 -> Step 2 -> ...) */}
                  {routeWaypoints.map((pt, idx) => {
                    if (idx === 0) return null;
                    const prev = routeWaypoints[idx - 1];
                    // Segment idx connects prev (step idx-1, or entrance if idx===1) to pt (step idx)
                    const isHighlightedSegment =
                      activeStepIndex === idx - 1 || activeStepIndex === idx;

                    // Slight curve offset so back-and-forth segments don't overlap
                    const dx = pt.x - prev.x;
                    const dy = pt.y - prev.y;
                    const midX = (prev.x + pt.x) / 2 - dy * 0.12;
                    const midY = (prev.y + pt.y) / 2 + dx * 0.08 - 10;

                    return (
                      <g key={`official-seg-${idx}`} filter="url(#officialRouteShadow)">
                        {/* White Halo Path */}
                        <path
                          d={`M ${prev.x} ${prev.y} Q ${midX} ${midY} ${pt.x} ${pt.y}`}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth={isHighlightedSegment ? 8 : 6}
                          strokeLinecap="round"
                          opacity={isHighlightedSegment ? 0.98 : 0.82}
                        />
                        {/* Colored Dashed Route Line with Directional Arrowhead */}
                        <path
                          d={`M ${prev.x} ${prev.y} Q ${midX} ${midY} ${pt.x} ${pt.y}`}
                          fill="none"
                          stroke={isHighlightedSegment ? '#e11d48' : '#f97316'}
                          strokeWidth={isHighlightedSegment ? 4.5 : 3.2}
                          strokeDasharray="8 5"
                          strokeLinecap="round"
                          markerEnd={
                            isHighlightedSegment
                              ? 'url(#routeArrowActive)'
                              : 'url(#routeArrowNormal)'
                          }
                        />
                      </g>
                    );
                  })}

                  {/* Main Entrance Starting Point Marker on Official Map */}
                  <g transform={`translate(${MAIN_ENTRANCE_COORD.x}, ${MAIN_ENTRANCE_COORD.y})`} filter="url(#officialRouteShadow)">
                    <circle cx="0" cy="0" r="9" fill="#e11d48" stroke="#ffffff" strokeWidth="2.5" />
                    <rect
                      x="-58"
                      y="12"
                      width="116"
                      height="20"
                      rx="10"
                      fill="#0f172a"
                      stroke="#facc15"
                      strokeWidth="1.8"
                    />
                    <text
                      x="0"
                      y="25"
                      textAnchor="middle"
                      fill="#fde047"
                      fontSize="9.5"
                      fontWeight="900"
                    >
                      🚩 정문 출발 (지구본)
                    </text>
                  </g>
                </svg>
              )}

              {/* Interactive Zone & Route Step Pins Positioned on Official Map */}
              {showRouteOverlay &&
                DISNEYSEA_ZONES.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const courseStepsHere = currentCourse.steps.filter(
                    (s) => s.zoneId === zone.id
                  );
                  const isCurrentStepZone =
                    currentCourse.steps[activeStepIndex]?.zoneId === zone.id;

                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        const firstStepIdx = currentCourse.steps.findIndex(
                          (s) => s.zoneId === zone.id
                        );
                        if (firstStepIdx >= 0) {
                          setActiveStepIndex(firstStepIdx);
                        }
                      }}
                      style={{
                        left: `${(zone.x / 800) * 100}%`,
                        top: `${(zone.y / 450) * 100}%`
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer transition-all duration-200 ${
                        isSelected || isCurrentStepZone
                          ? 'scale-110 z-20'
                          : 'hover:scale-105'
                      }`}
                    >
                      {/* Numbered Step Badges for Current Route */}
                      {courseStepsHere.length > 0 && (
                        <div className="flex items-center justify-center gap-0.5 mb-0.5">
                          {courseStepsHere.map((st) => {
                            const isCurrentStep =
                              currentCourse.steps[activeStepIndex]?.stepNumber ===
                              st.stepNumber;
                            return (
                              <span
                                key={st.stepNumber}
                                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black shadow-md border-2 ${
                                  isCurrentStep
                                    ? 'bg-rose-600 text-white border-amber-300 animate-bounce ring-2 ring-rose-400'
                                    : 'bg-amber-400 text-slate-950 border-slate-900'
                                }`}
                              >
                                동선 #{st.stepNumber}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Compact Pin Badge that complements the official Korean map labels */}
                      <div
                        className={`px-2 py-0.5 rounded-full border-2 shadow-lg flex items-center gap-1 whitespace-nowrap ${
                          isSelected
                            ? 'bg-slate-950 text-amber-300 border-amber-400 ring-2 ring-amber-400/70'
                            : 'bg-white/95 text-slate-900 border-slate-800 hover:border-rose-500'
                        }`}
                      >
                        <span className="text-xs">{zone.iconEmoji}</span>
                        <span className="text-[10px] font-black">
                          {zone.shortPinTitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Floating Quick Fullscreen Button inside Map Bottom-Right (when not in modal) */}
          {!isLargeModal && (
            <div className="px-3.5 py-2 bg-slate-950/95 border-t border-amber-400/30 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-slate-300 font-medium">
                💡 좌우분할 화면에서 지도가 작게 보일 때는 우측 <strong className="text-amber-300">[전체화면으로 지도 크게보기]</strong>를 눌러보세요!
              </span>
              <button
                type="button"
                onClick={() => {
                  setFullscreenMapOnly(true);
                  setIsFullscreenModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>🖥️ 전체화면으로 지도 크게보기</span>
              </button>
            </div>
          )}

          {/* Current Course Summary Bar under Official Map */}
          <div className="px-3.5 py-2.5 bg-slate-900 text-white border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[11px]">
                현재 표시 동선
              </span>
              <span className="font-bold text-amber-300">{currentCourse.routeSummary}</span>
            </div>
          </div>
        </div>
      ) : mapMode === 'building-gallery' ? (
        /* Mode B: 8 Ports Real Building Photo Visual Guide */
        <div className="rounded-2xl border-2 border-pink-400/50 bg-slate-950 p-4 text-white shadow-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div>
              <h4 className="text-sm sm:text-base font-black text-pink-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>📸 처음 가도 1초 만에 알아보는! 디즈니씨 8대 구역 실제 건물 & 놀이기구 외관 도감</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                공식 가이드맵에 그려진 8개 테마포트의 실제 건물 모습입니다. 카드를 누르면 아래에 상세 정보가 표시됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMapMode('official-map')}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
            >
              🗺️ 공식 가이드맵으로 돌아가기
            </button>
          </div>

          <div
            className={`grid gap-3 ${
              isLargeModal
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-4'
            }`}
          >
            {DISNEYSEA_ZONES.map((z) => {
              const isSelected = z.id === selectedZoneId;
              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/50 bg-slate-900'
                      : 'border-white/15 bg-slate-900/70 hover:border-amber-300/60'
                  }`}
                >
                  <div>
                    <div className="relative h-36 w-full bg-slate-800 overflow-hidden">
                      <img
                        src={z.realPhotoUrl}
                        alt={z.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/85 border border-amber-400/60 text-amber-300 text-[10px] font-black">
                        구역 #{z.portNumber}
                      </span>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-xs font-black text-white drop-shadow">
                          {z.iconEmoji} {z.name}
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <div className="text-[11px] font-bold text-amber-300">
                        👀 실제 건물 생김새:
                      </div>
                      <p className="text-[11px] text-slate-200 leading-snug">
                        {z.buildingLookSummary}
                      </p>
                    </div>
                  </div>
                  <div className="px-2.5 pb-2.5 pt-1">
                    <span className="inline-block w-full text-center py-1 rounded-lg bg-white/10 text-[11px] font-bold text-sky-300">
                      {isSelected ? '✓ 현재 아래에 상세 정보 표시 중' : '터치하여 상세 보기'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Mode C: Real Google Satellite Park View */
        <div className="rounded-2xl overflow-hidden border-2 border-sky-400/40 bg-slate-950 shadow-2xl">
          <div className="px-3.5 py-2 bg-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
            <span className="font-bold text-sky-300">
              🛰️ 실제 구글 위성 지도 — {selectedZone.name} ({selectedZone.japaneseName})
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `Tokyo DisneySea ${selectedZone.englishName}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>구글맵 앱에서 열기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="w-full h-[360px] sm:h-[440px] bg-slate-900">
            <iframe
              title={`Tokyo DisneySea - ${selectedZone.name}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${selectedZone.lat},${selectedZone.lng}&t=k&z=18&output=embed`}
            />
          </div>
          {/* Quick Zone Switcher Bar under Google Map */}
          <div className="p-2.5 bg-slate-900 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {DISNEYSEA_ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelectedZoneId(z.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer border ${
                  selectedZoneId === z.id
                    ? 'bg-sky-400 text-slate-950 border-sky-300 font-black'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {z.iconEmoji} {z.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Selected Zone Visual Building Recognition Card + Attractions + Snacks */}
      <div className="rounded-2xl border-2 border-amber-400/50 bg-slate-900/95 text-white p-4 shadow-xl space-y-3.5">
        <div
          className={`grid gap-3.5 items-stretch bg-black/35 p-3 rounded-xl border border-white/10 ${
            isLargeModal ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1 @2xl:grid-cols-12'
          }`}
        >
          {/* Real Building Photo Preview */}
          <div className={`${isLargeModal ? 'md:col-span-5' : '@2xl:col-span-5'} flex flex-col gap-2`}>
            <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden border border-amber-400/40 bg-slate-800">
              <img
                src={selectedZone.realPhotoUrl}
                alt={selectedZone.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-amber-400/60 text-[11px] font-black text-amber-300">
                📸 실제 디즈니씨 건물 모습
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent p-2.5">
                <div className="text-xs font-black text-white">
                  {selectedZone.iconEmoji} {selectedZone.name}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  {selectedZone.japaneseName} · {selectedZone.englishName}
                </div>
              </div>
            </div>

            {selectedZone.secondaryPhotoUrl && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden border border-white/15 bg-slate-800">
                <img
                  src={selectedZone.secondaryPhotoUrl}
                  alt={selectedZone.secondaryPhotoLabel || selectedZone.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-slate-950/85 text-[10px] font-bold text-sky-200">
                  📸 {selectedZone.secondaryPhotoLabel || '주요 어트랙션 외관'}
                </div>
              </div>
            )}
          </div>

          {/* Visual Landmark Clues for First-Timers */}
          <div className={`${isLargeModal ? 'md:col-span-7' : '@2xl:col-span-7'} flex flex-col justify-between space-y-2.5`}>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                  구역 #{selectedZone.portNumber} · 공식 가이드맵 위치 & 건물 특징
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedZone.lat},${selectedZone.lng}&travelmode=walking`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>이 건물로 도보 길찾기</span>
                </a>
              </div>

              <h4 className="text-base sm:text-lg font-black text-amber-300">
                {selectedZone.iconEmoji} {selectedZone.name}
              </h4>

              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 space-y-1">
                <div className="text-xs font-black text-amber-300">
                  🏢 공식 지도 속 건물 모양 & 실제 외관 특징
                </div>
                <p className="text-xs text-white leading-relaxed font-semibold">
                  {selectedZone.buildingLookSummary}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/30 space-y-1">
                <div className="text-xs font-black text-sky-300">
                  🧭 현장에서 길 안 헤매는 초행길 포인트
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedZone.firstTimerLandmarkTip}
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs text-emerald-200 font-semibold">
              🚢 <strong>체력 아끼는 이동 팁:</strong> {selectedZone.transitInsideTip}
            </div>
          </div>
        </div>

        {/* Quick 8-Zone Pill Bar for Instant Switching */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {DISNEYSEA_ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setSelectedZoneId(z.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border transition-all ${
                selectedZoneId === z.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {z.iconEmoji} {z.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Attractions & Snacks Grid */}
        <div
          className={`grid gap-3 ${
            isLargeModal ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 @2xl:grid-cols-2'
          }`}
        >
          {/* Key Attractions in this Zone */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-3 space-y-2">
            <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5" />
              <span>이 구역 대표 놀이기구 · 건물 생김새 & 패스 전략</span>
            </div>
            <div className="space-y-2">
              {selectedZone.keyAttractions.map((attr, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-xs font-black text-white">{attr.name}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        attr.passType.includes('DPA')
                          ? 'bg-amber-400 text-slate-950'
                          : attr.passType.includes('PP')
                          ? 'bg-emerald-400 text-slate-950'
                          : attr.passType.includes('쇼')
                          ? 'bg-fuchsia-500 text-white'
                          : 'bg-sky-400/20 text-sky-200 border border-sky-400/40'
                      }`}
                    >
                      {attr.passType}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-200 font-semibold">
                    {attr.thrillLevel}
                  </div>
                  <div className="text-[11px] text-sky-300 bg-sky-950/60 border border-sky-400/30 rounded px-2 py-1 font-medium">
                    🏛️ <strong>건물 외관:</strong> {attr.buildingLook}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{attr.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Must-Eat Snacks & Restaurants in this Zone */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-3 space-y-2">
            <div className="text-xs font-black text-rose-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>이 구역 대표 먹거리 · 간식 & 현우 계란 체크</span>
            </div>
            <div className="space-y-2">
              {selectedZone.mustEatSnacks.map((snack, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-amber-200">
                      🍴 {snack.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300 shrink-0">
                      {snack.price}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    📍 판매처: <strong>{snack.shop}</strong>
                  </div>
                  {snack.eggSafeNote && (
                    <div className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-400/40 rounded px-2 py-1 mt-1">
                      👦 {snack.eggSafeNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Step-by-Step Recommended Route Timeline Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{currentCourse.title} — 공식 가이드맵 기준 시간대별 이동 순서</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            단계를 클릭하면 공식 가이드맵 위에서 해당 구역 동선이 강조됩니다
          </span>
        </div>

        <div
          className={`grid gap-2.5 ${
            isLargeModal ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 @2xl:grid-cols-2'
          }`}
        >
          {currentCourse.steps.map((step, idx) => {
            const isStepActive = activeStepIndex === idx;
            return (
              <div
                key={step.stepNumber}
                onClick={() => handleSelectStep(idx, step.zoneId)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isStepActive
                    ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border-amber-400 ring-2 ring-amber-400/30 text-white shadow-lg'
                    : isDark
                    ? 'bg-slate-900/75 hover:bg-slate-900 border-white/15 text-slate-200'
                    : 'bg-white hover:bg-amber-50/40 border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                        isStepActive
                          ? 'bg-rose-600 text-white border border-amber-300'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isStepActive
                          ? 'text-amber-300'
                          : isDark
                          ? 'text-sky-300'
                          : 'text-indigo-600'
                      }`}
                    >
                      {step.timeRange}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isStepActive
                        ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                        : isDark
                        ? 'bg-white/10 text-slate-300'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {step.actionBadge}
                  </span>
                </div>

                <div
                  className={`text-xs sm:text-sm font-black mb-1 ${
                    isStepActive ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {step.title}
                </div>

                <div
                  className={`text-[11px] font-bold mb-1.5 flex items-center gap-1 ${
                    isStepActive
                      ? 'text-sky-300'
                      : isDark
                      ? 'text-amber-300'
                      : 'text-amber-700'
                  }`}
                >
                  {step.howToMove.includes('스팀보트') ? (
                    <Ship className="w-3.5 h-3.5 shrink-0" />
                  ) : step.howToMove.includes('전철') ||
                    step.howToMove.includes('레일웨이') ? (
                    <Train className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Footprints className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{step.howToMove}</span>
                </div>

                <div
                  className={`text-[11px] rounded-lg px-2.5 py-1.5 mb-1.5 font-semibold ${
                    isStepActive
                      ? 'bg-amber-400/15 text-amber-200 border border-amber-400/30'
                      : isDark
                      ? 'bg-white/5 text-amber-200/90'
                      : 'bg-amber-50 text-amber-950 border border-amber-200/70'
                  }`}
                >
                  🗺️ <strong>공식 지도 위치:</strong> {step.visualDirectionTip}
                </div>

                <p
                  className={`text-[11px] leading-relaxed ${
                    isStepActive
                      ? 'text-slate-200'
                      : isDark
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {step.detailTip}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="mt-4 pt-4 border-t border-amber-400/30"
    >
      {renderMapAndGuideContent(false)}

      {/* True 100vw x 100vh Fullscreen Portal (Breaks out of Split-Screen / Card transforms) */}
      {isFullscreenModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={() => setIsFullscreenModalOpen(false)}
            className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-950/95 backdrop-blur-md flex flex-col overflow-hidden"
          >
            {/* Fullscreen Top Control Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="px-3 sm:px-6 py-2.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-amber-400/40 flex flex-wrap items-center justify-between gap-2 shrink-0 text-white"
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                  전체화면 모드
                </span>
                <h2 className="text-sm sm:text-lg font-black text-white">
                  🏰 도쿄 디즈니씨 공식 한국어 가이드맵 & 추천 이동경로
                </h2>
              </div>

              {/* Fullscreen Mode Switcher & Course Quick Tabs & Close Button */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Switch between 100% Map-Only Fullscreen vs Full Guide Scroll */}
                <div className="flex items-center bg-white/10 p-0.5 rounded-xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => setFullscreenMapOnly(true)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                      fullscreenMapOnly
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    🗺️ 지도 꽉 차게 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => setFullscreenMapOnly(false)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                      !fullscreenMapOnly
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    📋 지도 + 상세가이드 함께 보기
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>전체화면 닫기 (ESC)</span>
                </button>
              </div>
            </div>

            {/* Fullscreen Body */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex-1 w-full overflow-y-auto"
            >
              {fullscreenMapOnly ? (
                /* 100% Viewport Map-Focused Fullscreen Layout */
                <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden">
                  {/* Left/Main Area: Giant Official Map Canvas with Zoom & Route Overlay */}
                  <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
                    {/* Sub-Toolbar for Courses, Overlay Toggle & Zoom */}
                    <div className="px-4 py-2 bg-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white shrink-0">
                      {/* 3 Course Quick Switch Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-amber-300 font-black mr-1">추천 동선:</span>
                        {DISNEYSEA_ROUTE_COURSES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectCourse(c.id)}
                            className={`px-2.5 py-1 rounded-lg font-black text-xs cursor-pointer border transition-all ${
                              selectedCourseId === c.id
                                ? 'bg-amber-400 text-slate-950 border-white shadow-sm'
                                : 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/20'
                            }`}
                          >
                            {c.shortLabel}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setShowRouteOverlay((prev) => !prev)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer border ${
                            showRouteOverlay
                              ? 'bg-rose-500/20 text-rose-200 border-rose-400/50'
                              : 'bg-white/10 text-slate-300 border-white/20'
                          }`}
                        >
                          {showRouteOverlay ? '👁️ 동선 화살표 켜짐' : '👁️ 순수 원본 지도만 보기'}
                        </button>
                      </div>

                      {/* Zoom Controls in Fullscreen */}
                      <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-white/15">
                        <span className="text-[11px] text-slate-400 mr-1">배율:</span>
                        {[1, 1.35, 1.75, 2.2].map((scale) => (
                          <button
                            key={scale}
                            type="button"
                            onClick={() => setZoomScale(scale)}
                            className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                              zoomScale === scale
                                ? 'bg-amber-400 text-slate-950'
                                : 'text-slate-200 hover:bg-white/10'
                            }`}
                          >
                            {Math.round(scale * 100)}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Giant Scrollable Map Viewport */}
                    <div className="flex-1 w-full overflow-auto bg-[#e5f3fd] flex items-center justify-center p-2 sm:p-4">
                      <div
                        style={{
                          width: `${zoomScale * 100}%`,
                          maxWidth: zoomScale === 1 ? '1380px' : 'none',
                          minWidth: zoomScale > 1 ? `${zoomScale * 950}px` : '680px'
                        }}
                        className="relative aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-400/60"
                      >
                        <img
                          src="/images/disneysea/2024_tds_kr.jpg"
                          alt="도쿄 디즈니씨 공식 한국어 가이드맵 전체화면"
                          className="w-full h-full object-contain block pointer-events-none"
                        />

                        {showRouteOverlay && (
                          <svg
                            viewBox="0 0 800 450"
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            <defs>
                              <filter
                                id="fsOfficialRouteShadow"
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                              >
                                <feDropShadow
                                  dx="0"
                                  dy="2"
                                  stdDeviation="2.5"
                                  floodColor="#0f172a"
                                  floodOpacity="0.65"
                                />
                              </filter>
                              <marker
                                id="fsRouteArrowActive"
                                viewBox="0 0 10 10"
                                refX="6"
                                refY="5"
                                markerWidth="5.5"
                                markerHeight="5.5"
                                orient="auto-start-reverse"
                              >
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                              </marker>
                              <marker
                                id="fsRouteArrowNormal"
                                viewBox="0 0 10 10"
                                refX="6"
                                refY="5"
                                markerWidth="5"
                                markerHeight="5"
                                orient="auto-start-reverse"
                              >
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
                              </marker>
                            </defs>

                            {/* Steamboat Waterway */}
                            <path
                              d="M 265 275 Q 218 190 385 112"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="5.5"
                              strokeLinecap="round"
                              opacity="0.85"
                            />
                            <path
                              d="M 265 275 Q 218 190 385 112"
                              fill="none"
                              stroke="#0284c7"
                              strokeWidth="3.5"
                              strokeDasharray="6 5"
                              strokeLinecap="round"
                            />

                            {/* Electric Railway */}
                            <path
                              d="M 145 202 Q 190 148 250 118"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="5.5"
                              strokeLinecap="round"
                              opacity="0.85"
                            />
                            <path
                              d="M 145 202 Q 190 148 250 118"
                              fill="none"
                              stroke="#9333ea"
                              strokeWidth="3.5"
                              strokeDasharray="6 4"
                              strokeLinecap="round"
                            />

                            {/* Route Segments */}
                            {routeWaypoints.map((pt, idx) => {
                              if (idx === 0) return null;
                              const prev = routeWaypoints[idx - 1];
                              const isHighlightedSegment =
                                activeStepIndex === idx - 1 || activeStepIndex === idx;
                              const dx = pt.x - prev.x;
                              const dy = pt.y - prev.y;
                              const midX = (prev.x + pt.x) / 2 - dy * 0.12;
                              const midY = (prev.y + pt.y) / 2 + dx * 0.08 - 10;

                              return (
                                <g
                                  key={`fs-seg-${idx}`}
                                  filter="url(#fsOfficialRouteShadow)"
                                >
                                  <path
                                    d={`M ${prev.x} ${prev.y} Q ${midX} ${midY} ${pt.x} ${pt.y}`}
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth={isHighlightedSegment ? 8 : 6}
                                    strokeLinecap="round"
                                    opacity={isHighlightedSegment ? 0.98 : 0.82}
                                  />
                                  <path
                                    d={`M ${prev.x} ${prev.y} Q ${midX} ${midY} ${pt.x} ${pt.y}`}
                                    fill="none"
                                    stroke={isHighlightedSegment ? '#e11d48' : '#f97316'}
                                    strokeWidth={isHighlightedSegment ? 4.5 : 3.2}
                                    strokeDasharray="8 5"
                                    strokeLinecap="round"
                                    markerEnd={
                                      isHighlightedSegment
                                        ? 'url(#fsRouteArrowActive)'
                                        : 'url(#fsRouteArrowNormal)'
                                    }
                                  />
                                </g>
                              );
                            })}

                            {/* Main Entrance Marker */}
                            <g
                              transform={`translate(${MAIN_ENTRANCE_COORD.x}, ${MAIN_ENTRANCE_COORD.y})`}
                              filter="url(#fsOfficialRouteShadow)"
                            >
                              <circle
                                cx="0"
                                cy="0"
                                r="9"
                                fill="#e11d48"
                                stroke="#ffffff"
                                strokeWidth="2.5"
                              />
                              <rect
                                x="-58"
                                y="12"
                                width="116"
                                height="20"
                                rx="10"
                                fill="#0f172a"
                                stroke="#facc15"
                                strokeWidth="1.8"
                              />
                              <text
                                x="0"
                                y="25"
                                textAnchor="middle"
                                fill="#fde047"
                                fontSize="9.5"
                                fontWeight="900"
                              >
                                🚩 정문 출발 (지구본)
                              </text>
                            </g>
                          </svg>
                        )}

                        {/* Interactive Zone Pins in Fullscreen */}
                        {showRouteOverlay &&
                          DISNEYSEA_ZONES.map((zone) => {
                            const isSelected = selectedZoneId === zone.id;
                            const courseStepsHere = currentCourse.steps.filter(
                              (s) => s.zoneId === zone.id
                            );
                            const isCurrentStepZone =
                              currentCourse.steps[activeStepIndex]?.zoneId === zone.id;

                            return (
                              <button
                                key={zone.id}
                                type="button"
                                onClick={() => {
                                  setSelectedZoneId(zone.id);
                                  const firstStepIdx = currentCourse.steps.findIndex(
                                    (s) => s.zoneId === zone.id
                                  );
                                  if (firstStepIdx >= 0) {
                                    setActiveStepIndex(firstStepIdx);
                                  }
                                }}
                                style={{
                                  left: `${(zone.x / 800) * 100}%`,
                                  top: `${(zone.y / 450) * 100}%`
                                }}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer transition-all duration-200 ${
                                  isSelected || isCurrentStepZone
                                    ? 'scale-110 z-20'
                                    : 'hover:scale-105'
                                }`}
                              >
                                {courseStepsHere.length > 0 && (
                                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                                    {courseStepsHere.map((st) => {
                                      const isCurrentStep =
                                        currentCourse.steps[activeStepIndex]
                                          ?.stepNumber === st.stepNumber;
                                      return (
                                        <span
                                          key={st.stepNumber}
                                          className={`px-2 py-0.5 rounded-full text-[11px] font-black shadow-md border-2 ${
                                            isCurrentStep
                                              ? 'bg-rose-600 text-white border-amber-300 animate-bounce ring-2 ring-rose-400'
                                              : 'bg-amber-400 text-slate-950 border-slate-900'
                                          }`}
                                        >
                                          동선 #{st.stepNumber}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}

                                <div
                                  className={`px-2.5 py-1 rounded-full border-2 shadow-lg flex items-center gap-1 whitespace-nowrap ${
                                    isSelected
                                      ? 'bg-slate-950 text-amber-300 border-amber-400 ring-2 ring-amber-400/70'
                                      : 'bg-white/95 text-slate-900 border-slate-800 hover:border-rose-500'
                                  }`}
                                >
                                  <span className="text-xs">{zone.iconEmoji}</span>
                                  <span className="text-[11px] font-black">
                                    {zone.shortPinTitle}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Right Side Panel in Fullscreen: Selected Zone Photo + Active Route Steps */}
                  <div className="w-full lg:w-[390px] xl:w-[430px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-white/15 p-4 overflow-y-auto space-y-4 text-white shrink-0 max-h-[42vh] lg:max-h-none">
                    {/* Selected Zone Quick Inspector */}
                    <div className="rounded-2xl border border-amber-400/50 bg-slate-900 p-3 space-y-2.5">
                      <div className="relative h-36 w-full rounded-xl overflow-hidden border border-white/15">
                        <img
                          src={selectedZone.realPhotoUrl}
                          alt={selectedZone.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                          구역 #{selectedZone.portNumber} 실제 건물 모습
                        </span>
                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <div className="text-sm font-black text-white">
                            {selectedZone.iconEmoji} {selectedZone.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-amber-200 bg-amber-500/10 border border-amber-400/30 rounded-lg p-2 leading-relaxed">
                        <strong>👀 실제 건물 특징:</strong> {selectedZone.buildingLookSummary}
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[11px] font-black text-sky-300">
                          🎢 대표 어트랙션 & 패스
                        </div>
                        {selectedZone.keyAttractions.map((attr, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-[11px] flex items-center justify-between gap-2"
                          >
                            <span className="font-bold text-white truncate">
                              {attr.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-black text-[10px] shrink-0">
                              {attr.passType.split(' ')[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-Step Route List in Right Sidebar */}
                    <div className="space-y-2">
                      <div className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <Footprints className="w-3.5 h-3.5" />
                        <span>{currentCourse.shortLabel} ({currentCourse.steps.length}단계 순서)</span>
                      </div>
                      <div className="space-y-2">
                        {currentCourse.steps.map((st, idx) => {
                          const isActive = activeStepIndex === idx;
                          return (
                            <button
                              key={st.stepNumber}
                              type="button"
                              onClick={() => handleSelectStep(idx, st.zoneId)}
                              className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-amber-400/20 border-amber-400 text-white shadow-md'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-xs font-black text-amber-300">
                                  #{st.stepNumber}. {st.timeRange}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-sky-300 font-bold">
                                  {st.actionBadge}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-white">
                                {st.title}
                              </div>
                              <div className="text-[11px] text-slate-300 mt-1">
                                {st.howToMove}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Full Guide Scroll View inside Fullscreen Portal */
                <div className="max-w-7xl mx-auto p-4 sm:p-6">
                  {renderMapAndGuideContent(true)}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
