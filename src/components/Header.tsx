import React, { useState } from 'react';
import { Calendar, Compass, Wallet, CheckSquare, Smartphone, Tablet, Laptop, LogOut, RefreshCw, UserCheck } from 'lucide-react';
import { FriendCompanion } from '../types/travel';
import { KakaoAuthUser } from '../types/auth';

interface HeaderProps {
  activeTab: 'timeline' | 'map' | 'budget' | 'checklist';
  onSelectTab: (tab: 'timeline' | 'map' | 'budget' | 'checklist') => void;
  onGoHome: () => void;
  onOpenShare?: () => void;
  onOpenCollab?: () => void;
  onOpenMobileInstall?: () => void;
  companions?: FriendCompanion[];
  unreadCommentCount?: number;
  currentUser?: KakaoAuthUser | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onGoHome,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenMobileInstall
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getDeviceIcon = () => {
    if (!currentUser) return null;
    if (currentUser.device.type === 'mobile') return <Smartphone className="w-3.5 h-3.5 text-blue-600" />;
    if (currentUser.device.type === 'tablet') return <Tablet className="w-3.5 h-3.5 text-purple-600" />;
    return <Laptop className="w-3.5 h-3.5 text-slate-600" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark (Clickable to return to Landing Page) */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-3 shrink-0 text-left hover:opacity-90 transition-opacity cursor-pointer group"
          title="첫 페이지(소개)로 이동"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black text-amber-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:rotate-6 group-hover:scale-105 transition-transform text-lg sm:text-xl">
            ⚡
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-lg font-black tracking-tight text-slate-900 whitespace-nowrap font-sans">
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

        {/* Zone 2: 4 Clean Single-Line Nav Links (PC/태블릿에서 표시) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onSelectTab('timeline')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
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
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
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
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
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
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            체크리스트
          </button>
        </nav>

        {/* Zone 3: App Install & Kakao User Profile / Login Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onOpenMobileInstall && (
            <button
              onClick={onOpenMobileInstall}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              title="스마트폰 홈화면 앱 설치"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="hidden sm:inline">앱 설치</span>
            </button>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-900 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                title="카카오 로그인 프로필 확인"
              >
                {/* Official Kakao Yellow Bubble Logo Icon */}
                <div className="w-5 h-5 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
                  </svg>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[70px] sm:max-w-[100px]">
                    {currentUser.nickname}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                    {getDeviceIcon()}
                    <span>{currentUser.device.name.split(' ')[0]}</span>
                  </span>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 mb-2.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-[#FEE500] text-[#191919] flex items-center justify-center font-bold text-xs shadow-2xs">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                          <span>{currentUser.nickname}</span>
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-200 px-1 rounded">
                            {currentUser.roleLabel.split('·')[0]}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          카카오톡 로그인 접속 중
                        </div>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-amber-200/60 text-[11px] text-slate-600 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">접속 기기:</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          {getDeviceIcon()}
                          {currentUser.device.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">가계부 권한:</span>
                        <span className="font-semibold text-indigo-700">
                          {currentUser.role === 'HYUNWOO' || currentUser.role === 'SEHYUN' ? '관리자 권한 활성화' : '열람 전용'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {onOpenLogin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenLogin();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>계정 전환 / 다시 로그인</span>
                      </button>
                    )}
                    {onLogout && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>로그아웃</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] font-black text-xs sm:text-sm rounded-xl border border-yellow-400 shadow-xs hover:shadow transition-all cursor-pointer"
              title="카카오톡으로 로그인하여 접속자 확인 및 입장"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
              </svg>
              <span>카카오 로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
