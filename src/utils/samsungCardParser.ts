import { BudgetCategory, BudgetItem } from '../types/travel';

export interface ParsedSamsungCardResult {
  rawText: string;
  isSamsungCard: boolean;
  cardCompany: string; // '삼성카드'
  dateStr: string; // e.g. "1월 14일" 또는 "2026.01.10"
  timeStr: string; // e.g. "13:45"
  fullDateTimeStr: string; // e.g. "2026-01-14 13:45"
  day: number; // 0 (사전예약/준비), 1~6 (도쿄 여행 일정)
  currency: 'JPY' | 'KRW' | 'USD';
  originalAmount: number;
  amountJPY: number;
  merchant: string;
  category: BudgetCategory;
  location: string;
  paidBy: '현우가족';
  paymentMethod: 'CARD';
  scope: 'HYEONWOO';
  note: string;
  installment?: string; // '일시불', '해외승인' 등
}

/**
 * 100 JPY ~ 920 KRW 기준 환산율
 */
export const KRW_PER_JPY = 9.2;
export const JPY_PER_USD = 150;

export function convertKRWtoJPY(krw: number): number {
  return Math.round(krw / KRW_PER_JPY);
}

export function convertUSDtoJPY(usd: number): number {
  return Math.round(usd * JPY_PER_USD);
}

/**
 * 여행 일정 날짜 정의 (2026년 1월 13일 ~ 1월 18일)
 */
const TRIP_START_DATE = new Date('2026-01-13T00:00:00+09:00');
const TRIP_END_DATE = new Date('2026-01-18T23:59:59+09:00');

/**
 * 날짜 문자열을 통해 여행 Day (0: 사전준비, 1..6: 일차) 자동 계산
 */
export function determineTripDay(month: number, day: number, year: number = 2026): { day: number; label: string } {
  // 1월 13일 이전 (예: 2025년 결제, 1월 1일~12일, 12월 결제 등) -> 사전예약/준비
  if (year < 2026 || month < 1 || (month === 1 && day < 13)) {
    return { day: 0, label: '사전예약/준비' };
  }
  // 여행 중 (1월 13일 ~ 18일)
  if (month === 1) {
    if (day === 13) return { day: 1, label: '1일차 (1월 13일)' };
    if (day === 14) return { day: 2, label: '2일차 (1월 14일)' };
    if (day === 15) return { day: 3, label: '3일차 (1월 15일)' };
    if (day === 16) return { day: 4, label: '4일차 (1월 16일)' };
    if (day === 17) return { day: 5, label: '5일차 (1월 17일)' };
    if (day === 18) return { day: 6, label: '6일차 (1월 18일)' };
  }
  // 여행 이후 결제도 일단 6일차 또는 사전/사후로 처리
  if (month === 1 && day > 18) {
    return { day: 6, label: '6일차 (여행 마무리)' };
  }
  return { day: 0, label: '사전예약/준비' };
}

/**
 * 가맹점명 및 키워드로 카테고리 자동 유추
 */
