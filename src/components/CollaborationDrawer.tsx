import React, { useState } from 'react';
import { SpotComment, TravelSpot, TripDay, FriendCompanion } from '../types/travel';
import { KakaoAuthUser } from '../types/auth';
import { X, MessageSquare, Send, Sparkles, User, MapPin, Smartphone, Laptop, Tablet } from 'lucide-react';

interface CollaborationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: SpotComment[];
  days: TripDay[];
  onAddComment: (spotId: string, spotName: string, text: string) => void;
  currentUser?: KakaoAuthUser | null;
  companions?: FriendCompanion[];
}

export const CollaborationDrawer: React.FC<CollaborationDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  days,
  onAddComment,
  currentUser,
  companions = []
}) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string>('general');
  const [commentText, setCommentText] = useState('');

  if (!isOpen) return null;

  // Flatten all spots for quick dropdown selection
  const allSpots: TravelSpot[] = [];
  days.forEach((d) => allSpots.push(...d.spots));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    let targetSpotName = '전체 여행 메모';
    if (selectedSpotId !== 'general') {
      const found = allSpots.find((s) => s.id === selectedSpotId);
      if (found) targetSpotName = found.name;
    }

    onAddComment(selectedSpotId, targetSpotName, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-[1200] flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                실시간 친구 여행 피드 & 메모
              </h3>
              <p className="text-[11px] text-slate-500">
                장소별 웨이팅 정보 및 아이디어를 실시간 공유합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User & Active Devices Banner */}
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {currentUser ? `${currentUser.nickname} (내 계정)` : '게스트 모드'}
              </div>
              <div className="text-[10px] text-amber-800 truncate">
                {currentUser ? `📱 ${currentUser.device.name} 접속 중` : '카카오 로그인으로 접속자 표시'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700">
              {companions.filter((c) => c.isOnline).length || 1}명 접속 중
            </span>
          </div>
        </div>

        {/* Comment list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              아직 등록된 실시간 메모가 없습니다.<br />
              친구들과 장소별 팁을 남겨보세요!
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full text-white font-bold text-[10px] flex items-center justify-center ${comment.avatarColor}`}
                    >
                      {comment.author[0]}
                    </div>
                    <span className="font-bold text-slate-800">
                      {comment.author}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {comment.timestamp}
                  </span>
                </div>

                {comment.spotName && comment.spotName !== '전체 여행 메모' && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    <span>{comment.spotName}</span>
                  </div>
                )}

                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
              대상 장소:
            </span>
            <select
              value={selectedSpotId}
              onChange={(e) => setSelectedSpotId(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="general">전체 여행 공통 메모</option>
              {allSpots.map((spot) => (
                <option key={spot.id} value={spot.id}>
                  {spot.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={currentUser ? `${currentUser.nickname}님의 실시간 팁 작성...` : '친구들과 나눌 실시간 팁 작성...'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1 hover:bg-indigo-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>전송</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
