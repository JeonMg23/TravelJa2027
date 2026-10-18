export type ScheduleThemeId =
  | 'classic-light'
  | 'intro-thunder'
  | 'tokyo-night-glass'
  | 'cyber-akiba'
  | 'sakura-editorial';

export interface ScheduleThemeConfig {
  id: ScheduleThemeId;
  name: string;
  shortName: string;
  badgeText: string;
  description: string;
  isDark: boolean;
  previewGradient: string;
  previewBorder: string;
  previewAccentColor: string;
  // Page root & ambient
  pageBg: string;
  // Header
  headerBg: string;
  headerTitle: string;
  headerSubtitle: string;
  headerNavActive: string;
  headerNavInactive: string;
  headerInstallBtn: string;
  // DaySelector
  daySelectorBg: string;
  daySelectorLabel: string;
  daySelectorSubtext: string;
  allDaysActive: string;
  allDaysInactive: string;
  dayTabActive: string;
  dayTabInactive: string;
  dayTabBadgeActive: string;
  dayTabBadgeInactive: string;
  dayTabDateActive: string;
  dayTabDateInactive: string;
  // View mode bar (Timeline / Map / Split)
  viewBarBg: string;
  viewBtnTimelineActive: string;
  viewBtnMapActive: string;
  viewBtnSplitActive: string;
  viewBtnInactive: string;
  // Cards & surfaces
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  cardSelected: string;
  subCardBg: string;
  subCardBorder: string;
  dividerBorder: string;
  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentText: string;
  accentBadge: string;
  // Spot index pin
  pinDefault: string;
  pinSelected: string;
  // Selected Spot Indicator Pill
  selectedPill: string;
  selectedPillDot: string;
  // Transit Connector Card
  transitDefaultBg: string;
  transitHotelBg: string;
  transitIconBox: string;
  transitHotelIconBox: string;
  transitRoutePill: string;
  // Food recommendation card
  foodCardDefault: string;
  foodCardAdded: string;
  foodAddBtn: string;
  // Add Spot Button
  addSpotBtn: string;
  // Modal & Dialog Containers
  modalBg: string;
  modalHeaderBg: string;
  modalFooterBg: string;
  modalBorder: string;
  // Form Inputs & Selects
  inputBg: string;
  inputBorder: string;
  inputText: string;
  // Progress Bar & Meters
  progressBarBg: string;
  progressFill: string;
  // Action Buttons
  primaryBtn: string;
  tabActive: string;
  tabInactive: string;
}