export function inferCategory(merchant: string, text: string): BudgetCategory {
  const target = (merchant + ' ' + text).toLowerCase();

  // 카페/디저트
  if (
    target.includes('스타벅스') ||
    target.includes('starbucks') ||
    target.includes('카페') ||
    target.includes('cafe') ||
    target.includes('커피') ||
    target.includes('coffee') ||
    target.includes('베이커리') ||
    target.includes('bakery') ||
    target.includes('도넛') ||
    target.includes('tully') ||
    target.includes('blue bottle') ||
    target.includes('디저트') ||
    target.includes('케이크') ||
    target.includes('아이스크림') ||
    target.includes('모찌')
  ) {
    return '카페/디저트';
  }

  // 이자카야 / 주류
  if (
    target.includes('이자카야') ||
    target.includes('izakaya') ||
    target.includes('토리키조쿠') ||
    target.includes('야키토리') ||
    target.includes('선술집') ||
    target.includes('맥주') ||
    target.includes('beer') ||
    target.includes('바') ||
    target.includes('bar') ||
    target.includes('pub') ||
    target.includes('곤파치') ||
    target.includes('텟펜')
  ) {
    return '이자카야/주류';
  }

  // 입장료 / 티켓
  if (
    target.includes('디즈니') ||
    target.includes('disney') ||
    target.includes('해리포터') ||
    target.includes('스튜디오') ||
    target.includes('시부야스카이') ||
    target.includes('shibuya sky') ||
    target.includes('전망대') ||
    target.includes('클룩') ||
    target.includes('klook') ||
    target.includes('마이리얼트립') ||
    target.includes('ticket') ||
    target.includes('투어') ||
    target.includes('입장권') ||
    target.includes('미술관') ||
    target.includes('museum')
  ) {
    return '입장료';
  }

  // 교통
  if (
    target.includes('지하철') ||
    target.includes('subway') ||
    target.includes('metro') ||
    target.includes('jr') ||
    target.includes('소부선') ||
    target.includes('스이카') ||
    target.includes('suica') ||
    target.includes('파스모') ||
    target.includes('pasmo') ||
    target.includes('교통') ||
    target.includes('택시') ||
    target.includes('taxi') ||
    target.includes('항공') ||
    target.includes('air') ||
    target.includes('flight') ||
    target.includes('리무진')
  ) {
    return '교통';
  }

  // 숙박
  if (
    target.includes('호텔') ||
    target.includes('hotel') ||
    target.includes('롯데시티') ||
    target.includes('lotte') ||
    target.includes('아고다') ||
    target.includes('agoda') ||
    target.includes('에어비앤비') ||
    target.includes('airbnb') ||
    target.includes('booking') ||
    target.includes('숙소') ||
    target.includes('트립닷컴')
  ) {
    return '숙박';
  }

  // 쇼핑
  if (
    target.includes('돈키호테') ||
    target.includes('donki') ||
    target.includes('유니클로') ||
    target.includes('uniqlo') ||
    target.includes('백화점') ||
    target.includes('면세점') ||
    target.includes('duty free') ||
    target.includes('빅카메라') ||
    target.includes('bic camera') ||
    target.includes('이토야') ||
    target.includes('itoya') ||
    target.includes('마켓') ||
    target.includes('쇼핑') ||
    target.includes('shopping') ||
    target.includes('기념품') ||
    target.includes('굿즈') ||
    target.includes('store') ||
    target.includes('shop')
  ) {
    return '쇼핑';
  }

  // 식비 (편의점, 라멘, 식당 등 기본)
  if (
    target.includes('패밀리마트') ||
    target.includes('family') ||
    target.includes('세븐일레븐') ||
    target.includes('7-eleven') ||
    target.includes('로손') ||
    target.includes('lawson') ||
    target.includes('라멘') ||
    target.includes('ramen') ||
    target.includes('이치란') ||
    target.includes('스시') ||
    target.includes('sushi') ||
    target.includes('돈카츠') ||
    target.includes('규카츠') ||
    target.includes('우동') ||
    target.includes('udon') ||
    target.includes('식당') ||
    target.includes('음식') ||
    target.includes('레스토랑') ||
    target.includes('restaurant') ||
    target.includes('밥') ||
    target.includes('버거') ||
    target.includes('마트') ||
    target.includes('food')
  ) {
    return '식비';
  }

  return '식비';
}

/**
 * 사용처를 기반으로 위치 유추
 */
export function inferLocation(merchant: string): string {
  const m = merchant.toLowerCase();
  if (m.includes('긴시초') || m.includes('kinshicho') || m.includes('스미다')) return '긴시초';
  if (m.includes('디즈니') || m.includes('disney') || m.includes('마이하마')) return '디즈니씨';
  if (m.includes('아사쿠사') || m.includes('asakusa') || m.includes('센소지')) return '아사쿠사';
  if (m.includes('오시아게') || m.includes('스카이트리') || m.includes('skytree')) return '오시아게';
  if (m.includes('우에노') || m.includes('ueno')) return '우에노';
  if (m.includes('신주쿠') || m.includes('shinjuku')) return '신주쿠';
  if (m.includes('시부야') || m.includes('shibuya')) return '시부야';
  if (m.includes('긴자') || m.includes('ginza')) return '긴자';
  if (m.includes('롯폰기') || m.includes('roppongi')) return '롯폰기';
  if (m.includes('쓰키지') || m.includes('tsukiji')) return '쓰키지';
  if (m.includes('나리타') || m.includes('narita') || m.includes('공항')) return '나리타공항';
  if (m.includes('후지산') || m.includes('가와구치코')) return '가와구치코';
  if (m.includes('해리포터') || m.includes('토시마엔')) return '네리마';
  return '도쿄';
}

/**
 * 삼성카드 카카오톡 알림톡 및 승인 SMS 텍스트 스마트 파서 (방법 2 구현)
 */
