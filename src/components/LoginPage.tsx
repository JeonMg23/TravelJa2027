import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';
import { KakaoAuthUser } from '../types/auth';
import {
  KAKAO_PRESET_MEMBERS,
  createKakaoUserFromPreset,
  createCustomKakaoUser
} from '../services/kakaoAuth';

interface LoginPageProps {
  onLoginSuccess: (user: KakaoAuthUser) => void;
  onContinueAsGuest?: () => void;
  initialUser?: KakaoAuthUser | null;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  onClose,
  canDismiss = false
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('kakao_hyunwoo_mom');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customNickname, setCustomNickname] = useState('');

  // Preset Member Login
  const handlePresetLogin = (presetId?: string) => {
    const idToUse = presetId || selectedPresetId;
    const user = createKakaoUserFromPreset(idToUse);
    onLoginSuccess(user);
  };

  // Custom Nickname Login
  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNickname.trim()) return;
    const user = createCustomKakaoUser(customNickname.trim(), 'MEMBER', '💬');
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-slate-950 text-white flex flex-col justify-between font-sans select-none z-50">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-48 bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* 1. Header (Compact Single-line) */}
      <header className="relative z-10 h-12 px-4 sm:px-6 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center font-black text-xs">
            ⚡
          </div>
          <span className="font-black text-xs sm:text-sm tracking-tight text-white">
            개구쟁이들의 일본여행
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {onContinueAsGuest && (
            <button
              onClick={onContinueAsGuest}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors cursor-pointer"
            >
              둘러보기 →
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Center Card (Strictly fit without scroll) */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-2 w-full max-w-sm mx-auto overflow-hidden">
        {/* Title */}
        <div className="text-center mb-3 sm:mb-4 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#FEE500] text-[#191919] mx-auto flex items-center justify-center mb-2 shadow-md shadow-[#FEE500]/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            도쿄 원정대 로그인
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            접속하실 프로필을 선택해 주세요
          </p>
        </div>

        {/* Profiles Card (2x2 Grid for compact viewport fitting) */}
        <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md shrink-0">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {KAKAO_PRESET_MEMBERS.map((member) => {
              const isSelected = selectedPresetId === member.id;
              const isAdmin = member.tag === '관리자';

              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedPresetId(member.id)}
                  onDoubleClick={() => handlePresetLogin(member.id)}
                  className={`relative p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm ring-1 ring-amber-400 scale-[1.02]'
                      : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    </div>
                  )}

                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl ${member.avatarColor} text-white flex items-center justify-center text-base font-bold shadow-xs mb-1.5 shrink-0`}
                  >
                    {member.avatarEmoji}
                  </div>

                  {/* Nickname */}
                  <span className="font-black text-sm text-white leading-tight">
                    {member.nickname}
                  </span>

                  {/* Role Tag */}
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold mt-1 ${
                      isAdmin
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-slate-800 text-slate-300 border border-white/10'
                    }`}
                  >
                    {member.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Big Yellow Kakao Login Button */}
          <button
            type="button"
            onClick={() => handlePresetLogin()}
            className="w-full py-3 px-4 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] font-black text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.185 4.673 6.541-.205.772-.743 2.784-.852 3.223-.134.542.198.536.417.391.173-.115 2.756-1.871 3.865-2.628.625.088 1.267.135 1.897.135 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" />
            </svg>
            <span>카카오톡으로 시작하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Options (Clean & Subtle) */}
        <div className="flex items-center justify-center gap-3 mt-3 shrink-0 text-[11px] text-slate-400">
          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="hover:text-slate-200 underline underline-offset-2 cursor-pointer"
            >
              로그인 없이 둘러보기
            </button>
          )}
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="hover:text-slate-200 cursor-pointer"
          >
            다른 닉네임 입력
          </button>
        </div>
      </main>

      {/* 3. Footer (Ultra Compact) */}
      <footer className="relative z-10 h-8 flex items-center justify-center text-[10px] text-slate-400 border-t border-white/5 shrink-0">
        개구쟁이들의 일본여행 (도쿄 5박 6일)
      </footer>

      {/* Optional: Compact Custom Nickname Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-4 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white">닉네임 직접 입력</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <input
                type="text"
                value={customNickname}
                onChange={(e) => setCustomNickname(e.target.value)}
                placeholder="카카오 닉네임 입력"
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                maxLength={15}
                autoFocus
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!customNickname.trim()}
                  className="flex-1 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] text-xs font-black transition-colors cursor-pointer disabled:opacity-40"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
