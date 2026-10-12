import React from 'react';
import { Compass, Users, Share2, Wallet, CheckSquare, Calendar, Sparkles, Smartphone } from 'lucide-react';
import { FriendCompanion } from '../types/travel';

interface HeaderProps {
  activeTab: 'timeline' | 'map' | 'budget' | 'checklist';
  onSelectTab: (tab: 'timeline' | 'map' | 'budget' | 'checklist') => void;
  onOpenShare: () => void;
  onOpenCollab: () => void;
  onGoHome: () => void;
  onOpenMobileInstall?: () => void;
  companions: FriendCompanion[];
  unreadCommentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenShare,
  onOpenCollab,
  onGoHome,
  onOpenMobileInstall,
  companions,
  unreadCommentCount
}) => {
  const onlineCount = companions.filter((c) => c.isOnline).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Clickable to return to Landing Page) */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity cursor-pointer group"
          title="첫 페이지(소개)로 이동"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:rotate-6 group-hover:scale-105 transition-transform text-xl">
            ⚡
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 whitespace-nowrap font-sans">
                개구쟁이들의 일본여행
              </span>
              <span className="hidden sm:inline-block text-[10px] font-black text-amber-900 bg-amber-300 border border-black rounded-md px-1.5 py-0.5 shadow-[1px_1px_0px_#000]">
                첫페이지 🏠
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">
              🔥 우당탕탕 도쿄 5박 6일 원정대 (1.13 ~ 1.18)
            </span>
          </div>
        </button>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
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

        {/* Zone 3: 1 Primary Action + Live Friends Presence */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live companion presence pill */}
          <button
            onClick={onOpenCollab}
            title="실시간 접속 중인 친구 및 코멘트"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 transition-colors text-xs text-slate-700 whitespace-nowrap shrink-0"
          >
            <div className="flex -space-x-1.5 overflow-hidden">
              {companions.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  className={`inline-block h-5 w-5 rounded-full ring-2 ring-white text-white font-bold text-[9px] flex items-center justify-center ${comp.avatarColor}`}
                >
                  {comp.name[0]}
                </div>
              ))}
            </div>
            <span className="hidden sm:inline font-medium text-slate-600">
              {onlineCount}명 참여 중
            </span>
            {unreadCommentCount > 0 && (
              <span className="bg-rose-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                {unreadCommentCount}
              </span>
            )}
          </button>

          {/* Mobile App Install & ZIP Package Button */}
          {onOpenMobileInstall && (
            <button
              onClick={onOpenMobileInstall}
              title="스마트폰 홈화면 앱 설치 & 전달용 ZIP 압축파일 다운로드"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-amber-400 hover:bg-amber-300 font-black text-xs text-black shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Smartphone className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">📱 앱 설치 / ZIP</span>
              <span className="sm:hidden">앱 설치</span>
            </button>
          )}

          {/* Primary Share Action */}
          <button
            onClick={onOpenShare}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all rounded-lg shadow-sm shadow-indigo-200 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Share2 className="w-4 h-4" />
            <span>친구와 실시간 공유</span>
          </button>
        </div>
      </div>
    </header>
  );
};
