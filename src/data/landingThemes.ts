import { ScheduleThemeId } from './scheduleThemes';

export interface LandingBoltGrad {
  idSuffix: string;
  stop0: string;
  stop1: string;
  stop2: string;
  stop3: string;
  floodColor: string;
  strokeColor: string;
}

export interface LandingThemeConfig {
  id: ScheduleThemeId;
  isDark: boolean;
  // Page root
  rootBg: string;
  // Header
  headerBg: string;
  headerBorder: string;
  headerBrandTitle: string;
  headerBrandBadge: string;
  headerUserBtn: string;
  headerInstallBtn: string;
  headerDdayPill: string;
  // Lightning bolt SVG
  boltGrad: LandingBoltGrad;
  boltBoxBg: string;
  // Hero section
  heroBgOverlay: string;
  heroVignetteBottom: string;
  heroVignetteTop: string;
  heroAura: string;
  heroEmblemBox: string;
  mottoBadge: string;
  mottoText: string;
  mottoIconColor: string;
  heroTitle: string;
  heroTitleShadow: string;
  heroTitleGradient: string;
  heroSubtitle: string;
  // D-Day HUD
  ddayBox: string;
  ddayBadge: string;
  ddayTitle: string;
  ddaySubtitle: string;
  ddayNumberDays: string;
  ddayTimerBox: string;
  ddayTimerLabel: string;
  ddayInfoBanner: string;
  // Action Buttons
  primaryBtn: string;
  secondaryBtn: string;
  // Quick Stats
  statsCardBg: string;
  statsCardBorder: string;
  statsCardText: string;
  statsCardNum1: string;
  statsCardNum2: string;
  statsCardNum3: string;
  statsCardNum4: string;
  // Daily Mission Section (5박 6일 일자별 공략 코스)
  sectionDailyBg: string;
  dailySectionBadge: string;
  dailySectionTitle: string;
  dailySectionSubtitle: string;
  dailyAllBtn: string;
  episodeCardBg: string;
  episodeCardHover: string;
  episodeDayBadge: string;
  episodeSubBadge: string;
  episodeTitle: string;
  episodeTitleHover: string;
  episodeDesc: string;
  episodeSpotsBox: string;
  episodeSpotsTitle: string;
  episodeSpotsText: string;
  episodeCtaText: string;
  // Boys Crew Types Section
  sectionCrewBg: string;
  crewSectionBadge: string;
  crewSectionTitle: string;
  crewSectionSubtitle: string;
  survivalCardBg: string;
  survivalItemBg: string;
  survivalItemTitle: string;
  survivalItemDesc: string;
  checklistBanner: string;
  checklistTitle: string;
  checklistDesc: string;
  checklistBtn: string;
  // Weapons Section
  sectionWeaponsBg: string;
  weaponsSectionBadge: string;
  weaponsSectionTitle: string;
  weaponCardBg: string;
  weaponCardTitle: string;
  weaponCardDesc: string;
  // Final CTA & Footer
  sectionFinalBg: string;
  finalTitle: string;
  finalSubtitle: string;
  finalPrimaryBtn: string;
  footerBg: string;
  footerBorder: string;
  footerText: string;
}

