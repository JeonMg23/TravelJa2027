import React from 'react';
import { Calendar, Compass, Wallet, Columns2 } from 'lucide-react';
import { KakaoAuthUser, DeviceInfo } from '../types/auth';
import { detectDeviceInfo } from '../services/kakaoAuth';
import { getCharacterAvatarById } from '../data/characterAvatars';
import { ScheduleThemeId, SCHEDULE_THEMES } from '../data/scheduleThemes';

interface MobileBottomNavProps {
  currentView: 'timeline' | 'map' | 'split';
  onSelectView: (view: 'timeline' | 'map' | 'split') => void;
  onOpenBudget: () => void;
  onOpenShare?: () => void;
  unreadCount?: number;
  currentUser?: KakaoAuthUser | null;
  onOpenLogin?: () => void;
  scheduleThemeId?: ScheduleThemeId;
  deviceInfo?: DeviceInfo;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenBudget,
  currentUser,
  onOpenLogin,
  scheduleThemeId = 'classic-light',
  deviceInfo
}) => {
  const currentAvatar = getCharacterAvatarById(currentUser?.avatarId, currentUser?.id);
  const theme = SCHEDULE_THEMES[scheduleThemeId] || SCHEDULE_THEMES['classic-light'];
  const isDark = theme.isDark;

  const activeDevice = deviceInfo || currentUser?.device || detectDeviceInfo();
  const isIPhone =
    activeDevice.os === 'iOS' ||
    activeDevice.modelId === 'iphone_12_pro_max' ||
    activeDevice.modelId === 'iphone_16_pro_max' ||
    /아이폰|iPhone/i.test(activeDevice.name);
  const isGalaxyFold =
    activeDevice.modelId === 'galaxy_fold_8' || /갤럭시 폴드|Fold/i.test(activeDevice.name);

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 shadow-lg transition-all duration-300 ${
        isIPhone
          ? 'iphone-bottom-nav px-3 pt-1.5'
          : isGalaxyFold
          ? 'px-3 py-1.5 fold:px-6'
          : 'px-1 py-1'
      } ${
        isDark
          ? 'bg-[#070A16]/95 backdrop-blur-xl border-t border-white/15'
          : 'bg-white/95 backdrop-blur-md border-t border-slate-200'
      }`}
    >
      <div
        className={`grid grid-cols-5 items-center ${
          isIPhone
            ? 'iphone-bottom-nav-grid gap-1.5 iphone-max:gap-2.5 h-15'
            : isGalaxyFold
            ? 'gap-2 fold:gap-4 h-15'
            : 'h-14'
        }`}
      >
        {/* Tab 1: Timeline */}
        <button
          onClick={() => onSelectView('timeline')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
            isIPhone ? 'gap-0.5 py-0.5' : ''
          } ${
            currentView === 'timeline'
              ? isDark
                ? `${theme.accentText} font-bold`
                : 'text-indigo-600 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className={`text-[10px] tracking-tight ${isIPhone ? 'mt-0.5' : 'mt-1'}`}>
            일정
          </span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => onSelectView('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
            currentView === 'map'
              ? isDark
                ? 'text-sky-400 font-bold'
                : 'text-blue-600 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">동선 지도</span>
        </button>

        {/* Tab 3: Z-Fold Split View */}
        <button
          onClick={() => onSelectView('split')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors relative cursor-pointer ${
            currentView === 'split'
              ? isDark
                ? `${theme.accentText} font-bold`
                : 'text-indigo-600 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-500 hover:text-slate-900'
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
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">가계부</span>
        </button>

        {/* Tab 5: Kakao User Profile / Login */}
        <button
          onClick={onOpenLogin}
          className="flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer group"
          title={currentUser ? `${currentUser.nickname} 프로필` : '프로필 선택'}
        >
          {currentUser ? (
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentAvatar.bgGradient} p-0.5 flex items-center justify-center shadow-2xs ring-1 ring-amber-400 overflow-hidden`}
              >
                {currentUser.profileImageUrl ? (
                  <img
                    src={currentUser.profileImageUrl}
                    alt={currentUser.nickname}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  currentAvatar.renderSvg('w-full h-full')
                )}
              </div>
              <span
                className={`text-[10px] font-bold mt-0.5 truncate max-w-[54px] ${
                  isDark ? 'text-amber-300' : 'text-amber-900'
                }`}
              >
                {currentUser.nickname}
              </span>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center ${
                isDark
                  ? 'text-amber-300 group-hover:text-amber-200'
                  : 'text-amber-600 group-hover:text-amber-800'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center text-[10px] shadow-2xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
                </svg>
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-semibold">프로필</span>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};