export const SCHEDULE_THEMES: Record<ScheduleThemeId, ScheduleThemeConfig> = {
  'classic-light': {
    id: 'classic-light',
    name: '지금 스타일 (클래식 라이트)',
    shortName: '기존 스타일',
    badgeText: '기본 라이트',
    description: '현재 사용 중인 깔끔하고 밝은 화이트·인디고 표준 디자인',
    isDark: false,
    previewGradient: 'from-white via-slate-100 to-indigo-50',
    previewBorder: 'border-slate-300',
    previewAccentColor: '#4F46E5',
    pageBg: 'bg-slate-50 text-slate-900',
    headerBg: 'bg-white/95 backdrop-blur-md border-b border-slate-200',
    headerTitle: 'text-slate-900',
    headerSubtitle: 'text-slate-500',
    headerNavActive: 'bg-slate-100 text-slate-900 font-semibold',
    headerNavInactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
    headerInstallBtn: 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200',
    daySelectorBg: 'bg-white border-b border-slate-200/90',
    daySelectorLabel: 'text-slate-500',
    daySelectorSubtext: 'text-slate-400',
    allDaysActive: 'bg-slate-900 border-slate-900 text-white shadow-sm',
    allDaysInactive: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300',
    dayTabActive: 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200',
    dayTabInactive: 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
    dayTabBadgeActive: 'text-indigo-100',
    dayTabBadgeInactive: 'text-indigo-600',
    dayTabDateActive: 'text-indigo-200',
    dayTabDateInactive: 'text-slate-400',
    viewBarBg: 'bg-slate-200/90',
    viewBtnTimelineActive: 'bg-white text-indigo-700 shadow-xs',
    viewBtnMapActive: 'bg-blue-600 text-white shadow-xs',
    viewBtnSplitActive: 'bg-indigo-600 text-white shadow-xs',
    viewBtnInactive: 'text-slate-600 hover:text-slate-900',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/80',
    cardHover: 'hover:border-slate-300 hover:shadow-sm',
    cardSelected: 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/30 shadow-md',
    subCardBg: 'bg-slate-50/80',
    subCardBorder: 'border-slate-100',
    dividerBorder: 'border-slate-100',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    accentText: 'text-indigo-600',
    accentBadge: 'text-indigo-600 bg-indigo-50',
    pinDefault: 'bg-slate-900 text-white',
    pinSelected: 'bg-indigo-600 text-white ring-2 ring-indigo-400',
    selectedPill: 'text-indigo-700 bg-indigo-100/90 border-indigo-200',
    selectedPillDot: 'bg-indigo-600',
    transitDefaultBg: 'bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border-blue-200/90',
    transitHotelBg: 'bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-indigo-50/90 border-indigo-300 ring-1 ring-indigo-200',
    transitIconBox: 'bg-white border-blue-200 text-blue-600',
    transitHotelIconBox: 'bg-indigo-600 text-white border-indigo-700',
    transitRoutePill: 'bg-white/70 border-slate-200/60 text-slate-700',
    foodCardDefault: 'bg-slate-50 border-slate-200/90 hover:bg-blue-50/50 hover:border-blue-300 hover:shadow-xs',
    foodCardAdded: 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/30 hover:border-rose-400 shadow-xs',
    foodAddBtn: 'text-blue-700 bg-white group-hover:bg-blue-600 group-hover:text-white border-blue-200',
    addSpotBtn: 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600',
    modalBg: 'bg-white',
    modalHeaderBg: 'bg-slate-50 border-b border-slate-200',
    modalFooterBg: 'bg-slate-50 border-t border-slate-200',
    modalBorder: 'border-slate-200 shadow-2xl',
    inputBg: 'bg-slate-50 focus:bg-white',
    inputBorder: 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
    inputText: 'text-slate-900 placeholder:text-slate-400',
    progressBarBg: 'bg-slate-200/80',
    progressFill: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    primaryBtn: 'bg-slate-900 text-white hover:bg-slate-800',
    tabActive: 'bg-white text-indigo-700 shadow-xs border border-slate-200/80',
    tabInactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
  },

  'intro-thunder': {
    id: 'intro-thunder',
    name: '인트로 번개 다크 테마',
    shortName: '⚡ 인트로 번개 다크',
    badgeText: '인트로 감성',
    description: '인트로 화면의 딥 블랙 바탕과 골드·일렉트릭 시안 번개 스파크를 입힌 시네마틱 테마',
    isDark: true,
    previewGradient: 'from-[#040711] via-[#0F172A] to-amber-500/40',
    previewBorder: 'border-amber-400/60',
    previewAccentColor: '#FACC15',
    pageBg: 'bg-[#040711] text-slate-100',
    headerBg: 'bg-[#050814]/90 backdrop-blur-xl border-b border-amber-400/25 shadow-[0_4px_24px_rgba(0,0,0,0.65)]',
    headerTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300',
    headerSubtitle: 'text-amber-300/80',
    headerNavActive: 'bg-amber-400/15 text-amber-300 border border-amber-400/40 font-bold shadow-[0_0_12px_rgba(250,204,21,0.2)]',
    headerNavInactive: 'text-slate-300 hover:text-amber-200 hover:bg-white/5',
    headerInstallBtn: 'text-amber-200 bg-white/5 hover:bg-white/10 border-amber-400/30',
    daySelectorBg: 'bg-[#070B19]/90 backdrop-blur-xl border-b border-amber-400/20',
    daySelectorLabel: 'text-amber-300/90',
    daySelectorSubtext: 'text-slate-400',
    allDaysActive: 'bg-gradient-to-r from-amber-400 to-yellow-500 border-amber-300 text-slate-950 font-black shadow-[0_0_16px_rgba(250,204,21,0.4)]',
    allDaysInactive: 'bg-[#0F172A]/90 border-slate-700/80 text-slate-200 hover:border-amber-400/50 hover:bg-slate-800/90',
    dayTabActive: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 border-amber-200 text-slate-950 shadow-[0_0_18px_rgba(250,204,21,0.45)]',
    dayTabInactive: 'bg-[#0B1120]/90 border-slate-800 text-slate-200 hover:border-amber-400/40 hover:bg-[#111A2E]',
    dayTabBadgeActive: 'text-slate-950 font-black',
    dayTabBadgeInactive: 'text-amber-400',
    dayTabDateActive: 'text-slate-900 font-bold',
    dayTabDateInactive: 'text-slate-400',
    viewBarBg: 'bg-[#0B1120]/95 border border-amber-400/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
    viewBtnTimelineActive: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-[0_0_12px_rgba(250,204,21,0.4)]',
    viewBtnMapActive: 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-black shadow-[0_0_12px_rgba(56,189,248,0.4)]',
    viewBtnSplitActive: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-sky-400 text-slate-950 font-black shadow-[0_0_14px_rgba(250,204,21,0.45)]',
    viewBtnInactive: 'text-slate-300 hover:text-white',
    cardBg: 'bg-[#0B1120]/90 backdrop-blur-xl',
    cardBorder: 'border-slate-800/90',
    cardHover: 'hover:border-amber-400/40 hover:shadow-[0_0_24px_rgba(250,204,21,0.12)]',
    cardSelected: 'border-amber-400 bg-gradient-to-br from-[#131C33]/95 via-[#0B1120]/95 to-amber-950/30 ring-2 ring-amber-400/40 shadow-[0_0_28px_rgba(250,204,21,0.2)]',
    subCardBg: 'bg-[#060A14]/90',
    subCardBorder: 'border-slate-800/80',
    dividerBorder: 'border-slate-800/80',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-200',
    textMuted: 'text-slate-400',
    accentText: 'text-amber-400',
    accentBadge: 'text-amber-300 bg-amber-400/15 border border-amber-400/30',
    pinDefault: 'bg-slate-800 text-amber-300 border border-amber-400/40',
    pinSelected: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black ring-2 ring-amber-200 shadow-[0_0_14px_rgba(250,204,21,0.6)]',
    selectedPill: 'text-amber-200 bg-amber-500/20 border-amber-400/50',
    selectedPillDot: 'bg-amber-400',
    transitDefaultBg: 'bg-gradient-to-r from-[#091224] via-[#0D1B36] to-[#091224] border-sky-500/35 shadow-[0_0_16px_rgba(56,189,248,0.1)]',
    transitHotelBg: 'bg-gradient-to-r from-amber-950/60 via-[#17132E] to-amber-950/60 border-amber-400/50 ring-1 ring-amber-400/20',
    transitIconBox: 'bg-sky-500/20 border-sky-400/40 text-sky-300',
    transitHotelIconBox: 'bg-amber-400 text-slate-950 border-amber-300 font-black',
    transitRoutePill: 'bg-[#050814]/80 border-sky-500/30 text-sky-200',
    foodCardDefault: 'bg-[#070B16] border-slate-800 hover:border-amber-400/50 hover:bg-[#0E1629]',
    foodCardAdded: 'bg-amber-500/15 border-amber-400/60 ring-1 ring-amber-400/30',
    foodAddBtn: 'text-amber-300 bg-amber-400/10 group-hover:bg-amber-400 group-hover:text-slate-950 border-amber-400/40',
    addSpotBtn: 'border-amber-400/30 hover:border-amber-400 hover:bg-amber-400/10 text-amber-200/80 hover:text-amber-300',
    modalBg: 'bg-[#060914]',
    modalHeaderBg: 'bg-[#090F21]/95 border-b border-amber-400/25',
    modalFooterBg: 'bg-[#080D1D]/95 border-t border-amber-400/20',
    modalBorder: 'border-amber-400/35 shadow-[0_0_40px_rgba(250,204,21,0.15)]',
    inputBg: 'bg-[#0C1428] focus:bg-[#101A33]',
    inputBorder: 'border-amber-400/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25',
    inputText: 'text-amber-100 placeholder:text-slate-500',
    progressBarBg: 'bg-[#0D1529] border border-amber-400/20',
    progressFill: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(250,204,21,0.5)]',
    primaryBtn: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black hover:brightness-110 shadow-[0_0_14px_rgba(250,204,21,0.4)]',
    tabActive: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-[0_0_12px_rgba(250,204,21,0.4)]',
    tabInactive: 'text-slate-300 hover:text-amber-200 hover:bg-amber-400/10'
  },

  'tokyo-night-glass': {
    id: 'tokyo-night-glass',
    name: '도쿄 타워 에메랄드·라임 글래스 테마',
    shortName: '🗼 도쿄타워 에메랄드 글래스',
    badgeText: '에메랄드 글래스',
    description: '도쿄타워의 신비로운 에메랄드 & 라임 연두빛 야경과 청량한 그린 글래스모피즘(Glassmorphism)을 담은 테마',
    isDark: true,
    previewGradient: 'from-[#03150D] via-emerald-950 to-lime-500/50',
    previewBorder: 'border-emerald-400/70',
    previewAccentColor: '#10B981',
    pageBg: 'bg-[#04120A] text-slate-100',
    headerBg: 'bg-[#071D12]/80 backdrop-blur-2xl border-b border-emerald-400/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]',
    headerTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-lime-300',
    headerSubtitle: 'text-emerald-200/80',
    headerNavActive: 'bg-gradient-to-r from-emerald-600/30 to-lime-600/30 text-emerald-200 border border-emerald-400/50 font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    headerNavInactive: 'text-slate-300 hover:text-white hover:bg-white/10',
    headerInstallBtn: 'text-emerald-100 bg-white/10 hover:bg-white/15 border-emerald-400/30',
    daySelectorBg: 'bg-[#082015]/75 backdrop-blur-2xl border-b border-emerald-400/15',
    daySelectorLabel: 'text-emerald-300',
    daySelectorSubtext: 'text-emerald-200/70',
    allDaysActive: 'bg-gradient-to-r from-emerald-500 to-lime-500 border-emerald-300 text-slate-950 font-black shadow-[0_0_18px_rgba(16,185,129,0.5)]',
    allDaysInactive: 'bg-white/[0.06] border-white/15 text-slate-200 hover:bg-emerald-900/30 hover:border-emerald-400/40',
    dayTabActive: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-lime-600 border-emerald-300/80 text-white shadow-[0_4px_22px_rgba(16,185,129,0.45)]',
    dayTabInactive: 'bg-white/[0.05] backdrop-blur-md border-white/15 text-slate-200 hover:bg-white/10 hover:border-emerald-400/40',
    dayTabBadgeActive: 'text-lime-200 font-black',
    dayTabBadgeInactive: 'text-emerald-400',
    dayTabDateActive: 'text-emerald-100',
    dayTabDateInactive: 'text-slate-400',
    viewBarBg: 'bg-white/[0.07] backdrop-blur-xl border border-emerald-400/20',
    viewBtnTimelineActive: 'bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-black shadow-sm',
    viewBtnMapActive: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-sm',
    viewBtnSplitActive: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 text-slate-950 font-black shadow-sm',
    viewBtnInactive: 'text-slate-300 hover:text-white',
    cardBg: 'bg-white/[0.06] backdrop-blur-2xl',
    cardBorder: 'border-white/15',
    cardHover: 'hover:border-emerald-400/60 hover:bg-white/[0.09] hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]',
    cardSelected: 'border-emerald-400/80 bg-gradient-to-br from-emerald-600/20 via-[#0A2618]/90 to-lime-600/20 ring-2 ring-emerald-400/40 shadow-[0_8px_32px_rgba(16,185,129,0.3)]',
    subCardBg: 'bg-black/35 backdrop-blur-md',
    subCardBorder: 'border-emerald-400/20',
    dividerBorder: 'border-emerald-400/20',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-100',
    textMuted: 'text-emerald-200/70',
    accentText: 'text-emerald-400',
    accentBadge: 'text-emerald-200 bg-emerald-500/20 border border-emerald-400/40',
    pinDefault: 'bg-white/15 text-white border border-white/25 backdrop-blur-md',
    pinSelected: 'bg-gradient-to-br from-emerald-500 to-lime-500 text-slate-950 ring-2 ring-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.65)] font-black',
    selectedPill: 'text-emerald-200 bg-emerald-500/20 border-emerald-400/50',
    selectedPillDot: 'bg-lime-400',
    transitDefaultBg: 'bg-gradient-to-r from-emerald-950/70 via-teal-950/70 to-emerald-950/70 backdrop-blur-xl border-emerald-400/30',
    transitHotelBg: 'bg-gradient-to-r from-teal-950/80 via-emerald-950/80 to-lime-950/80 backdrop-blur-xl border-emerald-400/60 ring-1 ring-emerald-400/30',
    transitIconBox: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
    transitHotelIconBox: 'bg-gradient-to-br from-emerald-500 to-lime-500 text-slate-950 border-emerald-300',
    transitRoutePill: 'bg-black/40 border-emerald-400/25 text-emerald-200',
    foodCardDefault: 'bg-white/[0.04] border-white/15 hover:bg-white/[0.09] hover:border-emerald-400/50',
    foodCardAdded: 'bg-emerald-500/15 border-emerald-400/60 ring-1 ring-emerald-400/30',
    foodAddBtn: 'text-emerald-200 bg-white/10 group-hover:bg-emerald-600 group-hover:text-white border-emerald-400/40',
    addSpotBtn: 'border-white/25 hover:border-emerald-400 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-200',
    modalBg: 'bg-[#06180F]/95 backdrop-blur-2xl',
    modalHeaderBg: 'bg-white/[0.07] backdrop-blur-xl border-b border-emerald-400/20',
    modalFooterBg: 'bg-white/[0.05] backdrop-blur-xl border-t border-emerald-400/15',
    modalBorder: 'border-emerald-400/35 shadow-[0_8px_36px_rgba(16,185,129,0.25)]',
    inputBg: 'bg-white/[0.06] focus:bg-white/[0.1]',
    inputBorder: 'border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30',
    inputText: 'text-white placeholder:text-emerald-200/50',
    progressBarBg: 'bg-white/10 border border-emerald-400/20',
    progressFill: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    primaryBtn: 'bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-black hover:brightness-110 shadow-md shadow-emerald-500/30',
    tabActive: 'bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-black shadow-xs',
    tabInactive: 'text-slate-300 hover:text-white hover:bg-white/10'
  },

  'cyber-akiba': {
    id: 'cyber-akiba',
    name: '사이버펑크 아키하바라 네온 테마',
    shortName: '👾 아키하바라 네온',
    badgeText: '사이버 네온',
    description: '도쿄 아키하바라·신주쿠의 화려한 시안 & 마젠타 네온사인을 모티브로 한 미래형 나이트 보드',
    isDark: true,
    previewGradient: 'from-[#060314] via-fuchsia-950 to-cyan-500/40',
    previewBorder: 'border-cyan-400/70',
    previewAccentColor: '#06B6D4',
    pageBg: 'bg-[#060312] text-slate-100',
    headerBg: 'bg-[#09051C]/90 backdrop-blur-xl border-b border-cyan-500/35 shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    headerTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400',
    headerSubtitle: 'text-cyan-300/80',
    headerNavActive: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    headerNavInactive: 'text-slate-300 hover:text-cyan-200 hover:bg-cyan-500/10',
    headerInstallBtn: 'text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border-cyan-500/40',
    daySelectorBg: 'bg-[#0A051E]/90 backdrop-blur-xl border-b border-fuchsia-500/25',
    daySelectorLabel: 'text-cyan-400',
    daySelectorSubtext: 'text-fuchsia-300/70',
    allDaysActive: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 border-cyan-200 text-slate-950 font-black shadow-[0_0_18px_rgba(6,182,212,0.5)]',
    allDaysInactive: 'bg-[#120A2E]/90 border-cyan-500/25 text-slate-200 hover:border-cyan-400/60',
    dayTabActive: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-600 border-cyan-300 text-white shadow-[0_0_20px_rgba(6,182,212,0.45)]',
    dayTabInactive: 'bg-[#11092B]/85 border-fuchsia-500/25 text-slate-200 hover:border-cyan-400/50 hover:bg-[#190E3D]',
    dayTabBadgeActive: 'text-white font-black',
    dayTabBadgeInactive: 'text-cyan-400',
    dayTabDateActive: 'text-cyan-100',
    dayTabDateInactive: 'text-slate-400',
    viewBarBg: 'bg-[#11092B]/90 border border-cyan-500/30',
    viewBtnTimelineActive: 'bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.45)]',
    viewBtnMapActive: 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white font-black shadow-[0_0_12px_rgba(236,72,153,0.45)]',
    viewBtnSplitActive: 'bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 text-white font-black shadow-[0_0_15px_rgba(236,72,153,0.45)]',
    viewBtnInactive: 'text-slate-300 hover:text-cyan-300',
    cardBg: 'bg-[#0F0826]/90 backdrop-blur-xl',
    cardBorder: 'border-cyan-500/25',
    cardHover: 'hover:border-cyan-400/60 hover:shadow-[0_0_24px_rgba(6,182,212,0.18)]',
    cardSelected: 'border-cyan-400 bg-gradient-to-br from-cyan-950/60 via-[#140A33]/95 to-fuchsia-950/50 ring-2 ring-fuchsia-500/40 shadow-[0_0_28px_rgba(6,182,212,0.28)]',
    subCardBg: 'bg-[#080417]/90',
    subCardBorder: 'border-cyan-500/20',
    dividerBorder: 'border-cyan-500/20',
    textPrimary: 'text-white',
    textSecondary: 'text-cyan-50',
    textMuted: 'text-slate-400',
    accentText: 'text-cyan-400',
    accentBadge: 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/35',
    pinDefault: 'bg-[#1A103C] text-cyan-300 border border-cyan-500/40',
    pinSelected: 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-slate-950 font-black ring-2 ring-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.7)]',
    selectedPill: 'text-cyan-200 bg-cyan-500/20 border-cyan-400/50',
    selectedPillDot: 'bg-cyan-400',
    transitDefaultBg: 'bg-gradient-to-r from-[#0B0620] via-[#10183B] to-[#0B0620] border-cyan-400/40',
    transitHotelBg: 'bg-gradient-to-r from-fuchsia-950/70 via-[#1A0B38] to-cyan-950/70 border-fuchsia-400/50 ring-1 ring-fuchsia-400/30',
    transitIconBox: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
    transitHotelIconBox: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-white border-cyan-300',
    transitRoutePill: 'bg-[#060312]/80 border-cyan-500/30 text-cyan-200',
    foodCardDefault: 'bg-[#09051A] border-cyan-500/20 hover:border-fuchsia-400/60 hover:bg-[#130B30]',
    foodCardAdded: 'bg-fuchsia-500/15 border-fuchsia-400/60 ring-1 ring-fuchsia-400/30',
    foodAddBtn: 'text-cyan-300 bg-cyan-500/10 group-hover:bg-cyan-400 group-hover:text-slate-950 border-cyan-400/40',
    addSpotBtn: 'border-cyan-500/35 hover:border-cyan-400 hover:bg-cyan-500/10 text-cyan-300/80 hover:text-cyan-200',
    modalBg: 'bg-[#080418]',
    modalHeaderBg: 'bg-[#0E0729]/95 border-b border-cyan-500/35',
    modalFooterBg: 'bg-[#0C0624]/95 border-t border-cyan-500/25',
    modalBorder: 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)]',
    inputBg: 'bg-[#120A32] focus:bg-[#180E42]',
    inputBorder: 'border-cyan-500/35 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30',
    inputText: 'text-cyan-100 placeholder:text-slate-500',
    progressBarBg: 'bg-[#130A33] border border-cyan-500/30',
    progressFill: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 shadow-[0_0_14px_rgba(6,182,212,0.6)]',
    primaryBtn: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    tabActive: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.45)]',
    tabInactive: 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10'
  },

  'sakura-editorial': {
    id: 'sakura-editorial',
    name: '사쿠라 나이트 프리미엄 에디토리얼',
    shortName: '🌸 사쿠라 나이트',
    badgeText: '프리미엄 감성',
    description: '미드나잇 플럼 다크 배경과 은은한 사쿠라 로즈골드·샴페인 조명을 입힌 감성 에디토리얼 테마',
    isDark: true,
    previewGradient: 'from-[#110C1A] via-[#241634] to-pink-400/40',
    previewBorder: 'border-pink-400/60',
    previewAccentColor: '#F472B6',
    pageBg: 'bg-[#0F0B17] text-stone-100',
    headerBg: 'bg-[#150F20]/90 backdrop-blur-xl border-b border-pink-300/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]',
    headerTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-200',
    headerSubtitle: 'text-pink-300/80',
    headerNavActive: 'bg-pink-500/20 text-pink-200 border border-pink-400/40 font-bold',
    headerNavInactive: 'text-stone-300 hover:text-pink-200 hover:bg-white/5',
    headerInstallBtn: 'text-pink-200 bg-white/5 hover:bg-white/10 border-pink-300/25',
    daySelectorBg: 'bg-[#161022]/90 backdrop-blur-xl border-b border-pink-300/15',
    daySelectorLabel: 'text-pink-300',
    daySelectorSubtext: 'text-stone-400',
    allDaysActive: 'bg-gradient-to-r from-pink-500 to-rose-500 border-pink-300 text-white font-bold shadow-[0_0_16px_rgba(244,114,182,0.4)]',
    allDaysInactive: 'bg-[#1E162B] border-pink-300/20 text-stone-200 hover:border-pink-400/40',
    dayTabActive: 'bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 border-pink-200 text-white shadow-[0_4px_18px_rgba(244,114,182,0.38)]',
    dayTabInactive: 'bg-[#1B1427]/90 border-pink-300/15 text-stone-200 hover:border-pink-400/40 hover:bg-[#241A33]',
    dayTabBadgeActive: 'text-pink-50 font-black',
    dayTabBadgeInactive: 'text-pink-400',
    dayTabDateActive: 'text-amber-100',
    dayTabDateInactive: 'text-stone-400',
    viewBarBg: 'bg-[#1B1427]/95 border border-pink-300/20',
    viewBtnTimelineActive: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-xs',
    viewBtnMapActive: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-xs',
    viewBtnSplitActive: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold shadow-xs',
    viewBtnInactive: 'text-stone-300 hover:text-pink-200',
    cardBg: 'bg-[#191224]/90 backdrop-blur-xl',
    cardBorder: 'border-pink-300/20',
    cardHover: 'hover:border-pink-400/45 hover:shadow-[0_8px_28px_rgba(244,114,182,0.12)]',
    cardSelected: 'border-pink-400/80 bg-gradient-to-br from-pink-500/15 via-[#211730]/95 to-amber-500/10 ring-2 ring-pink-400/35 shadow-[0_8px_30px_rgba(244,114,182,0.2)]',
    subCardBg: 'bg-[#110C19]/90',
    subCardBorder: 'border-pink-300/15',
    dividerBorder: 'border-pink-300/15',
    textPrimary: 'text-stone-50',
    textSecondary: 'text-stone-200',
    textMuted: 'text-stone-400',
    accentText: 'text-pink-400',
    accentBadge: 'text-pink-200 bg-pink-500/20 border border-pink-400/30',
    pinDefault: 'bg-[#281D38] text-pink-200 border border-pink-400/30',
    pinSelected: 'bg-gradient-to-br from-pink-400 via-rose-500 to-amber-400 text-slate-950 font-black ring-2 ring-pink-200 shadow-[0_0_14px_rgba(244,114,182,0.5)]',
    selectedPill: 'text-pink-200 bg-pink-500/20 border-pink-400/50',
    selectedPillDot: 'bg-pink-400',
    transitDefaultBg: 'bg-gradient-to-r from-[#171124] via-[#211834] to-[#171124] border-pink-400/30',
    transitHotelBg: 'bg-gradient-to-r from-rose-950/70 via-[#281736] to-amber-950/50 border-pink-400/50 ring-1 ring-pink-400/25',
    transitIconBox: 'bg-pink-500/20 border-pink-400/40 text-pink-300',
    transitHotelIconBox: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white border-pink-300',
    transitRoutePill: 'bg-[#0F0B17]/80 border-pink-400/25 text-pink-100',
    foodCardDefault: 'bg-[#130E1C] border-pink-300/15 hover:border-pink-400/50 hover:bg-[#1D152B]',
    foodCardAdded: 'bg-pink-500/15 border-pink-400/60 ring-1 ring-pink-400/30',
    foodAddBtn: 'text-pink-200 bg-pink-500/15 group-hover:bg-pink-500 group-hover:text-white border-pink-400/40',
    addSpotBtn: 'border-pink-400/30 hover:border-pink-400 hover:bg-pink-500/10 text-pink-200/80 hover:text-pink-200',
    modalBg: 'bg-[#110B1B]',
    modalHeaderBg: 'bg-[#1A1129]/95 border-b border-pink-300/25',
    modalFooterBg: 'bg-[#170E24]/95 border-t border-pink-300/20',
    modalBorder: 'border-pink-300/30 shadow-[0_8px_36px_rgba(244,114,182,0.2)]',
    inputBg: 'bg-[#1C132C] focus:bg-[#251A3A]',
    inputBorder: 'border-pink-300/25 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/25',
    inputText: 'text-stone-100 placeholder:text-stone-500',
    progressBarBg: 'bg-[#1E142E] border border-pink-300/20',
    progressFill: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(244,114,182,0.4)]',
    primaryBtn: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold hover:brightness-110 shadow-md shadow-pink-500/25',
    tabActive: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-xs',
    tabInactive: 'text-stone-300 hover:text-pink-200 hover:bg-pink-500/10'
  }
};

export const SCHEDULE_THEME_LIST: ScheduleThemeConfig[] = [
  SCHEDULE_THEMES['intro-thunder'],
  SCHEDULE_THEMES['tokyo-night-glass'],
  SCHEDULE_THEMES['cyber-akiba'],
  SCHEDULE_THEMES['sakura-editorial'],
  SCHEDULE_THEMES['classic-light']
];

const STORAGE_KEY = 'tokyo_trip_schedule_theme_v1';

export function loadSavedScheduleTheme(): ScheduleThemeId {
  if (typeof window === 'undefined') return 'intro-thunder';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ScheduleThemeId | null;
    if (saved && SCHEDULE_THEMES[saved]) {
      return saved;
    }
  } catch {}
  return 'intro-thunder';
}

export function saveScheduleTheme(themeId: ScheduleThemeId): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {}
}
