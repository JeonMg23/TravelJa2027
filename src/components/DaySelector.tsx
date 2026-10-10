import React from 'react';
import { TripDay } from '../types/travel';
import { Calendar, Layers, MapPin, Home } from 'lucide-react';

interface DaySelectorProps {
  days: TripDay[];
  selectedDayNumber: number | null; // null = all days
  onSelectDay: (dayNumber: number | null) => void;
  onGoHome?: () => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  selectedDayNumber,
  onSelectDay,
  onGoHome
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200/90 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>여행 일자 선택</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 hidden sm:inline">
              총 6일 여정 · 15개 추천 거점
            </div>
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center gap-1.5 text-xs text-slate-800 bg-amber-300 hover:bg-amber-400 font-black px-2.5 py-1 rounded-lg border border-black shadow-[1px_1px_0_#000] transition-transform active:scale-95 cursor-pointer"
                title="첫 페이지(개구쟁이들의 일본여행 인트로)로 이동"
              >
                <span>⚡ 첫페이지</span>
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
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <Layers className={`w-4 h-4 ${selectedDayNumber === null ? 'text-indigo-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs font-bold leading-tight whitespace-nowrap">전체 동선</div>
              <div className={`text-[10px] whitespace-nowrap ${selectedDayNumber === null ? 'text-slate-300' : 'text-slate-400'}`}>
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
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-100' : 'text-indigo-600'}`}>
                    Day {day.dayNumber}
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {day.date}
                  </span>
                </div>
                <div className="text-xs font-semibold truncate max-w-[150px] mt-0.5">
                  {day.dayNumber === 1 && '아사쿠사·스카이트리'}
                  {day.dayNumber === 2 && '디즈니씨 종일'}
                  {day.dayNumber === 3 && '해리포터 & 신도심'}
                  {day.dayNumber === 4 && '후지산 & 도쿄역'}
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
