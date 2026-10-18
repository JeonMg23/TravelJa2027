import React, { useState } from 'react';
import {
  ScheduleThemeId,
  SCHEDULE_THEMES,
  SCHEDULE_THEME_LIST
} from '../data/scheduleThemes';
import { Palette, Sparkles, Check, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface ScheduleThemeSwitcherProps {
  currentThemeId: ScheduleThemeId;
  onSelectTheme: (themeId: ScheduleThemeId) => void;
  viewMode?: 'timeline' | 'map' | 'split';
}

export const ScheduleThemeSwitcher: React.FC<ScheduleThemeSwitcherProps> = ({
  currentThemeId,
  onSelectTheme,
  viewMode = 'timeline'
}) => {
  // In Map view, default to collapsed so the map stays front-and-center
  const [isExpanded, setIsExpanded] = useState<boolean>(() => viewMode !== 'map');
  const currentTheme = SCHEDULE_THEMES[currentThemeId];
  const isDark = currentTheme.isDark;

  // Auto-collapse when switching to Map view to give the map center stage
  React.useEffect(() => {
    if (viewMode === 'map') {
      setIsExpanded(false);
    }
  }, [viewMode]);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        viewMode === 'map' ? 'p-2 sm:p-2.5 mb-2' : 'p-2.5 sm:p-3 mb-2.5 sm:mb-3.5'
      } ${
        isDark
          ? 'bg-black/45 backdrop-blur-2xl border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
          : 'bg-white border-indigo-200/90 shadow-xs'
      }`}
    >
      {/* Top Row: Title + Current Theme Indicator + Reset to Original Button + Collapse Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              isDark
                ? 'bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-cyan-400/20 border border-white/20 text-amber-300'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
            }`}
          >
            <Palette className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-xs sm:text-sm font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                일정 페이지 디자인 테마 선택
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                현재: {currentTheme.shortName}
              </span>
            </div>
            <p
              className={`text-[11px] truncate hidden sm:block ${
                isDark ? 'text-slate-300/80' : 'text-slate-500'
              }`}
            >
              인트로·첫 페이지 감성 다크 테마 4종과 지금 기본 스타일 중 마음에 드는 디자인을 실시간으로 골라보세요!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {currentThemeId !== 'classic-light' && (
            <button
              type="button"
              onClick={() => onSelectTheme('classic-light')}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-white text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
              title="기존 밝은 라이트 스타일로 즉시 되돌리기"
            >
              <RotateCcw className="w-3 h-3 text-indigo-600" />
              <span>지금 기본 스타일로</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-2 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/15'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <span>{isExpanded ? '테마 접기' : '테마 5종 비교'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable 5 Theme Cards Strip */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {SCHEDULE_THEME_LIST.map((theme) => {
            const isSelected = theme.id === currentThemeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme.id)}
                className={`group relative rounded-xl p-2 sm:p-2.5 text-left transition-all duration-200 cursor-pointer border overflow-hidden flex flex-col justify-between min-h-[66px] ${
                  isSelected
                    ? isDark
                      ? 'bg-white/15 border-amber-300 ring-2 ring-amber-400/40 shadow-[0_0_20px_rgba(250,204,21,0.25)]'
                      : 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-500/30 shadow-sm'
                    : isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.09] border-white/15 hover:border-white/30'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Mini Color Swatch Bar */}
                <div className="flex items-center justify-between gap-1.5 w-full mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${theme.previewGradient} border ${theme.previewBorder} shrink-0 shadow-2xs`}
                    />
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                        theme.id === 'classic-light'
                          ? isDark
                            ? 'bg-white text-slate-900'
                            : 'bg-slate-200 text-slate-800'
                          : isDark
                          ? 'bg-white/10 text-amber-200'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {theme.badgeText}
                    </span>
                  </div>
                  {isSelected && (
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        isDark
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div>
                  <div
                    className={`text-xs font-extrabold truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {theme.shortName}
                  </div>
                  <div
                    className={`text-[10px] line-clamp-1 mt-0.5 ${
                      isDark ? 'text-slate-300/80' : 'text-slate-500'
                    }`}
                  >
                    {theme.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ScheduleAmbientBackdrop: React.FC<{ themeId: ScheduleThemeId }> = ({
  themeId
}) => {
  if (themeId === 'classic-light') return null;

  if (themeId === 'intro-thunder') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep obsidian radial atmosphere */}
        <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full bg-amber-500/12 blur-[130px]" />
        <div className="absolute top-1/3 -right-24 w-[460px] h-[460px] rounded-full bg-sky-500/12 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />
        {/* Subtle Intro Lightning Watermark in top-right */}
        <svg
          className="absolute top-16 right-4 sm:right-12 w-64 h-64 sm:w-96 sm:h-96 opacity-[0.045] text-amber-400"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path d="M 292 60 L 140 270 L 256 270 L 190 460 L 372 230 L 262 230 L 325 60 Z" />
        </svg>
      </div>
    );
  }

  if (themeId === 'tokyo-night-glass') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Tokyo Tower Soft Pale Lime & Mint Glass Atmosphere (Calm and gentle) */}
        <div className="absolute -top-24 right-1/4 w-[550px] h-[550px] rounded-full bg-lime-400/8 blur-[150px]" />
        <div className="absolute top-1/2 -left-24 w-[500px] h-[500px] rounded-full bg-emerald-300/7 blur-[140px]" />
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[450px] rounded-full bg-teal-400/7 blur-[150px]" />
      </div>
    );
  }

  if (themeId === 'cyber-akiba') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Cyber Akihabara Cyan & Fuchsia Neon Glow */}
        <div className="absolute -top-28 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-fuchsia-500/15 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #ec4899 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>
    );
  }

  if (themeId === 'sakura-editorial') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Sakura Night Rose Gold & Warm Champagne Bokeh */}
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] rounded-full bg-pink-500/14 blur-[140px]" />
        <div className="absolute top-1/2 right-10 w-[460px] h-[460px] rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[520px] h-[420px] rounded-full bg-rose-500/12 blur-[140px]" />
      </div>
    );
  }

  return null;
};
