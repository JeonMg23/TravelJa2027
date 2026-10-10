import { TripDay, FriendCompanion, ChecklistItem, BudgetItem, SpotComment } from '../types/travel';

export const INITIAL_TRIP_DAYS: TripDay[] = [
  {
    dayNumber: 1,
    date: '1월 13일',
    fullDate: '2027-01-13 (수)',
    theme: '오전 11:30 나리타 도착 & 직통 숙소 이동 후 아사쿠사·오시아게 방면',
    description: '오전 11:30 나리타공항 착륙 후 소부선 쾌속 직통(편도 1,340엔)으로 긴시초 롯데시티호텔 체크인 & 짐보관! 우에노, 아사쿠사, 스카이트리로 이어지는 가장 효율적인 첫날 동선',
    spots: [
      {
        id: 'spot-1-0',
        name: '나리타 국제공항 (11:30 도착 및 입국 수속)',
        japaneseName: '成田国際空港 (NRT) Terminal 1/2',
        category: 'station',
        categoryLabel: '공항 도착',
        rating: 4.8,
        openStatus: '오전 11:30 착륙 예정',
        hours: '11:30 ~ 12:40 (입국 심사 & 수하물 수령)',
        estimatedTime: '11:30 ~ 12:40',
        coordinates: [35.7720, 140.3929],
        summary: '인천국제공항(ICN)에서 출발하여 오전 11시 30분 도쿄 나리타 국제공항에 착륙 예정입니다! 비짓 재팬 웹 QR로 신속하게 입국 심사와 세관을 통과하고, 지하 1층 철도역에서 소부선 쾌속을 탑승하여 숙소(롯데시티호텔 긴시쵸)로 환승 없이 바로 직행합니다.',
        tips: [
          '【도착 시간표】 11:30 비행기 착륙 ➔ 11:30~12:15 입국 심사, 지문 등록, 세관 신고, 위탁 수하물 수령 ➔ 12:20 지하 1층 철도 역사 이동 ➔ 12:35~12:45 소부선 쾌속 탑승.',
          '【비짓 재팬 웹(VJW) 사전 준비】 한국 출국 전 등록한 입국 심사/세관 QR코드를 미리 스마트폰 사진첩에 캡처해 두시면 입국 심사대를 15~20분 만에 빠르게 통과할 수 있습니다.',
          '【스이카/파스모 교통카드】 터미널 지하 1층 철도 개찰구 옆 매표기에서 Suica 또는 Pasmo 교통카드를 발급/충전하세요. (아이폰 사용자는 Apple 지갑에서 모바일 Suica/Pasmo 즉시 발급 가능)',
          '【공항➔숙소 교통편 총정리】 추천 1위는 환승 0회 직통인 JR 소부선 쾌속(1,340엔 / 82분 소요)! N\'EX(3,070엔/도쿄역 1회 환승)나 스카이라이너(2,740엔/2회 환승)보다 가격과 환승 편의성 모두 월등합니다.'
        ],
        recommendedFoods: [
          { name: '토미타 라멘 나리타공항점 (T1)', menu: '일본 최고봉 농후 츠케멘 & 아지타마고', desc: '치바 마츠도 전설의 라멘 명가 직영점 (입국 게이트 부근)', coordinates: [35.7650, 140.3860], rating: 4.6, priceRange: '1,050~1,450엔' },
          { name: '스시 쿄타츠 나리타공항점', menu: '에도마에 신선 특선 모둠 초밥', desc: '도쿄 도착 후 처음 맛보는 정통 활어 스시', coordinates: [35.7720, 140.3929], rating: 4.5, priceRange: '1,900~2,800엔' },
          { name: '공항 세븐일레븐 / 로손', menu: '이로하스 천연수 복숭아맛 & 타마고 샌드위치', desc: '전철 탑승 전 가볍게 마시는 일본 국민 음료 & 간식', coordinates: [35.7718, 140.3920], rating: 4.6, priceRange: '160~400엔' }
        ],
        address: 'Narita, Chiba Prefecture (나리타 국제공항 제1·제2터미널)',
        likes: 24,
        hasLiked: true
      },
      {
        id: 'spot-1-1',
        name: '롯데시티호텔 긴시쵸 (체크인 & 짐보관)',
        japaneseName: 'ロッテシティホテル錦糸町',
        category: 'hotel',
        categoryLabel: '호텔 체크인',
        rating: 4.5,
        openStatus: 'Open · 체크인 & 짐보관',
        hours: '정규 체크인 15:00 / 짐보관 24시간',
        estimatedTime: '14:05 ~ 15:00',
        coordinates: [35.6967, 139.8143],
        summary: '나리타 공항에서 소부선 쾌속을 탑승하면 82분 만에 환승 0회로 긴시초역 5번 출구 지하 연결 엘리베이터를 통해 호텔 로비로 직행합니다! 프론트에 짐을 맡긴 뒤 우에노로 가볍게 출발하세요.',
        tips: [
          '나리타 공항 제1/제2터미널 지하 1층에서 JR 소부선 쾌속을 타면 환승 없이 82분 만에 긴시초역에 직통 도착합니다 (편도 1,340엔).',
          '호텔 공식 체크인 시간(15:00) 전이라도 프론트에 캐리어와 짐을 무료로 상시 보관할 수 있어 14:05 도착 즉시 몸을 가볍게 만들 수 있습니다.',
          '긴시초역 지하 5번 출구가 호텔 전용 통로 및 엘리베이터와 바로 직결되어 있어 무거운 캐리어를 들고 외부 계단을 오르내릴 필요가 전혀 없습니다.',
          '호텔 1층에 세븐일레븐 편의점이 바로 연결되어 있고, 긴시초역 주변에 파르코 백화점, 아르카킷 쇼핑몰이 위치해 편리합니다.'
        ],
        recommendedFoods: [
          { name: '호텔 1층 코알라노마치 카페', menu: '롯데 코알라 마스코트 팬케이크 & 라떼 세트', desc: '호텔 투숙객 할인 및 시그니처 디저트', coordinates: [35.6967, 139.8143], rating: 4.5, priceRange: '700~1,100엔' },
          { name: '긴시초 파르코 푸드홀', menu: '스미다 로컬 델리 & 말차 파르페', desc: '역 앞 깔끔하고 쾌적한 가성비 푸드코트', coordinates: [35.6962, 139.8138], rating: 4.4, priceRange: '900~1,300엔' },
          { name: '토리다시 오뎅 긴시초', menu: '진한 닭육수 수제 오뎅 & 미니 솥밥', desc: '긴시초역 도보 2분 현지 직장인 가성비 오뎅 맛집', coordinates: [35.6960, 139.8148], rating: 4.6, priceRange: '800~1,400엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 12,
        hasLiked: false
      },
      {
        id: 'spot-1-2',
        name: '우에노 공원',
        japaneseName: '上野恩賜公園',
        category: 'park',
        categoryLabel: '공원',
        rating: 4.4,
        openStatus: 'Open',
        hours: 'Closes 11:00 PM',
        estimatedTime: '15:00 ~ 16:30',
        coordinates: [35.7148, 139.7744],
        summary: '호텔에 짐을 둔 뒤, 지하철로 우에노로 이동해 늦은 점심과 산책을 즐겨보세요.',
        tips: [
          '긴시초역에서 JR 소부선 탑승 후 아키하바라역에서 야마노테선으로 1회 환승하면 약 16분 만에 우에노역 도착합니다.',
          '아메요코초 시장이 바로 인접해 있어 타코야키, 과일 꼬치 등 길거리 간식이나 가벼운 식사를 즐기기 좋습니다.',
          '공원 내 시노바즈 연못과 국립서양미술관 주변의 고즈넉한 은행나무 산책로를 걸어보세요.'
        ],
        recommendedFoods: [
          { name: '이센 본점 (井泉 本店)', menu: '원조 히레카츠 & 카츠샌드', desc: '젓가락으로 잘릴 만큼 부드러운 도쿄 카츠의 원조 노포', coordinates: [35.7077, 139.7725], rating: 4.6, priceRange: '1,500~2,200엔' },
          { name: '돈카츠 야마베 우에노점', menu: '로스카츠 정식 (도쿄 최강 가성비)', desc: '단돈 800엔대 두툼한 최고 가성비 돈카츠 성지', coordinates: [35.7088, 139.7738], rating: 4.5, priceRange: '800~1,100엔' },
          { name: '우에노 미나토야 본점', menu: '모둠 카이센동 & 직화 대왕 타코야키', desc: '아메요코초 시장 최고 가성비 해산물 덮밥 노포', coordinates: [35.7110, 139.7745], rating: 4.4, priceRange: '600~900엔' },
          { name: '모모가야 우에노', menu: '소고기 멘치카츠 & 고로케', desc: '바삭하고 육즙 터지는 갓 튀긴 테이크아웃 간식', coordinates: [35.7099, 139.7740], rating: 4.4, priceRange: '200~400엔' }
        ],
        address: 'Uenokoen, Taito City, Tokyo',
        likes: 9,
        hasLiked: false
      },
      {
        id: 'spot-1-3',
        name: '센소지',
        japaneseName: '浅草寺 (Senso-ji)',
        category: 'temple',
        categoryLabel: '불교사찰',
        rating: 4.6,
        openStatus: 'Open',
        hours: '경내 상시 개방 (본당 06:00 ~ 17:00)',
        estimatedTime: '17:00 ~ 18:30',
        coordinates: [35.7148, 139.7967],
        summary: '우에노에서 긴자선을 타고 아사쿠사로 넘어가면 동선상 가장 깔끔합니다. 도쿄에서 가장 오래된 사원 특유의 분위기를 느낄 수 있습니다.',
        tips: [
          '우에노역에서 도쿄메트로 긴자선(G16)을 탑승하면 3정거장(약 6분) 만에 아사쿠사역 종점(G19)에 바로 도착합니다.',
          '사원 입구 카미나리몬(가미나리몬)의 거대한 붉은 제등 앞에서 인생 기념사진을 남기세요.',
          '사원 앞 나카미세도리 상점가에서 전통 인형빵(닝교야키), 당고 등을 구경하며 오시아게(스카이트리) 방면으로 걸어가기 좋습니다.'
        ],
        recommendedFoods: [
          { name: '아사쿠사 멘치', menu: '육즙 가득한 소고기 멘치카츠', desc: '겉바속촉 1위 아사쿠사 대표 길거리 가성비 미식', coordinates: [35.7126, 139.7955], rating: 4.5, priceRange: '350엔' },
          { name: '스즈키엔 아사쿠사', menu: '세계에서 가장 진한 7단계 녹차 젤라또', desc: '시즈오카산 최고급 말차의 풍미를 단계별로 즐기는 디저트', coordinates: [35.7161, 139.7972], rating: 4.7, priceRange: '400~650엔' },
          { name: '아사쿠사 카게츠도 본점', menu: '점보 메론빵 & 소프트아이스크림', desc: '3시간 저온 발효로 겉은 바삭하고 속은 깃털처럼 폭신한 빵', coordinates: [35.7142, 139.7946], rating: 4.4, priceRange: '280~550엔' },
          { name: '아사쿠사 규카츠 본점', menu: '개인 미니 화로 규카츠 정식', desc: '센소지 카미나리몬 맞은편 유명 살치살 규카츠 명소', coordinates: [35.7118, 139.7960], rating: 4.6, priceRange: '1,500~2,200엔' }
        ],
        address: '2 Chome-3-1 Asakusa, Taito City, Tokyo',
        likes: 15,
        hasLiked: true
      },
      {
        id: 'spot-1-4',
        name: '도쿄 스카이트리',
        japaneseName: '東京スカイツリー',
        category: 'observatory',
        categoryLabel: '전망대',
        rating: 4.4,
        openStatus: 'Open',
        hours: 'Closes 10:00 PM',
        estimatedTime: '19:00 ~ 21:00',
        coordinates: [35.7100, 139.8107],
        summary: '아사쿠사 구경 후 지하철 아사쿠사선으로 2정거장 이동해 스카이트리로 이동하세요. 도쿄 시내 야경을 한눈에 내려다보는 완벽한 저녁 코스입니다.',
        tips: [
          '아사쿠사역에서 도에이 아사쿠사선(A18) 탑승 시 2정거장(약 4분) 만에 오시아게(스카이트리)역 지하로 바로 직결됩니다.',
          '높이 634m 전망대에서 도쿄 타워와 관동 평야 전경 야경이 파노라마로 펼쳐집니다.',
          '하단 복합쇼핑몰 소라마치(Solamachi) 6~7층 식당가에 맛집이 집중되어 있어 저녁 식사를 즐기세요.'
        ],
        recommendedFoods: [
          { name: '로쿠린샤 (소라마치 6층)', menu: '특제 농후 츠케멘', desc: '쫄깃한 극태면과 진한 가쓰오 돈골 육수', coordinates: [35.7100, 139.8115], rating: 4.6, priceRange: '1,050~1,350엔' },
          { name: '토리텐구 소라마치점', menu: '나고야 코친 오야코동 & 닭꼬치', desc: '부드러운 명품 닭고기와 달걀이 어우러진 덮밥 맛집', coordinates: [35.7102, 139.8120], rating: 4.5, priceRange: '1,200~1,600엔' },
          { name: '스시 츠네 소라마치점', menu: '에도마에 모둠 초밥 세트', desc: '소라마치 7층 전망 좋은 가성비 정통 스시', coordinates: [35.7104, 139.8116], rating: 4.4, priceRange: '1,600~2,400엔' },
          { name: '기온 츠지리 소라마치점', menu: '우지 말차 소프트아이스크림 & 파르페', desc: '교토 160년 전통 녹차 명가의 진한 말차 디저트', coordinates: [35.7101, 139.8112], rating: 4.5, priceRange: '600~900엔' }
        ],
        address: '1 Chome-1-2 Oshiage, Sumida City, Tokyo',
        likes: 18,
        hasLiked: true
      },
      {
        id: 'spot-1-5',
        name: '롯데시티호텔 긴시쵸 (숙소 복귀 & 휴식)',
        japaneseName: 'ロッテシティホテル錦糸町',
        category: 'hotel',
        categoryLabel: '숙소 복귀',
        rating: 4.5,
        openStatus: 'Open · 체크인 완료 / 휴식',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '21:30 ~ 23:00',
        coordinates: [35.6967, 139.8143],
        summary: '스카이트리(오시아게역)에서 지하철 한조몬선으로 단 1정거장(3분) 만에 숙소로 직통 복귀합니다. 체크인 후 짐을 풀고 첫날 밤의 여독을 달래며, 호텔 도보 1~2분 거리 긴시초 역세권 골목의 활기찬 선술집에서 시원한 살얼음 생맥주와 숯불 꼬치구이로 첫날 축배를 들어보세요!',
        tips: [
          '오시아게역에서 도쿄메트로 한조몬선 탑승 시 단 1정거장(3분) 만에 긴시초역 도착!',
          '긴시초역 5번 출구 지하 통로가 호텔 전용 엘리베이터와 바로 연결되어 밤에도 비바람 걱정 없이 안전하게 객실로 복귀합니다.',
          '🍺 [숙소 근처 밤맥주 선술집 1] 토리키조쿠 긴시초남쪽출구점(호텔 도보 2분): 전 메뉴 균일 370엔대의 일본 국민 이자카야! 700ml 대용량 킨무기 메가 생맥주 & 산토리 프리미엄 몰츠 생맥주에 불향 가득한 숯불 타레 닭꼬치(모모키조쿠야키)로 부담 없이 첫날 밤 건배!',
          '🍺 [숙소 근처 밤맥주 선술집 2] 대중주점 텟짱 긴시초점(호텔 도보 1분): 레트로 쇼와 골목 선술집. 꽁꽁 얼린 얼음잔 삿포로 생맥주, 진한 소힘줄 조림(니코미)과 바삭한 햄카츠 안주가 환상적입니다.'
        ],
        recommendedFoods: [
          { name: '토리키조쿠 긴시초남쪽출구 (가성비 이자카야)', menu: '700ml 메가 생맥주 & 숯불 타레 닭꼬치 (모모키조쿠)', desc: '호텔 도보 2분! 전 메뉴 370엔 균일가로 즐기는 시원한 생맥주와 대형 닭꼬치', coordinates: [35.6962, 139.8145], rating: 4.5, priceRange: '1,200~2,200엔 (가성비 최강)' },
          { name: '대중주점 텟짱 긴시초점 (로컬 선술집)', menu: '살얼음 삿포로 생맥주 조끼 & 소힘줄 미소 조림·햄카츠', desc: '호텔 도보 1분! 레트로 감성의 심야 선술집에서 들이키는 시원한 맥주 한잔', coordinates: [35.6965, 139.8140], rating: 4.6, priceRange: '1,400~2,400엔' },
          { name: '교자보 긴시초남쪽출구', menu: '철판 수제 야키교자 (1인분 300엔대) & 생맥주', desc: '긴시초 로컬 주민들이 줄 서서 포장하는 바삭한 교자 맛집', coordinates: [35.6961, 139.8139], rating: 4.5, priceRange: '400~800엔' },
          { name: '세븐일레븐 긴시초점 (호텔 1층)', menu: '홋카이도 우유 푸딩 & 타마고 산도 & 캔맥주', desc: '호텔 로비 엘리베이터 바로 옆 24시간 편의점 야식', coordinates: [35.6967, 139.8143], rating: 4.5, priceRange: '200~500엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 16,
        hasLiked: false
      }
    ],
    transits: [
      {
        fromSpotId: 'spot-1-0',
        toSpotId: 'spot-1-1',
        method: 'train',
        routeName: 'JR 소부선 쾌속 (나리타공항역 ➔ JO22 긴시초역 직통)',
        durationMinutes: 82,
        fareJPY: 1340,
        fareKRW: 12200,
        lineName: 'JR 소부선 쾌속 (JO)',
        lineColor: '#007AC9',
        detailedRoute: '나리타공항 T1/T2 B1F JR 승강장 ➔ 소부선 쾌속(즈시·구리하마행) 직통 탑승 ➔ 긴시초역 5번 출구 호텔 지하 직결',
        transitTip: '★ 추천 1순위 (환승 0회 직통): 캐리어가 있어도 환승 계단 없이 82분 만에 숙소(롯데시티호텔) 앞 긴시초역으로 바로 직결 이동합니다! (편도 1,340엔 / IC 1,342엔, 2인 2,680엔)',
        passRecommendation: 'Suica/Pasmo IC카드 태그 (1인 1,342엔 / 승차권 1,340엔)',
        transferCount: 0,
        transitOptions: [
          {
            name: 'JR 소부선 쾌속 (추천 1순위 직통)',
            durationMinutes: 82,
            fareJPY: 1340,
            transferCount: 0,
            description: '환승 0회! 나리타공항 지하 승강장에서 탑승해 긴시초역까지 한 번에 이동. 5번 출구로 나오면 롯데시티호텔 지하 로비로 직결되어 캐리어 이동에 가장 편안하고 가성비 최고입니다.',
            tag: '★ 강력 추천 1위'
          },
          {
            name: 'JR 나리타 익스프레스 (N\'EX) + 도쿄역 환승',
            durationMinutes: 75,
            fareJPY: 3070,
            transferCount: 1,
            description: '전좌석 지정석 특급 열차. 도쿄역 지하 총무 플랫폼에서 소부선 쾌속으로 1회 환승(8분 소요) 후 긴시초역 도착. 왕복 할인 티켓 미구매 시 요금이 다소 비쌉니다.',
            tag: '특급 좌석 지정'
          },
          {
            name: '게이세이 스카이라이너 + 닛포리 환승',
            durationMinutes: 60,
            fareJPY: 2740,
            transferCount: 2,
            description: '시속 160km 초고속 열차로 닛포리역(36분)까지 이동 후, 아키하바라를 거쳐 긴시초역으로 2회 환승. 속도는 가장 빠르나 환승이 2회 발생하여 짐이 많을 경우 비추천합니다.',
            tag: '초고속 (환승 2회)'
          },
          {
            name: '나리타 공항 리무진 버스',
            durationMinutes: 85,
            fareJPY: 3100,
            transferCount: 0,
            description: '공항 1층 버스 정류장에서 탑승하여 도쿄역 또는 인근 호텔(토부호텔 레반트 도쿄) 하차. 짐을 트렁크에 실어주나 고속도로 정체 위험 및 요금이 높은 편입니다.',
            tag: '공항 리무진'
          }
        ]
      },
      {
        fromSpotId: 'spot-1-1',
        toSpotId: 'spot-1-2',
        method: 'train',
        routeName: 'JR 소부선 ➔ 아키하바라 환승 ➔ JR 야마노테선 우에노역',
        durationMinutes: 16,
        fareJPY: 170,
        fareKRW: 1550,
        lineName: 'JR 소부선 각역정차 ➔ JR 야마노테선',
        lineColor: '#FFD700',
        detailedRoute: '긴시초역 2번 승강장 탑승 ➔ 아키하바라역 맞은편 환승 ➔ 우에노역 공원 출구',
        transitTip: '소부선 탑승 후 아키하바라에서 1회 환승 (동일 홈 계단 이동, IC카드 167엔)',
        passRecommendation: 'Suica/Pasmo IC카드 태그 (170엔)',
        transferCount: 1
      },
      {
        fromSpotId: 'spot-1-2',
        toSpotId: 'spot-1-3',
        method: 'subway',
        routeName: '도쿄메트로 긴자선 (G16 우에노역 ➔ G19 아사쿠사역 종점 직통)',
        durationMinutes: 6,
        fareJPY: 180,
        fareKRW: 1640,
        lineName: '도쿄메트로 긴자선 (G)',
        lineColor: '#FF9500',
        detailedRoute: '우에노역 1번 승강장 ➔ 3정거장 직통 ➔ 아사쿠사역 종점 1번 출구 (카미나리몬 도보 1분)',
        transitTip: '환승 없이 3정거장(6분) 직통! 시종착역이라 쾌적하며 아사쿠사역 1번 출구 도보 1분',
        passRecommendation: '도쿄 서브웨이 티켓 / IC카드 178엔',
        transferCount: 0
      },
      {
        fromSpotId: 'spot-1-3',
        toSpotId: 'spot-1-4',
        method: 'subway',
        routeName: '도에이 아사쿠사선 (A18 아사쿠사역 ➔ A20 오시아게역 직통)',
        durationMinutes: 4,
        fareJPY: 180,
        fareKRW: 1640,
        lineName: '도에이 아사쿠사선 (A)',
        lineColor: '#E85298',
        detailedRoute: '아사쿠사역 1번 승강장 탑승 ➔ 2정거장 ➔ 오시아게(스카이트리)역 지하 직결',
        transitTip: '2정거장(4분) 직통! 스카이트리 지하 쇼핑몰 소라마치와 바로 연결됩니다.',
        passRecommendation: '도쿄 서브웨이 티켓 / IC카드 178엔',
        transferCount: 0
      },
      {
        fromSpotId: 'spot-1-4',
        toSpotId: 'spot-1-5',
        method: 'subway',
        routeName: '도쿄메트로 한조몬선 (Z14 오시아게역 ➔ Z13 긴시초역 직통 1정거장)',
        durationMinutes: 3,
        fareJPY: 180,
        fareKRW: 1640,
        lineName: '도쿄메트로 한조몬선 (Z)',
        lineColor: '#8F76D6',
        detailedRoute: '오시아게역 1번 승강장(시부야 방면) ➔ 1정거장 ➔ 긴시초역 5번 출구 호텔 연결',
        transitTip: '🏨 [숙소 복귀] 단 1정거장(3분) 직통! 긴시초역 5번 출구에서 호텔 엘리베이터로 비/추위 없이 객실 복귀',
        passRecommendation: '도쿄 서브웨이 티켓 / IC카드 178엔',
        transferCount: 0,
        isReturnToHotel: true
      }
    ]
  },
  {
    dayNumber: 2,
    date: '1월 14일',
    fullDate: '2027-01-14 (목)',
    theme: '도쿄 디즈니씨 종일 일정 (오전 7시 오픈런 도착)',
    description: '오전 7시 정문 도착으로 오픈런 대기 후 인기 어트랙션 및 신규 테마존 만끽, 야간 나이트 쇼 관람 후 대중교통으로 긴시초 숙소 복귀',
    spots: [
      {
        id: 'spot-2-0',
        name: '롯데시티호텔 긴시쵸 (디즈니씨 오픈런 출발)',
        japaneseName: 'ロッテシティホテル錦糸町 (出発)',
        category: 'hotel',
        categoryLabel: '숙소 출발',
        rating: 4.5,
        openStatus: '오전 06:15 출발',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '06:15 ~ 06:20 (호텔 출발)',
        coordinates: [35.6967, 139.8143],
        summary: '도쿄 디즈니씨 오전 7시 정문 도착 및 오픈런 선두권 대기를 위해 아침 6시 15분 호텔을 출발합니다. 긴시초역 5번 출구 엘리베이터를 통해 JR 승강장으로 바로 이동합니다.',
        tips: [
          '⏰ 오전 7시 정각 도착 타임라인: 06:15 호텔 로비 출발 ➔ 06:18 긴시초역 JR 소부선 쾌속 탑승 ➔ 06:26 도쿄역 환승 ➔ 06:36 도쿄역 JR 케이요선 쾌속 탑승 ➔ 06:50 마이하마역 도착 ➔ 06:54 디즈니 리조트 라인 탑승 ➔ 07:00 디즈니씨역 도착!',
          '오전 7시 도착 시 조식 뷔페 이용이 어려우므로 전날 밤 호텔 1층 세븐일레븐에서 간편식(삼각김밥, 샌드위치, 따뜻한 음료)을 미리 사두시는 것을 추천합니다.',
          '교통카드(스이카/파스모)에 최소 2,000엔 이상 잔액이 들어있는지 전날 밤 충전 상태를 점검하세요.'
        ],
        recommendedFoods: [
          { name: '호텔 1층 세븐일레븐', menu: '오픈런 대기용 온음료 & 삼각김밥 2개 세트', desc: '이른 아침 오픈런 대기줄에서 먹기 편한 따뜻한 간편식', coordinates: [35.6967, 139.8143], rating: 4.6, priceRange: '300~600엔' },
          { name: '마이하마 베이커리 & 카페', menu: '모닝 크루아상 샌드위치 & 드립 커피', desc: '마이하마역 리조트 게이트웨이 인근 신선 베이커리', coordinates: [35.6358, 139.8830], rating: 4.4, priceRange: '450~750엔' },
          { name: '디즈니씨 에키마에 벤또', menu: '테이크아웃 유부초밥 & 오차 음료', desc: '모노레일 역 앞 간편 포장 식사', coordinates: [35.6272, 139.8885], rating: 4.5, priceRange: '500~800엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 19,
        hasLiked: false
      },
      {
        id: 'spot-2-1',
        name: '도쿄 디즈니씨 (오전 7시 도착 대기 & 종일)',
        japaneseName: '東京ディズニーシー',
        category: 'amusement',
        categoryLabel: '오락실 / 테마파크',
        rating: 4.8,
        openStatus: '오전 07:00 도착 대기 / 08:30 파크 오픈',
        hours: '08:30 ~ 21:00 (실제 오픈 08:30경)',
        estimatedTime: '07:00 도착 대기 ~ 21:00 폐장',
        coordinates: [35.6267, 139.8851],
        summary: '세계 유일 바다를 테마로 한 디즈니 테마파크. 오전 7:00 정문 도착으로 오픈런 최선두 그룹을 확보하여 소어링 및 판타지 스프링스 DPA를 1순위로 선점합니다.',
        tips: [
          '오전 7:00 도착 시 정문 게이트 앞 그늘진 자리를 선점할 수 있으며 보안검색(08:00 시작)을 1빠로 통과해 08:30 파크 입장 즉시 대기 없이 질주할 수 있습니다.',
          '입장 게이트 통과 즉시(08:30) 도쿄 디즈니 리조트 공식 앱에서 "소어링: 판타스틱 플라이트" DPA(2,000엔) 또는 판타지 스프링스 DPA를 즉시 결제하세요.',
          '동선 추천: 소어링 탑승 ➔ 센터 오브 디 어스(미스테리어스 아일랜드) ➔ 인디아나 존스 ➔ 머메이드 라군(오후 휴식) ➔ 아라비안 코스트 ➔ 19:40 야간 수상쇼 "빌리브! 씨 오브 드림스" 관람.'
        ],
        recommendedFoods: [
          { name: '카스바 푸드코트 (아라비안 코스트)', menu: '치킨 & 비프 카레 난 콤비네이션 세트', desc: '디즈니씨 파크 내 최강 가성비의 푸짐한 정통 커리', coordinates: [35.6285, 139.8820], rating: 4.5, priceRange: '900~1,300엔' },
          { name: '유카탄 베이스캠프 그릴', menu: '스모크 로스트 비프 & 치킨 플레이트', desc: '로스트우드 정글 분위기 속 든든하고 가성비 좋은 고기 세트', coordinates: [35.6292, 139.8805], rating: 4.4, priceRange: '1,100~1,600엔' },
          { name: '자비에르 길거리 스낵', menu: '리틀 그린 멘 알린 만두(모찌) 3색 & 추러스', desc: '초코·딸기·바닐라 크림 모찌와 계절 한정 츄러스 간식', coordinates: [35.6265, 139.8850], rating: 4.6, priceRange: '400~600엔' },
          { name: '도크사이드 다이너', menu: '프라이드 치킨 & 와플 세트', desc: '아메리칸 워터프런트 부두 옆 캐주얼 가성비 다이너', coordinates: [35.6248, 139.8865], rating: 4.4, priceRange: '950~1,400엔' }
        ],
        address: '1-13 Maihama, Urayasu, Chiba',
        likes: 24,
        hasLiked: true
      },
      {
        id: 'spot-2-2',
        name: '롯데시티호텔 긴시쵸 (숙소 복귀 & 딥슬립)',
        japaneseName: 'ロッテシティホテル錦糸町',
        category: 'hotel',
        categoryLabel: '숙소 복귀',
        rating: 4.5,
        openStatus: 'Open · 체크인 완료 / 휴식',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '21:40 ~ 23:00',
        coordinates: [35.6967, 139.8143],
        summary: '디즈니씨에서 하루 2만보 이상 걸었던 피로를 소부선 쾌속 직통으로 숙소에 복귀해 말끔히 씻어내세요. 다리 아프고 목마른 밤, 호텔 바로 앞 1~3분 거리 선술집에서 1리터 얼음장 메가 맥주나 바삭한 꼬치 튀김으로 시원한 탄산과 함께 갈증을 단숨에 날려버리세요!',
        tips: [
          '디즈니씨역에서 디즈니 리조트 라인 탑승(300엔) ➔ 마이하마역에서 JR 케이요선 탑승 후 도쿄역에서 JR 소부선 쾌속 환승 ➔ 긴시초역 도착!',
          '긴시초역 5번 출구와 호텔 지하 로비가 직결되어 늦은 밤에도 안전하고 쾌적하게 객실 침대로 직행합니다.',
          '🍺 [숙소 근처 밤맥주 선술집 1] 하카타 게키죠 긴시초점(호텔 도보 2분): 축제 같은 야타이(포장마차) 감성! 종일 걸어 타는 목마름을 한 방에 날려주는 1리터 "얼음장 메가 조끼 생맥주"와 지글지글 철판 한입 테츠나베 교자(군만두)의 환상 조합!',
          '🍺 [숙소 근처 밤맥주 선술집 2] 쿠시카츠 다나카 긴시초점(호텔 도보 3분): 갓 튀겨 바삭바삭한 오사카 명물 꼬치튀김 전문점. 살얼음 기린 이치방 시보리 생맥주 & 주사위 굴려 무료나 반값을 노리는 친치로 하이볼 챌린지!'
        ],
        recommendedFoods: [
          { name: '하카타 게키죠 긴시초점 (야타이 선술집)', menu: '1리터 얼음장 메가 조끼 생맥주 & 철판 한입 테츠나베 교자', desc: '호텔 도보 2분! 디즈니씨 2만보 피로를 단숨에 날려주는 초대형 메가 생맥주 맛집', coordinates: [35.6963, 139.8148], rating: 4.6, priceRange: '1,800~2,600엔' },
          { name: '쿠시카츠 다나카 긴시초점 (튀김 선술집)', menu: '오사카식 수제 꼬치튀김 8종 & 살얼음 기린 생맥주', desc: '호텔 도보 3분! 갓 튀겨 바삭한 쿠시카츠와 주사위 굴리는 친치로 하이볼', coordinates: [35.6958, 139.8142], rating: 4.5, priceRange: '1,600~2,500엔' },
          { name: '이치란 라멘 긴시초점', menu: '천연 돈골 라멘 & 시원한 생맥주 세트', desc: '24시간 영업으로 지친 몸을 녹여주는 따뜻한 돈코츠 국물', coordinates: [35.6965, 139.8152], rating: 4.5, priceRange: '980~1,480엔' },
          { name: '세븐일레븐 긴시초점 (호텔 1층)', menu: '따뜻한 관동풍 어묵(오뎅) 5종 & 아사히 캔맥주', desc: '심야 복귀 후 호텔 로비에서 즐기는 갓 끓인 따끈한 어묵과 캔맥주', coordinates: [35.6967, 139.8143], rating: 4.5, priceRange: '500~800엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 20,
        hasLiked: false
      }
    ],
    transits: [
      {
        fromSpotId: 'spot-2-0',
        toSpotId: 'spot-2-1',
        method: 'train',
        routeName: 'JR 소부선 쾌속 ➔ 도쿄역 ➔ JR 케이요선 쾌속 ➔ 마이하마역 ➔ 디즈니 모노레일',
        durationMinutes: 42,
        fareJPY: 610,
        fareKRW: 5550,
        lineName: 'JR선 (310엔) + 디즈니 리조트 라인 (300엔) = 총 610엔',
        lineColor: '#007AC9',
        detailedRoute: '긴시초역 06:18발 (JR 소부선 쾌속 8분) ➔ 도쿄역 06:26착 환승통로 도보(10분) ➔ 도쿄역 06:36발 (JR 케이요선 쾌속 14분) ➔ 마이하마역 06:50착 ➔ 디즈니 리조트 라인(6분, 300엔) ➔ 오전 07:00 디즈니씨역 정문 도착!',
        transitTip: '⏰ [오전 7:00 정각 도착 오픈런 타임테이블]\n• 06:15 - 호텔 로비 출발 (긴시초역 지하 5번 출구 연결)\n• 06:18 - 긴시초역 승강장 출발 (JR 소부선 쾌속 도쿄행, 8분)\n• 06:26 - 도쿄역 도착 (지하 환승통로 따라 케이요선 방향 9~10분 이동)\n• 06:36 - 도쿄역 승강장 출발 (JR 케이요선 쾌속 소가행, 14분)\n• 06:50 - 마이하마역(舞浜駅) 도착 후 남쪽 출구 리조트 게이트웨이역 이동\n• 06:54 - 디즈니 리조트 라인 모노레일 탑승 (6분 소요, 300엔)\n• 07:00 - 도쿄 디즈니씨역 정문 도착 및 대기열 선두 확보 완료!\n\n💰 [교통 요금 안내]\n- JR 전철 편도 (긴시초 ➔ 도쿄 ➔ 마이하마): 310엔 (IC카드 308엔)\n- 디즈니 리조트 라인 모노레일: 300엔\n- 1인 편도 요금: 610엔 (약 5,550원) / 2인 편도 요금: 1,220엔 (약 11,100원)',
        passRecommendation: '스이카/파스모 IC카드 (편도 610엔 / 2인 1,220엔)',
        transferCount: 2
      },
      {
        fromSpotId: 'spot-2-1',
        toSpotId: 'spot-2-2',
        method: 'train',
        routeName: '디즈니 리조트 라인 ➔ JR 마이하마역 ➔ 도쿄역 ➔ JR 소부선 긴시초역',
        durationMinutes: 42,
        fareJPY: 610,
        fareKRW: 5550,
        lineName: '디즈니 모노레일 (300엔) + JR 케이요선/소부선 (310엔) = 총 610엔',
        lineColor: '#007AC9',
        detailedRoute: '디즈니씨역 21:15 탑승 ➔ 마이하마역 ➔ JR 케이요선 쾌속 ➔ 도쿄역 환승 ➔ JR 소부선 쾌속 ➔ 긴시초역 5번 출구 호텔 지하 직결',
        transitTip: '🏨 [숙소 복귀] 퇴장 후 디즈니씨역에서 모노레일(300엔)로 마이하마역 이동 후 JR 케이요선+소부선 쾌속(310엔)으로 약 42분 만에 긴시초 숙소 직통 도착! 긴시초역 5번 출구로 호텔 로비 엘리베이터가 바로 연결되어 늦은 밤에도 안전하고 편안합니다.\n\n💰 [교통 요금 안내]\n- 1인 편도 요금: 610엔 (약 5,550원) / 2인 편도: 1,220엔\n- Day 2 왕복 총 교통비: 1인 1,220엔 (약 11,100원) / 2인 2,440엔 (약 22,200원)',
        passRecommendation: '스이카/파스모 IC카드 (사전 잔액 1,000엔 이상 충전 권장)',
        transferCount: 2,
        isReturnToHotel: true
      }
    ]
  },
  {
    dayNumber: 3,
    date: '1월 15일',
    fullDate: '2027-01-15 (금)',
    theme: '해리포터와 신도심 (긴자 제외)',
    description: '워너 브라더스 스튜디오 투어에서 마법 세계를 탐험하고, 신주쿠와 시부야 스카이 후 한조몬선 지하철 직통으로 긴시초 숙소 복귀',
    spots: [
      {
        id: 'spot-3-0',
        name: '롯데시티호텔 긴시쵸 (숙소 출발 - 해리포터 스튜디오 원정)',
        japaneseName: 'ロッテシティホテル錦糸町 (出発)',
        category: 'hotel',
        categoryLabel: '숙소 출발',
        rating: 4.5,
        openStatus: '오전 07:45 집결 / 07:50 출발',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '07:45 ~ 07:52 (호텔 출발)',
        coordinates: [35.6967, 139.8143],
        summary: '워너 브라더스 해리포터 스튜디오 투어 오전 8시 40분 정문 도착을 위해 아침 7시 45분 호텔 로비에 집결하여 출발합니다. 긴시초역 5번 출구 전용 엘리베이터를 통해 지하철 승강장으로 직결 이동합니다.',
        tips: [
          '⏰ 오전 8:40 도착 타임테이블:\n• 07:45 - 호텔 로비 집결 (지하 5번 출구 엘리베이터 이동)\n• 07:52 - 긴시초역(Z13) 한조몬선 시부야 방면 탑승 (4분)\n• 07:56 - 기요스미시라카와역(Z11/E15) 환승통로 이동 (3분)\n• 08:00 - 도에이 오에도선 토시마엔 방면 직통 탑승 (37분)\n• 08:37 - 토시마엔역(E36) 도착 후 A2번 출구 도보 2분\n• 08:40 - 워너 브라더스 스튜디오 정문 광장 도착 완료!',
          '스튜디오 사전 입장 및 가방 보안 검색대가 08:30~09:00경부터 오픈하므로, 08:40에 도착하면 대기 없이 여유롭게 야외 포토존(수호 순록, 대형 해리 안경 조형물)과 로비 개구리 카페를 둘러볼 수 있습니다.',
          '도쿄 서브웨이 티켓(24/48/72시간권) 소지 시 추가 요금 없이 0원에 전 구간 탑승 가능합니다!'
        ],
        recommendedFoods: [
          { name: '호텔 1층 세븐일레븐', menu: '모닝 드립 커피 & 프리미엄 삼각김밥 2종', desc: '이동 중 든든하게 먹을 수 있는 간편 아침 식사', coordinates: [35.6967, 139.8143], rating: 4.6, priceRange: '300~600엔' },
          { name: '긴시초 하치텐 킷사텐', menu: '모닝 토스트 & 사이폰 커피 세트', desc: '호텔 앞 레트로 카페 아침 세트', coordinates: [35.6970, 139.8138], rating: 4.5, priceRange: '550~850엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 19,
        hasLiked: false
      },
      {
        id: 'spot-3-1',
        name: '워너 브라더스 스튜디오 투어 도쿄 - 메이킹 오브 해리 포터',
        japaneseName: 'ワーナー ブラザース スタジオツアー東京',
        category: 'amusement',
        categoryLabel: '테마 스튜디오',
        rating: 4.7,
        openStatus: '오전 08:40 정문 도착 / 08:30~09:00 스튜디오 오픈',
        hours: '08:30 ~ 19:30 (투어 전일)',
        estimatedTime: '08:40 도착 대기 ~ 13:30 (오전 투어)',
        coordinates: [35.7471, 139.6190],
        summary: '아시아 최초 해리 포터 스튜디오 투어. 오전 8시 40분 일찍 도착하여 대기줄 없이 소지품 검사를 통과하고, 호그와트 대연회장, 다이애건 앨리, 9와 3/4 승강장 등 영화 속 세트장을 완벽하게 탐험합니다.',
        tips: [
          '⏰ 오전 08:40 정문 도착으로 대기열 최선두를 확보하여 소지품 검사를 1빠로 통과하고, 투어 시작 전 야외 광장 포토존(수호 순록, 대형 해리 안경) 및 로비 굿즈샵을 여유롭게 감상하세요.',
          '전시 규모가 방대하고 도보 관람 구간이 많으므로 무조건 발이 편한 신발을 착용하세요.',
          '투어 중간에 위치한 백롯 카페(Backlot Cafe)에서 호그와트 4대 기숙사 플레이트와 시원한 무알콜 버터 맥주를 마시며 휴식을 취해보세요.',
          '인터랙티브 빗자루 비행 체험과 지팡이 결투 영상 체험 영상 다운로드를 놓치지 마세요.'
        ],
        recommendedFoods: [
          { name: '백롯 카페 (Backlot Cafe)', menu: '무알콜 버터맥주 (기념 컵 증정) & 기숙사 버거 세트', desc: '투어 중간 야외 세트장에서 즐기는 시그니처 버터맥주', coordinates: [35.7471, 139.6190], rating: 4.5, priceRange: '1,100~1,900엔' },
          { name: '프로그 카페 (Frog Cafe)', menu: '초콜릿 개구리 머핀 & 헤드위그 케이크', desc: '해리포터 테마의 아기자기한 마법 베이커리', coordinates: [35.7468, 139.6185], rating: 4.4, priceRange: '650~950엔' },
          { name: '토시마엔 하쿠류멘', menu: '진한 수제 탄탄멘 & 교자 세트', desc: '토시마엔역 바로 앞 로컬 줄서는 가성비 라멘', coordinates: [35.7435, 139.6490], rating: 4.5, priceRange: '800~1,100엔' }
        ],
        address: '1 Chome-1-7 Kasumicho, Nerima City, Tokyo (구 토시마엔)',
        likes: 21,
        hasLiked: true
      },
      {
        id: 'spot-3-2',
        name: '신주쿠',
        japaneseName: '新宿 (Shinjuku)',
        category: 'station',
        categoryLabel: '기차역 / 도심',
        rating: 3.9,
        openStatus: 'Open',
        hours: '상시 개방 (백화점 10:00 ~ 20:30)',
        estimatedTime: '14:30 ~ 17:00',
        coordinates: [35.6909, 139.7003],
        summary: '투어를 마치고 토시마엔역에서 도에이 오에도선을 타면 신주쿠 방면으로 매끄럽게 연결됩니다. 신주쿠역 인근에서 늦은 점심과 쇼핑을 즐겨보세요.',
        tips: [
          '해리포터 투어 종료 후 토시마엔역에서 도에이 오에도선을 타면 신주쿠역까지 환승 없이 약 20분 만에 도착합니다.',
          '신주쿠니시구치(서쪽 출구) 역 근처의 쇼핑몰(오다큐, 게이오 백화점)부터 구경하며 내려오는 동선을 추천합니다.',
          '세이부신주쿠역 주변 가부키초 방면으로 걸어 나가시면 고질라 헤드와 화려한 네온사인 등 역동적인 도쿄 도심 풍경을 마주할 수 있습니다.'
        ],
        recommendedFoods: [
          { name: '모토무라 규카츠 신주쿠점', menu: '개인 미니 화로 규카츠 정식 (130g)', desc: '겉바속촉 튀김옷과 부드러운 육즙의 대표 규카츠', coordinates: [35.6925, 139.7020], rating: 4.6, priceRange: '1,630~2,100엔' },
          { name: '우동 신 (うどん 慎)', menu: '갓 뽑아 탱글탱글한 자루우동 & 튀김 세트', desc: '오픈런 필수 도쿄 최고 수제 사누키 우동 성지', coordinates: [35.6865, 139.6975], rating: 4.7, priceRange: '1,100~1,600엔' },
          { name: '타츠노야 신주쿠 코타키바시', menu: '진한 곱창 츠케멘 (츠케멘 모츠)', desc: '직화 불맛 곱창이 들어간 신주쿠 1위 츠케멘', coordinates: [35.6962, 139.6980], rating: 4.5, priceRange: '950~1,250엔' },
          { name: '돈카츠 토키와 신주쿠', menu: '가성비 로스카츠 & 히레카츠 정식', desc: '현지인들이 애용하는 1,000엔 안팎의 푸짐한 돈카츠', coordinates: [35.6912, 139.7015], rating: 4.4, priceRange: '950~1,300엔' }
        ],
        address: 'Shinjuku, Tokyo',
        likes: 11,
        hasLiked: false
      },
      {
        id: 'spot-3-3',
        name: '시부야 스카이',
        japaneseName: 'SHIBUYA SKY',
        category: 'observatory',
        categoryLabel: '전망대',
        rating: 4.6,
        openStatus: 'Open',
        hours: 'Closes 10:30 PM',
        estimatedTime: '17:30 ~ 20:30',
        coordinates: [35.6580, 139.7016],
        summary: '오후 늦게 시부야로 내려와 일몰 시간대에 맞추어 전망대를 관람하세요. 도쿄에서 가장 트렌디한 야외 옥상 전망대입니다.',
        tips: [
          '신주쿠역에서 JR 야마노테선을 탑승하면 3정거장(약 7분) 만에 시부야역에 직통으로 연결됩니다.',
          '지상 229m 루프탑 스카이 엣지(Sky Edge) 모서리 포토존에서 시부야 스크램블 교차로를 배경으로 인생 사진을 남겨보세요.',
          '일몰 시간대(17:00~18:00) 티켓은 조기 매진되므로 사전 온라인 예약이 필수입니다.',
          '관람 후 지하 스크램블 스퀘어와 연결된 지하철 한조몬선을 타면 긴시초 숙소까지 환승 없이 편안하게 앉아서 복귀합니다.'
        ],
        recommendedFoods: [
          { name: '몬자야키 모헤지 (스크램블 스퀘어 12층)', menu: '명란 모짜렐라 치즈 몬자야키', desc: '도쿄 명물 몬자야키를 츠키지 직송 해산물 육수로 즐기는 명소', coordinates: [35.6585, 139.7020], rating: 4.6, priceRange: '1,400~1,900엔' },
          { name: '미도리 스시 시부야점 (마크시티 4층)', menu: '특선 스시 모둠 & 게살 샐러드', desc: '신선한 네타와 푸짐한 양으로 유명한 도쿄 최고의 가성비 스시', coordinates: [35.6580, 139.7000], rating: 4.5, priceRange: '1,800~2,800엔' },
          { name: '토리타케 총본점 시부야', menu: '대왕 야키토리 닭꼬치 모둠 & 야키토리동', desc: '시부야 랜드마크 노포 닭꼬치 구이 전문점', coordinates: [35.6582, 139.6985], rating: 4.4, priceRange: '1,200~1,800엔' },
          { name: '이치란 시부야 스페인자카점', menu: '천연 돈골 라멘 & 차슈 추가', desc: '시부야 스크램블 인근 독서실형 1인 돈코츠 라멘', coordinates: [35.6610, 139.6990], rating: 4.4, priceRange: '980~1,350엔' }
        ],
        address: '2 Chome-24-12 Shibuya, Shibuya City, Tokyo',
        likes: 27,
        hasLiked: true
      },
      {
        id: 'spot-3-4',
        name: '롯데시티호텔 긴시쵸 (숙소 복귀 & 휴식)',
        japaneseName: 'ロッテシティホテル錦糸町',
        category: 'hotel',
        categoryLabel: '숙소 복귀',
        rating: 4.5,
        openStatus: 'Open · 체크인 완료 / 휴식',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '21:15 ~ 23:00',
        coordinates: [35.6967, 139.8143],
        summary: '시부야 스카이 관람 후 시부야역 지하철 한조몬선(Z01)에서 환승 없이 한 번에 긴시초 숙소(Z13)로 편안하게 앉아서 직통 복귀합니다! 짐을 내려놓고 긴시초 로컬 골목의 명물 비장탄 숯불 야키토리 선술집에서 불향 가득한 닭꼬치와 꽁꽁 얼린 얼음잔 생맥주로 도쿄의 깊어가는 밤을 만끽하세요.',
        tips: [
          '시부야역 지하 3층 한조몬선 1번 승강장(오시아게 방면) 탑승 ➔ 환승 없이 11정거장(29분) 긴시초역 도착!',
          '시부야역은 노선의 기점 부근이어서 빈 자리가 많아 앉아서 숙소까지 이동할 수 있어 다리가 쉴 수 있습니다.',
          '🍺 [숙소 근처 밤맥주 선술집 1] 긴시초 텟펜(炭火串焼 てっぺん, 호텔 도보 3분): 비장탄 직화 숯불 야키토리 전문점! 꽁꽁 얼린 얼음잔에 쏟아지는 삿포로 블랙라벨 생맥주와 육즙 터지는 츠쿠네(노른자 딥핑 소스), 바삭한 닭날개 구이가 일품입니다.',
          '🍺 [숙소 근처 밤맥주 선술집 2] 스미비 야키토리 히나타(炭火焼き鳥 日向, 호텔 도보 2분): 북쪽출구 감성 골목 선술집. 아사히 수퍼드라이 생맥주와 칼칼한 국물의 1인 하카타 모츠나베(소곱창 전골), 수제 가라아게!'
        ],
        recommendedFoods: [
          { name: '긴시초 텟펜 (숯불 야키토리 선술집)', menu: '얼음잔 삿포로 생맥주 & 숯불 수제 츠쿠네(계란노른자)·꼬치 모둠', desc: '호텔 도보 3분! 비장탄 숯불 향과 얼음잔 생맥주가 환상적인 활기찬 로컬 이자카야', coordinates: [35.6959, 139.8150], rating: 4.7, priceRange: '2,000~3,200엔' },
          { name: '스미비 야키토리 히나타 (골목 선술집)', menu: '드라이 생맥주 & 1인 모츠나베(소곱창전골) & 닭날개 구이', desc: '호텔 도보 2분! 정갈한 숯불구이와 따끈한 모츠나베에 시원한 생맥주 한잔', coordinates: [35.6975, 139.8138], rating: 4.6, priceRange: '1,800~2,900엔' },
          { name: '야키토리 토리키조쿠 긴시초남쪽출구', menu: '모든 메뉴 균일가 야키토리 & 메가 하이볼', desc: '전 메뉴 균일 370엔대의 일본 국민 가성비 이자카야', coordinates: [35.6962, 139.8145], rating: 4.4, priceRange: '1,000~1,800엔' },
          { name: '세븐일레븐 긴시초점 (호텔 1층)', menu: '일본 편의점 생크림 롤케이크 & 푸딩 & 캔맥주', desc: '호텔 1층 엘리베이터 앞 24시간 간식', coordinates: [35.6967, 139.8143], rating: 4.5, priceRange: '250~500엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 18,
        hasLiked: false
      }
    ],
    transits: [
      {
        fromSpotId: 'spot-3-0',
        toSpotId: 'spot-3-1',
        method: 'subway',
        routeName: '도쿄메트로 한조몬선 ➔ 기요스미시라카와 환승 ➔ 도에이 오에도선 토시마엔역 (오전 08:40 도착)',
        durationMinutes: 48,
        fareJPY: 440,
        fareKRW: 4000,
        lineName: '도쿄메트로 한조몬선(Z) ➔ 도에이 오에도선(E)',
        lineColor: '#C92461',
        detailedRoute: '긴시초역 07:52발 (한조몬선 4분) ➔ 기요스미시라카와역 07:56착 환승통로 도보(3분) ➔ 도에이 오에도선 08:00발 (37분 직통) ➔ 토시마엔역(E36) 08:37착 ➔ A2번 출구 도보 2분 ➔ 08:40 워너브라더스 정문 광장 도착!',
        transitTip: '⏰ [오전 08:40 정각 도착 타임테이블]\n• 07:45 - 롯데시티호텔 긴시초 로비 집결 (호텔 지하 5번 출구 엘리베이터 이동)\n• 07:52 - 긴시초역(Z13) 승강장 출발 (도쿄메트로 한조몬선 시부야행, 4분)\n• 07:56 - 기요스미시라카와역(Z11/E15) 도착 및 도에이 오에도선 환승 (환승통로 3분)\n• 08:00 - 기요스미시라카와역(E15) 출발 (도에이 오에도선 료고쿠·이이다바시·토시마엔행, 37분 직통)\n• 08:37 - 토시마엔역(E36) 승강장 도착\n• 08:40 - A2번 출구로 나와 도보 2분 ➔ 워너 브라더스 스튜디오 정문 광장 도착 완료!\n\n💡 [꿀팁] 도쿄 서브웨이 티켓(24/48/72시간권) 소지 시 추가 요금 없이 0원에 전 구간 탑승 가능합니다!',
        passRecommendation: '도쿄 서브웨이 티켓 (0엔 무료) 또는 IC카드 435엔 (2인 870엔)',
        transferCount: 1,
        transitOptions: [
          {
            name: '지하철 직통 환승 (추천 1순위: 서브웨이 티켓 무료)',
            durationMinutes: 48,
            fareJPY: 440,
            transferCount: 1,
            description: '한조몬선(4분) ➔ 기요스미시라카와 환승 ➔ 도에이 오에도선(37분) 직통! 도쿄 서브웨이 티켓 소지 시 0원 무료 탑승이 가능하며 배차 간격이 4~5분으로 정확합니다.',
            tag: '★ 강력 추천 (서브웨이 티켓 무료)'
          },
          {
            name: 'JR 소부선 각역정차 ➔ 요요기역 환승 ➔ 도에이 오에도선',
            durationMinutes: 46,
            fareJPY: 410,
            transferCount: 1,
            description: '긴시초역 07:50발 (JR 소부선 20분) ➔ 요요기역(08:10착) 환승 ➔ 도에이 오에도선(08:15발, 19분) ➔ 토시마엔역 08:34착. JR 패스 소지자에게 유리한 루트입니다.',
            tag: 'JR 패스 유리'
          },
          {
            name: 'JR 소부선 ➔ 신주쿠역 환승 ➔ 세이부 신주쿠선 급행',
            durationMinutes: 52,
            fareJPY: 450,
            transferCount: 2,
            description: '긴시초 ➔ 신주쿠역 이동 후 세이부선으로 갈아타는 루트. 신주쿠역 환승 거리가 다소 길어 짐이 있을 경우 1순위 지하철 루트를 추천합니다.',
            tag: '대체 노선'
          }
        ]
      },
      {
        fromSpotId: 'spot-3-1',
        toSpotId: 'spot-3-2',
        method: 'subway',
        routeName: '도에이 오에도선 (E36 토시마엔역 ➔ E27 신주쿠역 직통)',
        durationMinutes: 20,
        fareJPY: 280,
        fareKRW: 2550,
        lineName: '도에이 오에도선 (E)',
        lineColor: '#C92461',
        detailedRoute: '토시마엔역 1번 승강장 ➔ 9정거장 직통 ➔ 신주쿠역 하차 (도에이선 출구)',
        transitTip: '환승 없이 한 번에 신주쿠로 이동! (도쿄 서브웨이 티켓 가능 / IC카드 272엔)',
        passRecommendation: '도쿄 서브웨이 티켓 / IC카드',
        transferCount: 0
      },
      {
        fromSpotId: 'spot-3-2',
        toSpotId: 'spot-3-3',
        method: 'train',
        routeName: 'JR 야마노테선 (JY17 신주쿠역 ➔ JY20 시부야역 3정거장)',
        durationMinutes: 7,
        fareJPY: 170,
        fareKRW: 1550,
        lineName: 'JR 야마노테선 (JY)',
        lineColor: '#9ACD32',
        detailedRoute: '신주쿠역 14번 승강장 야마노테선 외선순환 ➔ 3정거장 ➔ 시부야역 스크램블 출구',
        transitTip: '배차 간격 2~3분! 3정거장(7분) 만에 시부야역 직통 도착',
        passRecommendation: 'Suica/Pasmo IC카드 태그 (167엔)',
        transferCount: 0
      },
      {
        fromSpotId: 'spot-3-3',
        toSpotId: 'spot-3-4',
        method: 'subway',
        routeName: '도쿄메트로 한조몬선 (Z01 시부야역 ➔ Z13 긴시초역 직통)',
        durationMinutes: 29,
        fareJPY: 260,
        fareKRW: 2360,
        lineName: '도쿄메트로 한조몬선 (Z)',
        lineColor: '#8F76D6',
        detailedRoute: '시부야 스크램블 지하 ➔ 한조몬선 1번홈 ➔ 11정거장 직통 ➔ 긴시초역 5번 출구 호텔 연결',
        transitTip: '🏨 [숙소 복귀] 시부야역에서 환승 0회 직통 29분! 시부야가 출발 기점에 가까워 편안하게 앉아서 올 수 있는 최고의 대중교통 노선입니다.',
        passRecommendation: '도쿄 서브웨이 티켓 유효 / IC카드 252엔',
        transferCount: 0,
        isReturnToHotel: true
      }
    ]
  },
  {
    dayNumber: 4,
    date: '1월 16일',
    fullDate: '2027-01-16 (토)',
    theme: '후지산 1일 투어 및 도쿄역 야경',
    description: '눈 덮인 후지산 절경 투어를 마치고, 도쿄의 역사적 중심지 도쿄역 마루노우치 야경 감상 후 소부선 쾌속으로 긴시초 숙소 복귀',
    spots: [
      {
        id: 'spot-4-1',
        name: '후지산 투어 (가와구치코 & 오시노핫카이)',
        japaneseName: '富士山日帰りツアー (河口湖)',
        category: 'nature',
        categoryLabel: '관광 명소',
        rating: 4.8,
        openStatus: 'Open',
        hours: '08:00 ~ 17:30 (투어 전일)',
        estimatedTime: '08:00 ~ 17:30',
        coordinates: [35.5050, 138.7600],
        summary: '도쿄 도심을 벗어나 일본의 상징 후지산 파노라마 뷰와 가와구치코 호수를 둘러보는 1일 버스 투어입니다.',
        tips: [
          '도쿄역 또는 신주쿠역 지정 승차장에서 오전 8시경 투어 버스 탑승.',
          '아라쿠라야마 센겐공원의 오층탑과 후지산이 겹치는 상징적 뷰포인트, 오시노핫카이 전통 용천수 마을 관람.',
          '겨울철(1월) 맑은 날씨에는 만년설이 덮인 선명하고 웅장한 후지산을 볼 확률이 가장 높습니다.'
        ],
        recommendedFoods: [
          { name: '호우토우 후도 (ほうとう不動)', menu: '야마나시 명물 된장 칼국수 호우토우', desc: '뜨끈한 호박과 야채가 듬뿍 들어간 뚝배기 토속 칼국수', coordinates: [35.5030, 138.7610], rating: 4.5, priceRange: '1,200~1,500엔' },
          { name: '후지산 레이크 베이크', menu: '수제 갓 구운 효모빵 & 호숫가 커피', desc: '가와구치코 호수를 바라보는 따뜻한 베이커리 카페', coordinates: [35.5220, 138.7650], rating: 4.6, priceRange: '500~900엔' },
          { name: '오시노핫카이 두부 & 당고', menu: '후지산 명천수 손두부 & 쑥 당고 꼬치', desc: '만년설 용천수로 만든 고소한 전통 길거리 간식', coordinates: [35.4590, 138.8320], rating: 4.5, priceRange: '200~450엔' },
          { name: '후지산 푸딩 본점', menu: '파란빛 후지산 소다 & 우유 푸딩', desc: '후지산 모양을 본뜬 인기 로컬 기념 디저트', coordinates: [35.5050, 138.7600], rating: 4.4, priceRange: '400~550엔' }
        ],
        address: 'Kawaguchiko, Minamitsuru District, Yamanashi',
        likes: 22,
        hasLiked: true
      },
      {
        id: 'spot-4-2',
        name: '도쿄역 마루노우치 역사',
        japaneseName: '東京駅 (Tokyo Station)',
        category: 'station',
        categoryLabel: '대중교통 이용장소',
        rating: 4.3,
        openStatus: 'Open',
        hours: '상시 개방 (KITTE 및 상점 11:00 ~ 21:00)',
        estimatedTime: '17:30 ~ 21:00',
        coordinates: [35.6812, 139.7671],
        summary: '오후 5시 반경 투어 버스에서 하차한 뒤 도쿄역 근처에서 저녁 일정을 보냅니다. 마루노우치 붉은 벽돌 역사의 클래식한 야경을 구경하기에 최적입니다.',
        tips: [
          '투어 버스 하차 후 마루노우치 중앙 광장에서 붉은 벽돌 르네상스 양식의 도쿄역사 외관과 조명을 감상하세요.',
          '도쿄역 바로 맞은편 KITTE(킷테) 쇼핑몰 6층 옥상정원(무료)에 올라가면 도쿄역 전체가 내려다보이는 야경 명당입니다.',
          '식사 후 지하 도쿄역 1번가 캐릭터 스트리트(지브리, 포켓몬, 짱구 샵)에서 기념품 쇼핑을 즐기세요.'
        ],
        recommendedFoods: [
          { name: '네무로 하나마루 (KITTE 5층)', menu: '홋카이도 직송 프리미엄 회전초밥', desc: '도쿄역 최고 인기 초밥집 (웨이팅 어플 대기 추천)', coordinates: [35.6798, 139.7648], rating: 4.6, priceRange: '1,800~2,800엔' },
          { name: '도쿄 라멘 스트리트 (지하 1층)', menu: '로쿠린샤 농후 츠케멘 & 반숙란', desc: '뜨끈한 국물이 당길 때 도쿄 최고 라멘 격전지', coordinates: [35.6812, 139.7675], rating: 4.5, priceRange: '950~1,300엔' },
          { name: '카츠레츠 마토이 도쿄역점', menu: '두툼한 히레카츠 정식 (가성비 일품)', desc: '지하 상가 현지 직장인들이 찾는 갓 튀긴 돈카츠', coordinates: [35.6805, 139.7668], rating: 4.4, priceRange: '1,100~1,500엔' },
          { name: '도쿄역 에키벤야 마츠리 (1층)', menu: '전국 200여 종 명품 특산 에키벤 도시락', desc: '신선한 해산물/소고기 도시락 테이크아웃 명소', coordinates: [35.6812, 139.7671], rating: 4.6, priceRange: '1,100~1,600엔' }
        ],
        address: '1 Chome Marunouchi, Chiyoda City, Tokyo',
        likes: 16,
        hasLiked: false
      },
      {
        id: 'spot-4-3',
        name: '롯데시티호텔 긴시쵸 (숙소 복귀 & 휴식)',
        japaneseName: 'ロッテシティホテル錦糸町',
        category: 'hotel',
        categoryLabel: '숙소 복귀',
        rating: 4.5,
        openStatus: 'Open · 체크인 완료 / 휴식',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '21:20 ~ 23:00',
        coordinates: [35.6967, 139.8143],
        summary: '도쿄역 마루노우치 야경과 캐릭터 스트리트 쇼핑 후 지하 승강장에서 소부선 쾌속을 타면 단 8분(1정거장) 만에 긴시초 숙소로 직통 복귀합니다. 후지산 1일 투어의 여운을 곱씹으며, 숙소 근처 신선한 해산물 선술집이나 바삭한 수제 교자 주점에서 시원한 프리미엄 생맥주를 들이켜보세요.',
        tips: [
          '도쿄역 지하 5층 소부·요코스카선 승강장(3·4번 홈)에서 치바/나리타 방면 쾌속 전철 탑승 ➔ 단 8분(1정거장) 만에 긴시초역 도착!',
          '환승 0회 직통 8분으로 도쿄역에서 가장 빠르게 복귀할 수 있는 최고의 노선입니다.',
          '🍺 [숙소 근처 밤맥주 선술집 1] 우마이몬야 카라쿠 긴시초(호텔 도보 2분): 매일 아침 도요스/츠키지에서 들여오는 제철 모둠 사시미와 뜨끈한 바지락 버터 술찜! 목 넘김이 부드럽고 시원한 프리미엄 에비스 생맥주와 사케 페어링이 환상적입니다.',
          '🍺 [숙소 근처 밤맥주 선술집 2] 대중주점 텟짱 긴시초점(호텔 도보 1분): 살얼음 삿포로 생맥주 400엔대! 진하고 고소한 소힘줄 미소 조림과 바삭한 가라아게에 맥주가 무한대로 들어가는 로컬 대중 선술집.'
        ],
        recommendedFoods: [
          { name: '우마이몬야 카라쿠 (해산물 선술집)', menu: '제철 모둠 사시미 5종 & 바지락 버터 술찜 & 에비스 생맥주', desc: '호텔 도보 2분! 신선한 해산물 요리와 시원한 프리미엄 생맥주의 조화', coordinates: [35.6964, 139.8149], rating: 4.6, priceRange: '2,200~3,500엔' },
          { name: '대중주점 텟짱 긴시초점 (가성비 선술집)', menu: '살얼음 삿포로 생맥주 조끼 & 규스지 니코미 & 햄카츠', desc: '호텔 도보 1분! 현지 직장인들이 애정하는 가성비 최고의 레트로 밤맥주 주점', coordinates: [35.6965, 139.8140], rating: 4.6, priceRange: '1,400~2,200엔' },
          { name: '긴시초 멘야 이치토 (스미다구)', menu: '특제 농후 어패류 츠케멘 & 캔맥주', desc: '일본 타베로그 라멘 부문 도쿄 최상위 랭킹 노포', coordinates: [35.7005, 139.8170], rating: 4.7, priceRange: '1,000~1,400엔' },
          { name: '교자보 긴시초남쪽출구', menu: '바삭한 한입 야키교자 & 차가운 생맥주', desc: '야식으로 딱 좋은 가성비 수제 만두', coordinates: [35.6961, 139.8139], rating: 4.4, priceRange: '450~850엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 17,
        hasLiked: false
      }
    ],
    transits: [
      {
        fromSpotId: 'spot-4-1',
        toSpotId: 'spot-4-2',
        method: 'bus',
        routeName: '후지산 전용 투어 버스 (추오 자동차도로 ➔ 도쿄역 마루노우치 남쪽 출구)',
        durationMinutes: 105,
        fareJPY: 0,
        fareKRW: 0,
        lineName: '후지산 1일 데이투어 전용 버스',
        lineColor: '#00A86B',
        detailedRoute: '가와구치코 호수 ➔ 추오 고속도로 ➔ 도쿄역 마루노우치 하차장',
        transitTip: '투어 요금에 왕복 교통비가 포함되어 있습니다. 차창 밖 석양을 감상하며 편안하게 이동하세요.',
        passRecommendation: '투어 바우처 탑승 (추가 요금 0엔)',
        transferCount: 0
      },
      {
        fromSpotId: 'spot-4-2',
        toSpotId: 'spot-4-3',
        method: 'train',
        routeName: 'JR 소부선 쾌속 (JO19 도쿄역 ➔ JO22 긴시초역 직통 1정거장)',
        durationMinutes: 8,
        fareJPY: 170,
        fareKRW: 1550,
        lineName: 'JR 소부선 쾌속 (JO)',
        lineColor: '#007AC9',
        detailedRoute: '도쿄역 지하 5층 3·4번 승강장 ➔ 1정거장 쾌속 직통 ➔ 긴시초역 5번 출구 호텔 연결',
        transitTip: '🏨 [숙소 복귀] 환승 0회! 8분 만에 도쿄역에서 긴시초 숙소 직통 도착! 긴시초역 5번 출구 호텔 지하 직결',
        passRecommendation: 'Suica/Pasmo IC카드 태그 (167엔)',
        transferCount: 0,
        isReturnToHotel: true
      }
    ]
  },
  {
    dayNumber: 5,
    date: '1월 17일',
    fullDate: '2027-01-17 (일)',
    theme: '추천 코스 (도쿄 클래식 코스)',
    description: '쓰키지 수산시장, 오모테산도, 롯폰기 힐스 모리타워 야경 후 지하철로 긴시초 숙소로 복귀하여 마지막 날 짐정리',
    spots: [
      {
        id: 'spot-5-0',
        name: '롯데시티호텔 긴시쵸 (숙소 출발 - 쓰키지 장외시장 이동)',
        japaneseName: 'ロッテシティホテル錦糸町 (出発)',
        category: 'hotel',
        categoryLabel: '숙소 출발',
        rating: 4.5,
        openStatus: '오전 08:25 로비 집결 / 08:31 출발',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '08:25 ~ 08:31 (호텔 출발)',
        coordinates: [35.6967, 139.8143],
        summary: '쓰키지 장외시장 오전 09:00 정각 도착을 위해 아침 08:25 호텔 로비에 집결하여 출발합니다. 긴시초역 5번 출구 전용 엘리베이터를 통해 한조몬선 지하철 승강장으로 직결 이동합니다.',
        tips: [
          '⏰ 오전 09:00 도착 타임테이블:\n• 08:25 - 호텔 로비 집결 (지하 5번 출구 엘리베이터 이동)\n• 08:31 - 긴시초역(Z13) 한조몬선 시부야 방면 탑승 (4분)\n• 08:35 - 기요스미시라카와역(Z11/E15) 환승통로 이동 (3분)\n• 08:39 - 도에이 오에도선 다이몬·롯폰기 방면 직통 탑승 (8분)\n• 08:47 - 쓰키시조역(E18) 도착 후 A1번 출구 도보 3분\n• 08:50~09:00 - 쓰키지 장외시장 정문 도착 완료!',
          '도쿄 서브웨이 티켓(24/48/72시간권) 소지 시 추가 요금 없이 0원에 전 구간 탑승 가능합니다!',
          '오전 9시 도착 시 키츠네야(호르몬동)와 마루타케(150엔 계란말이) 등 최고 인기 명소의 대기 시간을 최소화하고 신선한 아침 식사를 즐길 수 있습니다.'
        ],
        recommendedFoods: [
          { name: '호텔 1층 세븐일레븐', menu: '모닝 드립 커피 & 이로하스 천연수 복숭아맛', desc: '출발 전 가볍게 마시는 필수 수분 보충', coordinates: [35.6967, 139.8143], rating: 4.5, priceRange: '130~300엔' },
          { name: '긴시초 하치텐 킷사텐', menu: '모닝 사이폰 커피 & 버터 토스트', desc: '호텔 앞 레트로 카페 모닝 커피', coordinates: [35.6970, 139.8138], rating: 4.5, priceRange: '500~750엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 18,
        hasLiked: false
      },
      {
        id: 'spot-5-1',
        name: '쓰키지 장외시장',
        japaneseName: '築地場外市場',
        category: 'market',
        categoryLabel: '도매업체 / 전통시장',
        rating: 4.2,
        openStatus: '오전 09:00 도착 / 06:00 ~ 14:00 (오전 추천)',
        hours: '06:00 ~ 14:00 (오전 9시 방문 추천)',
        estimatedTime: '09:00 ~ 11:30',
        coordinates: [35.6655, 139.7708],
        summary: '도쿄의 활기찬 아침을 여는 대표 수산시장. 숙소에서 지하철로 24분 만에 오전 9시 도착하여 갓 구운 달콤한 계란말이, 참치 카이센동, 진한 호르몬동 등 길거리 해산물 미식을 즐깁니다.',
        tips: [
          '⏰ 오전 09:00 도착으로 키츠네야(호르몬동)와 야마초/마루타케(계란말이) 긴 대기줄을 피해 쾌적하게 식사하세요.',
          '가게들이 일찍 문을 열고 오후 2시면 닫기 시작하므로 아침 9시 전후 방문이 가장 좋습니다.',
          '야마초 또는 마루타케의 달콤하고 따뜻한 즉석 계란말이(다마고야키)를 꼭 맛보세요.',
          '골목 안쪽 가리비 구이, 참치 꼬치, 와규 꼬치 등 즉석 스트리트 푸드를 즐길 수 있습니다.'
        ],
        recommendedFoods: [
          { name: '스시잔마이 본점 (24시간 영업)', menu: '참치 대뱃살 & 모둠 카이센동', desc: '쓰키지 장외시장의 터줏대감 24시간 가성비 스시 명가', coordinates: [35.6655, 139.7710], rating: 4.5, priceRange: '1,500~2,400엔' },
          { name: '키츠네야 (きつねや)', menu: '진한 소내장 덮밥 (호르몬동) & 온천달걀', desc: '70년 전통 대형 가마솥에서 푹 끓여낸 중독적인 소내장 덮밥', coordinates: [35.6658, 139.7702], rating: 4.5, priceRange: '850~1,000엔' },
          { name: '마루타케 계란말이 본점', menu: '150엔 갓 구워낸 따끈달콤 달걀말이', desc: '쓰키지 시장의 상징! 촉촉하고 달콤한 원조 다마고야키', coordinates: [35.6653, 139.7705], rating: 4.4, priceRange: '150~300엔' },
          { name: '쓰키지 스시세이 본점', menu: '모둠 런치 스시 정식 (10피스)', desc: '130년 전통의 품격 있는 정통 에도마에 초밥을 가성비 런치로', coordinates: [35.6652, 139.7709], rating: 4.6, priceRange: '1,800~2,600엔' }
        ],
        address: '4 Chome-16-2 Tsukiji, Chuo City, Tokyo',
        likes: 19,
        hasLiked: true
      },
      {
        id: 'spot-5-2',
        name: '긴자 & 오모테산도 거리',
        japaneseName: '銀座 & 表参道',
        category: 'shopping',
        categoryLabel: '쇼핑 / 도심거리',
        rating: 4.5,
        openStatus: 'Open',
        hours: '11:00 ~ 20:00',
        estimatedTime: '12:00 ~ 16:30',
        coordinates: [35.6719, 139.7640],
        summary: '쓰키지에서 도보로 긴자로 이동하여 긴자 식스 및 명품 거리, 센트럴 도쿄의 세련된 쇼핑과 카페를 둘러봅니다.',
        tips: [
          '쓰키지 장외시장에서 긴자 4초메 교차로(와코 시계탑)까지 도보로 10~15분이면 갈 수 있습니다.',
          '긴자 식스(GINZA SIX) 옥상 가든에서 휴식을 취하고, 츠타야 서점 아트북 갤러리를 관람하세요.',
          '이후 긴자선/한조몬선을 타고 오모테산도로 이동하여 건축미가 돋보이는 가로수길 부티크 거리를 산책하세요.'
        ],
        recommendedFoods: [
          { name: '긴자 카가리 본점 (篝)', menu: '진한 닭백탕(토리파이탄) 라멘', desc: '미슐랭 가이드에 등재된 크림스프처럼 진하고 녹진한 닭육수 라멘', coordinates: [35.6705, 139.7635], rating: 4.6, priceRange: '1,300~1,700엔' },
          { name: '긴자 렌가테이 (煉瓦亭)', menu: '1895년 창업 원조 포크 카츠레츠 & 오므라이스', desc: '일본 경양식의 발상지로 꼽히는 역사적인 노포 양식당', coordinates: [35.6720, 139.7660], rating: 4.4, priceRange: '1,600~2,400엔' },
          { name: '카페 드 랑브르 (Café de L\'Ambre)', menu: '올드 빈티지 융드립 커피 & 호박의 여왕', desc: '커피 애호가들의 도쿄 성지! 1948년 창업 빈티지 커피 노포', coordinates: [35.6690, 139.7620], rating: 4.6, priceRange: '800~1,200엔' },
          { name: '오모테산도 넘버슈가', menu: '수제 생캐러멜 12종 넘버링 박스', desc: '천연 재료로 매일 만드는 오모테산도 대표 선물 디저트', coordinates: [35.6670, 139.7080], rating: 4.5, priceRange: '150~1,500엔' }
        ],
        address: 'Ginza, Chuo City, Tokyo',
        likes: 14,
        hasLiked: false
      },
      {
        id: 'spot-5-3',
        name: '롯폰기 힐스 & 모리타워',
        japaneseName: '六本木ヒルズ 森タワー',
        category: 'observatory',
        categoryLabel: '복합문화공간 / 야경',
        rating: 4.2,
        openStatus: 'Open',
        hours: 'Closes 11:00 PM',
        estimatedTime: '17:30 ~ 21:00',
        coordinates: [35.6605, 139.7292],
        summary: '해가 질 무렵 롯폰기로 이동하는 코스입니다. 롯폰기 힐스는 세련된 도심 야경(특히 도쿄타워 뷰)을 감상하기에 최고의 명소 중 하나입니다.',
        tips: [
          '모리 타워 52층 도쿄 시티뷰 전망대에서 주황빛으로 빛나는 도쿄 타워를 가장 이상적인 각도에서 조망할 수 있습니다.',
          '66플라자에 설치된 루이스 부르주아의 거대한 거미 조형물 마망(Maman) 앞에서 인증샷을 남기세요.',
          '모리 타워 근처에서 츠루톤탄(세숫대야 우동)이나 이마카츠(돈카츠) 등 분위기 있는 식사로 도쿄의 마지막 밤을 장식해 보세요.'
        ],
        recommendedFoods: [
          { name: '츠루톤탄 롯폰기점', menu: '세숫대야 명란 크림 우동 & 스키야키 우동', desc: '거대한 그릇에 나오는 퓨전 프리미엄 우동 (새벽까지 영업)', coordinates: [35.6625, 139.7315], rating: 4.5, priceRange: '1,380~1,850엔' },
          { name: '이마카츠 롯폰기 본점 (イマカツ)', menu: '사르르 녹는 사사미카츠(닭안심 카츠)', desc: '미슐랭 빕구르망 등재! 극상의 부드러움을 자랑하는 돈카츠', coordinates: [35.6630, 139.7310], rating: 4.6, priceRange: '1,500~2,200엔' },
          { name: '롯폰기 멘야 무사시 코쇼', menu: '직화 두툼한 차슈 츠케멘', desc: '롯폰기 직장인들이 열광하는 푸짐한 불맛 차슈 츠케멘', coordinates: [35.6640, 139.7325], rating: 4.4, priceRange: '1,000~1,350엔' },
          { name: '하브스(HARBS) 롯폰기 힐스점', menu: '생과일 밀크 크레이프 케이크 & 홍차', desc: '신선한 과일과 생크림이 겹겹이 쌓인 최고 인기 디저트', coordinates: [35.6608, 139.7295], rating: 4.5, priceRange: '900~1,500엔' }
        ],
        address: '6 Chome-10-1 Roppongi, Minato City, Tokyo',
        likes: 25,
        hasLiked: true
      },
      {
        id: 'spot-5-4',
        name: '롯데시티호텔 긴시쵸 (숙소 복귀 & 최종 짐정리)',
        japaneseName: 'ロッテシティホテル錦糸町',
        category: 'hotel',
        categoryLabel: '숙소 복귀',
        rating: 4.5,
        openStatus: 'Open · 체크인 완료 / 휴식',
        hours: '24시간 상시 운영 (긴시초역 5번 출구 직결)',
        estimatedTime: '21:35 ~ 23:30',
        coordinates: [35.6967, 139.8143],
        summary: '모리타워 전망대에서 낭만적인 도쿄타워 야경을 감상하고 긴시초 숙소로 복귀합니다. 5박 6일 일본 여행의 마지막 밤, 친구들과 짐을 정리한 뒤 호텔 앞 선술집으로 내려가 시원한 메가 생맥주 잔을 맞부딪치며 여행의 하이라이트를 이야기하고 N빵 정산 뒤풀이를 즐기세요!',
        tips: [
          '롯폰기역에서 도에이 오에도선 탑승 ➔ 기요스미시라카와역에서 한조몬선 1회 환승(단 2정거장) ➔ 긴시초역 도착 (약 28분 소요).',
          '긴시초역 5번 출구 호텔 지하 직결로 늦은 밤에도 안전하게 도착합니다.',
          '🍺 [숙소 근처 마지막 밤 맥주 선술집 1] 토리키조쿠 긴시초남쪽출구점(호텔 도보 2분): 마지막 밤 부담 없이 마음껏 먹고 마실 수 있는 전 메뉴 370엔 균일가! 700ml 메가 생맥주와 대형 치즈 츠쿠네, 양배추 무한리필로 5박 6일 원정대 총결산 축배!',
          '🍺 [숙소 근처 마지막 밤 맥주 선술집 2] 하카타 게키죠 긴시초점(호텔 도보 2분): 새벽 1시까지 운영하는 에너지 넘치는 선술집. 지글지글 뜨거운 철판 교자와 1리터 얼음장 메가 조끼 생맥주로 도쿄 마지막 밤의 아쉬움을 화끈하게 날려버리세요.'
        ],
        recommendedFoods: [
          { name: '토리키조쿠 긴시초남쪽출구 (총결산 뒤풀이)', menu: '700ml 메가 생맥주 & 메가 하이볼 & 숯불 타레 닭꼬치', desc: '호텔 도보 2분! 전 메뉴 370엔으로 마지막 밤 원 없이 마시는 가성비 최강 선술집', coordinates: [35.6962, 139.8145], rating: 4.5, priceRange: '1,500~2,500엔 (부담 없는 N빵)' },
          { name: '하카타 게키죠 긴시초점 (심야 메가 생맥주)', menu: '1리터 얼음장 메가 생맥주 & 철판 한입 교자 & 명란 계란탕', desc: '호텔 도보 2분! 새벽까지 시끌벅적 축제 분위기로 마지막 밤을 불태우는 심야 이자카야', coordinates: [35.6963, 139.8148], rating: 4.6, priceRange: '1,800~2,800엔' },
          { name: '긴시초 타이요노 토마토멘', menu: '치즈 토마토 라멘 (해장 이색 라멘)', desc: '술 마신 뒤 개운하게 속을 풀어주는 산뜻한 토마토 치즈 국물', coordinates: [35.6963, 139.8142], rating: 4.4, priceRange: '880~1,100엔' },
          { name: '세븐일레븐 긴시초점 (호텔 1층)', menu: '마지막 밤 프리미엄 에비스 맥주 & 로컬 안주', desc: '호텔 로비 직결 편의점에서 부담 없이 즐기는 마지막 밤 축배', coordinates: [35.6967, 139.8143], rating: 4.5, priceRange: '300~700엔' }
        ],
        address: 'Tokyo, Sumida City, Kotobashi, 4 Chome−6−1',
        likes: 22,
        hasLiked: false
      }
    ],
    transits: [
      {
        fromSpotId: 'spot-5-0',
        toSpotId: 'spot-5-1',
        method: 'subway',
        routeName: '한조몬선 ➔ 기요스미시라카와 환승 ➔ 오에도선 쓰키시조역 (오전 09:00 도착)',
        durationMinutes: 24,
        fareJPY: 290,
        fareKRW: 2640,
        lineName: '도쿄메트로 한조몬선(Z) ➔ 도에이 오에도선(E)',
        lineColor: '#C92461',
        detailedRoute: '긴시초역 08:31발 (한조몬선 4분) ➔ 기요스미시라카와역 08:35착 환승(3분) ➔ 도에이 오에도선 08:39발 (8분) ➔ 쓰키시조역(E18) 08:47착 ➔ A1번 출구 도보 3분 ➔ 08:50~09:00 쓰키지 장외시장 도착!',
        transitTip: '⏰ [오전 09:00 정각 도착 타임테이블]\n• 08:25 - 롯데시티호텔 긴시초 로비 집결 (호텔 지하 5번 출구 엘리베이터 이동)\n• 08:31 - 긴시초역(Z13) 승강장 출발 (도쿄메트로 한조몬선 시부야행, 4분)\n• 08:35 - 기요스미시라카와역(Z11/E15) 도착 및 도에이 오에도선 환승 (지하 환승통로 3분)\n• 08:39 - 기요스미시라카와역(E15) 출발 (도에이 오에도선 다이몬·롯폰기 방면, 8분)\n• 08:47 - 쓰키시조역(E18, 築地市場駅) 승강장 도착\n• 08:50 - A1번 출구 도보 3분 ➔ 08:50~09:00 쓰키지 장외시장 정문 도착 완료!\n\n💡 [꿀팁] 도쿄 서브웨이 티켓(24/48/72시간권) 소지 시 추가 요금 없이 0원에 전 구간 탑승 가능합니다!',
        passRecommendation: '도쿄 서브웨이 티켓 (0엔 무료) 또는 IC카드 283엔 (2인 566엔)',
        transferCount: 1,
        transitOptions: [
          {
            name: '지하철 직통 환승 (추천 1순위: 서브웨이 티켓 무료)',
            durationMinutes: 24,
            fareJPY: 290,
            transferCount: 1,
            description: '한조몬선(4분) ➔ 기요스미시라카와 환승(3분) ➔ 도에이 오에도선(8분) ➔ 쓰키시조역 A1 출구 도보 3분! 서브웨이 티켓으로 0원 무료이며 환승 동선이 매우 짧습니다.',
            tag: '★ 강력 추천 (서브웨이 티켓 무료)'
          },
          {
            name: 'JR 소부선 ➔ 아사쿠사바시 환승 ➔ 도에이 아사쿠사선 히가시긴자역',
            durationMinutes: 25,
            fareJPY: 320,
            transferCount: 1,
            description: '긴시초역 JR 소부선 각역정차 ➔ 아사쿠사바시역 환승 ➔ 도에이 아사쿠사선 히가시긴자역(6번 출구 도보 5분). JR 구간 요금(150엔)이 별도 발생합니다.',
            tag: 'JR + 지하철 루트'
          },
          {
            name: '도쿄메트로 한조몬선 ➔ 미쓰코시마에 환승 ➔ 긴자선/히비야선 쓰키지역',
            durationMinutes: 28,
            fareJPY: 210,
            transferCount: 1,
            description: '긴시초역 ➔ 미쓰코시마에 환승 ➔ 긴자역 ➔ 쓰키지역 1번 출구 도보 4분. 메트로 전용 노선 이용 시 추천합니다.',
            tag: '도쿄메트로 단일 환승'
          }
        ]
      },
      {
        fromSpotId: 'spot-5-1',
        toSpotId: 'spot-5-2',
        method: 'walk',
        routeName: '쓰키지 장외시장 ➔ 하루미도리 대로변 도보 산책',
        durationMinutes: 12,
        fareJPY: 0,
        fareKRW: 0,
        lineName: '도보 이동',
        lineColor: '#10B981',
        detailedRoute: '쓰키지 시장 ➔ 하루미도리 대로변 직진 ➔ 가부키자 극장 ➔ 긴자 4초메 교차로',
        transitTip: '평지 대로변을 따라 가부키자 극장을 지나 긴자 중심부로 걸어갑니다. (도보 12분, 0엔)',
        passRecommendation: '도보 산책 (0엔)',
        transferCount: 0
      },
      {
        fromSpotId: 'spot-5-2',
        toSpotId: 'spot-5-3',
        method: 'subway',
        routeName: '도쿄메트로 히비야선 (H09 긴자역 ➔ H04 롯폰기역 직통)',
        durationMinutes: 9,
        fareJPY: 180,
        fareKRW: 1640,
        lineName: '도쿄메트로 히비야선 (H)',
        lineColor: '#9C9E9F',
        detailedRoute: '긴자역 5번 승강장 ➔ 4정거장 직통 ➔ 롯폰기역 1C 출구 모리타워 직결 통로',
        transitTip: '히비야선 탑승 후 롯폰기역 1C 출구로 나오면 모리타워와 바로 연결됩니다.',
        passRecommendation: '도쿄 서브웨이 티켓 / IC카드 178엔',
        transferCount: 0
      },
      {
        fromSpotId: 'spot-5-3',
        toSpotId: 'spot-5-4',
        method: 'subway',
        routeName: '도에이 오에도선 ➔ 기요스미시라카와 환승 ➔ 한조몬선 긴시초역',
        durationMinutes: 28,
        fareJPY: 290,
        fareKRW: 2640,
        lineName: '도에이 오에도선 (E) ➔ 도쿄메트로 한조몬선 (Z)',
        lineColor: '#C92461',
        detailedRoute: 'E23 롯폰기역 탑승 ➔ E15 기요스미시라카와역 환승 ➔ Z13 긴시초역 5번 출구 호텔 연결',
        transitTip: '🏨 [숙소 복귀] 롯폰기역에서 오에도선 탑승 후 기요스미시라카와역에서 한조몬선으로 1회 환승(단 2정거장) ➔ 긴시초역 5번 출구 호텔 도착!',
        passRecommendation: '도쿄 서브웨이 티켓 / IC카드 283엔',
        transferCount: 1,
        isReturnToHotel: true
      }
    ]
  },
  {
    dayNumber: 6,
    date: '1월 18일',
    fullDate: '2027-01-18 (월)',
    theme: '귀국일 (공항 이동 및 면세 쇼핑)',
    description: '긴시초 숙소 체크아웃 후 나리타 공항으로 소부선 쾌속 직통 이동하여 귀국 준비',
    spots: [
      {
        id: 'spot-6-1',
        name: '긴시초 조식 & 체크아웃',
        japaneseName: '錦糸町 朝食 & チェックアウト',
        category: 'hotel',
        categoryLabel: '조식 / 체크아웃',
        rating: 4.1,
        openStatus: 'Open',
        hours: '오전 08:30 ~ 11:00',
        estimatedTime: '08:30 ~ 11:00',
        coordinates: [35.6967, 139.8143],
        summary: '호텔 체크아웃 후 긴시초 숙소 주변 식당에서 가벼운 일본식 가정식으로 아침 식사를 권해 드립니다.',
        tips: [
          '긴시초 숙소 주변 식당(마츠야, 요시노야, 또는 베이커리)에서 따뜻한 연어구이 정식, 규동, 미소시루로 든든하게 아침을 시작하세요.',
          '호텔 프론트에서 최종 체크아웃을 진행하고 수하물 무게를 사전 측정해 보세요.',
          '비행기 출발 3시간 전 공항 도착을 목표로 소부선 쾌속 시간표를 미리 확인하세요.'
        ],
        recommendedFoods: [
          { name: '호텔 1층 코알라노마치 조식', menu: '롯데 코알라 마스코트 팬케이크 모닝 세트', desc: '체크아웃 전 호텔 1층에서 즐기는 귀여운 시그니처 조식', coordinates: [35.6967, 139.8143], rating: 4.5, priceRange: '800~1,200엔' },
          { name: '오토야 긴시초남쪽출구점', menu: '구운 숯불 연어구이 정식 & 영양 오곡밥', desc: '정갈하고 영양 만점인 일본식 건강 백반 전문점', coordinates: [35.6963, 139.8142], rating: 4.5, priceRange: '890~1,250엔' },
          { name: '긴시초 하치텐 찻집', menu: '모닝 토스트 & 사이폰 핸드드립 커피', desc: '차분한 분위기의 긴시초 현지 레트로 킷사텐 카페', coordinates: [35.6970, 139.8138], rating: 4.4, priceRange: '550~850엔' }
        ],
        address: 'Kinshicho, Sumida City, Tokyo',
        likes: 10,
        hasLiked: false
      },
      {
        id: 'spot-6-2',
        name: '나리타 국제공항',
        japaneseName: '成田国際空港 (NRT)',
        category: 'station',
        categoryLabel: '공항 / 귀국',
        rating: 4.4,
        openStatus: 'Open',
        hours: '상시 운영 (면세점 07:30 ~ 21:00)',
        estimatedTime: '12:30 ~ 15:30',
        coordinates: [35.7720, 140.3929],
        summary: '긴시초역에서 소부선 쾌속을 탑승하시면 나리타 공항까지 환승 없이 한 번에 편리하게 이동하실 수 있습니다.',
        tips: [
          'JR 긴시초역에서 "소부선 쾌속 나리타공항행(快速 成田空港行き)"을 타면 환승 없이 약 80~85분 만에 공항 지하 역사에 도착합니다.',
          '출국 수속 후 면세 구역에서 로이스 생초콜릿, 도쿄 바나나, 시로이 고이비토 등 기념품 쇼핑을 즐기세요.',
          '남은 동전(엔화)은 면세점에서 복합 결제(현금 + 카드)하거나 가챠 머신으로 소진할 수 있습니다.'
        ],
        recommendedFoods: [
          { name: '토미타 라멘 나리타공항점 (T1)', menu: '일본 1위 전설의 농후 츠케멘', desc: '치바 마츠도의 전설적 라멘 명가 토미타의 공항 직영점', coordinates: [35.7650, 140.3860], rating: 4.6, priceRange: '1,050~1,450엔' },
          { name: '스시 쿄타츠 (나리타공항 출국장)', menu: '에도마에 신선 특선 모둠 스시', desc: '비행기 탑승 직전 면세 구역에서 즐기는 장인 스시', coordinates: [35.7720, 140.3929], rating: 4.5, priceRange: '1,900~2,900엔' },
          { name: '기온 츠지리 나리타공항점', menu: '우지 말차 소프트아이스크림 & 말차 라떼', desc: '일본을 떠나기 전 마지막으로 맛보는 진한 교토 말차', coordinates: [35.7715, 140.3925], rating: 4.5, priceRange: '550~850엔' },
          { name: '공항 면세점 로이스 & 도쿄바나나', menu: '로이스 오리지널 생초콜릿 & 도쿄 바나나', desc: '남은 엔화 동전까지 알뜰하게 소진하는 일본 국민 기념품', coordinates: [35.7725, 140.3935], rating: 4.7, priceRange: '800~1,600엔' }
        ],
        address: 'Narita, Chiba Prefecture',
        likes: 17,
        hasLiked: false
      }
    ],
    transits: [
      {
        fromSpotId: 'spot-6-1',
        toSpotId: 'spot-6-2',
        method: 'train',
        routeName: 'JR 소부선 쾌속 (JO22 긴시초역 ➔ 나리타공항역 직통)',
        durationMinutes: 82,
        fareJPY: 1340,
        fareKRW: 12200,
        lineName: 'JR 소부선 쾌속 (JO)',
        lineColor: '#007AC9',
        detailedRoute: '긴시초역 3·4번 승강장 ➔ 쾌속 나리타공항행 ➔ 나리타공항 제1/제2터미널역 직통',
        transitTip: '환승 0회 직통! 무거운 캐리어를 들고 환승할 필요 없이 공항 역사까지 편안하게 직통 이동할 수 있어 여행의 마무리가 쾌적합니다.',
        passRecommendation: 'Suica/Pasmo IC카드 태그 (1,342엔)',
        transferCount: 0
      }
    ]
  }
];

export const INITIAL_COMPANIONS: FriendCompanion[] = [
  { id: 'user-1', name: '나 (작성자)', avatarColor: 'bg-indigo-600', status: '동선 확인 중', isOnline: true, viewingDay: 1 },
  { id: 'user-2', name: '민지', avatarColor: 'bg-rose-500', status: '디즈니씨 DPA 확인 중', isOnline: true, viewingDay: 2 },
  { id: 'user-3', name: '준호', avatarColor: 'bg-emerald-600', status: '시부야 스카이 티켓 예약 완료', isOnline: true, viewingDay: 3 },
  { id: 'user-4', name: '수진', avatarColor: 'bg-amber-600', status: '롯폰기 맛집 찜하기 중', isOnline: false, viewingDay: 5 }
];

export const INITIAL_COMMENTS: SpotComment[] = [
  {
    id: 'c-1',
    spotId: 'spot-1-2',
    spotName: '우에노 공원',
    author: '민지',
    avatarColor: 'bg-rose-500',
    text: '이센 본점 돈카츠 웨이팅 대략 20~30분 정도 있대요! 늦은 점심 2시 반쯤 가면 바로 들어갈 수도 있대요.',
    timestamp: '오전 10:15'
  },
  {
    id: 'c-2',
    spotId: 'spot-2-1',
    spotName: '도쿄 디즈니씨',
    author: '준호',
    avatarColor: 'bg-emerald-600',
    text: '소어링 DPA는 입장하자마자 앱 켜서 바로 결제해야 오전 슬롯 잡을 수 있대! 디즈니 공식 앱 미리 다운받고 카드 등록해두자.',
    timestamp: '오전 11:42'
  },
  {
    id: 'c-3',
    spotId: 'spot-3-3',
    spotName: '시부야 스카이',
    author: '수진',
    avatarColor: 'bg-amber-600',
    text: '시부야 스카이 17:20 일몰 시간대로 티켓 예매 성공했어! 인생샷 건지자 ❤️',
    timestamp: '어제'
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // 1. 필수준비 (서류 & 금융)
  { id: 'chk-1', text: '여권 (유효기간 6개월 이상 확인 & 사본 캡처)', category: '필수준비', completed: false },
  { id: 'chk-2', text: '비짓 재팬 웹 (Visit Japan Web) 입국 심사 QR 등록', category: '필수준비', completed: false },
  { id: 'chk-10', text: '엔화 현금 환전 & 동전지갑 (가챠, 자판기, 신사, 현금 노포 대비)', category: '필수준비', completed: false },
  { id: 'chk-11', text: '해외 결제 카드 (트래블로그 / 트래블월렛 / 비상용 신용카드)', category: '필수준비', completed: false },
  { id: 'chk-12', text: '항공권 E-티켓 & 호텔 예약 확인서 (오프라인 사진 저장)', category: '필수준비', completed: false },

  // 2. 의류/잡화 (속옷, 양말, 목도리, 장갑, 모자, 썬글라스, 운동화 등)
  { id: 'chk-13', text: '속옷 (일정 + 여유분 포함 5~6벌)', category: '의류/잡화', completed: false },
  { id: 'chk-14', text: '양말 (하루 2만보 도보 대비 두툼하고 푹신한 양말 5~6켤레)', category: '의류/잡화', completed: false },
  { id: 'chk-40', text: '목도리 / 머플러 (겨울철 야외 도보 및 야경 감상 칼바람 대비 보온)', category: '의류/잡화', completed: false },
  { id: 'chk-41', text: '장갑 (스마트폰 터치 가능한 방한 장갑 / 손 시림 방지)', category: '의류/잡화', completed: false },
  { id: 'chk-9', text: '오래 걸어도 편한 운동화 / 러닝화 (물집 방지 필수!)', category: '의류/잡화', completed: false },
  { id: 'chk-15', text: '모자 (햇빛 차단 볼캡 또는 체온 유지 비니)', category: '의류/잡화', completed: false },
  { id: 'chk-16', text: '썬글라스 (자외선 차단 & 전망대/야외 도보 눈부심 방지)', category: '의류/잡화', completed: false },
  { id: 'chk-17', text: '여벌 외투 & 가벼운 방한 패딩 / 바람막이', category: '의류/잡화', completed: false },
  { id: 'chk-18', text: '편안한 잠옷 & 숙소 실내복', category: '의류/잡화', completed: false },
  { id: 'chk-19', text: '휴대용 슬링백 / 미니 크로스백 (여권·지갑·핸드폰 휴대)', category: '의류/잡화', completed: false },

  // 3. 세면/위생 (칫솔, 치약, 화장품, 썬크림 등)
  { id: 'chk-20', text: '칫솔 & 치약 세트 (휴대용 케이스 포함)', category: '세면/위생', completed: false },
  { id: 'chk-21', text: '폼클렌징 & 샴푸/바디워시 여행용 세면도구 키트', category: '세면/위생', completed: false },
  { id: 'chk-22', text: '스킨, 로션 등 기초 보습 화장품', category: '세면/위생', completed: false },
  { id: 'chk-23', text: '썬크림 (자외선 차단제)', category: '세면/위생', completed: false },
  { id: 'chk-24', text: '립밤 & 보습 핸드크림 (건조한 기내 및 겨울 바람 대비)', category: '세면/위생', completed: false },
  { id: 'chk-25', text: '면도기 & 쉐이빙 젤', category: '세면/위생', completed: false },
  { id: 'chk-26', text: '인공눈물 & 렌즈용품 (세척액, 보관 케이스, 여분 렌즈)', category: '세면/위생', completed: false },
  { id: 'chk-27', text: '휴대용 물티슈 & 포켓 티슈 (식사 및 이동 시 유용)', category: '세면/위생', completed: false },

  // 4. 상비약 (비상약, 진통제, 소화제, 파스 등)
  { id: 'chk-28', text: '종합 감기약 & 해열진통제 (타이레놀 / 이부프로펜)', category: '상비약', completed: false },
  { id: 'chk-29', text: '소화제 & 지사제 & 위장약 (일본 라멘·먹방 대비 필수)', category: '상비약', completed: false },
  { id: 'chk-30', text: '대일밴드 (방수 밴드) & 후시딘/마데카솔 상처 연고', category: '상비약', completed: false },
  { id: 'chk-31', text: '휴족시간 또는 발바닥/종아리 쿨링 파스 (2만보 피로 회복 필수!)', category: '상비약', completed: false },
  { id: 'chk-32', text: '개인 복용 상비약 & 비타민 / 피로회복제', category: '상비약', completed: false },

  // 5. 전자기기 (돼지코, 보조배터리, 충전기 등)
  { id: 'chk-8', text: '110V 돼지코 변환 플러그 (일본 11자형 멀티 어댑터)', category: '전자기기', completed: false },
  { id: 'chk-33', text: '대용량 보조배터리 (10,000mAh 이상) & 충전 케이블', category: '전자기기', completed: false },
  { id: 'chk-34', text: '스마트폰 고속 충전기 & 멀티 포트 어댑터', category: '전자기기', completed: false },
  { id: 'chk-35', text: '유심 핀(SIM 이젝트 핀) & 여분 유심 보관 케이스', category: '전자기기', completed: false },

  // 6. 교통/통신
  { id: 'chk-3', text: '일본 eSIM 또는 포켓 와이파이 예약 (사전 등록 QR)', category: '교통/통신', completed: false },
  { id: 'chk-4', text: '스이카(Suica) 또는 파스모(Pasmo) 모바일 교통카드 등록/충전', category: '교통/통신', completed: false },

  // 7. 예약확인
  { id: 'chk-5', text: '도쿄 디즈니씨 티켓 및 공식 앱 결제수단 등록', category: '예약확인', completed: false },
  { id: 'chk-6', text: '워너 브라더스 해리포터 스튜디오 투어 입장권 예매', category: '예약확인', completed: false },
  { id: 'chk-7', text: '시부야 스카이 일몰 시간대(17시대) 전망대 예약', category: '예약확인', completed: false },

  // 8. 여행꿀템 (편의/쇼핑)
  { id: 'chk-36', text: '3단 접이식 초경량 우산 (갑작스러운 도쿄 비 대비)', category: '여행꿀템', completed: false },
  { id: 'chk-37', text: '지퍼백 & 빨래감 분리 비닐봉투 (의류 분리용)', category: '여행꿀템', completed: false },
  { id: 'chk-38', text: '돈키호테 & 면세점 쇼핑용 접이식 대형 에코백/타포린백', category: '여행꿀템', completed: false },
  { id: 'chk-39', text: '귀마개 & 수면 안대 (비행기 기내 및 숙소 숙면용)', category: '여행꿀템', completed: false }
];

export const INITIAL_BUDGET: BudgetItem[] = [
  // [공동경비 모금] 초기 현금 갹출 (2가족 각 50,000엔씩 총 100,000엔 적립)
  {
    id: 'fund-1',
    type: 'DEPOSIT',
    day: 0,
    date: '사전준비',
    title: '현우가족 현금 공동경비 1차 각출 입금',
    category: '기타',
    amountJPY: 50000,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '현우가족',
    location: '인천공항 환전소',
    note: '현우가족(2인) 공동경비 현금 납부'
  },
  {
    id: 'fund-2',
    type: 'DEPOSIT',
    day: 0,
    date: '사전준비',
    title: '세현가족 현금 공동경비 1차 각출 입금',
    category: '기타',
    amountJPY: 50000,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '세현가족',
    location: '인천공항 환전소',
    note: '세현가족(2인) 공동경비 현금 납부'
  },

  // [사전예약 카드 - 공동 사용] (1/2 정산 대상)
  {
    id: 'b-card-1',
    type: 'EXPENSE',
    day: 0,
    date: '사전예약',
    title: '롯데시티호텔 긴시쵸 (5박 전액 / 트윈 2객실)',
    category: '숙박',
    amountJPY: 85000,
    paymentMethod: 'CARD',
    scope: 'SHARED',
    paidBy: '현우가족',
    location: '긴시초',
    note: '현우가족 카드로 선결제 (추후 1/2 정산)'
  },
  {
    id: 'b-card-2',
    type: 'EXPENSE',
    day: 0,
    date: '사전예약',
    title: '도쿄 디즈니씨 1일 여권 (4인 전원 티켓)',
    category: '입장료',
    amountJPY: 39600,
    paymentMethod: 'CARD',
    scope: 'SHARED',
    paidBy: '세현가족',
    location: '디즈니씨',
    note: '세현가족 카드로 공식앱 선결제 (추후 1/2 정산)'
  },
  {
    id: 'b-card-3',
    type: 'EXPENSE',
    day: 0,
    date: '사전예약',
    title: '워너브라더스 도쿄 해리포터 스튜디오 투어 (4인 티켓)',
    category: '입장료',
    amountJPY: 26000,
    paymentMethod: 'CARD',
    scope: 'SHARED',
    paidBy: '현우가족',
    location: '네리마',
    note: '현우가족 카드로 공홈 선결제 (추후 1/2 정산)'
  },
  {
    id: 'b-card-4',
    type: 'EXPENSE',
    day: 0,
    date: '사전예약',
    title: '시부야 스카이 17:20 일몰 골든타임 티켓 (4인)',
    category: '입장료',
    amountJPY: 10000,
    paymentMethod: 'CARD',
    scope: 'SHARED',
    paidBy: '세현가족',
    location: '시부야',
    note: '세현가족 카드로 Klook 선결제 (추후 1/2 정산)'
  },

  // [Day 1]
  {
    id: 'b-d1-1',
    type: 'EXPENSE',
    day: 1,
    date: '1월 13일',
    title: '나리타공항 ➔ 긴시초 숙소 JR 소부선 쾌속 (4인 티켓)',
    category: '교통',
    amountJPY: 5360,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '나리타공항',
    note: '공동경비 현금에서 차감'
  },
  {
    id: 'b-d1-2',
    type: 'EXPENSE',
    day: 1,
    date: '1월 13일',
    title: '우에노 이센 본점 점심 카츠 (4인 모둠 정식 식사)',
    category: '식비',
    amountJPY: 7200,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '우에노',
    note: '공동경비 현금에서 차감'
  },
  {
    id: 'b-d1-3',
    type: 'EXPENSE',
    day: 1,
    date: '1월 13일',
    title: '긴시초 역전 토리키조쿠 저녁 야키토리 & 나마비루 (4인)',
    category: '이자카야/주류',
    amountJPY: 5200,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '긴시초',
    note: '공동경비 현금에서 차감'
  },

  // [Day 2]
  {
    id: 'b-d2-1',
    type: 'EXPENSE',
    day: 2,
    date: '1월 14일',
    title: '디즈니씨 DPA 소어링 프리미어 액세스 (4인)',
    category: '입장료',
    amountJPY: 8000,
    paymentMethod: 'CARD',
    scope: 'SHARED',
    paidBy: '세현가족',
    location: '디즈니씨',
    note: '세현가족 카드 현장 결제 (공동 1/2 정산)'
  },
  {
    id: 'b-d2-2',
    type: 'EXPENSE',
    day: 2,
    date: '1월 14일',
    title: '디즈니 리조트라인 모노레일 & 전철 왕복 (4인)',
    category: '교통',
    amountJPY: 4880,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '마이하마',
    note: '공동경비 현금에서 차감'
  },
  {
    id: 'b-d2-3',
    type: 'EXPENSE',
    day: 2,
    date: '1월 14일',
    title: '디즈니씨 알린 모찌, 칠면조 다리 & 팝콘 간식 (4인)',
    category: '간식/디저트' as any,
    amountJPY: 6400,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '디즈니씨',
    note: '공동경비 현금에서 차감'
  },

  // [Day 3]
  {
    id: 'b-d3-1',
    type: 'EXPENSE',
    day: 3,
    date: '1월 15일',
    title: '해리포터 스튜디오 버터맥주 & 백롯 카페 간식 (4인)',
    category: '카페/디저트',
    amountJPY: 4600,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '네리마',
    note: '공동경비 현금에서 차감'
  },
  {
    id: 'b-d3-2',
    type: 'EXPENSE',
    day: 3,
    date: '1월 15일',
    title: 'Day 3 지하철·세이부선 이동 교통비 합계 (4인)',
    category: '교통',
    amountJPY: 3840,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '도쿄 메트로',
    note: '공동경비 현금에서 차감'
  },
  {
    id: 'b-d3-card-h',
    type: 'EXPENSE',
    day: 3,
    date: '1월 15일',
    title: '시부야 파르코 닌텐도 도쿄 & 포켓몬센터 굿즈 쇼핑',
    category: '쇼핑',
    amountJPY: 14500,
    paymentMethod: 'CARD',
    scope: 'HYEONWOO',
    paidBy: '현우가족',
    location: '시부야',
    note: '현우가족 개별 카드 지출 (가족 단독 부담)'
  },
  {
    id: 'b-d3-card-s',
    type: 'EXPENSE',
    day: 3,
    date: '1월 15일',
    title: '시부야 메가돈키호테 선물 및 화장품 쇼핑',
    category: '쇼핑',
    amountJPY: 12800,
    paymentMethod: 'CARD',
    scope: 'SEHYEON',
    paidBy: '세현가족',
    location: '시부야',
    note: '세현가족 개별 카드 지출 (가족 단독 부담)'
  },

  // [Day 4]
  {
    id: 'b-d4-1',
    type: 'EXPENSE',
    day: 4,
    date: '1월 16일',
    title: '후지산 & 가와구치코 1일 버스 투어 (4인 전원)',
    category: '입장료',
    amountJPY: 32000,
    paymentMethod: 'CARD',
    scope: 'SHARED',
    paidBy: '현우가족',
    location: '후지산',
    note: '현우가족 카드 결제 (공동 1/2 정산)'
  },
  {
    id: 'b-d4-2',
    type: 'EXPENSE',
    day: 4,
    date: '1월 16일',
    title: '가와구치코 호숫가 로컬 우동 점심 식사 (4인)',
    category: '식비',
    amountJPY: 5600,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '가와구치코',
    note: '공동경비 현금에서 차감'
  },

  // [Day 5]
  {
    id: 'b-d5-1',
    type: 'EXPENSE',
    day: 5,
    date: '1월 17일',
    title: '쓰키지 장외시장 해산물 카이센동 & 계란말이 아침 (4인)',
    category: '식비',
    amountJPY: 9800,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '쓰키지',
    note: '공동경비 현금에서 차감'
  },
  {
    id: 'b-d5-2',
    type: 'EXPENSE',
    day: 5,
    date: '1월 17일',
    title: '롯폰기 곤파치(Gonpachi) 저녁 선술집 맥주 & 꼬치 (4인)',
    category: '이자카야/주류',
    amountJPY: 8600,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '롯폰기',
    note: '공동경비 현금에서 차감'
  },
  {
    id: 'b-d5-card-h',
    type: 'EXPENSE',
    day: 5,
    date: '1월 17일',
    title: '긴자 이토야 문구 & 도쿄바나나 선물 쇼핑',
    category: '쇼핑',
    amountJPY: 8900,
    paymentMethod: 'CARD',
    scope: 'HYEONWOO',
    paidBy: '현우가족',
    location: '긴자',
    note: '현우가족 개별 카드 지출 (가족 단독 부담)'
  },
  {
    id: 'b-d5-card-s',
    type: 'EXPENSE',
    day: 5,
    date: '1월 17일',
    title: '모리미술관 뮤지엄샵 기념품 & 롯폰기 카페',
    category: '쇼핑',
    amountJPY: 6500,
    paymentMethod: 'CARD',
    scope: 'SEHYEON',
    paidBy: '세현가족',
    location: '롯폰기',
    note: '세현가족 개별 카드 지출 (가족 단독 부담)'
  },

  // [Day 6]
  {
    id: 'b-d6-1',
    type: 'EXPENSE',
    day: 6,
    date: '1월 18일',
    title: '긴시초 숙소 ➔ 나리타공항 JR 소부선 쾌속 복귀 (4인)',
    category: '교통',
    amountJPY: 5360,
    paymentMethod: 'CASH',
    scope: 'SHARED',
    paidBy: '공동경비(현금)',
    location: '긴시초',
    note: '공동경비 현금에서 차감'
  }
];