export function parseSamsungCardNotification(text: string): ParsedSamsungCardResult {
  const clean = text.trim();
  const isSamsungCard = clean.includes('삼성카드') || clean.includes('삼성');

  // 1. 날짜 및 시간 추출
  // 지원 형식:
  // - 01/14 13:45
  // - 2026/01/10 15:30
  // - 2026.01.10 15:30
  // - 01.14 13:45
  // - 1월 14일 13:45
  // - 01-14 13:45
  let year = 2026;
  let month = 1;
  let day = 13;
  let hour = 12;
  let minute = 0;
  let dateFound = false;
  let timeFound = false;

  // Regex 1: YYYY[./-]MM[./-]DD HH:mm
  const fullDateMatch = clean.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})\s+(\d{1,2}):(\d{2})/);
  // Regex 2: MM[./-]DD HH:mm 또는 MM월 DD일 HH:mm
  const shortDateMatch = clean.match(/(?:(\d{1,2})[./-](\d{1,2})|(\d{1,2})월\s*(\d{1,2})일)\s+(\d{1,2}):(\d{2})/);
  // Regex 3: 일시: MM/DD HH:mm
  const prefixDateMatch = clean.match(/(?:일시|이용일시|승인일시|일자)\s*[:*]?\s*(\d{1,2})[./-](\d{1,2})\s+(\d{1,2}):(\d{2})/);

  if (fullDateMatch) {
    year = parseInt(fullDateMatch[1], 10);
    month = parseInt(fullDateMatch[2], 10);
    day = parseInt(fullDateMatch[3], 10);
    hour = parseInt(fullDateMatch[4], 10);
    minute = parseInt(fullDateMatch[5], 10);
    dateFound = true;
    timeFound = true;
  } else if (prefixDateMatch) {
    month = parseInt(prefixDateMatch[1], 10);
    day = parseInt(prefixDateMatch[2], 10);
    hour = parseInt(prefixDateMatch[3], 10);
    minute = parseInt(prefixDateMatch[4], 10);
    dateFound = true;
    timeFound = true;
  } else if (shortDateMatch) {
    month = parseInt(shortDateMatch[1] || shortDateMatch[3], 10);
    day = parseInt(shortDateMatch[2] || shortDateMatch[4], 10);
    hour = parseInt(shortDateMatch[5], 10);
    minute = parseInt(shortDateMatch[6], 10);
    dateFound = true;
    timeFound = true;
  } else {
    // If no date was found in message, default to current local time or Day 1
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    day = now.getDate();
    hour = now.getHours();
    minute = now.getMinutes();
  }

  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const dayInfo = determineTripDay(month, day, year);
  const dateStr = dayInfo.day === 0 ? `사전예약 (${month}월 ${day}일)` : `${month}월 ${day}일`;
  const fullDateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${timeStr}`;

  // 2. 통화 및 금액 추출
  let currency: 'JPY' | 'KRW' | 'USD' = 'JPY';
  let originalAmount = 0;
  let amountJPY = 0;

  // JPY patterns: "1,280엔", "JPY 1,280", "¥1,280", "1280엔(승인)"
  const jpyMatch = clean.match(/(?:JPY\s*|¥\s*)([0-9,]+)|([0-9,]+)\s*(?:엔|JPY)/i);
  // KRW patterns: "15,000원", "KRW 15,000", "₩15,000"
  const krwMatch = clean.match(/(?:KRW\s*|₩\s*)([0-9,]+)|([0-9,]+)\s*(?:원|KRW)/i);
  // USD patterns: "$25.50", "USD 25.50"
  const usdMatch = clean.match(/(?:USD\s*|\$\s*)([0-9,.]+)|([0-9,.]+)\s*(?:USD|\$)/i);

  if (jpyMatch) {
    const numStr = (jpyMatch[1] || jpyMatch[2]).replace(/,/g, '');
    currency = 'JPY';
    originalAmount = parseInt(numStr, 10) || 0;
    amountJPY = originalAmount;
  } else if (krwMatch) {
    const numStr = (krwMatch[1] || krwMatch[2]).replace(/,/g, '');
    currency = 'KRW';
    originalAmount = parseInt(numStr, 10) || 0;
    amountJPY = convertKRWtoJPY(originalAmount);
  } else if (usdMatch) {
    const numStr = (usdMatch[1] || usdMatch[2]).replace(/,/g, '');
    currency = 'USD';
    const parsedUsd = parseFloat(numStr) || 0;
    originalAmount = parsedUsd;
    amountJPY = convertUSDtoJPY(parsedUsd);
  } else {
    // Fallback: search for any standalone number with commas
    const genericNumberMatch = clean.match(/(?:일시불|승인금액|금액|승인)\s*[:*]?\s*([0-9,]+)/);
    if (genericNumberMatch) {
      const numStr = genericNumberMatch[1].replace(/,/g, '');
      const parsed = parseInt(numStr, 10) || 0;
      // If over 5,000 and has '원' in text, treat as KRW, else JPY
      if (clean.includes('원') || parsed > 30000) {
        currency = 'KRW';
        originalAmount = parsed;
        amountJPY = convertKRWtoJPY(parsed);
      } else {
        currency = 'JPY';
        originalAmount = parsed;
        amountJPY = parsed;
      }
    }
  }

  // 3. 가맹점 (사용처) 추출
  let merchant = '';
  // Explicit line: *가맹점: LAWSON, 이용처: KLOOK
  const merchantPrefixMatch = clean.match(/(?:가맹점|이용처|사용처|상호|가맹점명)\s*[:*]?\s*([^\n\r]+)/);
  if (merchantPrefixMatch) {
    merchant = merchantPrefixMatch[1].trim();
  } else {
    // Look line by line in KakaoTalk message
    const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);
    // Remove lines like "[삼성카드]", "김*우님", "01/14 13:45", "일시불 1,280엔", "누적 ..."
    for (const line of lines) {
      if (
        line.startsWith('[') ||
        line.includes('삼성카드') ||
        line.includes('승인안내') ||
        line.includes('해외승인') ||
        line.includes('누적') ||
        line.includes('일시불') ||
        line.includes('할부') ||
        line.includes('잔여한도') ||
        line.includes('알림톡') ||
        line.includes('채널추가') ||
        line.includes('http') ||
        line.match(/\d{1,2}[./-]\d{1,2}/) ||
        line.endsWith('님')
      ) {
        continue;
      }
      if (line.length > 1) {
        merchant = line;
        break;
      }
    }
  }

  if (!merchant) {
    merchant = '삼성카드 결제처';
  }

  // Clean merchant noise
  merchant = merchant
    .replace(/^[*•-]\s*/, '')
    .replace(/\s*(?:승인|완료|일시불)$/, '')
    .trim();

  // 4. 카테고리 & 위치 유추
  const category = inferCategory(merchant, clean);
  const location = inferLocation(merchant);

  // 5. 할부 및 메모
  let installment = '일시불';
  if (clean.includes('해외승인') || clean.includes('해외이용')) {
    installment = '해외승인';
  } else if (clean.includes('할부')) {
    const instMatch = clean.match(/(\d+)개월\s*할부/);
    installment = instMatch ? `${instMatch[1]}개월 할부` : '할부';
  }

  let note = `삼성카드 ${installment} (카톡 알림톡 자동 연동)`;
  if (currency === 'KRW') {
    note = `삼성카드 원화 ₩${originalAmount.toLocaleString()}원 결제 (약 ¥${amountJPY.toLocaleString()} 환산)`;
  } else if (currency === 'USD') {
    note = `삼성카드 달러 $${originalAmount.toLocaleString()} 결제 (약 ¥${amountJPY.toLocaleString()} 환산)`;
  }

  return {
    rawText: text,
    isSamsungCard,
    cardCompany: '삼성카드',
    dateStr,
    timeStr,
    fullDateTimeStr,
    day: dayInfo.day,
    currency,
    originalAmount,
    amountJPY,
    merchant,
    category,
    location,
    paidBy: '현우가족',
    paymentMethod: 'CARD',
    scope: 'HYEONWOO',
    note,
    installment
  };
}

/**
 * 실시간 테스트를 위한 삼성카드 카카오톡 알림톡 대표 샘플 모음
 */
export const SAMSUNG_CARD_SAMPLE_TEMPLATES = [
  {
    title: '✈️ [여행 전 사전예약] Klook 도쿄 티켓 결제 (원화)',
    badge: '사전예약/준비 (Day 0)',
    text: `[삼성카드] 승인안내
