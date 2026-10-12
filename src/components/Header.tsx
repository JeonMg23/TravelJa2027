import React from 'react';
import { Calendar, Compass, Wallet, CheckSquare } from 'lucide-react';
import { FriendCompanion } from '../types/travel';

interface HeaderProps {
  activeTab: 'timeline' | 'map' | 'budget' | 'checklist';
  onSelectTab: (tab: 'timeline' | 'map' | 'budget' | 'checklist') => void;
  onGoHome: () => void;
  onOpenShare?: () => void;
  onOpenCollab?: () => void;
  onOpenMobileInstall?: () => void;
  companions?: FriendCompanion[];
  unreadCommentCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onGoHome
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Clickable to return to Landing Page) */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-left hover:opacity-90 transition-opacity cursor-pointer group"
          title="첫 페이지(소개)로 이동"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black text-amber-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:rotate-6 group-hover:scale-105 transition-transform text-lg sm:text-xl">
            ⚡
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 whitespace-nowrap font-sans">
                개구쟁이들의 일본여행
              </span>
              <span className="text-[10px] font-black text-amber-900 bg-amber-300 border border-black rounded-md px-1.5 py-0.5 shadow-[1px_1px_0px_#000]">
                첫페이지 🏠
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">
              🔥 우당탕탕 도쿄 5박 6일 원정대 (1.13 ~ 1.18)
            </span>
          </div>
        </button>

        {/* Zone 2: 4 Clean Single-Line Nav Links (PC/태블릿에서 표시, 모바일은 하단 바 이용) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onSelectTab('timeline')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            일정 타임라인
          </button>
          <button
            onClick={() => onSelectTab('map')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            동선 지도
          </button>
          <button
            onClick={() => onSelectTab('budget')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'budget'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Wallet className="w-4 h-4 text-indigo-600" />
            공동 경비 & 가계부
          </button>
          <button
            onClick={() => onSelectTab('checklist')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'checklist'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            체크리스트
          </button>
        </nav>
      </div>
    </header>
  );
};
