/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  TripDay,
  TravelSpot,
  FriendCompanion,
  SpotComment,
  ChecklistItem,
  BudgetItem,
  DayWeather,
  RecommendedFood
} from './types/travel';
import {
  INITIAL_TRIP_DAYS,
  INITIAL_COMPANIONS,
  INITIAL_COMMENTS,
  INITIAL_CHECKLIST,
  INITIAL_BUDGET
} from './data/tokyoItineraryData';
import {
  fetchTokyoWeatherForecast,
  getSavedOwmApiKey,
  saveOwmApiKey,
  INITIAL_TOKYO_WEATHER
} from './services/weatherService';
import {
  loadSavedDays,
  saveDays,
  loadSavedComments,
  saveComments,
  loadSavedChecklist,
  saveChecklist,
  resetSavedChecklist,
  loadSavedBudget,
  saveBudget,
  resetSavedBudget,
  loadSavedCompanions,
  saveCompanions,
  subscribeToSync
} from './utils/syncStorage';
import { Header } from './components/Header';
import { DaySelector } from './components/DaySelector';
import { TimelineView } from './components/TimelineView';
import { RouteMap } from './components/RouteMap';
import { ShareModal } from './components/ShareModal';
import { CollaborationDrawer } from './components/CollaborationDrawer';
import { SpotDetailModal } from './components/SpotDetailModal';
import { AddSpotModal } from './components/AddSpotModal';
import { BudgetChecklistModal } from './components/BudgetChecklistModal';
import { BudgetReceiptModal } from './components/BudgetReceiptModal';
import { MobileInstallModal } from './components/MobileInstallModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LandingHeroPage } from './components/LandingHeroPage';
import { FlightTransition } from './components/FlightTransition';
import {
  fetchBudgetFromDB,
  addBudgetItemToDB,
  updateBudgetItemInDB,
  deleteBudgetItemFromDB,
  resetBudgetInDB
} from './services/budgetApi';
import {
  Sparkles,
  MapPin,
  Clock,
  Compass,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Navigation,
  Columns2,
  X
} from 'lucide-react';

