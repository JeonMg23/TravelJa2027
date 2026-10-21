import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  UtensilsCrossed,
  Search,
  MapPin,
  Sparkles,
  X,
  Heart,
  CheckCircle2,
  ExternalLink,
  Volume2,
  MessageSquareQuote,
  Store,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import {
  TOKYO_FOOD_CATEGORIES,
  TOKYO_FOOD_ITEMS,
  TokyoFoodCategoryId,
  TokyoFoodItem
} from '../data/tokyoFoodGuideData';
import { ScheduleThemeId, SCHEDULE_THEMES } from '../data/scheduleThemes';

const FOOD_WISHLIST_STORAGE_KEY = 'tokyo_trip_2027_food_wishlist_v1';
const FOOD_EATEN_STORAGE_KEY = 'tokyo_trip_2027_food_eaten_v1';

interface TokyoFoodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleThemeId: ScheduleThemeId;
  initialCategory?: TokyoFoodCategoryId;
  initialFoodId?: string | null;
  initialDayFilter?: number | 'ALL';
}

export const TokyoFoodGuideModal: React.FC<TokyoFoodGuideModalProps> = ({
  isOpen,
  onClose,
  scheduleThemeId,
  initialCategory = 'ALL',
  initialFoodId = null,
  initialDayFilter = 'ALL'
}) => {
  const theme = SCHEDULE_THEMES[scheduleThemeId] || SCHEDULE_THEMES['classic-light'];
  const [selectedCategory, setSelectedCategory] =
    useState<TokyoFoodCategoryId>(initialCategory);
  const [selectedDay, setSelectedDay] = useState<number | 'ALL' | 'WISHLIST'>(
    initialDayFilter
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedFoodId, setFocusedFoodId] = useState<string | null>(initialFoodId);
  const [selectedOrderCardItem, setSelectedOrderCardItem] =
    useState<TokyoFoodItem | null>(null);
  const [eggRequestMode, setEggRequestMode] = useState<'SEPARATE' | 'REMOVE'>('SEPARATE');
  const [showEggAllergyOnOrderCard, setShowEggAllergyOnOrderCard] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scrollBodyRef = useRef<HTMLDivElement | null>(null);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FOOD_WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['food_tonkotsu_ramen', 'food_gyukatsu', 'dessert_ichigo_daifuku', 'themepark_butterbeer'];
    } catch {
      return [];
    }
  });

  const [eatenIds, setEatenIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FOOD_EATEN_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialFoodId) {
        const targetFood = TOKYO_FOOD_ITEMS.find((item) => item.id === initialFoodId);
        setSelectedCategory(targetFood?.category || initialCategory);
        setSelectedDay('ALL');
        setSearchQuery('');
        setFocusedFoodId(initialFoodId);
      } else {
        setSelectedCategory(initialCategory);
        setFocusedFoodId(null);
      }

      // Scroll modal body to top so the selected food (placed at top & highlighted) is immediately visible
      setTimeout(() => {
        if (scrollBodyRef.current) {
          scrollBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (initialFoodId) {
          const el = document.getElementById(`tokyo-food-card-${initialFoodId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }, 60);
    }
  }, [isOpen, initialCategory, initialFoodId]);

  const handleOpenOrderCard = (item: TokyoFoodItem) => {
    setSelectedOrderCardItem(item);
    const hasEgg = Boolean(item.eggAllergyInfo?.hasDirectEgg);
    setShowEggAllergyOnOrderCard(hasEgg);
    setEggRequestMode(item.eggAllergyInfo?.defaultMode || 'SEPARATE');
  };

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(FOOD_WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const toggleEaten = (id: string) => {
    setEatenIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(FOOD_EATEN_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<TokyoFoodCategoryId, number> = {
      ALL: TOKYO_FOOD_ITEMS.length,
      MAIN_MEAL: 0,
      STREET_SNACK: 0,
      DESSERT_SWEETS: 0,
      THEME_PARK: 0,
      KONBINI: 0
    };
    TOKYO_FOOD_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    const baseList = TOKYO_FOOD_ITEMS.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedDay === 'WISHLIST' && !wishlistIds.includes(item.id)) {
        return false;
      }
      if (typeof selectedDay === 'number' && item.dayNumber !== selectedDay) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const hay = `${item.name} ${item.japaneseName} ${item.pronunciation} ${item.areaTag} ${item.famousShop} ${item.recommendBadge} ${item.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // If a specific food was clicked on the first page, place that clicked food right at the top so it's immediately visible!
    if (focusedFoodId) {
      const targetIdx = baseList.findIndex((item) => item.id === focusedFoodId);
      if (targetIdx > 0) {
        const targetItem = baseList[targetIdx];
        const rest = baseList.filter((_, idx) => idx !== targetIdx);
        return [targetItem, ...rest];
      }
    }

    return baseList;
  }, [selectedCategory, selectedDay, searchQuery, wishlistIds, focusedFoodId]);

  const activeCategoryMeta = useMemo(
    () =>
      TOKYO_FOOD_CATEGORIES.find((c) => c.id === selectedCategory) ||
      TOKYO_FOOD_CATEGORIES[0],
    [selectedCategory]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-6xl max-h-[94dvh] sm:max-h-[90dvh] rounded-t-3xl sm:rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-colors ${
          theme.isDark
            ? `${theme.cardBg} ${theme.cardBorder} text-white`
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-400/40 rounded-full mx-auto mt-2.5 shrink-0" />

        {/* Header */}
        <div
          className={`px-4 sm:px-6 py-4 border-b flex flex-col gap-3 shrink-0 ${
            theme.isDark ? theme.dividerBorder : 'border-slate-200'
          }`}
        >
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium opacity-80">
                <span>도쿄 원정대 미식 & 스위츠 가이드</span>
                <span aria-hidden="true">·</span>
                <span>실제 사진 기반 카테고리별 먹거리 도감</span>
                <span aria-hidden="true">·</span>
                <span>먹킷리스트 {wishlistIds.length}개 · 먹방 완료 {eatenIds.length}개</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight truncate mt-0.5 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                <span>도쿄 대표 음식 · 길거리 간식 · 디저트 총정리</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                theme.isDark
                  ? 'hover:bg-white/10 text-slate-300'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. Primary Food Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {TOKYO_FOOD_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id];
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setFocusedFoodId(null);
                  }}
                  className={`px-3.5 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs scale-[1.01]'
                      : theme.isDark
                      ? 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.shortLabel}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono tabular-nums font-black ${
                      isSelected
                        ? 'bg-slate-950 text-amber-300'
                        : theme.isDark
                        ? 'bg-white/10 text-slate-300'
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Secondary Day Filter + Search Input */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(
                [
                  { label: '전체 일정', value: 'ALL' as const },
                  { label: `먹킷리스트 (${wishlistIds.length})`, value: 'WISHLIST' as const },
                  { label: 'Day 1 아사쿠사', value: 1 },
                  { label: 'Day 2 디즈니씨', value: 2 },
                  { label: 'Day 3 후지산·도쿄역', value: 3 },
                  { label: 'Day 4 해리포터·시부야', value: 4 },
                  { label: 'Day 5 쓰키지·긴자', value: 5 }
                ] as const
              ).map((dayTab) => {
                const isDayActive = selectedDay === dayTab.value;
                return (
                  <button
                    key={String(dayTab.value)}
                    type="button"
                    onClick={() => setSelectedDay(dayTab.value)}
                    className={`px-2.5 py-1.5 min-h-[34px] rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      isDayActive
                        ? theme.isDark
                          ? 'bg-indigo-500 text-white font-bold'
                          : 'bg-slate-900 text-white font-bold'
                        : theme.isDark
                        ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dayTab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-64 shrink-0">
              <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="음식·디저트·지역 검색 (예: 라멘, 딸기)"
                className={`w-full h-9 pl-9 pr-7 rounded-xl border text-xs ${
                  theme.isDark
                    ? 'bg-black/30 border-white/15 text-white placeholder:text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          ref={scrollBodyRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain"
        >
          {/* Category Banner Info */}
          <div
            className={`rounded-2xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              theme.isDark
                ? 'bg-white/5 border-white/10'
                : 'bg-amber-50/70 border-amber-200/80'
            }`}
          >
            <div>
              <div className="text-sm sm:text-base font-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeCategoryMeta.label}</span>
              </div>
              <p className="text-xs opacity-80 mt-0.5">{activeCategoryMeta.subtitle}</p>
            </div>
            <div className="text-xs font-medium opacity-75 shrink-0">
              각 음식 카드의 <strong>‘일본어 주문 카드’</strong>를 누르면 식당 점원에게 바로 보여줄 수 있어요!
            </div>
          </div>

          {/* Food & Dessert Grid */}
          {filteredItems.length === 0 ? (
            <div
              className={`rounded-2xl border p-10 text-center space-y-2 ${
                theme.isDark
                  ? 'bg-white/5 border-white/10 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="text-base font-bold">
                해당 조건에 맞는 도쿄 먹거리 항목이 없습니다.
              </div>
              <div className="text-xs opacity-75">
                다른 카테고리 탭이나 일차 필터를 선택해 보세요.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredItems.map((item) => {
                const isWishlisted = wishlistIds.includes(item.id);
                const isEaten = eatenIds.includes(item.id);
                const imageFailed = Boolean(failedImages[item.id]);
                const isFocusedFromLanding = focusedFoodId === item.id;

                return (
                  <article
                    key={item.id}
                    id={`tokyo-food-card-${item.id}`}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                      isFocusedFromLanding
                        ? theme.isDark
                          ? 'ring-3 ring-amber-400 border-amber-400 bg-amber-950/25 shadow-[0_0_28px_rgba(250,204,21,0.35)]'
                          : 'ring-3 ring-amber-400 border-amber-400 bg-amber-50/40 shadow-[0_0_24px_rgba(250,204,21,0.35)]'
                        : isEaten
                        ? theme.isDark
                          ? 'bg-emerald-950/20 border-emerald-400/50'
                          : 'bg-emerald-50/40 border-emerald-300'
                        : theme.isDark
                        ? `${theme.subCardBg} ${theme.subCardBorder}`
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div>
                      {isFocusedFromLanding && (
                        <div className="px-3.5 py-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 text-xs font-black flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 shrink-0" />
                            <span>첫 페이지에서 선택한 대표 음식</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenOrderCard(item)}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-950 text-amber-300 text-[11px] font-black cursor-pointer hover:bg-slate-800"
                          >
                            일본어 주문 화면 바로 열기
                          </button>
                        </div>
                      )}
                      {/* Top Real Photo Frame (4:3 / 16:10 aspect) */}
                      <div
                        className={`relative h-52 sm:h-58 w-full overflow-hidden bg-gradient-to-br ${item.fallbackGradient}`}
                      >
                        {!imageFailed ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                            }
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                            <UtensilsCrossed className="w-10 h-10 text-amber-300 mb-2 opacity-90" />
                            <div className="text-base font-black">{item.name}</div>
                            <div className="text-xs opacity-80 mt-0.5">{item.japaneseName}</div>
                          </div>
                        )}

                        {/* Gradient Scrim for Top & Bottom Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

                        {/* Top-Left Category, Day & Rating Metadata */}
                        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[65%]">
                          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs font-black">
                            Day {item.dayNumber}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-amber-400/95 text-slate-950 text-xs font-black shadow-xs">
                            {item.ratingScore} · {item.recommendBadge}
                          </span>
                        </div>

                        {/* Top-Right Wishlist & Eaten Check Buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.id)}
                            className={`px-2.5 py-1.5 min-h-[36px] rounded-xl backdrop-blur-md border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              isWishlisted
                                ? 'bg-rose-500 text-white border-rose-300 shadow-md'
                                : 'bg-black/65 text-white border-white/20 hover:bg-black/80'
                            }`}
                            title="먹킷리스트(찜) 추가/해제"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isWishlisted ? 'fill-current' : ''
                              }`}
                            />
                            <span>{isWishlisted ? '찜 완료' : '찜하기'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleEaten(item.id)}
                            className={`px-2.5 py-1.5 min-h-[36px] rounded-xl backdrop-blur-md border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              isEaten
                                ? 'bg-emerald-500 text-white border-emerald-300 shadow-md'
                                : 'bg-black/65 text-white border-white/20 hover:bg-black/80'
                            }`}
                            title="먹방 완료 체크"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isEaten ? '먹방완료!' : '먹었어요'}</span>
                          </button>
                        </div>

                        {/* Bottom Photo Title & Price Overlay */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2 text-white">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-amber-300 truncate">
                              {item.japaneseName} · [{item.pronunciation}]
                            </div>
                            <h3 className="text-base sm:text-lg font-black leading-snug drop-shadow-sm">
                              {item.name}
                            </h3>
                          </div>
                          <div className="text-right shrink-0 font-mono tabular-nums bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/15">
                            <div className="text-xs sm:text-sm font-black text-amber-300">
                              {item.priceJpy}
                            </div>
                            <div className="text-[10px] text-slate-300">
                              {item.priceKrwApprox}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3">
                        {/* Area & Famous Restaurant Row */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium opacity-85">
                          <Store className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="font-bold">{item.famousShop}</span>
                          <span aria-hidden="true">·</span>
                          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{item.areaTag}</span>
                        </div>

                        {/* Summary Description */}
                        <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                          {item.summary}
                        </p>

                        {/* Taste Highlights */}
                        <div
                          className={`rounded-xl p-3 space-y-1.5 text-xs ${
                            theme.isDark
                              ? 'bg-black/25 border border-white/10'
                              : 'bg-slate-50 border border-slate-200/80'
                          }`}
                        >
                          <div className="font-bold text-amber-500 dark:text-amber-300">
                            맛 포인트 & 추천 이유
                          </div>
                          <ul className="space-y-1 opacity-90">
                            {item.tastePoints.map((pt, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Order Tip & Kid/Mom Score */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-start gap-1.5">
                            <MessageSquareQuote className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-sky-500 dark:text-sky-300">
                                현지 주문 팁:
                              </strong>{' '}
                              {item.orderTip}
                            </span>
                          </div>

                          {/* Hyunwoo Egg Allergy Caution Banner on Food Card */}
                          {item.eggAllergyInfo?.hasDirectEgg && (
                            <div
                              className={`mt-2 rounded-xl p-2.5 border text-xs space-y-1 ${
                                theme.isDark
                                  ? 'bg-rose-950/40 border-rose-400/50 text-rose-100'
                                  : 'bg-rose-50 border-rose-200 text-rose-900'
                              }`}
                            >
                              <div className="font-black flex items-center gap-1.5 text-rose-500 dark:text-rose-300">
                                <span>🥚 현우 계란 알레르기 체크:</span>
                                <span>{item.eggAllergyInfo.eggTypeLabel}</span>
                              </div>
                              <p className="text-[11px] leading-relaxed opacity-90">
                                {item.eggAllergyInfo.hyunwooTip}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold opacity-80">
                            <span className="text-blue-500 dark:text-blue-300">
                              {item.kidFavoriteScore}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-pink-500 dark:text-pink-300">
                              {item.momFavoriteScore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div
                      className={`px-4 py-3 border-t flex items-center justify-between gap-2 ${
                        theme.isDark
                          ? 'border-white/10 bg-white/[0.02]'
                          : 'border-slate-100 bg-slate-50/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenOrderCard(item)}
                        className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Volume2 className="w-4 h-4 shrink-0" />
                        <span>
                          {item.eggAllergyInfo?.hasDirectEgg
                            ? '일본어 주문 화면 크게 보기 (🥚계란문구 포함)'
                            : '일본어 주문 화면 크게 보기'}
                        </span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          item.googleMapsQuery
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`min-h-[40px] px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition-colors ${
                          theme.isDark
                            ? 'bg-white/10 border-white/15 text-white hover:bg-white/15'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>구글맵 맛집</span>
                        <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
            theme.isDark ? theme.dividerBorder : 'border-slate-200'
          }`}
        >
          <div className="text-xs opacity-75 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              도쿄 5박 6일 동선(아사쿠사·디즈니씨·후지산·시부야·쓰키지·긴자)에 맞춘 핵심 먹거리 16선입니다.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-bold cursor-pointer ${
              theme.isDark
                ? 'bg-white text-slate-900 hover:bg-slate-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            확인 및 닫기
          </button>
        </div>
      </div>

      {/* Staff Show-to-Order Popup Card (점원에게 바로 보여주는 일본어 주문 카드 + 현우 계란 알레르기 일본어 문구) */}
      {selectedOrderCardItem && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedOrderCardItem(null)}
        >
          <div
            className="w-full max-w-lg max-h-[92dvh] rounded-3xl bg-white text-slate-900 border-4 border-amber-400 shadow-2xl overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 sm:h-54 w-full bg-slate-900 shrink-0">
              <img
                src={selectedOrderCardItem.imageUrl}
                alt={selectedOrderCardItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedOrderCardItem(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md">
                식당·매장 직원에게 이 화면을 보여주세요!
              </div>
            </div>

            <div className="p-4 sm:p-5 text-center space-y-3.5">
              <div className="text-xs font-bold text-rose-600">
                すみません、これをお願いします！ (스미마셍, 코레오 오네가이시마스!)
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                {selectedOrderCardItem.japaneseName}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                한국어 발음: [{selectedOrderCardItem.pronunciation}]
              </div>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                <strong>{selectedOrderCardItem.name}</strong> · 예상 가격{' '}
                {selectedOrderCardItem.priceJpy}
              </div>

              {/* =========================================================================
                  🥚 현우 대원 계란 알레르기 일본어 요청 카드 (계란 포함 음식은 자동 표시, 일반 음식도 1탭 토글)
                 ========================================================================= */}
              {showEggAllergyOnOrderCard ? (
                <div className="rounded-2xl border-2 border-rose-500 bg-rose-50/90 p-3.5 sm:p-4 text-left space-y-3 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>🥚 현우 계란 알레르기 일본어 주문 문구</span>
                    </div>
                    {selectedOrderCardItem.eggAllergyInfo?.eggTypeLabel && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black">
                        {selectedOrderCardItem.eggAllergyInfo.eggTypeLabel}
                      </span>
                    )}
                  </div>

                  {/* Mode Selector Tabs: 따로 담아달라 vs 아예 빼달라 */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEggRequestMode('SEPARATE')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        eggRequestMode === 'SEPARATE'
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>🍽️ 계란 따로 담아달라 (別皿)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEggRequestMode('REMOVE')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        eggRequestMode === 'REMOVE'
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>🚫 계란 빼달라 (卵抜き)</span>
                    </button>
                  </div>

                  {/* Staff-Facing Large Japanese Allergy Instruction Box */}
                  <div className="rounded-xl bg-white border-2 border-rose-300 p-3.5 space-y-2 text-center">
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-black">
                      店員さんへ（卵アレルギーのお願い）
                    </div>

                    {eggRequestMode === 'SEPARATE' ? (
                      <>
                        <div className="text-base sm:text-lg font-black text-rose-700 leading-snug">
                          ⚠️ 卵（たまご）は別皿（べつざら）でお願いします！
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                          {selectedOrderCardItem.eggAllergyInfo?.customSeparateJp ||
                            '卵は料理の中に入れず、別の皿に分けて出してください。'}
                        </div>
                        <div className="text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg p-2 leading-relaxed text-left">
                          子どもは<strong>卵アレルギー</strong>があります（パンや衣のつなぎは大丈夫ですが、
                          <strong>半熟卵・ゆで卵・目玉焼き・卵焼き・生卵</strong>
                          などは食べられません）。卵は別の皿に分けてください。
                        </div>
                        <div className="text-xs font-bold text-rose-700 pt-1">
                          발음: [
                          {selectedOrderCardItem.eggAllergyInfo?.customSeparatePronunciation ||
                            '타마고와 베츠자라데 오네가이시마스 (따로 다른 접시에 담아주세요)'}
                          ]
                        </div>
                        <div className="text-[11px] text-slate-600">
                          뜻: “아이가 계란 알레르기가 있습니다(빵·튀김옷은 괜찮지만 반숙·완숙·계란프라이·계란말이·날계란은 못 먹습니다). 계란은 음식에 넣지 말고 다른 접시에 따로 담아주세요.”
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-base sm:text-lg font-black text-rose-700 leading-snug">
                          ⚠️ 卵（たまご）を抜いてください！（卵抜き）
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                          {selectedOrderCardItem.eggAllergyInfo?.customRemoveJp ||
                            'この料理から卵（半熟卵・ゆで卵・目玉焼き・卵焼き等）を抜いてください。'}
                        </div>
                        <div className="text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg p-2 leading-relaxed text-left">
                          子どもは<strong>卵アレルギー</strong>があります（パンや衣のつなぎは大丈夫ですが、
                          <strong>半熟卵・ゆで卵・目玉焼き・卵焼き・生卵</strong>
                          などは食べられません）。卵を入れないでください。
                        </div>
                        <div className="text-xs font-bold text-rose-700 pt-1">
                          발음: [
                          {selectedOrderCardItem.eggAllergyInfo?.customRemovePronunciation ||
                            '타마고오 누이테 구다사이 / 타마고 누키데 오네가이시마스 (계란을 빼주세요)'}
                          ]
                        </div>
                        <div className="text-[11px] text-slate-600">
                          뜻: “아이가 계란 알레르기가 있습니다(빵·튀김옷은 괜찮지만 반숙·완숙·계란프라이·계란말이·날계란은 못 먹습니다). 이 음식에서 계란을 빼주세요.”
                        </div>
                      </>
                    )}
                  </div>

                  {selectedOrderCardItem.eggAllergyInfo?.hyunwooTip && (
                    <div className="text-[11px] font-bold text-rose-800 bg-rose-100/80 rounded-lg px-2.5 py-1.5">
                      💡 현우 엄마 팁: {selectedOrderCardItem.eggAllergyInfo.hyunwooTip}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEggAllergyOnOrderCard(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>🥚 혹시 이 메뉴에 계란이 나온다면? 현우 계란 알레르기(빼기/따로담기) 일본어 문구 열기</span>
                </button>
              )}

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-slate-800 text-left">
                <strong>주문 꿀팁:</strong> {selectedOrderCardItem.orderTip}
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderCardItem(null)}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold cursor-pointer"
              >
                주문 카드 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
