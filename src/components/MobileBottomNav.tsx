import React from 'react';
import { Calendar, Compass, Share2, Wallet } from 'lucide-react';

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-4 items-center h-14">
        {/* Tab 1: Timeline */}
        <button
          onClick={() => onSelectView('timeline')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            currentView === 'timeline' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">일정</span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => onSelectView('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            currentView === 'map' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">동선 지도</span>
        </button>

        {/* Tab 3: Tools / Budget */}
        <button
          onClick={onOpenBudget}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">경비/체크</span>
        </button>

        {/* Tab 4: Live Share */}
        <button
          onClick={onOpenShare}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-500 hover:text-slate-900 transition-colors relative"
        >
          <Share2 className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px] font-medium tracking-tight mt-1 text-indigo-600 font-semibold">
            친구 공유
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
      </div>
    </nav>
  );
};