김*우님
2026.01.08 14:25
일시불 35,000원
KLOOK TOKYO TOUR
누적 1,420,000원`
  },
  {
    title: '🏪 [도쿄 현지 1일차] 패밀리마트 편의점 간식 (엔화)',
    badge: '1일차 (1월 13일)',
    text: `[삼성카드] 해외승인안내
김*우님
01/13 21:40
일시불 1,280엔
FAMILY MART KINSHICHO
누적 125,000엔`
  },
  {
    title: '🍜 [도쿄 현지 2일차] 디즈니씨 기념품 굿즈샵 (엔화)',
    badge: '2일차 (1월 14일)',
    text: `[삼성카드] 해외승인
*일시: 01/14 15:30
*카드: 삼성카드(현우)
*금액: JPY 4,500
*가맹점: TOKYO DISNEYSEA SHOP`
  },
  {
    title: '☕ [도쿄 현지 3일차] 후지산 가와구치코 기념품/간식 (엔화)',
    badge: '3일차 (1월 15일)',
    text: `[삼성카드]
김*우님
01/15 11:20
일시불 2,150엔
LAKE BAKE KAWAGUCHIKO`
  },
  {
    title: '🛍️ [도쿄 현지 4일차] 시부야 돈키호테 개별 쇼핑 (엔화)',
    badge: '4일차 (1월 16일)',
    text: `[삼성카드] 해외이용승인
01/16 22:15
JPY 8,900
MEGA DON QUIJOTE SHIBUYA
삼성카드`
  }
];
