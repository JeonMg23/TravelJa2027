import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { TravelSpot, TripDay } from '../types/travel';
import {
  Navigation,
  MapPin,
  ExternalLink,
  Layers,
  Compass,
  ArrowRight,
  Route,
  CheckCircle2,
  X,
  Footprints,
  Train,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles
} from 'lucide-react';

interface RouteMapProps {
  currentDay: TripDay | null; // null means all days
  allDays: TripDay[];
  selectedSpot: TravelSpot | null;
  onSelectSpot: (spot: TravelSpot) => void;
  isVisible?: boolean;
  className?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  currentDay,
  allDays,
  selectedSpot,
  onSelectSpot,
  isVisible = true,
  className = ''
}) => {
  // Map engine view: 'interactive' (Google Maps Tiles with Blue Route Path) vs 'embed' (Google Maps Direct Embed)
  const [mapEngine, setMapEngine] = useState<'interactive' | 'embed'>('interactive');
  const [mapLayerType, setMapLayerType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isOverlayClosed, setIsOverlayClosed] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.LayerGroup | null>(null);

  // Active spots for the day
  const spotsForDay = useMemo(() => {
    if (currentDay && currentDay.spots.length > 0) {
      return currentDay.spots;
    }
    return allDays.flatMap((d) => d.spots);
  }, [currentDay, allDays]);

  // Active spot
  const activeSpot = useMemo(() => {
    return selectedSpot || spotsForDay[0] || null;
  }, [selectedSpot, spotsForDay]);

  // Reset overlay closed state on spot change
  useEffect(() => {
    setIsOverlayClosed(false);
  }, [selectedSpot]);

  // Google Maps tile URLs
  const googleTileUrl = useMemo(() => {
    // lyrs=m: Google Maps Standard Roadmap, lyrs=y: Google Maps Hybrid Satellite with roads
    const lyrs = mapLayerType === 'roadmap' ? 'm' : 'y';
    return `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`;
  }, [mapLayerType]);

  // External full route URL in Google Maps App / Web
  const externalGoogleRouteUrl = useMemo(() => {
    if (spotsForDay.length === 0) return 'https://www.google.com/maps';
    const origin = encodeURIComponent(spotsForDay[0].name + ' Tokyo');
    const destination = encodeURIComponent(spotsForDay[spotsForDay.length - 1].name + ' Tokyo');
    let waypointsParam = '';
    if (spotsForDay.length > 2) {
      const intermediate = spotsForDay.slice(1, spotsForDay.length - 1);
      waypointsParam = `&waypoints=${intermediate.map((s) => encodeURIComponent(s.name + ' Tokyo')).join('%7C')}`;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=transit`;
  }, [spotsForDay]);

  // External spot URL
  const googleSpotEmbedUrl = useMemo(() => {
    if (!activeSpot) {
      return `https://maps.google.com/maps?q=Tokyo,Japan&t=${mapLayerType === 'roadmap' ? 'm' : 'k'}&z=13&output=embed`;
    }
    const query = activeSpot.japaneseName
      ? `${activeSpot.name} ${activeSpot.japaneseName}`
      : `${activeSpot.name} Tokyo`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      query
    )}&ll=${activeSpot.coordinates[0]},${activeSpot.coordinates[1]}&t=${
      mapLayerType === 'roadmap' ? 'm' : 'k'
    }&z=16&output=embed`;
  }, [activeSpot, mapLayerType]);

  // Safely recompute bounds and fit map
  const fitMapBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.invalidateSize({ pan: false });
    if (spotsForDay.length > 0) {
      if (selectedSpot) {
        map.setView(selectedSpot.coordinates, 15, { animate: false });
      } else {
        const bounds = L.latLngBounds(spotsForDay.map((s) => s.coordinates));
        map.fitBounds(bounds, {
          padding: [45, 45],
          maxZoom: 15,
          animate: false
        });
      }
    }
  };

  // Initialize Leaflet Map with Google Maps Tiles
  useEffect(() => {
    if (mapEngine !== 'interactive') return;
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [35.6967, 139.8143],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Google Maps Tile Layer
      const tileLayer = L.tileLayer(googleTileUrl, {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3']
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const polylineGroup = L.layerGroup().addTo(map);

      tileLayerRef.current = tileLayer;
      markersLayerRef.current = markersGroup;
      polylineLayerRef.current = polylineGroup;
      mapInstanceRef.current = map;
    } else if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(googleTileUrl);
    }

    // ResizeObserver ensures map is always sized correctly
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ pan: false });
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial sizing passes
    const t1 = setTimeout(fitMapBounds, 60);
    const t2 = setTimeout(fitMapBounds, 250);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mapEngine, googleTileUrl]);

  // Handle visibility changes on Mobile & Tablet tab switching
  useEffect(() => {
    if (isVisible && mapEngine === 'interactive') {
      const t1 = setTimeout(fitMapBounds, 50);
      const t2 = setTimeout(fitMapBounds, 180);
      const t3 = setTimeout(fitMapBounds, 400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isVisible, mapEngine, spotsForDay, selectedSpot]);

  // Window resize & device rotation handler
  useEffect(() => {
    const handleResize = () => {
      fitMapBounds();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [spotsForDay, selectedSpot]);

  // Draw Google Maps Blue Route & Numbered Markers
  useEffect(() => {
    if (mapEngine !== 'interactive') return;
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const polylineGroup = polylineLayerRef.current;

    if (!map || !markersGroup || !polylineGroup) return;

    markersGroup.clearLayers();
    polylineGroup.clearLayers();

    if (spotsForDay.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];

    // Add Numbered Markers (1, 2, 3...)
    spotsForDay.forEach((spot, idx) => {
      const isSelected = activeSpot?.id === spot.id;
      const isFood = spot.category === 'food';
      const isAirport = spot.name.includes('공항') || spot.categoryLabel.includes('공항');
      const isHotelReturn = spot.name.includes('숙소 복귀') || spot.categoryLabel === '숙소 복귀';
      const isHotelStart = spot.name.includes('출발') || spot.categoryLabel === '숙소 출발';
      const orderNumber = idx + 1;

      // Google Maps style pin (Airport rose, Hotel return royal indigo, Start sky blue, Food stops warm orange)
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

      const iconHtml = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '38px' : '32px'};
          height: ${isSelected ? '38px' : '32px'};
          border-radius: 9999px;
          background: ${pinColor};
          color: white;
          font-weight: 800;
          font-size: ${isSelected ? '14px' : '12px'};
          box-shadow: 0 4px 12px ${isAirport ? 'rgba(225,29,72,0.5)' : isHotelReturn ? 'rgba(79,70,229,0.5)' : isHotelStart ? 'rgba(2,132,199,0.45)' : isFood ? 'rgba(234,88,12,0.45)' : 'rgba(37,99,235,0.4)'};
          border: 2.5px solid #ffffff;
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
        iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
        iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16]
      });

      const marker = L.marker(spot.coordinates, { icon: customIcon });

      marker.on('click', () => {
        onSelectSpot(spot);
      });

      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 12px; font-weight: 700; padding: 2px 4px; color: #1e293b;">
          ${orderNumber}. ${spot.name} ${isAirport ? '<span style="font-size: 10px; color: #be123c; background: #ffe4e6; padding: 1px 4px; border-radius: 4px; margin-left: 2px; font-weight: 800;">✈️ 공항도착</span>' : isHotelReturn ? '<span style="font-size: 10px; color: #4338ca; background: #e0e7ff; padding: 1px 4px; border-radius: 4px; margin-left: 2px; font-weight: 800;">🏨 숙소복귀</span>' : isHotelStart ? '<span style="font-size: 10px; color: #0369a1; background: #e0f2fe; padding: 1px 4px; border-radius: 4px; margin-left: 2px; font-weight: 800;">🌅 숙소출발</span>' : isFood ? '<span style="font-size: 10px; color: #ea580c; background: #fff7ed; padding: 1px 4px; border-radius: 4px; margin-left: 2px; font-weight: 800;">🍴 추천맛집</span>' : ''} <span style="font-size: 11px; color: #d97706;">★ ${spot.rating.toFixed(1)}</span>
        </div>`,
        { direction: 'top', offset: [0, -18], permanent: false }
      );

      markersGroup.addLayer(marker);
      latLngs.push(spot.coordinates);
    });

    // DRAW THE BLUE ROUTE PATH (파란색 동선 경로 라인)
    if (latLngs.length > 1) {
      // Layer 1: Outer soft blue halo for route visibility
      const outerGlow = L.polyline(latLngs, {
        color: '#1d4ed8',
        weight: 9,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      });
      polylineGroup.addLayer(outerGlow);

      // Layer 2: Main vibrant Google Maps blue route line
      const mainBlueRoute = L.polyline(latLngs, {
        color: '#2563eb', // Google blue
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });
      polylineGroup.addLayer(mainBlueRoute);

      // Layer 3: Dashed navigation trajectory
      const innerDash = L.polyline(latLngs, {
        color: '#ffffff',
        weight: 2,
        opacity: 0.85,
        dashArray: '6, 12',
        lineCap: 'round'
      });
      polylineGroup.addLayer(innerDash);
    }

    // Auto-fit bounds
    if (latLngs.length > 0) {
      if (selectedSpot) {
        map.setView(selectedSpot.coordinates, 15, { animate: true });
      } else {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, {
          padding: [45, 45],
          maxZoom: 15,
          animate: true
        });
      }
    }
  }, [mapEngine, spotsForDay, activeSpot, selectedSpot, onSelectSpot]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    fitMapBounds();
  };

  return (
    <div
      className={`relative isolate z-0 w-full h-full min-h-[440px] sm:min-h-[500px] md:min-h-[580px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col ${className}`}
    >
      {/* Top Map Engine & Spot Ribbon Header */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-1.5">
          {/* Map Mode Switcher */}
          <div className="bg-white/95 backdrop-blur-md p-0.5 sm:p-1 rounded-xl border border-slate-200/90 shadow-sm flex items-center pointer-events-auto">
            <button
              onClick={() => setMapEngine('interactive')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                mapEngine === 'interactive'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>구글 동선 지도</span>
            </button>
            <button
              onClick={() => setMapEngine('embed')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                mapEngine === 'embed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>구글 공식 뷰</span>
            </button>
          </div>

          {/* Right Tools: Satellite Toggle & Zoom / Route Directions */}
          <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
            <button
              onClick={() => setMapLayerType(mapLayerType === 'roadmap' ? 'satellite' : 'roadmap')}
              className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg text-[11px] sm:text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="일반 도로 / 위성 하이브리드 지도 전환"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{mapLayerType === 'roadmap' ? '위성' : '도로'}</span>
            </button>

            {mapEngine === 'interactive' ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomIn}
                  aria-label="지도 확대"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  aria-label="지도 축소"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  aria-label="동선 맞춤"
                  title="동선 전체 맞춤"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            ) : null}

            <a
              href={externalGoogleRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] sm:text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
              title="Google 지도 앱에서 전체 경로 열기"
            >
              <span>길찾기</span>
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
                onClick={() => {
                  onSelectSpot(spot);
                  setIsOverlayClosed(false);
                }}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm border flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
                <span>{isHotelReturn ? `🏨 숙소 복귀` : isHotelStart ? `🌅 숙소 출발` : isFood ? `🍴 ${spot.name}` : spot.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Content Area */}
      {mapEngine === 'interactive' ? (
        /* Interactive Google Maps Tiles with Vibrant Blue Route Polyline */
        <div className="relative w-full h-full min-h-[440px] flex-1 z-0">
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[440px] flex-1 z-0"
            style={{ touchAction: 'pan-x pan-y' }}
          />

          {/* Blue Route Legend & Status Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200/90 shadow-md flex items-center justify-between text-xs pointer-events-auto">
              <div className="flex items-center gap-2 truncate">
                {/* Visual Blue Route Line representation */}
                <div className="flex items-center gap-1 shrink-0 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-4 h-1.5 bg-blue-600 rounded-full" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-blue-700">파란색 동선</span>
                </div>
                <div className="truncate">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {currentDay ? `${currentDay.date} 이동 경로 (${spotsForDay.length}개 거점)` : '전체 6일 동선'}
                  </span>
                  <span className="text-[11px] text-indigo-700 font-bold ml-1.5 hidden sm:inline">
                    · 🏨 숙소 복귀 동선 완비
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleResetView}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="현재 일정의 모든 거점을 지도 화면에 맞춥니다"
                >
                  <Compass className="w-3 h-3 text-blue-600" />
                  <span className="hidden sm:inline">동선 맞춤</span>
                </button>
                <a
                  href={externalGoogleRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
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
        <div className="relative w-full h-full min-h-[440px] flex-1 pt-12 z-0 bg-slate-100">
          <iframe
            key={`${googleSpotEmbedUrl}-${mapLayerType}`}
            title="Google Maps Official Embed"
            src={googleSpotEmbedUrl}
            className="w-full h-full min-h-[440px] border-0 rounded-2xl"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};