export default function App() {
  // State loaded from persistent storage / initial Tokyo trip data
  const [days, setDays] = useState<TripDay[]>(() => loadSavedDays(INITIAL_TRIP_DAYS));
  const [companions, setCompanions] = useState<FriendCompanion[]>(() =>
    loadSavedCompanions(INITIAL_COMPANIONS)
  );
  const [comments, setComments] = useState<SpotComment[]>(() =>
    loadSavedComments(INITIAL_COMMENTS)
  );
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    loadSavedChecklist(INITIAL_CHECKLIST)
  );
  const [budget, setBudget] = useState<BudgetItem[]>(() =>
    loadSavedBudget(INITIAL_BUDGET)
  );

  // Selected Day & Spot navigation
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(1);
  const [selectedSpot, setSelectedSpot] = useState<TravelSpot | null>(null);

  // Landing / First Page view state (remember in sessionStorage to prevent accidental reset on refresh)
  const [showLandingPage, setShowLandingPage] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const entered = sessionStorage.getItem('entered_trip_app');
        if (entered === 'true') {
          return false;
        }
      } catch (e) {
        // Ignore session storage errors
      }
    }
    return true;
  });
  // Flight Takeoff & Landing Cinematic Transition state
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [targetFlightDay, setTargetFlightDay] = useState<number>(1);
  const [targetFlightView, setTargetFlightView] = useState<'timeline' | 'map'>('timeline');

  // Active view for mobile & desktop header tabs
  const [activeHeaderTab, setActiveHeaderTab] = useState<'timeline' | 'map' | 'budget' | 'checklist'>('timeline');
  // Active view for mobile, foldable & desktop layout ('split' for side-by-side Z-Fold/PC, 'timeline', 'map')
  const [mobileView, setMobileView] = useState<'timeline' | 'map' | 'split'>(() => {
    if (typeof window !== 'undefined') {
      // Auto-detect wide foldable (Galaxy Z Fold unfolded width >= 640px) or PC
      return window.innerWidth >= 640 ? 'split' : 'timeline';
    }
    return 'split';
  });

  // Automatically adapt if user unfolds or rotates their Galaxy Z Fold device
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const isWideFoldOrDesktop = window.innerWidth >= 640;
        // If unfolded from narrow cover screen to wide inner screen
        if (isWideFoldOrDesktop && mobileView === 'timeline') {
          setMobileView('split');
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileView]);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBudgetChecklistOpen, setIsBudgetChecklistOpen] = useState(false);
  const [budgetModalView, setBudgetModalView] = useState<'budget' | 'checklist'>('checklist');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptTargetFamily, setReceiptTargetFamily] = useState<'ALL' | '현우가족' | '세현가족'>('ALL');
  const [isMobileInstallOpen, setIsMobileInstallOpen] = useState(false);

  const handleOpenReceipt = (family: 'ALL' | '현우가족' | '세현가족' = 'ALL') => {
    setReceiptTargetFamily(family);
    setIsReceiptOpen(true);
  };

  // Floating Toast notification for route additions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Weather states (OpenWeatherMap integration)
  const [weatherForecasts, setWeatherForecasts] = useState<DayWeather[]>(INITIAL_TOKYO_WEATHER);
  const [isLiveWeather, setIsLiveWeather] = useState(false);
  const [owmApiKey, setOwmApiKey] = useState<string>(() => getSavedOwmApiKey());
  const [simulatedRainDays, setSimulatedRainDays] = useState<Record<number, boolean>>({});

  // Fetch weather on mount or when API key changes
  useEffect(() => {
    fetchTokyoWeatherForecast(owmApiKey).then(({ forecasts, isLive }) => {
      setWeatherForecasts(forecasts);
      setIsLiveWeather(isLive);
    });
  }, [owmApiKey]);

  const handleRefreshWeather = () => {
    fetchTokyoWeatherForecast(owmApiKey).then(({ forecasts, isLive }) => {
      setWeatherForecasts(forecasts);
      setIsLiveWeather(isLive);
    });
  };

  const handleSaveOwmKey = (newKey: string) => {
    saveOwmApiKey(newKey);
    setOwmApiKey(newKey);
  };

  const handleToggleSimulatedRain = (dayNum: number, isRain: boolean) => {
    setSimulatedRainDays((prev) => ({ ...prev, [dayNum]: isRain }));
  };

  // Multi-tab real-time synchronization listener
  useEffect(() => {
    const unsubscribe = subscribeToSync((payload) => {
      if (payload.type === 'DAYS_UPDATE' && Array.isArray(payload.data)) {
        setDays(payload.data as TripDay[]);
      } else if (payload.type === 'COMMENT_ADD' && Array.isArray(payload.data)) {
        setComments(payload.data as SpotComment[]);
      } else if (payload.type === 'CHECKLIST_UPDATE' && Array.isArray(payload.data)) {
        setChecklist(payload.data as ChecklistItem[]);
      } else if (payload.type === 'BUDGET_UPDATE' && Array.isArray(payload.data)) {
        setBudget(payload.data as BudgetItem[]);
      } else if (payload.type === 'PRESENCE_UPDATE' && Array.isArray(payload.data)) {
        setCompanions(payload.data as FriendCompanion[]);
      }
    });

    return unsubscribe;
  }, []);

  // Fetch initial budget from backend DB & sync periodically to catch real-time webhook items
  useEffect(() => {
    const refreshBudget = () => {
      fetchBudgetFromDB().then((dbItems) => {
        if (dbItems && dbItems.length > 0) {
          setBudget((prev) => {
            // Update if length differs or newest item differs
            if (prev.length !== dbItems.length || JSON.stringify(prev[prev.length - 1]) !== JSON.stringify(dbItems[dbItems.length - 1])) {
              return dbItems;
            }
            return prev;
          });
        }
      });
    };

    // Initial load
    fetchBudgetFromDB().then((dbItems) => {
      if (dbItems && dbItems.length > 0) {
        setBudget(dbItems);
      }
    });

    // Auto poll every 10 seconds to catch webhook items registered by MacroDroid/Samsung Card
    const timer = setInterval(refreshBudget, 10000);
    window.addEventListener('focus', refreshBudget);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refreshBudget();
      }
    });

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refreshBudget);
    };
  }, []);

  // Save changes to storage whenever state updates
  const handleUpdateDays = (newDays: TripDay[]) => {
    setDays(newDays);
    saveDays(newDays);
  };

  // Currently active day object
  const currentDay = useMemo(() => {
    if (selectedDayNumber === null) return null;
    return days.find((d) => d.dayNumber === selectedDayNumber) || days[0];
  }, [days, selectedDayNumber]);

  // Spot selection
  const handleSelectSpot = (spot: TravelSpot) => {
    setSelectedSpot(spot);
    // Find which day this spot belongs to if on 'all days' mode
    if (selectedDayNumber === null) {
      const parentDay = days.find((d) => d.spots.some((s) => s.id === spot.id));
      if (parentDay) setSelectedDayNumber(parentDay.dayNumber);
    }
  };

  // Toggle Spot Heart / Like reaction
  const handleToggleLike = (spotId: string) => {
    const updated = days.map((day) => ({
      ...day,
      spots: day.spots.map((spot) => {
        if (spot.id === spotId) {
          const hasLiked = !spot.hasLiked;
          const likes = (spot.likes || 0) + (hasLiked ? 1 : -1);
          return { ...spot, hasLiked, likes };
        }
        return spot;
      })
    }));
    handleUpdateDays(updated);
  };

  // Move spot up/down in day itinerary
  const handleMoveSpot = (dayNumber: number, spotIndex: number, direction: 'up' | 'down') => {
    const targetDayIndex = days.findIndex((d) => d.dayNumber === dayNumber);
    if (targetDayIndex === -1) return;

    const day = days[targetDayIndex];
    const newSpots = [...day.spots];
    const targetIdx = direction === 'up' ? spotIndex - 1 : spotIndex + 1;

    if (targetIdx < 0 || targetIdx >= newSpots.length) return;

    // Swap spots
    const temp = newSpots[spotIndex];
    newSpots[spotIndex] = newSpots[targetIdx];
    newSpots[targetIdx] = temp;

    const updatedDays = [...days];
    updatedDays[targetDayIndex] = { ...day, spots: newSpots };
    handleUpdateDays(updatedDays);
  };

  // Delete spot
  const handleDeleteSpot = (dayNumber: number, spotId: string) => {
    const targetDayIndex = days.findIndex((d) => d.dayNumber === dayNumber);
    if (targetDayIndex === -1) return;

    const day = days[targetDayIndex];
    const newSpots = day.spots.filter((s) => s.id !== spotId);

    const updatedDays = [...days];
    updatedDays[targetDayIndex] = { ...day, spots: newSpots };
    handleUpdateDays(updatedDays);

    if (selectedSpot?.id === spotId) {
      setSelectedSpot(null);
    }
  };

  // Add new custom spot to day
  const handleAddSpot = (dayNumber: number, newSpot: TravelSpot) => {
    const targetDayIndex = days.findIndex((d) => d.dayNumber === dayNumber);
    if (targetDayIndex === -1) return;

    const day = days[targetDayIndex];
    const updatedDays = [...days];
    updatedDays[targetDayIndex] = {
      ...day,
      spots: [...day.spots, newSpot]
    };
    handleUpdateDays(updatedDays);
    setSelectedSpot(newSpot);
  };

  // Toggle recommended restaurant in the day's route itinerary (Add or Remove)
  const handleAddFoodToRoute = (
    dayNumber: number,
    parentSpot: TravelSpot,
    food: RecommendedFood
  ) => {
    const targetDayIndex = days.findIndex((d) => d.dayNumber === dayNumber);
    if (targetDayIndex === -1) return;

    const day = days[targetDayIndex];
    // Check if this restaurant is already added to day.spots
    const existingIndex = day.spots.findIndex(
      (s) => s.name === food.name || (s.name.includes(food.name) && s.category === 'food')
    );

    // If already added, toggle it OFF (delete from itinerary)
    if (existingIndex !== -1) {
      const removedSpot = day.spots[existingIndex];
      const newSpots = day.spots.filter((_, idx) => idx !== existingIndex);
      const updatedDays = [...days];
      updatedDays[targetDayIndex] = {
        ...day,
        spots: newSpots
      };

      handleUpdateDays(updatedDays);
      if (selectedSpot?.id === removedSpot.id || selectedSpot?.name === food.name) {
        setSelectedSpot(parentSpot || newSpots[0] || null);
      }
      setToastMessage(`🗑️ '${food.name}' 맛집이 Day ${dayNumber} 구글 동선 경로에서 삭제되었습니다.`);
      return;
    }

    const newSpotId = `food-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newFoodSpot: TravelSpot = {
      id: newSpotId,
      name: food.name,
      japaneseName: food.name,
      category: 'food',
      categoryLabel: '추천 맛집',
      rating: food.rating || 4.5,
      openStatus: '추천 맛집 · 동선 반영',
      hours: '점심/저녁 식사 시간대 추천',
      estimatedTime: '식사 시간 (약 50분)',
      coordinates: food.coordinates || [
        parentSpot.coordinates[0] + 0.0012,
        parentSpot.coordinates[1] + 0.0012
      ],
      summary: food.desc
        ? `${food.name} - ${food.menu}. (${food.desc})`
        : `${food.name} - 대표 추천 메뉴: ${food.menu}. '${parentSpot.name}' 관광 후 방문하기 좋은 맛집입니다.`,
      tips: [
        `대표 추천 메뉴: ${food.menu}`,
        `'${parentSpot.name}' 방문 일정과 연계하여 구글 동선 경로에 추가되었습니다.`,
        food.desc ? `${food.desc}` : '인기 식당의 경우 혼잡 시간대를 피해 방문하거나 예약을 권장합니다.'
      ],
      address: parentSpot.address ? `${parentSpot.address} 인근 식당가` : '도쿄도 주요 맛집',
      likes: 3,
      hasLiked: false,
      userNotes: `[추천 맛집 동선 추가] 대표 메뉴: ${food.menu}`
    };

    // Insert directly after parentSpot so the itinerary flows naturally
    const parentIndex = day.spots.findIndex((s) => s.id === parentSpot.id);
    const newSpots = [...day.spots];
    if (parentIndex !== -1) {
      newSpots.splice(parentIndex + 1, 0, newFoodSpot);
    } else {
      newSpots.push(newFoodSpot);
    }

    const updatedDays = [...days];
    updatedDays[targetDayIndex] = {
      ...day,
      spots: newSpots
    };

    handleUpdateDays(updatedDays);
    setSelectedSpot(newFoodSpot);
    setToastMessage(`🍽️ '${food.name}' 맛집이 Day ${dayNumber} 구글 동선 경로에 추가되었습니다! (정류장 #${parentIndex !== -1 ? parentIndex + 2 : newSpots.length})`);
  };

  // Save user notes to spot
  const handleSaveNotes = (spotId: string, notes: string) => {
    const updated = days.map((day) => ({
      ...day,
      spots: day.spots.map((spot) => (spot.id === spotId ? { ...spot, userNotes: notes } : spot))
    }));
    handleUpdateDays(updated);
    if (selectedSpot?.id === spotId) {
      setSelectedSpot({ ...selectedSpot, userNotes: notes });
    }
  };

  // Comments / Real-time chat
  const handleAddComment = (spotId: string, spotName: string, text: string) => {
    const newComment: SpotComment = {
      id: `c-${Date.now()}`,
      spotId,
      spotName,
      author: '나 (작성자)',
      avatarColor: 'bg-indigo-600',
      text,
      timestamp: '방금 전'
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(updated);
  };

  // Companion
  const handleAddCompanion = (name: string) => {
    const colors = ['bg-pink-500', 'bg-cyan-600', 'bg-violet-600', 'bg-teal-600'];
    const newComp: FriendCompanion = {
      id: `user-${Date.now()}`,
      name,
      avatarColor: colors[companions.length % colors.length],
      status: '초대 수락 및 참여 완료',
      isOnline: true
    };
    const updated = [...companions, newComp];
    setCompanions(updated);
    saveCompanions(updated);
  };

  // Checklist
  const handleToggleCheckItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    saveChecklist(updated);
  };

  const handleAddCheckItem = (text: string, category: ChecklistItem['category']) => {
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      text,
      category,
      completed: false
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    saveChecklist(updated);
  };

  const handleDeleteCheckItem = (id: string) => {
    const updated = checklist.filter((item) => item.id !== id);
    setChecklist(updated);
    saveChecklist(updated);
  };

  const handleResetChecklist = () => {
    const restored = resetSavedChecklist(INITIAL_CHECKLIST);
    setChecklist(restored);
    setToastMessage(`🎒 준비물 체크리스트가 최신 추천 필수품(목도리·장갑 포함 ${INITIAL_CHECKLIST.length}개 항목)으로 복원되었습니다.`);
  };

  const handleToggleAllChecklist = (completed: boolean) => {
    const updated = checklist.map((item) => ({ ...item, completed }));
    setChecklist(updated);
    saveChecklist(updated);
  };

  // Budget
  const handleAddBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: `b-${Date.now()}`
    };
    const updated = [...budget, newItem];
    setBudget(updated);
    saveBudget(updated);
    addBudgetItemToDB(newItem);
    setToastMessage(`💾 [DB 저장 완료] ${item.type === 'DEPOSIT' ? '공동경비 입금' : '경비 지출'} '${item.title}' 내역이 두 가족 공유 DB에 등록되었습니다.`);
  };

  const handleUpdateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    const updated = budget.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBudget(updated);
    saveBudget(updated);
    updateBudgetItemInDB(id, updates);
    setToastMessage(`✏️ [DB 수정 완료] 가계부 내역이 업데이트되었습니다.`);
  };

  const handleDeleteBudgetItem = (id: string) => {
    const target = budget.find((b) => b.id === id);
    const updated = budget.filter((b) => b.id !== id);
    setBudget(updated);
    saveBudget(updated);
    deleteBudgetItemFromDB(id);
    setToastMessage(`🗑️ '${target?.title || '항목'}' 내역이 두 가족 공유 DB에서 삭제되었습니다.`);
  };

  const handleResetBudget = () => {
    const restored = resetSavedBudget(INITIAL_BUDGET);
    setBudget(restored);
    resetBudgetInDB(INITIAL_BUDGET);
    setToastMessage('💰 2가족(현우가족·세현가족) 추천 공동 경비 및 가계부 내역으로 공유 DB가 초기화 복원되었습니다.');
  };

  // Header Nav tab handler
  const handleHeaderTab = (tab: 'timeline' | 'map' | 'budget' | 'checklist') => {
    setActiveHeaderTab(tab);
    if (tab === 'budget') {
      setBudgetModalView('budget');
      setIsBudgetChecklistOpen(true);
    } else if (tab === 'checklist') {
      setBudgetModalView('checklist');
      setIsBudgetChecklistOpen(true);
    } else if (tab === 'map') {
      setMobileView('map');
    } else if (tab === 'timeline') {
      setMobileView('timeline');
    }
  };

  // Start trip with cinematic flight transition
  const handleTriggerFlightAndStart = (dayNum?: number) => {
    const target = dayNum || 1;
    setTargetFlightDay(target);
    setSelectedDayNumber(target);
    setTargetFlightView('timeline');
    setIsFlying(true);
  };

  // Open map from landing page with cinematic flight transition
  const handleTriggerFlightAndOpenMap = () => {
    setTargetFlightDay(1);
    setSelectedDayNumber(1);
    setTargetFlightView('map');
    setIsFlying(true);
  };

  const handleFlightComplete = () => {
    setIsFlying(false);
    setShowLandingPage(false);
    try {
      sessionStorage.setItem('entered_trip_app', 'true');
    } catch (e) {}
    if (targetFlightView === 'map') {
      setActiveHeaderTab('map');
      setMobileView('map');
    } else {
      setActiveHeaderTab('timeline');
      setMobileView('timeline');
    }
  };

  if (isFlying) {
    return (
      <FlightTransition
        targetDayNumber={targetFlightDay}
        targetView={targetFlightView}
        onComplete={handleFlightComplete}
      />
    );
  }

  if (showLandingPage) {
    return (
      <LandingHeroPage
        days={days}
        onStartTrip={handleTriggerFlightAndStart}
        onOpenMap={handleTriggerFlightAndOpenMap}
        onOpenChecklist={() => {
          setShowLandingPage(false);
          try {
            sessionStorage.setItem('entered_trip_app', 'true');
          } catch (e) {}
          setBudgetModalView('checklist');
          setIsBudgetChecklistOpen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 md:pb-0">
      {/* Top Bar Header */}
      <Header
        activeTab={activeHeaderTab}
        onSelectTab={handleHeaderTab}
        onGoHome={() => {
          try {
            sessionStorage.removeItem('entered_trip_app');
          } catch (e) {}
          setShowLandingPage(true);
        }}
      />

      {/* Day Selector Bar */}
      <DaySelector
        days={days}
        selectedDayNumber={selectedDayNumber}
        onSelectDay={(dayNum) => {
          setSelectedDayNumber(dayNum);
          setSelectedSpot(null);
        }}
        onGoHome={() => setShowLandingPage(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
        {/* Mobile, Foldable & Desktop View Selector Bar */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-200/90 rounded-2xl mb-4 shadow-2xs">
          <div className="flex items-center gap-1.5 flex-1">
            <button
              onClick={() => {
                setMobileView('timeline');
                setActiveHeaderTab('timeline');
              }}
              className={`flex-1 py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileView === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>일정 타임라인</span>
            </button>
            <button
              onClick={() => {
                setMobileView('map');
                setActiveHeaderTab('map');
              }}
              className={`flex-1 py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileView === 'map'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>동선 지도</span>
            </button>
            <button
              onClick={() => {
                setMobileView('split');
              }}
              className={`flex-1 py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                mobileView === 'split'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
              title="갤럭시 Z폴드 및 태블릿, PC처럼 좌우로 분할하여 타임라인과 지도를 동시에 봅니다"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>좌우 분할</span>
              <span className="text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded-md shadow-2xs">
                Z폴드·PC
              </span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Split (Foldable, Mobile & PC side-by-side) */}
        <div
          className={`grid gap-2.5 sm:gap-4 md:gap-6 items-start ${
            mobileView === 'split'
              ? 'grid-cols-12'
              : 'grid-cols-1 lg:grid-cols-12'
          }`}
        >
          {/* Left Column: Itinerary Timeline List */}
          <div
            className={`space-y-4 ${
              mobileView === 'split'
                ? 'col-span-5 sm:col-span-6 lg:col-span-7 block'
                : mobileView === 'map'
                ? 'hidden lg:block'
                : 'block lg:col-span-7'
            }`}
          >
            {currentDay ? (
              <TimelineView
                currentDay={currentDay}
                selectedSpot={selectedSpot}
                isSplitView={mobileView === 'split'}
                onSelectSpot={(spot) => {
                  handleSelectSpot(spot);
                }}
                onToggleLike={handleToggleLike}
                onMoveSpot={handleMoveSpot}
                onDeleteSpot={handleDeleteSpot}
                onOpenAddSpot={() => setIsAddSpotOpen(true)}
                onOpenDetailModal={(spot) => {
                  setSelectedSpot(spot);
                  setIsDetailModalOpen(true);
                }}
                onAddFoodToRoute={handleAddFoodToRoute}
                currentWeather={
                  weatherForecasts.find((w) => w.dayNumber === currentDay.dayNumber) ||
                  weatherForecasts[0]
                }
                isLiveWeather={isLiveWeather}
                onRefreshWeather={handleRefreshWeather}
                onSaveOwmKey={handleSaveOwmKey}
                savedOwmKey={owmApiKey}
                onToggleSimulatedRain={(isRain) =>
                  handleToggleSimulatedRain(currentDay.dayNumber, isRain)
                }
                isSimulatedRain={!!simulatedRainDays[currentDay.dayNumber]}
              />
            ) : (
              /* All Days Overview List */
              <div className="space-y-6">
                {/* 6-Day Weather Strip */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      도쿄 6일간 날씨 예보 (OpenWeatherMap)
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {isLiveWeather ? '● 실시간 기상 데이터' : '1월 도쿄 표준 기상'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {weatherForecasts.map((w) => {
                      const isRain =
                        w.condition === 'Rain' || simulatedRainDays[w.dayNumber];
                      return (
                        <div
                          key={w.dayNumber}
                          onClick={() => setSelectedDayNumber(w.dayNumber)}
                          className={`p-2.5 rounded-xl border text-center text-xs cursor-pointer hover:border-indigo-400 transition-all ${
                            isRain
                              ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="font-bold text-xs">Day {w.dayNumber}</div>
                          <div className="text-[10px] text-slate-400">{w.date}</div>
                          <div className="font-mono font-bold text-sm my-1">
                            {w.tempDay}° / {w.tempNight}°
                          </div>
                          <div className="text-[10px] text-slate-600 truncate">
                            {isRain ? '비 예보' : w.description}
                          </div>
                          {isRain && (
                            <div className="text-[10px] text-indigo-700 font-bold mt-1 bg-indigo-100/80 rounded px-1 py-0.5">
                              ☔ 실내 추천
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase">
                    <Navigation className="w-4 h-4" />
                    <span>전체 6일 여정 요약</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    도쿄 5박 6일 최적화 동선 총괄
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    긴시초 롯데시티호텔을 거점으로 나리타 공항 소부선 쾌속 직통부터 아사쿠사, 디즈니씨, 해리포터 스튜디오, 후지산 투어, 쓰키지 및 롯폰기 힐스까지 동선 낭비 없는 스케줄입니다.
                  </p>
                </div>

                <div className="space-y-4">
                  {days.map((day) => (
                    <div
                      key={day.dayNumber}
                      onClick={() => setSelectedDayNumber(day.dayNumber)}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            Day {day.dayNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            {day.date}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">
                            {day.theme}
                          </h3>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600">
                          상세보기 →
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {day.spots.map((spot, sIdx) => (
                          <div
                            key={spot.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          >
                            <span className="font-bold text-slate-700">
                              {sIdx + 1}. {spot.name}
                            </span>
                            <span className="text-[10px] text-amber-600 font-semibold">
                              ★{spot.rating}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Leaflet Route Map */}
          <div
            className={`isolate z-0 ${
              mobileView === 'split'
                ? 'col-span-7 sm:col-span-6 lg:col-span-5 sticky top-16 md:top-20 block'
                : mobileView === 'timeline'
                ? 'hidden lg:block'
                : 'block lg:col-span-5 lg:sticky lg:top-24'
            }`}
          >
            <div className="space-y-3">
              <RouteMap
                currentDay={currentDay}
                allDays={days}
                selectedSpot={selectedSpot}
                onSelectSpot={(spot) => {
                  handleSelectSpot(spot);
                }}
                isVisible={mobileView === 'map' || mobileView === 'split'}
                className="h-[520px] sm:h-[580px] md:h-[640px] lg:h-[calc(100vh-10.5rem)] min-h-[420px] w-full"
              />

              {/* Selected Spot Quick Info Card below map on desktop */}
              {selectedSpot && (
                <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="truncate pr-2">
                      <div className="text-[11px] font-bold text-indigo-600">
                        선택된 거점
                      </div>
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {selectedSpot.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setIsDetailModalOpen(true)}
                        className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                      >
                        상세 정보 열기 →
                      </button>
                      <button
                        onClick={() => setSelectedSpot(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="선택 해제 및 닫기"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={mobileView}
        onSelectView={(v) => {
          setMobileView(v);
          setActiveHeaderTab(v === 'split' ? 'timeline' : v);
        }}
        onOpenBudget={() => {
          setBudgetModalView('checklist');
          setIsBudgetChecklistOpen(true);
        }}
      />

      {/* Modals & Drawers */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        days={days}
        companions={companions}
        onAddCompanion={handleAddCompanion}
      />

      <CollaborationDrawer
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        comments={comments}
        days={days}
        onAddComment={handleAddComment}
      />

      <SpotDetailModal
        isOpen={isDetailModalOpen}
        spot={selectedSpot}
        onClose={() => setIsDetailModalOpen(false)}
        onToggleLike={handleToggleLike}
        onSaveNotes={handleSaveNotes}
        onAddFoodToRoute={(food) => {
          if (selectedSpot && currentDay) {
            handleAddFoodToRoute(currentDay.dayNumber, selectedSpot, food);
          }
        }}
        daySpots={currentDay?.spots}
      />

      <MobileInstallModal
        isOpen={isMobileInstallOpen}
        onClose={() => setIsMobileInstallOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-base">📍</span>
              <span className="font-medium leading-snug">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <AddSpotModal
        isOpen={isAddSpotOpen}
        onClose={() => setIsAddSpotOpen(false)}
        dayNumber={selectedDayNumber || 1}
        onAddSpot={handleAddSpot}
      />

      <BudgetChecklistModal
        isOpen={isBudgetChecklistOpen}
        onClose={() => {
          setIsBudgetChecklistOpen(false);
          setActiveHeaderTab(mobileView === 'split' ? 'timeline' : mobileView);
        }}
        activeView={budgetModalView}
        onSwitchView={(v) => setBudgetModalView(v)}
        checklist={checklist}
        onToggleCheckItem={handleToggleCheckItem}
        onAddCheckItem={handleAddCheckItem}
        onDeleteCheckItem={handleDeleteCheckItem}
        onResetChecklist={handleResetChecklist}
        onToggleAllChecklist={handleToggleAllChecklist}
        budget={budget}
        onAddBudgetItem={handleAddBudgetItem}
        onUpdateBudgetItem={handleUpdateBudgetItem}
        onDeleteBudgetItem={handleDeleteBudgetItem}
        onResetBudget={handleResetBudget}
        onOpenReceipt={handleOpenReceipt}
      />

      <BudgetReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        budget={budget}
        initialFamily={receiptTargetFamily}
      />
    </div>
  );
}
