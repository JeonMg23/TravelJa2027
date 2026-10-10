import React, { useState } from 'react';
import { TravelSpot, SpotCategory } from '../types/travel';
import { X, Plus, MapPin, Star } from 'lucide-react';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  onAddSpot: (dayNumber: number, spot: TravelSpot) => void;
}

export const AddSpotModal: React.FC<AddSpotModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  onAddSpot
}) => {
  const [name, setName] = useState('');
  const [japaneseName, setJapaneseName] = useState('');
  const [category, setCategory] = useState<SpotCategory>('food');
  const [rating, setRating] = useState('4.5');
  const [hours, setHours] = useState('11:00 ~ 21:00');
  const [summary, setSummary] = useState('');
  const [tip, setTip] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodMenu, setFoodMenu] = useState('');

  if (!isOpen) return null;

  const categoryLabels: Record<SpotCategory, string> = {
    hotel: '호텔/숙소',
    park: '공원/자연',
    temple: '사찰/명소',
    observatory: '전망대/야경',
    amusement: '테마파크/엔터테인먼트',
    station: '교통/기차역',
    market: '전통시장/수산',
    nature: '자연관광',
    shopping: '쇼핑/백화점',
    food: '맛집/카페'
  };

  // Rough default coords centered in Tokyo
  const defaultCoords: [number, number] = [35.6895, 139.75];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSpot: TravelSpot = {
      id: `spot-${dayNumber}-${Date.now()}`,
      name: name.trim(),
      japaneseName: japaneseName.trim() || undefined,
      category,
      categoryLabel: categoryLabels[category],
      rating: parseFloat(rating) || 4.5,
      openStatus: 'Open',
      hours: hours.trim() || undefined,
      summary: summary.trim() || `${name} 방문 일정입니다.`,
      tips: tip.trim() ? [tip.trim()] : [],
      recommendedFoods: foodName.trim()
        ? [{ name: foodName.trim(), menu: foodMenu.trim() || '추천 대표 메뉴' }]
        : [],
      coordinates: defaultCoords,
      address: '도쿄도 내 위치',
      likes: 1,
      hasLiked: false
    };

    onAddSpot(dayNumber, newSpot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Day {dayNumber}에 새로운 장소 추가
            </h3>
            <p className="text-xs text-slate-500">
              방문하고 싶은 맛집, 쇼핑몰, 관광지를 동선에 추가하세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                장소 / 상호명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 긴자 렌가테이, 메이지 신궁"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                일본어 표기 (선택)
              </label>
              <input
                type="text"
                placeholder="예: 煉瓦亭"
                value={japaneseName}
                onChange={(e) => setJapaneseName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SpotCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                평점 (별점)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                영업/운영 시간
              </label>
              <input
                type="text"
                placeholder="예: 11:00 ~ 21:00"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              장소 요약 및 방문 목적
            </label>
            <textarea
              rows={2}
              placeholder="예: 도쿄 최고의 오므라이스 원조 노포 식당으로 1895년 창업한 전통 레스토랑"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              여행 이동 & 방문 꿀팁
            </label>
            <input
              type="text"
              placeholder="예: 브레이크 타임 15:00~17:00 주의, 11시 오픈런 권장"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700">
              주변 맛집 / 추천 메뉴 (선택)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="식당명 (예: 렌가테이)"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
              />
              <input
                type="text"
                placeholder="대표 메뉴 (예: 원조 포크 카츠레츠)"
                value={foodMenu}
                onChange={(e) => setFoodMenu(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>장소 일정에 추가하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
