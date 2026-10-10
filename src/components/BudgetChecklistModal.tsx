import React, { useState } from 'react';
import { ChecklistItem, BudgetItem, ChecklistCategory } from '../types/travel';
import { BudgetLedgerView } from './BudgetLedgerView';
import {
  X,
  CheckSquare,
  Wallet,
  Plus,
  Trash2,
  Check,
  Search,
  RotateCcw,
  CheckCheck,
  Sparkles,
  Filter
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
  onResetChecklist?: () => void;
  onToggleAllChecklist?: (completed: boolean) => void;
  budget: BudgetItem[];
  onAddBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  onUpdateBudgetItem?: (id: string, updates: Partial<BudgetItem>) => void;
  onDeleteBudgetItem: (id: string) => void;
  onResetBudget?: () => void;
  onOpenReceipt?: (targetFamily?: 'ALL' | '현우가족' | '세현가족') => void;
}

const CATEGORY_STYLES: Record<
  ChecklistCategory,
  { label: string; icon: string; badge: string; text: string }
> = {
  '필수준비': { label: '필수준비', icon: '🚨', badge: 'bg-rose-100 text-rose-800 border-rose-200', text: 'text-rose-700' },
  '의류/잡화': { label: '의류/잡화', icon: '👕', badge: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-700' },
  '세면/위생': { label: '세면/위생', icon: '🪥', badge: 'bg-sky-100 text-sky-800 border-sky-200', text: 'text-sky-700' },
  '상비약': { label: '상비약', icon: '💊', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-700' },
  '전자기기': { label: '전자기기', icon: '🔌', badge: 'bg-purple-100 text-purple-800 border-purple-200', text: 'text-purple-700' },
  '교통/통신': { label: '교통/통신', icon: '📶', badge: 'bg-blue-100 text-blue-800 border-blue-200', text: 'text-blue-700' },
  '예약확인': { label: '예약확인', icon: '🎟️', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', text: 'text-indigo-700' },
  '여행꿀템': { label: '여행꿀템', icon: '✨', badge: 'bg-teal-100 text-teal-800 border-teal-200', text: 'text-teal-700' },
  '짐싸기': { label: '짐싸기', icon: '🧳', badge: 'bg-slate-100 text-slate-800 border-slate-200', text: 'text-slate-700' },
};

const ALL_CATEGORIES: ChecklistCategory[] = [
  '필수준비',
  '의류/잡화',
  '세면/위생',
  '상비약',
  '전자기기',
  '교통/통신',
  '예약확인',
  '여행꿀템'
];

export const BudgetChecklistModal: React.FC<BudgetChecklistModalProps> = ({
  isOpen,
  onClose,
  activeView,
  onSwitchView,
  checklist,
  onToggleCheckItem,
  onAddCheckItem,
  onDeleteCheckItem,
  onResetChecklist,
  onToggleAllChecklist,
  budget,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
  onResetBudget,
  onOpenReceipt
}) => {
  // Checklist UI filter & search states
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [newCheckText, setNewCheckText] = useState('');
  const [newCheckCategory, setNewCheckCategory] =
    useState<ChecklistItem['category']>('의류/잡화');

  if (!isOpen) return null;

  // Checklist statistics
  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const uncompletedCount = totalCount - completedCount;

  // Filtered Checklist
  const filteredChecklist = checklist.filter((item) => {
    // Category filter
    if (selectedCategory !== '전체' && item.category !== selectedCategory) {
      return false;
    }
    // Status filter
    if (statusFilter === 'pending' && item.completed) return false;
    if (statusFilter === 'completed' && !item.completed) return false;
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.text.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Category counts
  const categoryCountMap = checklist.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckText.trim()) return;
    onAddCheckItem(newCheckText.trim(), newCheckCategory);
    setNewCheckText('');
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div
        className={`bg-white w-full ${
          activeView === 'budget' ? 'max-w-4xl' : 'max-w-3xl'
        } rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]`}
      >
        {/* Header with Switcher Tabs */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
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
              <span>준비물 체크리스트 ({completedCount}/{totalCount})</span>
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: Checklist */}
        {activeView === 'checklist' && (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* Progress Bar & Status Banner */}
            <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-800 mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎒</span>
                  <span>여행 짐싸기 달성률</span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    완료 {completedCount} / 미완료 {uncompletedCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 text-sm font-black font-mono">{progressPercent}%</span>
                  {progressPercent === 100 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3" /> 완벽 준비 완료!
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Quick Actions (All Complete / All Incomplete / Reset Defaults) */}
              <div className="mt-3 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">필터:</span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    전체 ({totalCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      statusFilter === 'pending'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    미완료 ({uncompletedCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('completed')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                      statusFilter === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    완료 ({completedCount})
                  </button>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  {onToggleAllChecklist && (
                    <>
                      <button
                        onClick={() => onToggleAllChecklist(true)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="모든 항목을 완료 상태로 체크합니다"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>전체 완료</span>
                      </button>
                      <button
                        onClick={() => onToggleAllChecklist(false)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                        title="모든 항목 체크를 해제합니다"
                      >
                        <span>전체 해제</span>
                      </button>
                    </>
                  )}
                  {onResetChecklist && (
                    <button
                      onClick={onResetChecklist}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="추천 필수 항목(목도리·장갑 포함)으로 복원"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>기본 목록 복원</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter Pills (Horizontal Scrollable) */}
            <div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('전체')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    selectedCategory === '전체'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>🌈 전체</span>
                  <span className="text-[10px] opacity-80">({totalCount})</span>
                </button>
                {ALL_CATEGORIES.map((cat) => {
                  const meta = CATEGORY_STYLES[cat] || { icon: '📌', label: cat, badge: 'bg-slate-100 text-slate-800 border-slate-200' };
                  const count = categoryCountMap[cat] || 0;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{meta.icon}</span>
                      <span>{cat}</span>
                      <span className="text-[10px] opacity-80">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="준비물 검색 (예: 속옷, 양말, 칫솔, 비상약, 모자, 썬글라스, 여권, 돼지코...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Checklist items list */}
            <div className="space-y-2">
              {filteredChecklist.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-xs font-bold text-slate-700">해당 조건에 맞는 준비물이 없습니다.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">검색어를 변경하거나 아래에서 직접 추가해 보세요!</p>
                </div>
              ) : (
                filteredChecklist.map((item) => {
                  const meta = CATEGORY_STYLES[item.category] || {
                    icon: '📌',
                    label: item.category,
                    badge: 'bg-slate-100 text-slate-800 border-slate-200',
                    text: 'text-slate-700'
                  };
                  return (
                    <div
                      key={item.id}
                      onClick={() => onToggleCheckItem(item.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        item.completed
                          ? 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-75'
                          : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                            item.completed
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 bg-white hover:border-indigo-400'
                          }`}
                        >
                          {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span
                            className={`text-xs font-semibold leading-snug break-words ${
                              item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${meta.badge}`}
                        >
                          <span>{meta.icon}</span>
                          <span>{item.category}</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCheckItem(item.id);
                          }}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Item form */}
            <form onSubmit={handleAddChecklist} className="pt-2 flex flex-col sm:flex-row gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 shrink-0">분류:</span>
                <select
                  value={newCheckCategory}
                  onChange={(e) => setNewCheckCategory(e.target.value as ChecklistItem['category'])}
                  className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="의류/잡화">👕 의류/잡화 (속옷, 양말, 모자...)</option>
                  <option value="세면/위생">🪥 세면/위생 (칫솔, 치약, 썬크림...)</option>
                  <option value="상비약">💊 상비약 (비상약, 소화제, 파스...)</option>
                  <option value="전자기기">🔌 전자기기 (돼지코, 보조배터리...)</option>
                  <option value="필수준비">🚨 필수준비 (여권, 엔화, 카드...)</option>
                  <option value="교통/통신">📶 교통/통신 (eSIM, 스이카...)</option>
                  <option value="예약확인">🎟️ 예약확인 (디즈니, 해리포터...)</option>
                  <option value="여행꿀템">✨ 여행꿀템 (우산, 지퍼백...)</option>
                  <option value="짐싸기">🧳 일반 짐싸기</option>
                </select>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="추가할 필수 준비물 입력 (예: 휴대용 썬글라스, 비상약 등)"
                  value={newCheckText}
                  onChange={(e) => setNewCheckText(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newCheckText.trim()}
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>추가</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View 2: Budget Manager (2 Families Smart Ledger) */}
        {activeView === 'budget' && (
          <div className="p-3 sm:p-5 overflow-y-auto flex-1">
            <BudgetLedgerView
              budget={budget}
              onAddBudgetItem={onAddBudgetItem}
              onUpdateBudgetItem={onUpdateBudgetItem}
              onDeleteBudgetItem={onDeleteBudgetItem}
              onResetBudget={onResetBudget}
              onOpenReceipt={onOpenReceipt}
            />
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            {activeView === 'checklist' ? (
              <span>💡 항목을 탭하여 체크/해제할 수 있으며 브라우저에 자동 저장됩니다.</span>
            ) : (
              <span>💡 현금 공동경비 자동 차감 및 카드 공동/가족별 분리 정산이 실시간 동기화됩니다.</span>
            )}
          </div>
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
