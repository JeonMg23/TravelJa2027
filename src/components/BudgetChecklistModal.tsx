import React, { useState } from 'react';
import { ChecklistItem, BudgetItem } from '../types/travel';
import {
  X,
  CheckSquare,
  Wallet,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  CircleDollarSign,
  PieChart
} from 'lucide-react';

interface BudgetChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'budget' | 'checklist';
  onSwitchView: (view: 'budget' | 'checklist') => void;
  checklist: ChecklistItem[];
  onToggleCheckItem: (id: string) => void;
  onAddCheckItem: (text: string, category: ChecklistItem['category']) => void;
  onDeleteCheckItem: (id: string) => void;
  budget: BudgetItem[];
  onAddBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  onDeleteBudgetItem: (id: string) => void;
}

export const BudgetChecklistModal: React.FC<BudgetChecklistModalProps> = ({
  isOpen,
  onClose,
  activeView,
  onSwitchView,
  checklist,
  onToggleCheckItem,
  onAddCheckItem,
  onDeleteCheckItem,
  budget,
  onAddBudgetItem,
  onDeleteBudgetItem
}) => {
  const [newCheckText, setNewCheckText] = useState('');
  const [newCheckCategory, setNewCheckCategory] =
    useState<ChecklistItem['category']>('필수준비');

  // Budget form states
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] =
    useState<BudgetItem['category']>('식비');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDay, setExpenseDay] = useState(1);
  const [expensePaidBy, setExpensePaidBy] = useState('공동경비');

  if (!isOpen) return null;

  // Checklist stats
  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  // Budget stats (100 JPY approx = 920 KRW)
  const totalJPY = budget.reduce((acc, curr) => acc + curr.amountJPY, 0);
  const totalKRW = Math.round((totalJPY * 9.2));

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  budget.forEach((b) => {
    categoryTotals[b.category] = (categoryTotals[b.category] || 0) + b.amountJPY;
  });

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckText.trim()) return;
    onAddCheckItem(newCheckText.trim(), newCheckCategory);
    setNewCheckText('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;
    onAddBudgetItem({
      title: expenseTitle.trim(),
      category: expenseCategory,
      amountJPY: parseInt(expenseAmount, 10) || 0,
      day: expenseDay,
      paidBy: expensePaidBy
    });
    setExpenseTitle('');
    setExpenseAmount('');
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Switcher Tabs */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => onSwitchView('checklist')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'checklist'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>준비물 체크리스트</span>
            </button>
            <button
              onClick={() => onSwitchView('budget')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'budget'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>공동 경비 & 가계부</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Checklist */}
        {activeView === 'checklist' && (
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Progress Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>여행 준비 달성률 ({completedCount} / {checklist.length})</span>
                <span className="text-indigo-600 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleCheckItem(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        item.completed
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCheckItem(item.id);
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item form */}
            <form onSubmit={handleAddChecklist} className="pt-2 flex gap-2">
              <select
                value={newCheckCategory}
                onChange={(e) => setNewCheckCategory(e.target.value as ChecklistItem['category'])}
                className="text-xs px-2.5 py-2 border border-slate-300 rounded-xl bg-white text-slate-700"
              >
                <option value="필수준비">필수준비</option>
                <option value="교통/통신">교통/통신</option>
                <option value="예약확인">예약확인</option>
                <option value="짐싸기">짐싸기</option>
              </select>
              <input
                type="text"
                placeholder="추가할 체크리스트 항목 (예: 동전지갑, 보조배터리)"
                value={newCheckText}
                onChange={(e) => setNewCheckText(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newCheckText.trim()}
                className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                추가
              </button>
            </form>
          </div>
        )}

        {/* View 2: Budget Manager */}
        {activeView === 'budget' && (
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Total Summary Strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="text-[11px] font-semibold text-indigo-700">
                  총 지출 합계 (일본 엔화)
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-950 mt-1">
                  ¥{totalJPY.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-600">
                  원화 환산 예상 (약 920원 기준)
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1">
                  약 ₩{totalKRW.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Category breakdown bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-2 text-xs">
              {Object.entries(categoryTotals).map(([cat, amount]) => (
                <div key={cat} className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-[11px]">
                  <span className="font-semibold text-slate-600">{cat}:</span>
                  <span className="font-mono font-bold text-slate-900">¥{amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Expense records */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {budget.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200/90 bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                        Day {item.day} · {item.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      결제자: {item.paidBy}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      ¥{item.amountJPY.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onDeleteBudgetItem(item.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add expense form */}
            <form onSubmit={handleAddExpense} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700">새 지출 내역 기록</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="항목 (예: 디즈니 간식)"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 col-span-2"
                />
                <input
                  type="number"
                  placeholder="금액 (¥ JPY)"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 font-mono"
                />
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as BudgetItem['category'])}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                >
                  <option value="식비">식비</option>
                  <option value="교통">교통</option>
                  <option value="입장료">입장료</option>
                  <option value="숙박">숙박</option>
                  <option value="쇼핑">쇼핑</option>
                </select>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={!expenseTitle.trim() || !expenseAmount}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                >
                  지출 등록
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
