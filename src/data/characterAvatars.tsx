import React from 'react';

export type CharacterCategory = 'disney' | 'smurf' | 'valorant';

export interface CharacterAvatarOption {
  id: string;
  name: string;
  subtitle: string;
  category: CharacterCategory;
  categoryLabel: string;
  bgGradient: string;
  cardBorder: string;
  badgeColor: string;
  emoji: string;
  imageUrl: string;
  imagePositionClass: string;
  renderSvg: (className?: string) => React.ReactNode;
}

export const CHARACTER_CATEGORIES: { id: CharacterCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: '전체 캐릭터', emoji: '✨' },
  { id: 'disney', label: '디즈니 공주', emoji: '👑' },
  { id: 'smurf', label: '개구쟁이 스머프', emoji: '🍄' },
  { id: 'valorant', label: '발로란트 요원', emoji: '🎮' }
];

function createCharacterRenderer(name: string, imageUrl: string, imagePositionClass: string) {
  return (className = 'w-full h-full') => (
    <div className={`relative overflow-hidden select-none ${className}`}>
      <img
        src={imageUrl}
        alt={name}
        loading="eager"
        decoding="async"
        draggable={false}
        className={`w-full h-full object-cover transition-transform duration-300 ${imagePositionClass}`}
      />
    </div>
  );
}

