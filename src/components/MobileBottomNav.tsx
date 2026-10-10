import React from 'react';
import { Calendar, Compass, Share2, Wallet, Columns2 } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'timeline' | 'map' | 'split';
  onSelectView: (view: 'timeline' | 'map' | 'split') => void;
  onOpenShare: () => void;
  onOpenBudget: () => void;
  unreadCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenShare,
  onOpenBudget,
  unreadCount
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center h-14">
        {/* Tab 1: Timeline */}
        <button
          onClick={() => onSelectView('timeline')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
            currentView === 'timeline' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">일정</span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => onSelectView('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
            currentView === 'map' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">동선 지도</span>
        </button>

        {/* Tab 3: Z-Fold Split View */}
        <button
          onClick={() => onSelectView('split')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors relative cursor-pointer ${
            currentView === 'split' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          title="갤럭시 Z폴드 및 태블릿 화면 분할"
        >
          <div className="relative">
            <Columns2 className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 text-[8px] font-black bg-amber-400 text-slate-900 px-1 rounded-sm leading-none shadow-2xs">
              폴드
            </span>
          </div>
          <span className="text-[10px] tracking-tight mt-1">좌우분할</span>
        </button>

        {/* Tab 4: Tools / Budget */}
        <button
          onClick={onOpenBudget}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">경비/체크</span>
        </button>

        {/* Tab 5: Live Share */}
        <button
          onClick={onOpenShare}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-500 hover:text-slate-900 transition-colors relative cursor-pointer"
        >
          <Share2 className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px] tracking-tight mt-1 text-indigo-600 font-semibold">
            친구 공유
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 sm:right-3 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
      </div>
    </nav>
  );
};
