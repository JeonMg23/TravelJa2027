import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TravelSpot, TripDay } from '../types/travel';
import {
  MapPin,
  ExternalLink,
  Layers,
  Compass,
  Route,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Navigation
} from 'lucide-react';

interface RouteMapProps {
  currentDay: TripDay | null; // null means all days
  allDays: TripDay[];
  selectedSpot: TravelSpot | null;
  onSelectSpot: (spot: TravelSpot) => void;
  onClearSpot?: () => void;
  spotSelectionTick?: number;
  isVisible?: boolean;
  viewMode?: 'timeline' | 'map' | 'split';
  className?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  currentDay,
  allDays,
  selectedSpot,
  onSelectSpot,
  onClearSpot,
  spotSelectionTick = 0,
  isVisible = true,
  viewMode = 'map',
  className = ''
}) => {
  const [mapEngine, setMapEngine] = useState<'interactive' | 'embed'>('interactive');
  const [mapLayerType, setMapLayerType] = useState<'roadmap' | 'satellite' | 'osm'>('roadmap');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Active spots for the day
  const spotsForDay = useMemo(() => {
    if (currentDay && currentDay.spots.length > 0) {
      return currentDay.spots;
    }
    return allDays.flatMap((d) => d.spots);
  }, [currentDay, allDays]);

  // Selected spot validated against current day's spots
  const activeSpot = useMemo(() => {
    if (!selectedSpot) return null;
    const found = spotsForDay.find((s) => s.id === selectedSpot.id);
    return found || selectedSpot;
  }, [selectedSpot, spotsForDay]);

  const activeSpotIndex = useMemo(() => {
    if (!activeSpot) return -1;
    return spotsForDay.findIndex((s) => s.id === activeSpot.id);
  }, [activeSpot, spotsForDay]);

  // Keep latest refs for ResizeObserver and async callbacks
  const activeSpotRef = useRef<TravelSpot | null>(activeSpot);
  activeSpotRef.current = activeSpot;
  const spotsForDayRef = useRef<TravelSpot[]>(spotsForDay);
  spotsForDayRef.current = spotsForDay;
  const isVisibleRef = useRef<boolean>(isVisible);
  isVisibleRef.current = isVisible;

  // Tile URL based on selected layer
  const tileUrl = useMemo(() => {
    if (mapLayerType === 'satellite') {
      return 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }
    if (mapLayerType === 'osm') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    return 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
  }, [mapLayerType]);

  // External route URL in Google Maps App / Web (Selected spot segment or full route)
  const externalGoogleRouteUrl = useMemo(() => {
    if (spotsForDay.length === 0) return 'https://www.google.com/maps';

    // If a specific spot is selected, build directions focused on that spot
    if (activeSpot && activeSpotIndex !== -1) {
      const prevSpot = activeSpotIndex > 0 ? spotsForDay[activeSpotIndex - 1] : null;
      const nextSpot =
        activeSpotIndex < spotsForDay.length - 1 ? spotsForDay[activeSpotIndex + 1] : null;

      if (prevSpot) {
        const origin = encodeURIComponent(prevSpot.name + ' Tokyo');
        const destination = encodeURIComponent(activeSpot.name + ' Tokyo');
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
      } else if (nextSpot) {
        const origin = encodeURIComponent(activeSpot.name + ' Tokyo');
        const destination = encodeURIComponent(nextSpot.name + ' Tokyo');
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
      }
    }

    const origin = encodeURIComponent(spotsForDay[0].name + ' Tokyo');
    const destination = encodeURIComponent(spotsForDay[spotsForDay.length - 1].name + ' Tokyo');
    let waypointsParam = '';
    if (spotsForDay.length > 2) {
      const intermediate = spotsForDay.slice(1, spotsForDay.length - 1);
      waypointsParam = `&waypoints=${intermediate.map((s) => encodeURIComponent(s.name + ' Tokyo')).join('%7C')}`;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=transit`;
  }, [spotsForDay, activeSpot, activeSpotIndex]);

  // External spot URL for embed fallback
  const googleSpotEmbedUrl = useMemo(() => {
    const target = activeSpot || spotsForDay[0] || null;
    if (!target) {
      return 'https://maps.google.com/maps?q=Tokyo,Japan&t=m&z=13&output=embed';
    }
    const query = target.japaneseName
      ? `${target.name} ${target.japaneseName}`
      : `${target.name} Tokyo`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      query
    )}&ll=${target.coordinates[0]},${target.coordinates[1]}&t=${
      mapLayerType === 'satellite' ? 'k' : 'm'
    }&z=16&output=embed`;
  }, [activeSpot, spotsForDay, mapLayerType]);

  // Helper to safely unlock any pending Leaflet zoom/pan animation
  const resetLeafletAnimationLock = (map: L.Map) => {
    try {
      map.stop();
      (map as any)._animatingZoom = false;
      if ((map as any)._panAnim && typeof (map as any)._panAnim.stop === 'function') {
        (map as any)._panAnim.stop();
      }
    } catch {}
  };

  // Fit map to show all spots and full route of the day
  const fitFullRoute = useCallback((animate: boolean = false) => {
    const map = mapInstanceRef.current;
    const container = mapContainerRef.current;
    const currentSpots = spotsForDayRef.current;
    if (!map || !container || currentSpots.length === 0) return;
    if (container.clientWidth === 0 || container.clientHeight === 0) return;

    resetLeafletAnimationLock(map);
    map.invalidateSize({ pan: false });
    const bounds = L.latLngBounds(currentSpots.map((s) => s.coordinates));
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
      animate
    });
  }, []);

  // Focus a single selected spot (e.g. 3번 일정 -> 동선 3번)
  const focusSpot = useCallback((spot: TravelSpot, animate: boolean = false) => {
    const map = mapInstanceRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;
    if (container.clientWidth === 0 || container.clientHeight === 0) return;

    resetLeafletAnimationLock(map);
    map.invalidateSize({ pan: false });
    map.setView(spot.coordinates, 16, { animate });
  }, []);

  // Fit the route segment connected to the selected spot (e.g. 2번 -> 3번 -> 4번)
  const fitSelectedSpotSegment = useCallback((animate: boolean = true) => {
    const map = mapInstanceRef.current;
    const container = mapContainerRef.current;
    const spot = activeSpotRef.current;
    const currentSpots = spotsForDayRef.current;
    if (!map || !container || !spot) return;
    if (container.clientWidth === 0 || container.clientHeight === 0) return;

    resetLeafletAnimationLock(map);
    map.invalidateSize({ pan: false });

    const idx = currentSpots.findIndex((s) => s.id === spot.id);
    if (idx === -1) {
      map.setView(spot.coordinates, 16, { animate });
      return;
    }

    const segmentCoords: [number, number][] = [spot.coordinates];
    if (idx > 0) segmentCoords.push(currentSpots[idx - 1].coordinates);
    if (idx < currentSpots.length - 1) segmentCoords.push(currentSpots[idx + 1].coordinates);

    if (segmentCoords.length > 1) {
      const bounds = L.latLngBounds(segmentCoords);
      map.fitBounds(bounds, {
        padding: [65, 65],
        maxZoom: 16,
        animate
      });
    } else {
      map.setView(spot.coordinates, 16, { animate });
    }
  }, []);

  // Sync map camera to either activeSpot or full route
  const syncCameraToTarget = useCallback(
    (animate: boolean = false) => {
      const map = mapInstanceRef.current;
      const container = mapContainerRef.current;
      if (!map || !container || !isVisibleRef.current) return;
      if (container.clientWidth === 0 || container.clientHeight === 0) return;

      const currentSelected = activeSpotRef.current;
      if (currentSelected) {
        focusSpot(currentSelected, animate);
        const marker = markerMapRef.current.get(currentSelected.id);
        if (marker) {
          marker.openTooltip();
        }
        const tabBtn = document.getElementById(`map-spot-tab-${currentSelected.id}`);
        if (tabBtn) {
          tabBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      } else {
        fitFullRoute(animate);
      }
    },
    [focusSpot, fitFullRoute]
  );

  // 1. Initialize Leaflet Map & ResizeObserver
  useEffect(() => {
    if (mapEngine !== 'interactive') return;
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialSpot = activeSpotRef.current || spotsForDayRef.current[0];
      const map = L.map(mapContainerRef.current, {
        center: initialSpot ? initialSpot.coordinates : [35.6967, 139.8143],
        zoom: activeSpotRef.current ? 16 : 13,
        zoomControl: false,
        attributionControl: false
      });

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 20,
        subdomains: mapLayerType === 'osm' ? ['a', 'b', 'c'] : ['0', '1', '2', '3']
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const polylineGroup = L.layerGroup().addTo(map);

      tileLayerRef.current = tileLayer;
      markersLayerRef.current = markersGroup;
      polylineLayerRef.current = polylineGroup;
      mapInstanceRef.current = map;
    } else if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileUrl);
    }

    // ResizeObserver ensures that when map container transitions from display:none (0x0) to visible,
    // it immediately invalidates size and focuses the selectedSpot!
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || entry.contentRect.width === 0 || entry.contentRect.height === 0) return;
      if (mapInstanceRef.current && isVisibleRef.current) {
        syncCameraToTarget(false);
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    const t1 = setTimeout(() => syncCameraToTarget(false), 60);
    const t2 = setTimeout(() => syncCameraToTarget(false), 220);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mapEngine, tileUrl, syncCameraToTarget]);

  // 2. When visibility, viewMode, day, or selectedSpot changes, sync camera to selectedSpot (or full route if none)
  useEffect(() => {
    if (!isVisible || mapEngine !== 'interactive' || !mapInstanceRef.current) return;

    syncCameraToTarget(false);
    const t1 = setTimeout(() => syncCameraToTarget(false), 50);
    const t2 = setTimeout(() => syncCameraToTarget(false), 180);
    const t3 = setTimeout(() => syncCameraToTarget(false), 350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible, viewMode, currentDay, spotsForDay, activeSpot?.id, spotSelectionTick, mapEngine, syncCameraToTarget]);

  // 3. Draw Numbered Markers & Connected Blue Route Polyline (Highlighting Selected Spot Route)
  useEffect(() => {
    if (mapEngine !== 'interactive') return;
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const polylineGroup = polylineLayerRef.current;

    if (!map || !markersGroup || !polylineGroup) return;

    markersGroup.clearLayers();
    polylineGroup.clearLayers();
    markerMapRef.current.clear();

    if (spotsForDay.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];

    // Add Numbered Markers (1, 2, 3...)
    spotsForDay.forEach((spot, idx) => {
      const isSelected = activeSpot?.id === spot.id;
      const isNeighborOfSelected =
        activeSpotIndex !== -1 && (idx === activeSpotIndex - 1 || idx === activeSpotIndex + 1);
      const isFood = spot.category === 'food';
      const isAirport = spot.name.includes('공항') || spot.categoryLabel.includes('공항');
      const isHotelReturn = spot.name.includes('숙소 복귀') || spot.categoryLabel === '숙소 복귀';
      const isHotelStart = spot.name.includes('출발') || spot.categoryLabel === '숙소 출발';
      const orderNumber = idx + 1;

      const pinColor = isSelected
        ? '#2563eb'
        : isAirport
          ? '#e11d48'
          : isHotelReturn
            ? '#4f46e5'
            : isHotelStart
              ? '#0284c7'
              : isFood
                ? '#ea580c'
                : '#1e3a8a';

      const markerOpacity = activeSpot && !isSelected && !isNeighborOfSelected ? '0.72' : '1';

      const iconHtml = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '42px' : '32px'};
          height: ${isSelected ? '42px' : '32px'};
          border-radius: 9999px;
          background: ${pinColor};
          color: white;
          font-weight: 800;
          font-size: ${isSelected ? '15px' : '12px'};
          opacity: ${markerOpacity};
          box-shadow: ${
            isSelected
              ? '0 0 0 6px rgba(37, 99, 235, 0.28), 0 6px 16px rgba(37, 99, 235, 0.55)'
              : `0 4px 12px ${
                  isAirport
                    ? 'rgba(225,29,72,0.5)'
                    : isHotelReturn
                      ? 'rgba(79,70,229,0.5)'
                      : isHotelStart
                        ? 'rgba(2,132,199,0.45)'
                        : isFood
                          ? 'rgba(234,88,12,0.45)'
                          : 'rgba(37,99,235,0.4)'
                }`
          };
          border: ${isSelected ? '3px solid #fde047' : '2.5px solid #ffffff'};
          transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        ">
          ${isAirport ? `<span style="font-size: 11px; margin-right: 1px;">✈️</span>` : isHotelReturn ? `<span style="font-size: 11px; margin-right: 1px;">🏨</span>` : isHotelStart ? `<span style="font-size: 11px; margin-right: 1px;">🌅</span>` : isFood ? `<span style="font-size: 11px; margin-right: 1px;">🍴</span>` : ''}${orderNumber}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [isSelected ? 42 : 32, isSelected ? 42 : 32],
        iconAnchor: [isSelected ? 21 : 16, isSelected ? 21 : 16]
      });

      const marker = L.marker(spot.coordinates, {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : isNeighborOfSelected ? 500 : 0
      });

      marker.on('click', () => {
        onSelectSpot(spot);
        focusSpot(spot, true);
      });

      marker.bindTooltip(
        isSelected
          ? `<div style="font-family: inherit; font-size: 12px; font-weight: 800; padding: 3px 6px; color: #0f172a; display: flex; align-items: center; gap: 5px;">
              <span style="background: #2563eb; color: #ffffff; padding: 1px 6px; border-radius: 9999px; font-size: 10px; font-weight: 900;">동선 ${orderNumber}번</span>
              <span>${spot.name}</span>
              <span style="font-size: 11px; color: #d97706;">★ ${spot.rating.toFixed(1)}</span>
            </div>`
          : `<div style="font-family: inherit; font-size: 12px; font-weight: 700; padding: 2px 4px; color: #1e293b;">
              ${orderNumber}. ${spot.name} <span style="font-size: 11px; color: #d97706;">★ ${spot.rating.toFixed(1)}</span>
            </div>`,
        { direction: 'top', offset: [0, isSelected ? -22 : -18], permanent: isSelected }
      );

      markerMapRef.current.set(spot.id, marker);
      if (isSelected && isVisibleRef.current) {
        setTimeout(() => {
          marker.openTooltip();
        }, 60);
      }

      markersGroup.addLayer(marker);
      latLngs.push(spot.coordinates);
    });

    // DRAW THE BLUE ROUTE PATH (파란색 동선 경로 라인)
    if (latLngs.length > 1) {
      if (activeSpot && activeSpotIndex !== -1) {
        // When a specific spot (e.g. 3번 일정) is selected:
        // 1) Draw full day route softly in background for overall context
        const bgRoute = L.polyline(latLngs, {
          color: '#64748b',
          weight: 4,
          opacity: 0.35,
          dashArray: '4, 8',
          lineCap: 'round',
          lineJoin: 'round'
        });
        polylineGroup.addLayer(bgRoute);

        // 2) Highlight the active route segment connected to the selected spot (prev -> selected -> next)
        const segmentPoints: L.LatLngExpression[] = [];
        if (activeSpotIndex > 0) {
          segmentPoints.push(spotsForDay[activeSpotIndex - 1].coordinates);
        }
        segmentPoints.push(spotsForDay[activeSpotIndex].coordinates);
        if (activeSpotIndex < spotsForDay.length - 1) {
          segmentPoints.push(spotsForDay[activeSpotIndex + 1].coordinates);
        }

        if (segmentPoints.length > 1) {
          const activeOuterGlow = L.polyline(segmentPoints, {
            color: '#1d4ed8',
            weight: 12,
            opacity: 0.4,
            lineCap: 'round',
            lineJoin: 'round'
          });
          polylineGroup.addLayer(activeOuterGlow);

          const activeMainRoute = L.polyline(segmentPoints, {
            color: '#2563eb',
            weight: 6,
            opacity: 0.98,
            lineCap: 'round',
            lineJoin: 'round'
          });
          polylineGroup.addLayer(activeMainRoute);

          const activeInnerDash = L.polyline(segmentPoints, {
            color: '#ffffff',
            weight: 2.5,
            opacity: 0.9,
            dashArray: '6, 10',
            lineCap: 'round'
          });
          polylineGroup.addLayer(activeInnerDash);
        }
      } else {
        // Full Day Route Mode (No single spot selected)
        const outerGlow = L.polyline(latLngs, {
          color: '#1d4ed8',
          weight: 9,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        });
        polylineGroup.addLayer(outerGlow);

        const mainBlueRoute = L.polyline(latLngs, {
          color: '#2563eb',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        });
        polylineGroup.addLayer(mainBlueRoute);

        const innerDash = L.polyline(latLngs, {
          color: '#ffffff',
          weight: 2,
          opacity: 0.85,
          dashArray: '6, 12',
          lineCap: 'round'
        });
        polylineGroup.addLayer(innerDash);
      }
    }
  }, [mapEngine, spotsForDay, activeSpot, activeSpotIndex, onSelectSpot, focusSpot]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    if (onClearSpot) {
      onClearSpot();
    }
    fitFullRoute(true);
  };

  const cycleLayer = () => {
    if (mapLayerType === 'roadmap') setMapLayerType('satellite');
    else if (mapLayerType === 'satellite') setMapLayerType('osm');
    else setMapLayerType('roadmap');
  };

  return (
    <div
      id="route-map-section"
      className={`relative isolate z-0 w-full h-full min-h-[300px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col ${className}`}
    >
      {/* Top Map Engine & Spot Ribbon Header */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          {/* Map Mode Switcher */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-sm flex items-center pointer-events-auto">
            <button
              onClick={() => setMapEngine('interactive')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mapEngine === 'interactive'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>{activeSpot && activeSpotIndex !== -1 ? `동선 ${activeSpotIndex + 1}번 지도` : '동선 지도'}</span>
            </button>
            <button
              onClick={() => setMapEngine('embed')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mapEngine === 'embed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>구글 공식 뷰</span>
            </button>
          </div>

          {/* Right Tools: Layer Toggle & Zoom / Route Directions */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={cycleLayer}
              className="px-2.5 py-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="지도 레이어 전환: 일반 도로망 / 위성 하이브리드 / 오픈스트리트맵"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {mapLayerType === 'roadmap' ? '도로망' : mapLayerType === 'satellite' ? '위성' : 'OSM'}
              </span>
            </button>

            {mapEngine === 'interactive' ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomIn}
                  aria-label="지도 확대"
                  className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  aria-label="지도 축소"
                  className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                {activeSpot && (
                  <button
                    onClick={() => fitSelectedSpotSegment(true)}
                    title="선택된 일정과 앞뒤 이동 구간을 한눈에 봅니다"
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">구간 동선</span>
                  </button>
                )}
                <button
                  onClick={handleResetView}
                  aria-label="전체 동선 맞춤"
                  title="선택을 해제하고 현재 날짜의 전체 일정 동선을 한눈에 맞춥니다"
                  className="px-2.5 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-blue-700 font-bold text-xs shadow-sm flex items-center gap-1 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">전체 동선</span>
                </button>
              </div>
            ) : null}

            <a
              href={externalGoogleRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
              title="Google 지도 앱에서 경로 열기"
            >
              <span>{activeSpot && activeSpotIndex !== -1 ? `동선 ${activeSpotIndex + 1}번 길찾기` : '길찾기'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Spot Quick Navigator Ribbon */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 py-0.5 pointer-events-auto">
          {spotsForDay.map((spot, idx) => {
            const isSelected = activeSpot?.id === spot.id;
            const isFood = spot.category === 'food';
            const isHotelReturn = spot.name.includes('숙소 복귀') || spot.categoryLabel === '숙소 복귀';
            const isHotelStart = spot.name.includes('출발') || spot.categoryLabel === '숙소 출발';
            return (
              <button
                key={spot.id}
                id={`map-spot-tab-${spot.id}`}
                onClick={() => {
                  onSelectSpot(spot);
                  focusSpot(spot, true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm border flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? isHotelReturn
                      ? 'bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-500/30'
                      : isHotelStart
                        ? 'bg-sky-600 border-sky-600 text-white ring-2 ring-sky-500/30'
                        : 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-500/30'
                    : isHotelReturn
                      ? 'bg-indigo-50/95 backdrop-blur-md border-indigo-300 text-indigo-950 hover:bg-indigo-100 font-bold'
                      : isHotelStart
                        ? 'bg-sky-50/95 backdrop-blur-md border-sky-200 text-sky-950 hover:bg-sky-100 font-semibold'
                        : isFood
                          ? 'bg-orange-50/95 backdrop-blur-md border-orange-200 text-orange-950 hover:bg-orange-100'
                          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isSelected
                      ? 'bg-white text-indigo-600'
                      : isHotelReturn
                        ? 'bg-indigo-600 text-white'
                        : isHotelStart
                          ? 'bg-sky-600 text-white'
                          : isFood
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </span>
                <span>{isHotelReturn ? '🏨 숙소 복귀' : isHotelStart ? '🌅 숙소 출발' : isFood ? `🍴 ${spot.name}` : spot.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Content Area */}
      {mapEngine === 'interactive' ? (
        <div className="relative w-full h-full min-h-[300px] flex-1 z-0">
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[300px] flex-1 z-0"
            style={{ touchAction: 'pan-x pan-y' }}
          />

          {/* Blue Route Legend & Status Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-md flex items-center justify-between gap-2 text-xs pointer-events-auto">
              <div className="flex items-center gap-2 truncate min-w-0">
                {activeSpot && activeSpotIndex !== -1 ? (
                  <>
                    <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 bg-blue-600 text-white rounded-lg shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                      <span className="text-[11px] font-extrabold">동선 {activeSpotIndex + 1}번</span>
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {activeSpot.name}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1.5 hidden sm:inline">
                        (선택된 일정 집중 동선)
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="w-3.5 h-1.5 bg-blue-600 rounded-full" />
                      <span className="text-[11px] font-bold text-blue-700">전체 동선</span>
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {currentDay ? `${currentDay.date} 전체 이동 경로 (${spotsForDay.length}개 거점)` : '전체 동선'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeSpot && (
                  <button
                    onClick={() => focusSpot(activeSpot, true)}
                    className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    title="선택된 일정 위치로 다시 초점을 맞춥니다"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{activeSpotIndex !== -1 ? `${activeSpotIndex + 1}번 초점` : '거점 초점'}</span>
                  </button>
                )}
                <button
                  onClick={handleResetView}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="선택을 해제하고 현재 일정의 모든 거점을 지도 화면에 맞춥니다"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>전체 동선 보기</span>
                </button>
                <a
                  href={externalGoogleRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                >
                  <span>Google 길찾기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Google Maps Official Embed View */
        <div className="relative w-full h-full min-h-[300px] flex-1 pt-12 z-0 bg-slate-100">
          <iframe
            key={`${googleSpotEmbedUrl}-${mapLayerType}`}
            title="Google Maps Official Embed"
            src={googleSpotEmbedUrl}
            className="w-full h-full min-h-[300px] border-0 rounded-2xl"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