export const CHARACTER_AVATARS: CharacterAvatarOption[] = [
  // ==========================================
  // 1. 디즈니 애니메이션 공주 캐릭터 (Disney Princesses)
  // ==========================================
  {
    id: 'disney_rapunzel',
    name: '라푼젤 공주',
    subtitle: '디즈니 라푼젤 (Tangled)',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#240d33] via-[#581c87] to-[#f59e0b]',
    cardBorder: 'border-amber-300/85 shadow-[0_0_20px_rgba(251,191,36,0.4)]',
    badgeColor: 'text-amber-300',
    emoji: '👑',
    imageUrl: '/avatars/disney_rapunzel.jpg',
    imagePositionClass: 'object-[54%_10%] scale-[1.35]',
    renderSvg: createCharacterRenderer('라푼젤 공주', '/avatars/disney_rapunzel.jpg', 'object-[54%_10%] scale-[1.35]')
  },
  {
    id: 'disney_elsa',
    name: '엘사 여왕',
    subtitle: '디즈니 겨울왕국 (Frozen)',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#081c38] via-[#0284c7] to-[#e0f2fe]',
    cardBorder: 'border-sky-300/85 shadow-[0_0_20px_rgba(56,189,248,0.45)]',
    badgeColor: 'text-sky-300',
    emoji: '❄️',
    imageUrl: '/avatars/disney_elsa.jpg',
    imagePositionClass: 'object-[50%_18%] scale-[1.08]',
    renderSvg: createCharacterRenderer('엘사 여왕', '/avatars/disney_elsa.jpg', 'object-[50%_18%] scale-[1.08]')
  },
  {
    id: 'disney_snowwhite',
    name: '백설공주',
    subtitle: '디즈니 백설공주 (Snow White)',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#1e1b4b] via-[#be123c] to-[#facc15]',
    cardBorder: 'border-rose-400/85 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    badgeColor: 'text-rose-300',
    emoji: '🍎',
    imageUrl: '/avatars/disney_snowwhite.jpg',
    imagePositionClass: 'object-[50%_10%] scale-[1.3]',
    renderSvg: createCharacterRenderer('백설공주', '/avatars/disney_snowwhite.jpg', 'object-[50%_10%] scale-[1.3]')
  },
  {
    id: 'disney_ariel',
    name: '인어공주 아리엘',
    subtitle: '디즈니 인어공주 (Little Mermaid)',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#042f2e] via-[#0d9488] to-[#f43f5e]',
    cardBorder: 'border-teal-300/85 shadow-[0_0_20px_rgba(45,212,191,0.4)]',
    badgeColor: 'text-teal-300',
    emoji: '🧜‍♀️',
    imageUrl: '/avatars/disney_ariel.jpg',
    imagePositionClass: 'object-[68%_16%] scale-[1.2]',
    renderSvg: createCharacterRenderer('인어공주 아리엘', '/avatars/disney_ariel.jpg', 'object-[68%_16%] scale-[1.2]')
  },
  {
    id: 'disney_belle',
    name: '벨 공주',
    subtitle: '디즈니 미녀와 야수 (Belle)',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#291506] via-[#b45309] to-[#fde047]',
    cardBorder: 'border-yellow-300/85 shadow-[0_0_20px_rgba(253,224,71,0.4)]',
    badgeColor: 'text-yellow-300',
    emoji: '🌹',
    imageUrl: '/avatars/disney_belle.jpg',
    imagePositionClass: 'object-[50%_16%] scale-[1.1]',
    renderSvg: createCharacterRenderer('벨 공주', '/avatars/disney_belle.jpg', 'object-[50%_16%] scale-[1.1]')
  },
  {
    id: 'disney_jasmine',
    name: '자스민 공주',
    subtitle: '디즈니 알라딘 (Jasmine)',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#042f2e] via-[#0284c7] to-[#facc15]',
    cardBorder: 'border-cyan-300/85 shadow-[0_0_20px_rgba(34,211,238,0.4)]',
    badgeColor: 'text-cyan-300',
    emoji: '🧞‍♂️',
    imageUrl: '/avatars/disney_jasmine.jpg',
    imagePositionClass: 'object-[54%_14%] scale-[1.15]',
    renderSvg: createCharacterRenderer('자스민 공주', '/avatars/disney_jasmine.jpg', 'object-[54%_14%] scale-[1.15]')
  },

  // ==========================================
  // 2. 3D 애니메이션 영화 개구쟁이 스머프 (3D Movie Smurfs)
  // ==========================================
  {
    id: 'smurf_jokey',
    name: '익살이 스머프',
    subtitle: '스머프 3D 영화 장난꾸러기',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#091930] via-[#1d4ed8] to-[#facc15]',
    cardBorder: 'border-sky-400/85 shadow-[0_0_20px_rgba(56,189,248,0.45)]',
    badgeColor: 'text-sky-300',
    emoji: '🎁',
    imageUrl: '/avatars/smurf_jokey.jpg',
    imagePositionClass: 'object-[48%_28%] scale-[1.06]',
    renderSvg: createCharacterRenderer('익살이 스머프', '/avatars/smurf_jokey.jpg', 'object-[48%_28%] scale-[1.06]')
  },
  {
    id: 'smurf_brainy',
    name: '똘똘이 스머프',
    subtitle: '스머프 3D 영화 스마트 개구쟁이',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#082026] via-[#0284c7] to-[#38bdf8]',
    cardBorder: 'border-emerald-300/85 shadow-[0_0_20px_rgba(52,211,153,0.4)]',
    badgeColor: 'text-emerald-300',
    emoji: '👓',
    imageUrl: '/avatars/smurf_brainy.png',
    imagePositionClass: 'object-[56%_14%] scale-[1.3]',
    renderSvg: createCharacterRenderer('똘똘이 스머프', '/avatars/smurf_brainy.png', 'object-[56%_14%] scale-[1.3]')
  },
  {
    id: 'smurf_papa',
    name: '파파 스머프',
    subtitle: '스머프 3D 영화 원정대장',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#2a0a10] via-[#dc2626] to-[#38bdf8]',
    cardBorder: 'border-red-400/85 shadow-[0_0_20px_rgba(248,113,113,0.4)]',
    badgeColor: 'text-red-300',
    emoji: '🎅',
    imageUrl: '/avatars/smurf_papa.png',
    imagePositionClass: 'object-[50%_10%] scale-[1.35]',
    renderSvg: createCharacterRenderer('파파 스머프', '/avatars/smurf_papa.png', 'object-[50%_10%] scale-[1.35]')
  },
  {
    id: 'smurf_smurfette',
    name: '스머페트',
    subtitle: '스머프 3D 영화 러블리 히로인',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#172554] via-[#3b82f6] to-[#fde047]',
    cardBorder: 'border-yellow-300/85 shadow-[0_0_20px_rgba(253,224,71,0.4)]',
    badgeColor: 'text-yellow-300',
    emoji: '🌼',
    imageUrl: '/avatars/smurf_smurfette.png',
    imagePositionClass: 'object-[48%_10%] scale-[1.4]',
    renderSvg: createCharacterRenderer('스머페트', '/avatars/smurf_smurfette.png', 'object-[48%_10%] scale-[1.4]')
  },
  {
    id: 'smurf_hefty',
    name: '덩치 스머프',
    subtitle: '스머프 3D 영화 천하장사',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#0c192c] via-[#0284c7] to-[#f43f5e]',
    cardBorder: 'border-sky-300/85 shadow-[0_0_20px_rgba(56,189,248,0.4)]',
    badgeColor: 'text-sky-300',
    emoji: '💪',
    imageUrl: '/avatars/smurf_hefty.png',
    imagePositionClass: 'object-[64%_22%] scale-[1.3]',
    renderSvg: createCharacterRenderer('덩치 스머프', '/avatars/smurf_hefty.png', 'object-[64%_22%] scale-[1.3]')
  },
  {
    id: 'smurf_grouchy',
    name: '투덜이 스머프',
    subtitle: '스머프 3D 영화 츤데레 귀염둥이',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#0f172a] via-[#1e40af] to-[#60a5fa]',
    cardBorder: 'border-blue-400/85 shadow-[0_0_20px_rgba(96,165,250,0.4)]',
    badgeColor: 'text-blue-300',
    emoji: '😤',
    imageUrl: '/avatars/smurf_grouchy.png',
    imagePositionClass: 'object-center scale-[1.06]',
    renderSvg: createCharacterRenderer('투덜이 스머프', '/avatars/smurf_grouchy.png', 'object-center scale-[1.06]')
  },

  // ==========================================
  // 3. 발로란트 공식 게임 캐릭터 (Valorant Official Agents)
  // ==========================================
  {
    id: 'valorant_jett',
    name: '제트 (Jett)',
    subtitle: '발로란트 바람의 타격대',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#091526] via-[#0e7490] to-[#67e8f9]',
    cardBorder: 'border-cyan-300/85 shadow-[0_0_20px_rgba(103,232,249,0.45)]',
    badgeColor: 'text-cyan-300',
    emoji: '🗡️',
    imageUrl: '/avatars/valorant_jett.png',
    imagePositionClass: 'object-center scale-[1.06]',
    renderSvg: createCharacterRenderer('제트 (Jett)', '/avatars/valorant_jett.png', 'object-center scale-[1.06]')
  },
  {
    id: 'valorant_omen',
    name: '오멘 (Omen)',
    subtitle: '발로란트 그림자 전략가',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#05050a] via-[#312e81] to-[#38bdf8]',
    cardBorder: 'border-indigo-400/85 shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    badgeColor: 'text-indigo-300',
    emoji: '👻',
    imageUrl: '/avatars/valorant_omen.png',
    imagePositionClass: 'object-center scale-[1.06]',
    renderSvg: createCharacterRenderer('오멘 (Omen)', '/avatars/valorant_omen.png', 'object-center scale-[1.06]')
  },
  {
    id: 'valorant_killjoy',
    name: '킬조이 (Killjoy)',
    subtitle: '발로란트 천재 엔지니어',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#1a1605] via-[#ca8a04] to-[#fde047]',
    cardBorder: 'border-yellow-400/85 shadow-[0_0_20px_rgba(250,204,21,0.45)]',
    badgeColor: 'text-yellow-300',
    emoji: '🤖',
    imageUrl: '/avatars/valorant_killjoy.png',
    imagePositionClass: 'object-center scale-[1.06]',
    renderSvg: createCharacterRenderer('킬조이 (Killjoy)', '/avatars/valorant_killjoy.png', 'object-center scale-[1.06]')
  },
  {
    id: 'valorant_reyna',
    name: '레이나 (Reyna)',
    subtitle: '발로란트 보라빛 타격대',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#14051e] via-[#7e22ce] to-[#f43f5e]',
    cardBorder: 'border-purple-400/85 shadow-[0_0_20px_rgba(192,132,252,0.45)]',
    badgeColor: 'text-purple-300',
    emoji: '🔮',
    imageUrl: '/avatars/valorant_reyna.png',
    imagePositionClass: 'object-center scale-[1.06]',
    renderSvg: createCharacterRenderer('레이나 (Reyna)', '/avatars/valorant_reyna.png', 'object-center scale-[1.06]')
  },
  {
    id: 'valorant_neon',
    name: '네온 (Neon)',
    subtitle: '발로란트 초고속 스파크',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#06152d] via-[#2563eb] to-[#facc15]',
    cardBorder: 'border-yellow-300/85 shadow-[0_0_20px_rgba(250,204,21,0.45)]',
    badgeColor: 'text-yellow-300',
    emoji: '⚡',
    imageUrl: '/avatars/valorant_neon.png',
    imagePositionClass: 'object-center scale-[1.06]',
    renderSvg: createCharacterRenderer('네온 (Neon)', '/avatars/valorant_neon.png', 'object-center scale-[1.06]')
  },
  {
    id: 'valorant_sage',
    name: '세이지 (Sage)',
    subtitle: '발로란트 비취 파수꾼',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#042f2e] via-[#059669] to-[#a7f3d0]',
    cardBorder: 'border-emerald-300/85 shadow-[0_0_20px_rgba(110,231,183,0.45)]',
    badgeColor: 'text-emerald-300',
    emoji: '🟢',
    imageUrl: '/avatars/valorant_sage.png',
    imagePositionClass: 'object-center scale-[1.06]',
    renderSvg: createCharacterRenderer('세이지 (Sage)', '/avatars/valorant_sage.png', 'object-center scale-[1.06]')
  }
];

export const DEFAULT_MEMBER_AVATAR_MAP: Record<string, string> = {
  kakao_hyunwoo_mom: 'disney_rapunzel',
  kakao_sehyun_mom: 'disney_elsa',
  kakao_hyunwoo: 'smurf_jokey',
  kakao_sehyun: 'smurf_brainy'
};

export function getCharacterAvatarById(avatarId?: string, memberId?: string): CharacterAvatarOption {
  if (avatarId) {
    const found = CHARACTER_AVATARS.find((a) => a.id === avatarId);
    if (found) return found;
  }
  if (memberId && DEFAULT_MEMBER_AVATAR_MAP[memberId]) {
    const fallbackId = DEFAULT_MEMBER_AVATAR_MAP[memberId];
    const found = CHARACTER_AVATARS.find((a) => a.id === fallbackId);
    if (found) return found;
  }
  return CHARACTER_AVATARS[0];
}
