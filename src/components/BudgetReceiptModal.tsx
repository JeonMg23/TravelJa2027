import React, { useRef, useState, useEffect } from 'react';
import { BudgetItem } from '../types/travel';
import {
  X,
  Printer,
  Copy,
  Receipt,
  CheckCircle2,
  CreditCard,
  Banknote,
  Users,
  Check,
  Building,
  ArrowRight,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

import { getStoredBudgetPasscode, setStoredBudgetPasscode } from '../services/budgetAuth';

export type ReceiptTarget = 'ALL' | '현우가족' | '세현가족';

interface BudgetReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetItem[];
  initialFamily?: ReceiptTarget;
}

export const BudgetReceiptModal: React.FC<BudgetReceiptModalProps> = ({
  isOpen,
  onClose,
  budget,
  initialFamily = 'ALL'
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptTarget>(initialFamily);
  const [copySuccess, setCopySuccess] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [authPasscode, setAuthPasscode] = useState<string | null>(() => getStoredBudgetPasscode());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Sync selected receipt and auth when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedReceipt(initialFamily);
      setCopySuccess(false);
      setAuthPasscode(getStoredBudgetPasscode());
      setPinInput('');
      setPinError(null);
    }
  }, [isOpen, initialFamily]);

  if (!isOpen) return null;

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

  if (!authPasscode || !['1111', '3539', '0901'].includes(authPasscode)) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center shadow-2xl space-y-4 border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base sm:text-lg">영수증 보안 비밀번호 입력</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              도쿄 여행 2가족 정산 영수증은 비밀번호 인증 후 즉시 열람하실 수 있습니다.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePinSubmit(pinInput);
            }}
            className="space-y-3 pt-1"
          >
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
              className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-2.5 px-4 border-2 border-indigo-200 focus:border-indigo-600 rounded-2xl bg-white shadow-xs outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-300"
            />

            {pinError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 animate-shake">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                type="submit"
                disabled={pinInput.length !== 4}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>확인</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const toKRW = (jpy: number) => Math.round(jpy * 9.2);

  // 1. Deposits & Cash Pool
  const deposits = budget.filter((b) => b.type === 'DEPOSIT');
  const totalDepositsJPY = deposits.reduce((sum, item) => sum + item.amountJPY, 0);

  const hyeonwooDeposits = deposits.filter((b) => b.paidBy === '현우가족');
  const sehyeonDeposits = deposits.filter((b) => b.paidBy === '세현가족');
  const hyeonwooDepositJPY = hyeonwooDeposits.reduce((sum, item) => sum + item.amountJPY, 0);
  const sehyeonDepositJPY = sehyeonDeposits.reduce((sum, item) => sum + item.amountJPY, 0);

  // Shared Cash Expenses (Spent from the shared cash fund pool)
  const cashExpenses = budget.filter(
    (b) =>
      b.type !== 'DEPOSIT' &&
      b.paymentMethod === 'CASH' &&
      (b.scope === 'SHARED' || b.paidBy === '공동경비' || b.paidBy === '공동경비(현금)')
  );
  const totalCashSpentJPY = cashExpenses.reduce((sum, item) => sum + item.amountJPY, 0);
  const cashRemainingJPY = totalDepositsJPY - totalCashSpentJPY;

  // Individual Personal Cash Expenses
  const hyeonwooPersonalCashExpenses = budget.filter(
    (b) =>
      b.type !== 'DEPOSIT' &&
      b.paymentMethod === 'CASH' &&
      (b.scope === 'HYEONWOO' || (b.scope !== 'SHARED' && b.paidBy === '현우가족'))
  );
  const sehyeonPersonalCashExpenses = budget.filter(
    (b) =>
      b.type !== 'DEPOSIT' &&
      b.paymentMethod === 'CASH' &&
      (b.scope === 'SEHYEON' || (b.scope !== 'SHARED' && b.paidBy === '세현가족'))
  );

  const hyeonwooPersonalCashJPY = hyeonwooPersonalCashExpenses.reduce((sum, item) => sum + item.amountJPY, 0);
  const sehyeonPersonalCashJPY = sehyeonPersonalCashExpenses.reduce((sum, item) => sum + item.amountJPY, 0);

  // 2. Card Expenses
  const cardExpenses = budget.filter(
    (b) =>
      b.type !== 'DEPOSIT' &&
      b.paymentMethod === 'CARD' &&
      b.paidBy !== '공동경비' &&
      b.paidBy !== '공동경비(현금)'
  );

  // Shared Card (1/2 split)
  const cardSharedExpenses = cardExpenses.filter((e) => e.scope === 'SHARED');
  const totalCardSharedJPY = cardSharedExpenses.reduce((sum, item) => sum + item.amountJPY, 0);

  const hyeonwooCardSharedExpenses = cardSharedExpenses.filter((e) => e.paidBy === '현우가족');
  const sehyeonCardSharedExpenses = cardSharedExpenses.filter((e) => e.paidBy === '세현가족');

  const hyeonwooCardSharedPaidJPY = hyeonwooCardSharedExpenses.reduce((sum, item) => sum + item.amountJPY, 0);
  const sehyeonCardSharedPaidJPY = sehyeonCardSharedExpenses.reduce((sum, item) => sum + item.amountJPY, 0);

  // Personal Cards
  const hyeonwooPersonalCardExpenses = cardExpenses.filter(
    (e) => e.scope === 'HYEONWOO' || (e.scope !== 'SHARED' && e.paidBy === '현우가족')
  );
  const sehyeonPersonalCardExpenses = cardExpenses.filter(
    (e) => e.scope === 'SEHYEON' || (e.scope !== 'SHARED' && e.paidBy === '세현가족')
  );

  const hyeonwooPersonalCardJPY = hyeonwooPersonalCardExpenses.reduce((sum, item) => sum + item.amountJPY, 0);
  const sehyeonPersonalCardJPY = sehyeonPersonalCardExpenses.reduce((sum, item) => sum + item.amountJPY, 0);

  // Grand Total for entire trip
  const grandTotalExpenseJPY =
    totalCashSpentJPY +
    totalCardSharedJPY +
    hyeonwooPersonalCardJPY +
    sehyeonPersonalCardJPY +
    hyeonwooPersonalCashJPY +
    sehyeonPersonalCashJPY;

  // Family Specific Calculations
  // Cash burden: 50% of shared cash spent
  const familyCashBurdenJPY = Math.round(totalCashSpentJPY / 2);
  // Shared card burden: 50% of shared card
  const familyCardSharedBurdenJPY = Math.round(totalCardSharedJPY / 2);

  // Card difference:
  // 현우가 선결제한 금액 - 현우 분담액 (양수면 현우가 더 결제하여 세현으로부터 받을 돈)
  const hyeonwooCardDiff = hyeonwooCardSharedPaidJPY - familyCardSharedBurdenJPY;
  // 세현이 선결제한 금액 - 세현 분담액 (양수면 세현이 더 결제하여 현우로부터 받을 돈)
  const sehyeonCardDiff = sehyeonCardSharedPaidJPY - familyCardSharedBurdenJPY;

  // Cash deposit difference (if one family deposited more cash into pool)
  const cashDepositDiff = hyeonwooDepositJPY - sehyeonDepositJPY;

  // Hyunwoo Family total trip expenditure (공동현금부담 + 공동카드부담 + 개인카드 + 개인현금)
  const hyeonwooTrueTotalExpenseJPY =
    familyCashBurdenJPY + familyCardSharedBurdenJPY + hyeonwooPersonalCardJPY + hyeonwooPersonalCashJPY;
  // Sehyun Family total trip expenditure (공동현금부담 + 공동카드부담 + 개인카드 + 개인현금)
  const sehyeonTrueTotalExpenseJPY =
    familyCashBurdenJPY + familyCardSharedBurdenJPY + sehyeonPersonalCardJPY + sehyeonPersonalCashJPY;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Copy Summary customized for current tab
  const handleCopySummary = () => {
    let lines: string[] = [];
    const dateStr = new Date().toLocaleDateString('ko-KR');

    if (selectedReceipt === 'ALL') {
      lines = [
        '🧾 [도쿄 5박 6일 여행 전체 공식 영수증 & 정산표]',
        `발행일시: ${dateStr} | 대상: 전체 4인 (현우가족 2인 + 세현가족 2인)`,
        '========================================',
        `■ 💵 현금 공동경비 풀`,
        `  - 총 모금액: ¥${totalDepositsJPY.toLocaleString()} (현우: ¥${hyeonwooDepositJPY.toLocaleString()}, 세현: ¥${sehyeonDepositJPY.toLocaleString()})`,
        `  - 총 지출액: ¥${totalCashSpentJPY.toLocaleString()}`,
        `  - 남은 잔액: ¥${cashRemainingJPY.toLocaleString()} (각 가족 50% 환전: ¥${Math.round(cashRemainingJPY / 2).toLocaleString()})`,
        '----------------------------------------',
        `■ 💳 공동 카드 결제 (50:50 분담 대상): ¥${totalCardSharedJPY.toLocaleString()}`,
        `  - 가족당 분담액: ¥${familyCardSharedBurdenJPY.toLocaleString()}`,
        `  - 현우가족 선결제: ¥${hyeonwooCardSharedPaidJPY.toLocaleString()}`,
        `  - 세현가족 선결제: ¥${sehyeonCardSharedPaidJPY.toLocaleString()}`,
        '----------------------------------------',
        `■ 💳 가족별 개별 카드 지출`,
        `  - 현우가족 개별카드: ¥${hyeonwooPersonalCardJPY.toLocaleString()}`,
        `  - 세현가족 개별카드: ¥${sehyeonPersonalCardJPY.toLocaleString()}`,
        '----------------------------------------',
        `■ 💴 가족별 개별 현금 지출`,
        `  - 현우가족 개별현금: ¥${hyeonwooPersonalCashJPY.toLocaleString()}`,
        `  - 세현가족 개별현금: ¥${sehyeonPersonalCashJPY.toLocaleString()}`,
        '----------------------------------------',
        `■ ⚖️ 최종 1/2 정산 결과`,
        hyeonwooCardDiff > 0
          ? `  👉 세현가족이 현우가족에게 송금할 금액: ¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()})`
          : hyeonwooCardDiff < 0
          ? `  👉 현우가족이 세현가족에게 송금할 금액: ¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()})`
          : `  👉 공동카드 정산 차액 없음 (완전 일치)`,
        '========================================',
        `★ 여행 총 사용 내역 종합 합계: ¥${grandTotalExpenseJPY.toLocaleString()} (약 ₩${toKRW(grandTotalExpenseJPY).toLocaleString()})`,
        `★ 1인당 평균 분담액 (4인 기준): ¥${Math.round(grandTotalExpenseJPY / 4).toLocaleString()} (약 ₩${toKRW(Math.round(grandTotalExpenseJPY / 4)).toLocaleString()})`
      ];
    } else if (selectedReceipt === '현우가족') {
      lines = [
        '🧾 [현우가족 (2인) 도쿄 여행 공식 영수증 & 정산표]',
        `발행일시: ${dateStr} | 대상: 현우가족 2명`,
        '========================================',
        `■ 💵 현금 공동경비 정산`,
        `  - 현우가족 초기 모금액: ¥${hyeonwooDepositJPY.toLocaleString()}`,
        `  - 현금 공동경비 50% 분담액: ¥${familyCashBurdenJPY.toLocaleString()}`,
        `  - 현금 잔액 회수 예정액 (50%): ¥${Math.round(cashRemainingJPY / 2).toLocaleString()}`,
        '----------------------------------------',
        `■ 💳 카드 지출 및 50% 분담 내역`,
        `  - 현우가족 선결제 공동카드: ¥${hyeonwooCardSharedPaidJPY.toLocaleString()}`,
        `  - 공동카드 50% 분담 기준액: ¥${familyCardSharedBurdenJPY.toLocaleString()}`,
        `  - 현우가족 개별카드 지출: ¥${hyeonwooPersonalCardJPY.toLocaleString()}`,
        '----------------------------------------',
        `■ 💴 현우가족 개별 현금 지출: ¥${hyeonwooPersonalCashJPY.toLocaleString()}`,
        '----------------------------------------',
        `■ ⚖️ 세현가족과의 최종 정산`,
        hyeonwooCardDiff > 0
          ? `  👉 세현가족으로부터 받을 금액: +¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()})`
          : hyeonwooCardDiff < 0
          ? `  👉 세현가족에게 보낼 금액: -¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()})`
          : `  👉 정산 차액 0원 (정산 완료)`,
        '========================================',
        `★ 현우가족 실제 총 지출 합계: ¥${hyeonwooTrueTotalExpenseJPY.toLocaleString()} (약 ₩${toKRW(hyeonwooTrueTotalExpenseJPY).toLocaleString()})`,
        `★ 현우가족 1인당 평균 지출 (2인 기준): ¥${Math.round(hyeonwooTrueTotalExpenseJPY / 2).toLocaleString()} (약 ₩${toKRW(Math.round(hyeonwooTrueTotalExpenseJPY / 2)).toLocaleString()})`
      ];
    } else {
      lines = [
        '🧾 [세현가족 (2인) 도쿄 여행 공식 영수증 & 정산표]',
        `발행일시: ${dateStr} | 대상: 세현가족 2명`,
        '========================================',
        `■ 💵 현금 공동경비 정산`,
        `  - 세현가족 초기 모금액: ¥${sehyeonDepositJPY.toLocaleString()}`,
        `  - 현금 공동경비 50% 분담액: ¥${familyCashBurdenJPY.toLocaleString()}`,
        `  - 현금 잔액 회수 예정액 (50%): ¥${Math.round(cashRemainingJPY / 2).toLocaleString()}`,
        '----------------------------------------',
        `■ 💳 카드 지출 및 50% 분담 내역`,
        `  - 세현가족 선결제 공동카드: ¥${sehyeonCardSharedPaidJPY.toLocaleString()}`,
        `  - 공동카드 50% 분담 기준액: ¥${familyCardSharedBurdenJPY.toLocaleString()}`,
        `  - 세현가족 개별카드 지출: ¥${sehyeonPersonalCardJPY.toLocaleString()}`,
        '----------------------------------------',
        `■ 💴 세현가족 개별 현금 지출: ¥${sehyeonPersonalCashJPY.toLocaleString()}`,
        '----------------------------------------',
        `■ ⚖️ 현우가족과의 최종 정산`,
        sehyeonCardDiff > 0
          ? `  👉 현우가족으로부터 받을 금액: +¥${Math.abs(sehyeonCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(sehyeonCardDiff)).toLocaleString()})`
          : sehyeonCardDiff < 0
          ? `  👉 현우가족에게 보낼 금액: -¥${Math.abs(sehyeonCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(sehyeonCardDiff)).toLocaleString()})`
          : `  👉 정산 차액 0원 (정산 완료)`,
        '========================================',
        `★ 세현가족 실제 총 지출 합계: ¥${sehyeonTrueTotalExpenseJPY.toLocaleString()} (약 ₩${toKRW(sehyeonTrueTotalExpenseJPY).toLocaleString()})`,
        `★ 세현가족 1인당 평균 지출 (2인 기준): ¥${Math.round(sehyeonTrueTotalExpenseJPY / 2).toLocaleString()} (약 ₩${toKRW(Math.round(sehyeonTrueTotalExpenseJPY / 2)).toLocaleString()})`
      ];
    }

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-700/20">
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>공식 여행 경비 영수증</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  실시간 DB 반영
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                원하는 영수증(전체/현우가족/세현가족)을 탭하여 즉시 확인 및 인쇄·복사할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopySummary}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer relative"
              title="텍스트 복사"
            >
              {copySuccess ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="인쇄하기"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copy Notification Toast Banner */}
        {copySuccess && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-in slide-in-from-top-2 duration-150">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {selectedReceipt === 'ALL'
                  ? '전체 영수증 정산 요약본이'
                  : `${selectedReceipt} 영수증 정산 요약본이`}{' '}
                클립보드에 복사되었습니다! 카카오톡 등에 붙여넣기 하세요.
              </span>
            </span>
          </div>
        )}

        {/* 3-Way Receipt Selector Tabs */}
        <div className="bg-slate-800 p-2 sm:px-4 sm:py-2.5 border-b border-slate-700/50 flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedReceipt('ALL')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedReceipt === 'ALL'
                  ? 'bg-amber-400 text-slate-900 shadow-md scale-100'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>전체 영수증 (종합)</span>
            </button>

            <button
              onClick={() => setSelectedReceipt('현우가족')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedReceipt === '현우가족'
                  ? 'bg-blue-500 text-white shadow-md scale-100'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>현우가족 영수증 (2인)</span>
            </button>

            <button
              onClick={() => setSelectedReceipt('세현가족')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedReceipt === '세현가족'
                  ? 'bg-rose-500 text-white shadow-md scale-100'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>세현가족 영수증 (2인)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body (Paper style) */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-amber-50/50 font-mono text-slate-800 space-y-4">
          <div
            ref={receiptRef}
            className="bg-white border border-amber-200/90 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5"
          >
            {/* Paper Header */}
            <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
              <div
                className={`inline-block px-3 py-1 text-white text-[11px] font-black rounded-lg mb-2 font-sans ${
                  selectedReceipt === 'ALL'
                    ? 'bg-slate-900'
                    : selectedReceipt === '현우가족'
                    ? 'bg-blue-600'
                    : 'bg-rose-600'
                }`}
              >
                {selectedReceipt === 'ALL'
                  ? 'TOKYO TRIP 2026 COMBINED OFFICIAL RECEIPT'
                  : selectedReceipt === '현우가족'
                  ? 'HYEONWOO FAMILY OFFICIAL TRIP RECEIPT (2 PERSONS)'
                  : 'SEHYEON FAMILY OFFICIAL TRIP RECEIPT (2 PERSONS)'}
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
                {selectedReceipt === 'ALL' && '도쿄 5박 6일 전체 공식 여행 경비 영수증'}
                {selectedReceipt === '현우가족' && '👨‍👩‍👧 현우가족 (2인) 여행 경비 정산 영수증'}
                {selectedReceipt === '세현가족' && '👨‍👩‍👦 세현가족 (2인) 여행 경비 정산 영수증'}
              </h4>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {selectedReceipt === 'ALL'
                  ? '동행: 현우가족 (2인) & 세현가족 (2인) · 총 4인 풀 내역'
                  : `${selectedReceipt} 2인 기준 부담액 및 상대 가족 최종 정산 내역서`}
              </p>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 mt-2 font-sans flex-wrap">
                <span>일시: 2026.01.13 ~ 01.18</span>
                <span>•</span>
                <span>
                  {selectedReceipt === 'ALL'
                    ? `전체 등록: 총 ${budget.length}건`
                    : selectedReceipt === '현우가족'
                    ? `관련 항목: 공동 ${cashExpenses.length + cardSharedExpenses.length}건 + 개별 ${hyeonwooPersonalCardExpenses.length}건`
                    : `관련 항목: 공동 ${cashExpenses.length + cardSharedExpenses.length}건 + 개별 ${sehyeonPersonalCardExpenses.length}건`}
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">실시간 DB 동기화 완료</span>
              </div>
            </div>

            {/* TAB 1: ALL (전체 영수증) */}
            {selectedReceipt === 'ALL' && (
              <>
                {/* 1. Cash Fund (입출금 내역 요약) */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg font-sans">
                    <span className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>💵 현금 공동경비 풀 (모금 & 자동 차감 명세)</span>
                    </span>
                    <span className="text-emerald-700 font-mono">
                      잔액: ¥{cashRemainingJPY.toLocaleString()}
                    </span>
                  </div>

                  {/* Deposits */}
                  <div className="space-y-1 pl-1">
                    <div className="text-[10px] font-bold text-slate-400 font-sans">
                      [현금 모금 (입금 내역)]
                    </div>
                    {deposits.map((d) => (
                      <div key={d.id} className="flex justify-between items-center text-[11px] py-0.5">
                        <span className="text-slate-600 truncate max-w-[260px]">
                          + {d.title} ({d.paidBy})
                        </span>
                        <span className="font-bold text-emerald-600">
                          +¥{d.amountJPY.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-200">
                      <span className="text-slate-700 font-sans">현금 총 모금액</span>
                      <span className="text-emerald-700">¥{totalDepositsJPY.toLocaleString()}</span>
                    </div>
                  </div>

                    {/* Cash Spent */}
                  <div className="space-y-1 pl-1 pt-2">
                    <div className="text-[10px] font-bold text-slate-400 font-sans">
                      [현금 지출 (공동경비 풀 자동 차감)]
                    </div>
                    {cashExpenses.map((e) => (
                      <div key={e.id} className="flex justify-between items-center text-[11px] py-0.5">
                        <span className="text-slate-600 truncate max-w-[260px]">
                          - {e.day === 0 ? '[사전]' : `[D${e.day}]`} {e.title} {e.time ? `(${e.time})` : ''}
                        </span>
                        <span className="text-slate-800">-¥{e.amountJPY.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-200">
                      <span className="text-slate-700 font-sans">현금 총 지출액</span>
                      <span className="text-rose-600">-¥{totalCashSpentJPY.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-100 flex justify-between items-center font-bold text-xs">
                    <span className="text-slate-700 font-sans">
                      현금 남은 잔액 (가족당 ¥{Math.round(cashRemainingJPY / 2).toLocaleString()} 귀속)
                    </span>
                    <span className={`text-sm ${cashRemainingJPY >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      ¥{cashRemainingJPY.toLocaleString()} (약 ₩{toKRW(cashRemainingJPY).toLocaleString()})
                    </span>
                  </div>
                </div>

                {/* 2. Card Transactions Itemized (전수 내역) */}
                <div className="space-y-2 text-xs pt-3 border-t-2 border-dashed border-slate-300">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-800 bg-indigo-50 px-3 py-2 rounded-lg font-sans">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <span>💳 카드 결제 전수 내역 (공동 1/2 + 가족별 개별)</span>
                    </span>
                    <span>총 {cardExpenses.length}건</span>
                  </div>

                  <div className="space-y-1.5">
                    {cardExpenses.map((c) => {
                      const isShared = c.scope === 'SHARED';
                      return (
                        <div
                          key={c.id}
                          className="p-2 rounded-lg bg-slate-50 flex items-center justify-between text-[11px]"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-sans ${
                                  isShared
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : c.paidBy === '현우가족'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {isShared ? '공동 1/2' : `${c.paidBy} 개별`}
                              </span>
                              <span className="text-slate-800 font-medium truncate max-w-[230px]">
                                {c.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {c.date || (c.day === 0 ? '사전준비' : `Day ${c.day}`)} {c.time ? `(${c.time})` : ''} · {c.location || '도쿄'} · 결제: {c.paidBy} {c.cardCompany ? `[${c.cardCompany}]` : ''}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 block">
                              ¥{c.amountJPY.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              (약 ₩{toKRW(c.amountJPY).toLocaleString()})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Settlement Summary & Grand Totals */}
                <div className="pt-4 border-t-2 border-dashed border-slate-300 space-y-2 text-xs font-sans">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>공동 사용 카드 합계 (1/2 분담 대상)</span>
                    <span className="font-mono text-sm font-black text-indigo-700">
                      ¥{totalCardSharedJPY.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pl-2">
                    <span>ㄴ 각 가족별 정산 분담액 (50%)</span>
                    <span className="font-mono font-bold text-slate-700">
                      ¥{familyCardSharedBurdenJPY.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pl-2">
                    <span>ㄴ 현우가족 선결제: ¥{hyeonwooCardSharedPaidJPY.toLocaleString()}</span>
                    <span>세현가족 선결제: ¥{sehyeonCardSharedPaidJPY.toLocaleString()}</span>
                  </div>

                  {/* Inter-family Settlement Result */}
                  <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300/80 text-amber-950 space-y-1">
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>⚖️ 최종 가족 간 카드 정산 차액</span>
                      <span className="font-mono font-black text-sm">
                        {hyeonwooCardDiff > 0
                          ? `세현 → 현우 ¥${Math.abs(hyeonwooCardDiff).toLocaleString()}`
                          : hyeonwooCardDiff < 0
                          ? `현우 → 세현 ¥${Math.abs(hyeonwooCardDiff).toLocaleString()}`
                          : '차액 없음 (완전 일치)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900">
                      {hyeonwooCardDiff > 0
                        ? `현우가족이 공동카드를 더 결제하였으므로, 세현가족이 현우가족에게 ¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()}) 송금`
                        : hyeonwooCardDiff < 0
                        ? `세현가족이 공동카드를 더 결제하였으므로, 현우가족이 세현가족에게 ¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()}) 송금`
                        : '양 가족이 결제한 공동 카드 금액이 정확히 50:50으로 일치하여 추가 송금이 필요 없습니다.'}
                    </p>
                  </div>

                  {/* Grand Total Bar */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 mt-3">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                      <span>★ 총 사용 내역 종합 합계 (TOTAL)</span>
                      <span className="text-xl font-mono font-black">
                        ¥{grandTotalExpenseJPY.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                      <span>원화 환산 금액 (100엔당 920원 기준)</span>
                      <span className="font-mono font-bold text-slate-200">
                        약 ₩{toKRW(grandTotalExpenseJPY).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>1인당 평균 사용 총액 (4인 기준)</span>
                      <span className="font-mono text-slate-300">
                        ¥{Math.round(grandTotalExpenseJPY / 4).toLocaleString()} (약 ₩{toKRW(Math.round(grandTotalExpenseJPY / 4)).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: HYEONWOO (현우가족 영수증) */}
            {selectedReceipt === '현우가족' && (
              <>
                {/* 1. Hyunwoo Cash breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 bg-blue-50 px-3 py-2 rounded-lg font-sans">
                    <span className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-blue-600" />
                      <span>💵 현우가족 현금 공동경비 지분 (50%)</span>
                    </span>
                    <span className="text-blue-700 font-mono">2인 분담</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-sans">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">현우가족 모금액</span>
                      <span className="font-bold text-emerald-600 font-mono">
                        ¥{hyeonwooDepositJPY.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">공동 현금 지출 중 현우 50% 분담</span>
                      <span className="font-bold text-rose-600 font-mono">
                        -¥{familyCashBurdenJPY.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200 font-bold">
                      <span className="text-slate-800">현우가족 현금 잔액 귀속분 (50%)</span>
                      <span className="text-emerald-700 font-mono">
                        ¥{Math.round(cashRemainingJPY / 2).toLocaleString()} (약 ₩{toKRW(Math.round(cashRemainingJPY / 2)).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Hyunwoo Card breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t-2 border-dashed border-slate-300">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 bg-indigo-50 px-3 py-2 rounded-lg font-sans">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <span>💳 현우가족 카드 결제 및 분담 명세</span>
                    </span>
                    <span>합계 ¥{(hyeonwooCardSharedPaidJPY + hyeonwooPersonalCardJPY).toLocaleString()}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-slate-800">현우가족 선결제 공동카드</div>
                        <span className="text-[10px] text-slate-400">
                          {hyeonwooCardSharedExpenses.length}건 선결제 완료
                        </span>
                      </div>
                      <span className="font-bold font-mono text-slate-900">
                        ¥{hyeonwooCardSharedPaidJPY.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-slate-800">현우가족 개별 카드 지출</div>
                        <span className="text-[10px] text-slate-400">
                          {hyeonwooPersonalCardExpenses.length}건 (현우가족 단독 부담)
                        </span>
                      </div>
                      <span className="font-bold font-mono text-blue-700">
                        ¥{hyeonwooPersonalCardJPY.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-200 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-sky-950">현우가족 개별 현금 지출</div>
                        <span className="text-[10px] text-sky-600">
                          {hyeonwooPersonalCashExpenses.length}건 (현우 개인 지갑 지출)
                        </span>
                      </div>
                      <span className="font-bold font-mono text-sky-700">
                        ¥{hyeonwooPersonalCashJPY.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-indigo-950">공동카드 50% 분담 기준액</div>
                        <span className="text-[10px] text-indigo-700">전체 공동카드 ¥{totalCardSharedJPY.toLocaleString()}의 50%</span>
                      </div>
                      <span className="font-bold font-mono text-indigo-800">
                        ¥{familyCardSharedBurdenJPY.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Hyunwoo Final Settlement */}
                <div className="pt-3 border-t-2 border-dashed border-slate-300 space-y-2 text-xs font-sans">
                  <div className="p-3.5 rounded-xl bg-blue-100/80 border border-blue-300 text-blue-950 space-y-1.5">
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-blue-700" />
                        <span>⚖️ 세현가족과의 정산 결과</span>
                      </span>
                      <span className="font-mono font-black text-sm">
                        {hyeonwooCardDiff > 0
                          ? `+¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (수령)`
                          : hyeonwooCardDiff < 0
                          ? `-¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (송금)`
                          : '0원 (정산완료)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-900">
                      {hyeonwooCardDiff > 0
                        ? `현우가족이 공동카드를 더 결제했으므로, 세현가족으로부터 ¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()})을 받아야 합니다.`
                        : hyeonwooCardDiff < 0
                        ? `세현가족이 공동카드를 더 결제했으므로, 세현가족에게 ¥${Math.abs(hyeonwooCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(hyeonwooCardDiff)).toLocaleString()})을 송금해야 합니다.`
                        : '공동카드 분담액이 완전히 일치합니다.'}
                    </p>
                  </div>

                  {/* Hyunwoo Total Burden Box */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 mt-3">
                    <div className="flex items-center justify-between text-xs text-blue-300 font-bold">
                      <span>★ 현우가족 실제 최종 총 지출액</span>
                      <span className="text-xl font-mono font-black text-white">
                        ¥{hyeonwooTrueTotalExpenseJPY.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 pl-1">
                      (현금 공동 50% ¥{familyCashBurdenJPY.toLocaleString()} + 공동카드 50% ¥{familyCardSharedBurdenJPY.toLocaleString()} + 개별카드 ¥{hyeonwooPersonalCardJPY.toLocaleString()} + 개별현금 ¥{hyeonwooPersonalCashJPY.toLocaleString()})
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1.5 border-t border-slate-800">
                      <span>원화 환산 금액 (100엔당 920원)</span>
                      <span className="font-mono font-bold text-slate-200">
                        약 ₩{toKRW(hyeonwooTrueTotalExpenseJPY).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>1인당 평균 분담액 (2인 기준)</span>
                      <span className="font-mono text-blue-300 font-bold">
                        ¥{Math.round(hyeonwooTrueTotalExpenseJPY / 2).toLocaleString()} (약 ₩{toKRW(Math.round(hyeonwooTrueTotalExpenseJPY / 2)).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Hyunwoo Itemized List */}
                <div className="space-y-2 text-xs pt-3 border-t-2 border-dashed border-slate-300">
                  <div className="text-[11px] font-bold text-slate-700 font-sans">
                    [현우가족 결제/지출 상세 명세]
                  </div>
                  <div className="space-y-1">
                    {hyeonwooCardSharedExpenses.map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-slate-50">
                        <span className="text-slate-700 truncate max-w-[240px]">
                          [공동선결제] {c.title}
                        </span>
                        <span className="font-bold text-indigo-700 font-mono">¥{c.amountJPY.toLocaleString()}</span>
                      </div>
                    ))}
                    {hyeonwooPersonalCardExpenses.map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-blue-50/50">
                        <span className="text-slate-700 truncate max-w-[240px]">
                          [현우카드] {c.title}
                        </span>
                        <span className="font-bold text-blue-700 font-mono">¥{c.amountJPY.toLocaleString()}</span>
                      </div>
                    ))}
                    {hyeonwooPersonalCashExpenses.map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-sky-50/50">
                        <span className="text-slate-700 truncate max-w-[240px]">
                          [현우현금] {c.title}
                        </span>
                        <span className="font-bold text-sky-700 font-mono">¥{c.amountJPY.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: SEHYEON (세현가족 영수증) */}
            {selectedReceipt === '세현가족' && (
              <>
                {/* 1. Sehyeon Cash breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-rose-900 bg-rose-50 px-3 py-2 rounded-lg font-sans">
                    <span className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-rose-600" />
                      <span>💵 세현가족 현금 공동경비 지분 (50%)</span>
                    </span>
                    <span className="text-rose-700 font-mono">2인 분담</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-sans">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">세현가족 모금액</span>
                      <span className="font-bold text-emerald-600 font-mono">
                        ¥{sehyeonDepositJPY.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">공동 현금 지출 중 세현 50% 분담</span>
                      <span className="font-bold text-rose-600 font-mono">
                        -¥{familyCashBurdenJPY.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200 font-bold">
                      <span className="text-slate-800">세현가족 현금 잔액 귀속분 (50%)</span>
                      <span className="text-emerald-700 font-mono">
                        ¥{Math.round(cashRemainingJPY / 2).toLocaleString()} (약 ₩{toKRW(Math.round(cashRemainingJPY / 2)).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Sehyeon Card breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t-2 border-dashed border-slate-300">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 bg-indigo-50 px-3 py-2 rounded-lg font-sans">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <span>💳 세현가족 카드 결제 및 분담 명세</span>
                    </span>
                    <span>합계 ¥{(sehyeonCardSharedPaidJPY + sehyeonPersonalCardJPY).toLocaleString()}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-slate-800">세현가족 선결제 공동카드</div>
                        <span className="text-[10px] text-slate-400">
                          {sehyeonCardSharedExpenses.length}건 선결제 완료
                        </span>
                      </div>
                      <span className="font-bold font-mono text-slate-900">
                        ¥{sehyeonCardSharedPaidJPY.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-slate-800">세현가족 개별 카드 지출</div>
                        <span className="text-[10px] text-slate-400">
                          {sehyeonPersonalCardExpenses.length}건 (세현가족 단독 부담)
                        </span>
                      </div>
                      <span className="font-bold font-mono text-rose-700">
                        ¥{sehyeonPersonalCardJPY.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-amber-950">세현가족 개별 현금 지출</div>
                        <span className="text-[10px] text-amber-600">
                          {sehyeonPersonalCashExpenses.length}건 (세현 개인 지갑 지출)
                        </span>
                      </div>
                      <span className="font-bold font-mono text-amber-700">
                        ¥{sehyeonPersonalCashJPY.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200 flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-bold text-indigo-950">공동카드 50% 분담 기준액</div>
                        <span className="text-[10px] text-indigo-700">전체 공동카드 ¥{totalCardSharedJPY.toLocaleString()}의 50%</span>
                      </div>
                      <span className="font-bold font-mono text-indigo-800">
                        ¥{familyCardSharedBurdenJPY.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Sehyeon Final Settlement */}
                <div className="pt-3 border-t-2 border-dashed border-slate-300 space-y-2 text-xs font-sans">
                  <div className="p-3.5 rounded-xl bg-rose-100/80 border border-rose-300 text-rose-950 space-y-1.5">
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-rose-700" />
                        <span>⚖️ 현우가족과의 정산 결과</span>
                      </span>
                      <span className="font-mono font-black text-sm">
                        {sehyeonCardDiff > 0
                          ? `+¥${Math.abs(sehyeonCardDiff).toLocaleString()} (수령)`
                          : sehyeonCardDiff < 0
                          ? `-¥${Math.abs(sehyeonCardDiff).toLocaleString()} (송금)`
                          : '0원 (정산완료)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-900">
                      {sehyeonCardDiff > 0
                        ? `세현가족이 공동카드를 더 결제했으므로, 현우가족으로부터 ¥${Math.abs(sehyeonCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(sehyeonCardDiff)).toLocaleString()})을 받아야 합니다.`
                        : sehyeonCardDiff < 0
                        ? `현우가족이 공동카드를 더 결제했으므로, 현우가족에게 ¥${Math.abs(sehyeonCardDiff).toLocaleString()} (약 ₩${toKRW(Math.abs(sehyeonCardDiff)).toLocaleString()})을 송금해야 합니다.`
                        : '공동카드 분담액이 완전히 일치합니다.'}
                    </p>
                  </div>

                  {/* Sehyeon Total Burden Box */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 mt-3">
                    <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
                      <span>★ 세현가족 실제 최종 총 지출액</span>
                      <span className="text-xl font-mono font-black text-white">
                        ¥{sehyeonTrueTotalExpenseJPY.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 pl-1">
                      (현금 공동 50% ¥{familyCashBurdenJPY.toLocaleString()} + 공동카드 50% ¥{familyCardSharedBurdenJPY.toLocaleString()} + 개별카드 ¥{sehyeonPersonalCardJPY.toLocaleString()} + 개별현금 ¥{sehyeonPersonalCashJPY.toLocaleString()})
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1.5 border-t border-slate-800">
                      <span>원화 환산 금액 (100엔당 920원)</span>
                      <span className="font-mono font-bold text-slate-200">
                        약 ₩{toKRW(sehyeonTrueTotalExpenseJPY).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>1인당 평균 분담액 (2인 기준)</span>
                      <span className="font-mono text-rose-300 font-bold">
                        ¥{Math.round(sehyeonTrueTotalExpenseJPY / 2).toLocaleString()} (약 ₩{toKRW(Math.round(sehyeonTrueTotalExpenseJPY / 2)).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Sehyeon Itemized List */}
                <div className="space-y-2 text-xs pt-3 border-t-2 border-dashed border-slate-300">
                  <div className="text-[11px] font-bold text-slate-700 font-sans">
                    [세현가족 결제/지출 상세 명세]
                  </div>
                  <div className="space-y-1">
                    {sehyeonCardSharedExpenses.map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-slate-50">
                        <span className="text-slate-700 truncate max-w-[240px]">
                          [공동선결제] {c.title}
                        </span>
                        <span className="font-bold text-indigo-700 font-mono">¥{c.amountJPY.toLocaleString()}</span>
                      </div>
                    ))}
                    {sehyeonPersonalCardExpenses.map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-rose-50/50">
                        <span className="text-slate-700 truncate max-w-[240px]">
                          [세현카드] {c.title}
                        </span>
                        <span className="font-bold text-rose-700 font-mono">¥{c.amountJPY.toLocaleString()}</span>
                      </div>
                    ))}
                    {sehyeonPersonalCashExpenses.map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-amber-50/50">
                        <span className="text-slate-700 truncate max-w-[240px]">
                          [세현현금] {c.title}
                        </span>
                        <span className="font-bold text-amber-700 font-mono">¥{c.amountJPY.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Receipt Barcode Effect */}
            <div className="text-center pt-3 pb-1 border-t border-slate-200">
              <div className="tracking-[6px] text-slate-400 font-mono text-xs select-none">
                ||| | |||| || |||||| | |||| | |||
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-sans">
                TOKYO-TRIP-2026-HYEONWOO-SEHYEON-DB-SYNC
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">두 가족 모두 데이터베이스에 동일하게 저장·공유됩니다.</span>
            <span className="sm:hidden">DB 실시간 공유 중</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>텍스트 복사</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
