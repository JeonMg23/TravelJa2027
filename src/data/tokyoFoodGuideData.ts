export type TokyoFoodCategoryId =
  | 'ALL'
  | 'MAIN_MEAL'
  | 'STREET_SNACK'
  | 'DESSERT_SWEETS'
  | 'THEME_PARK'
  | 'IZAKAYA_PUB'
  | 'KONBINI';

export interface TokyoFoodCategoryMeta {
  id: TokyoFoodCategoryId;
  label: string;
  shortLabel: string;
  subtitle: string;
  countBadgeColor: string;
}

export interface FoodEggAllergyInfo {
  hasDirectEgg: boolean;
  eggTypeLabel: string; // 예: '반숙 계란 (아지타마고)', '반숙 계란 튀김', '계란말이 토핑', '날계란 소스'
  defaultMode: 'SEPARATE' | 'REMOVE';
  hyunwooTip: string;
  customRemoveJp?: string;
  customRemovePronunciation?: string;
  customSeparateJp?: string;
  customSeparatePronunciation?: string;
}

export interface TokyoFoodItem {
  id: string;
  name: string;
  japaneseName: string;
  pronunciation: string;
  category: Exclude<TokyoFoodCategoryId, 'ALL'>;
  categoryLabel: string;
  dayNumber: number; // 1~5 (itinerary day recommendation)
  areaTag: string;
  famousShop: string;
  priceJpy: string;
  priceKrwApprox: string;
  imageUrl: string;
  fallbackGradient: string;
  ratingScore: string;
  recommendBadge: string;
  summary: string;
  tastePoints: string[];
  orderTip: string;
  kidFavoriteScore: string;
  momFavoriteScore: string;
  googleMapsQuery: string;
  eggAllergyInfo?: FoodEggAllergyInfo;
}

export const TOKYO_FOOD_CATEGORIES: TokyoFoodCategoryMeta[] = [
  {
    id: 'ALL',
    label: '전체 먹거리 (40선)',
    shortLabel: '전체 보기',
    subtitle: '중복 없이 엄선한 도쿄 5박 6일 평점·추천 베스트 대표 음식·간식·디저트·선술집 40선',
    countBadgeColor: 'bg-amber-400 text-slate-950'
  },
  {
    id: 'MAIN_MEAL',
    label: '대표 식사 · 면/덮밥/구이 (10선)',
    shortLabel: '메인 식사·면/밥',
    subtitle: '라멘, 규카츠, 카이센동, 몬자야키, 와규 야키니쿠, 호토 전골, 텐동, 돈카츠, 장어덮밥, 스키야키',
    countBadgeColor: 'bg-rose-500 text-white'
  },
  {
    id: 'STREET_SNACK',
    label: '길거리 간식 · 시장 명물 (7선)',
    shortLabel: '길거리·시장 간식',
    subtitle: '점보 메론빵, 쓰키지 계란말이, 멘치카츠, 타코야키, 미타라시 당고, 갓 튀긴 포테리코, 야키토리',
    countBadgeColor: 'bg-orange-500 text-white'
  },
  {
    id: 'DESSERT_SWEETS',
    label: '유명 디저트 · 스위츠 카페 (7선)',
    shortLabel: '디저트·스위츠',
    subtitle: '생딸기 모찌, 수플레 팬케이크, 크레페, 말차 파르페, 링고 애플파이, 하브스 밀크레이프, 생밤 몽블랑',
    countBadgeColor: 'bg-pink-500 text-white'
  },
  {
    id: 'THEME_PARK',
    label: '테마파크 · 스페셜 간식 (5선)',
    shortLabel: '디즈니·해리포터',
    subtitle: '해리포터 버터맥주 & 로스트비프, 디즈니씨 리틀 그린맨 모찌, 스모크 터키레그, 미키 츄러스',
    countBadgeColor: 'bg-sky-500 text-white'
  },
  {
    id: 'IZAKAYA_PUB',
    label: '일정 추천 선술집 · 밤맥주 안주 (6선)',
    shortLabel: '추천 선술집·이자카야',
    subtitle: '일정에 추가된 긴시초 숙소 도보 1~3분 추천 선술집! 토리키조쿠, 하카타 게키죠, 쿠시카츠 다나카, 카라쿠, 텟펜, 텟짱',
    countBadgeColor: 'bg-amber-500 text-slate-950'
  },
  {
    id: 'KONBINI',
    label: '편의점 필수 털이 · 야식 (5선)',
    shortLabel: '편의점 야식',
    subtitle: '타마고 산도, 오하요 저지 밀크 푸딩, 로손 모찌롤, 패밀리마트 파미치키, 닛신 유부우동 & 오니기리',
    countBadgeColor: 'bg-emerald-500 text-white'
  }
];

