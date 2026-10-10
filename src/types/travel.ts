export type SpotCategory =
  | 'hotel'
  | 'park'
  | 'temple'
  | 'observatory'
  | 'amusement'
  | 'station'
  | 'market'
  | 'nature'
  | 'shopping'
  | 'food';

export interface RecommendedFood {
  name: string;
  menu: string;
  desc?: string;
  coordinates?: [number, number];
  rating?: number;
  priceRange?: string; // e.g. "1,000~1,500엔 (가성비 최고)"
}

export interface TravelSpot {
  id: string;
  name: string;
  japaneseName?: string;
  category: SpotCategory;
  categoryLabel: string;
  rating: number;
  openStatus: string;
  hours?: string;
  summary: string;
  tips: string[];
  recommendedFoods?: RecommendedFood[];
  coordinates: [number, number]; // [lat, lng]
  estimatedTime?: string; // e.g. "13:30 ~ 14:30"
  address?: string;
  userNotes?: string;
  likes?: number;
  hasLiked?: boolean;
}

export interface TransitOption {
  name: string;
  durationMinutes: number;
  fareJPY: number;
  transferCount: number;
  description: string;
  tag?: string;
}

export interface TransitInfo {
  fromSpotId: string;
  toSpotId: string;
  method: 'subway' | 'train' | 'walk' | 'bus' | 'taxi';
  routeName: string; // e.g., "소부선 쾌속", "도쿄메트로 긴자선"
  durationMinutes: number;
  transitTip: string;
  transferCount: number;
  fareJPY?: number; // 대중교통 요금 (엔화 JPY)
  fareKRW?: number; // 대중교통 요금 (원화 환산 KRW)
  lineName?: string; // 노선명/호선 e.g. "도쿄메트로 한조몬선(Z)", "JR 소부선(JO)"
  lineColor?: string; // 노선 상징 색상
  detailedRoute?: string; // 상세 승하차 위치 및 경로
  passRecommendation?: string; // 추천 교통패스/IC카드
  isReturnToHotel?: boolean; // 숙소 복귀 교통편 여부
  transitOptions?: TransitOption[]; // 대체 교통편 비교 목록
}

export interface TripDay {
  dayNumber: number;
  date: string; // "1월 13일"
  fullDate: string; // "2027-01-13 (수)"
  theme: string; // "도착 및 아사쿠사·오시아게 방면 (가장 짧은 동선)"
  description: string;
  spots: TravelSpot[];
  transits: TransitInfo[];
}

export interface FriendCompanion {
  id: string;
  name: string;
  avatarColor: string;
  status: string;
  isOnline: boolean;
  viewingDay?: number;
}

export interface SpotComment {
  id: string;
  spotId: string;
  spotName: string;
  author: string;
  avatarColor: string;
  text: string;
  timestamp: string;
}

export type ChecklistCategory =
  | '필수준비'
  | '의류/잡화'
  | '세면/위생'
  | '상비약'
  | '전자기기'
  | '교통/통신'
  | '예약확인'
  | '여행꿀템'
  | '짐싸기';

export interface ChecklistItem {
  id: string;
  text: string;
  category: ChecklistCategory;
  completed: boolean;
}

export interface BudgetItem {
  id: string;
  day: number;
  title: string;
  category: '교통' | '숙박' | '식비' | '입장료' | '쇼핑';
  amountJPY: number;
  paidBy: string;
}

export interface DayWeather {
  dayNumber: number;
  date: string; // e.g. "1월 13일"
  tempDay: number;
  tempNight: number;
  condition: string; // 'Clear' | 'Clouds' | 'Rain' | 'Snow'
  description: string; // e.g. "맑음", "흐리고 가끔 비"
  icon: string; // OpenWeatherMap icon code e.g. "01d", "10d"
  rainProbability: number; // 0 to 100%
  humidity: number; // %
  windSpeed: number; // m/s
  indoorTips: string[];
}
