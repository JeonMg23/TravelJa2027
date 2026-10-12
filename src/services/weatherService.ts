import { DayWeather } from '../types/travel';

const OWM_STORAGE_KEY = 'owm_api_key_v1';
const RAIN_SIMULATION_KEY = 'weather_rain_sim_v1';

// Base indoor recommendation database for Tokyo trip days
export const DAY_INDOOR_RECOMMENDATIONS: Record<number, string[]> = {
  1: [
    "도쿄 스카이트리 하단 '도쿄 소라마치' 대형 복합몰 (300여 개 매장 & 맛집 전 구역 실내)",
    "스카이트리 타운 내 '스미다 수족관 (Sumida Aquarium)' 비 오는 날 해파리 & 펭귄 힐링 실내 관람",
    "아사쿠사 센소지 나카미세도리 아케이드 & 아사쿠사 지하상가(일본 최고(最古) 레트로 지하상가 투어)",
    "우에노 국립서양미술관 & 도쿄국립박물관 실내 전시 관람으로 비 피하기"
  ],
  2: [
    "100% 완전 실내 테마존 '머메이드 라군 (트리톤즈 킹덤)'에서 비 걱정 없이 어트랙션과 레스토랑 즐기기",
    "'포트 디스커버리 닛모 & 프렌즈 씨라이더' 및 브로드웨이 뮤직 시어터 '빅 밴드 비트' 실내 극장 공연 관람",
    "비 오는 날 감성 넘치는 신비로운 화산 동굴 중식당 '볼케이니아' 또는 아라비안 코스트 '카스바 푸드코트'",
    "디즈니 리조트 라인 모노레일 순환 탑승으로 비 맞지 않고 리조트 파크 감상하기"
  ],
  3: [
    "도쿄역 마루노우치 지하 '도쿄역 1번가' 캐릭터 스트리트(지브리·포켓몬·산리오) & 라멘 스트리트 실내 미식 투어",
    "도쿄역 바로 맞은편 KITTE(킷테) 쇼핑몰 & 도쿄대학 인터미디어테크(무료 국립 자연사 박물관) 실내 관람",
    "후지산 당일 투어 시: 가와구치코 오르골의 숲 미술관, 후지산 와인 양조장 등 실내 뷰포인트 중심 관람",
    "마루노우치 오아조(OAZO) 대형 마루젠 서점 북카페에서 도쿄역 뷰 감상"
  ],
  4: [
    "워너 브라더스 해리포터 스튜디오 투어는 전 구역이 최첨단 초대형 실내 전시장이라 비 오는 날에도 100% 쾌적합니다!",
    "신주쿠 게이오·오다큐·이세탄 백화점 지하 데파치카(식품관) & 대형 서점 키노쿠니야 실내 투어",
    "시부야 스카이 야외 루프탑 대신 45층 통유리 실내 전망대 & 시부야 스크램블 스퀘어 실내 쇼핑",
    "시부야 파르코 (PARCO) 6층 닌텐도 도쿄 & 포켓몬 센터 실내 굿즈 쇼핑"
  ],
  5: [
    "긴자 식스 (GINZA SIX) 및 미쓰코시 백화점 실내 럭셔리 쇼핑 & 츠타야 북카페 아트 갤러리",
    "롯폰기 힐스 모리 미술관(Mori Art Museum) 기획전 & 52층 실내 도쿄 시티뷰 전망대 관람",
    "모리 타워 지하 식당가 '츠루톤탄'에서 비 오는 날 따뜻한 세숫대야 명란 크림 우동 즐기기",
    "미드타운 롯폰기 실내 갤러리 & 디자인 21_21 사이트 관람"
  ],
  6: [
    "긴시초역 파르코(PARCO) 및 테르미나(TERMINA) 실내 쇼핑몰에서 비 맞지 않고 마지막 쇼핑",
    "나리타 공항 제1/제2터미널 실내 대형 면세점 및 일본 라멘·스시 라운지 이용",
    "소부선 쾌속 전철을 이용하면 숙소(긴시초)에서 공항까지 야외 도보 없이 지하/실내로 직통 이동 가능"
  ]
};

