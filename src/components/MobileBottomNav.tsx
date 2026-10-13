import React from 'react';
import { Calendar, Compass, Wallet, Columns2, User } from 'lucide-react';
import { KakaoAuthUser } from '../types/auth';

interface MobileBottomNavProps {
  currentView: 'timeline' | 'map' | 'split';
  onSelectView: (view: 'timeline' | 'map' | 'split') => void;
  onOpenBudget: () => void;
  onOpenShare?: () => void;
  unreadCount?: number;
  currentUser?: KakaoAuthUser | null;
  onOpenLogin?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenBudget,
  currentUser,
  onOpenLogin
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
          <span className="text-[10px] tracking-tight mt-1">가계부</span>
        </button>

        {/* Tab 5: Kakao User Profile / Login */}
        <button
          onClick={onOpenLogin}
          className="flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer group"
          title={currentUser ? `${currentUser.nickname} 카카오 프로필` : '카카오 로그인'}
        >
          {currentUser ? (
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center text-[10px] font-bold shadow-2xs ring-1 ring-amber-400">
                {currentUser.avatarEmoji || (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-bold text-amber-900 mt-1 truncate max-w-[50px]">
                {currentUser.nickname}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-amber-600 group-hover:text-amber-800">
              <div className="w-5 h-5 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center text-[10px] shadow-2xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
                </svg>
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-semibold">카카오</span>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};
