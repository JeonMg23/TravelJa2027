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
  renderSvg: (className?: string) => React.ReactNode;
}

export const CHARACTER_CATEGORIES: { id: CharacterCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: '전체 캐릭터', emoji: '✨' },
  { id: 'disney', label: '디즈니 공주', emoji: '👑' },
  { id: 'smurf', label: '개구쟁이 스머프', emoji: '🍄' },
  { id: 'valorant', label: '발로란트 요원', emoji: '🎮' }
];

export const CHARACTER_AVATARS: CharacterAvatarOption[] = [
  // ==========================================
  // 1. 디즈니 공주 캐릭터 (Disney Princesses)
  // ==========================================
  {
    id: 'disney_rapunzel',
    name: '라푼젤 공주',
    subtitle: '황금빛 플라워 프린세스',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#240d33] via-[#581c87] to-[#f59e0b]',
    cardBorder: 'border-amber-300/80 shadow-[0_0_18px_rgba(251,191,36,0.35)]',
    badgeColor: 'text-amber-300',
    emoji: '👑',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Magical Golden Glow Aura */}
        <circle cx="50" cy="52" r="42" fill="#FEF08A" opacity="0.16" />
        {/* Long Flowing Golden Hair Back */}
        <path d="M 18 50 Q 12 78 24 94 L 76 94 Q 88 78 82 50 Q 78 24 50 22 Q 22 24 18 50 Z" fill="#FACC15" />
        <path d="M 22 54 Q 18 78 28 94 L 36 94 Q 28 75 30 54 Z" fill="#EAB308" />
        <path d="M 78 54 Q 82 78 72 94 L 64 94 Q 72 75 70 54 Z" fill="#EAB308" />
        {/* Royal Lavender Corset Dress Shoulders */}
        <path d="M 24 84 Q 50 74 76 84 L 82 96 L 18 96 Z" fill="#9333EA" stroke="#FDE047" strokeWidth="1.5" />
        <path d="M 38 82 L 50 95 L 62 82" stroke="#F9A8D4" strokeWidth="2" fill="none" />
        {/* Princess Face */}
        <circle cx="50" cy="54" r="26" fill="#FFF1F2" />
        {/* Golden Side-Swept Bangs */}
        <path d="M 22 50 Q 32 26 56 30 Q 42 36 24 54 Z" fill="#FDE047" />
        <path d="M 50 28 Q 74 28 78 52 Q 66 36 50 34 Z" fill="#FACC15" />
        {/* Royal Golden Princess Tiara */}
        <path d="M 33 29 L 38 17 L 45 25 L 50 12 L 55 25 L 62 17 L 67 29 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="50" cy="21" r="3" fill="#EC4899" />
        <circle cx="41" cy="24" r="2" fill="#A855F7" />
        <circle cx="59" cy="24" r="2" fill="#A855F7" />
        {/* Hair Flowers */}
        <circle cx="25" cy="48" r="4" fill="#F472B6" />
        <circle cx="25" cy="48" r="1.5" fill="#FEF08A" />
        <circle cx="76" cy="52" r="3.5" fill="#C084FC" />
        <circle cx="76" cy="52" r="1.3" fill="#FEF08A" />
        {/* Big Emerald Green Disney Princess Eyes */}
        <ellipse cx="39" cy="53" rx="4.5" ry="5.2" fill="#065F46" />
        <ellipse cx="39" cy="53" rx="2.6" ry="3.2" fill="#10B981" />
        <circle cx="40.5" cy="51" r="1.8" fill="#FFFFFF" />
        <ellipse cx="61" cy="53" rx="4.5" ry="5.2" fill="#065F46" />
        <ellipse cx="61" cy="53" rx="2.6" ry="3.2" fill="#10B981" />
        <circle cx="62.5" cy="51" r="1.8" fill="#FFFFFF" />
        {/* Eyelashes */}
        <path d="M 33 49 Q 39 45 44 49" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <path d="M 56 49 Q 61 45 67 49" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        {/* Rosy Cheeks & Sweet Princess Smile */}
        <ellipse cx="33" cy="60" rx="4.5" ry="2.8" fill="#FDA4AF" opacity="0.8" />
        <ellipse cx="67" cy="60" rx="4.5" ry="2.8" fill="#FDA4AF" opacity="0.8" />
        <path d="M 43 63 Q 50 69 57 63" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'disney_elsa',
    name: '엘사 공주',
    subtitle: '아렌델 스노우 퀸',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#081c38] via-[#0284c7] to-[#e0f2fe]',
    cardBorder: 'border-sky-300/80 shadow-[0_0_18px_rgba(56,189,248,0.4)]',
    badgeColor: 'text-sky-300',
    emoji: '❄️',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Ice Crystal Glow */}
        <circle cx="50" cy="50" r="42" fill="#7DD3FC" opacity="0.2" />
        {/* Platinum Blonde Side Braid */}
        <path d="M 22 48 Q 22 22 50 20 Q 78 22 78 48 Q 82 68 72 86 L 28 86 Q 18 68 22 48 Z" fill="#F8FAFC" />
        <path d="M 64 62 Q 78 68 74 82 Q 66 88 60 78 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M 62 74 Q 76 80 71 94 Q 62 96 58 86 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Ice Crystal Queen Cape & Dress */}
        <path d="M 22 84 Q 50 74 78 84 L 84 96 L 16 96 Z" fill="#38BDF8" stroke="#BAE6FD" strokeWidth="1.5" />
        {/* Face */}
        <circle cx="50" cy="54" r="25" fill="#FFF5F7" />
        {/* Swept Platinum Bangs */}
        <path d="M 24 50 Q 34 26 58 30 Q 44 38 25 53 Z" fill="#FFFFFF" />
        <path d="M 48 27 Q 72 28 76 50 Q 64 38 48 34 Z" fill="#F1F5F9" />
        {/* Ice Crystal Crown / Snowflake Tiara */}
        <path d="M 36 28 L 42 16 L 47 24 L 50 11 L 53 24 L 58 16 L 64 28 Z" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1.4" />
        <circle cx="50" cy="11" r="2.2" fill="#FFFFFF" />
        <circle cx="68" cy="68" r="3" fill="#38BDF8" />
        {/* Sparkling Ice-Blue Eyes & Lavender Eyeshadow */}
        <path d="M 33 49 Q 39 44 45 49" stroke="#C084FC" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 55 49 Q 61 44 67 49" stroke="#C084FC" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="39" cy="53" rx="4.3" ry="5" fill="#0369A1" />
        <ellipse cx="39" cy="53" rx="2.5" ry="3" fill="#38BDF8" />
        <circle cx="40.5" cy="51" r="1.7" fill="#FFFFFF" />
        <ellipse cx="61" cy="53" rx="4.3" ry="5" fill="#0369A1" />
        <ellipse cx="61" cy="53" rx="2.5" ry="3" fill="#38BDF8" />
        <circle cx="62.5" cy="51" r="1.7" fill="#FFFFFF" />
        {/* Soft Rose Cheeks & Confident Queen Smile */}
        <ellipse cx="33" cy="60" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.7" />
        <ellipse cx="67" cy="60" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.7" />
        <path d="M 43 63 Q 50 68 57 63" stroke="#E11D48" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'disney_snowwhite',
    name: '백설공주',
    subtitle: '레드 리본 로얄 프린세스',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#1e1b4b] via-[#be123c] to-[#facc15]',
    cardBorder: 'border-rose-400/80 shadow-[0_0_18px_rgba(244,63,94,0.35)]',
    badgeColor: 'text-rose-300',
    emoji: '🍎',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Ebony Black Wavy Bob Hair */}
        <circle cx="24" cy="56" r="12" fill="#0F172A" />
        <circle cx="76" cy="56" r="12" fill="#0F172A" />
        <path d="M 20 50 Q 22 22 50 22 Q 78 22 80 50 Q 84 68 72 72 L 28 72 Q 16 68 20 50 Z" fill="#0F172A" />
        {/* Royal White Collar & Blue/Yellow Puff Dress */}
        <path d="M 26 78 L 20 68 L 36 74 L 64 74 L 80 68 L 74 78 Z" fill="#FFFFFF" />
        <path d="M 22 82 Q 50 74 78 82 L 84 96 L 16 96 Z" fill="#1D4ED8" stroke="#FACC15" strokeWidth="2" />
        <circle cx="25" cy="86" r="7" fill="#EF4444" stroke="#FACC15" strokeWidth="1.5" />
        <circle cx="75" cy="86" r="7" fill="#EF4444" stroke="#FACC15" strokeWidth="1.5" />
        {/* Fair Porcelain Face */}
        <circle cx="50" cy="54" r="24" fill="#FFF5F5" />
        {/* Parted Dark Hair Bangs */}
        <path d="M 25 48 Q 36 28 50 33 Q 64 28 75 48 Q 64 36 50 38 Q 36 36 25 48 Z" fill="#0F172A" />
        {/* Iconic Red Headband & Big Bow */}
        <path d="M 26 42 Q 50 22 74 42" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 50 25 L 38 17 L 41 28 Z" fill="#EF4444" />
        <path d="M 50 25 L 62 17 L 59 28 Z" fill="#EF4444" />
        <circle cx="50" cy="24" r="3.5" fill="#DC2626" />
        {/* Warm Brown Eyes */}
        <ellipse cx="39" cy="53" rx="4" ry="4.8" fill="#451A03" />
        <circle cx="40.5" cy="51.2" r="1.6" fill="#FFFFFF" />
        <ellipse cx="61" cy="53" rx="4" ry="4.8" fill="#451A03" />
        <circle cx="62.5" cy="51.2" r="1.6" fill="#FFFFFF" />
        {/* Rosy Apple Cheeks & Red Lips */}
        <ellipse cx="33" cy="60" rx="4.5" ry="2.8" fill="#FCA5A5" />
        <ellipse cx="67" cy="60" rx="4.5" ry="2.8" fill="#FCA5A5" />
        <path d="M 43 63 Q 50 69 57 63" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'disney_ariel',
    name: '인어공주 아리엘',
    subtitle: '오션 루비 프린세스',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#042f2e] via-[#0d9488] to-[#f43f5e]',
    cardBorder: 'border-teal-300/80 shadow-[0_0_18px_rgba(45,212,191,0.35)]',
    badgeColor: 'text-teal-300',
    emoji: '🧜‍♀️',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Luscious Crimson Red Flowing Hair */}
        <path d="M 16 54 Q 10 80 22 95 L 78 95 Q 90 80 84 54 Q 82 22 50 20 Q 18 22 16 54 Z" fill="#E11D48" />
        {/* Mermaid Seashell Top & Aqua Shimmer */}
        <path d="M 24 85 Q 50 76 76 85 L 82 96 L 18 96 Z" fill="#2DD4BF" />
        <ellipse cx="42" cy="89" rx="7" ry="5" fill="#A855F7" />
        <ellipse cx="58" cy="89" rx="7" ry="5" fill="#A855F7" />
        {/* Face */}
        <circle cx="50" cy="55" r="24" fill="#FFF1F2" />
        {/* Iconic Voluminous Swooping Red Bangs */}
        <path d="M 22 52 Q 26 20 56 22 Q 82 26 80 54 Q 68 35 48 36 Q 32 36 22 52 Z" fill="#F43F5E" />
        {/* Starfish & Pearl Hair Accessory */}
        <path d="M 70 36 L 73 29 L 76 36 L 83 38 L 77 42 L 79 49 L 73 45 L 67 49 L 69 42 L 63 38 Z" fill="#DDD6FE" stroke="#A855F7" strokeWidth="1" />
        <circle cx="73" cy="40" r="2" fill="#FEF08A" />
        {/* Big Ocean Blue-Teal Eyes */}
        <ellipse cx="39" cy="54" rx="4.2" ry="5" fill="#0284C7" />
        <circle cx="40.5" cy="52" r="1.7" fill="#FFFFFF" />
        <ellipse cx="61" cy="54" rx="4.2" ry="5" fill="#0284C7" />
        <circle cx="62.5" cy="52" r="1.7" fill="#FFFFFF" />
        <ellipse cx="33" cy="61" rx="4.5" ry="2.6" fill="#FDA4AF" />
        <ellipse cx="67" cy="61" rx="4.5" ry="2.6" fill="#FDA4AF" />
        <path d="M 43 64 Q 50 70 57 64" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'disney_belle',
    name: '벨 공주',
    subtitle: '황금 장미 프린세스',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#291506] via-[#b45309] to-[#fde047]',
    cardBorder: 'border-yellow-300/80 shadow-[0_0_18px_rgba(253,224,71,0.35)]',
    badgeColor: 'text-yellow-300',
    emoji: '🌹',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Royal Bun & Chestnut Brown Hair */}
        <circle cx="50" cy="21" r="13" fill="#451A03" />
        <path d="M 38 24 Q 50 18 62 24" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 20 52 Q 22 28 50 26 Q 78 28 80 52 Q 82 76 72 88 L 28 88 Q 18 76 20 52 Z" fill="#572408" />
        {/* Golden Ballgown Off-Shoulder Dress */}
        <path d="M 20 84 Q 50 74 80 84 L 86 96 L 14 96 Z" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
        <circle cx="50" cy="85" r="4" fill="#E11D48" />
        {/* Face */}
        <circle cx="50" cy="55" r="24" fill="#FFF7ED" />
        {/* Graceful Brown Bangs */}
        <path d="M 24 52 Q 35 32 50 36 Q 65 32 76 52 Q 66 39 50 40 Q 34 39 24 52 Z" fill="#451A03" />
        {/* Hazel Eyes */}
        <ellipse cx="39" cy="54" rx="4" ry="4.8" fill="#78350F" />
        <circle cx="40.5" cy="52" r="1.6" fill="#FFFFFF" />
        <ellipse cx="61" cy="54" rx="4" ry="4.8" fill="#78350F" />
        <circle cx="62.5" cy="52" r="1.6" fill="#FFFFFF" />
        {/* Enchanted Red Rose Accent */}
        <circle cx="72" cy="36" r="5" fill="#E11D48" />
        <path d="M 69 36 Q 72 33 75 36" stroke="#FDA4AF" strokeWidth="1.2" />
        <ellipse cx="33" cy="61" rx="4" ry="2.5" fill="#FDBA74" opacity="0.8" />
        <ellipse cx="67" cy="61" rx="4" ry="2.5" fill="#FDBA74" opacity="0.8" />
        <path d="M 43 64 Q 50 70 57 64" stroke="#BE123C" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'disney_jasmine',
    name: '자스민 공주',
    subtitle: '에메랄드 팰리스 프린세스',
    category: 'disney',
    categoryLabel: '디즈니 공주',
    bgGradient: 'from-[#042f2e] via-[#0284c7] to-[#facc15]',
    cardBorder: 'border-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.35)]',
    badgeColor: 'text-cyan-300',
    emoji: '🧞‍♂️',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Voluminous Jet Black Hair */}
        <circle cx="50" cy="20" r="12" fill="#090D16" />
        <path d="M 18 52 Q 20 24 50 24 Q 80 24 82 52 Q 86 74 74 88 L 26 88 Q 14 74 18 52 Z" fill="#090D16" />
        {/* Golden Hoop Earrings */}
        <circle cx="23" cy="60" r="5.5" stroke="#FACC15" strokeWidth="2.5" fill="none" />
        <circle cx="77" cy="60" r="5.5" stroke="#FACC15" strokeWidth="2.5" fill="none" />
        {/* Turquoise Silk Dress & Gold Necklace */}
        <path d="M 22 84 Q 50 75 78 84 L 84 96 L 16 96 Z" fill="#06B6D4" stroke="#FACC15" strokeWidth="2" />
        {/* Warm Sun-Kissed Face */}
        <circle cx="50" cy="55" r="23" fill="#FDE68A" />
        <circle cx="50" cy="55" r="23" fill="#FFF1F2" opacity="0.55" />
        {/* Black Parted Bangs */}
        <path d="M 25 50 Q 36 30 50 36 Q 64 30 75 50 Q 64 38 50 40 Q 36 38 25 50 Z" fill="#090D16" />
        {/* Turquoise & Gold Jeweled Headband */}
        <path d="M 27 38 Q 50 31 73 38" stroke="#22D3EE" strokeWidth="4" fill="none" />
        <ellipse cx="50" cy="34" rx="4.5" ry="5.5" fill="#06B6D4" stroke="#FACC15" strokeWidth="1.8" />
        {/* Almond Dark Eyes */}
        <ellipse cx="39" cy="54" rx="4.2" ry="4.5" fill="#1E293B" />
        <circle cx="40.5" cy="52.5" r="1.5" fill="#FFFFFF" />
        <ellipse cx="61" cy="54" rx="4.2" ry="4.5" fill="#1E293B" />
        <circle cx="62.5" cy="52.5" r="1.5" fill="#FFFFFF" />
        <path d="M 43 64 Q 50 69 57 64" stroke="#B91C1C" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    )
  },

  // ==========================================
  // 2. 개구쟁이 스머프 캐릭터 (Playful Smurfs)
  // ==========================================
  {
    id: 'smurf_jokey',
    name: '익살이 스머프',
    subtitle: '장난꾸러기 깜짝선물 스머프',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#091930] via-[#1d4ed8] to-[#facc15]',
    cardBorder: 'border-sky-400/80 shadow-[0_0_18px_rgba(56,189,248,0.4)]',
    badgeColor: 'text-sky-300',
    emoji: '🎁',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* White Collar / Shirt */}
        <path d="M 26 84 Q 50 76 74 84 L 80 96 L 20 96 Z" fill="#FFFFFF" />
        {/* Smurf Blue Ears */}
        <ellipse cx="22" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        <ellipse cx="78" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        {/* Smurf Blue Head */}
        <circle cx="50" cy="58" r="26" fill="#38BDF8" />
        {/* Iconic White Phrygian Smurf Hat (Bent Forward Top) */}
        <path
          d="M 21 48 C 19 26, 38 10, 62 12 C 74 13, 76 26, 65 31 C 57 34, 68 38, 79 48 Q 50 41 21 48 Z"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        <path d="M 21 48 Q 50 42 79 48" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        {/* Playful Wink & Big Cartoon Smurf Eye */}
        <path d="M 32 54 Q 38 48 44 54" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" />
        <ellipse cx="60" cy="53" rx="6.5" ry="7.5" fill="#FFFFFF" />
        <ellipse cx="59" cy="54" rx="3.2" ry="4" fill="#0F172A" />
        <circle cx="60.5" cy="52" r="1.5" fill="#FFFFFF" />
        {/* Iconic Round Smurf Blue Nose */}
        <ellipse cx="50" cy="60" rx="6.5" ry="5.2" fill="#0284C7" stroke="#0369A1" strokeWidth="1.2" />
        <ellipse cx="48.5" cy="58.5" rx="2" ry="1.2" fill="#7DD3FC" />
        {/* Mischievous Laughing Mouth with Tongue */}
        <path d="M 38 67 Q 50 78 63 66" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M 47 71 Q 52 77 56 70 Z" fill="#F43F5E" />
        {/* Surprise Joke Gift Box Icon in Corner */}
        <rect x="66" y="72" width="18" height="16" rx="2.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
        <path d="M 75 72 L 75 88 M 66 80 L 84 80" stroke="#EF4444" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'smurf_brainy',
    name: '똘똘이 스머프',
    subtitle: '안경 쓴 개구쟁이 스머프',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#082026] via-[#0284c7] to-[#34d399]',
    cardBorder: 'border-emerald-300/80 shadow-[0_0_18px_rgba(52,211,153,0.35)]',
    badgeColor: 'text-emerald-300',
    emoji: '👓',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* White Smurf Outfit */}
        <path d="M 26 84 Q 50 76 74 84 L 80 96 L 20 96 Z" fill="#FFFFFF" />
        {/* Smurf Blue Ears */}
        <ellipse cx="22" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        <ellipse cx="78" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        {/* Smurf Blue Head */}
        <circle cx="50" cy="58" r="26" fill="#38BDF8" />
        {/* Iconic White Phrygian Smurf Hat */}
        <path
          d="M 21 48 C 20 25, 42 9, 64 13 C 76 15, 76 28, 64 32 C 58 34, 69 39, 79 48 Q 50 41 21 48 Z"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        {/* Big Cartoon Smurf Eyes */}
        <ellipse cx="39" cy="54" rx="6.5" ry="7.2" fill="#FFFFFF" />
        <circle cx="40" cy="54" r="3" fill="#0F172A" />
        <circle cx="41" cy="52.5" r="1.2" fill="#FFFFFF" />
        <ellipse cx="61" cy="54" rx="6.5" ry="7.2" fill="#FFFFFF" />
        <circle cx="60" cy="54" r="3" fill="#0F172A" />
        <circle cx="61" cy="52.5" r="1.2" fill="#FFFFFF" />
        {/* Signature Round Black Glasses */}
        <circle cx="39" cy="54" r="8.5" stroke="#1E293B" strokeWidth="2.8" fill="none" />
        <circle cx="61" cy="54" r="8.5" stroke="#1E293B" strokeWidth="2.8" fill="none" />
        <path d="M 47.5 54 L 52.5 54" stroke="#1E293B" strokeWidth="2.8" />
        {/* Round Smurf Blue Nose */}
        <ellipse cx="50" cy="61" rx="6" ry="5" fill="#0284C7" stroke="#0369A1" strokeWidth="1.2" />
        <ellipse cx="48.5" cy="59.5" rx="2" ry="1.2" fill="#7DD3FC" />
        {/* Cheeky Smirk Smile */}
        <path d="M 39 69 Q 50 76 62 68" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: 'smurf_papa',
    name: '파파 스머프',
    subtitle: '빨간 모자 원정대장 스머프',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#2a0a10] via-[#dc2626] to-[#38bdf8]',
    cardBorder: 'border-red-400/80 shadow-[0_0_18px_rgba(248,113,113,0.35)]',
    badgeColor: 'text-red-300',
    emoji: '🎅',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Red Outfit */}
        <path d="M 26 84 Q 50 76 74 84 L 80 96 L 20 96 Z" fill="#EF4444" />
        {/* Blue Ears */}
        <ellipse cx="22" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        <ellipse cx="78" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        {/* Blue Face */}
        <circle cx="50" cy="58" r="25" fill="#38BDF8" />
        {/* Papa Smurf's Signature Red Hat */}
        <path
          d="M 21 48 C 20 24, 42 9, 64 13 C 76 15, 76 28, 64 32 C 58 34, 69 39, 79 48 Q 50 41 21 48 Z"
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth="1.5"
        />
        {/* Fluffy White Eyebrows & Full White Beard */}
        <path d="M 31 46 Q 38 43 44 46" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 56 46 Q 62 43 69 46" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 24 60 Q 22 86 50 88 Q 78 86 76 60 Q 68 68 50 68 Q 32 68 24 60 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Kind Eyes */}
        <ellipse cx="40" cy="53" rx="5.5" ry="6.5" fill="#FFFFFF" />
        <circle cx="41" cy="53" r="2.8" fill="#0F172A" />
        <ellipse cx="60" cy="53" rx="5.5" ry="6.5" fill="#FFFFFF" />
        <circle cx="59" cy="53" r="2.8" fill="#0F172A" />
        {/* Blue Nose */}
        <ellipse cx="50" cy="60" rx="6.5" ry="5.2" fill="#0284C7" />
        {/* Warm Smile in Beard */}
        <path d="M 42 73 Q 50 79 58 73" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'smurf_smurfette',
    name: '스머페트',
    subtitle: '금발 러블리 스머프',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#172554] via-[#3b82f6] to-[#fde047]',
    cardBorder: 'border-yellow-300/80 shadow-[0_0_18px_rgba(253,224,71,0.35)]',
    badgeColor: 'text-yellow-300',
    emoji: '🌼',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Flowing Golden Blonde Hair */}
        <path d="M 16 52 Q 12 78 24 92 L 76 92 Q 88 78 84 52 Z" fill="#FACC15" />
        {/* White Dress */}
        <path d="M 28 84 Q 50 77 72 84 L 78 96 L 22 96 Z" fill="#FFFFFF" />
        {/* Smurf Blue Face */}
        <circle cx="50" cy="58" r="24" fill="#38BDF8" />
        {/* Golden Bangs */}
        <path d="M 24 52 Q 36 38 50 44 Q 64 38 76 52" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />
        {/* White Smurf Hat */}
        <path
          d="M 22 47 C 21 24, 42 9, 64 13 C 75 15, 75 28, 64 32 C 58 34, 68 38, 78 47 Q 50 40 22 47 Z"
          fill="#FFFFFF"
        />
        {/* Big Sparkling Eyes with Long Eyelashes */}
        <ellipse cx="40" cy="55" rx="5.5" ry="6.5" fill="#FFFFFF" />
        <circle cx="41" cy="55" r="3" fill="#0F172A" />
        <circle cx="42" cy="53.5" r="1.3" fill="#FFFFFF" />
        <ellipse cx="60" cy="55" rx="5.5" ry="6.5" fill="#FFFFFF" />
        <circle cx="59" cy="55" r="3" fill="#0F172A" />
        <circle cx="60" cy="53.5" r="1.3" fill="#FFFFFF" />
        {/* Cute Blue Nose & Rosy Blush */}
        <ellipse cx="50" cy="61" rx="5.5" ry="4.5" fill="#0284C7" />
        <ellipse cx="33" cy="64" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
        <ellipse cx="67" cy="64" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
        <path d="M 42 69 Q 50 75 58 69" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'smurf_hefty',
    name: '덩치 스머프',
    subtitle: '하트 파워 천하장사 스머프',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#0c192c] via-[#0284c7] to-[#f43f5e]',
    cardBorder: 'border-sky-300/80 shadow-[0_0_18px_rgba(56,189,248,0.35)]',
    badgeColor: 'text-sky-300',
    emoji: '💪',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <path d="M 24 84 Q 50 76 76 84 L 82 96 L 18 96 Z" fill="#FFFFFF" />
        <ellipse cx="22" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        <ellipse cx="78" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        <circle cx="50" cy="58" r="26" fill="#38BDF8" />
        {/* White Smurf Hat */}
        <path
          d="M 21 48 C 20 25, 42 9, 64 13 C 76 15, 76 28, 64 32 C 58 34, 69 39, 79 48 Q 50 41 21 48 Z"
          fill="#FFFFFF"
        />
        {/* Confident Bold Eyebrows */}
        <path d="M 31 47 L 45 50" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 69 47 L 55 50" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" />
        <ellipse cx="40" cy="55" rx="5.5" ry="6.2" fill="#FFFFFF" />
        <circle cx="41" cy="55" r="2.8" fill="#0F172A" />
        <ellipse cx="60" cy="55" rx="5.5" ry="6.2" fill="#FFFFFF" />
        <circle cx="59" cy="55" r="2.8" fill="#0F172A" />
        <ellipse cx="50" cy="61" rx="6.2" ry="5" fill="#0284C7" />
        {/* Big Confident Grin */}
        <path d="M 38 68 Q 50 76 62 68 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        {/* Signature Red Heart Tattoo Badge */}
        <path d="M 74 75 C 72 71 67 73 69 77 L 74 82 L 79 77 C 81 73 76 71 74 75 Z" fill="#EF4444" />
      </svg>
    )
  },
  {
    id: 'smurf_grouchy',
    name: '투덜이 스머프',
    subtitle: '츤데레 귀염둥이 스머프',
    category: 'smurf',
    categoryLabel: '개구쟁이 스머프',
    bgGradient: 'from-[#0f172a] via-[#1e40af] to-[#60a5fa]',
    cardBorder: 'border-blue-400/80 shadow-[0_0_18px_rgba(96,165,250,0.35)]',
    badgeColor: 'text-blue-300',
    emoji: '😤',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <path d="M 26 84 Q 50 76 74 84 L 80 96 L 20 96 Z" fill="#FFFFFF" />
        <ellipse cx="22" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        <ellipse cx="78" cy="58" rx="6" ry="8" fill="#0EA5E9" />
        <circle cx="50" cy="58" r="26" fill="#38BDF8" />
        {/* Low-pulled White Smurf Hat */}
        <path
          d="M 20 50 C 19 26, 42 10, 64 14 C 76 16, 76 29, 64 33 C 58 35, 69 40, 80 50 Q 50 44 20 50 Z"
          fill="#FFFFFF"
        />
        {/* Grouchy V-Shaped Brow */}
        <ellipse cx="40" cy="56" rx="5.5" ry="5.5" fill="#FFFFFF" />
        <circle cx="41" cy="56" r="2.8" fill="#0F172A" />
        <ellipse cx="60" cy="56" rx="5.5" ry="5.5" fill="#FFFFFF" />
        <circle cx="59" cy="56" r="2.8" fill="#0F172A" />
        <path d="M 30 49 L 47 54 L 50 53 L 53 54 L 70 49" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="50" cy="61" rx="6.2" ry="5" fill="#0284C7" />
        {/* Cute Pouty Mouth */}
        <path d="M 41 71 Q 50 67 59 71" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },

  // ==========================================
  // 3. 발로란트 캐릭터 (Valorant Agents)
  // ==========================================
  {
    id: 'valorant_jett',
    name: '제트 (Jett)',
    subtitle: '발로란트 바람의 타격대',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#091526] via-[#0e7490] to-[#67e8f9]',
    cardBorder: 'border-cyan-300/80 shadow-[0_0_18px_rgba(103,232,249,0.4)]',
    badgeColor: 'text-cyan-300',
    emoji: '🗡️',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Wind Blade Kunai Aura */}
        <circle cx="50" cy="52" r="42" fill="#22D3EE" opacity="0.15" />
        {/* High Silver-White Top Knot Bun */}
        <circle cx="50" cy="16" r="11" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
        <path d="M 41 21 L 59 21" stroke="#0284C7" strokeWidth="3" />
        {/* Dark Navy Tactical High-Collar Vest */}
        <path d="M 20 86 L 32 72 L 68 72 L 80 86 L 84 96 L 16 96 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Face */}
        <circle cx="50" cy="54" r="23" fill="#FFF1F2" />
        {/* Silver-White Sharp Swooping Bangs */}
        <path d="M 24 52 Q 26 24 50 24 Q 74 24 76 52 Q 66 35 52 44 L 46 36 Q 34 40 24 52 Z" fill="#F8FAFC" />
        {/* Cool Sharp Eyes & Winged Liner */}
        <path d="M 32 49 L 44 51" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 68 49 L 56 51" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
        <ellipse cx="39" cy="53" rx="3.5" ry="4" fill="#0E7490" />
        <circle cx="40" cy="52" r="1.4" fill="#FFFFFF" />
        <ellipse cx="61" cy="53" rx="3.5" ry="4" fill="#0E7490" />
        <circle cx="62" cy="52" r="1.4" fill="#FFFFFF" />
        {/* Confident Smirk */}
        <path d="M 44 64 Q 51 67 57 62" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Floating Kunai Blade Icon */}
        <path d="M 78 24 L 86 14 L 82 28 L 76 30 Z" fill="#67E8F9" stroke="#FFFFFF" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'valorant_omen',
    name: '오멘 (Omen)',
    subtitle: '발로란트 그림자 전략가',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#05050a] via-[#312e81] to-[#38bdf8]',
    cardBorder: 'border-indigo-400/80 shadow-[0_0_18px_rgba(99,102,241,0.45)]',
    badgeColor: 'text-indigo-300',
    emoji: '👻',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Shadow Mist Aura */}
        <circle cx="50" cy="52" r="42" fill="#4F46E5" opacity="0.2" />
        {/* Dark Phantom Cloak & Shoulder Armor */}
        <path d="M 16 88 Q 50 74 84 88 L 88 96 L 12 96 Z" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
        {/* Deep Hood */}
        <path d="M 18 68 Q 16 20 50 14 Q 84 20 82 68 Q 68 82 50 82 Q 32 82 18 68 Z" fill="#312E81" stroke="#4338CA" strokeWidth="2" />
        {/* Pitch Black Void Face */}
        <path d="M 28 64 Q 26 30 50 26 Q 74 30 72 64 Q 50 76 28 64 Z" fill="#090D16" />
        {/* Omen's Iconic 3 Glowing Cyan/Blue Face Slits */}
        <line x1="41" y1="43" x2="41" y2="57" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="50" y1="40" x2="50" y2="60" stroke="#67E8F9" strokeWidth="4" strokeLinecap="round" />
        <line x1="59" y1="43" x2="59" y2="57" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'valorant_killjoy',
    name: '킬조이 (Killjoy)',
    subtitle: '발로란트 천재 엔지니어',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#1a1605] via-[#ca8a04] to-[#fde047]',
    cardBorder: 'border-yellow-400/80 shadow-[0_0_18px_rgba(250,204,21,0.4)]',
    badgeColor: 'text-yellow-300',
    emoji: '🤖',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Bright Yellow Puffer Jacket Collar */}
        <path d="M 18 82 Q 50 72 82 82 L 88 96 L 12 96 Z" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
        {/* Dark Brown Hair */}
        <path d="M 22 48 Q 20 75 28 86 L 72 86 Q 80 75 78 48 Z" fill="#451A03" />
        {/* Face */}
        <circle cx="50" cy="56" r="23" fill="#FFF1F2" />
        {/* Iconic Yellow Beanie Hat */}
        <path d="M 22 46 Q 24 16 50 16 Q 76 16 78 46 Z" fill="#FACC15" />
        <rect x="20" y="38" width="60" height="10" rx="5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
        {/* Round Thick-Frame Glasses */}
        <circle cx="39" cy="55" r="8" stroke="#F8FAFC" strokeWidth="2.8" fill="#0F172A" fillOpacity="0.15" />
        <circle cx="61" cy="55" r="8" stroke="#F8FAFC" strokeWidth="2.8" fill="#0F172A" fillOpacity="0.15" />
        <line x1="47" y1="55" x2="53" y2="55" stroke="#F8FAFC" strokeWidth="2.8" />
        {/* Eyes */}
        <circle cx="39" cy="55" r="3.2" fill="#451A03" />
        <circle cx="40" cy="53.8" r="1.3" fill="#FFFFFF" />
        <circle cx="61" cy="55" r="3.2" fill="#451A03" />
        <circle cx="62" cy="53.8" r="1.3" fill="#FFFFFF" />
        {/* Smart Confident Smile */}
        <path d="M 43 66 Q 50 71 57 66" stroke="#E11D48" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'valorant_reyna',
    name: '레이나 (Reyna)',
    subtitle: '발로란트 보라빛 타격대',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#14051e] via-[#7e22ce] to-[#f43f5e]',
    cardBorder: 'border-purple-400/80 shadow-[0_0_18px_rgba(192,132,252,0.4)]',
    badgeColor: 'text-purple-300',
    emoji: '🔮',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Soul Orb Purple Glow */}
        <circle cx="50" cy="50" r="42" fill="#A855F7" opacity="0.2" />
        {/* Dark Purple Ombre Hair */}
        <path d="M 20 50 Q 18 22 50 20 Q 82 22 80 50 Q 84 76 74 90 L 26 90 Q 16 76 20 50 Z" fill="#1E1B4B" />
        <path d="M 20 60 Q 18 78 28 90 L 34 90 Q 26 75 26 60 Z" fill="#9333EA" />
        <path d="M 80 60 Q 82 78 72 90 L 66 90 Q 74 75 74 60 Z" fill="#9333EA" />
        {/* Outfit */}
        <path d="M 22 84 Q 50 75 78 84 L 84 96 L 16 96 Z" fill="#581C87" stroke="#C084FC" strokeWidth="1.5" />
        {/* Face */}
        <circle cx="50" cy="54" r="23" fill="#FDE68A" />
        <circle cx="50" cy="54" r="23" fill="#FFF1F2" opacity="0.45" />
        {/* Swept Dark Purple Bangs */}
        <path d="M 25 48 Q 38 26 52 34 Q 64 26 75 48 Q 62 36 50 38 Q 38 36 25 48 Z" fill="#3B0764" />
        {/* Glowing Violet/Magenta Eyes */}
        <ellipse cx="39" cy="53" rx="4.2" ry="3.8" fill="#E879F9" />
        <circle cx="39" cy="53" r="1.8" fill="#FFFFFF" />
        <ellipse cx="61" cy="53" rx="4.2" ry="3.8" fill="#E879F9" />
        <circle cx="61" cy="53" r="1.8" fill="#FFFFFF" />
        {/* Fierce Smirk */}
        <path d="M 43 64 Q 50 68 58 63" stroke="#9333EA" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'valorant_neon',
    name: '네온 (Neon)',
    subtitle: '발로란트 초고속 스파크',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#06152d] via-[#2563eb] to-[#facc15]',
    cardBorder: 'border-yellow-300/80 shadow-[0_0_18px_rgba(250,204,21,0.4)]',
    badgeColor: 'text-yellow-300',
    emoji: '⚡',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* Double Space Buns (Electric Blue & Yellow) */}
        <circle cx="24" cy="24" r="11" fill="#1D4ED8" stroke="#FACC15" strokeWidth="2" />
        <circle cx="76" cy="24" r="11" fill="#1D4ED8" stroke="#FACC15" strokeWidth="2" />
        {/* Athletic Vest */}
        <path d="M 22 84 Q 50 75 78 84 L 84 96 L 16 96 Z" fill="#1E3A8A" stroke="#FACC15" strokeWidth="2" />
        {/* Face */}
        <circle cx="50" cy="55" r="23" fill="#FFF1F2" />
        {/* Blue Hair with Neon Yellow Streaks */}
        <path d="M 25 50 Q 35 26 50 30 Q 65 26 75 50 Q 64 36 50 38 Q 36 36 25 50 Z" fill="#2563EB" />
        <path d="M 46 30 L 42 44 M 54 30 L 58 44" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        {/* Glowing Blue Face Bandage / Surge Mark across Nose */}
        <path d="M 34 58 Q 50 55 66 58" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Energetic Eyes */}
        <ellipse cx="39" cy="53" rx="3.8" ry="4.5" fill="#1E293B" />
        <circle cx="40" cy="51.5" r="1.5" fill="#38BDF8" />
        <ellipse cx="61" cy="53" rx="3.8" ry="4.5" fill="#1E293B" />
        <circle cx="62" cy="51.5" r="1.5" fill="#38BDF8" />
        <path d="M 43 65 Q 50 70 57 65" stroke="#E11D48" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'valorant_sage',
    name: '세이지 (Sage)',
    subtitle: '발로란트 비취 파수꾼',
    category: 'valorant',
    categoryLabel: '발로란트',
    bgGradient: 'from-[#042f2e] via-[#059669] to-[#a7f3d0]',
    cardBorder: 'border-emerald-300/80 shadow-[0_0_18px_rgba(110,231,183,0.4)]',
    badgeColor: 'text-emerald-300',
    emoji: '🟢',
    renderSvg: (className = 'w-full h-full') => (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        {/* High Jet-Black Ponytail & Jade Ornament */}
        <circle cx="50" cy="15" r="11" fill="#090D16" />
        <polygon points="50,18 44,26 56,26" fill="#34D399" />
        {/* White & Jade Collar */}
        <path d="M 22 84 Q 50 74 78 84 L 84 96 L 16 96 Z" fill="#F8FAFC" stroke="#10B981" strokeWidth="2" />
        {/* Face */}
        <circle cx="50" cy="55" r="23" fill="#FFF1F2" />
        {/* Sleek Black Hair */}
        <path d="M 25 52 Q 30 26 50 26 Q 70 26 75 52 Q 64 36 50 38 Q 36 36 25 52 Z" fill="#090D16" />
        {/* Calm Wise Eyes */}
        <ellipse cx="39" cy="54" rx="3.8" ry="4.2" fill="#064E3B" />
        <circle cx="40" cy="52.5" r="1.4" fill="#FFFFFF" />
        <ellipse cx="61" cy="54" rx="3.8" ry="4.2" fill="#064E3B" />
        <circle cx="62" cy="52.5" r="1.4" fill="#FFFFFF" />
        <path d="M 44 64 Q 50 68 56 64" stroke="#BE123C" strokeWidth="2.4" strokeLinecap="round" />
        {/* Floating Jade Healing Orb */}
        <circle cx="78" cy="72" r="7" fill="#34D399" stroke="#A7F3D0" strokeWidth="1.5" />
      </svg>
    )
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