export const TOKYO_FOOD_ITEMS: TokyoFoodItem[] = [
  // ==========================================
  // 1. 대표 식사 · 면 / 덮밥 / 구이 (MAIN_MEAL - 10선)
  // ==========================================
  {
    id: 'food_tonkotsu_ramen',
    name: '진한 돈코츠 차슈 라멘 & 반숙 아지타마고',
    japaneseName: '天然とんこつラーメン (一蘭)',
    pronunciation: '톤코츠 라멘 + 아지츠케 타마고',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 라멘',
    dayNumber: 1,
    areaTag: '아사쿠사 · 시부야 · 신주쿠',
    famousShop: '이치란 라멘 (아사쿠사점 / 시부야점 / 신주쿠점)',
    priceJpy: '¥1,180 ~ ¥1,490',
    priceKrwApprox: '약 11,000원 ~ 13,800원',
    imageUrl: '/foods/tonkotsu_ramen.jpg',
    fallbackGradient: 'from-amber-900 via-red-900 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '도쿄 여행객 추천 1위',
    summary:
      '잡내 없이 진하게 우려낸 돼지뼈 육수에 비법 빨간 다데기와 부드러운 차슈, 촉촉한 반숙 계란을 곁들여 먹는 도쿄 필수 라멘입니다.',
    tastePoints: [
      '아이들은 비법 소스(매운맛)를 1/2단계 또는 기본으로 선택하면 고소하게 즐길 수 있어요',
      '반숙 계란(아지타마고)과 김, 차슈 추가는 선택이 아닌 필수!',
      '면 다 먹고 남은 국물에 카에다마(면 추가)하면 원정대 소년들 배부르게 클리어'
    ],
    orderTip: '주문서에서 국물 농도 "기본", 마늘 "1쪽", 비법소스 "기본(아이들은 1/2)" 추천!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (1순위)',
    momFavoriteScore: '엄마들 선호도 ★★★★☆',
    googleMapsQuery: '이치란 아사쿠사점',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '반숙 계란 (아지타마고 · 味玉)',
      defaultMode: 'SEPARATE',
      hyunwooTip:
        '현우 라멘에는 반숙 계란(아지타마고)을 넣지 말고 별도 접시에 따로 받거나 빼달라고 요청하세요! (면·국물은 섭취 가능)',
      customRemoveJp: 'ラーメンに卵（半熟卵・味玉）を入れないでください（卵抜きでお願いします）。',
      customRemovePronunciation: '라멘니 타마고(한쥬쿠타마고·아지타마)오 이레나이데 구다사이 (타마고 누키데 오네가이시마스)',
      customSeparateJp: '卵（半熟卵・味玉）はラーメンに入れず、別の皿（別皿）でお願いします。',
      customSeparatePronunciation: '타마고(한쥬쿠타마고·아지타마)와 라멘니 이레즈, 베츠자라데 오네가이시마스'
    }
  },
  {
    id: 'food_gyukatsu',
    name: '미니 화로에 구워 먹는 살치살 규카츠 정식',
    japaneseName: '牛かつ もと村 (규카츠 모토무라)',
    pronunciation: '규카츠 테이쇼쿠',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 규카츠',
    dayNumber: 4,
    areaTag: '시부야 · 신주쿠 · 도쿄역',
    famousShop: '규카츠 모토무라 (시부야 본점 / 신주쿠 미나미구치점)',
    priceJpy: '¥1,930 ~ ¥2,600',
    priceKrwApprox: '약 18,000원 ~ 24,000원',
    imageUrl: '/foods/gyukatsu.jpg',
    fallbackGradient: 'from-rose-950 via-amber-900 to-zinc-900',
    ratingScore: '★ 4.9',
    recommendBadge: '구글 리뷰 1만+ 웨이팅 맛집',
    summary:
      '얇고 바삭한 빵가루 옷을 입혀 60초만 튀겨낸 레어 소고기 커틀릿을 개인 미니 돌판 화로에 취향껏 지글지글 구워 먹는 인기 폭발 메뉴입니다.',
    tastePoints: [
      '아이들이 직접 미니 돌판에 고기를 구워 먹는 재미가 있어 지루할 틈이 없어요',
      '생와사비 + 특제 간장소스 또는 고소한 산마(도도로) 소스를 보리밥에 비벼 먹으면 꿀맛',
      '따뜻한 보리밥 1회 무료 리필 가능!'
    ],
    orderTip: '고기가 1.5배 나오는 "195g 정식"이 소년 원정대 양에 딱 맞습니다.',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (직접 굽는 재미!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Gyukatsu Motomura Shibuya'
  },
  {
    id: 'food_kaisendon_sushi',
    name: '쓰키지 특선 카이센동 (해산물 덮밥) & 참치 스시',
    japaneseName: '築地場外市場 海鮮丼・本まぐろ寿司',
    pronunciation: '카이센동 / 혼마구로 스시',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 해산물/스시',
    dayNumber: 5,
    areaTag: '쓰키지 장외시장 · 긴자',
    famousShop: '쓰키지 이타도리 우니 토라 / 스시잔마이 본점',
    priceJpy: '¥2,400 ~ ¥3,800',
    priceKrwApprox: '약 22,000원 ~ 35,000원',
    imageUrl: '/foods/kaisendon_sushi.jpg',
    fallbackGradient: 'from-orange-900 via-rose-900 to-slate-900',
    ratingScore: '★ 4.8',
    recommendBadge: '쓰키지 시장 브런치 1위',
    summary:
      '입안에서 사르르 녹는 생참치 대뱃살(오도로), 톡톡 터지는 연어알(이쿠라), 달콤한 성게알(우니)을 따뜻한 초밥 위에 아낌없이 올린 보석함 같은 덮밥입니다.',
    tastePoints: [
      '비린 맛 전혀 없이 고소하고 달콤한 신선 해산물의 정점',
      '날생선을 덜 좋아하는 대원은 토치로 살짝 구운 아부리(불초밥) 덮밥 선택 가능',
      '아침 일찍 쓰키지 시장 산책하며 먹는 최고의 브런치'
    ],
    orderTip: '연어 + 참치 + 연어알 조합인 "산쇼쿠동(3색 덮밥)"이 호불호 없이 가장 인기!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (엄마들 원픽!)',
    googleMapsQuery: 'Tsukiji Outer Market Kaisendon',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '계란말이 토핑 (타마고야키 · 玉子焼き)',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '카이센동(해산물 덮밥)이나 스시 세트에 기본으로 올라가는 일본식 계란말이(타마고) 조각을 빼달라거나 다른 접시에 따로 담아달라고 요청하세요!',
      customRemoveJp: '海鮮丼（お寿司）の上の玉子焼き（卵）を抜いてください。',
      customRemovePronunciation: '카이센동(오스시)노 우에노 타마고야키(타마고)오 누이테 구다사이',
      customSeparateJp: '海鮮丼（お寿司）の玉子焼き（卵）は別の皿（別皿）に分けてください。',
      customSeparatePronunciation: '카이센동(오스시)노 타마고야키(타마고)와 베츠자라니 와케테 구다사이'
    }
  },
  {
    id: 'food_monjayaki',
    name: '아사쿠사 철판 명란 모찌 치즈 몬자야키',
    japaneseName: '明太もちチーズもんじゃ焼き',
    pronunciation: '멘타이 모찌 치즈 몬자야키',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 도쿄 전통 철판요리',
    dayNumber: 1,
    areaTag: '아사쿠사 센소지 · 홉피거리',
    famousShop: '몬자 모헤지 아사쿠사 본점 / 아사쿠사 몬자 구라(蔵)',
    priceJpy: '¥1,580 ~ ¥1,850',
    priceKrwApprox: '약 14,500원 ~ 17,000원',
    imageUrl: '/foods/monjayaki.jpg',
    fallbackGradient: 'from-amber-800 via-orange-950 to-stone-950',
    ratingScore: '★ 4.8',
    recommendBadge: '도쿄 현지인 소울푸드',
    summary:
      '오사카에 오코노미야키가 있다면 도쿄에는 몬자야키! 양배추와 해산물, 쫄깃한 떡(모찌), 고소한 치즈를 철판에 얇게 펴서 미니 뒤집개(하가시)로 긁어 먹는 도쿄 명물입니다.',
    tastePoints: [
      '철판 바닥에 살짝 눌어붙은 치즈 누룽지 부분이 바삭하고 고소해요',
      '직원이 눈앞에서 현란한 손놀림으로 직접 만들어 주어 보는 재미 만점',
      '작은 미니 주걱으로 호호 불어가며 떠먹는 특별한 체험'
    ],
    orderTip: '"멘타이 모찌 치즈 몬자(명란+떡+치즈)" + "야키소바" 조합으로 주문하면 완벽해요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Monja Moheji Asakusa',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '철판 야키소바 계란프라이 (目玉焼き) 토핑 확인',
      defaultMode: 'SEPARATE',
      hyunwooTip:
        '몬자야키 기본 반죽에는 계란이 없지만, 함께 시키는 야키소바나 오코노미야키에 계란프라이(메다마야키)·날계란이 올라갈 수 있으니 계란을 빼거나 따로 담아달라고 요청하세요!',
      customRemoveJp: 'もんじゃ焼き・焼きそばに卵（生卵・目玉焼き）を入れないでください。',
      customRemovePronunciation: '몬자야키·야키소바니 타마고(나마타마고·메다마야키)오 이레나이데 구다사이',
      customSeparateJp: '卵（生卵・目玉焼き）は鉄板に乗せず、別の皿（別皿）でお願いします。',
      customSeparatePronunciation: '타마고(메다마야키)와 텟판니 노세즈, 베츠자라데 오네가이시마스'
    }
  },
  {
    id: 'food_yakiniku_wagyu',
    name: '숯불 A5 와규 갈비 & 특선 우설 야키니쿠',
    japaneseName: '黒毛和牛 焼肉 (カルビ・上タン塩)',
    pronunciation: '쿠로게와규 야키니쿠',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 와규 숯불구이',
    dayNumber: 4,
    areaTag: '시부야 · 신주쿠 · 스카이트리',
    famousShop: '조조엔(叙々苑) 스카이트리점 / 한노다이도코로 시부야',
    priceJpy: '¥2,500 ~ ¥4,800',
    priceKrwApprox: '약 23,000원 ~ 45,000원',
    imageUrl: '/foods/yakiniku_wagyu.jpg',
    fallbackGradient: 'from-red-950 via-stone-900 to-black',
    ratingScore: '★ 4.9',
    recommendBadge: '타베로그 고기 백명점',
    summary:
      '눈꽃 같은 마블링의 일본산 흑모 와규 갈비살과 쫄깃한 파소금 우설을 참숯 화로에 구워 달콤짭조름한 타레 소스에 찍어 먹는 체력 보충 특식입니다.',
    tastePoints: [
      '하루 2만 보 걷고 지친 원정대 체력을 단숨에 충전해 주는 육즙 파티',
      '달콤한 야키니쿠 소스에 흰쌀밥 한 공기 뚝딱 비우게 되는 맛',
      '점심 런치 세트를 이용하면 저녁 대비 절반 가격에 가성비 최고!'
    ],
    orderTip: '와규 갈비(카루비) + 안창살(하라미) 세트가 아이들 입맛에 가장 부드럽습니다.',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (고기 대장)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Shibuya Yakiniku Wagyu'
  },
  {
    id: 'food_houtou_noodle',
    name: '후지산 가와구치코 명물 단호박 호토 전골 국수',
    japaneseName: '富士山 河口湖名物 ほうとう不動',
    pronunciation: '호토 후도 (카보챠 호토)',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 후지산 향토 요리',
    dayNumber: 3,
    areaTag: '후지산 · 가와구치코 호수',
    famousShop: '호토 후도 (구름 모양 건물 히가시코이지점 / 가와구치코 북본점)',
    priceJpy: '¥1,320',
    priceKrwApprox: '약 12,200원',
    imageUrl: '/foods/houtou_noodle.jpg',
    fallbackGradient: 'from-amber-900 via-yellow-950 to-stone-900',
    ratingScore: '★ 4.8',
    recommendBadge: '후지산 투어 필수 보양식',
    summary:
      '후지산 투어의 필수 점심 코스! 쫄깃하고 납작한 수타 우동 면과 달콤한 단호박, 버섯, 산채 나물을 진한 된장(미소) 육수에 푹 끓여 무쇠 냄비째 나오는 전통 보양식입니다.',
    tastePoints: [
      '1월 겨울 후지산 바람에 언 몸을 사르르 녹여주는 구수하고 깊은 국물',
      '푹 익은 달콤한 단호박을 국물에 으깨어 면과 함께 먹으면 일품',
      '구름 모양의 독특한 건축물 안에서 먹는 특별한 분위기'
    ],
    orderTip: '무쇠 냄비가 매우 뜨거우니 아이들은 앞접시에 덜어서 식혀 먹도록 해주세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (겨울 뜨끈한 국물 최고)',
    googleMapsQuery: 'Houtou Fudou Kawaguchiko'
  },
  {
    id: 'food_tendon_tempura',
    name: '참기름에 바삭하게 튀긴 에도마에 스페셜 텐동',
    japaneseName: '江戸前天丼 金子半之助 / 大黒家天麩羅',
    pronunciation: '에도마에 텐동 (튀김덮밥)',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 텐동/튀김덮밥',
    dayNumber: 3,
    areaTag: '니혼바시 · 아사쿠사 · 도쿄역',
    famousShop: '니혼바시 카네코 한노스케 본점 / 아사쿠사 다이고쿠야',
    priceJpy: '¥1,380 ~ ¥1,980',
    priceKrwApprox: '약 12,800원 ~ 18,300원',
    imageUrl: '/foods/tendon_tempura.jpg',
    fallbackGradient: 'from-amber-950 via-yellow-900 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '가성비 미슐랭·줄서는 맛집',
    summary:
      '고소한 참기름으로 갓 튀겨낸 왕새우 2마리, 붕장어(아나고), 오징어 관자 카키아게, 반숙 계란 튀김을 따끈한 밥 위에 올리고 3대째 내려오는 비법 타레 소스를 뿌린 도쿄 명물 텐동입니다.',
    tastePoints: [
      '반숙 계란 튀김을 톡 터뜨려 노른자와 간장 타레 소스에 밥을 비벼 먹으면 천상의 맛!',
      '겉은 바삭하고 속은 탱글탱글한 대왕 새우튀김이 아이들 입맛 저격',
      '테이블에 놓인 유자 단무지(우엉 절임)와 함께 먹으면 끝까지 느끼함 제로'
    ],
    orderTip: '장어가 부담스러운 아이들은 새우와 오징어 위주인 "에비 텐동(새우 텐동)"을 선택하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (새우튀김 홀릭)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Kaneko Hannosuke Nihonbashi',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '반숙 계란 튀김 (반숙 타마고텐 · 半熟玉子天)',
      defaultMode: 'SEPARATE',
      hyunwooTip:
        '텐동 위에 기본으로 올라가는 "반숙 계란 튀김(半熟玉子天)"을 현우 그릇에는 올리지 말고 따로 접시에 담아달라고 하거나 빼달라고 요청하세요! (일반 튀김옷은 섭취 가능)',
      customRemoveJp: '天丼の「半熟玉子天（卵の天ぷら）」を抜いてください（衣は大丈夫です）。',
      customRemovePronunciation: '텐동노 한쥬쿠 타마고텐(타마고노 템푸라)오 누이테 구다사이 (코로모와 다이죠부데스)',
      customSeparateJp: '天丼の「半熟玉子天（卵の天ぷら）」は丼に乗せず、別皿に分けてください。',
      customSeparatePronunciation: '텐동노 한쥬쿠 타마고텐(타마고노 템푸라)와 돈부리니 노세즈, 베츠자라니 와케테 구다사이'
    }
  },
  {
    id: 'food_tonkatsu_rosu',
    name: '저온 숙성 특로스카츠 & 히레카츠 정식 (일본 돈카츠)',
    japaneseName: 'とんかつ まい泉 (마이센) / とんかつ和幸',
    pronunciation: '토쿠 로스카츠 / 히레카츠 테이쇼쿠',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 프리미엄 돈카츠',
    dayNumber: 4,
    areaTag: '오모테산도 · 시부야 · 도쿄역',
    famousShop: '돈카츠 마이센 아오야마 본점 / 시부야 히카리에점 / 돈카츠 와코',
    priceJpy: '¥1,650 ~ ¥2,400',
    priceKrwApprox: '약 15,200원 ~ 22,000원',
    imageUrl: '/foods/tonkatsu_rosu.jpg',
    fallbackGradient: 'from-yellow-900 via-amber-950 to-stone-950',
    ratingScore: '★ 4.8',
    recommendBadge: '아이·엄마 호불호 제로 1티어',
    summary:
      '젓가락만으로도 부드럽게 잘리는 숙성 돼지고기에 직접 구운 생빵가루를 입혀 꽃처럼 바삭하게 튀겨낸 도쿄 정통 돈카츠입니다.',
    tastePoints: [
      '입안에서 사르르 녹는 안심(히레카츠)과 고소한 육즙이 터지는 등심(로스카츠)',
      '달콤한 사과 베이스의 특제 돈카츠 소스와 트러플 소금에 번갈아 찍어 먹는 즐거움',
      '아삭한 양배추 샐러드와 미소된장국, 밥이 무료 리필되어 든든한 한 끼!'
    ],
    orderTip: '아이들에게는 지방이 없고 솜처럼 부드러운 "히레카츠(안심)" 또는 "에비후라이(새우튀김) 추가"를 추천!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (실패 없는 메뉴!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Tonkatsu Maisen Aoyama'
  },
  {
    id: 'food_unaju_eel',
    name: '비법 타레 소스 숯불 민물장어 덮밥 (우나쥬 & 히츠마부시)',
    japaneseName: '浅草 うな鐵 (우나테츠) / 伊豆栄 (이즈에이)',
    pronunciation: '우나쥬 / 히츠마부시',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 전통 장어덮밥',
    dayNumber: 1,
    areaTag: '아사쿠사 · 우에노 · 도쿄역',
    famousShop: '아사쿠사 우나테츠 / 우에노 이즈에이 본점 / 아카사카 후키누키',
    priceJpy: '¥2,900 ~ ¥4,500',
    priceKrwApprox: '약 26,800원 ~ 41,500원',
    imageUrl: '/foods/unaju_eel.jpg',
    fallbackGradient: 'from-stone-900 via-amber-950 to-black',
    ratingScore: '★ 4.9',
    recommendBadge: '타베로그 장어 명가 추천',
    summary:
      '초벌로 기름기를 쏙 뺀 뒤 찐 다음, 100년 전통 간장 타레 소스를 발라 비장탄 숯불에 노릇하게 구워내어 입안에서 크림처럼 녹아내리는 도쿄식 장어덮밥입니다.',
    tastePoints: [
      '잔가시가 전혀 느껴지지 않을 정도로 부드럽고 달콤짭조름한 밥도둑',
      '히츠마부시로 주문하면 ①그대로 ②파·와사비 곁들여 ③따뜻한 다시 육수(오차즈케) 3가지 방식으로 즐길 수 있어요',
      '여행 첫날이나 마지막 날 가족 원기 회복 보양식으로 최고!'
    ],
    orderTip: '테이블의 산초 가루(산쇼)를 살짝 뿌리면 향긋함이 배가 됩니다 (아이들은 산초 없이 그대로!).',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆ (달콤한 간장양념!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (보양 특식 1위)',
    googleMapsQuery: 'Asakusa Unatetsu Eel',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '계란지단(錦糸卵) 및 계란말이(う巻き) 고명 확인',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '일부 장어덮밥(히츠마부시) 위에 계란지단(긴시타마고)이 올라가는 경우가 있으니, 현우 덮밥에는 계란 고명을 빼달라거나 따로 담아달라고 요청하세요!',
      customRemoveJp: 'うな重（ひつまぶし）の上に卵（錦糸卵・玉子）を乗せないでください。',
      customRemovePronunciation: '우나쥬(히츠마부시)노 우에니 타마고(킨시타마고)오 노세나이데 구다사이',
      customSeparateJp: '卵（錦糸卵・玉子）はご飯に乗せず、別皿に分けてください。',
      customSeparatePronunciation: '타마고(킨시타마고)와 고항니 노세즈, 베츠자라니 와케테 구다사이'
    }
  },
  {
    id: 'food_sukiyaki_wagyu',
    name: '140년 전통 관동식 A5 와규 스키야키 전골',
    japaneseName: '浅草今半 / 人形町今半 すき焼き',
    pronunciation: '와규 스키야키',
    category: 'MAIN_MEAL',
    categoryLabel: '메인 식사 · 와규 스키야키',
    dayNumber: 5,
    areaTag: '아사쿠사 · 긴자 · 도쿄역',
    famousShop: '아사쿠사 이마한 국제거리 본점 / 닌교초 이마한 긴자점',
    priceJpy: '¥3,800 ~ ¥6,600 (런치 세트 가성비 최고)',
    priceKrwApprox: '약 35,000원 ~ 61,000원',
    imageUrl: '/foods/sukiyaki_wagyu.jpg',
    fallbackGradient: 'from-rose-950 via-stone-900 to-black',
    ratingScore: '★ 4.9',
    recommendBadge: '가족 여행 만족도 1위 특식',
    summary:
      '특제 간장 와리시타 육수에 최상급 마블링 와규와 구운 두부, 파, 실곤약, 표고버섯을 자작하게 끓여 신선한 날계란 푼 물에 푹 찍어 먹는 일본 최고급 전골 요리입니다.',
    tastePoints: [
      '기모노를 입은 서버가 테이블에서 고기를 가장 맛있는 타이밍에 직접 구워주어 편하게 식사 가능',
      '고소한 계란물을 코팅한 달콤짭조름한 와규는 아이들도 감탄하며 먹는 맛',
      '마지막에 남은 고기 육수로 만들어 주는 폭신한 계란 덮밥(후와타마동)이 하이라이트!'
    ],
    orderTip: '저녁은 고가이지만 낮 11:30~15:00 런치 스키야키 정식/덮밥을 노리면 합리적인 가격에 즐길 수 있어요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (불고기 전골 상위호환!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (최고의 대접 느낌)',
    googleMapsQuery: 'Asakusa Imahan Sukiyaki',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '찍어 먹는 날계란 (生卵) & 마무리 계란덮밥',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '스키야키는 고기를 찍어 먹는 날계란(生卵)이 나오고 마지막에 계란덮밥을 만듭니다. 현우 몫은 날계란을 빼고, 마무리 밥도 계란 넣기 전에 따로 덜어달라고 요청하세요!',
      customRemoveJp: '子どもは卵アレルギーがあるため、すき焼きの生卵は不要です。締めの食事も卵を入れる前に取り分けてください。',
      customRemovePronunciation: '코도모와 타마고 아레루기가 아루타메, 스키야키노 나마타마고와 후요데스. 시메노 쇼쿠지모 타마고오 이레루 마에니 토리와케테 구다사이',
      customSeparateJp: '生卵は子どもの前には置かず、大人用に別でお願いします。お肉も卵をつけずにそのまま食べます。',
      customSeparatePronunciation: '나마타마고와 코도모노 마에니와 오카즈, 오토나요니 베츠데 오네가이시마스'
    }
  },

  // ==========================================
  // 2. 길거리 간식 · 시장 명물 (STREET_SNACK - 7선)
  // ==========================================
  {
    id: 'food_asakusa_melonpan',
    name: '아사쿠사 화월당 점보 메론빵 & 바닐라 아이스 샌드',
    japaneseName: '浅草花月堂 ジャンボめろんぱん',
    pronunciation: '점보 메론빵 / 아이스 메론빵',
    category: 'STREET_SNACK',
    categoryLabel: '길거리 간식 · 베이커리',
    dayNumber: 1,
    areaTag: '아사쿠사 센소지 나카미세도리',
    famousShop: '아사쿠사 카게츠도 (화월당 본점)',
    priceJpy: '¥300 (기본) / ¥600 (아이스크림 추가)',
    priceKrwApprox: '약 2,800원 ~ 5,500원',
    imageUrl: '/foods/melonpan.jpg',
    fallbackGradient: 'from-yellow-700 via-amber-800 to-stone-900',
    ratingScore: '★ 4.8',
    recommendBadge: '하루 3,000개 판매 명물',
    summary:
      '하루 3,000개 이상 팔리는 아사쿠사 명물! 손바닥보다 큰 갓 구운 메론빵으로, 겉은 소보로 쿠키처럼 바삭바삭하고 속은 솜사탕처럼 폭신합니다.',
    tastePoints: [
      '따뜻한 갓 구운 메론빵 사이에 차가운 바닐라 아이스크림을 끼운 단짠·온냉 조합 최고',
      '줄이 길어도 회전율이 엄청 빨라 5분 이내에 바로 받을 수 있어요',
      '센소지 풍경 배경으로 들고 사진 찍기 딱 좋은 비주얼'
    ],
    orderTip: '센소지 경내에서는 걸어 다니며 먹는 것(타베아루키)이 금지되어 있으니 가게 앞 지정 구역에서 드세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Asakusa Kagetsudo Melonpan'
  },
  {
    id: 'food_tsukiji_tamagoyaki',
    name: '쓰키지 시장 달콤 폭신 계란말이 꼬치 (타마고야키)',
    japaneseName: '築地 山長 串玉 (厚焼き玉子)',
    pronunciation: '쿠시타마 / 타마고야키',
    category: 'STREET_SNACK',
    categoryLabel: '시장 명물 · 길거리 간식',
    dayNumber: 5,
    areaTag: '쓰키지 장외시장',
    famousShop: '쓰키지 야마초 (山長) / 마루타케 (丸武)',
    priceJpy: '¥200',
    priceKrwApprox: '약 1,900원',
    imageUrl: '/foods/tamagoyaki.jpg',
    fallbackGradient: 'from-amber-600 via-yellow-800 to-stone-900',
    ratingScore: '★ 4.8',
    recommendBadge: '쓰키지 길거리 간식 1위',
    summary:
      '숙련된 장인이 눈앞에서 겹겹이 말아 구워내는 일본식 다시 계란말이 꼬치! 카스테라처럼 폭신하면서도 가쓰오 다시 육수가 촉촉하게 배어 있습니다.',
    tastePoints: [
      '200엔(약 1,900원)이라는 착한 가격에 즐기는 쓰키지 시장 부동의 1위 간식',
      '김이 모락모락 나는 따뜻한 상태에서 한 입 베어 물면 달콤한 육즙이 가득',
      '갈아낸 무(다이콘 오로시)를 살짝 올려 먹으면 깔끔한 뒷맛'
    ],
    orderTip: '주문 시 "아마메(달콤한 맛)"를 선택하면 아이들이 카스테라처럼 정말 잘 먹습니다.',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Tsukiji Yamacho Tamagoyaki',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '100% 계란말이 (타마고야키 · 玉子焼き)',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '이 메뉴는 100% 계란말이 꼬치이므로 계란 알레르기가 있는 현우는 먹지 않도록 주의하세요! (세현이와 엄마들만 시식하고 현우는 옆 가게 멘치카츠·딸기모찌 추천)',
      customRemoveJp: '※この商品は100%玉子焼きのため、卵アレルギーのお子様（현우）は召し上がれません。',
      customRemovePronunciation: '코노 쇼힌와 햐쿠파센토 타마고야키노 타메, 타마고 아레루기노 오코사마와 메시아가레마셍'
    }
  },
  {
    id: 'food_asakusa_menchikatsu',
    name: '아사쿠사 육즙 폭발 흑모 와규 멘치카츠',
    japaneseName: '浅草メンチ (黒毛和牛メンチカツ)',
    pronunciation: '아사쿠사 멘치',
    category: 'STREET_SNACK',
    categoryLabel: '길거리 간식 · 수제 고로케',
    dayNumber: 1,
    areaTag: '아사쿠사 센소지 전보인도리',
    famousShop: '아사쿠사 멘치 (浅草メンチ)',
    priceJpy: '¥350',
    priceKrwApprox: '약 3,200원',
    imageUrl: '/foods/menchikatsu.jpg',
    fallbackGradient: 'from-orange-800 via-amber-900 to-zinc-900',
    ratingScore: '★ 4.9',
    recommendBadge: '아사쿠사 먹방 투어 필수',
    summary:
      '바삭한 생빵가루 튀김옷을 한 입 베어 무는 순간 달콤한 양파와 고소한 소고기·돼지고기 육즙이 폭포처럼 쏟아져 나오는 아사쿠사 최고의 고기 간식입니다.',
    tastePoints: [
      '소스 없이 그대로 먹어도 간이 딱 맞는 진한 고기 감칠맛',
      '메론빵 먹은 직후 단짠 조합으로 하나씩 사 먹기 최고',
      '갓 튀겨 나와 바삭함이 살아있는 황금빛 튀김옷'
    ],
    orderTip: '한 입 베어 물 때 뜨거운 육즙이 튈 수 있으니 살짝 식혀서 베어 물기!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★',
    momFavoriteScore: '엄마들 선호도 ★★★★☆',
    googleMapsQuery: 'Asakusa Menchi'
  },
  {
    id: 'food_takoyaki',
    name: '겉바속촉 프리미엄 왕문어 타코야키',
    japaneseName: '築地銀だこ (긴다코 타코야키)',
    pronunciation: '타코야키',
    category: 'STREET_SNACK',
    categoryLabel: '길거리 간식 · 타코야키',
    dayNumber: 3,
    areaTag: '시부야 · 소라마치 · 도쿄 전역',
    famousShop: '쓰키지 긴다코 (시부야 / 스카이트리 소라마치점)',
    priceJpy: '¥680 ~ ¥780 (8알)',
    priceKrwApprox: '약 6,300원 ~ 7,200원',
    imageUrl: '/foods/takoyaki.jpg',
    fallbackGradient: 'from-red-900 via-amber-900 to-stone-900',
    ratingScore: '★ 4.7',
    recommendBadge: '국민 길거리 간식 대표',
    summary:
      '마지막에 기름을 살짝 둘러 겉은 과자처럼 바삭하고, 속은 크리미한 반죽과 큼직하고 탱글탱글한 문어가 씹히는 일본 대표 간식입니다.',
    tastePoints: [
      '일반 타코야키와 차원이 다른 바삭한 식감과 왕문어 조각',
      '데리야키 계란 토핑(데리타마)이나 명란 치즈 토핑도 인기 만점',
      '쇼핑몰 푸드코트 어디서나 쉽게 만날 수 있는 출출할 때의 구원투수'
    ],
    orderTip: '기본 오리지널 8알 + 데리타마(계란샐러드) 8알 반반 주문 추천!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★',
    momFavoriteScore: '엄마들 선호도 ★★★★☆',
    googleMapsQuery: 'Gindaco Tokyo Skytree Solamachi',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '계란 샐러드 토핑 (데리타마 · てりたま)',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '반죽은 괜찮지만 위에 삶은 계란 샐러드가 올라가는 "데리타마" 메뉴는 피하고, 현우 것은 계란 토핑이 없는 기본 오리지널 타코야키로 주문하거나 계란 토핑을 따로 담아달라고 요청하세요!',
      customRemoveJp: '卵トッピング（てりたま・ゆで卵サラダ）は乗せないでください。普通のたこ焼きでお願いします。',
      customRemovePronunciation: '타마고 톳핑구(테리타마·유데타마고 사라다)와 노세나이데 구다사이. 후츠노 타코야키데 오네가이시마스',
      customSeparateJp: '上の卵サラダ（たまごトッピング）はたこ焼きに乗せず、別皿に分けてください。',
      customSeparatePronunciation: '우에노 타마고 사라다와 타코야키니 노세즈, 베츠자라니 와케테 구다사이'
    }
  },
  {
    id: 'food_mitarashi_dango',
    name: '숯불에 구운 단짠 간장 조청 미타라시 당고 꼬치',
    japaneseName: 'みたらし団子 (浅草きびだんご あづま / 追分だんご)',
    pronunciation: '미타라시 당고 / 키비당고',
    category: 'STREET_SNACK',
    categoryLabel: '전통 길거리 간식 · 당고 꼬치',
    dayNumber: 1,
    areaTag: '아사쿠사 센소지 · 신주쿠',
    famousShop: '아사쿠사 키비당고 아즈마 / 신주쿠 오이와케 당고 본점',
    priceJpy: '¥200 ~ ¥400',
    priceKrwApprox: '약 1,900원 ~ 3,700원',
    imageUrl: '/foods/mitarashi_dango.jpg',
    fallbackGradient: 'from-amber-800 via-yellow-900 to-stone-900',
    ratingScore: '★ 4.8',
    recommendBadge: '센소지 산책 인증샷 간식',
    summary:
      '쫄깃쫄깃한 쌀떡 꼬치를 숯불에 노릇하게 구워낸 뒤, 반짝반짝 윤기가 흐르는 달콤짭조름한 특제 간장 조청 소스를 듬뿍 입힌 일본 전통 길거리 간식입니다.',
    tastePoints: [
      '갓 구워 따뜻한 떡의 쫀득함과 단짠 간장 소스의 중독성 있는 조화',
      '고소한 콩고물이 듬뿍 묻은 키비당고(수수경단) 5꼬치 세트도 한 입 크기라 아이들에게 인기',
      '겨울에는 따뜻한 말차나 호지차와 함께 곁들여 먹으면 최고!'
    ],
    orderTip: '소스가 옷에 흐르지 않게 받침 종이를 받치고 한 알씩 빼먹으세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (쫀득 달콤!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Asakusa Kibidango Azuma'
  },
  {
    id: 'food_calbee_poteriko',
    name: '매장에서 갓 튀겨 주는 따뜻한 가루비 포테리코',
    japaneseName: 'カルビープラス 揚げたてポテりこ サラダ',
    pronunciation: '포테리코 사라다',
    category: 'STREET_SNACK',
    categoryLabel: '길거리 간식 · 즉석 수제 감자튀김',
    dayNumber: 3,
    areaTag: '도쿄역 이치반가이 · 하라주쿠 다케시타도리',
    famousShop: '가루비 플러스 (Calbee+ 도쿄역 오카시랜드점 / 하라주쿠점)',
    priceJpy: '¥340 ~ ¥390',
    priceKrwApprox: '약 3,100원 ~ 3,600원',
    imageUrl: '/foods/calbee_poteriko.jpg',
    fallbackGradient: 'from-yellow-700 via-orange-900 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '아이들 재구매율 1위 간식',
    summary:
      '일본 국민 과자 자가리코를 매장에서 즉석으로 튀겨 주는 특별 메뉴! 겉은 바삭하고 속은 찐감자처럼 포슬포슬하고 부드러워 한 번 맛보면 무조건 하나 더 사게 되는 마성의 간식입니다.',
    tastePoints: [
      '일반 과자 자가리코와는 완전히 다른 따뜻하고 포슬포슬한 감자 크로켓 식감',
      '도쿄역 캐릭터 스트리트(이치반가이) 구경하며 먹기 딱 좋은 위치',
      '홋카이도 버터 맛이나 치즈 소스 토핑 추가 메뉴도 별미!'
    ],
    orderTip: '1컵만 사면 무조건 부족해서 다시 줄 서게 되니 처음부터 1인 1컵 주문 강력 추천!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (무조건 2번 먹음!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Calbee Plus Tokyo Station'
  },
  {
    id: 'food_yakitori_karaage',
    name: '비장탄 숯불 파닭 꼬치구이 (야키토리) & 육즙 가라아게',
    japaneseName: '炭火焼鳥 ねぎま・つくね・唐揚げ',
    pronunciation: '야키토리 (네기마 / 츠쿠네) & 카라아게',
    category: 'STREET_SNACK',
    categoryLabel: '길거리·시장 명물 · 숯불 꼬치구이',
    dayNumber: 4,
    areaTag: '신주쿠 · 시부야 · 아사쿠사',
    famousShop: '토리키조쿠 (시부야/신주쿠점) / 쓰키지 시장 꼬치 골목',
    priceJpy: '¥370 ~ ¥650',
    priceKrwApprox: '약 3,400원 ~ 6,000원',
    imageUrl: '/foods/yakitori_karaage.jpg',
    fallbackGradient: 'from-amber-900 via-stone-900 to-black',
    ratingScore: '★ 4.8',
    recommendBadge: '현지인 저녁 간식 베스트',
    summary:
      '참숯 향이 솔솔 배어든 부드러운 닭다리살과 달콤한 대파를 번갈아 꽂아 구운 네기마 꼬치, 다진 고기 완자 츠쿠네, 바삭한 일본식 닭튀김 가라아게입니다.',
    tastePoints: [
      '달콤한 간장 양념(타레) 구이는 아이들 입맛에 100% 적중하는 밥·간식 반찬',
      '토리키조쿠에서는 전 메뉴 균일가로 부담 없이 여러 종류의 꼬치를 맛볼 수 있어요',
      '양배추 샐러드와 치즈 츠쿠네(계란 노른자 찍어 먹는 완자 꼬치)가 최고 인기!'
    ],
    orderTip: '아이들용은 소금구이(시오)보다 달콤한 간장양념인 "타레(タレ)"로 주문하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (치킨·꼬치 러버)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Torikizoku Shibuya',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '츠쿠네 날계란 노른자 토핑 (츠키미 · 月見卵黄)',
      defaultMode: 'SEPARATE',
      hyunwooTip:
        '닭완자 꼬치(츠쿠네) 주문 시 날계란 노른자(츠키미)가 올라가는 메뉴가 있습니다. 현우가 먹을 꼬치에는 계란 노른자를 빼거나 별도 종지에 따로 담아달라고 요청하세요!',
      customRemoveJp: 'つくね（焼鳥）に卵（生卵・卵黄）をつけないでください（卵抜きでお願いします）。',
      customRemovePronunciation: '츠쿠네(야키토리)니 타마고(나마타마고·란오)오 츠케나이데 구다사이',
      customSeparateJp: 'つくねの卵（生卵・卵黄）は串に乗せず、別の小皿（別皿）でお願いします。',
      customSeparatePronunciation: '츠쿠네노 타마고(란오)와 쿠시니 노세즈, 베츠노 코자라(베츠자라)데 오네가이시마스'
    }
  },

  // ==========================================
  // 3. 유명 디저트 · 스위츠 카페 (DESSERT_SWEETS - 7선)
  // ==========================================
  {
    id: 'dessert_ichigo_daifuku',
    name: '제철 생딸기 찹쌀떡 (이치고 다이후쿠) & 딸기 당고 꼬치',
    japaneseName: '浅草 苺大福・いちご団子 (そらつき)',
    pronunciation: '이치고 다이후쿠 / 이치고 당고',
    category: 'DESSERT_SWEETS',
    categoryLabel: '전통 디저트 · 생딸기 모찌',
    dayNumber: 1,
    areaTag: '아사쿠사 · 쓰키지 장외시장',
    famousShop: '아사쿠사 소라츠키 (そらつき) / 쓰키지 솔라츠키',
    priceJpy: '¥400 ~ ¥650',
    priceKrwApprox: '약 3,700원 ~ 6,000원',
    imageUrl: '/foods/ichigo_daifuku.jpg',
    fallbackGradient: 'from-pink-900 via-rose-900 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '겨울 도쿄 딸기 디저트 1위',
    summary:
      '말랑하고 쫀득한 찹쌀 모찌와 부드러운 백앙금·통팥앙금 위에 보석처럼 크고 달콤한 일본산 생딸기를 통째로 얹은 비주얼 끝판왕 디저트입니다.',
    tastePoints: [
      '1월 겨울이 일본 딸기 당도가 가장 높은 제철이라 과즙이 엄청 달콤해요!',
      '알록달록한 딸기 4알 꼬치와 말차·밀크 앙금 모찌는 인증샷 필수템',
      '아사쿠사나 쓰키지 시장 골목에서 한 손에 들고 먹기 간편함'
    ],
    orderTip: '하얀 밀크 앙금(시로앙) 생딸기 모찌가 부드럽고 달콤해 가장 인기가 많습니다.',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (인생샷 디저트!)',
    googleMapsQuery: 'Asakusa Soratsuki Strawberry'
  },
  {
    id: 'dessert_souffle_pancake',
    name: '구름처럼 폭신한 도쿄 수플레 팬케이크',
    japaneseName: '奇跡のパンケーキ (FLIPPER’S / 幸せのパンケーキ)',
    pronunciation: '키세키노 판케키 (수플레 팬케이크)',
    category: 'DESSERT_SWEETS',
    categoryLabel: '카페 디저트 · 수플레 팬케이크',
    dayNumber: 4,
    areaTag: '시부야 · 오모테산도 · 긴자',
    famousShop: '플리퍼스 (FLIPPER’S 시부야점) / 행복한 팬케이크 오모테산도점',
    priceJpy: '¥1,430 ~ ¥1,760',
    priceKrwApprox: '약 13,200원 ~ 16,200원',
    imageUrl: '/foods/souffle_pancake.jpg',
    fallbackGradient: 'from-amber-700 via-orange-900 to-stone-900',
    ratingScore: '★ 4.8',
    recommendBadge: '엄마들 카페 힐링 원픽',
    summary:
      '포크를 대는 순간 사르르 녹아내리는 구름 같은 식감! 신선한 계란 머랭으로 반죽해 20분간 정성껏 구워낸 도쿄 대표 프리미엄 디저트입니다.',
    tastePoints: [
      '칼을 쓰지 않고 포크 두 개로 살짝 벌려서 메이플 버터 크림과 함께 먹는 방식',
      '제철 생딸기와 바닐라빈 생크림이 듬뿍 올라간 시즌 메뉴 강추',
      '오후 일정 중 엄마들의 당 충전 & 다리 휴식 타임에 최고의 카페 코스'
    ],
    orderTip: '주문 후 굽는 데 20분 정도 걸리니 카페 입장 후 바로 주문부터 하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (엄마들 힐링 타임!)',
    googleMapsQuery: 'FLIPPERS Shibuya Souffle Pancake',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '계란 흰자 머랭 반숙 식감 (メレンゲ・卵)',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '일반 빵은 괜찮지만 수플레 팬케이크는 계란 머랭 비중이 매우 높은 반숙 식감이므로, 현우는 생과일·생크림 위주로 맛보거나 브런치 메뉴의 계란프라이/스크램블을 빼달라고 요청하세요!',
      customRemoveJp: '付け合わせの卵料理（目玉焼き・スクランブルエッグ等）は抜いてください。',
      customRemovePronunciation: '츠케아와세노 타마고 료리(메다마야키·스쿠란부루 엣구 토)와 누이테 구다사이',
      customSeparateJp: '卵（目玉焼き・スクランブルエッグ等）は別皿に分けて出してください。',
      customSeparatePronunciation: '타마고와 베츠자라니 와케테 다시테 구다사이'
    }
  },
  {
    id: 'dessert_harajuku_crepe',
    name: '하라주쿠·시부야 생딸기 치즈케이크 크레페',
    japaneseName: '原宿 マリオンクレープ (いちごチーズケーキ)',
    pronunciation: '이치고 치즈케키 크레페',
    category: 'DESSERT_SWEETS',
    categoryLabel: '길거리 디저트 · 일본식 크레페',
    dayNumber: 4,
    areaTag: '하라주쿠 다케시타도리 · 시부야',
    famousShop: '마리온 크레페 (MARION CREPES) / 산타모니카 크레페',
    priceJpy: '¥650 ~ ¥850',
    priceKrwApprox: '약 6,000원 ~ 7,800원',
    imageUrl: '/foods/harajuku_crepe.jpg',
    fallbackGradient: 'from-rose-800 via-pink-900 to-stone-900',
    ratingScore: '★ 4.7',
    recommendBadge: '다케시타도리 명물 디저트',
    summary:
      '얇고 쫀득하게 구운 따뜻한 크레페 반죽 속에 시원한 바닐라 아이스크림, 꾸덕한 치즈케이크 조각, 생딸기, 생크림을 꽃다발처럼 말아 주는 도쿄 청춘 디저트입니다.',
    tastePoints: [
      '쇼케이스에 진열된 70여 가지 크레페 모형을 구경하며 고르는 재미',
      '번호만으로 주문할 수 있어 일본어를 몰라도 3초 만에 주문 끝!',
      '초코 바나나 아이스크림 크레페와 딸기 치즈케이크 크레페가 부동의 1·2위'
    ],
    orderTip: '가게 앞 모형에 적힌 숫자(예: "No. 45 구다사이!")만 말하면 바로 만들어 줍니다.',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★',
    momFavoriteScore: '엄마들 선호도 ★★★★☆',
    googleMapsQuery: 'Marion Crepes Harajuku'
  },
  {
    id: 'dessert_matcha_parfait',
    name: '세계 최고 농도 1~7단계 말차 젤라또 & 말차 파르페',
    japaneseName: '壽々喜園 世界一濃い抹茶ジェラート・抹茶パフェ',
    pronunciation: '맛챠 파페 / 맛챠 제라토',
    category: 'DESSERT_SWEETS',
    categoryLabel: '프리미엄 디저트 · 말차 스위츠',
    dayNumber: 5,
    areaTag: '아사쿠사 · 긴자 · 도쿄역',
    famousShop: '아사쿠사 스즈키엔 (1~7단계 말차) / 나카무라 토키치 긴자식스점',
    priceJpy: '¥650 ~ ¥1,650',
    priceKrwApprox: '약 6,000원 ~ 15,200원',
    imageUrl: '/foods/matcha_parfait.jpg',
    fallbackGradient: 'from-emerald-900 via-green-950 to-stone-950',
    ratingScore: '★ 4.9',
    recommendBadge: '말차 덕후 성지 디저트',
    summary:
      '세계에서 가장 진한 1단계~7단계 말차 젤라또와 쫀득한 시라타마(새알심), 밤 조림, 말차 생크림을 층층이 쌓아 올린 일본 정통 말차 디저트입니다.',
    tastePoints: [
      '말차 농도를 1단계(부드러운 맛)부터 7단계(기네스급 최고 농도)까지 직접 선택 가능',
      '말차가 낯선 아이들은 달콤한 호지차(볶은 녹차)나 딸기·밀크 맛과 더블컵으로 조합 가능',
      '긴자 식사 후 깔끔하게 입가심하기 좋은 고급스러운 풍미'
    ],
    orderTip: '3단계 말차 + 7단계 말차(또는 밀크) 2가지 맛 더블컵이 가장 밸런스가 좋습니다.',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (고급 디저트)',
    googleMapsQuery: 'Suzukien Asakusa Matcha Gelato'
  },
  {
    id: 'dessert_ringo_applepie',
    name: '144겹 바삭 페이스트리 수제 커스터드 애플파이 (링고)',
    japaneseName: '焼きたてカスタードアップルパイ RINGO',
    pronunciation: '야키타테 카스타도 압푸루파이 링고',
    category: 'DESSERT_SWEETS',
    categoryLabel: '베이커리 디저트 · 수제 애플파이',
    dayNumber: 4,
    areaTag: '이케부쿠로 · 신주쿠 · 도쿄역',
    famousShop: 'RINGO 이케부쿠로 본점 (해리포터 환승역) / 오미야·신주쿠점',
    priceJpy: '¥520 (1개)',
    priceKrwApprox: '약 4,800원',
    imageUrl: '/foods/ringo_applepie.jpg',
    fallbackGradient: 'from-red-900 via-amber-800 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '굽자마자 완판되는 인생 파이',
    summary:
      '해리포터 스튜디오 가는 길(이케부쿠로역)에서 고소한 버터 향기로 발길을 붙잡는 1위 디저트! 144겹의 바삭한 파이 속에 아오모리산 큼직한 사과 조림과 진한 생커스터드 크림이 꽉 차 있습니다.',
    tastePoints: [
      '계피(시나몬) 향이 거의 없어 시나몬을 싫어하는 아이들도 눈이 동그래지며 잘 먹어요',
      '갓 구워 따뜻할 때 먹으면 바삭하고, 숙소 냉장고에 넣었다 먹으면 아이스크림처럼 꾸덕한 맛',
      '이케부쿠로역 동쪽 출구 바로 앞이라 이동 중 테이크아웃하기 최고!'
    ],
    orderTip: '기본 커스터드 애플파이 + 겨울 시즌 한정(초코 또는 딸기 애플파이)을 섞어 담아보세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (사과+커스터드 꿀조합)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (아메리카노 짝꿍)',
    googleMapsQuery: 'RINGO Ikebukuro Apple Pie'
  },
  {
    id: 'dessert_harbs_millecrepe',
    name: '제철 생과일 6종이 겹겹이 들어간 하브스 밀크레이프',
    japaneseName: 'HARBS (ハーブス) ミルクレープ',
    pronunciation: '하브스 미루쿠레푸',
    category: 'DESSERT_SWEETS',
    categoryLabel: '명품 카페 · 생과일 밀크레이프',
    dayNumber: 5,
    areaTag: '신주쿠 · 시부야 · 긴자 · 롯폰기',
    famousShop: '하브스 (HARBS 시부야 히카리에점 / 루미네 에스트 신주쿠 / 긴자 마로니에 게이트)',
    priceJpy: '¥1,050 ~ ¥1,150 (1피스)',
    priceKrwApprox: '약 9,700원 ~ 10,600원',
    imageUrl: '/foods/harbs_millecrepe.jpg',
    fallbackGradient: 'from-amber-600 via-rose-900 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '도쿄 카페 투어 부동의 1위',
    summary:
      '얇게 구운 크레이프 시트 6장 사이에 신선한 멜론, 딸기, 키위, 바나나와 부드러운 커스터드·생크림을 아낌없이 쌓아 올린 도쿄 디저트 카페의 전설입니다.',
    tastePoints: [
      '일반 조각 케이크의 1.5~2배 크기라 한 조각만 시켜도 과일이 쏟아질 듯 푸짐해요',
      '크림이 전혀 느끼하지 않고 생과일의 상큼한 과즙이 입안 가득 퍼지는 맛',
      '매장이 혼잡할 때는 테이크아웃 줄을 이용하면 대기 없이 바로 포장해 숙소에서 즐길 수 있어요'
    ],
    orderTip: '시그니처인 "밀크레이프(Mille Crepes)"와 겨울 한정 "스트로베리 케이크" 조합이 최고 인기!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (과일 폭탄 케이크)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (도쿄 1순위 카페!)',
    googleMapsQuery: 'HARBS Shibuya Hikarie'
  },
  {
    id: 'dessert_montblanc_chestnut',
    name: '눈앞에서 실타래처럼 짜주는 1mm 생밤 와구리 몽블랑',
    japaneseName: '生搾り和栗モンブラン (浅草 茶々工房ふつう / 銀座)',
    pronunciation: '나마시보리 와구리 몽브랑',
    category: 'DESSERT_SWEETS',
    categoryLabel: '프리미엄 디저트 · 생밤 몽블랑',
    dayNumber: 5,
    areaTag: '아사쿠사 · 긴자 · 오모테산도',
    famousShop: '아사쿠사 차차 코보 후츠우 / 히사야 교토 마론 긴자 / 푸글렌 인근 카페',
    priceJpy: '¥1,400 ~ ¥1,900',
    priceKrwApprox: '약 13,000원 ~ 17,500원',
    imageUrl: '/foods/montblanc_chestnut.jpg',
    fallbackGradient: 'from-amber-900 via-stone-800 to-zinc-950',
    ratingScore: '★ 4.8',
    recommendBadge: 'SNS 화제의 프리미엄 디저트',
    summary:
      '주문 즉시 눈앞에서 일본산 최고급 밤(와구리) 페이스트를 1mm 굵기의 고운 실타래처럼 바삭한 머랭과 아이스크림 위에 소복하게 짜서 올려주는 퍼포먼스 디저트입니다.',
    tastePoints: [
      '전용 프레스 기계에서 밤 실타래가 쏟아져 내려오는 순간 동영상 촬영 필수!',
      '인공적인 단맛이 아닌 진짜 구운 밤 본연의 깊고 고소한 풍미와 사르르 녹는 식감',
      '속에 숨어있는 바삭한 머랭 쿠키와 우유 아이스크림이 밤 크림과 환상 궁합'
    ],
    orderTip: '나오자마자 공기와 닿기 전 5분 이내에 첫 입을 먹어야 가장 촉촉하고 부드럽습니다!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆ (신기한 볼거리!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (엄마들 취향 저격)',
    googleMapsQuery: 'Asakusa Mont Blanc Chestnut'
  },

  // ==========================================
  // 4. 테마파크 · 스페셜 간식 (THEME_PARK - 5선)
  // ==========================================
  {
    id: 'themepark_butterbeer',
    name: '해리포터 스튜디오 도쿄 황금빛 버터맥주 (논알콜)',
    japaneseName: 'ワーナー ブラザース スタジオツアー バタービール',
    pronunciation: '바타 비루 (버터비어)',
    category: 'THEME_PARK',
    categoryLabel: '테마파크 명물 · 해리포터 스튜디오',
    dayNumber: 4,
    areaTag: '네리마 · 해리포터 스튜디오 도쿄',
    famousShop: '해리포터 스튜디오 백랏 카페 (Backlot Cafe) 옆 버터맥주 바',
    priceJpy: '¥1,250 (기념 머그컵 포함, 컵 소장 가능!)',
    priceKrwApprox: '약 11,500원',
    imageUrl: '/foods/butterbeer.jpg',
    fallbackGradient: 'from-amber-700 via-yellow-900 to-stone-950',
    ratingScore: '★ 4.9',
    recommendBadge: '해리포터 투어 필수 인증샷',
    summary:
      '알코올이 전혀 들어있지 않아 현우·세현 대원도 마실 수 있는 마법 세계 음료! 톡 쏘는 캐러멜 진저에일 위에 달콤하고 쫀득한 버터스카치 크림 거품이 듬뿍 올라갑니다.',
    tastePoints: [
      '입술 위에 하얀 버터크림 거품 수염을 묻히고 형제 인증샷 찍기 필수 코스!',
      '다 마신 뒤 전용 세척대에서 플라스틱 기념 맥주잔을 깨끗이 씻어 집으로 가져갈 수 있어요',
      '스튜디오 투어 중간 지점 야외 광장(9와 3/4 승강장 근처)에서 판매'
    ],
    orderTip: '기념 컵을 담아갈 비닐봉투가 함께 제공되니 가방에 쏙 넣어 기념품으로 챙기세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (기념컵 소장!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Warner Bros Studio Tour Tokyo The Making of Harry Potter'
  },
  {
    id: 'themepark_taiyaki_mochi',
    name: '디즈니씨 토이스토리 리틀 그린맨 3색 크림 모찌',
    japaneseName: '東京ディズニーシー リトルグリーンまん',
    pronunciation: '리토루 그린망 (3구 세트)',
    category: 'THEME_PARK',
    categoryLabel: '테마파크 명물 · 디즈니씨 시그니처',
    dayNumber: 2,
    areaTag: '도쿄 디즈니씨 전 구역',
    famousShop: '도쿄 디즈니씨 (맘마 비스코티즈 베이커리 / 수프림 카트)',
    priceJpy: '¥400 (3개입 한 컵)',
    priceKrwApprox: '약 3,700원',
    imageUrl: '/foods/taiyaki_mochi.jpg',
    fallbackGradient: 'from-emerald-800 via-teal-900 to-slate-900',
    ratingScore: '★ 4.9',
    recommendBadge: '디즈니씨 귀여움 폭발 1위',
    summary:
      '디즈니씨에서 무조건 먹어야 하는 토이스토리 외계인 캐릭터 모찌! 말랑말랑하고 차가운 연두색 찹쌀떡 3알 속에 초콜릿, 딸기, 커스터드 크림이 각각 하나씩 들어 있습니다.',
    tastePoints: [
      '누가 초코맛, 딸기맛, 커스터드맛을 뽑을지 형제끼리 골라 먹는 재미',
      '디즈니씨 앱 모바일 오더나 간식 카트에서 간편하게 사서 어트랙션 대기하며 먹기 최고',
      '한 입에 쏙 들어가는 크기라 손에 묻지 않고 깔끔해요'
    ],
    orderTip: '오후 늦게는 품절되는 경우가 있으니 오전에 발견 즉시 구매하거나 모바일 오더로 주문하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Tokyo DisneySea Mamma Biscottis Bakery'
  },
  {
    id: 'themepark_disney_turkey_leg',
    name: '디즈니씨 육즙 가득 스모크 터키레그 (훈제 칠면조 다리)',
    japaneseName: 'スモークターキーレッグ (東京ディズニーシー)',
    pronunciation: '스모쿠 타키 렛구',
    category: 'THEME_PARK',
    categoryLabel: '테마파크 명물 · 디즈니씨 고기 간식',
    dayNumber: 2,
    areaTag: '도쿄 디즈니씨 · 아메리칸 워터프론트 / 로스트리버 델타',
    famousShop: '디즈니씨 리프레쉬먼트 스테이션 / 로스트리버 쿡하우스',
    priceJpy: '¥900',
    priceKrwApprox: '약 8,300원',
    imageUrl: '/foods/disney_turkey_leg.jpg',
    fallbackGradient: 'from-rose-900 via-amber-950 to-stone-950',
    ratingScore: '★ 4.8',
    recommendBadge: '디즈니 든든한 고기 간식 1위',
    summary:
      '만화 속 고기처럼 거대한 비주얼을 자랑하는 훈제 칠면조 다리 구이! 훈연 향이 진하게 배어 있고 쫄깃하면서도 촉촉한 육즙이 가득해 놀이공원 체력 보충 1순위 간식입니다.',
    tastePoints: [
      '성인 팔뚝만 한 압도적 크기로 아이들이 양손으로 들고 뜯는 재미 만점',
      '햄처럼 짭조름하고 고소한 훈제 풍미라 식당 예약 사이 출출할 때 한 끼 대용으로 충분!',
      '포장지가 손잡이 부분을 감싸주어 걸어 다니거나 벤치에 앉아 먹기 편해요'
    ],
    orderTip: '물티슈를 미리 준비해 두면 다 먹은 뒤 손을 닦기 훨씬 편합니다!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (만화 고기 비주얼!)',
    momFavoriteScore: '엄마들 선호도 ★★★★☆',
    googleMapsQuery: 'Tokyo DisneySea Refreshment Station'
  },
  {
    id: 'themepark_disney_churros',
    name: '디즈니씨 미키 시나몬·초코 츄러스 & 데미글라스 포테이토 츄러스',
    japaneseName: 'ミッキーチュロス / デミグラス・チュロス (ポテト)',
    pronunciation: '밋키 츄로스 / 포테토 츄로스',
    category: 'THEME_PARK',
    categoryLabel: '테마파크 명물 · 디즈니 츄러스',
    dayNumber: 2,
    areaTag: '도쿄 디즈니씨 · 미스테리어스 아일랜드 / 아라비안 코스트',
    famousShop: '디즈니씨 노틸러스 갤리 / 오픈 세서미 / 파크 전역 카트',
    priceJpy: '¥450 ~ ¥550',
    priceKrwApprox: '약 4,200원 ~ 5,100원',
    imageUrl: '/foods/disney_churros.jpg',
    fallbackGradient: 'from-amber-800 via-orange-950 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '어트랙션 대기줄 필수 간식',
    summary:
      '단면을 자르면 귀여운 미키마우스 얼굴 모양이 나타나는 바삭한 시나몬·초코 츄러스와, 오직 도쿄 디즈니씨 미스테리어스 아일랜드에서만 파는 짭조름한 데미글라스 감자 츄러스입니다.',
    tastePoints: [
      '한 입 베어 물고 단면의 미키마우스 실루엣을 찾아보는 재미!',
      '미스테리어스 아일랜드의 "데미글라스 포테이토 츄러스"는 겉은 쫀득한 감자떡 같고 속은 고기 소스가 들어있는 단짠 별미',
      '아라비안 코스트의 "차이 슈가 츄러스"도 향긋하고 달콤해 추천이 엄청 많아요'
    ],
    orderTip: '달콤한 미키 시나몬 츄러스 1개 + 짭조름한 데미글라스 포테이토 츄러스 1개 조합 강추!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (대기 시간 순삭!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Tokyo DisneySea Mysterious Island'
  },
  {
    id: 'themepark_hp_roastbeef',
    name: '해리포터 호그와트 기숙사 플레이트 (로스트비프 & 피쉬앤칩스)',
    japaneseName: 'グリフィンドールプレート (ローストビーフ) / フィッシュ＆チップス',
    pronunciation: '그리핀도루 푸레토 / 핏슈 앤 칩스',
    category: 'THEME_PARK',
    categoryLabel: '테마파크 식사 · 해리포터 스튜디오',
    dayNumber: 4,
    areaTag: '네리마 · 해리포터 스튜디오 도쿄',
    famousShop: '해리포터 스튜디오 백랏 카페 (Backlot Cafe) / 푸드홀',
    priceJpy: '¥2,200 ~ ¥3,200 (음료 포함 세트)',
    priceKrwApprox: '약 20,300원 ~ 29,500원',
    imageUrl: '/foods/hp_roastbeef.jpg',
    fallbackGradient: 'from-red-950 via-amber-950 to-stone-950',
    ratingScore: '★ 4.8',
    recommendBadge: '마법세계 테마 런치 베스트',
    summary:
      '호그와트 입학 첫날 연회장에서 먹던 만찬을 그대로 재현한 그리핀도르 로스트비프 플레이트(요크셔푸딩·그레이비 소스)와 바삭한 영국식 피쉬앤칩스입니다.',
    tastePoints: [
      '그리핀도르·슬리데린·후플푸프·래번클로 4대 기숙사 테마 요리 중 선택하는 재미',
      '테마파크 음식임에도 로스트비프 고기가 두툼하고 부드러워 평점이 매우 높아요',
      '귀여운 부엉이 헤드위그 케이크나 맨드레이크 화분 초콜릿 파르페를 후식으로 곁들이면 완벽!'
    ],
    orderTip: '스튜디오 투어 절반 지점에 있는 "백랏 카페"에 도착하자마자 자리를 잡고 주문하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (호그와트 학생 체험!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Backlot Cafe Warner Bros Studio Tour Tokyo'
  },

  // ==========================================
  // 5. 편의점 필수 털이 · 야식 (KONBINI - 5선)
  // ==========================================
  {
    id: 'konbini_tamago_sando',
    name: '일본 편의점 1위 타마고 산도 (폭신 계란 샐러드 샌드위치)',
    japaneseName: 'セブンイレブン たまごサンド (계란 샌드위치)',
    pronunciation: '타마고 산도',
    category: 'KONBINI',
    categoryLabel: '편의점 필수템 · 샌드위치',
    dayNumber: 1,
    areaTag: '세븐일레븐 · 로손 · 패밀리마트 (숙소 근처)',
    famousShop: '세븐일레븐 / 로손 (LAWSON) 전 매장',
    priceJpy: '¥270 ~ ¥320',
    priceKrwApprox: '약 2,500원 ~ 3,000원',
    imageUrl: '/foods/tamago_sando.jpg',
    fallbackGradient: 'from-yellow-700 via-amber-900 to-slate-900',
    ratingScore: '★ 4.9',
    recommendBadge: '전 세계 셰프 극찬 편의점 1위',
    summary:
      '세계적인 셰프들도 극찬한 일본 편의점의 전설! 구름처럼 촉촉한 식빵 사이에 진하고 고소한 노른자 계란 샐러드가 빈틈없이 꽉 차 있는 아침·야식 부동의 1위 메뉴입니다.',
    tastePoints: [
      '식빵 테두리가 전혀 딱딱하지 않고 입안에서 크림처럼 녹아내리는 식감',
      '편의점 계산대 옆 핫푸드 코너의 치킨(파미치키·가라아게군)을 사이에 끼워 먹으면 꿀조합!',
      '아침 일찍 디즈니씨나 후지산 투어 출발할 때 이동 전 아침 식사로 최고'
    ],
    orderTip: '돈카츠가 들어간 "카츠산도(돈카츠 샌드위치)"와 하나씩 사서 나눠 먹으면 더욱 든든해요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (매일 아침·야식!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Seven Eleven Tokyo',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '삶은 계란 샐러드 속재료 (たまごサラダ)',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '식빵은 괜찮지만 속재료가 100% 삶은 계란 샐러드입니다! 현우는 타마고산도 대신 바로 옆에 진열된 "돈카츠 샌드위치(카츠산도)"나 "햄·치즈 샌드위치"로 골라주세요!',
      customRemoveJp: '卵サラダが入っていないサンドイッチ（カツサンドやハムサンドなど）はどれですか？',
      customRemovePronunciation: '타마고 사라다가 하잇테 이나이 산도잇치(카츠산도야 하무산도 나도)와 도레데스카?'
    }
  },
  {
    id: 'konbini_purin_pudding',
    name: '오하요 저지 밀크 푸딩 & 카라멜 커스터드 푸딩',
    japaneseName: 'オハヨー ジャージー牛乳プリン / カスタードプリン',
    pronunciation: '쟈지 규뉴 푸린 / 야키 푸린',
    category: 'KONBINI',
    categoryLabel: '편의점 디저트 · 일본 푸딩',
    dayNumber: 2,
    areaTag: '일본 편의점 · 돈키호테 · 마트',
    famousShop: '세븐일레븐 · 패밀리마트 · 로손 디저트 냉장 코너',
    priceJpy: '¥180 ~ ¥240',
    priceKrwApprox: '약 1,700원 ~ 2,200원',
    imageUrl: '/foods/purin_pudding.jpg',
    fallbackGradient: 'from-amber-600 via-yellow-900 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '1일 1푸딩 필수 디저트',
    summary:
      '일본에 가면 하루 1푸딩은 국룰! 진한 저지 우유 크림이 2층으로 올라간 하얀 밀크 푸딩과, 쌉싸름한 카라멜 시럽이 바닥에 깔린 구운 커스터드 푸딩입니다.',
    tastePoints: [
      '한국에서는 맛보기 힘든 진한 우유 풍미와 사르르 녹는 부드러운 커스터드',
      '저녁 일정을 마치고 숙소로 돌아가는 길에 1인 1푸딩 골라 담는 소소한 행복',
      '글리코 푸칭푸딩, 홋카이도 크림 푸딩 등 매일 다른 푸딩을 비교해 보는 재미'
    ],
    orderTip: '계산할 때 직원이 일회용 스푼을 무료로 챙겨줍니다 ("스푼 오네가이시마스").',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (1일 1푸딩)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Lawson Tokyo',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '노란 계란 커스터드 푸딩 (カスタードプリン) 주의',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '노란색 구운 커스터드 푸딩에는 계란이 많이 들어가므로, 현우는 계란 없이 우유로 만든 하얀색 "오하요 저지 밀크 푸딩(ジャージー牛乳プリン)"으로 골라주세요!',
      customRemoveJp: '卵が入っていない「牛乳プリン（ミルクプリン）」はどれですか？',
      customRemovePronunciation: '타마고가 하잇테 이나이 규뉴 푸린(미루쿠 푸린)와 도레데스카?'
    }
  },
  {
    id: 'konbini_lawson_mochi_roll',
    name: '로손 Uchi Café 쫀득 모찌롤 케이크 & 프리미엄 롤케이크',
    japaneseName: 'ローソン もち食感ロール / プレミアムロールケーキ',
    pronunciation: '로손 모찌 쇼쿠칸 로루',
    category: 'KONBINI',
    categoryLabel: '편의점 스위츠 · 로손 단독 명물',
    dayNumber: 3,
    areaTag: '로손 (LAWSON) 편의점 전 매장',
    famousShop: '로손 (LAWSON) Uchi Café 냉장 디저트 코너',
    priceJpy: '¥220 ~ ¥397 (6조각 입)',
    priceKrwApprox: '약 2,000원 ~ 3,700원',
    imageUrl: '/foods/lawson_mochi_roll.jpg',
    fallbackGradient: 'from-sky-900 via-indigo-950 to-slate-900',
    ratingScore: '★ 4.9',
    recommendBadge: '편의점 스위츠 판매량 1위',
    summary:
      '오직 파란 간판 로손(LAWSON) 편의점에서만 살 수 있는 전설의 디저트! 찹쌀떡처럼 쫀득쫀득한 시트 속에 홋카이산 순우유 생크림이 가득 들어있어 유명 제과점 케이크 못지않은 맛을 자랑합니다.',
    tastePoints: [
      '한 팩에 먹기 좋게 6조각으로 잘려 있어 가족 4명이 숙소에서 나눠 먹기 딱 좋아요',
      '가운데 크림을 스푼으로 떠먹는 "프리미엄 롤케이크"도 입안에서 눈처럼 사르르 녹는 맛',
      '저녁 늦게 가면 품절되는 경우가 많아 보이면 바로 장바구니에 담아야 하는 인기템!'
    ],
    orderTip: '파란색 로손 간판을 발견하면 냉장 코너에서 "Uchi Café(우치 카페)" 마크를 찾으세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (쫀득 크림 홀릭)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (커피 안주 1위)',
    googleMapsQuery: 'Lawson Tokyo'
  },
  {
    id: 'konbini_famichiki_chicken',
    name: '패밀리마트 파미치키 (통살 치킨) & 로손 치즈 가라아게군',
    japaneseName: 'ファミチキ (ファミリーマート) / からあげクン (ローソン)',
    pronunciation: '파미치키 / 카라아게쿤 레드·치즈',
    category: 'KONBINI',
    categoryLabel: '편의점 핫푸드 · 즉석 순살치킨',
    dayNumber: 4,
    areaTag: '패밀리마트 · 로손 · 세븐일레븐 계산대 옆',
    famousShop: '패밀리마트 & 로손 계산대 옆 핫푸드 보온 쇼케이스',
    priceJpy: '¥230 ~ ¥259',
    priceKrwApprox: '약 2,100원 ~ 2,400원',
    imageUrl: '/foods/famichiki_chicken.jpg',
    fallbackGradient: 'from-emerald-900 via-amber-900 to-stone-900',
    ratingScore: '★ 4.9',
    recommendBadge: '출출한 밤 야식 만족도 1위',
    summary:
      '일본 편의점 계산대 옆 유리 온장고의 절대 강자! 뼈 없는 통다리살을 바삭하게 튀겨 육즙이 줄줄 흐르는 패밀리마트 "파미치키"와 귀여운 닭 그림 포장의 한입 순살치킨 로손 "가라아게군"입니다.',
    tastePoints: [
      '1초에 수십 개씩 팔리는 패밀리마트의 간판 스타로, 전용 빵(파미치키 번)에 끼워 치킨버거로 먹어도 꿀맛',
      '로손 가라아게군은 "홋카이도 치즈맛"과 살짝 매콤한 "레드", 기본 "레귤러" 3가지가 모두 인기',
      '세븐일레븐의 "나나치키"까지 3대 편의점 치킨 도장깨기하는 재미!'
    ],
    orderTip: '계산대에서 손가락으로 가리키며 "파미치키 히토츠(1개) 구다사이!"라고 말하면 바로 꺼내 줍니다.',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (야식 부동의 1위!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'FamilyMart Tokyo'
  },
  {
    id: 'konbini_kitsune_udon_onigiri',
    name: '대왕 유부 닛신 돈베이 키츠네 우동 & 참치마요·연어 오니기리',
    japaneseName: '日清のどん兵衛 きつねうどん & 手巻おにぎり (ツナマヨ・紅しゃけ)',
    pronunciation: '돈베이 키츠네 우동 & 오니기리',
    category: 'KONBINI',
    categoryLabel: '편의점 야식 · 컵우동 & 삼각김밥',
    dayNumber: 5,
    areaTag: '세븐일레븐 · 로손 · 패밀리마트 · 돈키호테',
    famousShop: '일본 전 편의점 컵라면 코너 & 삼각김밥 코너',
    priceJpy: '¥230 (돈베이 우동) / ¥150 ~ ¥190 (오니기리)',
    priceKrwApprox: '약 1,400원 ~ 2,100원',
    imageUrl: '/foods/kitsune_udon_onigiri.jpg',
    fallbackGradient: 'from-amber-800 via-orange-950 to-stone-950',
    ratingScore: '★ 4.8',
    recommendBadge: '뜨끈한 국물 야식 꿀조합',
    summary:
      '그릇을 가득 덮는 달콤하고 두툼한 대왕 유부가 통째로 들어있는 일본 국민 컵우동 "돈베이 키츠네 우동"과, 갓 지은 듯 밥알이 살아있는 일본 편의점 삼각김밥(오니기리) 야식 세트입니다.',
    tastePoints: [
      '유부를 한 입 베어 물면 달콤짭조름한 가쓰오 다시 국물이 입안 가득 팡 터져요!',
      '일본 오니기리는 김이 바삭하고 속재료(참치마요·구운 연어·명란)가 끝까지 꽉 차 있어 차원이 다른 맛',
      '일정 마치고 호텔 방에서 뜨거운 물 부어 호호 불며 먹는 최고의 마무리 야식'
    ],
    orderTip: '뜨거운 물을 붓고 정확히 "5분"을 기다려야 면발이 생우동처럼 탱글탱글하고 맛있어집니다!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (대왕 유부 홀릭!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★',
    googleMapsQuery: 'Seven Eleven Tokyo'
  },

  // ==========================================
  // 6. 일정 추천 선술집 · 밤맥주 안주 (IZAKAYA_PUB - 6선)
  // ==========================================
  {
    id: 'izakaya_torikizoku_kinshicho',
    name: '[일정 추천 선술집] 토리키조쿠 700ml 메가 생맥주 & 대왕 숯불 타레 닭꼬치',
    japaneseName: '鳥貴族 錦糸町南口店 (もも貴族焼・メガ金麦)',
    pronunciation: '토리키조쿠 모모키조쿠야키 타레 & 메가 나마비루',
    category: 'IZAKAYA_PUB',
    categoryLabel: '추천 선술집 · 가성비 이자카야',
    dayNumber: 1,
    areaTag: '긴시초 숙소 도보 2분 (Day 1 · Day 5 일정 포함)',
    famousShop: '토리키조쿠 긴시초남쪽출구점 (호텔 도보 2분)',
    priceJpy: '전 메뉴 균일 ¥370 (1인 약 ¥1,500 ~ ¥2,200)',
    priceKrwApprox: '한 접시 약 3,400원 (가성비 최강)',
    imageUrl: '/foods/izakaya_torikizoku.jpg',
    fallbackGradient: 'from-amber-900 via-yellow-950 to-stone-950',
    ratingScore: '★ 4.8',
    recommendBadge: '일정 Day 1·5 숙소 앞 추천 선술집',
    summary:
      'Day 1 첫날 밤과 Day 5 마지막 밤 총결산 뒤풀이 일정에 포함된 일본 국민 가성비 이자카야! 전 메뉴 370엔 균일가로 700ml 초대형 메가 생맥주와 큼직한 숯불 닭다리살 대파 꼬치(모모키조쿠야키)를 부담 없이 즐길 수 있습니다.',
    tastePoints: [
      '일반 꼬치의 2배 크기인 시그니처 "모모키조쿠야키(타레/소금)"의 진한 숯불 향과 육즙',
      '참기름 간장 소스가 뿌려진 아삭한 양배추 샐러드(캬베츠모리)는 1회 주문 시 무료 무한 리필!',
      '아이들을 위한 달콤한 치즈 츠쿠네, 감자튀김, 닭육수 라멘·가마메시(솥밥), 소프트드링크도 370엔 균일가'
    ],
    orderTip: '테이블 태블릿(한국어 지원)으로 주문하며, "캬베츠모리(양배추)"를 먼저 시켜 무료 리필로 곁들이세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (대형 닭꼬치·감자튀김)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (700ml 메가 생맥주 370엔!)',
    googleMapsQuery: 'Torikizoku Kinshicho South Exit',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '츠쿠네 날계란 노른자 및 감자샐러드 반숙란 주의',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '기본 닭다리살 대파 꼬치(모모키조쿠야키)와 가라아게는 계란 없이 안전하지만, 츠쿠네(닭완자)나 감자샐러드에는 계란이 올라가니 현우 몫은 모모키조쿠야키(타레/소금)로 주문하세요!',
      customRemoveJp: 'つくねやサラダの卵（生卵・半熟卵）は抜いてください。焼き鳥（もも貴族焼）はそのままお願いします。',
      customRemovePronunciation: '츠쿠네야 사라다노 타마고(나마타마고·한쥬쿠타마고)와 누이테 구다사이',
      customSeparateJp: '卵（生卵・半熟卵）は料理に乗せず、別の小皿（別皿）でお願いします。',
      customSeparatePronunciation: '타마고와 료리니 노세즈, 베츠자라데 오네가이시마스'
    }
  },
  {
    id: 'izakaya_hakata_gekijo_kinshicho',
    name: '[일정 추천 선술집] 하카타 게키죠 철판 한입 테츠나베 교자 & 1리터 얼음장 메가 생맥주',
    japaneseName: '屋台屋 博多劇場 錦糸町店 (鉄鍋餃子・どでかジョッキ)',
    pronunciation: '테츠나베 교자 & 도데카 조끼 나마비루',
    category: 'IZAKAYA_PUB',
    categoryLabel: '추천 선술집 · 야타이 포장마차 주점',
    dayNumber: 2,
    areaTag: '긴시초 숙소 도보 2분 (Day 2 · Day 5 일정 포함)',
    famousShop: '야타이야 하카타 게키죠 긴시초점 (호텔 도보 2분)',
    priceJpy: '교자 1인분 ¥380 ~ / 1L 메가맥주 ¥980',
    priceKrwApprox: '약 16,000원 ~ 24,000원 (1인 평균)',
    imageUrl: '/foods/izakaya_hakata_gyoza.jpg',
    fallbackGradient: 'from-orange-900 via-red-950 to-stone-950',
    ratingScore: '★ 4.9',
    recommendBadge: '일정 Day 2 디즈니 피로회복 선술집',
    summary:
      'Day 2 디즈니씨 2만 보 행군 후 숙소 복귀 일정에 추가된 활기찬 후쿠오카 포장마차(야타이) 컨셉 선술집! 뜨겁게 달군 무쇠 철판에 둥글게 구워 나오는 바삭한 한입 교자와 팔뚝만 한 1리터 얼음장 메가 생맥주의 조합이 예술입니다.',
    tastePoints: [
      '겉은 과자처럼 바삭하고 속은 고기 육즙이 가득한 하카타 명물 "철판 한입 테츠나베 교자"',
      '하루 종일 걸어 타는 갈증을 단숨에 날려버리는 1리터 초대형 "도데카 메가 조끼 생맥주·하이볼"',
      '고소한 명란 모츠나베와 달콤짭조름한 하카타 닭껍질 꼬치(카와쿠시)도 인기 안주!'
    ],
    orderTip: '철판 교자는 굽는 데 10분 정도 걸리니 자리에 앉자마자 인원수대로 먼저 주문하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (바삭한 한입 군만두!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (1리터 얼음장 생맥주!)',
    googleMapsQuery: 'Yataiya Hakata Gekijo Kinshicho'
  },
  {
    id: 'izakaya_kushikatsu_tanaka_kinshicho',
    name: '[일정 추천 선술집] 쿠시카츠 다나카 오사카식 수제 꼬치튀김 8종 & 친치로 하이볼',
    japaneseName: '串カツ田中 錦糸町店 (串カツ盛り合わせ・チンチロリン)',
    pronunciation: '쿠시카츠 모리아와세 & 나마비루',
    category: 'IZAKAYA_PUB',
    categoryLabel: '추천 선술집 · 꼬치튀김 이자카야',
    dayNumber: 2,
    areaTag: '긴시초 숙소 도보 3분 (Day 2 일정 포함)',
    famousShop: '쿠시카츠 다나카 긴시초점 (호텔 도보 3분)',
    priceJpy: '꼬치 개당 ¥130 ~ ¥260 / 8종 세트 ¥1,480',
    priceKrwApprox: '약 15,000원 ~ 23,000원 (1인 평균)',
    imageUrl: '/foods/izakaya_kushikatsu.jpg',
    fallbackGradient: 'from-amber-800 via-orange-950 to-stone-950',
    ratingScore: '★ 4.8',
    recommendBadge: '일정 Day 2 가족 친화형 인기 선술집',
    summary:
      'Day 2 숙소 복귀 일정에 포함된 오사카 전통 꼬치튀김 전문 선술집! 소고기, 새우, 연근, 아스파라거스, 치즈 등 갓 튀겨 바삭바삭한 쿠시카츠를 특제 간장 우스터 소스에 푹 찍어 살얼음 기린 생맥주와 함께 즐깁니다.',
    tastePoints: [
      '주사위 2개를 굴려 짝수가 나오면 반값, 같은 숫자(조로메)가 나오면 무료가 되는 "친치로린 하이볼·음료" 게임!',
      '어린이·청소년 고객에게는 직접 만들어 먹는 타코야키나 소프트아이스크림, 가위바위보 음료 무료 이벤트가 있어 가족 방문 만족도 최고',
      '바삭한 쿠시카츠 후식으로 초코 바나나 꼬치튀김이나 쿠키앤크림 꼬치튀김도 별미'
    ],
    orderTip: '인기 부위만 모은 "쿠시카츠 8종 모둠(하치텐 모리)"을 기본으로 시키고 먹고 싶은 꼬치를 추가하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (가위바위보 음료 게임 & 튀김!)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (바삭한 튀김 + 생맥주)',
    googleMapsQuery: 'Kushikatsu Tanaka Kinshicho',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '메추리알 꼬치튀김 (우즈라 · うずら) 제외 요청',
      defaultMode: 'REMOVE',
      hyunwooTip:
        '모둠 꼬치튀김 세트에 "메추리알 꼬치(우즈라)"나 " 반숙 계란 튀김"이 포함될 수 있으니, 현우는 소고기·돼지고기·새우·치즈·연근 꼬치만 골라 먹도록 해주세요!',
      customRemoveJp: '串カツ盛り合わせから「うずらの卵（卵の串）」を抜いて、お肉やエビに変えていただけますか？',
      customRemovePronunciation: '쿠시카츠 모리아와세카라 우즈라노 타마고오 누이테, 오니쿠야 에비니 카에테 이타다케마스카?',
      customSeparateJp: '「うずらの卵（卵の串）」は別皿に分けて出してください。',
      customSeparatePronunciation: '우즈라노 타마고와 베츠자라니 와케테 다시테 구다사이'
    }
  },
  {
    id: 'izakaya_karaku_kinshicho_sashimi',
    name: '[일정 추천 선술집] 우마이몬야 카라쿠 제철 모둠 사시미 5종 & 바지락 버터 술찜 & 에비스 생맥주',
    japaneseName: 'うまいもんや 嘉楽 (刺盛り5点・あさり酒蒸し・ヱビス生)',
    pronunciation: '사시미 모리아와세 & 아사리 사카무시 & 에비스 나마',
    category: 'IZAKAYA_PUB',
    categoryLabel: '추천 선술집 · 신선 해산물 주점',
    dayNumber: 3,
    areaTag: '긴시초 숙소 도보 2분 (Day 3 일정 포함)',
    famousShop: '우마이몬야 카라쿠 긴시초 (호텔 도보 2분)',
    priceJpy: '¥2,200 ~ ¥3,500 (1인 평균)',
    priceKrwApprox: '약 20,000원 ~ 32,000원',
    imageUrl: '/foods/izakaya_karaku_sashimi.jpg',
    fallbackGradient: 'from-rose-950 via-slate-900 to-black',
    ratingScore: '★ 4.8',
    recommendBadge: '일정 Day 3 후지산 복귀 해산물 선술집',
    summary:
      'Day 3 후지산 버스 투어 및 도쿄역 야경 관람 후 숙소 복귀 일정에 등록된 로컬 해산물 명가 선술집! 매일 아침 도요스·쓰키지 시장에서 공수한 두툼한 제철 사시미 5종 모둠과 국물이 끝내주는 바지락 버터 술찜에 부드러운 프리미엄 에비스 생맥주를 곁들입니다.',
    tastePoints: [
      '입안에서 녹는 생참치·연어·방어 등 제철 활어를 두툼하게 썰어낸 고품격 모둠 사시미',
      '고소한 버터 향과 감칠맛이 우러난 따끈한 "바지락 버터 술찜(아사리 바타)"은 국물까지 숟가락으로 떠먹게 되는 맛',
      '크리미한 엔젤링 거품이 살아있는 프리미엄 에비스 생맥주 및 일본 지역 사케 완비'
    ],
    orderTip: '"오늘의 추천 사시미 모둠(혼지츠노 사시모리)"과 "바지락 버터 술찜" 조합을 강력 추천합니다!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆ (연어회·가라아게·감자튀김)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (엄마들 원픽 고급 안주!)',
    googleMapsQuery: 'Kinshicho Izakaya Sashimi Yebisu'
  },
  {
    id: 'izakaya_teppen_hinata_kinshicho',
    name: '[일정 추천 선술집] 긴시초 텟펜·히나타 비장탄 숯불 야키토리 & 1인 하카타 모츠나베',
    japaneseName: '炭火串焼 てっぺん / 日向 錦糸町 (博多もつ鍋・炭火焼鳥)',
    pronunciation: '스미비 야키토리 & 하카타 모츠나베 & 삿포로 나마',
    category: 'IZAKAYA_PUB',
    categoryLabel: '추천 선술집 · 비장탄 숯불구이 & 전골',
    dayNumber: 4,
    areaTag: '긴시초 숙소 도보 2~3분 (Day 4 일정 포함)',
    famousShop: '긴시초 텟펜 (てっぺん) / 스미비 야키토리 히나타 (호텔 도보 2~3분)',
    priceJpy: '¥1,800 ~ ¥3,200 (1인 평균)',
    priceKrwApprox: '약 16,500원 ~ 29,500원',
    imageUrl: '/foods/izakaya_teppen_motsunabe.jpg',
    fallbackGradient: 'from-red-950 via-amber-950 to-stone-950',
    ratingScore: '★ 4.9',
    recommendBadge: '일정 Day 4 시부야 복귀 후 심야 선술집',
    summary:
      'Day 4 해리포터 스튜디오와 시부야 스카이 야경 후 한조몬선으로 숙소에 복귀해 들르는 비장탄 숯불 야키토리 & 모츠나베 전문 선술집! 꽁꽁 얼린 얼음잔 삿포로 블랙라벨 생맥주와 콜라겐 가득한 뜨끈한 소곱창 전골(모츠나베), 육즙 터지는 숯불 꼬치 모둠이 일품입니다.',
    tastePoints: [
      '1월 겨울밤 추위를 단숨에 녹여주는 깊고 진한 국물의 1인~2인 하카타 모츠나베(소곱창 전골)',
      '비장탄 참숯에 구워 불향이 살아있는 수제 츠쿠네와 바삭한 닭날개 구이(테바사키)',
      '전골 국물에 마지막으로 쫄깃한 짬뽕 면(챤폰멘)을 넣어 끓여 먹으면 완벽한 마무리!'
    ],
    orderTip: '모츠나베 육수는 한국인 입맛에 가장 잘 맞는 "간장(쇼유)" 또는 "된장(미소)" 베이스를 선택하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★★ (바삭한 닭날개·숯불꼬치)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (얼음잔 생맥주 + 뜨끈한 모츠나베!)',
    googleMapsQuery: 'Kinshicho Teppen Yakitori Motsunabe',
    eggAllergyInfo: {
      hasDirectEgg: true,
      eggTypeLabel: '츠쿠네 찍어 먹는 날계란 노른자 (月見つくね)',
      defaultMode: 'SEPARATE',
      hyunwooTip:
        '모츠나베 전골과 일반 숯불 꼬치는 계란이 없지만, 수제 츠쿠네(닭완자)에 날계란 노른자 소스가 함께 나오니 노른자는 따로 받거나 빼달라고 요청하세요!',
      customRemoveJp: 'つくねの生卵（卵黄）は抜いてください（タレのみでお願いします）。',
      customRemovePronunciation: '츠쿠네노 나마타마고(란오)와 누이테 구다사이 (타레노미데 오네가이시마스)',
      customSeparateJp: 'つくねの生卵（卵黄）は別の小皿（別皿）に分けてお願いします。',
      customSeparatePronunciation: '츠쿠네노 나마타마고(란오)와 베츠노 코자라니 와케테 오네가이시마스'
    }
  },
  {
    id: 'izakaya_tetchan_kinshicho_nikomi',
    name: '[일정 추천 선술집] 대중주점 텟짱 소힘줄 미소 조림(규스지 니코미) & 바삭 햄카츠 & 살얼음 생맥주',
    japaneseName: '大衆酒場 てっちゃん 錦糸町店 (牛すじ煮込み・ハムカツ・生ビール)',
    pronunciation: '규스지 니코미 & 하무카츠 & 사포로 나마비루',
    category: 'IZAKAYA_PUB',
    categoryLabel: '추천 선술집 · 레트로 쇼와 대중주점',
    dayNumber: 1,
    areaTag: '긴시초 숙소 도보 1분 (Day 1 · Day 3 일정 포함)',
    famousShop: '대중주점 텟짱 긴시초점 (호텔 도보 1분)',
    priceJpy: '안주 ¥350 ~ ¥580 / 살얼음 생맥주 ¥450',
    priceKrwApprox: '약 13,000원 ~ 20,000원 (1인 평균)',
    imageUrl: '/foods/izakaya_tetchan_nikomi.jpg',
    fallbackGradient: 'from-stone-900 via-amber-950 to-zinc-950',
    ratingScore: '★ 4.8',
    recommendBadge: '일정 Day 1·3 호텔 1분 컷 로컬 노포',
    summary:
      'Day 1과 Day 3 숙소 복귀 일정에 포함된 롯데시티호텔 도보 1분 거리의 정겨운 쇼와풍 레트로 대중주점! 가마솥에서 푹 고아내 입안에서 사르르 녹는 소힘줄 된장 조림(규스지 니코미)과 두툼하고 바삭한 추억의 햄카츠, 살얼음 낀 삿포로 생맥주를 착한 가격에 맛볼 수 있습니다.',
    tastePoints: [
      '일본 드라마 <고독한 미식가>와 <심야식당>에 나올 법한 진짜 도쿄 로컬 직장인들의 아지트 감성',
      '진한 미소 국물이 쏙 밴 부드러운 소힘줄 조림(니코미)과 곤약, 두부 위에 송송 썬 대파의 조화',
      '호텔 엘리베이터에서 내려 1분이면 도착해 부담 없이 한잔하고 바로 올라가 자기 최고의 위치!'
    ],
    orderTip: '자리 앉자마자 3초 만에 나오는 명물 "규스지 니코미(소힘줄 조림)"와 "아츠기리 하무카츠(두툼한 햄카츠)"를 함께 주문하세요!',
    kidFavoriteScore: '현우·세현 선호도 ★★★★☆ (바삭한 햄카츠·가라아게)',
    momFavoriteScore: '엄마들 선호도 ★★★★★ (도쿄 로컬 노포 감성 최고!)',
    googleMapsQuery: 'Taishu Sakaba Tetchan Kinshicho'
  }
];

