import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Sparkles, RotateCcw, Upload, Users, UserCheck } from 'lucide-react';
import { KakaoAuthUser } from '../types/auth';
import {
  CHARACTER_AVATARS,
  CHARACTER_CATEGORIES,
  CharacterCategory,
  getCharacterAvatarById,
  DEFAULT_MEMBER_AVATAR_MAP
} from '../data/characterAvatars';
import {
  KAKAO_PRESET_MEMBERS,
  getEffectivePresetMembers,
  createKakaoUserFromPreset,
  updateKakaoUserProfile,
  resetProfileOverride
} from '../services/kakaoAuth';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: KakaoAuthUser | null;
  onUpdateUser: (user: KakaoAuthUser) => void;
  onOpenFullLogin?: () => void;
}

const NICKNAME_SUGGESTIONS: Record<string, string[]> = {
  kakao_hyunwoo_mom: ['현우맘', '라푼젤 현우맘 👑', '벨 공주 현우맘 🌹', '원정대 여왕님 ✨'],
  kakao_sehyun_mom: ['세현맘', '엘사 세현맘 ❄️', '아리엘 세현맘 🧜‍♀️', '맛집 공주 대장 💜'],
  kakao_hyunwoo: ['현우', '개구쟁이 스머프 현우 🍄', '제트 장인 현우 🗡️', '번개 모험가 현우 ⚡'],
  kakao_sehyun: ['세현', '똘똘이 스머프 세현 👓', '오멘 고수 세현 👻', '네온 스피드 세현 ⚡']
};

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onOpenFullLogin
}) => {
  const [activeMemberId, setActiveMemberId] = useState<string>(
    currentUser?.id || 'kakao_hyunwoo_mom'
  );
  const [nickname, setNickname] = useState<string>(currentUser?.nickname || '현우맘');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    currentUser?.avatarId || DEFAULT_MEMBER_AVATAR_MAP[currentUser?.id || 'kakao_hyunwoo_mom'] || 'disney_rapunzel'
  );
  const [customImageUrl, setCustomImageUrl] = useState<string | undefined>(
    currentUser?.profileImageUrl
  );
  const [selectedCategory, setSelectedCategory] = useState<CharacterCategory | 'all'>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const targetUser = currentUser || createKakaoUserFromPreset('kakao_hyunwoo_mom');
      setActiveMemberId(targetUser.id);
      setNickname(targetUser.nickname);
      const avatar = getCharacterAvatarById(targetUser.avatarId, targetUser.id);
      setSelectedAvatarId(avatar.id);
      setCustomImageUrl(targetUser.profileImageUrl);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const effectiveMembers = getEffectivePresetMembers();
  const selectedCharacter = getCharacterAvatarById(selectedAvatarId, activeMemberId);

  const filteredCharacters =
    selectedCategory === 'all'
      ? CHARACTER_AVATARS
      : CHARACTER_AVATARS.filter((c) => c.category === selectedCategory);

  const handleSelectMemberTab = (memberId: string) => {
    const member = effectiveMembers.find((m) => m.id === memberId) || effectiveMembers[0];
    setActiveMemberId(member.id);
    setNickname(member.nickname);
    setSelectedAvatarId(member.avatarId);
    setCustomImageUrl(member.profileImageUrl);
  };

  const handleResetToDefault = () => {
    const basePreset = KAKAO_PRESET_MEMBERS.find((m) => m.id === activeMemberId) || KAKAO_PRESET_MEMBERS[0];
    resetProfileOverride(activeMemberId);
    setNickname(basePreset.defaultNickname);
    setSelectedAvatarId(basePreset.avatarId);
    setCustomImageUrl(undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const baseUser = createKakaoUserFromPreset(activeMemberId);
    const charObj = getCharacterAvatarById(selectedAvatarId, activeMemberId);

    const updated = updateKakaoUserProfile(baseUser, {
      nickname: nickname.trim() || baseUser.nickname,
      avatarId: selectedAvatarId,
      avatarEmoji: charObj.emoji,
      profileImageUrl: customImageUrl
    });

    onUpdateUser(updated);
    onClose();
  };

  const suggestions = NICKNAME_SUGGESTIONS[activeMemberId] || NICKNAME_SUGGESTIONS.kakao_hyunwoo_mom;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-zinc-950 border border-yellow-400/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white">
        {/* Top Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-black border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>프로필 닉네임 & 캐릭터 변경</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                  CUSTOMIZE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                디즈니 공주 · 개구쟁이 스머프 · 발로란트 요원 중 나만의 캐릭터와 닉네임을 설정하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Member Switcher Bar (누구의 프로필을 사용할지 / 꾸밀지 선택) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>1. 원정대 멤버 선택 (클릭 시 해당 멤버로 전환 및 편집)</span>
              </label>
              {onOpenFullLogin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFullLogin();
                  }}
                  className="text-[11px] font-semibold text-sky-300 hover:text-sky-200 underline cursor-pointer"
                >
                  전체 로그인 화면 보기 →
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {effectiveMembers.map((member) => {
                const isSelectedMember = member.id === activeMemberId;
                const memberChar = getCharacterAvatarById(member.avatarId, member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSelectMemberTab(member.id)}
                    className={`p-2 sm:p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelectedMember
                        ? 'bg-yellow-400/15 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${memberChar.bgGradient} p-0 border ${
                        isSelectedMember ? 'border-yellow-300' : 'border-white/20'
                      } overflow-hidden flex items-center justify-center`}
                    >
                      {member.profileImageUrl ? (
                        <img
                          src={member.profileImageUrl}
                          alt={member.nickname}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        memberChar.renderSvg('w-full h-full')
                      )}
                    </div>
                    <div className="text-center min-w-0 w-full">
                      <div className="text-xs font-bold text-white truncate">{member.nickname}</div>
                      <div className="text-[10px] text-slate-400 truncate">{member.defaultNickname} 계정</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Live Preview + Nickname Editor */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Selected Avatar Preview Squircle */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`relative w-22 h-22 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${selectedCharacter.bgGradient} p-0 border-2 ${selectedCharacter.cardBorder} flex items-center justify-center overflow-hidden`}
              >
                {customImageUrl ? (
                  <img
                    src={customImageUrl}
                    alt={nickname}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  selectedCharacter.renderSvg('w-full h-full')
                )}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />
              </div>
              <span className={`mt-2 text-xs font-bold ${selectedCharacter.badgeColor}`}>
                {customImageUrl ? '📷 내 커스텀 사진' : `${selectedCharacter.emoji} ${selectedCharacter.name}`}
              </span>
              <span className="text-[10px] text-slate-400">{selectedCharacter.subtitle}</span>
            </div>

            {/* Nickname Input & Quick Chips */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-yellow-300">
                  2. 프로필 닉네임 입력
                </label>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-yellow-300 transition-colors cursor-pointer"
                  title="기본 닉네임 및 기본 캐릭터로 초기화"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>기본값 복원</span>
                </button>
              </div>

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={18}
                placeholder="변경할 닉네임을 입력하세요"
                className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/20 focus:border-yellow-400 focus:outline-none text-sm sm:text-base font-bold text-white placeholder:text-slate-500"
              />

              {/* Quick Nickname Suggestions */}
              <div>
                <div className="text-[11px] text-slate-400 mb-1.5">추천 닉네임 빠른 선택:</div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNickname(sug)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        nickname === sug
                          ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Character Picker (Disney / Smurf / Valorant) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label className="text-xs font-bold text-yellow-300">
                3. 캐릭터 아바타 선택 (디즈니 공주 · 개구쟁이 스머프 · 발로란트)
              </label>

              {/* Optional Custom Photo Upload */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-slate-200 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3 text-yellow-400" />
                  <span>내 사진 직접 올리기</span>
                </button>
                {customImageUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomImageUrl(undefined)}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    사진 해제
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
              {CHARACTER_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {filteredCharacters.map((char) => {
                const isSelected = !customImageUrl && selectedAvatarId === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatarId(char.id);
                      setCustomImageUrl(undefined);
                    }}
                    className={`group relative p-2 rounded-2xl border flex flex-col items-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-yellow-400/15 border-yellow-400 ring-2 ring-yellow-400/50 scale-[1.03]'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${char.bgGradient} p-0 border ${
                        isSelected ? 'border-yellow-300' : 'border-white/15'
                      } flex items-center justify-center overflow-hidden relative`}
                    >
                      {char.renderSvg('w-full h-full group-hover:scale-105 transition-transform duration-300')}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`mt-1.5 text-[11px] font-bold text-center truncate w-full ${
                        isSelected ? 'text-yellow-300' : 'text-white group-hover:text-yellow-200'
                      }`}
                    >
                      {char.name}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full text-center">
                      {char.categoryLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-bold text-slate-300 cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(250,204,21,0.45)] flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>프로필 저장 및 적용하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
