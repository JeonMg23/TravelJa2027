import fs from 'fs';
import path from 'path';
import { parseSamsungCardNotification } from '../src/utils/samsungCardParser';

const TMP_BUDGET_FILE = '/tmp/budget_db.json';
const TMP_PROFILES_FILE = '/tmp/profiles_db.json';

const SEED_BUDGET_FILE = path.join(process.cwd(), 'budget_db.json');
const SEED_PROFILES_FILE = path.join(process.cwd(), 'profiles_db.json');

export interface ExpeditionProfile {
  memberId: string;
  nickname: string;
  defaultNickname: string;
  avatarId: string;
  avatarEmoji: string;
  profileImageUrl?: string;
  updatedAt: string;
}

const DEFAULT_PROFILES: Record<string, ExpeditionProfile> = {
  kakao_hyunwoo_mom: {
    memberId: 'kakao_hyunwoo_mom',
    nickname: '현우맘',
    defaultNickname: '현우맘',
    avatarId: 'disney_rapunzel',
    avatarEmoji: '👑',
    updatedAt: new Date().toISOString()
  },
  kakao_sehyun_mom: {
    memberId: 'kakao_sehyun_mom',
    nickname: '세현맘',
    defaultNickname: '세현맘',
    avatarId: 'disney_elsa',
    avatarEmoji: '❄️',
    updatedAt: new Date().toISOString()
  },
  kakao_hyunwoo: {
    memberId: 'kakao_hyunwoo',
    nickname: '현우',
    defaultNickname: '현우',
    avatarId: 'smurf_jokey',
    avatarEmoji: '🎁',
    updatedAt: new Date().toISOString()
  },
  kakao_sehyun: {
    memberId: 'kakao_sehyun',
    nickname: '세현',
    defaultNickname: '세현',
    avatarId: 'smurf_brainy',
    avatarEmoji: '👓',
    updatedAt: new Date().toISOString()
  }
};

// Global in-memory cache across warm serverless invocations
const globalStore = globalThis as unknown as {
  __tokyoBudgetCache?: any[];
  __tokyoProfilesCache?: Record<string, ExpeditionProfile>;
};

function readBudgetDB(): any[] {
  if (Array.isArray(globalStore.__tokyoBudgetCache)) {
    return globalStore.__tokyoBudgetCache;
  }
  try {
    if (fs.existsSync(TMP_BUDGET_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(TMP_BUDGET_FILE, 'utf-8'));
      if (Array.isArray(parsed)) {
        globalStore.__tokyoBudgetCache = parsed;
        return parsed;
      }
    }
  } catch {}
  try {
    if (fs.existsSync(SEED_BUDGET_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SEED_BUDGET_FILE, 'utf-8'));
      if (Array.isArray(parsed)) {
        globalStore.__tokyoBudgetCache = parsed;
        return parsed;
      }
    }
  } catch {}
  globalStore.__tokyoBudgetCache = [];
  return [];
}