// High-fidelity Tokyo January baseline forecast data
export const INITIAL_TOKYO_WEATHER: DayWeather[] = [
  {
    dayNumber: 1,
    date: '1월 13일',
    tempDay: 11,
    tempNight: 2,
    condition: 'Clear',
    description: '맑고 쾌청함',
    icon: '01d',
    rainProbability: 10,
    humidity: 42,
    windSpeed: 2.8,
    indoorTips: DAY_INDOOR_RECOMMENDATIONS[1]
  },
  {
    dayNumber: 2,
    date: '1월 14일',
    tempDay: 9,
    tempNight: 1,
    condition: 'Clouds',
    description: '구름 많음',
    icon: '03d',
    rainProbability: 20,
    humidity: 48,
    windSpeed: 3.2,
    indoorTips: DAY_INDOOR_RECOMMENDATIONS[2]
  },
  {
    dayNumber: 3,
    date: '1월 15일',
    tempDay: 10,
    tempNight: 0,
    condition: 'Clear',
    description: '맑음 (후지산 조망 쾌청)',
    icon: '01d',
    rainProbability: 5,
    humidity: 36,
    windSpeed: 2.1,
    indoorTips: DAY_INDOOR_RECOMMENDATIONS[3]
  },
  {
    dayNumber: 4,
    date: '1월 16일',
    tempDay: 9,
    tempNight: 2,
    condition: 'Clouds',
    description: '구름 조금 (실내 관람 최적)',
    icon: '03d',
    rainProbability: 20,
    humidity: 50,
    windSpeed: 3.0,
    indoorTips: DAY_INDOOR_RECOMMENDATIONS[4]
  },
  {
    dayNumber: 5,
    date: '1월 17일',
    tempDay: 12,
    tempNight: 4,
    condition: 'Clouds',
    description: '구름 조금 (온화함)',
    icon: '02d',
    rainProbability: 25,
    humidity: 52,
    windSpeed: 2.6,
    indoorTips: DAY_INDOOR_RECOMMENDATIONS[5]
  },
  {
    dayNumber: 6,
    date: '1월 18일',
    tempDay: 10,
    tempNight: 2,
    condition: 'Clear',
    description: '맑고 귀국길 양호',
    icon: '01d',
    rainProbability: 10,
    humidity: 40,
    windSpeed: 3.0,
    indoorTips: DAY_INDOOR_RECOMMENDATIONS[6]
  }
];

export function getSavedOwmApiKey(): string {
  try {
    return (
      localStorage.getItem(OWM_STORAGE_KEY) ||
      (import.meta.env.VITE_OPENWEATHER_API_KEY as string) ||
      ''
    );
  } catch {
    return '';
  }
}

export function saveOwmApiKey(key: string): void {
  try {
    localStorage.setItem(OWM_STORAGE_KEY, key.trim());
  } catch {
    // ignore
  }
}

export function getRainSimulation(dayNumber: number): boolean | null {
  try {
    const raw = localStorage.getItem(`${RAIN_SIMULATION_KEY}_${dayNumber}`);
    if (raw !== null) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function setRainSimulation(dayNumber: number, isRain: boolean): void {
  try {
    localStorage.setItem(`${RAIN_SIMULATION_KEY}_${dayNumber}`, JSON.stringify(isRain));
  } catch {
    // ignore
  }
}

/**
 * Fetch live weather from OpenWeatherMap 5-day / 3-hour forecast API
 * If API key is provided and valid, maps to our 6 days.
 * If API fails or is unavailable, smoothly falls back to Tokyo seasonal baseline.
 */
export async function fetchTokyoWeatherForecast(
  apiKey: string = getSavedOwmApiKey()
): Promise<{ forecasts: DayWeather[]; isLive: boolean; error?: string }> {
  if (!apiKey) {
    return { forecasts: INITIAL_TOKYO_WEATHER, isLive: false };
  }

  try {
    // Tokyo latitude & longitude: 35.6762, 139.6503
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=35.6762&lon=139.6503&units=metric&lang=kr&appid=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        forecasts: INITIAL_TOKYO_WEATHER,
        isLive: false,
        error: errJson.message || `오픈웨더맵 상태 코드: ${res.status}`
      };
    }

    const data = await res.json();
    if (!data.list || !Array.isArray(data.list)) {
      return { forecasts: INITIAL_TOKYO_WEATHER, isLive: false };
    }

    // Process 3-hour forecast chunks grouped by days
    const daysForecast: DayWeather[] = INITIAL_TOKYO_WEATHER.map((baseDay, index) => {
      // Pick forecast chunk index (OpenWeatherMap free tier gives up to 5 days, 40 timestamps)
      const chunkIndex = Math.min(index * 6, data.list.length - 1);
      const chunk = data.list[chunkIndex];

      if (!chunk) return baseDay;

      const main = chunk.main || {};
      const weather = chunk.weather?.[0] || {};
      const pop = typeof chunk.pop === 'number' ? Math.round(chunk.pop * 100) : baseDay.rainProbability;

      const condition = weather.main || baseDay.condition;
      const isRainy = condition.toLowerCase().includes('rain') || pop >= 60;

      return {
        dayNumber: baseDay.dayNumber,
        date: baseDay.date,
        tempDay: Math.round(main.temp_max ?? main.temp ?? baseDay.tempDay),
        tempNight: Math.round(main.temp_min ?? baseDay.tempNight),
        condition: isRainy ? 'Rain' : condition,
        description: weather.description || baseDay.description,
        icon: weather.icon || baseDay.icon,
        rainProbability: pop,
        humidity: main.humidity ?? baseDay.humidity,
        windSpeed: chunk.wind?.speed ?? baseDay.windSpeed,
        indoorTips: DAY_INDOOR_RECOMMENDATIONS[baseDay.dayNumber] || []
      };
    });

    return { forecasts: daysForecast, isLive: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : '네트워크 통신 오류';
    return { forecasts: INITIAL_TOKYO_WEATHER, isLive: false, error: errorMsg };
  }
}
