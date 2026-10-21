/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { LoginPage } from './components/LoginPage';
import { IntroPage } from './components/IntroPage';
import {
  ScheduleAmbientBackdrop
} from './components/ScheduleThemeSwitcher';
import {
  ScheduleThemeId,
  SCHEDULE_THEMES,
  loadSavedScheduleTheme,
  saveScheduleTheme
} from './data/scheduleThemes';
import { KakaoAuthUser } from './types/auth';
import { getStoredKakaoUser, clearKakaoUser, fetchServerProfiles, subscribeToProfiles, getEffectivePresetMembers } from './services/kakaoAuth';
import {
  fetchBudgetFromDB,
  addBudgetItemToDB,
  updateBudgetItemInDB,
  deleteBudgetItemFromDB,
  resetBudgetInDB
} from './services/budgetApi';
import {
  StampMissionFloatingButton,
  StampMissionModal
} from './components/StampMissionModal';
import { TokyoFoodGuideModal } from './components/TokyoFoodGuideModal';
import { TokyoFoodCategoryId } from './data/tokyoFoodGuideData';
import {
  StampMissionItem,
  DEFAULT_STAMP_MISSIONS,
  loadLocalStampMissions,
  saveLocalStampMissions,
  saveStampMissionToFirestore,
  subscribeToStampMissions,
  TRIP_ID
} from './services/stampMissionService';
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
  const [stampMissions, setStampMissions] = useState<StampMissionItem[]>(() =>
    loadLocalStampMissions()
  );
  const [isStampMissionOpen, setIsStampMissionOpen] = useState<boolean>(false);

  // Selected Day & Spot navigation
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(1);
  const [selectedSpot, setSelectedSpot] = useState<TravelSpot | null>(null);
  const [spotSelectionTick, setSpotSelectionTick] = useState<number>(0);

  // Schedule Page Design Theme State (5 selectable styles: 4 Intro/Hero dark themes + 1 classic light)
  const [scheduleThemeId, setScheduleThemeId] = useState<ScheduleThemeId>(() =>
    loadSavedScheduleTheme()
  );
  const currentScheduleTheme =
    SCHEDULE_THEMES[scheduleThemeId] || SCHEDULE_THEMES['classic-light'];

  const handleSelectScheduleTheme = (themeId: ScheduleThemeId) => {
    setScheduleThemeId(themeId);
    saveScheduleTheme(themeId);
    const chosen = SCHEDULE_THEMES[themeId];
    if (chosen) {
      setToastMessage(
        `🎨 일정 페이지 디자인이 '${chosen.shortName}' 스타일로 변경되었습니다!`
      );
    }
  };

  // Netflix-style Cinematic Intro Splash Screen (어플 시작 시 멋있는 도쿄원정대 인트로)
  // 스마트폰 화면을 닫았다 다시 열거나 어플을 재실행할 때 항상 인트로 화면부터 시작
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIsLoginPageOpen(true);
    setShowLandingPage(true);
  };

  // 스마트폰 화면 닫기/잠금(화면 꺼짐) 또는 어플을 백그라운드로 닫았다가 다시 열 때 항상 인트로 -> 로그인 -> 첫페이지 -> 일정 순서로 시작
  useEffect(() => {
    let hiddenTimestamp = 0;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenTimestamp = Date.now();
      } else if (document.visibilityState === 'visible') {
        // 스마트폰 화면을 껐다 켜거나(화면 닫음), 앱을 닫았다가 다시 열었을 때 (600ms 이상 백그라운드)
        if (hiddenTimestamp > 0 && Date.now() - hiddenTimestamp > 600) {
          setShowIntro(true);
          setIsLoginPageOpen(false);
          setShowLandingPage(true);
          try {
            sessionStorage.removeItem('entered_trip_app');
          } catch {}
        }
        hiddenTimestamp = 0;
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // 브라우저 백그라운드 캐시(bfcache) 복원이나 재진입 시 항상 인트로 -> 로그인 -> 첫페이지로 리셋
      if (event.persisted) {
        setShowIntro(true);
        setIsLoginPageOpen(false);
        setShowLandingPage(true);
        try {
          sessionStorage.removeItem('entered_trip_app');
        } catch {}
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Kakao Talk Login & User session state (식별된 스마트폰/태블릿 접속자)
  const [currentUser, setCurrentUser] = useState<KakaoAuthUser | null>(() => getStoredKakaoUser());
  const [isFoodGuideOpen, setIsFoodGuideOpen] = useState(false);
  const [foodGuideCategory, setFoodGuideCategory] = useState<TokyoFoodCategoryId>('ALL');
  const [foodGuideTargetFoodId, setFoodGuideTargetFoodId] = useState<string | null>(null);

  const handleOpenFoodGuide = (category: TokyoFoodCategoryId = 'ALL', foodId?: string) => {
    setFoodGuideCategory(category);
    setFoodGuideTargetFoodId(foodId || null);
    setIsFoodGuideOpen(true);
  };

  // Synchronize companion names with effective member profiles
  const syncCompanionsWithProfiles = useCallback(() => {
    const effective = getEffectivePresetMembers();
    setCompanions((prev) => {
      return prev.map((comp) => {
        const matched = effective.find((m) => {
          if (comp.id === 'user-1' && m.id === 'kakao_hyunwoo_mom') return true;
          if (comp.id === 'user-2' && m.id === 'kakao_sehyun_mom') return true;
          if (comp.id === 'user-3' && m.id === 'kakao_hyunwoo') return true;
          if (comp.id === 'user-4' && m.id === 'kakao_sehyun') return true;
          return false;
        });
        if (matched) {
          return {
            ...comp,
            name: `${matched.nickname} (${matched.role === 'HYUNWOO' || matched.role === 'SEHYUN' ? '관리자' : '원정대원'})`
          };
        }
        return comp;
      });
    });
  }, []);

  // Synchronize profiles from server DB (profiles_db.json) on mount, focus, and periodic polling across devices
  useEffect(() => {
    const runProfileSync = () => {
      fetchServerProfiles()
        .then(() => {
          const refreshed = getStoredKakaoUser();
          if (refreshed) {
            setCurrentUser(refreshed);
          }
          syncCompanionsWithProfiles();
        })
        .catch(() => {});
    };

    // 1. Initial server profile sync
    runProfileSync();

    // 2. Profile update subscription
    const unsubscribe = subscribeToProfiles(() => {
      const refreshed = getStoredKakaoUser();
      if (refreshed) {
        setCurrentUser(refreshed);
      }
      syncCompanionsWithProfiles();
    });

    // 3. Re-sync when switching back to this app tab
    const handleFocusSync = () => {
      if (document.visibilityState === 'visible') {
        runProfileSync();
      }
    };
    window.addEventListener('focus', handleFocusSync);

    // 4. Periodic cross-device polling every 8 seconds while visible
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        runProfileSync();
      }
    }, 8000);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocusSync);
      clearInterval(pollInterval);
    };
  }, [syncCompanionsWithProfiles]);

  const [isLoginPageOpen, setIsLoginPageOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = getStoredKakaoUser();
      if (!stored) {
        try {
          const skipped = sessionStorage.getItem('skipped_kakao_login');
          return skipped !== 'true';
        } catch {
          return true;
        }
      }
    }
    return false;
  });

  const handleKakaoLoginSuccess = (user: KakaoAuthUser) => {
    setCurrentUser(user);
    setIsLoginPageOpen(false);
    setShowLandingPage(true);
    setToastMessage(`💬 ${user.nickname}님 카카오 로그인 완료! (${user.device.name} 접속 중)`);

    // Synchronize companions online status
    const existingIdx = companions.findIndex((c) => {
      if (c.name === user.nickname) return true;
      if (user.nickname === '현우맘') return c.name.includes('현우맘');
      if (user.nickname === '세현맘') return c.name.includes('세현맘');
      if (user.nickname === '현우') return c.name.startsWith('현우') && !c.name.includes('맘');
      if (user.nickname === '세현') return c.name.startsWith('세현') && !c.name.includes('맘');
      return c.name.includes(user.nickname) || user.nickname.includes(c.name);
    });
    if (existingIdx !== -1) {
      const updated = [...companions];
      updated[existingIdx] = {
        ...updated[existingIdx],
        isOnline: true,
        status: `${user.device.name.split(' ')[0]} 접속 중`
      };
      setCompanions(updated);
      saveCompanions(updated);
    }
  };

  const handleProfileUpdate = (user: KakaoAuthUser) => {
    setCurrentUser(user);
    setToastMessage(`✨ ${user.nickname} 프로필 및 캐릭터가 성공적으로 변경되었습니다.`);
    syncCompanionsWithProfiles();
  };

  const handleKakaoLogout = () => {
    clearKakaoUser();
    setCurrentUser(null);
    setIsLoginPageOpen(true);
    setShowLandingPage(true);
    try {
      sessionStorage.removeItem('skipped_kakao_login');
      sessionStorage.removeItem('entered_trip_app');
    } catch {}
    setToastMessage('👋 카카오톡 로그아웃되었습니다.');
  };

  // Landing / First Page view state (인트로 -> 로그인 페이지 -> 첫페이지 -> 일정페이지 순서 엄수)
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  // Flight Takeoff & Landing Cinematic Transition state
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [targetFlightDay, setTargetFlightDay] = useState<number>(1);
  const [targetFlightView, setTargetFlightView] = useState<'timeline' | 'map'>('timeline');

  // Active view for mobile & desktop header tabs
  const [activeHeaderTab, setActiveHeaderTab] = useState<'timeline' | 'map' | 'split' | 'budget' | 'checklist'>('timeline');
  // Active view for mobile, foldable & desktop layout ('split' for side-by-side Z-Fold/PC, 'timeline', 'map')
  const [mobileView, setMobileView] = useState<'timeline' | 'map' | 'split'>(() => {
    if (typeof window !== 'undefined') {
      // Auto-detect wide foldable (Galaxy Z Fold unfolded width >= 640px) or PC
      return window.innerWidth >= 640 ? 'split' : 'timeline';
    }
    return 'split';
  });



  // Remember last viewed / active spot and scroll position when navigating between timeline and map on mobile
  const lastActiveSpotIdRef = useRef<string | null>(null);
  const lastTimelineScrollYRef = useRef<number>(0);

  // Track window scroll position when in timeline view
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      if (mobileView === 'timeline') {
        lastTimelineScrollYRef.current = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileView]);

  // When returning to timeline view on mobile, restore viewing spot or scroll position
  useEffect(() => {
    if (mobileView === 'timeline') {
      const targetSpotId = selectedSpot?.id || lastActiveSpotIdRef.current;
      if (targetSpotId) {
        // Fast restore right after DOM unhiding
        const timer1 = setTimeout(() => {
          const el = document.getElementById(`spot-card-${targetSpotId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (lastTimelineScrollYRef.current > 0) {
            window.scrollTo({
              top: lastTimelineScrollYRef.current,
              behavior: 'smooth'
            });
          }
        }, 50);

        // Backup restore after image layout and reflow settle
        const timer2 = setTimeout(() => {
          const el = document.getElementById(`spot-card-${targetSpotId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }, 220);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      } else if (lastTimelineScrollYRef.current > 0) {
        const timer = setTimeout(() => {
          window.scrollTo({
            top: lastTimelineScrollYRef.current,
            behavior: 'smooth'
          });
        }, 50);
        return () => clearTimeout(timer);
      }
    }
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

  const splitGridRef = useRef<HTMLDivElement | null>(null);

  // Auto select first spot when entering split view if none selected
  useEffect(() => {
    if (showIntro || isLoginPageOpen || showLandingPage || isFlying) {
      return;
    }
    if (mobileView === 'split') {
      if (!selectedSpot && currentDay?.spots?.[0]) {
        setSelectedSpot(currentDay.spots[0]);
      }
    }
  }, [
    mobileView,
    selectedSpot,
    currentDay,
    selectedDayNumber,
    showIntro,
    isLoginPageOpen,
    showLandingPage,
    isFlying
  ]);

  // Spot selection
  const handleSelectSpot = (spot: TravelSpot) => {
    setSelectedSpot(spot);
    setSpotSelectionTick((prev) => prev + 1);
    lastActiveSpotIdRef.current = spot.id;
    // Find which day this spot belongs to if on 'all days' mode
    if (selectedDayNumber === null) {
      const parentDay = days.find((d) => d.spots.some((s) => s.id === spot.id));
      if (parentDay) setSelectedDayNumber(parentDay.dayNumber);
    }
  };

  // Switch to Route Map view (keeping selectedSpot focused and centering map on screen)
  const switchToMapView = (spotToFocus?: TravelSpot) => {
    if (spotToFocus) {
      setSelectedSpot(spotToFocus);
      lastActiveSpotIdRef.current = spotToFocus.id;
    }
    setSpotSelectionTick((prev) => prev + 1);
    setMobileView('map');
    setActiveHeaderTab('map');
    // Smoothly bring the map container into optical center of viewport
    setTimeout(() => {
      const mapEl = document.getElementById('route-map-section');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
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
    const authorName = currentUser?.nickname || '나 (작성자)';
    const avatarColor = currentUser?.avatarColor || 'bg-indigo-600';
    const newComment: SpotComment = {
      id: `c-${Date.now()}`,
      spotId,
      spotName,
      author: authorName,
      avatarColor,
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

  // Real-time Cloud Firestore subscription for Stamp Missions & Praise Board
  useEffect(() => {
    const unsubscribe = subscribeToStampMissions((updatedMissions) => {
      setStampMissions(updatedMissions);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleStamp = (missionId: string, boy: 'HYUNWOO' | 'SEHYUN') => {
    const effective = getEffectivePresetMembers();
    const hyunwooMomName =
      effective.find((m) => m.id === 'kakao_hyunwoo_mom')?.nickname || '현우맘';
    const sehyunMomName =
      effective.find((m) => m.id === 'kakao_sehyun_mom')?.nickname || '세현맘';
    const hyunwooName =
      effective.find((m) => m.id === 'kakao_hyunwoo')?.nickname || '현우';
    const sehyunName =
      effective.find((m) => m.id === 'kakao_sehyun')?.nickname || '세현';

    const activeId = currentUser?.id;

    // Strict permission check: Hyunwoo Mom -> Hyunwoo only, Sehyun Mom -> Sehyun only
    if (boy === 'HYUNWOO' && activeId !== 'kakao_hyunwoo_mom') {
      setToastMessage(
        `🔒 ${hyunwooName} 대원의 스탬프 도장은 ${hyunwooMomName}만 찍어줄 수 있습니다.`
      );
      return;
    }
    if (boy === 'SEHYUN' && activeId !== 'kakao_sehyun_mom') {
      setToastMessage(
        `🔒 ${sehyunName} 대원의 스탬프 도장은 ${sehyunMomName}만 찍어줄 수 있습니다.`
      );
      return;
    }

    const actorName = currentUser?.nickname || (boy === 'HYUNWOO' ? hyunwooMomName : sehyunMomName);

    let targetUpdated: StampMissionItem | null = null;
    const nextMissions = stampMissions.map((m) => {
      if (m.missionId !== missionId) return m;
      const nextHyunwooStamped =
        boy === 'HYUNWOO' ? !m.hyunwooStamped : m.hyunwooStamped;
      const nextSehyunStamped =
        boy === 'SEHYUN' ? !m.sehyunStamped : m.sehyunStamped;

      const updated: StampMissionItem = {
        ...m,
        hyunwooStamped: nextHyunwooStamped,
        sehyunStamped: nextSehyunStamped,
        // Clear pending request when mom grants the stamp
        hyunwooRequested:
          boy === 'HYUNWOO' && nextHyunwooStamped ? false : m.hyunwooRequested,
        sehyunRequested:
          boy === 'SEHYUN' && nextSehyunStamped ? false : m.sehyunRequested,
        updatedBy: actorName
      };
      targetUpdated = updated;
      return updated;
    });

    setStampMissions(nextMissions);
    saveLocalStampMissions(nextMissions);

    if (targetUpdated) {
      const stampedItem = targetUpdated as StampMissionItem;
      const isNowStamped =
        boy === 'HYUNWOO' ? stampedItem.hyunwooStamped : stampedItem.sehyunStamped;
      const boyDisplayName = boy === 'HYUNWOO' ? hyunwooName : sehyunName;
      const momDisplayName = boy === 'HYUNWOO' ? hyunwooMomName : sehyunMomName;
      if (isNowStamped) {
        setToastMessage(
          `🏅 ${momDisplayName}이(가) ${boyDisplayName} 대원 '${stampedItem.title}' 미션 도장을 찍어주었습니다! (+${stampedItem.rewardPoint}점)`
        );
      } else {
        setToastMessage(`↩️ ${boyDisplayName} 대원의 미션 도장이 취소되었습니다.`);
      }
      saveStampMissionToFirestore(stampedItem).catch(() => {});
    }
  };

  const handleToggleStampRequest = (missionId: string, boy: 'HYUNWOO' | 'SEHYUN') => {
    const effective = getEffectivePresetMembers();
    const hyunwooMomName =
      effective.find((m) => m.id === 'kakao_hyunwoo_mom')?.nickname || '현우맘';
    const sehyunMomName =
      effective.find((m) => m.id === 'kakao_sehyun_mom')?.nickname || '세현맘';
    const hyunwooName =
      effective.find((m) => m.id === 'kakao_hyunwoo')?.nickname || '현우';
    const sehyunName =
      effective.find((m) => m.id === 'kakao_sehyun')?.nickname || '세현';

    const activeId = currentUser?.id;

    if (boy === 'HYUNWOO' && activeId !== 'kakao_hyunwoo') {
      setToastMessage(
        `🔒 ${hyunwooName} 대원 본인만 ${hyunwooMomName}에게 스탬프를 요청할 수 있습니다.`
      );
      return;
    }
    if (boy === 'SEHYUN' && activeId !== 'kakao_sehyun') {
      setToastMessage(
        `🔒 ${sehyunName} 대원 본인만 ${sehyunMomName}에게 스탬프를 요청할 수 있습니다.`
      );
      return;
    }

    const actorName = currentUser?.nickname || (boy === 'HYUNWOO' ? hyunwooName : sehyunName);

    let targetUpdated: StampMissionItem | null = null;
    const nextMissions = stampMissions.map((m) => {
      if (m.missionId !== missionId) return m;
      const updated: StampMissionItem = {
        ...m,
        hyunwooRequested:
          boy === 'HYUNWOO' ? !m.hyunwooRequested : m.hyunwooRequested,
        sehyunRequested:
          boy === 'SEHYUN' ? !m.sehyunRequested : m.sehyunRequested,
        updatedBy: actorName
      };
      targetUpdated = updated;
      return updated;
    });

    setStampMissions(nextMissions);
    saveLocalStampMissions(nextMissions);

    if (targetUpdated) {
      const requestedItem = targetUpdated as StampMissionItem;
      const isNowRequested =
        boy === 'HYUNWOO'
          ? requestedItem.hyunwooRequested
          : requestedItem.sehyunRequested;
      const boyDisplayName = boy === 'HYUNWOO' ? hyunwooName : sehyunName;
      const momDisplayName = boy === 'HYUNWOO' ? hyunwooMomName : sehyunMomName;

      if (isNowRequested) {
        setToastMessage(
          `🔔 ${boyDisplayName} 대원이 ${momDisplayName}에게 '${requestedItem.title}' 스탬프 도장을 요청했습니다!`
        );
      } else {
        setToastMessage(
          `↩️ ${momDisplayName}에게 보낸 스탬프 요청이 취소되었습니다.`
        );
      }
      saveStampMissionToFirestore(requestedItem).catch(() => {});
    }
  };

  const handleApproveAllRequestsForBoy = (boy: 'HYUNWOO' | 'SEHYUN') => {
    const effective = getEffectivePresetMembers();
    const hyunwooMomName =
      effective.find((m) => m.id === 'kakao_hyunwoo_mom')?.nickname || '현우맘';
    const sehyunMomName =
      effective.find((m) => m.id === 'kakao_sehyun_mom')?.nickname || '세현맘';
    const hyunwooName =
      effective.find((m) => m.id === 'kakao_hyunwoo')?.nickname || '현우';
    const sehyunName =
      effective.find((m) => m.id === 'kakao_sehyun')?.nickname || '세현';

    const activeId = currentUser?.id;
    if (boy === 'HYUNWOO' && activeId !== 'kakao_hyunwoo_mom') {
      setToastMessage(`🔒 ${hyunwooName} 대원의 요청은 ${hyunwooMomName}만 승인할 수 있습니다.`);
      return;
    }
    if (boy === 'SEHYUN' && activeId !== 'kakao_sehyun_mom') {
      setToastMessage(`🔒 ${sehyunName} 대원의 요청은 ${sehyunMomName}만 승인할 수 있습니다.`);
      return;
    }

    const actorName = currentUser?.nickname || (boy === 'HYUNWOO' ? hyunwooMomName : sehyunMomName);
    const updatedList: StampMissionItem[] = [];

    const nextMissions = stampMissions.map((m) => {
      if (m.isDeleted) return m;
      if (boy === 'HYUNWOO' && !m.hyunwooStamped && m.hyunwooRequested) {
        const updated: StampMissionItem = {
          ...m,
          hyunwooStamped: true,
          hyunwooRequested: false,
          updatedBy: actorName
        };
        updatedList.push(updated);
        return updated;
      }
      if (boy === 'SEHYUN' && !m.sehyunStamped && m.sehyunRequested) {
        const updated: StampMissionItem = {
          ...m,
          sehyunStamped: true,
          sehyunRequested: false,
          updatedBy: actorName
        };
        updatedList.push(updated);
        return updated;
      }
      return m;
    });

    if (updatedList.length === 0) return;

    setStampMissions(nextMissions);
    saveLocalStampMissions(nextMissions);

    const boyDisplayName = boy === 'HYUNWOO' ? hyunwooName : sehyunName;
    const momDisplayName = boy === 'HYUNWOO' ? hyunwooMomName : sehyunMomName;
    setToastMessage(
      `🏅 ${momDisplayName}이(가) ${boyDisplayName} 대원이 요청한 미션 ${updatedList.length}건에 모두 도장을 찍어주었습니다!`
    );

    updatedList.forEach((item) => {
      saveStampMissionToFirestore(item).catch(() => {});
    });
  };

  const handleUpdatePraiseNote = (missionId: string, praiseNote: string) => {
    const actorName = currentUser?.nickname || '원정대 가족';
    let targetUpdated: StampMissionItem | null = null;

    const nextMissions = stampMissions.map((m) => {
      if (m.missionId !== missionId) return m;
      const updated: StampMissionItem = {
        ...m,
        praiseNote,
        updatedBy: actorName
      };
      targetUpdated = updated;
      return updated;
    });

    setStampMissions(nextMissions);
    saveLocalStampMissions(nextMissions);

    if (targetUpdated) {
      setToastMessage('💌 칭찬 응원 메모가 클라우드에 실시간 저장되었습니다.');
      saveStampMissionToFirestore(targetUpdated).catch(() => {});
    }
  };

  const handleAddStampMission = (newMission: {
    dayNumber: number;
    title: string;
    placeTag: string;
    rewardPoint: number;
    praiseNote: string;
  }) => {
    const actorName = currentUser?.nickname || '원정대 가족';
    const created: StampMissionItem = {
      missionId: `mission_custom_${Date.now()}`,
      tripId: TRIP_ID,
      dayNumber: newMission.dayNumber,
      title: newMission.title,
      placeTag: newMission.placeTag,
      rewardPoint: newMission.rewardPoint,
      hyunwooStamped: false,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      praiseNote: newMission.praiseNote,
      updatedBy: actorName,
      isDeleted: false,
      isCustom: true
    };

    const nextMissions = [...stampMissions, created];
    setStampMissions(nextMissions);
    saveLocalStampMissions(nextMissions);
    setToastMessage(`✨ 새 미션 '${created.title}' 항목이 추가되어 전 가족에게 실시간 공유되었습니다!`);
    saveStampMissionToFirestore(created).catch(() => {});
  };

  const handleDeleteStampMission = (missionId: string) => {
    const actorName = currentUser?.nickname || '원정대 가족';
    let deletedTarget: StampMissionItem | null = null;

    const nextMissions = stampMissions.map((m) => {
      if (m.missionId !== missionId) return m;
      const updated: StampMissionItem = {
        ...m,
        isDeleted: true,
        updatedBy: actorName
      };
      deletedTarget = updated;
      return updated;
    });

    setStampMissions(nextMissions);
    saveLocalStampMissions(nextMissions);

    if (deletedTarget) {
      setToastMessage('🗑️ 커스텀 미션이 보드에서 삭제되었습니다.');
      saveStampMissionToFirestore(deletedTarget).catch(() => {});
    }
  };

  const handleResetStampMissions = () => {
    const actorName = currentUser?.nickname || '원정대 가족';
    const resetItems = DEFAULT_STAMP_MISSIONS.map((m) => ({
      ...m,
      hyunwooStamped: false,
      sehyunStamped: false,
      hyunwooRequested: false,
      sehyunRequested: false,
      updatedBy: actorName,
      isDeleted: false
    }));

    setStampMissions(resetItems);
    saveLocalStampMissions(resetItems);
    setToastMessage('🔄 모든 스탬프 미션 도장 및 요청 상태가 기본 상태로 초기화되었습니다.');

    resetItems.forEach((item) => {
      saveStampMissionToFirestore(item).catch(() => {});
    });
  };

  // Header Nav tab handler
  const handleHeaderTab = (tab: 'timeline' | 'map' | 'split' | 'budget' | 'checklist') => {
    setActiveHeaderTab(tab);
    if (tab === 'budget') {
      setBudgetModalView('budget');
      setIsBudgetChecklistOpen(true);
    } else if (tab === 'checklist') {
      setBudgetModalView('checklist');
      setIsBudgetChecklistOpen(true);
    } else if (tab === 'map') {
      switchToMapView();
    } else if (tab === 'timeline') {
      setMobileView('timeline');
    } else if (tab === 'split') {
      setMobileView('split');
    }
  };

  // Start trip with cinematic flight transition
  const handleTriggerFlightAndStart = (dayNum?: number) => {
    const target = dayNum || 1;
    setTargetFlightDay(target);
    setSelectedDayNumber(target);
    setSelectedSpot(null);
    lastActiveSpotIdRef.current = null;
    setTargetFlightView('timeline');
    setIsFlying(true);
  };

  // Open map from landing page with cinematic flight transition
  const handleTriggerFlightAndOpenMap = () => {
    setTargetFlightDay(1);
    setSelectedDayNumber(1);
    setSelectedSpot(null);
    lastActiveSpotIdRef.current = null;
    setTargetFlightView('map');
    setIsFlying(true);
  };

  const handleFlightComplete = useCallback(() => {
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
  }, [targetFlightView]);

  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  if (isLoginPageOpen) {
    return (
      <LoginPage
        initialUser={currentUser}
        onLoginSuccess={handleKakaoLoginSuccess}
        onContinueAsGuest={() => {
          try {
            sessionStorage.setItem('skipped_kakao_login', 'true');
          } catch {}
          setIsLoginPageOpen(false);
          setShowLandingPage(true);
        }}
        canDismiss={!!currentUser}
        onClose={() => {
          setIsLoginPageOpen(false);
          setShowLandingPage(true);
        }}
        onReplayIntro={() => setShowIntro(true)}
      />
    );
  }

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
      <>
        <LandingHeroPage
          days={days}
          onStartTrip={handleTriggerFlightAndStart}
          onOpenMap={handleTriggerFlightAndOpenMap}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginPageOpen(true)}
          onSelectUser={handleKakaoLoginSuccess}
          onReplayIntro={() => setShowIntro(true)}
          onOpenChecklist={() => {
            setShowLandingPage(false);
            try {
              sessionStorage.setItem('entered_trip_app', 'true');
            } catch (e) {}
            setBudgetModalView('checklist');
            setIsBudgetChecklistOpen(true);
          }}
          onOpenFoodGuide={handleOpenFoodGuide}
          scheduleThemeId={scheduleThemeId}
          onSelectScheduleTheme={handleSelectScheduleTheme}
        />
        <StampMissionFloatingButton
          missions={stampMissions}
          onClick={() => setIsStampMissionOpen(true)}
          scheduleThemeId={scheduleThemeId}
          currentUser={currentUser}
          isLandingPage
        />
        <StampMissionModal
          isOpen={isStampMissionOpen}
          onClose={() => setIsStampMissionOpen(false)}
          missions={stampMissions}
          onToggleStamp={handleToggleStamp}
          onToggleStampRequest={handleToggleStampRequest}
          onApproveAllRequestsForBoy={handleApproveAllRequestsForBoy}
          onUpdatePraiseNote={handleUpdatePraiseNote}
          onAddMission={handleAddStampMission}
          onDeleteMission={handleDeleteStampMission}
          onResetMissions={handleResetStampMissions}
          scheduleThemeId={scheduleThemeId}
          currentUser={currentUser}
          initialDayFilter="ALL"
        />
        <TokyoFoodGuideModal
          isOpen={isFoodGuideOpen}
          onClose={() => {
            setIsFoodGuideOpen(false);
            setFoodGuideTargetFoodId(null);
          }}
          scheduleThemeId={scheduleThemeId}
          initialCategory={foodGuideCategory}
          initialFoodId={foodGuideTargetFoodId}
          initialDayFilter="ALL"
        />
        {toastMessage && (
          <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
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
      </>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans pb-20 md:pb-0 w-full max-w-full overflow-x-clip relative transition-colors duration-300 ${currentScheduleTheme.pageBg}`}
    >
      {/* Ambient Backdrop for Intro / Tokyo Night / Cyber / Sakura Dark Themes */}
      <ScheduleAmbientBackdrop themeId={scheduleThemeId} />

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
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginPageOpen(true)}
        onUpdateUser={handleProfileUpdate}
        onLogout={handleKakaoLogout}
        onOpenMobileInstall={() => setIsMobileInstallOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
        onOpenFoodGuide={() => handleOpenFoodGuide('ALL')}
        scheduleThemeId={scheduleThemeId}
      />

      {/* Day Selector Bar */}
      <DaySelector
        days={days}
        selectedDayNumber={selectedDayNumber}
        onSelectDay={(dayNum) => {
          setSelectedDayNumber(dayNum);
          setSelectedSpot(null);
          lastActiveSpotIdRef.current = null;
          lastTimelineScrollYRef.current = 0;
        }}
        onGoHome={() => setShowLandingPage(true)}
        scheduleThemeId={scheduleThemeId}
      />

      {/* Main View Area */}
      <main
        className={`flex-1 max-w-7xl w-full mx-auto relative z-10 transition-all duration-300 ${
          mobileView === 'split'
            ? 'p-2 sm:p-3 md:p-4'
            : mobileView === 'map'
            ? 'p-2 sm:p-3 max-w-6xl'
            : 'p-2 sm:p-4 md:p-6 lg:p-8'
        }`}
      >
        {/* Mobile, Foldable & Desktop View Selector Bar */}
        <div
          className={`flex items-center justify-between gap-1.5 sm:gap-2 p-1.5 rounded-2xl mb-3 sm:mb-4 shadow-2xs w-full max-w-full overflow-hidden transition-colors duration-300 ${currentScheduleTheme.viewBarBg}`}
        >
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
            <button
              onClick={() => {
                setMobileView('timeline');
                setActiveHeaderTab('timeline');
              }}
              className={`flex-1 py-2 px-1 sm:px-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-w-0 ${
                mobileView === 'timeline'
                  ? currentScheduleTheme.viewBtnTimelineActive
                  : currentScheduleTheme.viewBtnInactive
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">일정</span>
              <span className="hidden sm:inline"> 타임라인</span>
            </button>
            <button
              onClick={() => {
                switchToMapView();
              }}
              className={`flex-1 py-2 px-1 sm:px-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-w-0 ${
                mobileView === 'map'
                  ? currentScheduleTheme.viewBtnMapActive
                  : currentScheduleTheme.viewBtnInactive
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {selectedSpot && currentDay?.spots
                  ? `동선 지도 (${currentDay.spots.findIndex((s) => s.id === selectedSpot.id) + 1}번)`
                  : '동선 지도'}
              </span>
            </button>
            <button
              onClick={() => {
                setMobileView('split');
                setActiveHeaderTab('split');
              }}
              className={`flex-1 py-2 px-1 sm:px-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer relative min-w-0 ${
                mobileView === 'split'
                  ? currentScheduleTheme.viewBtnSplitActive
                  : currentScheduleTheme.viewBtnInactive
              }`}
              title="갤럭시 Z폴드 및 태블릿, PC처럼 좌우로 분할하여 타임라인과 지도를 동시에 봅니다"
            >
              <Columns2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">좌우 분할</span>
              <span className="text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded-md shadow-2xs shrink-0 hidden sm:inline">
                Z폴드·PC
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Layout (Timeline, Map, or Side-by-Side Split) */}
        <div
          ref={splitGridRef}
          className="grid grid-cols-12 gap-2.5 sm:gap-4 md:gap-5 items-start relative w-full"
        >
          {/* Left Column: Itinerary Timeline List (Independently scrollable in Split View) */}
          <div
            className={`space-y-4 ${
              mobileView === 'timeline'
                ? 'col-span-12 max-w-4xl mx-auto w-full block'
                : mobileView === 'map'
                ? 'hidden'
                : 'col-span-12 md:col-span-6 lg:col-span-7 block h-[calc(100dvh-13.5rem)] overflow-y-auto pr-1.5 sm:pr-2.5 overscroll-contain scroll-smooth'
            }`}
          >
            {currentDay ? (
              <TimelineView
                currentDay={currentDay}
                selectedSpot={selectedSpot}
                isSplitView={mobileView === 'split'}
                scheduleThemeId={scheduleThemeId}
                onSelectSpot={(spot) => {
                  handleSelectSpot(spot);
                }}
                onOpenSpotMap={(spot) => {
                  switchToMapView(spot);
                }}
                onSpotInView={(spot) => {
                  lastActiveSpotIdRef.current = spot.id;
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
                <div
                  className={`rounded-2xl border p-4 shadow-xs transition-all duration-300 ${currentScheduleTheme.cardBg} ${currentScheduleTheme.cardBorder}`}
                >
                  <div
                    className={`text-xs font-bold mb-2.5 flex items-center justify-between ${currentScheduleTheme.textSecondary}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles
                        className={`w-4 h-4 ${
                          currentScheduleTheme.isDark
                            ? currentScheduleTheme.accentText
                            : 'text-indigo-600'
                        }`}
                      />
                      도쿄 6일간 날씨 예보 (OpenWeatherMap)
                    </span>
                    <span className={`text-[11px] font-normal ${currentScheduleTheme.textMuted}`}>
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
                          className={`p-2.5 rounded-xl border text-center text-xs cursor-pointer transition-all ${
                            isRain
                              ? currentScheduleTheme.isDark
                                ? 'bg-sky-950/60 border-sky-400/50 text-sky-100'
                                : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                              : `${currentScheduleTheme.subCardBg} ${currentScheduleTheme.subCardBorder} ${currentScheduleTheme.textPrimary} ${currentScheduleTheme.cardHover}`
                          }`}
                        >
                          <div className="font-bold text-xs">Day {w.dayNumber}</div>
                          <div className={`text-[10px] font-mono ${currentScheduleTheme.textMuted}`}>
                            {w.date}
                          </div>
                          <div className="font-mono font-bold text-sm my-1">
                            {w.tempDay}° / {w.tempNight}°
                          </div>
                          <div className={`text-[10px] truncate ${currentScheduleTheme.textSecondary}`}>
                            {isRain ? '비 예보' : w.description}
                          </div>
                          {isRain && (
                            <div
                              className={`text-[10px] font-bold mt-1 rounded px-1 py-0.5 ${
                                currentScheduleTheme.isDark
                                  ? 'text-sky-200 bg-sky-500/25'
                                  : 'text-indigo-700 bg-indigo-100/80'
                              }`}
                            >
                              ☔ 실내 추천
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`rounded-2xl border p-5 shadow-xs transition-all duration-300 ${currentScheduleTheme.cardBg} ${currentScheduleTheme.cardBorder}`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-bold uppercase ${
                      currentScheduleTheme.isDark
                        ? currentScheduleTheme.accentText
                        : 'text-indigo-600'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    <span>전체 6일 여정 요약</span>
                  </div>
                  <h2 className={`text-lg font-bold mt-1 ${currentScheduleTheme.textPrimary}`}>
                    도쿄 5박 6일 최적화 동선 총괄
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${currentScheduleTheme.textSecondary}`}>
                    긴시초 롯데시티호텔을 거점으로 나리타 공항 소부선 쾌속 직통부터 아사쿠사, 디즈니씨, 해리포터 스튜디오, 후지산 투어, 쓰키지 및 롯폰기 힐스까지 동선 낭비 없는 스케줄입니다.
                  </p>
                </div>

                <div className="space-y-4">
                  {days.map((day) => (
                    <div
                      key={day.dayNumber}
                      onClick={() => {
                        setSelectedDayNumber(day.dayNumber);
                        setSelectedSpot(null);
                      }}
                      className={`rounded-2xl border p-5 shadow-xs cursor-pointer transition-all ${currentScheduleTheme.cardBg} ${currentScheduleTheme.cardBorder} ${currentScheduleTheme.cardHover}`}
                    >
                      <div
                        className={`flex items-center justify-between border-b pb-3 ${currentScheduleTheme.dividerBorder}`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${currentScheduleTheme.accentBadge}`}
                          >
                            Day {day.dayNumber}
                          </span>
                          <span className={`text-xs font-mono ${currentScheduleTheme.textMuted}`}>
                            {day.date}
                          </span>
                          <h3 className={`text-sm font-bold ${currentScheduleTheme.textPrimary}`}>
                            {day.theme}
                          </h3>
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            currentScheduleTheme.isDark
                              ? currentScheduleTheme.accentText
                              : 'text-indigo-600'
                          }`}
                        >
                          상세보기 →
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {day.spots.map((spot, sIdx) => (
                          <div
                            key={spot.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDayNumber(day.dayNumber);
                              handleSelectSpot(spot);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs transition-colors ${currentScheduleTheme.subCardBg} ${currentScheduleTheme.subCardBorder} ${currentScheduleTheme.cardHover}`}
                          >
                            <span className={`font-bold ${currentScheduleTheme.textSecondary}`}>
                              {sIdx + 1}. {spot.name}
                            </span>
                            <span
                              className={`text-[10px] font-semibold font-mono ${
                                currentScheduleTheme.isDark
                                  ? 'text-amber-300'
                                  : 'text-amber-600'
                              }`}
                            >
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

          {/* Right Column: Interactive Leaflet Route Map (Fixed & Stationary in Split View) */}
          <div
            className={`isolate z-10 ${
              mobileView === 'split'
                ? 'col-span-12 md:col-span-6 lg:col-span-5 block sticky top-14 sm:top-18 self-start h-[calc(100dvh-13.5rem)] flex flex-col justify-start'
                : mobileView === 'timeline'
                ? 'hidden'
                : 'col-span-12 max-w-6xl mx-auto w-full block'
            }`}
          >
            <div className={`space-y-2.5 ${mobileView === 'split' ? 'h-full flex flex-col min-h-0' : 'space-y-3'}`}>
              <RouteMap
                currentDay={currentDay}
                allDays={days}
                selectedSpot={selectedSpot}
                onSelectSpot={(spot) => {
                  handleSelectSpot(spot);
                  const el = document.getElementById(`spot-card-${spot.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }}
                onClearSpot={() => {
                  setSelectedSpot(null);
                }}
                spotSelectionTick={spotSelectionTick}
                viewMode={mobileView}
                isVisible={mobileView === 'map' || mobileView === 'split'}
                className={
                  mobileView === 'split'
                    ? 'flex-1 min-h-[280px] w-full rounded-2xl shadow-sm'
                    : 'h-[540px] sm:h-[620px] md:h-[700px] lg:h-[calc(100vh-10rem)] min-h-[460px] w-full rounded-2xl shadow-sm'
                }
              />

              {/* Selected Spot Quick Info Card below map on desktop & mobile */}
              {selectedSpot && (
                <div
                  className={`rounded-xl border p-2.5 sm:p-3 shadow-xs animate-in fade-in duration-200 shrink-0 ${currentScheduleTheme.cardBg} ${currentScheduleTheme.cardBorder}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="truncate pr-2">
                      <div
                        className={`text-[11px] font-bold flex items-center gap-1.5 ${
                          currentScheduleTheme.isDark
                            ? currentScheduleTheme.accentText
                            : 'text-indigo-600'
                        }`}
                      >
                        <span>선택된 거점</span>
                        {currentDay?.spots && (
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${currentScheduleTheme.accentBadge}`}
                          >
                            순번 {currentDay.spots.findIndex((s) => s.id === selectedSpot.id) + 1}번
                          </span>
                        )}
                      </div>
                      <div className={`text-sm font-bold truncate ${currentScheduleTheme.textPrimary}`}>
                        {selectedSpot.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {mobileView === 'map' && (
                        <button
                          onClick={() => {
                            setMobileView('timeline');
                            setActiveHeaderTab('timeline');
                          }}
                          className="px-2.5 py-1 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                          title="일정 타임라인에서 이 순번 위치로 이동합니다"
                        >
                          <span>일정에서 보기</span>
                          <span>→</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsDetailModalOpen(true)}
                        className={`text-xs font-semibold hover:underline cursor-pointer ${currentScheduleTheme.textSecondary}`}
                      >
                        상세 정보
                      </button>
                      <button
                        onClick={() => setSelectedSpot(null)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${currentScheduleTheme.textMuted} hover:bg-white/10`}
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
        scheduleThemeId={scheduleThemeId}
        onSelectView={(v) => {
          if (v === 'map') {
            switchToMapView();
          } else {
            setMobileView(v);
            setActiveHeaderTab(v);
          }
        }}
        onOpenBudget={() => {
          setBudgetModalView('budget');
          setIsBudgetChecklistOpen(true);
        }}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginPageOpen(true)}
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
        currentUser={currentUser}
        companions={companions}
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
        scheduleThemeId={scheduleThemeId}
        onSelectScheduleTheme={handleSelectScheduleTheme}
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
        scheduleThemeId={scheduleThemeId}
      />

      {/* Bottom-Right Floating Quick Button & Modal for Boys Stamp Mission & Praise Board */}
      <StampMissionFloatingButton
        missions={stampMissions}
        onClick={() => setIsStampMissionOpen(true)}
        scheduleThemeId={scheduleThemeId}
        currentUser={currentUser}
      />

      <StampMissionModal
        isOpen={isStampMissionOpen}
        onClose={() => setIsStampMissionOpen(false)}
        missions={stampMissions}
        onToggleStamp={handleToggleStamp}
        onToggleStampRequest={handleToggleStampRequest}
        onApproveAllRequestsForBoy={handleApproveAllRequestsForBoy}
        onUpdatePraiseNote={handleUpdatePraiseNote}
        onAddMission={handleAddStampMission}
        onDeleteMission={handleDeleteStampMission}
        onResetMissions={handleResetStampMissions}
        scheduleThemeId={scheduleThemeId}
        currentUser={currentUser}
        initialDayFilter={selectedDayNumber || 'ALL'}
      />

      <TokyoFoodGuideModal
        isOpen={isFoodGuideOpen}
        onClose={() => {
          setIsFoodGuideOpen(false);
          setFoodGuideTargetFoodId(null);
        }}
        scheduleThemeId={scheduleThemeId}
        initialCategory={foodGuideCategory}
        initialFoodId={foodGuideTargetFoodId}
        initialDayFilter="ALL"
      />
    </div>
  );
}
