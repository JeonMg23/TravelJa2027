import React, { useState } from 'react';
import { DayWeather } from '../types/travel';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Droplets,
  Wind,
  Umbrella,
  Compass,
  AlertTriangle,
  Settings,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface WeatherWidgetProps {
  weather: DayWeather;
  isLive: boolean;
  onRefresh: () => void;
  onSaveApiKey: (key: string) => void;
  savedApiKey: string;
  onToggleSimulatedRain: (isRain: boolean) => void;
  isSimulatedRain: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  isLive,
  onRefresh,
  onSaveApiKey,
  savedApiKey,
  onToggleSimulatedRain,
  isSimulatedRain
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(savedApiKey);
  const [showIndoorList, setShowIndoorList] = useState(true);
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Check if today has rain forecast or simulated rain
  const isRainyDay = isSimulatedRain || weather.condition === 'Rain' || weather.rainProbability >= 50;

  const getWeatherIcon = () => {
    if (isRainyDay) {
      return <CloudRain className="w-6 h-6 text-indigo-500 animate-pulse" />;
    }
    switch (weather.condition) {
      case 'Clear':
        return <Sun className="w-6 h-6 text-amber-500" />;
      case 'Clouds':
        return <Cloud className="w-6 h-6 text-slate-500" />;
      case 'Snow':
        return <Snowflake className="w-6 h-6 text-sky-400" />;
      default:
        return <Sun className="w-6 h-6 text-amber-500" />;
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(apiKeyInput.trim());
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowConfig(false);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      {/* Weather Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Weather condition & Temperature */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              {getWeatherIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  {weather.date} 도쿄 날씨
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {isLive ? '● OpenWeatherMap 실시간' : '도쿄 1월 표준 예보'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {weather.tempDay}°C
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / 최저 {weather.tempNight}°C
                </span>
                <span className="text-xs font-semibold text-slate-700 ml-1">
                  {isRainyDay ? '비 예보 (우산 지참)' : weather.description}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Metrics & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            {/* Precipitation probability */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <Umbrella
                className={`w-3.5 h-3.5 ${isRainyDay ? 'text-indigo-600' : 'text-slate-400'}`}
              />
              <span className="text-slate-500 font-medium">강수확률</span>
              <span
                className={`font-mono font-bold ${
                  isRainyDay ? 'text-indigo-600' : 'text-slate-800'
                }`}
              >
                {isRainyDay ? Math.max(weather.rainProbability, 80) : weather.rainProbability}%
              </span>
            </div>

            {/* Humidity */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-slate-500 font-medium">습도</span>
              <span className="font-mono font-bold text-slate-800">
                {weather.humidity}%
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Rain simulation toggle */}
              <button
                onClick={() => onToggleSimulatedRain(!isSimulatedRain)}
                title={isSimulatedRain ? '맑은 날씨로 복원' : '비 예보 상황 시뮬레이션'}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  isSimulatedRain
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Umbrella className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">
                  {isSimulatedRain ? '비 모드 ON' : '비 예보 테스트'}
                </span>
              </button>

              {/* Settings button */}
              <button
                onClick={() => setShowConfig(!showConfig)}
                title="오픈웨더맵 API 키 설정"
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* API Key Config Dropdown */}
        {showConfig && (
          <form
            onSubmit={handleSaveKey}
            className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2 text-xs"
          >
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="OpenWeatherMap API Key (무료 키 입력 시 실시간 날씨 연동)"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-slate-50 font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                {keySavedToast ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{keySavedToast ? '저장됨' : '키 저장'}</span>
              </button>
              <button
                type="button"
                onClick={onRefresh}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>새로고침</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Rain Alert & Indoor Recommendations Notification */}
      {isRainyDay && (
        <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 border border-indigo-200 rounded-2xl p-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Umbrella className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-900">
                    ☔ 비 예보 알림: 당일 강수확률 {Math.max(weather.rainProbability, 80)}%
                  </span>
                  <span className="text-[10px] bg-indigo-200/80 text-indigo-900 font-semibold px-2 py-0.5 rounded-full">
                    접이식 우산 추천
                  </span>
                </div>
                <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                  비가 예보되어 야외 활동이 다소 불편할 수 있습니다. 당일 일정에 맞춘 <strong>실내 대체 활동 & 복합몰 코스</strong>를 추천해 드립니다!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIndoorList(!showIndoorList)}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold p-1 shrink-0 flex items-center gap-0.5"
            >
              <span>{showIndoorList ? '접기' : '추천 보기'}</span>
              {showIndoorList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Indoor Recommendations List */}
          {showIndoorList && (
            <div className="mt-3 pt-3 border-t border-indigo-200/70 space-y-2">
              <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Day {weather.dayNumber} 맞춤 실내 추천 코스</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {weather.indoorTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/90 border border-indigo-100 shadow-2xs text-xs text-slate-700 flex items-start gap-2"
                  >
                    <span className="text-indigo-600 font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
