import React, { useState } from 'react';
import { TripDay, FriendCompanion } from '../types/travel';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Users,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  UserPlus,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: TripDay[];
  companions: FriendCompanion[];
  onAddCompanion: (name: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  days,
  companions,
  onAddCompanion
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [permissionMode, setPermissionMode] = useState<'editor' | 'viewer'>('editor');
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://tokyo-trip.app';
  const inviteCode = 'TOKYO-2027-NRT';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    onAddCompanion(newFriendName.trim());
    setNewFriendName('');
  };

  // Export to standard iCalendar (.ics) format
  const handleExportICS = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TravelRoute Tokyo//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;
    days.forEach((day) => {
      const dayDateStr = day.fullDate.split(' ')[0].replace(/-/g, ''); // e.g. 20260113
      day.spots.forEach((spot, idx) => {
        icsContent += `BEGIN:VEVENT\n`;
        icsContent += `UID:tokyo-day${day.dayNumber}-${idx}-${Date.now()}@travelroute.app\n`;
        icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
        icsContent += `DTSTART;VALUE=DATE:${dayDateStr}\n`;
        icsContent += `SUMMARY:[도쿄 Day ${day.dayNumber}] ${spot.name}\n`;
        icsContent += `DESCRIPTION:${spot.summary.replace(/\n/g, ' ')}\\n추천: ${spot.tips.join(' ')}\n`;
        icsContent += `LOCATION:${spot.address || spot.name}\n`;
        icsContent += `STATUS:CONFIRMED\n`;
        icsContent += `END:VEVENT\n`;
      });
    });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'tokyo_trip_itinerary_2027.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                친구와 실시간 여행 일정 공유
              </h3>
              <p className="text-xs text-slate-500">
                링크나 초대 코드로 친구들을 초대해 함께 동선을 확인하고 계획하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Share Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>실시간 동기화 공유 링크</span>
              <span className="text-[11px] font-normal text-indigo-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>모든 기기(PC/모바일) 호환</span>
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 select-all font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  copiedLink
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? '복사 완료!' : '링크 복사'}</span>
              </button>
            </div>
          </div>

          {/* Quick Invite Code & QR Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Invite Code */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">
                  트립 공유 코드
                </div>
                <div className="font-mono font-bold text-sm text-slate-900 mt-0.5 tracking-wider">
                  {inviteCode}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '복사됨' : '코드 복사'}</span>
              </button>
            </div>

            {/* Mobile QR Button */}
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-center justify-between hover:bg-indigo-100/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-5 h-5 text-indigo-600" />
                <div>
                  <div className="text-xs font-bold text-indigo-950">
                    모바일 카메라 QR 스캔
                  </div>
                  <div className="text-[10px] text-indigo-700">
                    스마트폰으로 즉시 열기
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                {showQR ? '닫기' : 'QR 보기'}
              </span>
            </button>
          </div>

          {/* QR Code Graphic Box */}
          {showQR && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-150">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs mb-3">
                {/* Clean geometric QR visualization */}
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
                  {/* Outer Frame */}
                  <rect width="100" height="100" fill="white" />
                  {/* Position markers */}
                  <rect x="10" y="10" width="25" height="25" fill="#1e1b4b" rx="4" />
                  <rect x="14" y="14" width="17" height="17" fill="white" rx="2" />
                  <rect x="18" y="18" width="9" height="9" fill="#4f46e5" rx="2" />

                  <rect x="65" y="10" width="25" height="25" fill="#1e1b4b" rx="4" />
                  <rect x="69" y="14" width="17" height="17" fill="white" rx="2" />
                  <rect x="73" y="18" width="9" height="9" fill="#4f46e5" rx="2" />

                  <rect x="10" y="65" width="25" height="25" fill="#1e1b4b" rx="4" />
                  <rect x="14" y="69" width="17" height="17" fill="white" rx="2" />
                  <rect x="18" y="73" width="9" height="9" fill="#4f46e5" rx="2" />

                  {/* QR Data Pattern Dots */}
                  <rect x="42" y="12" width="6" height="6" fill="#1e1b4b" />
                  <rect x="52" y="16" width="6" height="6" fill="#4f46e5" />
                  <rect x="44" y="24" width="8" height="6" fill="#1e1b4b" />
                  <rect x="40" y="36" width="6" height="6" fill="#1e1b4b" />
                  <rect x="52" y="34" width="8" height="8" fill="#4f46e5" />
                  <rect x="64" y="42" width="6" height="6" fill="#1e1b4b" />
                  <rect x="12" y="42" width="6" height="6" fill="#1e1b4b" />
                  <rect x="22" y="46" width="6" height="6" fill="#4f46e5" />
                  <rect x="30" y="52" width="6" height="6" fill="#1e1b4b" />
                  <rect x="44" y="48" width="12" height="6" fill="#1e1b4b" />
                  <rect x="62" y="56" width="8" height="6" fill="#4f46e5" />
                  <rect x="76" y="46" width="10" height="6" fill="#1e1b4b" />
                  <rect x="42" y="66" width="6" height="10" fill="#4f46e5" />
                  <rect x="54" y="68" width="8" height="6" fill="#1e1b4b" />
                  <rect x="70" y="68" width="6" height="8" fill="#1e1b4b" />
                  <rect x="80" y="74" width="8" height="8" fill="#4f46e5" />
                  <rect x="46" y="80" width="12" height="6" fill="#1e1b4b" />
                  <rect x="64" y="82" width="8" height="6" fill="#4f46e5" />
                </svg>
              </div>
              <div className="text-xs font-semibold text-slate-800">
                스마트폰 카메라로 스캔하여 일정 바로 열기
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                별도의 앱 설치 없이 모바일 웹 브라우저에서 반응형으로 작동합니다
              </div>
            </div>
          )}

          {/* Active Companions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>함께 여행 중인 친구들 ({companions.length}명)</span>
              </label>
              <span className="text-[11px] text-emerald-600 font-semibold">
                ● 실시간 동기화 연결됨
              </span>
            </div>

            {/* Companions list */}
            <div className="space-y-2">
              {companions.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center ${comp.avatarColor}`}
                    >
                      {comp.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{comp.name}</span>
                        {comp.isOnline && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {comp.status}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {comp.id === 'user-1' ? '일정 주최자' : '공동 편집자'}
                  </span>
                </div>
              ))}
            </div>

            {/* Add companion input */}
            <form onSubmit={handleAddFriend} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="새 친구 이름 (예: 동현, 지수)"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newFriendName.trim()}
                className="px-3 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center gap-1 disabled:opacity-40 hover:bg-slate-800 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>친구 초대</span>
              </button>
            </form>
          </div>

          {/* Export & Print actions */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
            <button
              onClick={handleExportICS}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>캘린더(.ics) 다운로드</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>일정표 인쇄 / PDF 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