function writeBudgetDB(items: any[]): void {
  globalStore.__tokyoBudgetCache = items;
  try {
    fs.writeFileSync(TMP_BUDGET_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch {}
}

function readProfilesDB(): Record<string, ExpeditionProfile> {
  if (globalStore.__tokyoProfilesCache) {
    return globalStore.__tokyoProfilesCache;
  }
  try {
    if (fs.existsSync(TMP_PROFILES_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(TMP_PROFILES_FILE, 'utf-8'));
      if (parsed && typeof parsed === 'object') {
        globalStore.__tokyoProfilesCache = { ...DEFAULT_PROFILES, ...parsed };
        return globalStore.__tokyoProfilesCache;
      }
    }
  } catch {}
  try {
    if (fs.existsSync(SEED_PROFILES_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SEED_PROFILES_FILE, 'utf-8'));
      if (parsed && typeof parsed === 'object') {
        globalStore.__tokyoProfilesCache = { ...DEFAULT_PROFILES, ...parsed };
        return globalStore.__tokyoProfilesCache;
      }
    }
  } catch {}
  globalStore.__tokyoProfilesCache = { ...DEFAULT_PROFILES };
  return globalStore.__tokyoProfilesCache;
}

function writeProfilesDB(profiles: Record<string, ExpeditionProfile>): void {
  globalStore.__tokyoProfilesCache = profiles;
  try {
    fs.writeFileSync(TMP_PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
  } catch {}
}

function getAuthRole(req: any): 'READ_ONLY' | 'HYUNWOO' | 'SEHYUN' | null {
  const pwd = (req.headers?.['x-budget-password'] as string) || (req.query?.password as string);
  if (pwd === '1111') return 'READ_ONLY';
  if (pwd === '3539') return 'HYUNWOO';
  if (pwd === '0901') return 'SEHYUN';
  return null;
}

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const urlObj = new URL(req.url || '/api', `http://${req.headers?.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = (req.method || 'GET').toUpperCase();

  // 1. Shared Expedition Profiles API (/api/profiles & /api/profiles/:memberId)
  if (pathname === '/api/profiles' && method === 'GET') {
    const profiles = readProfilesDB();
    return res.status(200).json({ success: true, count: Object.keys(profiles).length, profiles });
  }

  if (pathname.startsWith('/api/profiles/') && method === 'PUT') {
    const memberId = decodeURIComponent(pathname.replace('/api/profiles/', '').split('/')[0]);
    const { nickname, avatarId, avatarEmoji, profileImageUrl } = req.body || {};
    const profiles = readProfilesDB();

    const existing = profiles[memberId] || DEFAULT_PROFILES[memberId] || {
      memberId,
      nickname: '도쿄원정대원',
      defaultNickname: '도쿄원정대원',
      avatarId: 'disney_rapunzel',
      avatarEmoji: '🎒',
      updatedAt: new Date().toISOString()
    };

    const updatedProfile: ExpeditionProfile = {
      ...existing,
      memberId,
      nickname: typeof nickname === 'string' && nickname.trim() ? nickname.trim() : existing.nickname,
      avatarId: avatarId || existing.avatarId,
      avatarEmoji: avatarEmoji || existing.avatarEmoji,
      updatedAt: new Date().toISOString()
    };

    if (profileImageUrl && typeof profileImageUrl === 'string' && profileImageUrl.trim()) {
      updatedProfile.profileImageUrl = profileImageUrl.trim();
    } else {
      delete updatedProfile.profileImageUrl;
    }

    profiles[memberId] = updatedProfile;
    writeProfilesDB(profiles);

    return res.status(200).json({
      success: true,
      message: `'${updatedProfile.nickname}' 프로필이 서버 DB에 안전하게 동기화되었습니다.`,
      profile: updatedProfile,
      profiles
    });
  }

  // 2. Budget Auth API (/api/budget/auth)
  if (pathname === '/api/budget/auth' && method === 'POST') {
    const { passcode } = req.body || {};
    if (passcode === '1111') {
      return res.status(200).json({ success: true, role: 'READ_ONLY', label: '조회 전용' });
    }
    if (passcode === '3539') {
      return res.status(200).json({ success: true, role: 'HYUNWOO', label: '현우가족 및 공동경비 관리자' });
    }
    if (passcode === '0901') {
      return res.status(200).json({ success: true, role: 'SEHYUN', label: '세현가족 및 공동경비 관리자' });
    }
    return res.status(401).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
  }

  // 3. Samsung Card Webhook (/api/budget/webhook/samsung-card)
  if (pathname === '/api/budget/webhook/samsung-card') {
    if (method === 'GET') {
      return res.status(200).json({
        status: 'ACTIVE',
        endpoint: '/api/budget/webhook/samsung-card',
        target: '현우가족 삼성카드 실시간 자동 등록 웹훅',
        method: 'POST'
      });
    }
    if (method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
    const raw = req.body?.message || req.body?.text || req.body?.notification || req.body?.title;
    const messageText = typeof raw === 'string' ? raw.trim() : '';
    if (!messageText) {
      return res.status(400).json({ success: false, message: '알림톡 메시지 텍스트(message)가 필요합니다.' });
    }
    const parsed = parseSamsungCardNotification(messageText);
    const items = readBudgetDB();
    const newItem = {
      id: `b-auto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'EXPENSE',
      day: parsed.day,
      date: parsed.dateStr,
      time: parsed.timeStr,
      title: parsed.merchant,
      category: parsed.category,
      amountJPY: parsed.amountJPY,
      paymentMethod: 'CARD',
      scope: 'HYEONWOO',
      paidBy: '현우가족',
      cardCompany: '삼성카드',
      location: parsed.location,
      note: `${parsed.note} (카톡 알림톡 실시간 무인 자동 등록)`,
      originalMessage: parsed.rawText,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    writeBudgetDB(items);
    return res.status(201).json({
      success: true,
      message: `[실시간 자동 등록 완료] ${newItem.title} ¥${newItem.amountJPY.toLocaleString()} 등록 완료`,
      item: newItem
    });
  }

  // 4. Budget Sync & Reset (/api/budget/sync & /api/budget/reset)
  if (pathname === '/api/budget/sync' && method === 'PUT') {
    const role = getAuthRole(req);
    if (!role || role === 'READ_ONLY') {
      return res.status(403).json({ success: false, message: '동기화 권한이 없습니다.' });
    }
    const { items } = req.body || {};
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array required' });
    }
    writeBudgetDB(items);
    return res.status(200).json({ success: true, count: items.length, items });
  }

  if (pathname === '/api/budget/reset' && method === 'POST') {
    const role = getAuthRole(req);
    if (!role || role === 'READ_ONLY') {
      return res.status(403).json({ success: false, message: '초기화 권한이 없습니다.' });
    }
    const { defaultItems } = req.body || {};
    const itemsToSave = Array.isArray(defaultItems) ? defaultItems : [];
    writeBudgetDB(itemsToSave);
    return res.status(200).json({ success: true, count: itemsToSave.length, items: itemsToSave });
  }

  // 5. Budget CRUD (/api/budget & /api/budget/:id)
  if (pathname === '/api/budget' && method === 'GET') {
    const role = getAuthRole(req);
    if (!role) {
      return res.status(401).json({ success: false, message: '비밀번호 인증이 필요합니다.' });
    }
    const items = readBudgetDB();
    return res.status(200).json({ success: true, count: items.length, items, role });
  }

  if (pathname === '/api/budget' && method === 'POST') {
    const role = getAuthRole(req);
    if (!role) {
      return res.status(401).json({ success: false, message: '비밀번호 인증이 필요합니다.' });
    }
    if (role === 'READ_ONLY') {
      return res.status(403).json({ success: false, message: '조회 전용 권한입니다.' });
    }
    const newItem = req.body;
    if (!newItem || !newItem.title || typeof newItem.amountJPY !== 'number') {
      return res.status(400).json({ success: false, message: 'Invalid budget item payload' });
    }
    const items = readBudgetDB();
    const createdItem = {
      ...newItem,
      id: newItem.id || `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    items.push(createdItem);
    writeBudgetDB(items);
    return res.status(201).json({ success: true, item: createdItem });
  }

  if (pathname.startsWith('/api/budget/') && (method === 'PUT' || method === 'DELETE')) {
    const role = getAuthRole(req);
    if (!role || role === 'READ_ONLY') {
      return res.status(403).json({ success: false, message: '수정/삭제 권한이 없습니다.' });
    }
    const id = decodeURIComponent(pathname.replace('/api/budget/', '').split('/')[0]);
    let items = readBudgetDB();

    if (method === 'PUT') {
      const idx = items.findIndex((item: any) => item.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: '수정할 항목을 찾을 수 없습니다.' });
      }
      items[idx] = {
        ...items[idx],
        ...(req.body || {}),
        id: items[idx].id,
        updatedAt: new Date().toISOString()
      };
      writeBudgetDB(items);
      return res.status(200).json({ success: true, item: items[idx] });
    } else {
      const initialLength = items.length;
      items = items.filter((item: any) => item.id !== id);
      writeBudgetDB(items);
      return res.status(200).json({ success: true, deleted: items.length < initialLength });
    }
  }

  return res.status(404).json({ success: false, message: `API route not found: ${pathname}` });
}