export const LANDING_THEMES: Record<ScheduleThemeId, LandingThemeConfig> = {
  // 1. 인트로 번개 다크 (골든 옐로우 시네마틱)
  'intro-thunder': {
    id: 'intro-thunder',
    isDark: true,
    rootBg: 'bg-[#040711] text-white selection:bg-yellow-400 selection:text-black',
    headerBg: 'bg-black/80 backdrop-blur-2xl border-b border-white/10',
    headerBorder: 'border-white/10',
    headerBrandTitle: 'text-white',
    headerBrandBadge: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40 shadow-[0_0_10px_rgba(250,204,21,0.25)]',
    headerUserBtn: 'bg-white/10 hover:bg-white/20 border-yellow-400/40 text-white shadow-[0_0_15px_rgba(250,204,21,0.18)]',
    headerInstallBtn: 'bg-yellow-400/10 hover:bg-yellow-400/20 border-yellow-400/30 text-yellow-300',
    headerDdayPill: 'bg-white/5 border-white/10 text-amber-300',
    boltGrad: {
      idSuffix: 'introThunder',
      stop0: '#FFFFFF',
      stop1: '#FEF08A',
      stop2: '#FACC15',
      stop3: '#EAB308',
      floodColor: '#FACC15',
      strokeColor: '#FFFBEB'
    },
    boltBoxBg: 'bg-black/70 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.4)]',
    heroBgOverlay: 'bg-black/45',
    heroVignetteBottom: 'from-black via-black/80 to-transparent',
    heroVignetteTop: 'from-black/80 to-transparent',
    heroAura: 'bg-yellow-400/15',
    heroEmblemBox: 'bg-black/50 border-yellow-400/40 shadow-[0_0_35px_rgba(250,204,21,0.4)]',
    mottoBadge: 'bg-black/70 border-yellow-400/50 text-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.25)]',
    mottoText: 'text-yellow-300',
    mottoIconColor: 'text-yellow-400 fill-yellow-400',
    heroTitle: 'text-white',
    heroTitleShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(250,204,21,0.4)',
    heroTitleGradient: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(250,204,21,0.55)]',
    heroSubtitle: 'text-slate-200',
    ddayBox: 'bg-zinc-950/80 backdrop-blur-2xl border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)]',
    ddayBadge: 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)]',
    ddayTitle: 'text-yellow-300',
    ddaySubtitle: 'text-slate-300',
    ddayNumberDays: 'text-yellow-300',
    ddayTimerBox: 'bg-white/5 border-white/10',
    ddayTimerLabel: 'text-slate-400',
    ddayInfoBanner: 'text-slate-300 bg-white/5 border-white/10',
    primaryBtn: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-black shadow-[0_0_35px_rgba(250,204,21,0.5)]',
    secondaryBtn: 'bg-white/10 hover:bg-white/20 text-white border-white/20',
    statsCardBg: 'bg-zinc-950/70 backdrop-blur-md',
    statsCardBorder: 'border-white/10',
    statsCardText: 'text-slate-400',
    statsCardNum1: 'text-yellow-400',
    statsCardNum2: 'text-amber-300',
    statsCardNum3: 'text-sky-400',
    statsCardNum4: 'text-emerald-400',
    sectionDailyBg: 'bg-zinc-950 border-b border-white/10',
    dailySectionBadge: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40 shadow-[0_0_12px_rgba(250,204,21,0.2)]',
    dailySectionTitle: 'text-white',
    dailySectionSubtitle: 'text-slate-400',
    dailyAllBtn: 'bg-white/10 hover:bg-white/20 text-yellow-300 border-white/15',
    episodeCardBg: 'bg-black/80 hover:bg-zinc-900 border-white/10 hover:border-yellow-400/50',
    episodeCardHover: 'hover:-translate-y-1.5 shadow-xl',
    episodeDayBadge: 'bg-yellow-400 text-black shadow-[0_0_12px_rgba(250,204,21,0.4)]',
    episodeSubBadge: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
    episodeTitle: 'text-white',
    episodeTitleHover: 'group-hover:text-yellow-300',
    episodeDesc: 'text-slate-400',
    episodeSpotsBox: 'bg-white/5 border-white/10',
    episodeSpotsTitle: 'text-yellow-400',
    episodeSpotsText: 'text-slate-300',
    episodeCtaText: 'text-yellow-400 group-hover:text-yellow-300',
    sectionCrewBg: 'bg-black border-b border-white/10',
    crewSectionBadge: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    crewSectionTitle: 'text-white',
    crewSectionSubtitle: 'text-slate-400',
    survivalCardBg: 'bg-zinc-950/80 border-white/15 backdrop-blur-xl',
    survivalItemBg: 'bg-white/5 border-white/10',
    survivalItemTitle: 'text-white',
    survivalItemDesc: 'text-slate-400',
    checklistBanner: 'bg-yellow-400/10 border-yellow-400/30',
    checklistTitle: 'text-white',
    checklistDesc: 'text-slate-400',
    checklistBtn: 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_0_20px_rgba(250,204,21,0.4)]',
    sectionWeaponsBg: 'bg-zinc-950 border-b border-white/10',
    weaponsSectionBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    weaponsSectionTitle: 'text-white',
    weaponCardBg: 'bg-white/5 border-white/10 hover:border-yellow-400/40',
    weaponCardTitle: 'text-white',
    weaponCardDesc: 'text-slate-400',
    sectionFinalBg: 'bg-black text-white',
    finalTitle: 'text-white',
    finalSubtitle: 'text-slate-400',
    finalPrimaryBtn: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-black shadow-[0_0_30px_rgba(250,204,21,0.5)]',
    footerBg: 'bg-black border-t border-white/10',
    footerBorder: 'border-white/10',
    footerText: 'text-slate-500'
  },

  // 2. 도쿄타워 파스텔 연두 글래스 (소프트 라임 글래스모피즘)
  'tokyo-night-glass': {
    id: 'tokyo-night-glass',
    isDark: true,
    rootBg: 'bg-[#090C0B] text-slate-100 selection:bg-lime-200 selection:text-slate-950',
    headerBg: 'bg-[#0D1210]/85 backdrop-blur-2xl border-b border-lime-200/20',
    headerBorder: 'border-lime-200/20',
    headerBrandTitle: 'text-white',
    headerBrandBadge: 'bg-lime-200/15 text-lime-200 border-lime-200/40 shadow-[0_0_10px_rgba(217,249,157,0.2)]',
    headerUserBtn: 'bg-white/10 hover:bg-white/15 border-lime-200/35 text-white shadow-[0_0_15px_rgba(217,249,157,0.15)]',
    headerInstallBtn: 'bg-lime-200/10 hover:bg-lime-200/20 border-lime-200/30 text-lime-200',
    headerDdayPill: 'bg-white/5 border-white/10 text-lime-200',
    boltGrad: {
      idSuffix: 'tokyoNightGlass',
      stop0: '#FFFFFF',
      stop1: '#ECFCCB',
      stop2: '#D9F99D',
      stop3: '#A3E635',
      floodColor: '#D9F99D',
      strokeColor: '#F7FEE7'
    },
    boltBoxBg: 'bg-black/60 border-lime-200/40 shadow-[0_0_15px_rgba(217,249,157,0.3)]',
    heroBgOverlay: 'bg-black/50',
    heroVignetteBottom: 'from-[#090C0B] via-[#090C0B]/85 to-transparent',
    heroVignetteTop: 'from-[#090C0B]/80 to-transparent',
    heroAura: 'bg-lime-300/15',
    heroEmblemBox: 'bg-black/50 border-lime-200/40 shadow-[0_0_35px_rgba(217,249,157,0.3)]',
    mottoBadge: 'bg-black/70 border-lime-200/40 text-lime-100 shadow-[0_0_20px_rgba(217,249,157,0.2)]',
    mottoText: 'text-lime-100',
    mottoIconColor: 'text-lime-200 fill-lime-200',
    heroTitle: 'text-white',
    heroTitleShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 35px rgba(217,249,157,0.35)',
    heroTitleGradient: 'bg-gradient-to-r from-lime-100 via-emerald-200 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(217,249,157,0.45)]',
    heroSubtitle: 'text-slate-200',
    ddayBox: 'bg-black/60 backdrop-blur-2xl border-lime-200/25 shadow-[0_20px_60px_rgba(0,0,0,0.85)]',
    ddayBadge: 'bg-lime-200 text-slate-950 font-black shadow-[0_0_18px_rgba(217,249,157,0.4)]',
    ddayTitle: 'text-lime-200',
    ddaySubtitle: 'text-slate-300',
    ddayNumberDays: 'text-lime-200',
    ddayTimerBox: 'bg-white/[0.04] border-white/10',
    ddayTimerLabel: 'text-slate-400',
    ddayInfoBanner: 'text-slate-300 bg-white/[0.04] border-white/10',
    primaryBtn: 'bg-gradient-to-r from-lime-200 via-emerald-200 to-teal-200 hover:brightness-105 text-slate-950 font-black shadow-[0_0_25px_rgba(217,249,157,0.35)]',
    secondaryBtn: 'bg-white/10 hover:bg-white/15 text-white border-white/20',
    statsCardBg: 'bg-white/[0.04] backdrop-blur-md',
    statsCardBorder: 'border-white/10',
    statsCardText: 'text-slate-400',
    statsCardNum1: 'text-lime-200',
    statsCardNum2: 'text-emerald-300',
    statsCardNum3: 'text-sky-300',
    statsCardNum4: 'text-teal-300',
    sectionDailyBg: 'bg-[#0B0F0D] border-b border-lime-200/15',
    dailySectionBadge: 'bg-lime-200/15 text-lime-200 border-lime-200/35 shadow-[0_0_12px_rgba(217,249,157,0.15)]',
    dailySectionTitle: 'text-white',
    dailySectionSubtitle: 'text-slate-400',
    dailyAllBtn: 'bg-white/10 hover:bg-white/15 text-lime-200 border-white/15',
    episodeCardBg: 'bg-white/[0.035] hover:bg-white/[0.07] border-white/15 hover:border-lime-200/40',
    episodeCardHover: 'hover:-translate-y-1.5 shadow-xl',
    episodeDayBadge: 'bg-lime-200 text-slate-950 font-black shadow-[0_0_12px_rgba(217,249,157,0.35)]',
    episodeSubBadge: 'text-lime-100 bg-lime-400/10 border-lime-200/25',
    episodeTitle: 'text-white',
    episodeTitleHover: 'group-hover:text-lime-200',
    episodeDesc: 'text-slate-400',
    episodeSpotsBox: 'bg-white/[0.03] border-white/10',
    episodeSpotsTitle: 'text-lime-200',
    episodeSpotsText: 'text-slate-300',
    episodeCtaText: 'text-lime-200 group-hover:text-lime-100',
    sectionCrewBg: 'bg-[#090C0B] border-b border-lime-200/15',
    crewSectionBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    crewSectionTitle: 'text-white',
    crewSectionSubtitle: 'text-slate-400',
    survivalCardBg: 'bg-black/60 border-lime-200/20 backdrop-blur-xl',
    survivalItemBg: 'bg-white/[0.04] border-white/10',
    survivalItemTitle: 'text-white',
    survivalItemDesc: 'text-slate-400',
    checklistBanner: 'bg-lime-200/10 border-lime-200/30',
    checklistTitle: 'text-white',
    checklistDesc: 'text-slate-300',
    checklistBtn: 'bg-lime-200 hover:bg-white text-slate-950 font-bold shadow-[0_0_20px_rgba(217,249,157,0.3)]',
    sectionWeaponsBg: 'bg-[#0B0F0D] border-b border-lime-200/15',
    weaponsSectionBadge: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    weaponsSectionTitle: 'text-white',
    weaponCardBg: 'bg-white/[0.04] border-white/10 hover:border-lime-200/40',
    weaponCardTitle: 'text-white',
    weaponCardDesc: 'text-slate-400',
    sectionFinalBg: 'bg-[#090C0B] text-white',
    finalTitle: 'text-white',
    finalSubtitle: 'text-slate-400',
    finalPrimaryBtn: 'bg-gradient-to-r from-lime-200 via-emerald-200 to-teal-200 hover:brightness-105 text-slate-950 font-black shadow-[0_0_25px_rgba(217,249,157,0.35)]',
    footerBg: 'bg-[#080B0A] border-t border-white/10',
    footerBorder: 'border-white/10',
    footerText: 'text-slate-500'
  },

  // 3. 아키하바라 사이버 네온 (시안 & 마젠타 퓨처)
  'cyber-akiba': {
    id: 'cyber-akiba',
    isDark: true,
    rootBg: 'bg-[#060312] text-slate-100 selection:bg-cyan-400 selection:text-black',
    headerBg: 'bg-[#09051C]/85 backdrop-blur-2xl border-b border-cyan-500/35',
    headerBorder: 'border-cyan-500/35',
    headerBrandTitle: 'text-white',
    headerBrandBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    headerUserBtn: 'bg-cyan-950/40 hover:bg-cyan-900/40 border-cyan-400/45 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    headerInstallBtn: 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/40 text-cyan-200',
    headerDdayPill: 'bg-white/5 border-cyan-500/30 text-cyan-300',
    boltGrad: {
      idSuffix: 'cyberAkiba',
      stop0: '#FFFFFF',
      stop1: '#CFFAFE',
      stop2: '#22D3EE',
      stop3: '#E879F9',
      floodColor: '#22D3EE',
      strokeColor: '#ECFEFF'
    },
    boltBoxBg: 'bg-black/70 border-cyan-400/50 shadow-[0_0_18px_rgba(6,182,212,0.45)]',
    heroBgOverlay: 'bg-[#060312]/50',
    heroVignetteBottom: 'from-[#060312] via-[#060312]/85 to-transparent',
    heroVignetteTop: 'from-[#060312]/80 to-transparent',
    heroAura: 'bg-cyan-400/20',
    heroEmblemBox: 'bg-black/60 border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.45)]',
    mottoBadge: 'bg-black/70 border-cyan-400/50 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    mottoText: 'text-cyan-300',
    mottoIconColor: 'text-cyan-400 fill-cyan-400',
    heroTitle: 'text-white',
    heroTitleShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(6,182,212,0.5)',
    heroTitleGradient: 'bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]',
    heroSubtitle: 'text-slate-200',
    ddayBox: 'bg-[#0E0729]/80 backdrop-blur-2xl border-cyan-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.95)]',
    ddayBadge: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    ddayTitle: 'text-cyan-300',
    ddaySubtitle: 'text-slate-300',
    ddayNumberDays: 'text-cyan-300',
    ddayTimerBox: 'bg-white/5 border-cyan-500/25',
    ddayTimerLabel: 'text-slate-400',
    ddayInfoBanner: 'text-slate-300 bg-white/5 border-cyan-500/25',
    primaryBtn: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 hover:brightness-110 text-slate-950 font-black shadow-[0_0_35px_rgba(6,182,212,0.5)]',
    secondaryBtn: 'bg-white/10 hover:bg-cyan-500/20 text-white border-cyan-500/30',
    statsCardBg: 'bg-[#0F0826]/80 backdrop-blur-md',
    statsCardBorder: 'border-cyan-500/25',
    statsCardText: 'text-slate-400',
    statsCardNum1: 'text-cyan-300',
    statsCardNum2: 'text-fuchsia-300',
    statsCardNum3: 'text-sky-300',
    statsCardNum4: 'text-pink-300',
    sectionDailyBg: 'bg-[#09051A] border-b border-cyan-500/25',
    dailySectionBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    dailySectionTitle: 'text-white',
    dailySectionSubtitle: 'text-slate-400',
    dailyAllBtn: 'bg-white/10 hover:bg-white/20 text-cyan-300 border-cyan-500/30',
    episodeCardBg: 'bg-[#0F0826]/85 hover:bg-[#150C36] border-cyan-500/25 hover:border-cyan-400/60',
    episodeCardHover: 'hover:-translate-y-1.5 shadow-xl',
    episodeDayBadge: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    episodeSubBadge: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/35',
    episodeTitle: 'text-white',
    episodeTitleHover: 'group-hover:text-cyan-300',
    episodeDesc: 'text-slate-400',
    episodeSpotsBox: 'bg-white/5 border-cyan-500/20',
    episodeSpotsTitle: 'text-cyan-400',
    episodeSpotsText: 'text-slate-300',
    episodeCtaText: 'text-cyan-300 group-hover:text-cyan-200',
    sectionCrewBg: 'bg-[#060312] border-b border-cyan-500/25',
    crewSectionBadge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40',
    crewSectionTitle: 'text-white',
    crewSectionSubtitle: 'text-slate-400',
    survivalCardBg: 'bg-[#0E0729]/80 border-cyan-500/30 backdrop-blur-xl',
    survivalItemBg: 'bg-white/5 border-cyan-500/20',
    survivalItemTitle: 'text-white',
    survivalItemDesc: 'text-slate-400',
    checklistBanner: 'bg-cyan-500/10 border-cyan-500/30',
    checklistTitle: 'text-white',
    checklistDesc: 'text-slate-300',
    checklistBtn: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    sectionWeaponsBg: 'bg-[#09051A] border-b border-cyan-500/25',
    weaponsSectionBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    weaponsSectionTitle: 'text-white',
    weaponCardBg: 'bg-white/5 border-cyan-500/20 hover:border-cyan-400/50',
    weaponCardTitle: 'text-white',
    weaponCardDesc: 'text-slate-400',
    sectionFinalBg: 'bg-[#060312] text-white',
    finalTitle: 'text-white',
    finalSubtitle: 'text-slate-400',
    finalPrimaryBtn: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 hover:brightness-110 text-slate-950 font-black shadow-[0_0_35px_rgba(6,182,212,0.5)]',
    footerBg: 'bg-[#050210] border-t border-cyan-500/20',
    footerBorder: 'border-cyan-500/20',
    footerText: 'text-slate-500'
  },

  // 4. 사쿠라 나이트 에디토리얼 (플럼 & 샴페인 로즈골드)
  'sakura-editorial': {
    id: 'sakura-editorial',
    isDark: true,
    rootBg: 'bg-[#0F0B17] text-stone-100 selection:bg-pink-400 selection:text-black',
    headerBg: 'bg-[#150F20]/85 backdrop-blur-2xl border-b border-pink-300/25',
    headerBorder: 'border-pink-300/25',
    headerBrandTitle: 'text-white',
    headerBrandBadge: 'bg-pink-500/20 text-pink-200 border-pink-400/40 shadow-[0_0_10px_rgba(244,114,182,0.25)]',
    headerUserBtn: 'bg-pink-950/40 hover:bg-pink-900/40 border-pink-400/40 text-white shadow-[0_0_15px_rgba(244,114,182,0.2)]',
    headerInstallBtn: 'bg-pink-500/15 hover:bg-pink-500/25 border-pink-400/35 text-pink-200',
    headerDdayPill: 'bg-white/5 border-pink-300/20 text-pink-200',
    boltGrad: {
      idSuffix: 'sakuraEditorial',
      stop0: '#FFFFFF',
      stop1: '#FCE7F3',
      stop2: '#F472B6',
      stop3: '#FB7185',
      floodColor: '#F472B6',
      strokeColor: '#FFF1F2'
    },
    boltBoxBg: 'bg-black/60 border-pink-400/45 shadow-[0_0_16px_rgba(244,114,182,0.35)]',
    heroBgOverlay: 'bg-[#0F0B17]/50',
    heroVignetteBottom: 'from-[#0F0B17] via-[#0F0B17]/85 to-transparent',
    heroVignetteTop: 'from-[#0F0B17]/80 to-transparent',
    heroAura: 'bg-pink-400/20',
    heroEmblemBox: 'bg-black/60 border-pink-400/40 shadow-[0_0_35px_rgba(244,114,182,0.35)]',
    mottoBadge: 'bg-[#191224]/80 border-pink-400/40 text-pink-200 shadow-[0_0_25px_rgba(244,114,182,0.25)]',
    mottoText: 'text-pink-200',
    mottoIconColor: 'text-pink-400 fill-pink-400',
    heroTitle: 'text-white',
    heroTitleShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 35px rgba(244,114,182,0.4)',
    heroTitleGradient: 'bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(244,114,182,0.5)]',
    heroSubtitle: 'text-stone-200',
    ddayBox: 'bg-[#191224]/80 backdrop-blur-2xl border-pink-300/25 shadow-[0_20px_60px_rgba(0,0,0,0.9)]',
    ddayBadge: 'bg-gradient-to-r from-pink-400 via-rose-500 to-amber-400 text-slate-950 font-black shadow-[0_0_20px_rgba(244,114,182,0.4)]',
    ddayTitle: 'text-pink-200',
    ddaySubtitle: 'text-stone-300',
    ddayNumberDays: 'text-pink-300',
    ddayTimerBox: 'bg-white/5 border-pink-300/20',
    ddayTimerLabel: 'text-stone-400',
    ddayInfoBanner: 'text-stone-300 bg-white/5 border-pink-300/20',
    primaryBtn: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:brightness-105 text-slate-950 font-black shadow-[0_0_35px_rgba(244,114,182,0.45)]',
    secondaryBtn: 'bg-white/10 hover:bg-pink-500/20 text-white border-pink-300/25',
    statsCardBg: 'bg-[#191224]/80 backdrop-blur-md',
    statsCardBorder: 'border-pink-300/20',
    statsCardText: 'text-stone-400',
    statsCardNum1: 'text-pink-300',
    statsCardNum2: 'text-rose-300',
    statsCardNum3: 'text-amber-200',
    statsCardNum4: 'text-pink-200',
    sectionDailyBg: 'bg-[#130E1C] border-b border-pink-300/20',
    dailySectionBadge: 'bg-pink-500/20 text-pink-200 border-pink-400/35 shadow-[0_0_12px_rgba(244,114,182,0.2)]',
    dailySectionTitle: 'text-white',
    dailySectionSubtitle: 'text-stone-400',
    dailyAllBtn: 'bg-white/10 hover:bg-white/20 text-pink-200 border-pink-300/25',
    episodeCardBg: 'bg-[#191224]/85 hover:bg-[#211730] border-pink-300/20 hover:border-pink-400/50',
    episodeCardHover: 'hover:-translate-y-1.5 shadow-xl',
    episodeDayBadge: 'bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 text-slate-950 font-black shadow-[0_0_12px_rgba(244,114,182,0.35)]',
    episodeSubBadge: 'text-pink-200 bg-pink-500/15 border-pink-400/30',
    episodeTitle: 'text-white',
    episodeTitleHover: 'group-hover:text-pink-300',
    episodeDesc: 'text-stone-400',
    episodeSpotsBox: 'bg-white/5 border-pink-300/15',
    episodeSpotsTitle: 'text-pink-300',
    episodeSpotsText: 'text-stone-300',
    episodeCtaText: 'text-pink-300 group-hover:text-pink-200',
    sectionCrewBg: 'bg-[#0F0B17] border-b border-pink-300/20',
    crewSectionBadge: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    crewSectionTitle: 'text-white',
    crewSectionSubtitle: 'text-stone-400',
    survivalCardBg: 'bg-[#191224]/80 border-pink-300/25 backdrop-blur-xl',
    survivalItemBg: 'bg-white/5 border-pink-300/15',
    survivalItemTitle: 'text-white',
    survivalItemDesc: 'text-stone-400',
    checklistBanner: 'bg-pink-500/10 border-pink-400/30',
    checklistTitle: 'text-white',
    checklistDesc: 'text-stone-300',
    checklistBtn: 'bg-gradient-to-r from-pink-400 to-rose-500 text-slate-950 font-black shadow-[0_0_20px_rgba(244,114,182,0.35)]',
    sectionWeaponsBg: 'bg-[#130E1C] border-b border-pink-300/20',
    weaponsSectionBadge: 'bg-pink-500/20 text-pink-200 border-pink-400/35',
    weaponsSectionTitle: 'text-white',
    weaponCardBg: 'bg-white/5 border-pink-300/15 hover:border-pink-400/45',
    weaponCardTitle: 'text-white',
    weaponCardDesc: 'text-stone-400',
    sectionFinalBg: 'bg-[#0F0B17] text-white',
    finalTitle: 'text-white',
    finalSubtitle: 'text-stone-400',
    finalPrimaryBtn: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:brightness-105 text-slate-950 font-black shadow-[0_0_35px_rgba(244,114,182,0.45)]',
    footerBg: 'bg-[#0B0812] border-t border-pink-300/15',
    footerBorder: 'border-pink-300/15',
    footerText: 'text-stone-500'
  },

  // 5. 클래식 라이트 (화이트 & 인디고 모던)
  'classic-light': {
    id: 'classic-light',
    isDark: false,
    rootBg: 'bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white',
    headerBg: 'bg-white/90 backdrop-blur-2xl border-b border-slate-200 shadow-xs',
    headerBorder: 'border-slate-200',
    headerBrandTitle: 'text-slate-900',
    headerBrandBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs',
    headerUserBtn: 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs',
    headerInstallBtn: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700',
    headerDdayPill: 'bg-slate-100 border-slate-200 text-indigo-700',
    boltGrad: {
      idSuffix: 'classicLight',
      stop0: '#FFFFFF',
      stop1: '#C7D2FE',
      stop2: '#818CF8',
      stop3: '#4F46E5',
      floodColor: '#4F46E5',
      strokeColor: '#EEF2FF'
    },
    boltBoxBg: 'bg-white border-indigo-200 shadow-xs',
    heroBgOverlay: 'bg-slate-900/55',
    heroVignetteBottom: 'from-slate-50 via-slate-50/90 to-transparent',
    heroVignetteTop: 'from-slate-900/60 to-transparent',
    heroAura: 'bg-indigo-500/20',
    heroEmblemBox: 'bg-white/90 border-indigo-200 shadow-[0_0_35px_rgba(79,70,229,0.25)]',
    mottoBadge: 'bg-white/95 border-indigo-200 text-indigo-800 shadow-sm',
    mottoText: 'text-indigo-800',
    mottoIconColor: 'text-indigo-600 fill-indigo-600',
    heroTitle: 'text-white',
    heroTitleShadow: '0 2px 10px rgba(0,0,0,0.6)',
    heroTitleGradient: 'bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]',
    heroSubtitle: 'text-slate-100',
    ddayBox: 'bg-white/95 backdrop-blur-2xl border-slate-200 shadow-xl text-slate-900',
    ddayBadge: 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-200',
    ddayTitle: 'text-indigo-700',
    ddaySubtitle: 'text-slate-600',
    ddayNumberDays: 'text-indigo-600',
    ddayTimerBox: 'bg-slate-50 border-slate-200',
    ddayTimerLabel: 'text-slate-500',
    ddayInfoBanner: 'text-slate-600 bg-slate-50 border-slate-200',
    primaryBtn: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:brightness-105 text-white font-black shadow-[0_4px_20px_rgba(79,70,229,0.35)]',
    secondaryBtn: 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm',
    statsCardBg: 'bg-white/95 backdrop-blur-md',
    statsCardBorder: 'border-slate-200',
    statsCardText: 'text-slate-600',
    statsCardNum1: 'text-indigo-600',
    statsCardNum2: 'text-blue-600',
    statsCardNum3: 'text-sky-600',
    statsCardNum4: 'text-emerald-600',
    sectionDailyBg: 'bg-white border-b border-slate-200',
    dailySectionBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs',
    dailySectionTitle: 'text-slate-900',
    dailySectionSubtitle: 'text-slate-500',
    dailyAllBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
    episodeCardBg: 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300',
    episodeCardHover: 'hover:-translate-y-1.5 shadow-md',
    episodeDayBadge: 'bg-indigo-600 text-white font-black shadow-xs',
    episodeSubBadge: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    episodeTitle: 'text-slate-900',
    episodeTitleHover: 'group-hover:text-indigo-600',
    episodeDesc: 'text-slate-600',
    episodeSpotsBox: 'bg-slate-50 border-slate-200',
    episodeSpotsTitle: 'text-indigo-600',
    episodeSpotsText: 'text-slate-700',
    episodeCtaText: 'text-indigo-600 group-hover:text-indigo-700',
    sectionCrewBg: 'bg-slate-50 border-b border-slate-200',
    crewSectionBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    crewSectionTitle: 'text-slate-900',
    crewSectionSubtitle: 'text-slate-500',
    survivalCardBg: 'bg-white border-slate-200 shadow-md',
    survivalItemBg: 'bg-slate-50 border-slate-200',
    survivalItemTitle: 'text-slate-900',
    survivalItemDesc: 'text-slate-600',
    checklistBanner: 'bg-indigo-50/70 border-indigo-200',
    checklistTitle: 'text-slate-900',
    checklistDesc: 'text-slate-600',
    checklistBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md shadow-indigo-200',
    sectionWeaponsBg: 'bg-white border-b border-slate-200',
    weaponsSectionBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    weaponsSectionTitle: 'text-slate-900',
    weaponCardBg: 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30',
    weaponCardTitle: 'text-slate-900',
    weaponCardDesc: 'text-slate-600',
    sectionFinalBg: 'bg-slate-900 text-white',
    finalTitle: 'text-white',
    finalSubtitle: 'text-slate-300',
    finalPrimaryBtn: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 text-black font-black shadow-[0_0_30px_rgba(250,204,21,0.5)]',
    footerBg: 'bg-slate-950 border-t border-slate-800',
    footerBorder: 'border-slate-800',
    footerText: 'text-slate-400'
  }
};

export function getLandingTheme(themeId?: ScheduleThemeId): LandingThemeConfig {
  if (themeId && LANDING_THEMES[themeId]) {
    return LANDING_THEMES[themeId];
  }
  return LANDING_THEMES['intro-thunder'];
}
