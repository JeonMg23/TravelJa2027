import React, { useEffect } from 'react';
import { TravelSpot, TripDay, TransitInfo, DayWeather, RecommendedFood } from '../types/travel';
import { WeatherWidget } from './WeatherWidget';
import { ScheduleThemeId, SCHEDULE_THEMES } from '../data/scheduleThemes';
import {
  MapPin,
  Star,
  Clock,
  Utensils,
  Lightbulb,
  ArrowDown,
  ArrowUp,
  Trash2,
  ExternalLink,
  Heart,
  Plus,
  Compass,
  Footprints,
  Train,
  TramFront,
  Bus,
  CheckCircle2,
  Check,
  Coins,
  ShieldCheck
} from 'lucide-react';

interface TimelineViewProps {
  currentDay: TripDay;
  selectedSpot: TravelSpot | null;
  onSelectSpot: (spot: TravelSpot) => void;
  onToggleLike: (spotId: string) => void;
  onMoveSpot: (dayNumber: number, spotIndex: number, direction: 'up' | 'down') => void;
  onDeleteSpot: (dayNumber: number, spotId: string) => void;
  onOpenAddSpot: () => void;
  onOpenDetailModal: (spot: TravelSpot) => void;
  onAddFoodToRoute: (dayNumber: number, parentSpot: TravelSpot, food: RecommendedFood) => void;
  currentWeather: DayWeather;
  isLiveWeather: boolean;
  onRefreshWeather: () => void;
  onSaveOwmKey: (key: string) => void;
  savedOwmKey: string;
  onToggleSimulatedRain: (isRain: boolean) => void;
  isSimulatedRain: boolean;
  isSplitView?: boolean;
  onSpotInView?: (spot: TravelSpot) => void;
  onOpenSpotMap?: (spot: TravelSpot) => void;
  scheduleThemeId?: ScheduleThemeId;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  currentDay,
  selectedSpot,
  onSelectSpot,
  onToggleLike,
  onMoveSpot,
  onDeleteSpot,
  onOpenAddSpot,
  onOpenDetailModal,
  onAddFoodToRoute,
  currentWeather,
  isLiveWeather,
  onRefreshWeather,
  onSaveOwmKey,
  savedOwmKey,
  onToggleSimulatedRain,
  isSimulatedRain,
  isSplitView = false,
  onSpotInView,
  onOpenSpotMap,
  scheduleThemeId = 'classic-light'
}) => {
  const theme = SCHEDULE_THEMES[scheduleThemeId] || SCHEDULE_THEMES['classic-light'];
  const isDark = theme.isDark;

  // Track which spot card is currently active in the mobile viewport
  useEffect(() => {
    if (!onSpotInView || !currentDay?.spots || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const spotId = entry.target.getAttribute('data-spot-id');
            if (spotId) {
              const spot = currentDay.spots.find((s) => s.id === spotId);
              if (spot) {
                onSpotInView(spot);
              }
            }
          }
        }
      },
      {
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0.1, 0.4]
      }
    );

    currentDay.spots.forEach((spot) => {
      const el = document.getElementById(`spot-card-${spot.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [currentDay?.spots, onSpotInView]);

  const getTransitIcon = (method: TransitInfo['method']) => {
    switch (method) {
      case 'walk':
        return <Footprints className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />;
      case 'train':
        return <Train className={`w-3.5 h-3.5 ${isDark ? 'text-sky-300' : 'text-indigo-600'}`} />;
      case 'subway':
        return <TramFront className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-300' : 'text-blue-600'}`} />;
      case 'bus':
        return <Bus className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />;
      default:
        return <Train className={`w-3.5 h-3.5 ${isDark ? 'text-sky-300' : 'text-indigo-600'}`} />;
    }
  };

  return (
    <div className="space-y-3">
      {isSplitView ? (
        /* Compact Header in Split View so Spots start near the top */
        <div
          className={`rounded-2xl border p-3 shadow-2xs flex items-center justify-between gap-2 text-xs transition-colors duration-300 ${theme.cardBg} ${theme.cardBorder}`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md shrink-0 ${theme.accentBadge}`}>
              DAY {currentDay.dayNumber}
            </span>
            <span className={`font-bold truncate ${theme.textPrimary}`}>
              {currentDay.theme}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 shrink-0 font-semibold text-[11px] font-mono ${theme.textMuted}`}>
            <span>{currentWeather.tempDay}°C</span>
            <span>·</span>
            <span>{currentDay.spots.length}개 거점</span>
          </div>
        </div>
      ) : (
        <>
          {/* Tokyo Day Weather Forecast & Rain Alert (OpenWeatherMap) */}
          <WeatherWidget
            weather={currentWeather}
            isLive={isLiveWeather}
            onRefresh={onRefreshWeather}
            onSaveApiKey={onSaveOwmKey}
            savedApiKey={savedOwmKey}
            onToggleSimulatedRain={onToggleSimulatedRain}
            isSimulatedRain={isSimulatedRain}
            scheduleThemeId={scheduleThemeId}
          />

          {/* Day Theme Banner */}
          <div
            className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 ${theme.cardBg} ${theme.cardBorder}`}
          >
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${theme.dividerBorder}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${theme.accentBadge}`}>
                    DAY {currentDay.dayNumber}
                  </span>
                  <span className={`text-xs font-medium ${theme.textMuted}`}>
                    {currentDay.fullDate}
                  </span>
                </div>
                <h2 className={`text-lg font-bold mt-1 ${theme.textPrimary}`}>
                  {currentDay.theme}
                </h2>
              </div>
              <div className={`text-xs flex items-center gap-1.5 shrink-0 ${theme.textMuted}`}>
                <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>최적화된 당일 추천 동선</span>
              </div>
            </div>
            <p className={`text-xs sm:text-sm mt-3 leading-relaxed ${theme.textSecondary}`}>
              {currentDay.description}
            </p>
          </div>
        </>
      )}

      {/* Spot Timeline Items */}
      <div className="space-y-3">
        {currentDay.spots.map((spot, index) => {
          const isSelected = selectedSpot?.id === spot.id;
          const correspondingTransit = currentDay.transits.find(
            (t) => t.fromSpotId === spot.id
          );

          return (
            <React.Fragment key={spot.id}>
              {/* Spot Card */}
              <div
                id={`spot-card-${spot.id}`}
                data-spot-id={spot.id}
                onClick={() => onSelectSpot(spot)}
                className={`rounded-2xl border transition-all duration-200 cursor-pointer relative scroll-mt-24 md:scroll-mt-28 w-full max-w-full overflow-hidden break-words ${
                  isSplitView ? 'p-2.5 sm:p-3.5 md:p-5' : 'p-4 sm:p-5'
                } ${
                  isSelected
                    ? theme.cardSelected
                    : `${theme.cardBg} ${theme.cardBorder} ${theme.cardHover}`
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Index Pin */}
                    <div
                      className={`w-8 h-8 rounded-xl font-bold text-sm font-mono flex items-center justify-center shrink-0 shadow-sm transition-all ${
                        isSelected ? theme.pinSelected : theme.pinDefault
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Spot Title & Category */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-base font-bold tracking-tight ${theme.textPrimary}`}>
                          {spot.name}
                        </h3>
                        {isSelected ? (
                          <span
                            className={`text-[10px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs ${theme.selectedPill}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.selectedPillDot}`}></span>
                            <span>선택된 일정 #{index + 1}</span>
                            {isSplitView ? (
                              <span className="text-[9px] font-extrabold text-slate-950 bg-amber-300 px-1.5 py-0.2 rounded shadow-2xs">
                                👉 옆 지도 동선 {index + 1}번
                              </span>
                            ) : onOpenSpotMap ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenSpotMap(spot);
                                }}
                                className="text-[10px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 px-1.5 py-0.2 rounded shadow-2xs cursor-pointer transition-colors"
                              >
                                동선 {index + 1}번 지도 보기 →
                              </button>
                            ) : null}
                          </span>
                        ) : isSplitView ? (
                          <span className={`text-[10px] font-semibold transition-colors ${theme.textMuted}`}>
                            클릭 시 옆에 동선 {index + 1}번 지도 표시 →
                          </span>
                        ) : (
                          <span className={`text-[10px] font-semibold transition-colors ${theme.textMuted}`}>
                            클릭하여 {index + 1}번 일정 선택
                          </span>
                        )}
                        {spot.japaneseName && (
                          <span className={`text-xs font-normal ${theme.textMuted}`}>
                            {spot.japaneseName}
                          </span>
                        )}
                        {(spot.categoryLabel === '숙소 복귀' || spot.name.includes('숙소 복귀')) && (
                          <span
                            className={`text-[11px] font-black px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 border ${
                              isDark
                                ? 'text-amber-200 bg-amber-500/20 border-amber-400/40'
                                : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                            }`}
                          >
                            <span>🏨 오늘의 종착지 · 숙소 복귀</span>
                          </span>
                        )}
                        {(spot.categoryLabel === '숙소 출발' || spot.name.includes('오픈런 출발') || spot.name.includes('숙소 출발')) && (
                          <span
                            className={`text-[11px] font-black px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 border ${
                              isDark
                                ? 'text-sky-200 bg-sky-500/20 border-sky-400/40'
                                : 'text-sky-700 bg-sky-50 border-sky-200'
                            }`}
                          >
                            <span>
                              {spot.name.includes('디즈니') || spot.openStatus.includes('07:00')
                                ? '🌅 오전 07:00 도착 목표 · 디즈니씨 오픈런'
                                : spot.name.includes('해리포터') || spot.openStatus.includes('08:40')
                                ? '🧙 오전 08:40 도착 목표 · 해리포터 스튜디오'
                                : spot.name.includes('쓰키지') || spot.openStatus.includes('09:00') || spot.openStatus.includes('08:25')
                                ? '🐟 오전 09:00 도착 목표 · 쓰키지 장외시장'
                                : '🌅 오전 숙소 출발'}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Unboxed Metadata */}
                      <div className={`flex flex-wrap items-center gap-2 text-xs mt-1 ${theme.textMuted}`}>
                        <span className={`font-semibold ${theme.textSecondary}`}>
                          {spot.categoryLabel}
                        </span>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className={`flex items-center font-semibold font-mono ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                          {spot.rating.toFixed(1)}
                        </span>
                        {spot.openStatus && (
                          <>
                            <span aria-hidden="true" className="opacity-40">·</span>
                            <span className={`font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                              {spot.openStatus}
                            </span>
                          </>
                        )}
                        {spot.hours && (
                          <>
                            <span aria-hidden="true" className="opacity-40">·</span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 opacity-70" />
                              {spot.hours}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top-right Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(spot.id);
                      }}
                      title="좋아요 / 즐겨찾기"
                      className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                        spot.hasLiked
                          ? isDark
                            ? 'bg-rose-500/20 border-rose-400/50 text-rose-300 font-bold'
                            : 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                          : isDark
                          ? 'bg-white/5 border-white/15 text-slate-300 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          spot.hasLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span className="font-mono">{spot.likes || 0}</span>
                    </button>

                    {/* Move Up/Down Order */}
                    <div
                      className={`flex items-center border rounded-lg overflow-hidden ${
                        isDark
                          ? 'border-white/15 bg-white/5'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <button
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSpot(currentDay.dayNumber, index, 'up');
                        }}
                        title="순서 위로"
                        className={`p-1 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer ${
                          isDark
                            ? 'text-slate-300 hover:bg-white/10'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === currentDay.spots.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSpot(currentDay.dayNumber, index, 'down');
                        }}
                        title="순서 아래로"
                        className={`p-1 disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-l cursor-pointer ${
                          isDark
                            ? 'text-slate-300 hover:bg-white/10 border-white/15'
                            : 'text-slate-600 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`'${spot.name}' 장소를 일정에서 삭제하시겠습니까?`)) {
                          onDeleteSpot(currentDay.dayNumber, spot.id);
                        }
                      }}
                      title="장소 삭제"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isDark
                          ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/15'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spot Summary */}
                <div
                  className={`mt-3.5 text-xs sm:text-sm rounded-xl p-3 border ${theme.subCardBg} ${theme.subCardBorder} ${theme.textSecondary}`}
                >
                  <p className="leading-relaxed font-normal">{spot.summary}</p>
                </div>

                {/* Travel & Itinerary Tips */}
                {spot.tips && spot.tips.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${theme.textPrimary}`}>
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>추천 동선 & 여행 꿀팁</span>
                    </div>
                    <ul
                      className={`text-xs space-y-1 pl-4 list-disc ${theme.textSecondary} ${
                        isDark ? 'marker:text-amber-400' : 'marker:text-indigo-400'
                      }`}
                    >
                      {spot.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Foods / Restaurants */}
                {spot.recommendedFoods && spot.recommendedFoods.length > 0 && (
                  <div className={`mt-3 pt-3 border-t ${theme.dividerBorder}`}>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${theme.textPrimary}`}>
                        {spot.categoryLabel === '숙소 복귀' || spot.name.includes('숙소 복귀') ? (
                          <>
                            <span className="text-sm">🍺</span>
                            <span
                              className={`px-2 py-0.5 rounded-md border ${
                                isDark
                                  ? 'text-amber-200 bg-amber-500/20 border-amber-400/40'
                                  : 'text-amber-900 bg-amber-100/90 border-amber-300'
                              }`}
                            >
                              숙소 도착 후 시원한 밤맥주 & 선술집 추천 (도보 1~3분)
                            </span>
                          </>
                        ) : (
                          <>
                            <Utensils className="w-3.5 h-3.5 text-rose-400" />
                            <span>추천 맛집 & 대표 메뉴</span>
                          </>
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isDark
                            ? 'text-sky-200 bg-sky-500/15 border border-sky-400/30'
                            : 'text-blue-600 bg-blue-50'
                        }`}
                      >
                        <span>클릭 시 동선 추가 · 재클릭 시 삭제</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                      {spot.recommendedFoods.map((food, fIdx) => {
                        const isAdded = currentDay.spots.some(
                          (s) => s.name === food.name || (s.name.includes(food.name) && s.category === 'food')
                        );
                        const addedIndex = currentDay.spots.findIndex(
                          (s) => s.name === food.name || (s.name.includes(food.name) && s.category === 'food')
                        );

                        return (
                          <div
                            key={fIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddFoodToRoute(currentDay.dayNumber, spot, food);
                            }}
                            className={`group relative rounded-xl p-3 text-xs transition-all duration-200 cursor-pointer border ${
                              isAdded ? theme.foodCardAdded : theme.foodCardDefault
                            }`}
                            title={
                              isAdded
                                ? `'${food.name}'은(는) 이미 동선에 포함되어 있습니다 (정류장 #${addedIndex + 1}). 다시 클릭하면 동선에서 삭제됩니다.`
                                : `클릭하여 '${food.name}'을(를) 구글 동선 경로에 추가합니다`
                            }
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className={`font-bold transition-colors flex items-center gap-1.5 flex-wrap ${theme.textPrimary}`}
                              >
                                <span>{food.name}</span>
                                {(food.name.includes('선술집') || food.name.includes('이자카야') || food.name.includes('주점') || food.menu.includes('생맥주')) && (
                                  <span className="text-[10px] text-amber-950 font-extrabold bg-amber-300 px-1.5 py-0.5 rounded border border-amber-400 flex items-center gap-0.5 shadow-2xs">
                                    🍺 밤맥주 선술집
                                  </span>
                                )}
                                {food.rating && (
                                  <span
                                    className={`text-[10px] font-extrabold font-mono px-1.5 py-0.5 rounded border ${
                                      isDark
                                        ? 'text-amber-300 bg-amber-400/15 border-amber-400/35'
                                        : 'text-amber-700 bg-amber-50 border-amber-300'
                                    }`}
                                  >
                                    ★{food.rating.toFixed(1)}
                                  </span>
                                )}
                                {food.priceRange && (
                                  <span
                                    className={`text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded border ${
                                      isDark
                                        ? 'text-emerald-300 bg-emerald-500/15 border-emerald-400/35'
                                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                    }`}
                                  >
                                    {food.priceRange}
                                  </span>
                                )}
                              </div>
                              {isAdded ? (
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-bold border px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                                    isDark
                                      ? 'text-rose-200 bg-rose-500/20 border-rose-400/40'
                                      : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                                  }`}
                                >
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>동선 #{addedIndex + 1} (삭제)</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors shrink-0 shadow-2xs ${theme.foodAddBtn}`}
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>동선 추가</span>
                                </button>
                              )}
                            </div>

                            <div className="text-[11px] mt-1.5 flex items-start gap-1">
                              <span className={`font-semibold shrink-0 ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>
                                메뉴:
                              </span>
                              <span className={`font-medium ${theme.textSecondary}`}>{food.menu}</span>
                            </div>

                            {food.desc && (
                              <div className={`text-[10px] mt-1 leading-relaxed ${theme.textMuted}`}>
                                {food.desc}
                              </div>
                            )}

                            <div
                              className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] ${theme.dividerBorder} ${theme.textMuted}`}
                            >
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 opacity-75" />
                                <span>좌표 연동</span>
                              </span>
                              <span
                                className={
                                  isAdded
                                    ? isDark
                                      ? 'text-rose-300 font-semibold group-hover:underline'
                                      : 'text-rose-600 font-semibold group-hover:underline'
                                    : isDark
                                    ? `${theme.accentText} font-semibold group-hover:underline`
                                    : 'text-blue-600 font-medium group-hover:underline'
                                }
                              >
                                {isAdded ? '✕ 클릭 시 동선에서 삭제' : '+ 구글 동선경로 추가'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Card Bottom Toolbar */}
                <div
                  className={`mt-4 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${theme.dividerBorder}`}
                >
                  <div className={`text-[11px] flex items-center gap-1 ${theme.textMuted}`}>
                    <MapPin className="w-3 h-3 opacity-75" />
                    <span>{spot.address || '도쿄도 내 위치'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {!isSplitView && onOpenSpotMap && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSpotMap(spot);
                        }}
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer"
                      >
                        <Compass className="w-3 h-3" />
                        <span>동선 {index + 1}번 지도</span>
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        (spot.japaneseName ? `${spot.name} ${spot.japaneseName}` : spot.name) + ' Tokyo'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-semibold transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
                        isDark
                          ? 'text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border-white/15'
                          : 'text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border-slate-200'
                      }`}
                    >
                      <svg className={`w-3 h-3 ${isDark ? theme.accentText : 'text-indigo-600'}`} viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"
                        />
                      </svg>
                      <span>구글 지도</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetailModal(spot);
                      }}
                      className={`text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                        isDark ? `${theme.accentText} hover:opacity-80` : 'text-indigo-600 hover:text-indigo-800'
                      }`}
                    >
                      <span>상세 정보 및 메모</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Transit Connector between spots */}
              {correspondingTransit && (
                <div
                  onClick={() => onSelectSpot(spot)}
                  className={`px-3.5 sm:px-4 py-3 rounded-2xl border transition-all text-xs my-1 shadow-2xs w-full max-w-full overflow-hidden break-words cursor-pointer ${
                    correspondingTransit.isReturnToHotel
                      ? theme.transitHotelBg
                      : theme.transitDefaultBg
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
                        correspondingTransit.isReturnToHotel
                          ? theme.transitHotelIconBox
                          : theme.transitIconBox
                      }`}
                    >
                      {correspondingTransit.isReturnToHotel ? (
                        <span className="text-sm">🏨</span>
                      ) : (
                        getTransitIcon(correspondingTransit.method)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top Badges & Route Title */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {correspondingTransit.isReturnToHotel ? (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs ${
                              isDark
                                ? 'bg-amber-400 text-slate-950'
                                : 'text-white bg-indigo-600'
                            }`}
                          >
                            🏨 숙소 복귀 교통편
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                              isDark
                                ? 'text-sky-200 bg-sky-500/20 border border-sky-400/30'
                                : 'text-blue-700 bg-blue-100/90'
                            }`}
                          >
                            대중교통 이동
                          </span>
                        )}

                        <span className={`font-bold text-xs sm:text-[13px] tracking-tight ${theme.textPrimary}`}>
                          {correspondingTransit.routeName}
                        </span>

                        <span className={`font-black text-xs font-mono ${isDark ? theme.accentText : 'text-indigo-600'}`}>
                          약 {correspondingTransit.durationMinutes}분 소요
                        </span>

                        {correspondingTransit.transferCount === 0 ? (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              isDark
                                ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-400/30'
                                : 'text-emerald-700 bg-emerald-100/80'
                            }`}
                          >
                            환승 0회 직통
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              isDark
                                ? 'text-slate-300 bg-white/10'
                                : 'text-slate-600 bg-slate-200/80'
                            }`}
                          >
                            환승 {correspondingTransit.transferCount}회
                          </span>
                        )}
                      </div>

                      {/* Detailed Route Steps if available */}
                      {correspondingTransit.detailedRoute && (
                        <div
                          className={`text-[11px] font-medium mt-1.5 flex items-center gap-1.5 backdrop-blur-xs px-2.5 py-1 rounded-lg border ${theme.transitRoutePill}`}
                        >
                          <Compass className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                          <span className="truncate">{correspondingTransit.detailedRoute}</span>
                        </div>
                      )}

                      {/* Transit Tip */}
                      <div className={`text-[11px] mt-1 leading-relaxed ${theme.textSecondary}`}>
                        {correspondingTransit.transitTip}
                      </div>

                      {/* Bottom Info Bar: Fare / Price & Pass recommendation */}
                      <div
                        className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${theme.dividerBorder}`}
                      >
                        {/* Public Transit Fare / Price */}
                        <div className="flex items-center gap-1.5 font-bold font-mono">
                          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {correspondingTransit.fareJPY !== undefined ? (
                            correspondingTransit.fareJPY === 0 ? (
                              <span
                                className={`font-extrabold px-2 py-0.5 rounded border ${
                                  isDark
                                    ? 'text-emerald-300 bg-emerald-500/15 border-emerald-400/30'
                                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                }`}
                              >
                                요금 무료 (투어 포함)
                              </span>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded border ${
                                  isDark
                                    ? 'bg-amber-400/15 text-amber-200 border-amber-400/35'
                                    : 'bg-amber-50/80 text-amber-900 border-amber-200/70'
                                }`}
                              >
                                교통비:{' '}
                                <span className={`font-black ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                                  ¥{correspondingTransit.fareJPY.toLocaleString()}
                                </span>
                                {correspondingTransit.fareKRW ? (
                                  <span className={`text-[10px] ml-1 ${theme.textMuted}`}>
                                    (약 {correspondingTransit.fareKRW.toLocaleString()}원)
                                  </span>
                                ) : null}
                              </span>
                            )
                          ) : (
                            <span className={theme.textMuted}>교통카드(Suica) 기본요금</span>
                          )}
                        </div>

                        {/* Pass / Payment Tip */}
                        {correspondingTransit.passRecommendation && (
                          <div
                            className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded border ${
                              isDark
                                ? 'bg-black/40 border-white/15 text-slate-300'
                                : 'bg-white/80 border-slate-200/80 text-slate-500'
                            }`}
                          >
                            <ShieldCheck className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            <span>{correspondingTransit.passRecommendation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Add Spot Button */}
      <button
        onClick={onOpenAddSpot}
        className={`w-full py-3.5 px-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2 text-sm font-semibold group cursor-pointer ${theme.addSpotBtn}`}
      >
        <Plus className="w-4 h-4 transition-colors" />
        <span>Day {currentDay.dayNumber}에 새로운 방문 장소 추가</span>
      </button>
    </div>
  );
};
