import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseSamsungCardNotification } from './src/utils/samsungCardParser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'budget_db.json');

app.use(express.json());

// In-memory + JSON File Persistent Database Helper
function readBudgetDB(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading budget_db.json:', err);
  }
  return [];
}

function writeBudgetDB(items: any[]): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing budget_db.json:', err);
  }
}

// Authentication & Role Helper
function getAuthRole(req: express.Request): 'READ_ONLY' | 'HYUNWOO' | 'SEHYUN' | null {
  const pwd = (req.headers['x-budget-password'] as string) || (req.query.password as string);
  if (pwd === '1111') return 'READ_ONLY';
  if (pwd === '3539') return 'HYUNWOO';
  if (pwd === '0901') return 'SEHYUN';
  return null;
}

// RESTful API Routes for Shared Budget & Expenses
app.post('/api/budget/auth', (req, res) => {
  const { passcode } = req.body;
  if (passcode === '1111') {
    return res.json({ success: true, role: 'READ_ONLY', label: '조회 전용' });
  }
  if (passcode === '3539') {
    return res.json({ success: true, role: 'HYUNWOO', label: '현우가족 및 공동경비 관리자' });
  }
  if (passcode === '0901') {
    return res.json({ success: true, role: 'SEHYUN', label: '세현가족 및 공동경비 관리자' });
  }
  return res.status(401).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
});

// Real-time automatic webhook for Samsung Card notifications (복사/붙여넣기 없이 자동 등록)
app.all('/api/budget/webhook/samsung-card', (req, res) => {
  if (req.method === 'GET') {
    return res.json({
      status: 'ACTIVE',
      endpoint: '/api/budget/webhook/samsung-card',
      target: '현우가족 삼성카드 실시간 자동 등록 웹훅 (방법 2 자동화)',
      method: 'POST',
      contentType: 'application/json',
      expectedBody: {
        message: '[삼성카드] 01/14 13:45 일시불 1,280엔 FAMILY MART',
        key: '3539'
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const secret = (req.query.key as string) || (req.headers['x-budget-key'] as string) || req.body?.key;
  if (secret && secret !== '3539' && secret !== 'tokyo2026') {
    return res.status(403).json({ success: false, message: 'Invalid webhook key' });
  }

  const raw = req.body?.message || req.body?.text || req.body?.notification || req.body?.title;
  const messageText = typeof raw === 'string' ? raw.trim() : '';

  if (!messageText) {
    return res.status(400).json({
      success: false,
      message: '알림톡 메시지 텍스트(message)가 필요합니다.'
    });
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
});

app.get('/api/budget', (req, res) => {
  const role = getAuthRole(req);
  if (!role) {
    return res.status(401).json({
      success: false,
      message: '비밀번호 인증이 필요합니다.'
    });
  }
  const items = readBudgetDB();
  res.json({ success: true, count: items.length, items, role });
});

app.post('/api/budget', (req, res) => {
  const role = getAuthRole(req);
  if (!role) {
    return res.status(401).json({ success: false, message: '비밀번호 인증이 필요합니다.' });
  }
  if (role === 'READ_ONLY') {
    return res.status(403).json({ success: false, message: '조회 전용 권한입니다. 등록 권한이 없습니다.' });
  }

  const newItem = req.body;
  if (!newItem || !newItem.title || typeof newItem.amountJPY !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid budget item payload' });
  }

  // Permission check by family
  if (role === 'HYUNWOO' && newItem.scope === 'SEHYEON') {
    return res.status(403).json({ success: false, message: '현우가족 관리 권한은 세현가족 전용 경비를 등록할 수 없습니다.' });
  }
  if (role === 'SEHYUN' && newItem.scope === 'HYEONWOO') {
    return res.status(403).json({ success: false, message: '세현가족 관리 권한은 현우가족 전용 경비를 등록할 수 없습니다.' });
  }

  const items = readBudgetDB();
  const createdItem = {
    ...newItem,
    id: newItem.id || `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString()
  };
  items.push(createdItem);
  writeBudgetDB(items);

  res.status(201).json({ success: true, item: createdItem });
});

// Update budget item
app.put('/api/budget/:id', (req, res) => {
  const role = getAuthRole(req);
  if (!role) {
    return res.status(401).json({ success: false, message: '비밀번호 인증이 필요합니다.' });
  }
  if (role === 'READ_ONLY') {
    return res.status(403).json({ success: false, message: '조회 전용 권한입니다. 수정 권한이 없습니다.' });
  }

  const { id } = req.params;
  const updates = req.body;
  const items = readBudgetDB();
  const targetIndex = items.findIndex((item: any) => item.id === id);

  if (targetIndex === -1) {
    return res.status(404).json({ success: false, message: '수정할 항목을 찾을 수 없습니다.' });
  }

  const targetItem = items[targetIndex];
  if (role === 'HYUNWOO' && targetItem.scope === 'SEHYEON') {
    return res.status(403).json({ success: false, message: '현우가족 관리 권한은 세현가족 전용 항목을 수정할 수 없습니다.' });
  }
  if (role === 'SEHYUN' && targetItem.scope === 'HYEONWOO') {
    return res.status(403).json({ success: false, message: '세현가족 관리 권한은 현우가족 전용 항목을 수정할 수 없습니다.' });
  }

  items[targetIndex] = {
    ...targetItem,
    ...updates,
    id: targetItem.id,
    updatedAt: new Date().toISOString()
  };
  writeBudgetDB(items);

  res.json({ success: true, item: items[targetIndex] });
});

app.put('/api/budget/sync', (req, res) => {
  const role = getAuthRole(req);
  if (!role || role === 'READ_ONLY') {
    return res.status(403).json({ success: false, message: '동기화 권한이 없습니다.' });
  }
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ success: false, message: 'Items array required' });
  }
  writeBudgetDB(items);
  res.json({ success: true, count: items.length, items });
});

app.delete('/api/budget/:id', (req, res) => {
  const role = getAuthRole(req);
  if (!role) {
    return res.status(401).json({ success: false, message: '비밀번호 인증이 필요합니다.' });
  }
  if (role === 'READ_ONLY') {
    return res.status(403).json({ success: false, message: '조회 전용 권한입니다. 삭제 권한이 없습니다.' });
  }

  const { id } = req.params;
  let items = readBudgetDB();
  const target = items.find((item: any) => item.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: '삭제할 항목을 찾을 수 없습니다.' });
  }

  if (role === 'HYUNWOO' && target.scope === 'SEHYEON') {
    return res.status(403).json({ success: false, message: '현우가족 관리 권한은 세현가족 전용 항목을 삭제할 수 없습니다.' });
  }
  if (role === 'SEHYUN' && target.scope === 'HYEONWOO') {
    return res.status(403).json({ success: false, message: '세현가족 관리 권한은 현우가족 전용 항목을 삭제할 수 없습니다.' });
  }

  const initialLength = items.length;
  items = items.filter((item: any) => item.id !== id);
  writeBudgetDB(items);
  res.json({ success: true, deleted: items.length < initialLength });
});

app.post('/api/budget/reset', (req, res) => {
  const role = getAuthRole(req);
  if (!role || role === 'READ_ONLY') {
    return res.status(403).json({ success: false, message: '초기화 권한이 없습니다.' });
  }
  const { defaultItems } = req.body;
  const itemsToSave = Array.isArray(defaultItems) ? defaultItems : [];
  writeBudgetDB(itemsToSave);
  res.json({ success: true, count: itemsToSave.length, items: itemsToSave });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Tokyo Trip Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
