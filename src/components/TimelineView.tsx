import React from 'react';
import { TravelSpot, TripDay, TransitInfo, DayWeather, RecommendedFood } from '../types/travel';
import { WeatherWidget } from './WeatherWidget';
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
  isSimulatedRain
}) => {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'hotel':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'park':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'temple':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'observatory':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'amusement':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'station':
        return 'text-slate-700 bg-slate-100 border-slate-200';
      case 'market':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'nature':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'shopping':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'food':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getTransitIcon = (method: TransitInfo['method']) => {
    switch (method) {
      case 'walk':
        return <Footprints className="w-3.5 h-3.5 text-emerald-600" />;
      case 'train':
        return <Train className="w-3.5 h-3.5 text-indigo-600" />;
      case 'subway':
        return <TramFront className="w-3.5 h-3.5 text-blue-600" />;
      case 'bus':
        return <Bus className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Train className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tokyo Day Weather Forecast & Rain Alert (OpenWeatherMap) */}
      <WeatherWidget
        weather={currentWeather}
        isLive={isLiveWeather}
        onRefresh={onRefreshWeather}
        onSaveApiKey={onSaveOwmKey}
        savedApiKey={savedOwmKey}
        onToggleSimulatedRain={onToggleSimulatedRain}
        isSimulatedRain={isSimulatedRain}
      />

      {/* Day Theme Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                DAY {currentDay.dayNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentDay.fullDate}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {currentDay.theme}
            </h2>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>최적화된 당일 추천 동선</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
          {currentDay.description}
        </p>
      </div>

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
                onClick={() => onSelectSpot(spot)}
                className={`bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 cursor-pointer relative ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Index Pin */}
                    <div
                      className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Spot Title & Category */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {spot.name}
                        </h3>
                        {spot.japaneseName && (
                          <span className="text-xs text-slate-400 font-normal">
                            {spot.japaneseName}
                          </span>
                        )}
                        {(spot.categoryLabel === '숙소 복귀' || spot.name.includes('숙소 복귀')) && (
                          <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                            <span>🏨 오늘의 종착지 · 숙소 복귀</span>
                          </span>
                        )}
                        {(spot.categoryLabel === '숙소 출발' || spot.name.includes('오픈런 출발') || spot.name.includes('숙소 출발')) && (
                          <span className="text-[11px] font-black text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
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

                      {/* Unboxed Metadata (Rule: No pill enclosures, clean typographic separators) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">
                          {spot.categoryLabel}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                          {spot.rating.toFixed(1)}
                        </span>
                        {spot.openStatus && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="text-emerald-700 font-medium">
                              {spot.openStatus}
                            </span>
                          </>
                        )}
                        {spot.hours && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
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
                      className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                        spot.hasLiked
                          ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          spot.hasLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>{spot.likes || 0}</span>
                    </button>

                    {/* Move Up/Down Order */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSpot(currentDay.dayNumber, index, 'up');
                        }}
                        title="순서 위로"
                        className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600"
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
                        className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 border-l border-slate-200"
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spot Summary */}
                <div className="mt-3.5 text-xs sm:text-sm text-slate-700 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                  <p className="leading-relaxed font-normal">{spot.summary}</p>
                </div>

                {/* Travel & Itinerary Tips */}
                {spot.tips && spot.tips.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>추천 동선 & 여행 꿀팁</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc marker:text-indigo-400">
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
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        {spot.categoryLabel === '숙소 복귀' || spot.name.includes('숙소 복귀') ? (
                          <>
                            <span className="text-sm">🍺</span>
                            <span className="text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md">
                              숙소 도착 후 시원한 밤맥주 & 선술집 추천 (도보 1~3분)
                            </span>
                          </>
                        ) : (
                          <>
                            <Utensils className="w-3.5 h-3.5 text-rose-500" />
                            <span>추천 맛집 & 대표 메뉴</span>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
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
                              isAdded
                                ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/30 hover:border-rose-400 shadow-xs'
                                : 'bg-slate-50 border-slate-200/90 hover:bg-blue-50/50 hover:border-blue-300 hover:shadow-xs'
                            }`}
                            title={
                              isAdded
                                ? `'${food.name}'은(는) 이미 동선에 포함되어 있습니다 (정류장 #${addedIndex + 1}). 다시 클릭하면 동선에서 삭제됩니다.`
                                : `클릭하여 '${food.name}'을(를) 구글 동선 경로에 추가합니다`
                            }
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors flex items-center gap-1.5 flex-wrap">
                                <span>{food.name}</span>
                                {(food.name.includes('선술집') || food.name.includes('이자카야') || food.name.includes('주점') || food.menu.includes('생맥주')) && (
                                  <span className="text-[10px] text-amber-900 font-extrabold bg-amber-200/90 px-1.5 py-0.5 rounded border border-amber-400 flex items-center gap-0.5 shadow-2xs">
                                    🍺 밤맥주 선술집
                                  </span>
                                )}
                                {food.rating && (
                                  <span className="text-[10px] text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                                    ★{food.rating.toFixed(1)}
                                  </span>
                                )}
                                {food.priceRange && (
                                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {food.priceRange}
                                  </span>
                                )}
                              </div>
                              {isAdded ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md shrink-0 transition-colors">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>동선 #{addedIndex + 1} (삭제)</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-white group-hover:bg-blue-600 group-hover:text-white px-2 py-0.5 rounded-md border border-blue-200 transition-colors shrink-0 shadow-2xs"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>동선 추가</span>
                                </button>
                              )}
                            </div>

                            <div className="text-slate-700 text-[11px] mt-1.5 flex items-start gap-1">
                              <span className="text-rose-600 font-semibold shrink-0">메뉴:</span>
                              <span className="font-medium text-slate-700">{food.menu}</span>
                            </div>

                            {food.desc && (
                              <div className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                                {food.desc}
                              </div>
                            )}

                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>좌표 연동</span>
                              </span>
                              <span className={isAdded ? "text-rose-600 font-semibold group-hover:underline" : "text-blue-600 font-medium group-hover:underline"}>
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
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{spot.address || '도쿄도 내 위치'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        (spot.japaneseName ? `${spot.name} ${spot.japaneseName}` : spot.name) + ' Tokyo'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 bg-slate-50 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <svg className="w-3 h-3 text-indigo-600" viewBox="0 0 24 24">
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
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
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
                  className={`px-4 py-3 rounded-2xl border transition-all text-xs my-1 shadow-2xs ${
                    correspondingTransit.isReturnToHotel
                      ? 'bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-indigo-50/90 border-indigo-300 ring-1 ring-indigo-200'
                      : 'bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border-blue-200/90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${
                        correspondingTransit.isReturnToHotel
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white border-blue-200 text-blue-600'
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
                          <span className="text-[10px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-full shadow-2xs">
                            🏨 숙소 복귀 교통편
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded-md">
                            대중교통 이동
                          </span>
                        )}

                        <span className="font-bold text-slate-900 text-xs sm:text-[13px] tracking-tight">
                          {correspondingTransit.routeName}
                        </span>

                        <span className="text-indigo-600 font-black text-xs">
                          약 {correspondingTransit.durationMinutes}분 소요
                        </span>

                        {correspondingTransit.transferCount === 0 ? (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-bold">
                            환승 0회 직통
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-semibold">
                            환승 {correspondingTransit.transferCount}회
                          </span>
                        )}
                      </div>

                      {/* Detailed Route Steps if available */}
                      {correspondingTransit.detailedRoute && (
                        <div className="text-[11px] text-slate-700 font-medium mt-1.5 flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/60">
                          <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{correspondingTransit.detailedRoute}</span>
                        </div>
                      )}

                      {/* Transit Tip */}
                      <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {correspondingTransit.transitTip}
                      </div>

                      {/* Bottom Info Bar: Fare / Price & Pass recommendation */}
                      <div className="mt-2 pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        {/* Public Transit Fare / Price */}
                        <div className="flex items-center gap-1.5 font-bold">
                          <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          {correspondingTransit.fareJPY !== undefined ? (
                            correspondingTransit.fareJPY === 0 ? (
                              <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                요금 무료 (투어 포함)
                              </span>
                            ) : (
                              <span className="text-slate-800 bg-amber-50/80 text-amber-900 px-2 py-0.5 rounded border border-amber-200/70">
                                교통비: <span className="font-black text-amber-700">¥{correspondingTransit.fareJPY.toLocaleString()}</span>
                                {correspondingTransit.fareKRW ? (
                                  <span className="text-slate-500 text-[10px] ml-1">
                                    (약 {correspondingTransit.fareKRW.toLocaleString()}원)
                                  </span>
                                ) : null}
                              </span>
                            )
                          ) : (
                            <span className="text-slate-500">교통카드(Suica) 기본요금</span>
                          )}
                        </div>

                        {/* Pass / Payment Tip */}
                        {correspondingTransit.passRecommendation && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
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
        className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 group cursor-pointer"
      >
        <Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        <span>Day {currentDay.dayNumber}에 새로운 방문 장소 추가</span>
      </button>
    </div>
  );
};
