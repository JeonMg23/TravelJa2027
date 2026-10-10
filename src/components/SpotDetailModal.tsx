import React, { useState } from 'react';
import { TravelSpot, RecommendedFood } from '../types/travel';
import {
  X,
  Star,
  Clock,
  MapPin,
  Utensils,
  Lightbulb,
  ExternalLink,
  Heart,
  Save,
  Check,
  Plus
} from 'lucide-react';

interface SpotDetailModalProps {
  isOpen: boolean;
  spot: TravelSpot | null;
  onClose: () => void;
  onToggleLike: (spotId: string) => void;
  onSaveNotes: (spotId: string, notes: string) => void;
  onAddFoodToRoute?: (food: RecommendedFood) => void;
  daySpots?: TravelSpot[];
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  isOpen,
  spot,
  onClose,
  onToggleLike,
  onSaveNotes,
  onAddFoodToRoute,
  daySpots
}) => {
  const [notes, setNotes] = useState(spot?.userNotes || '');
  const [saved, setSaved] = useState(false);

  // Sync notes when spot changes
  React.useEffect(() => {
    if (spot) {
      setNotes(spot.userNotes || '');
    }
  }, [spot]);

  // Handle ESC key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !spot) return null;

  const handleSaveNotes = () => {
    onSaveNotes(spot.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    spot.name + ' Tokyo'
  )}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {spot.categoryLabel}
              </span>
              <span className="flex items-center text-xs font-semibold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                {spot.rating.toFixed(1)}
              </span>
              {spot.openStatus && (
                <span className="text-xs text-emerald-700 font-medium">
                  · {spot.openStatus}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {spot.name}
            </h3>
            {spot.japaneseName && (
              <p className="text-xs text-slate-500 font-normal">
                {spot.japaneseName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Operating hours & Location */}
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {spot.hours && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>운영 시간:</strong> {spot.hours}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{spot.address || '도쿄도 주요 관광권역'}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates[0]},${spot.coordinates[1]}&travelmode=transit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold flex items-center gap-1 text-[11px] transition-colors"
                >
                  <span>구글 길찾기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 text-[11px] transition-colors"
                >
                  <span>Google 지도</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              상세 소개
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              {spot.summary}
            </p>
          </div>

          {/* Travel Tips */}
          {spot.tips && spot.tips.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>현지 핵심 이동 & 방문 팁</span>
              </h4>
              <div className="space-y-1.5">
                {spot.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-600 bg-amber-50/40 border border-amber-100/80 rounded-lg p-2.5 leading-relaxed"
                  >
                    • {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Food */}
          {spot.recommendedFoods && spot.recommendedFoods.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-rose-500" />
                  <span>주변 추천 맛집 및 먹거리</span>
                </h4>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  클릭 시 구글 동선 추가 · 재클릭 시 삭제
                </span>
              </div>
              <div className="space-y-2">
                {spot.recommendedFoods.map((f, idx) => {
                  const isAdded = daySpots?.some(
                    (s) => s.name === f.name || (s.name.includes(f.name) && s.category === 'food')
                  );
                  const addedIndex =
                    (daySpots?.findIndex(
                      (s) => s.name === f.name || (s.name.includes(f.name) && s.category === 'food')
                    ) ?? -1) + 1;

                  return (
                    <div
                      key={idx}
                      onClick={() => onAddFoodToRoute?.(f)}
                      className={`group p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/30 hover:border-rose-400 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300 hover:shadow-xs'
                      }`}
                      title={
                        isAdded
                          ? `'${f.name}' 맛집은 이미 동선(#${addedIndex})에 포함되어 있습니다. 다시 클릭하면 동선에서 삭제됩니다.`
                          : `클릭하여 '${f.name}'을(를) 구글 동선 경로에 추가합니다`
                      }
                    >
                      <div className="font-bold text-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="group-hover:text-blue-700 transition-colors">{f.name}</span>
                          {f.rating && (
                            <span className="text-[10px] text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                              ★{f.rating.toFixed(1)}
                            </span>
                          )}
                          {f.priceRange && (
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {f.priceRange}
                            </span>
                          )}
                        </div>
                        {isAdded ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md shrink-0 transition-colors">
                            <Check className="w-3 h-3 text-emerald-600" />
                            동선 #{addedIndex} (삭제)
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-white group-hover:bg-blue-600 group-hover:text-white px-2 py-0.5 rounded-md border border-blue-200 transition-colors shrink-0 shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                            동선 추가
                          </button>
                        )}
                      </div>

                      <div className="text-slate-700 text-[11px] mt-1 flex items-start gap-1">
                        <span className="text-rose-600 font-semibold shrink-0">대표메뉴:</span>
                        <span className="font-medium">{f.menu}</span>
                      </div>

                      {f.desc && (
                        <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{f.desc}</p>
                      )}

                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>좌표 구글 지도 연동</span>
                        </span>
                        <span className={isAdded ? "text-rose-600 font-semibold group-hover:underline" : "text-blue-600 font-medium group-hover:underline"}>
                          {isAdded ? '✕ 클릭 시 구글 동선에서 삭제' : '+ 구글 동선경로에 추가하기'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group Notes Editor */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                우리 팀 맞춤 메모 (티켓 번호, 예약자명, 쇼핑 목록)
              </label>
              {saved && (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  저장 완료
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="이 장소에 관한 친구들과의 공유 메모를 입력하세요 (예: 14시 예약 완료, 모토무라 규카츠 2인분 등)"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>메모 저장</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => onToggleLike(spot.id)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              spot.hasLiked
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${spot.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>좋아요 ({spot.likes || 0})</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
