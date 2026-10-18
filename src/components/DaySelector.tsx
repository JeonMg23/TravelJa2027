import React from 'react';
import { TripDay } from '../types/travel';
import { Calendar, Layers } from 'lucide-react';
import { ScheduleThemeId, SCHEDULE_THEMES } from '../data/scheduleThemes';

interface DaySelectorProps {
  days: TripDay[];
  selectedDayNumber: number | null; // null = all days
  onSelectDay: (dayNumber: number | null) => void;
  onGoHome?: () => void;
  scheduleThemeId?: ScheduleThemeId;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  selectedDayNumber,
  onSelectDay,
  onGoHome,
  scheduleThemeId = 'classic-light'
}) => {
  const theme = SCHEDULE_THEMES[scheduleThemeId] || SCHEDULE_THEMES['classic-light'];
  const isDark = theme.isDark;

  return (
    <div className={`w-full max-w-full py-2.5 sm:py-3 px-3 sm:px-6 overflow-hidden transition-colors duration-300 relative z-10 ${theme.daySelectorBg}`}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${theme.daySelectorLabel}`}>
            <Calendar className={`w-3.5 h-3.5 ${isDark ? theme.accentText : 'text-indigo-600'}`} />
            <span>여행 일자 선택</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-xs hidden sm:inline ${theme.daySelectorSubtext}`}>
              총 6일 여정 · 15개 추천 거점
            </div>
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center gap-1.5 text-xs text-slate-900 bg-amber-300 hover:bg-amber-400 font-black px-2.5 py-1 rounded-lg border border-black shadow-[1.5px_1.5px_0_#000] transition-transform active:scale-95 cursor-pointer"
                title="첫 페이지(도쿄 원정대 2027)로 이동"
              >
                <div className="w-4 h-4 rounded-md bg-black/90 border border-yellow-400/60 p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(250,204,21,0.5)]">
                  <svg
                    className="w-full h-full drop-shadow-[0_0_6px_rgba(250,204,21,0.95)]"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="daySelYellowBoltGrad" x1="0%" y1="0%" x2="70%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#FEF08A" />
                        <stop offset="65%" stopColor="#FACC15" />
                        <stop offset="100%" stopColor="#EAB308" />
                      </linearGradient>
                      <filter id="daySelBoltFilter" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#FACC15" floodOpacity="0.9" />
                      </filter>
                    </defs>
                    <path
                      d="M 292 60 
                         L 140 270 
                         L 256 270 
                         L 190 460 
                         L 372 230 
                         L 262 230 
                         L 325 60 
                         Z"
                      fill="url(#daySelYellowBoltGrad)"
                      stroke="#FFFBEB"
                      strokeWidth="12"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter="url(#daySelBoltFilter)"
                    />
                  </svg>
                </div>
                <span>첫페이지</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable button pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {/* All Days button */}
          <button
            onClick={() => onSelectDay(null)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-left transition-all shrink-0 cursor-pointer min-h-[44px] ${
              selectedDayNumber === null
                ? theme.allDaysActive
                : theme.allDaysInactive
            }`}
          >
            <Layers
              className={`w-4 h-4 ${
                selectedDayNumber === null
                  ? isDark
                    ? 'text-current opacity-90'
                    : 'text-indigo-400'
                  : isDark
                  ? theme.accentText
                  : 'text-slate-400'
              }`}
            />
            <div>
              <div className="text-xs font-bold leading-tight whitespace-nowrap">전체 동선</div>
              <div
                className={`text-[10px] whitespace-nowrap ${
                  selectedDayNumber === null
                    ? 'opacity-80'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-slate-400'
                }`}
              >
                1.13 - 1.18 총괄
              </div>
            </div>
          </button>

          {/* Days buttons */}
          {days.map((day) => {
            const isSelected = selectedDayNumber === day.dayNumber;
            return (
              <button
                key={day.dayNumber}
                onClick={() => onSelectDay(day.dayNumber)}
                className={`flex flex-col justify-center px-4 py-2 rounded-xl border text-left transition-all shrink-0 cursor-pointer min-h-[48px] min-w-[130px] ${
                  isSelected ? theme.dayTabActive : theme.dayTabInactive
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span
                    className={`text-[11px] font-bold ${
                      isSelected ? theme.dayTabBadgeActive : theme.dayTabBadgeInactive
                    }`}
                  >
                    Day {day.dayNumber}
                  </span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? theme.dayTabDateActive : theme.dayTabDateInactive
                    }`}
                  >
                    {day.date}
                  </span>
                </div>
                <div className="text-xs font-semibold truncate max-w-[150px] mt-0.5">
                  {day.dayNumber === 1 && '아사쿠사·스카이트리'}
                  {day.dayNumber === 2 && '디즈니씨 종일'}
                  {day.dayNumber === 3 && '후지산 & 도쿄역'}
                  {day.dayNumber === 4 && '해리포터 & 신도심'}
                  {day.dayNumber === 5 && '쓰키지 & 롯폰기'}
                  {day.dayNumber === 6 && '귀국일'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
