import React, { useState, useMemo, useRef } from 'react';
import {
  BudgetItem,
  BudgetCategory,
  PaymentMethod,
  ExpenseScope,
  FamilyName
} from '../types/travel';

export type PaymentTypeOption =
  | 'CASH'
  | 'CASH_HYEONWOO'
  | 'CASH_SEHYEON'
  | 'CARD_SHARED'
  | 'CARD_HYEONWOO'
  | 'CARD_SEHYEON';

import {
  Wallet,
  CreditCard,
  Banknote,
  Users,
  Plus,
  Trash2,
  PieChart,
  Calendar,
  Layers,
  ArrowRightLeft,
  ChevronDown,
  Info,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  RotateCcw,
  Receipt,
  CheckCircle2,
  Building,
  UtensilsCrossed,
  Train,
  Ticket,
  ShoppingBag,
  Beer,
  Coffee,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Pencil,
  X
} from 'lucide-react';
import {
  BudgetAuthRole,
  getStoredBudgetPasscode,
  setStoredBudgetPasscode,
  getRoleFromPasscode,
  getRoleInfo,
  canManageItem,
  canRegisterScope
} from '../services/budgetAuth';
import { SamsungCardSyncModal } from './SamsungCardSyncModal';

function getCurrentTimeString(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function getDefaultDateString(day: number): string {
  if (day === 0) return '사전준비';
  return `1월 ${12 + day}일`;
}

interface BudgetLedgerViewProps {
  budget: BudgetItem[];
  onAddBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  onUpdateBudgetItem?: (id: string, updates: Partial<BudgetItem>) => void;
  onDeleteBudgetItem: (id: string) => void;
  onResetBudget?: () => void;
  onOpenReceipt?: (targetFamily?: 'ALL' | '현우가족' | '세현가족') => void;
}

const CATEGORY_ICONS: Record<BudgetCategory, { icon: React.ReactNode; color: string }> = {
  식비: { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  교통: { icon: <Train className="w-3.5 h-3.5" />, color: 'bg-sky-100 text-sky-800 border-sky-200' },
  숙박: { icon: <Building className="w-3.5 h-3.5" />, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  입장료: { icon: <Ticket className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  쇼핑: { icon: <ShoppingBag className="w-3.5 h-3.5" />, color: 'bg-pink-100 text-pink-800 border-pink-200' },
  '카페/디저트': { icon: <Coffee className="w-3.5 h-3.5" />, color: 'bg-rose-100 text-rose-800 border-rose-200' },
  '이자카야/주류': { icon: <Beer className="w-3.5 h-3.5" />, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  기타: { icon: <Receipt className="w-3.5 h-3.5" />, color: 'bg-slate-100 text-slate-800 border-slate-200' }
};

export const BudgetLedgerView: React.FC<BudgetLedgerViewProps> = ({
  budget,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
  onResetBudget,
  onOpenReceipt
}) => {
  // Authentication & Permission state
  const [authPasscode, setAuthPasscode] = useState<string | null>(() => getStoredBudgetPasscode());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const authRole: BudgetAuthRole = useMemo(() => {
    return authPasscode ? getRoleFromPasscode(authPasscode) : null;
  }, [authPasscode]);

  const roleInfo = useMemo(() => {
    return authRole ? getRoleInfo(authRole) : null;
  }, [authRole]);

  // Samsung Card KakaoTalk Alimtalk modal state (방법 2 구현)
  const [isSamsungCardModalOpen, setIsSamsungCardModalOpen] = useState(false);

  // Ref for registration form container and input to enable scroll & focus
  const registrationFormRef = useRef<HTMLDivElement>(null);
  const expenseTitleInputRef = useRef<HTMLInputElement>(null);

  // Edit item state
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDay, setEditDay] = useState(1);
  const [editDate, setEditDate] = useState('1월 13일');
  const [editTime, setEditTime] = useState(getCurrentTimeString());
  const [editLocation, setEditLocation] = useState('');
  const [editCategory, setEditCategory] = useState<BudgetCategory>('식비');
  const [editPaymentType, setEditPaymentType] = useState<PaymentTypeOption>('CASH');
  const [editCardPayer, setEditCardPayer] = useState<FamilyName>('현우가족');
  const [editNote, setEditNote] = useState('');

  // Navigation tabs within ledger: 'ledger' (일자별 가계부), 'stats' (어디에/언제/얼마나 통계), 'settlement' (가족별 정산)
  const [subTab, setSubTab] = useState<'ledger' | 'stats' | 'settlement'>('ledger');

  // Filters
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<
    | 'all'
    | 'CASH'
    | 'CASH_HYEONWOO'
    | 'CASH_SEHYEON'
    | 'CARD_SHARED'
    | 'CARD_HYEONWOO'
    | 'CARD_SEHYEON'
  >('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form tab & states
  const [formMode, setFormMode] = useState<'expense' | 'deposit'>('expense');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Expense form fields (날짜 및 시간 자동 등록 지원)
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDay, setExpenseDay] = useState(1);
  const [expenseDate, setExpenseDate] = useState('1월 13일');
  const [expenseTime, setExpenseTime] = useState(getCurrentTimeString());
  const [expenseLocation, setExpenseLocation] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<BudgetCategory>('식비');
  const [expensePaymentType, setExpensePaymentType] = useState<PaymentTypeOption>('CASH');
  const [cardPayer, setCardPayer] = useState<FamilyName>('현우가족');
  const [expenseNote, setExpenseNote] = useState('');

  // Deposit (공동경비 모금) form fields
  const [depositFamily, setDepositFamily] = useState<FamilyName>('현우가족');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDay, setDepositDay] = useState(0);
  const [depositDate, setDepositDate] = useState('사전준비');
  const [depositTime, setDepositTime] = useState(getCurrentTimeString());
  const [depositNote, setDepositNote] = useState('1차 현금 공동경비 갹출');

  // Exchange rate: 100 JPY ~ 920 KRW (1 JPY = 9.2 KRW)
  const toKRW = (jpy: number) => Math.round(jpy * 9.2);

  // ===================== Calculations =====================

  // 1. Deposits (현금 공동경비 모금)
  const deposits = useMemo(() => {
    return budget.filter((item) => item.type === 'DEPOSIT');
  }, [budget]);

  const totalDepositsJPY = useMemo(() => {
    return deposits.reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [deposits]);

  const hyeonwooDepositJPY = useMemo(() => {
    return deposits
      .filter((d) => d.paidBy === '현우가족')
      .reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [deposits]);

  const sehyeonDepositJPY = useMemo(() => {
    return deposits
      .filter((d) => d.paidBy === '세현가족')
      .reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [deposits]);

  // 2. Expenses (지출)
  const expenses = useMemo(() => {
    return budget.filter((item) => item.type !== 'DEPOSIT');
  }, [budget]);

  // Shared Cash Expenses (공동경비 현금 차감 - 모금 풀에서 사용)
  const sharedCashExpenses = useMemo(() => {
    return expenses.filter(
      (e) =>
        e.paymentMethod === 'CASH' &&
        (e.scope === 'SHARED' || e.paidBy === '공동경비' || e.paidBy === '공동경비(현금)')
    );
  }, [expenses]);

  const totalCashSpentJPY = useMemo(() => {
    return sharedCashExpenses.reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [sharedCashExpenses]);

  // Cash Remaining Balance in Joint Pool (현금 공동경비 풀 잔액)
  const cashRemainingJPY = totalDepositsJPY - totalCashSpentJPY;

  // Personal Individual Cash Expenses (각 가족 개별 현금 지출)
  const hyeonwooPersonalCashExpenses = useMemo(() => {
    return expenses.filter(
      (e) =>
        e.paymentMethod === 'CASH' &&
        (e.scope === 'HYEONWOO' || (e.scope !== 'SHARED' && e.paidBy === '현우가족'))
    );
  }, [expenses]);

  const sehyeonPersonalCashExpenses = useMemo(() => {
    return expenses.filter(
      (e) =>
        e.paymentMethod === 'CASH' &&
        (e.scope === 'SEHYEON' || (e.scope !== 'SHARED' && e.paidBy === '세현가족'))
    );
  }, [expenses]);

  const hyeonwooPersonalCashJPY = useMemo(() => {
    return hyeonwooPersonalCashExpenses.reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [hyeonwooPersonalCashExpenses]);

  const sehyeonPersonalCashJPY = useMemo(() => {
    return sehyeonPersonalCashExpenses.reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [sehyeonPersonalCashExpenses]);

  const totalPersonalCashJPY = hyeonwooPersonalCashJPY + sehyeonPersonalCashJPY;

  // Card Expenses: Shared vs Family-specific
  const cardExpenses = useMemo(() => {
    return expenses.filter(
      (e) => e.paymentMethod === 'CARD' && e.paidBy !== '공동경비' && e.paidBy !== '공동경비(현금)'
    );
  }, [expenses]);

  // Card Shared (공동 사용 - 1/2 정산 대상)
  const cardSharedExpenses = useMemo(() => {
    return cardExpenses.filter((e) => e.scope === 'SHARED');
  }, [cardExpenses]);

  const totalCardSharedJPY = useMemo(() => {
    return cardSharedExpenses.reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [cardSharedExpenses]);

  // Who paid what for card shared
  const hyeonwooCardSharedPaidJPY = useMemo(() => {
    return cardSharedExpenses
      .filter((e) => e.paidBy === '현우가족')
      .reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [cardSharedExpenses]);

  const sehyeonCardSharedPaidJPY = useMemo(() => {
    return cardSharedExpenses
      .filter((e) => e.paidBy === '세현가족')
      .reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [cardSharedExpenses]);

  // Family-specific Personal Card
  const hyeonwooPersonalCardJPY = useMemo(() => {
    return cardExpenses
      .filter((e) => e.scope === 'HYEONWOO' || (e.scope !== 'SHARED' && e.paidBy === '현우가족'))
      .reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [cardExpenses]);

  const sehyeonPersonalCardJPY = useMemo(() => {
    return cardExpenses
      .filter((e) => e.scope === 'SEHYEON' || (e.scope !== 'SHARED' && e.paidBy === '세현가족'))
      .reduce((acc, curr) => acc + curr.amountJPY, 0);
  }, [cardExpenses]);

  // Grand Totals (공동현금 + 공동카드 + 현우개별(현금+카드) + 세현개별(현금+카드))
  const grandTotalExpenseJPY =
    totalCashSpentJPY +
    totalCardSharedJPY +
    hyeonwooPersonalCardJPY +
    sehyeonPersonalCardJPY +
    hyeonwooPersonalCashJPY +
    sehyeonPersonalCashJPY;

  // 3. Settlement Calculation (정산)
  // Shared expenses to be split 50:50 between 현우가족 (2인) & 세현가족 (2인)
  // Total shared burden = totalCashSpentJPY (already covered by cash fund deposits) + totalCardSharedJPY
  // In cash fund: each family should ideally contribute half of totalCashSpentJPY.
  // Cash contribution difference:
  const cashDifference = hyeonwooDepositJPY - sehyeonDepositJPY; // if > 0, 현우가 더 냄
  // Card shared difference:
  // Each family's card share is totalCardSharedJPY / 2
  // 현우가족 paid: hyeonwooCardSharedPaidJPY
  // 세현가족 paid: sehyeonCardSharedPaidJPY
  const cardDifference = hyeonwooCardSharedPaidJPY - sehyeonCardSharedPaidJPY; // if > 0, 현우가 더 결제함

  // Net settlement:
  // How much 세현가족 owes 현우가족 (or vice versa):
  // Net owed to 현우가족 = (cardDifference / 2) + (cashDifference / 2)
  const netOwedToHyeonwoo = Math.round(cardDifference / 2 + cashDifference / 2);

  // 4. Filtering for the ledger list
  const filteredBudgetItems = useMemo(() => {
    return budget.filter((item) => {
      // Day filter
      if (selectedDayFilter !== 'all' && item.day !== selectedDayFilter) {
        return false;
      }
      // Payment filter
      if (selectedPaymentFilter === 'CASH') {
        if (item.type === 'DEPOSIT') return true; // show deposits in cash filter
        // Shared cash only
        if (item.paymentMethod !== 'CASH') return false;
        if (item.scope === 'HYEONWOO' || item.scope === 'SEHYEON') return false;
        if (item.paidBy !== '공동경비' && item.paidBy !== '공동경비(현금)' && item.scope !== 'SHARED') return false;
      } else if (selectedPaymentFilter === 'CASH_HYEONWOO') {
        if (item.type === 'DEPOSIT') return false;
        if (item.paymentMethod !== 'CASH') return false;
        if (item.scope !== 'HYEONWOO' && !(item.scope !== 'SHARED' && item.paidBy === '현우가족')) return false;
      } else if (selectedPaymentFilter === 'CASH_SEHYEON') {
        if (item.type === 'DEPOSIT') return false;
        if (item.paymentMethod !== 'CASH') return false;
        if (item.scope !== 'SEHYEON' && !(item.scope !== 'SHARED' && item.paidBy === '세현가족')) return false;
      } else if (selectedPaymentFilter === 'CARD_SHARED') {
        if (item.type === 'DEPOSIT') return false;
        if (item.paymentMethod !== 'CARD' || item.scope !== 'SHARED') return false;
      } else if (selectedPaymentFilter === 'CARD_HYEONWOO') {
        if (item.type === 'DEPOSIT') return false;
        if (item.paymentMethod !== 'CARD' || (item.scope !== 'HYEONWOO' && !(item.scope !== 'SHARED' && item.paidBy === '현우가족'))) return false;
      } else if (selectedPaymentFilter === 'CARD_SEHYEON') {
        if (item.type === 'DEPOSIT') return false;
        if (item.paymentMethod !== 'CARD' || (item.scope !== 'SEHYEON' && !(item.scope !== 'SHARED' && item.paidBy === '세현가족'))) return false;
      }
      // Category filter
      if (selectedCategoryFilter !== 'all' && item.category !== selectedCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [budget, selectedDayFilter, selectedPaymentFilter, selectedCategoryFilter]);

  // Grouped by day
  const groupedByDay = useMemo(() => {
    const days = [0, 1, 2, 3, 4, 5, 6];
    const map: Record<number, BudgetItem[]> = {};
    days.forEach((d) => (map[d] = []));
    filteredBudgetItems.forEach((item) => {
      if (map[item.day]) {
        map[item.day].push(item);
      } else {
        map[item.day] = [item];
      }
    });
    return map;
  }, [filteredBudgetItems]);

  // 5. Statistics (언제, 어디에, 얼마나)
  // When (Day breakdown)
  const dayStats = useMemo(() => {
    const days = [0, 1, 2, 3, 4, 5, 6];
    return days.map((d) => {
      const items = expenses.filter((e) => e.day === d);
      const total = items.reduce((acc, curr) => acc + curr.amountJPY, 0);
      const cash = items
        .filter((e) => e.paymentMethod === 'CASH' || e.paidBy === '공동경비' || e.paidBy === '공동경비(현금)')
        .reduce((acc, curr) => acc + curr.amountJPY, 0);
      const card = total - cash;
      const label = d === 0 ? '사전준비' : `Day ${d}`;
      return { day: d, label, total, cash, card };
    });
  }, [expenses]);

  const maxDayExpense = Math.max(...dayStats.map((d) => d.total), 1);

  // Where (Category breakdown)
  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amountJPY;
    });
    return Object.entries(map)
      .map(([cat, amount]) => ({
        category: cat as BudgetCategory,
        amount,
        percent: grandTotalExpenseJPY > 0 ? Math.round((amount / grandTotalExpenseJPY) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, grandTotalExpenseJPY]);

  // Where (Top Locations/Spots)
  const locationStats = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const loc = e.location || (e.title.split(' ')[0] ?? '기타');
      map[loc] = (map[loc] || 0) + e.amountJPY;
    });
    return Object.entries(map)
      .map(([location, amount]) => ({
        location,
        amount,
        percent: grandTotalExpenseJPY > 0 ? Math.round((amount / grandTotalExpenseJPY) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [expenses, grandTotalExpenseJPY]);

  // How much (Payment methods breakdown)
  const paymentShareStats = useMemo(() => {
    return [
      {
        label: '현금 공동경비 차감',
        amount: totalCashSpentJPY,
        color: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        bgSoft: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <Banknote className="w-4 h-4" />
      },
      {
        label: '공동 사용 카드 (1/2 정산)',
        amount: totalCardSharedJPY,
        color: 'bg-indigo-500',
        textColor: 'text-indigo-700',
        bgSoft: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: <Users className="w-4 h-4" />
      },
      {
        label: '현우가족 개별 카드',
        amount: hyeonwooPersonalCardJPY,
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgSoft: 'bg-blue-50',
        border: 'border-blue-200',
        icon: <CreditCard className="w-4 h-4" />
      },
      {
        label: '현우가족 개별 현금',
        amount: hyeonwooPersonalCashJPY,
        color: 'bg-sky-500',
        textColor: 'text-sky-700',
        bgSoft: 'bg-sky-50',
        border: 'border-sky-200',
        icon: <Banknote className="w-4 h-4" />
      },
      {
        label: '세현가족 개별 카드',
        amount: sehyeonPersonalCardJPY,
        color: 'bg-rose-500',
        textColor: 'text-rose-700',
        bgSoft: 'bg-rose-50',
        border: 'border-rose-200',
        icon: <CreditCard className="w-4 h-4" />
      },
      {
        label: '세현가족 개별 현금',
        amount: sehyeonPersonalCashJPY,
        color: 'bg-amber-500',
        textColor: 'text-amber-700',
        bgSoft: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <Banknote className="w-4 h-4" />
      }
    ].map((item) => ({
      ...item,
      percent: grandTotalExpenseJPY > 0 ? Math.round((item.amount / grandTotalExpenseJPY) * 100) : 0
    }));
  }, [
    totalCashSpentJPY,
    totalCardSharedJPY,
    hyeonwooPersonalCardJPY,
    sehyeonPersonalCardJPY,
    hyeonwooPersonalCashJPY,
    sehyeonPersonalCashJPY,
    grandTotalExpenseJPY
  ]);

  // Function to open registration form and smoothly scroll/focus into view
  const handleOpenRegistrationForm = (mode: 'expense' | 'deposit' = 'expense') => {
    setFormMode(mode);
    setIsFormOpen(true);
    const nowTime = getCurrentTimeString();
    setExpenseTime(nowTime);
    setDepositTime(nowTime);
    setExpenseDate(getDefaultDateString(expenseDay));
    setDepositDate(getDefaultDateString(depositDay));
    // Smoothly scroll down to the registration form container
    setTimeout(() => {
      if (registrationFormRef.current) {
        registrationFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (mode === 'expense' && expenseTitleInputRef.current) {
        expenseTitleInputRef.current.focus();
      }
    }, 100);
  };

  // ===================== Handlers =====================
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    let paymentMethod: PaymentMethod = 'CASH';
    let scope: ExpenseScope = 'SHARED';
    let paidBy = '공동경비(현금)';

    if (expensePaymentType === 'CASH') {
      paymentMethod = 'CASH';
      scope = 'SHARED';
      paidBy = '공동경비(현금)';
    } else if (expensePaymentType === 'CASH_HYEONWOO') {
      paymentMethod = 'CASH';
      scope = 'HYEONWOO';
      paidBy = '현우가족';
    } else if (expensePaymentType === 'CASH_SEHYEON') {
      paymentMethod = 'CASH';
      scope = 'SEHYEON';
      paidBy = '세현가족';
    } else if (expensePaymentType === 'CARD_SHARED') {
      paymentMethod = 'CARD';
      scope = 'SHARED';
      paidBy = cardPayer;
    } else if (expensePaymentType === 'CARD_HYEONWOO') {
      paymentMethod = 'CARD';
      scope = 'HYEONWOO';
      paidBy = '현우가족';
    } else if (expensePaymentType === 'CARD_SEHYEON') {
      paymentMethod = 'CARD';
      scope = 'SEHYEON';
      paidBy = '세현가족';
    }

    onAddBudgetItem({
      type: 'EXPENSE',
      title: expenseTitle.trim(),
      category: expenseCategory,
      amountJPY: parseInt(expenseAmount, 10) || 0,
      day: expenseDay,
      date: expenseDate || getDefaultDateString(expenseDay),
      time: expenseTime || getCurrentTimeString(),
      paymentMethod,
      scope,
      paidBy,
      location: expenseLocation.trim() || undefined,
      note: expenseNote.trim() || undefined
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseLocation('');
    setExpenseNote('');
    setIsFormOpen(false);
  };

  const handleAddDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;

    onAddBudgetItem({
      type: 'DEPOSIT',
      title: `${depositFamily} 현금 공동경비 각출 입금`,
      category: '기타',
      amountJPY: parseInt(depositAmount, 10) || 0,
      day: depositDay,
      date: depositDate || getDefaultDateString(depositDay),
      time: depositTime || getCurrentTimeString(),
      paymentMethod: 'CASH',
      scope: 'SHARED',
      paidBy: depositFamily,
      location: '환전 / 공금 풀',
      note: depositNote.trim() || '공동경비 현금 각출 납부'
    });

    setDepositAmount('');
    setDepositNote('현금 공동경비 추가 각출');
    setIsFormOpen(false);
  };

  // ===================== Auth & Edit Handlers =====================
  const handlePinSubmit = (inputCode: string) => {
    const code = inputCode.trim();
    if (['1111', '3539', '0901'].includes(code)) {
      setStoredBudgetPasscode(code);
      setAuthPasscode(code);
      setPinError(null);
      setPinInput('');
    } else {
      setPinError('비밀번호가 올바르지 않습니다. 다시 입력해주세요.');
    }
  };

  const handleLogout = () => {
    setStoredBudgetPasscode(null);
    setAuthPasscode(null);
    setPinInput('');
    setPinError(null);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleStartEdit = (item: BudgetItem) => {
    if (!canManageItem(authRole, item)) return;

    setEditingItem(item);
    setEditTitle(item.title);
    setEditAmount(item.amountJPY.toString());
    setEditDay(item.day);
    setEditDate(item.date || getDefaultDateString(item.day));
    setEditTime(item.time || getCurrentTimeString());
    setEditLocation(item.location || '');
    setEditCategory(item.category || '식비');
    setEditNote(item.note || '');

    if (item.paymentMethod === 'CASH') {
      if (item.scope === 'HYEONWOO' || (item.scope !== 'SHARED' && item.paidBy === '현우가족')) {
        setEditPaymentType('CASH_HYEONWOO');
      } else if (item.scope === 'SEHYEON' || (item.scope !== 'SHARED' && item.paidBy === '세현가족')) {
        setEditPaymentType('CASH_SEHYEON');
      } else {
        setEditPaymentType('CASH');
      }
    } else if (item.scope === 'SHARED') {
      setEditPaymentType('CARD_SHARED');
      setEditCardPayer((item.paidBy as FamilyName) || '현우가족');
    } else if (item.scope === 'HYEONWOO' || item.paidBy === '현우가족') {
      setEditPaymentType('CARD_HYEONWOO');
    } else if (item.scope === 'SEHYEON' || item.paidBy === '세현가족') {
      setEditPaymentType('CARD_SEHYEON');
    } else {
      setEditPaymentType('CASH');
    }
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !onUpdateBudgetItem) return;

    let paymentMethod: PaymentMethod = 'CASH';
    let scope: ExpenseScope = 'SHARED';
    let paidBy = '공동경비(현금)';

    if (editingItem.type === 'DEPOSIT') {
      onUpdateBudgetItem(editingItem.id, {
        amountJPY: parseInt(editAmount, 10) || 0,
        day: editDay,
        date: editDate || getDefaultDateString(editDay),
        time: editTime || getCurrentTimeString(),
        note: editNote.trim() || undefined
      });
      setEditingItem(null);
      return;
    }

    if (editPaymentType === 'CASH') {
      paymentMethod = 'CASH';
      scope = 'SHARED';
      paidBy = '공동경비(현금)';
    } else if (editPaymentType === 'CASH_HYEONWOO') {
      paymentMethod = 'CASH';
      scope = 'HYEONWOO';
      paidBy = '현우가족';
    } else if (editPaymentType === 'CASH_SEHYEON') {
      paymentMethod = 'CASH';
      scope = 'SEHYEON';
      paidBy = '세현가족';
    } else if (editPaymentType === 'CARD_SHARED') {
      paymentMethod = 'CARD';
      scope = 'SHARED';
      paidBy = editCardPayer;
    } else if (editPaymentType === 'CARD_HYEONWOO') {
      paymentMethod = 'CARD';
      scope = 'HYEONWOO';
      paidBy = '현우가족';
    } else if (editPaymentType === 'CARD_SEHYEON') {
      paymentMethod = 'CARD';
      scope = 'SEHYEON';
      paidBy = '세현가족';
    }

    onUpdateBudgetItem(editingItem.id, {
      title: editTitle.trim(),
      category: editCategory,
      amountJPY: parseInt(editAmount, 10) || 0,
      day: editDay,
      date: editDate || getDefaultDateString(editDay),
      time: editTime || getCurrentTimeString(),
      paymentMethod,
      scope,
      paidBy,
      location: editLocation.trim() || undefined,
      note: editNote.trim() || undefined
    });

    setEditingItem(null);
  };

  // ===================== LOCK SCREEN (다른 패스워드면 열람 일체 불가) =====================
  if (!authRole) {
    return (
      <div className="py-8 px-4 flex flex-col items-center justify-center max-w-md mx-auto text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-4 border border-indigo-400/30">
          <Lock className="w-8 h-8 text-indigo-200" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
          가계부 보안 비밀번호 입력
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          두 가족(현우가족 & 세현가족)의 여행 공동경비 및 가계부 내역은<br />
          비밀번호 인증 후 열람 및 관리가 가능합니다.
        </p>

        {/* PIN Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePinSubmit(pinInput);
          }}
          className="w-full space-y-3"
        >
          <div>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              placeholder="••••"
              value={pinInput}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                setPinInput(val);
                if (pinError) setPinError(null);
                if (val.length === 4) {
                  handlePinSubmit(val);
                }
              }}
              className="w-full text-center tracking-[0.5em] text-3xl font-mono font-bold py-3 px-4 border-2 border-indigo-200 focus:border-indigo-600 rounded-2xl bg-white shadow-xs outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-300"
            />
          </div>

          {pinError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{pinError}</span>
            </div>
          )}

          {/* Quick Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  if (pinInput.length < 4) {
                    const next = pinInput + num;
                    setPinInput(next);
                    if (next.length === 4) handlePinSubmit(next);
                  }
                }}
                className="py-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100 text-slate-800 font-mono font-bold text-lg rounded-xl transition-colors cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPinInput('');
                setPinError(null);
              }}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              전체삭제
            </button>
            <button
              type="button"
              onClick={() => {
                if (pinInput.length < 4) {
                  const next = pinInput + '0';
                  setPinInput(next);
                  if (next.length === 4) handlePinSubmit(next);
                }
              }}
              className="py-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100 text-slate-800 font-mono font-bold text-lg rounded-xl transition-colors cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPinInput((prev) => prev.slice(0, -1))}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              ⌫ 지우기
            </button>
          </div>

          <button
            type="submit"
            disabled={pinInput.length !== 4}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>비밀번호 확인 및 잠금 해제</span>
          </button>
        </form>

        {/* Security explanation card */}
        <div className="w-full mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs pb-1.5 border-b border-slate-200">
            <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
            <span>가계부 보안 권한 안내</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-600 leading-relaxed">
            <p>• 공유받은 4자리 비밀번호를 입력해주세요.</p>
            <p>• 비밀번호에 따라 <strong>조회 전용</strong> 또는 <strong>가족별 관리(등록·수정·삭제)</strong> 권한이 자동 적용됩니다.</p>
            <p className="text-slate-500 pt-0.5">※ 올바른 비밀번호가 아닌 경우 가계부 열람 및 접근이 일체 제한됩니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-2">
      {/* 1. Header Banner & Key Metrics Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/30 rounded-xl text-indigo-300 border border-indigo-400/20">
                <Wallet className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <span>2가족 도쿄여행 스마트 가계부</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    👨‍👩‍👦 현우가족(2) & 👨‍👩‍👧 세현가족(2)
                  </span>
                </h3>
                <p className="text-xs text-indigo-200/80 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>현금 공동경비 실시간 차감 · 카드 공동/개별 분리 · 1/2 정산기 & 통계</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    두 가족 공유 DB 실시간 연동
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {onOpenReceipt && (
                <div className="flex items-center bg-amber-500/20 border border-amber-400/40 rounded-xl p-0.5 shadow-sm">
                  <button
                    onClick={() => onOpenReceipt('ALL')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-200 hover:text-white hover:bg-amber-500/40 transition-all flex items-center gap-1 cursor-pointer"
                    title="2가족 전체 통합 공식 영수증 보기"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-300" />
                    <span>🧾 전체 영수증</span>
                  </button>
                  <div className="w-px h-3.5 bg-amber-400/30 mx-0.5" />
                  <button
                    onClick={() => onOpenReceipt('현우가족')}
                    className="px-2 py-1.5 rounded-lg text-[11px] font-bold text-blue-200 hover:text-white hover:bg-blue-600/50 transition-all flex items-center gap-0.5 cursor-pointer"
                    title="현우가족 (2인) 전용 여행 영수증 & 정산표"
                  >
                    <span>현우</span>
                  </button>
                  <button
                    onClick={() => onOpenReceipt('세현가족')}
                    className="px-2 py-1.5 rounded-lg text-[11px] font-bold text-rose-200 hover:text-white hover:bg-rose-600/50 transition-all flex items-center gap-0.5 cursor-pointer"
                    title="세현가족 (2인) 전용 여행 영수증 & 정산표"
                  >
                    <span>세현</span>
                  </button>
                </div>
              )}
              {onResetBudget && authRole !== 'READ_ONLY' && (
                <button
                  onClick={onResetBudget}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1 cursor-pointer"
                  title="2가족 추천 초기 가계부 데이터로 복원"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>예시 복원</span>
                </button>
              )}
              {authRole === 'READ_ONLY' ? (
                <div
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 bg-white/10 border border-white/10 flex items-center gap-1.5 cursor-not-allowed"
                  title="조회 전용 권한이므로 내역 등록이 제한됩니다."
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-amber-200">조회 전용 (등록 제한)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setIsSamsungCardModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer ring-2 ring-blue-400/30"
                    title="삼성카드 카카오톡 알림톡 결제내역 자동 연동 (현우가족 개별카드)"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-blue-200" />
                    <span>📲 삼성카드 알림톡 연동</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 font-black">
                      방법 2
                    </span>
                  </button>
                  <button
                    onClick={() => handleOpenRegistrationForm('expense')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer ring-2 ring-white/20 hover:ring-indigo-400"
                    title="가계부 지출/입금 등록 폼으로 화면 이동"
                  >
                    <Plus className="w-4 h-4" />
                    <span>내역 등록</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current Auth Status & Lock / Role Switch button */}
          {roleInfo && (
            <div className="flex items-center justify-between flex-wrap gap-2 mt-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${roleInfo.badgeColor}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{roleInfo.label}</span>
                </span>
                <span className="text-[11px] text-slate-300">
                  {roleInfo.allowedSummary}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1 cursor-pointer"
                title="가계부 잠금 및 다른 비밀번호 권한으로 로그인"
              >
                <Lock className="w-3 h-3" />
                <span>권한 변경 / 잠금</span>
              </button>
            </div>
          )}

          {/* 3 Main Highlights (Cash Fund, Card Total, Grand Total) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
            {/* Box 1: Cash Fund (현금 공동경비 풀) */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-emerald-400/30 relative">
              <div className="flex items-center justify-between text-[11px] text-emerald-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" />
                  <span>💵 현금 공동경비 풀</span>
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    cashRemainingJPY >= 0
                      ? 'bg-emerald-500/40 text-emerald-200'
                      : 'bg-rose-500/40 text-rose-200'
                  }`}
                >
                  {cashRemainingJPY >= 0 ? '잔여 잔액' : '초과 지출'}
                </span>
              </div>
              <div className="text-xl font-black font-mono tracking-tight text-white flex items-baseline gap-1.5">
                <span>¥{cashRemainingJPY.toLocaleString()}</span>
                <span className="text-[11px] font-normal text-emerald-200 font-sans">
                  (약 ₩{toKRW(cashRemainingJPY).toLocaleString()})
                </span>
              </div>
              <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1 pt-1 border-t border-white/10">
                <span>총 모금: ¥{totalDepositsJPY.toLocaleString()}</span>
                <span className="text-emerald-300">총 차감: -¥{totalCashSpentJPY.toLocaleString()}</span>
              </div>
            </div>

            {/* Box 2: Card Expenses Total (카드 총 지출) */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-indigo-400/30">
              <div className="flex items-center justify-between text-[11px] text-indigo-200 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>💳 카드 총 지출 (공동+개별)</span>
                </span>
                <span className="text-[10px] text-indigo-300">
                  공동: ¥{totalCardSharedJPY.toLocaleString()}
                </span>
              </div>
              <div className="text-xl font-black font-mono tracking-tight text-white flex items-baseline gap-1.5">
                <span>
                  ¥
                  {(
                    totalCardSharedJPY +
                    hyeonwooPersonalCardJPY +
                    sehyeonPersonalCardJPY
                  ).toLocaleString()}
                </span>
                <span className="text-[11px] font-normal text-indigo-200 font-sans">
                  (약 ₩
                  {toKRW(
                    totalCardSharedJPY +
                      hyeonwooPersonalCardJPY +
                      sehyeonPersonalCardJPY
                  ).toLocaleString()}
                  )
                </span>
              </div>
              <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1 pt-1 border-t border-white/10">
                <span>현우카드: ¥{(hyeonwooCardSharedPaidJPY + hyeonwooPersonalCardJPY).toLocaleString()}</span>
                <span>세현카드: ¥{(sehyeonCardSharedPaidJPY + sehyeonPersonalCardJPY).toLocaleString()}</span>
              </div>
            </div>

            {/* Box 3: Total Trip Expense (여행 총 지출 합산) */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>전체 여행 총 지출</span>
                </span>
                <span className="text-[10px] text-amber-300">총 {expenses.length}건</span>
              </div>
              <div className="text-xl font-black font-mono tracking-tight text-amber-300 flex items-baseline gap-1.5">
                <span>¥{grandTotalExpenseJPY.toLocaleString()}</span>
                <span className="text-[11px] font-normal text-slate-200 font-sans">
                  (약 ₩{toKRW(grandTotalExpenseJPY).toLocaleString()})
                </span>
              </div>
              <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1 pt-1 border-t border-white/10">
                <span>1인당 평균: ¥{Math.round(grandTotalExpenseJPY / 4).toLocaleString()}</span>
                <span>(약 ₩{toKRW(Math.round(grandTotalExpenseJPY / 4)).toLocaleString()})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub Tabs: [일자별 가계부] | [어디에·언제·얼마나 통계] | [가족별 정산기] */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'ledger'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>일자별 가계부</span>
          </button>
          <button
            onClick={() => setSubTab('stats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'stats'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>어디에·언제·얼마나 통계</span>
          </button>
          <button
            onClick={() => setSubTab('settlement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'settlement'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>가족별 정산 & 합산</span>
          </button>
        </div>

        <button
          onClick={() => handleOpenRegistrationForm('expense')}
          className={`sm:hidden p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer ${
            isFormOpen
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>등록</span>
        </button>
      </div>

      {/* 3. New Entry Registration Form (Expandable) */}
      {isFormOpen && (
        <div
          ref={registrationFormRef}
          className="bg-slate-50 border-2 border-indigo-400 rounded-2xl p-4 shadow-md animate-in fade-in duration-200 ring-2 ring-indigo-200/50"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">새 내역 등록:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setFormMode('expense')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    formMode === 'expense'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  지출 내역 등록
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode('deposit')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    formMode === 'deposit'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  💵 현금 공동경비 모금(입금)
                </button>
                <button
                  type="button"
                  onClick={() => setIsSamsungCardModalOpen(true)}
                  className="px-2.5 py-1 rounded-md font-bold text-blue-700 hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-1 border border-blue-200"
                  title="삼성카드 카카오톡 알림톡 결제내역 자동 추출 및 입력"
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>📲 삼성카드 알림톡 자동입력</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
            >
              닫기 ✕
            </button>
          </div>

          {formMode === 'expense' ? (
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                {/* Day */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    일정 선택
                  </label>
                  <select
                    value={expenseDay}
                    onChange={(e) => {
                      const d = parseInt(e.target.value, 10);
                      setExpenseDay(d);
                      setExpenseDate(getDefaultDateString(d));
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                  >
                    <option value={0}>사전 준비/예약 (출발 전)</option>
                    <option value={1}>1일차 (1/13 아사쿠사·스카이트리)</option>
                    <option value={2}>2일차 (1/14 디즈니씨)</option>
                    <option value={3}>3일차 (1/15 해리포터·시부야)</option>
                    <option value={4}>4일차 (1/16 후지산 투어)</option>
                    <option value={5}>5일차 (1/17 쓰키지·롯폰기)</option>
                    <option value={6}>6일차 (1/18 긴시초·공항귀국)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    카테고리
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as BudgetCategory)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                  >
                    <option value="식비">식비 (식당, 간식)</option>
                    <option value="교통">교통 (전철, 버스, 신칸센)</option>
                    <option value="숙박">숙박 (호텔, 숙소)</option>
                    <option value="입장료">입장료 (티켓, DPA, 투어)</option>
                    <option value="쇼핑">쇼핑 (기념품, 면세점)</option>
                    <option value="이자카야/주류">이자카야/주류 (선술집, 맥주)</option>
                    <option value="카페/디저트">카페/디저트 (음료, 디저트)</option>
                    <option value="기타">기타 잡비</option>
                  </select>
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    지출 항목명
                  </label>
                  <input
                    ref={expenseTitleInputRef}
                    type="text"
                    required
                    placeholder="예: 긴시초 토리키조쿠 저녁 생맥주 & 꼬치"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    금액 (일본 엔화 ¥)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="예: 5200"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono font-bold"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    지출 장소 (어디서)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 긴시초, 디즈니씨, 우에노"
                    value={expenseLocation}
                    onChange={(e) => setExpenseLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>

                {/* Date & Time (날짜와 시간 자동 기록) */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>결제 날짜 및 시간 (현금/카드 등록 시 자동 저장)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setExpenseTime(getCurrentTimeString())}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                    >
                      현재 시각({getCurrentTimeString()})
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      placeholder="예: 1월 13일"
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs font-medium"
                    />
                    <input
                      type="time"
                      value={expenseTime}
                      onChange={(e) => setExpenseTime(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Payment classification */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    결제 수단 및 사용 분류 (공동 vs 가족별 개별 현금/카드)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {/* 1. Shared Cash */}
                    <button
                      type="button"
                      onClick={() => setExpensePaymentType('CASH')}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        expensePaymentType === 'CASH'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-[11px]">💵 공동 현금</div>
                      <div className="text-[10px] text-slate-500">공동경비 풀 차감</div>
                    </button>

                    {/* 2. Shared Card */}
                    <button
                      type="button"
                      onClick={() => setExpensePaymentType('CARD_SHARED')}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        expensePaymentType === 'CARD_SHARED'
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-[11px]">💳 공동 카드</div>
                      <div className="text-[10px] text-slate-500">1/2 분담 정산</div>
                    </button>

                    {/* 3. Hyunwoo Personal Card */}
                    <button
                      type="button"
                      disabled={authRole === 'SEHYUN'}
                      onClick={() => {
                        if (authRole === 'SEHYUN') return;
                        setExpensePaymentType('CARD_HYEONWOO');
                      }}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        authRole === 'SEHYUN'
                          ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                          : expensePaymentType === 'CARD_HYEONWOO'
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold cursor-pointer'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                      }`}
                      title={authRole === 'SEHYUN' ? '세현가족 권한은 현우가족 전용 경비를 등록할 수 없습니다' : '현우가족 개별 카드 지출'}
                    >
                      <div className="font-semibold text-[11px] flex items-center justify-center gap-0.5">
                        <span>💳 현우 카드</span>
                        {authRole === 'SEHYUN' && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {authRole === 'SEHYUN' ? '등록 불가' : '현우가족 개별카드'}
                      </div>
                    </button>

                    {/* 4. Hyunwoo Personal Cash */}
                    <button
                      type="button"
                      disabled={authRole === 'SEHYUN'}
                      onClick={() => {
                        if (authRole === 'SEHYUN') return;
                        setExpensePaymentType('CASH_HYEONWOO');
                      }}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        authRole === 'SEHYUN'
                          ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                          : expensePaymentType === 'CASH_HYEONWOO'
                          ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold cursor-pointer'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                      }`}
                      title={authRole === 'SEHYUN' ? '세현가족 권한은 현우가족 전용 경비를 등록할 수 없습니다' : '현우가족 개별 현금 지출 (개인 지갑/엔화)'}
                    >
                      <div className="font-semibold text-[11px] flex items-center justify-center gap-0.5">
                        <span>💴 현우 현금</span>
                        {authRole === 'SEHYUN' && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {authRole === 'SEHYUN' ? '등록 불가' : '개별 현금 지출'}
                      </div>
                    </button>

                    {/* 5. Sehyun Personal Card */}
                    <button
                      type="button"
                      disabled={authRole === 'HYUNWOO'}
                      onClick={() => {
                        if (authRole === 'HYUNWOO') return;
                        setExpensePaymentType('CARD_SEHYEON');
                      }}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        authRole === 'HYUNWOO'
                          ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                          : expensePaymentType === 'CARD_SEHYEON'
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold cursor-pointer'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                      }`}
                      title={authRole === 'HYUNWOO' ? '현우가족 권한은 세현가족 전용 경비를 등록할 수 없습니다' : '세현가족 개별 카드 지출'}
                    >
                      <div className="font-semibold text-[11px] flex items-center justify-center gap-0.5">
                        <span>💳 세현 카드</span>
                        {authRole === 'HYUNWOO' && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {authRole === 'HYUNWOO' ? '등록 불가' : '세현가족 개별카드'}
                      </div>
                    </button>

                    {/* 6. Sehyun Personal Cash */}
                    <button
                      type="button"
                      disabled={authRole === 'HYUNWOO'}
                      onClick={() => {
                        if (authRole === 'HYUNWOO') return;
                        setExpensePaymentType('CASH_SEHYEON');
                      }}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        authRole === 'HYUNWOO'
                          ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                          : expensePaymentType === 'CASH_SEHYEON'
                          ? 'bg-amber-50 border-amber-400 text-amber-800 font-bold cursor-pointer'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
                      }`}
                      title={authRole === 'HYUNWOO' ? '현우가족 권한은 세현가족 전용 경비를 등록할 수 없습니다' : '세현가족 개별 현금 지출 (개인 지갑/엔화)'}
                    >
                      <div className="font-semibold text-[11px] flex items-center justify-center gap-0.5">
                        <span>💴 세현 현금</span>
                        {authRole === 'HYUNWOO' && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {authRole === 'HYUNWOO' ? '등록 불가' : '개별 현금 지출'}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sub: who tapped card for shared card */}
                {expensePaymentType === 'CARD_SHARED' && (
                  <div className="sm:col-span-4 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-indigo-900">
                      카드 대리 결제자 (누가 먼저 카드로 결제했나요?):
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="cardPayer"
                          value="현우가족"
                          checked={cardPayer === '현우가족'}
                          onChange={() => setCardPayer('현우가족')}
                          className="accent-indigo-600"
                        />
                        현우가족 카드
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="cardPayer"
                          value="세현가족"
                          checked={cardPayer === '세현가족'}
                          onChange={() => setCardPayer('세현가족')}
                          className="accent-indigo-600"
                        />
                        세현가족 카드
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!expenseTitle.trim() || !expenseAmount}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-40"
                >
                  지출 내역 추가하기
                </button>
              </div>
            </form>
          ) : (
            /* Deposit (공동경비 모금) Form */
            <form onSubmit={handleAddDepositSubmit} className="space-y-3">
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">현금 공동경비 모금(입금)이란?</span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    여행 전 또는 여행 중 각 가족이 현금 공금으로 납부한 엔화를 기록합니다.
                    현금 지출 시 이 모금 풀에서 자동으로 차감되어 잔액이 실시간 관리됩니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Payer Family */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    납부 가족
                  </label>
                  <select
                    value={depositFamily}
                    onChange={(e) => setDepositFamily(e.target.value as FamilyName)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                  >
                    <option value="현우가족" disabled={authRole === 'SEHYUN'}>
                      현우가족 (2인) {authRole === 'SEHYUN' ? '(세현 관리자는 선택 불가)' : ''}
                    </option>
                    <option value="세현가족" disabled={authRole === 'HYUNWOO'}>
                      세현가족 (2인) {authRole === 'HYUNWOO' ? '(현우 관리자는 선택 불가)' : ''}
                    </option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    모금/입금 금액 (일본 엔화 ¥)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="예: 50000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono font-bold"
                  />
                </div>

                {/* Day */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    입금 일자
                  </label>
                  <select
                    value={depositDay}
                    onChange={(e) => setDepositDay(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                  >
                    <option value={0}>사전 준비 (출발 전 각출)</option>
                    <option value={1}>1일차 (현장 추가 갹출)</option>
                    <option value={2}>2일차</option>
                    <option value={3}>3일차</option>
                    <option value={4}>4일차</option>
                    <option value={5}>5일차</option>
                    <option value={6}>6일차</option>
                  </select>
                </div>

                {/* Date & Time */}
                <div className="sm:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>모금/입금 날짜 및 시간 (자동 기록)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setDepositTime(getCurrentTimeString())}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                    >
                      현재 시각({getCurrentTimeString()})
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={depositDate}
                      onChange={(e) => setDepositDate(e.target.value)}
                      placeholder="예: 사전준비"
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs font-medium"
                    />
                    <input
                      type="time"
                      value={depositTime}
                      onChange={(e) => setDepositTime(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    메모
                  </label>
                  <input
                    type="text"
                    placeholder="예: 1차 현금 공동경비 갹출 입금, 디즈니 추가 모금 등"
                    value={depositNote}
                    onChange={(e) => setDepositNote(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!depositAmount}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-40"
                >
                  공동경비 모금 등록
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ===================== TAB 1: LEDGER (일자별 가계부) ===================== */}
      {subTab === 'ledger' && (
        <div className="space-y-3">
          {/* Filter Bar: Day pills & Payment method pills */}
          <div className="space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            {/* Day Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">일정:</span>
              <button
                onClick={() => setSelectedDayFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedDayFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                전체 일자
              </button>
              <button
                onClick={() => setSelectedDayFilter(0)}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedDayFilter === 0
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                사전예약/준비
              </button>
              {[1, 2, 3, 4, 5, 6].map((dayNum) => (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDayFilter(dayNum)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedDayFilter === dayNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dayNum}일차 (1/{12 + dayNum})
                </button>
              ))}
            </div>

            {/* Payment Scope Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-200 text-xs">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">결제분류:</span>
              <button
                onClick={() => setSelectedPaymentFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                  selectedPaymentFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                전체 분류
              </button>
              <button
                onClick={() => setSelectedPaymentFilter('CASH')}
                className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                  selectedPaymentFilter === 'CASH'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                💵 공동 현금 (공동 풀)
              </button>
              <button
                onClick={() => setSelectedPaymentFilter('CARD_SHARED')}
                className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                  selectedPaymentFilter === 'CARD_SHARED'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white text-indigo-800 border border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                💳 공동 카드 (1/2 정산)
              </button>
              <button
                onClick={() => setSelectedPaymentFilter('CARD_HYEONWOO')}
                className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                  selectedPaymentFilter === 'CARD_HYEONWOO'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                💳 현우 개별카드
              </button>
              <button
                onClick={() => setSelectedPaymentFilter('CASH_HYEONWOO')}
                className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                  selectedPaymentFilter === 'CASH_HYEONWOO'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-white text-sky-800 border border-sky-200 hover:bg-sky-50'
                }`}
              >
                💴 현우 개별현금
              </button>
              <button
                onClick={() => setSelectedPaymentFilter('CARD_SEHYEON')}
                className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                  selectedPaymentFilter === 'CARD_SEHYEON'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
                }`}
              >
                💳 세현 개별카드
              </button>
              <button
                onClick={() => setSelectedPaymentFilter('CASH_SEHYEON')}
                className={`px-2 py-0.5 rounded-md font-medium shrink-0 cursor-pointer ${
                  selectedPaymentFilter === 'CASH_SEHYEON'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                💴 세현 개별현금
              </button>
            </div>
          </div>

          {/* Grouped Day Sections */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {[0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
              if (selectedDayFilter !== 'all' && selectedDayFilter !== dayNum) return null;
              const items = groupedByDay[dayNum] || [];
              if (items.length === 0) return null;

              // Subtotals for this day
              const dayExpenses = items.filter((i) => i.type !== 'DEPOSIT');
              const dayDeposits = items.filter((i) => i.type === 'DEPOSIT');
              const dayExpenseSum = dayExpenses.reduce((acc, curr) => acc + curr.amountJPY, 0);
              const dayCashSum = dayExpenses
                .filter((e) => e.paymentMethod === 'CASH' || e.paidBy === '공동경비' || e.paidBy === '공동경비(현금)')
                .reduce((acc, curr) => acc + curr.amountJPY, 0);
              const dayCardSharedSum = dayExpenses
                .filter((e) => e.paymentMethod === 'CARD' && e.scope === 'SHARED')
                .reduce((acc, curr) => acc + curr.amountJPY, 0);
              const dayPersonalSum = dayExpenseSum - dayCashSum - dayCardSharedSum;

              const dayTitle =
                dayNum === 0
                  ? '출발 전 사전예약 & 공동경비 모금'
                  : `${dayNum}일차 (1월 ${12 + dayNum}일)`;

              return (
                <div
                  key={dayNum}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
                >
                  {/* Day Header with Subtotals */}
                  <div className="p-3 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-black font-mono">
                        {dayNum === 0 ? 'D-Day 전' : `Day ${dayNum}`}
                      </span>
                      <span className="font-bold text-xs text-slate-800">{dayTitle}</span>
                      <span className="text-[11px] text-slate-400">({items.length}건)</span>
                    </div>

                    {/* Subtotal metrics */}
                    <div className="flex items-center gap-2 text-xs">
                      {dayExpenseSum > 0 && (
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <span className="text-[11px] text-slate-500 font-medium">일별 지출:</span>
                          <span className="font-mono font-bold text-slate-900">
                            ¥{dayExpenseSum.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans">
                            (약 ₩{toKRW(dayExpenseSum).toLocaleString()})
                          </span>
                        </div>
                      )}
                      {dayCashSum > 0 && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                          현금차감 ¥{dayCashSum.toLocaleString()}
                        </span>
                      )}
                      {dayCardSharedSum > 0 && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-medium">
                          공동카드 ¥{dayCardSharedSum.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const isDeposit = item.type === 'DEPOSIT';
                      const isSharedCash =
                        item.paymentMethod === 'CASH' &&
                        (item.scope === 'SHARED' || item.paidBy === '공동경비' || item.paidBy === '공동경비(현금)');
                      const isHyeonwooCash =
                        item.paymentMethod === 'CASH' &&
                        (item.scope === 'HYEONWOO' || (item.scope !== 'SHARED' && item.paidBy === '현우가족'));
                      const isSehyeonCash =
                        item.paymentMethod === 'CASH' &&
                        (item.scope === 'SEHYEON' || (item.scope !== 'SHARED' && item.paidBy === '세현가족'));
                      const isCardShared = item.paymentMethod === 'CARD' && item.scope === 'SHARED';
                      const isHyeonwooCard =
                        item.paymentMethod === 'CARD' &&
                        (item.scope === 'HYEONWOO' || (!isCardShared && item.paidBy === '현우가족'));
                      const isSehyeonCard =
                        item.paymentMethod === 'CARD' &&
                        (item.scope === 'SEHYEON' || (!isCardShared && item.paidBy === '세현가족'));

                      return (
                        <div
                          key={item.id}
                          className={`p-3 transition-colors flex items-center justify-between text-xs gap-3 ${
                            isDeposit ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          {/* Left: Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {/* Payment badge */}
                              {isDeposit ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                                  <Plus className="w-2.5 h-2.5" />
                                  <span>현금 공동경비 모금(입금)</span>
                                </span>
                              ) : isSharedCash ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <Banknote className="w-3 h-3" />
                                  <span>💵 공동 현금 (공동경비 차감)</span>
                                </span>
                              ) : isHyeonwooCash ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
                                  <Banknote className="w-3 h-3" />
                                  <span>💴 현우가족 개별 현금</span>
                                </span>
                              ) : isSehyeonCash ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                  <Banknote className="w-3 h-3" />
                                  <span>💴 세현가족 개별 현금</span>
                                </span>
                              ) : isCardShared ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>💳 카드 (공동 사용 1/2)</span>
                                </span>
                              ) : isHyeonwooCard ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                  <CreditCard className="w-3 h-3" />
                                  <span>💳 현우가족 개별 카드</span>
                                </span>
                              ) : isSehyeonCard ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                  <CreditCard className="w-3 h-3" />
                                  <span>💳 세현가족 개별 카드</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                                  기타 지출
                                </span>
                              )}

                              {/* Category Badge */}
                              {!isDeposit && (
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
                                    CATEGORY_ICONS[item.category]?.color ??
                                    'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {item.category}
                                </span>
                              )}

                              {/* Location tag */}
                              {item.location && (
                                <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>{item.location}</span>
                                </span>
                              )}
                            </div>

                            {/* Item title */}
                            <div className="font-bold text-slate-900 truncate">{item.title}</div>

                            {/* Date, Time, Note and Payer details */}
                            <div className="text-[10px] text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                              {/* Date & Time pill */}
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                <Calendar className="w-2.5 h-2.5 text-indigo-500" />
                                <span>{item.date || (item.day === 0 ? '사전준비' : `1월 ${12 + item.day}일`)}</span>
                                {item.time && (
                                  <>
                                    <span className="text-slate-300">·</span>
                                    <Clock className="w-2.5 h-2.5 text-indigo-500" />
                                    <span className="font-bold text-indigo-700">{item.time}</span>
                                  </>
                                )}
                              </span>

                              {item.cardCompany && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">
                                  {item.cardCompany}
                                </span>
                              )}

                              <span>
                                {isDeposit ? '납부자' : '결제/부담'}:{' '}
                                <strong className="text-slate-700">{item.paidBy}</strong>
                              </span>
                              {item.note && <span className="text-slate-400">· {item.note}</span>}
                            </div>
                          </div>

                          {/* Right: Amount & Delete Button */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div
                                className={`font-mono font-bold text-sm ${
                                  isDeposit ? 'text-emerald-700' : 'text-slate-900'
                                }`}
                              >
                                {isDeposit ? '+¥' : '¥'}
                                {item.amountJPY.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-slate-400 font-sans">
                                약 ₩{toKRW(item.amountJPY).toLocaleString()}
                              </div>
                            </div>

                            {/* Action buttons (수정 & 삭제) */}
                            {canManageItem(authRole, item) ? (
                              <div className="flex items-center gap-1">
                                {onUpdateBudgetItem && (
                                  <button
                                    onClick={() => handleStartEdit(item)}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-indigo-50 cursor-pointer"
                                    title="항목 수정"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => onDeleteBudgetItem(item.id)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                                  title="항목 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                {authRole === 'READ_ONLY' ? (
                                  <span className="p-1 text-slate-300" title="조회 전용 모드 (수정/삭제 불가)">
                                    <Lock className="w-3.5 h-3.5 text-slate-300" />
                                  </span>
                                ) : item.scope === 'SEHYEON' ? (
                                  <span
                                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-400 border border-slate-200 flex items-center gap-0.5"
                                    title="세현가족 전용 경비로 수정 및 삭제가 제한됩니다"
                                  >
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>세현전용</span>
                                  </span>
                                ) : item.scope === 'HYEONWOO' ? (
                                  <span
                                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-400 border border-slate-200 flex items-center gap-0.5"
                                    title="현우가족 전용 경비로 수정 및 삭제가 제한됩니다"
                                  >
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>현우전용</span>
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredBudgetItems.length === 0 && (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">선택한 조건의 지출 내역이 없습니다.</p>
                <p className="text-[11px] text-slate-400 mt-1">상단 필터를 조정하거나 새 지출을 등록해보세요.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: STATISTICS (어디에·언제·얼마나) ===================== */}
      {subTab === 'stats' && (
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          {/* Section 1: 언제 (일자별 지출 추이 그래프) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-indigo-50 text-indigo-700 rounded-lg">
                  <Clock className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  언제 썼을까? (일자별 지출 추이)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">총 7개 일정 구간</span>
            </div>

            {/* Bar chart */}
            <div className="space-y-2 pt-1">
              {dayStats.map((d) => {
                const percent = Math.round((d.total / maxDayExpense) * 100);
                return (
                  <div key={d.day} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <span className="w-16">{d.label}</span>
                        {d.total > 0 && (
                          <span className="text-[10px] font-normal text-slate-400">
                            (현금 ¥{d.cash.toLocaleString()} / 카드 ¥{d.card.toLocaleString()})
                          </span>
                        )}
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        ¥{d.total.toLocaleString()}
                        <span className="text-[10px] text-slate-400 ml-1 font-sans">
                          (₩{toKRW(d.total).toLocaleString()})
                        </span>
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      {d.total > 0 ? (
                        <>
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{
                              width: `${(d.cash / maxDayExpense) * 100}%`
                            }}
                            title={`현금 차감: ¥${d.cash.toLocaleString()}`}
                          />
                          <div
                            className="bg-indigo-500 h-full transition-all duration-300"
                            style={{
                              width: `${(d.card / maxDayExpense) * 100}%`
                            }}
                            title={`카드 결제: ¥${d.card.toLocaleString()}`}
                          />
                        </>
                      ) : (
                        <div className="w-full bg-slate-100" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-[11px] text-slate-500 justify-end">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                현금 공동경비 차감
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                카드 결제
              </span>
            </div>
          </div>

          {/* Section 2: 어디에 (카테고리 & 주요 지출 장소 TOP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category distribution */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-50 text-amber-700 rounded-lg">
                  <PieChart className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  어디에 썼을까? (카테고리별 비중)
                </h4>
              </div>

              <div className="space-y-2">
                {categoryStats.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cat.category === '식비'
                              ? 'bg-amber-500'
                              : cat.category === '숙박'
                              ? 'bg-indigo-600'
                              : cat.category === '입장료'
                              ? 'bg-purple-500'
                              : cat.category === '교통'
                              ? 'bg-sky-500'
                              : cat.category === '쇼핑'
                              ? 'bg-pink-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {cat.category}
                      </span>
                      <div className="font-mono text-xs text-slate-800">
                        <strong className="text-slate-900">¥{cat.amount.toLocaleString()}</strong>
                        <span className="text-[10px] text-slate-500 ml-1">({cat.percent}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 transition-all duration-300 rounded-full"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations / Spots */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-rose-50 text-rose-700 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  어디서 많이 썼을까? (주요 장소 TOP 5)
                </h4>
              </div>

              <div className="space-y-2.5 pt-1">
                {locationStats.map((loc, idx) => (
                  <div
                    key={loc.location}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                          idx === 0
                            ? 'bg-amber-500 text-white shadow-xs'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{loc.location}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">
                        ¥{loc.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        약 ₩{toKRW(loc.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: 얼마나 (결제 수단 & 가족별 비중) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-emerald-50 text-emerald-700 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                얼마나 사용했을까? (결제 수단 및 가족별 비중)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {paymentShareStats.map((item) => (
                <div
                  key={item.label}
                  className={`p-3 rounded-xl border ${item.bgSoft} ${item.border}`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1 text-[11px] truncate">
                      {item.icon}
                      {item.label}
                    </span>
                    <span className="font-bold text-slate-900">{item.percent}%</span>
                  </div>
                  <div className="text-base font-black font-mono text-slate-900">
                    ¥{item.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                    약 ₩{toKRW(item.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: SETTLEMENT (가족별 정산 & 합산) ===================== */}
      {subTab === 'settlement' && (
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          {/* Smart Settlement Resolution Banner */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                <ArrowRightLeft className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-sm sm:text-base text-indigo-950">
                2가족 최종 깔끔 정산 안내서 (1/2 균등 분담 기준)
              </h4>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-indigo-200/80 my-3">
              {netOwedToHyeonwoo > 0 ? (
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">💸</span>
                  <div>
                    <div className="font-black text-sm sm:text-base text-indigo-950">
                      세현가족 ➔ 현우가족에게{' '}
                      <span className="text-rose-600 underline underline-offset-4 decoration-rose-300">
                        ¥{Math.abs(netOwedToHyeonwoo).toLocaleString()}엔
                      </span>{' '}
                      (약 ₩{toKRW(Math.abs(netOwedToHyeonwoo)).toLocaleString()}원) 송금 시 정산 완료!
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      현우가족이 숙소 및 투어 등의 공동 카드 비용을 더 많이 선결제했기 때문에, 차액을 송금하시면 모든 공동 경비 정산이 끝납니다.
                    </p>
                  </div>
                </div>
              ) : netOwedToHyeonwoo < 0 ? (
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">💸</span>
                  <div>
                    <div className="font-black text-sm sm:text-base text-indigo-950">
                      현우가족 ➔ 세현가족에게{' '}
                      <span className="text-rose-600 underline underline-offset-4 decoration-rose-300">
                        ¥{Math.abs(netOwedToHyeonwoo).toLocaleString()}엔
                      </span>{' '}
                      (약 ₩{toKRW(Math.abs(netOwedToHyeonwoo)).toLocaleString()}원) 송금 시 정산 완료!
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      세현가족이 공동 카드 비용을 더 많이 선결제했기 때문에 차액을 송금하시면 모든 공동 경비 정산이 끝납니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>양 가족의 공동 경비 지출 및 분담금이 완벽하게 일치합니다 (정산 완료 상태).</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-indigo-800/80 bg-indigo-100/50 p-2.5 rounded-lg flex items-center justify-between flex-wrap gap-2">
              <span>
                💡 정산 원칙: 현금 공동경비는 모아둔 공금 풀에서 차감되었으며, 카드 공동 사용분은 1/2로 계산됩니다.
              </span>
              {onOpenReceipt && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenReceipt('ALL')}
                    className="px-2.5 py-1 bg-indigo-900 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-800 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Receipt className="w-3 h-3 text-amber-300" />
                    <span>전체 영수증</span>
                  </button>
                  <button
                    onClick={() => onOpenReceipt('현우가족')}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-500 transition-colors cursor-pointer shadow-xs"
                  >
                    현우가족 영수증
                  </button>
                  <button
                    onClick={() => onOpenReceipt('세현가족')}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-500 transition-colors cursor-pointer shadow-xs"
                  >
                    세현가족 영수증
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Two Family Comparison Cards (현우가족 vs 세현가족) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Family 1: 현우가족 */}
            <div className="bg-white rounded-2xl p-4 border border-blue-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    현
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">현우가족 (2인)</h5>
                    <span className="text-[10px] text-blue-600 font-semibold">참여자 2인</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">총 결제/납부 합계</span>
                  <span className="font-mono font-bold text-sm text-blue-950">
                    ¥
                    {(
                      hyeonwooDepositJPY +
                      hyeonwooCardSharedPaidJPY +
                      hyeonwooPersonalCardJPY +
                      hyeonwooPersonalCashJPY
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    현금 공동경비 모금 납부액
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    ¥{hyeonwooDepositJPY.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 bg-indigo-50/60 rounded-xl flex items-center justify-between border border-indigo-100">
                  <span className="text-indigo-900 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    공동 카드 선결제 대리부담
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-indigo-950">
                      ¥{hyeonwooCardSharedPaidJPY.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-indigo-600 block">
                      (숙소 5박, 해리포터, 후지산 등)
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/60 rounded-xl flex items-center justify-between border border-blue-100">
                  <span className="text-blue-900 font-medium flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    현우가족 개별 카드 지출
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-950">
                      ¥{hyeonwooPersonalCardJPY.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-blue-500 block">(가족 전용 쇼핑)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-sky-50/60 rounded-xl flex items-center justify-between border border-sky-100">
                  <span className="text-sky-900 font-medium flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-sky-600" />
                    현우가족 개별 현금 지출
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sky-950">
                      ¥{hyeonwooPersonalCashJPY.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-sky-500 block">(개인 현금 지출)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>공동 카드 1/2 법정 분담금</span>
                  <span className="font-mono font-semibold">
                    ¥{Math.round(totalCardSharedJPY / 2).toLocaleString()}
                  </span>
                </div>

                {onOpenReceipt && (
                  <button
                    onClick={() => onOpenReceipt('현우가족')}
                    className="w-full mt-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-blue-600" />
                    <span>🧾 현우가족 전용 영수증 확인</span>
                  </button>
                )}
              </div>
            </div>

            {/* Family 2: 세현가족 */}
            <div className="bg-white rounded-2xl p-4 border border-rose-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                    세
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">세현가족 (2인)</h5>
                    <span className="text-[10px] text-rose-600 font-semibold">참여자 2인</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">총 결제/납부 합계</span>
                  <span className="font-mono font-bold text-sm text-rose-950">
                    ¥
                    {(
                      sehyeonDepositJPY +
                      sehyeonCardSharedPaidJPY +
                      sehyeonPersonalCardJPY +
                      sehyeonPersonalCashJPY
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    현금 공동경비 모금 납부액
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    ¥{sehyeonDepositJPY.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 bg-indigo-50/60 rounded-xl flex items-center justify-between border border-indigo-100">
                  <span className="text-indigo-900 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    공동 카드 선결제 대리부담
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-indigo-950">
                      ¥{sehyeonCardSharedPaidJPY.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-indigo-600 block">
                      (디즈니씨 티켓, 시부야스카이 등)
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-rose-50/60 rounded-xl flex items-center justify-between border border-rose-100">
                  <span className="text-rose-900 font-medium flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                    세현가족 개별 카드 지출
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-950">
                      ¥{sehyeonPersonalCardJPY.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-rose-500 block">(가족 전용 쇼핑)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50/60 rounded-xl flex items-center justify-between border border-amber-100">
                  <span className="text-amber-900 font-medium flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-amber-600" />
                    세현가족 개별 현금 지출
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-950">
                      ¥{sehyeonPersonalCashJPY.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-500 block">(개인 현금 지출)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>공동 카드 1/2 법정 분담금</span>
                  <span className="font-mono font-semibold">
                    ¥{Math.round(totalCardSharedJPY / 2).toLocaleString()}
                  </span>
                </div>

                {onOpenReceipt && (
                  <button
                    onClick={() => onOpenReceipt('세현가족')}
                    className="w-full mt-1 py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-rose-600" />
                    <span>🧾 세현가족 전용 영수증 확인</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT ITEM MODAL ===================== */}
      {editingItem && (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {editingItem.type === 'DEPOSIT' ? '공동경비 모금 내역 수정' : '지출 내역 수정'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    권한: {roleInfo?.label} ({authPasscode})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
              {editingItem.type === 'DEPOSIT' ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      모금 금액 (¥ 엔화)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      입금 일자
                    </label>
                    <select
                      value={editDay}
                      onChange={(e) => setEditDay(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                    >
                      <option value={0}>출발 전 (공금 사전 모금)</option>
                      <option value={1}>1일차 (1/13)</option>
                      <option value={2}>2일차 (1/14)</option>
                      <option value={3}>3일차 (1/15)</option>
                      <option value={4}>4일차 (1/16)</option>
                      <option value={5}>5일차 (1/17)</option>
                      <option value={6}>6일차 (1/18)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        모금/입금 날짜
                      </label>
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="예: 사전준비"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        입금 시간 (시:분)
                      </label>
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      메모
                    </label>
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      지출 항목명
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        금액 (¥ 엔화)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        카테고리
                      </label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as BudgetCategory)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                      >
                        <option value="식비">식비</option>
                        <option value="교통">교통</option>
                        <option value="숙박">숙박</option>
                        <option value="입장료">입장료</option>
                        <option value="쇼핑">쇼핑</option>
                        <option value="이자카야/주류">이자카야/주류</option>
                        <option value="카페/디저트">카페/디저트</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        일정
                      </label>
                      <select
                        value={editDay}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setEditDay(val);
                          setEditDate(getDefaultDateString(val));
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium"
                      >
                        <option value={0}>사전 준비/예약</option>
                        <option value={1}>1일차 (1/13)</option>
                        <option value={2}>2일차 (1/14)</option>
                        <option value={3}>3일차 (1/15)</option>
                        <option value={4}>4일차 (1/16)</option>
                        <option value={5}>5일차 (1/17)</option>
                        <option value={6}>6일차 (1/18)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        사용 장소
                      </label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="예: 긴시초, 디즈니씨"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Edit Date & Time */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        결제 날짜
                      </label>
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="예: 1월 14일"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        결제 시간 (시:분)
                      </label>
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      결제 수단 및 사용 분류
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {/* 1. Shared Cash */}
                      <button
                        type="button"
                        onClick={() => setEditPaymentType('CASH')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          editPaymentType === 'CASH'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="font-semibold text-[11px]">💵 공동 현금</div>
                        <div className="text-[10px] text-slate-500">공동경비 풀 차감</div>
                      </button>

                      {/* 2. Shared Card */}
                      <button
                        type="button"
                        onClick={() => setEditPaymentType('CARD_SHARED')}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          editPaymentType === 'CARD_SHARED'
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-800 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="font-semibold text-[11px]">💳 공동 카드</div>
                        <div className="text-[10px] text-slate-500">1/2 분담 정산</div>
                      </button>

                      {/* 3. Hyunwoo Card */}
                      <button
                        type="button"
                        disabled={authRole === 'SEHYUN'}
                        onClick={() => {
                          if (authRole === 'SEHYUN') return;
                          setEditPaymentType('CARD_HYEONWOO');
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          authRole === 'SEHYUN'
                            ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                            : editPaymentType === 'CARD_HYEONWOO'
                            ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold cursor-pointer'
                            : 'bg-white border-slate-200 text-slate-600 cursor-pointer'
                        }`}
                        title={authRole === 'SEHYUN' ? '세현가족 권한으로는 변경 불가' : '현우가족 개별 카드'}
                      >
                        <div className="font-semibold text-[11px]">💳 현우 카드</div>
                        <div className="text-[10px] text-slate-500">
                          {authRole === 'SEHYUN' ? '선택 불가' : '개별 카드'}
                        </div>
                      </button>

                      {/* 4. Hyunwoo Cash */}
                      <button
                        type="button"
                        disabled={authRole === 'SEHYUN'}
                        onClick={() => {
                          if (authRole === 'SEHYUN') return;
                          setEditPaymentType('CASH_HYEONWOO');
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          authRole === 'SEHYUN'
                            ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                            : editPaymentType === 'CASH_HYEONWOO'
                            ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold cursor-pointer'
                            : 'bg-white border-slate-200 text-slate-600 cursor-pointer'
                        }`}
                        title={authRole === 'SEHYUN' ? '세현가족 권한으로는 변경 불가' : '현우가족 개별 현금'}
                      >
                        <div className="font-semibold text-[11px]">💴 현우 현금</div>
                        <div className="text-[10px] text-slate-500">
                          {authRole === 'SEHYUN' ? '선택 불가' : '개별 현금'}
                        </div>
                      </button>

                      {/* 5. Sehyun Card */}
                      <button
                        type="button"
                        disabled={authRole === 'HYUNWOO'}
                        onClick={() => {
                          if (authRole === 'HYUNWOO') return;
                          setEditPaymentType('CARD_SEHYEON');
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          authRole === 'HYUNWOO'
                            ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                            : editPaymentType === 'CARD_SEHYEON'
                            ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold cursor-pointer'
                            : 'bg-white border-slate-200 text-slate-600 cursor-pointer'
                        }`}
                        title={authRole === 'HYUNWOO' ? '현우가족 권한으로는 변경 불가' : '세현가족 개별 카드'}
                      >
                        <div className="font-semibold text-[11px]">💳 세현 카드</div>
                        <div className="text-[10px] text-slate-500">
                          {authRole === 'HYUNWOO' ? '선택 불가' : '개별 카드'}
                        </div>
                      </button>

                      {/* 6. Sehyun Cash */}
                      <button
                        type="button"
                        disabled={authRole === 'HYUNWOO'}
                        onClick={() => {
                          if (authRole === 'HYUNWOO') return;
                          setEditPaymentType('CASH_SEHYEON');
                        }}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          authRole === 'HYUNWOO'
                            ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                            : editPaymentType === 'CASH_SEHYEON'
                            ? 'bg-amber-50 border-amber-400 text-amber-800 font-bold cursor-pointer'
                            : 'bg-white border-slate-200 text-slate-600 cursor-pointer'
                        }`}
                        title={authRole === 'HYUNWOO' ? '현우가족 권한으로는 변경 불가' : '세현가족 개별 현금'}
                      >
                        <div className="font-semibold text-[11px]">💴 세현 현금</div>
                        <div className="text-[10px] text-slate-500">
                          {authRole === 'HYUNWOO' ? '선택 불가' : '개별 현금'}
                        </div>
                      </button>
                    </div>
                  </div>

                  {editPaymentType === 'CARD_SHARED' && (
                    <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-200 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-indigo-900">
                        카드 대리 결제자:
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                          <input
                            type="radio"
                            name="editCardPayer"
                            value="현우가족"
                            checked={editCardPayer === '현우가족'}
                            onChange={() => setEditCardPayer('현우가족')}
                            className="accent-indigo-600"
                          />
                          현우가족 카드
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                          <input
                            type="radio"
                            name="editCardPayer"
                            value="세현가족"
                            checked={editCardPayer === '세현가족'}
                            onChange={() => setEditCardPayer('세현가족')}
                            className="accent-indigo-600"
                          />
                          세현가족 카드
                        </label>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      메모
                    </label>
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="추가 설명 또는 메모"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  수정 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Samsung Card KakaoTalk Alimtalk Modal (방법 2 구현) */}
      <SamsungCardSyncModal
        isOpen={isSamsungCardModalOpen}
        onClose={() => setIsSamsungCardModalOpen(false)}
        onAddBudgetItem={onAddBudgetItem}
        authRole={authRole}
      />
    </div>
  );
};
