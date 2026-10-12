import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Zap,
  Check,
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'pwa' | 'zip' | 'share';
}

export const MobileInstallModal: React.FC<MobileInstallModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'pwa',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'zip' | 'share'>(defaultTab);
  const [isCopied, setIsCopied] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-oiaqqysqtjmwxoir5xl2xb-506718550284.asia-northeast1.run.app';

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
      }
    } catch {
      // User cancelled install prompt or browser rejected
    } finally {
      setIsInstalling(false);
    }
  };

  const handleCopyLink = () => {
    const textToCopy = `[⚡ 도쿄 원정대 - 개구쟁이들의 일본여행 5박 6일]\n스마트폰 홈화면에 앱으로 설치하여 실시간 동선과 가계부를 확인하세요!\n👉 접속 링크: ${appUrl}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-black overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Comic Pop Art Style */}
        <div className="bg-amber-300 px-5 py-4 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* The Black Box with Yellow Lightning Icon */}
            <div className="w-11 h-11 bg-black rounded-2xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0_#fff] shrink-0">
              <span className="text-amber-300 text-2xl font-black select-none">⚡</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-black tracking-tight leading-tight flex items-center gap-1.5">
                스마트폰 앱 설치 & 전달 패키지
              </h2>
              <p className="text-xs font-bold text-slate-800">
                홈 화면 아이콘 생성 & 압축 파일(ZIP) 안내
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border-2 border-black flex items-center justify-center text-black font-black shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-slate-100 px-3 py-2 border-b-2 border-slate-300 flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-black text-amber-300 border-2 border-black shadow-[2px_2px_0_#000]'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 3초 홈화면 설치</span>
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'zip'
                ? 'bg-black text-amber-300 border-2 border-black shadow-[2px_2px_0_#000]'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>📦 압축파일(ZIP) 받기</span>
          </button>

          <button
            onClick={() => setActiveTab('share')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'share'
                ? 'bg-black text-amber-300 border-2 border-black shadow-[2px_2px_0_#000]'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>🔗 링크 공유</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {/* TAB 1: 3-Second PWA Home Screen Installation */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              {/* Highlight Banner */}
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-300 flex items-center justify-center font-black text-xl shrink-0 shadow-[2px_2px_0_#000]">
                  ⚡
                </div>
                <div className="text-xs sm:text-sm leading-relaxed">
                  <div className="font-black text-black">
                    검정색 바탕 + 노란색 번개 아이콘(⚡) 생성
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    설치 완료 시 스마트폰 바탕화면에 앱 아이콘이 생기며, 누르면 주소창 없이 <strong>카카오톡처럼 전체화면으로 즉시 실행</strong>됩니다!
                  </div>
                </div>
              </div>

              {/* Status or Direct Install Button if supported */}
              {isInstalled ? (
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-black text-emerald-800">이미 스마트폰 홈 화면에 설치되어 실행 중입니다!</div>
                    <div className="text-xs text-emerald-700 mt-0.5">바탕화면의 번개 아이콘으로 언제든지 터치 한 번에 접속 가능합니다.</div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-500 rounded-2xl p-4 text-center space-y-3">
                  <div className="font-black text-slate-900 text-base">
                    🚀 스마트폰 원터치 앱 설치
                  </div>
                  <button
                    onClick={() => {
                      if (isInstallable) {
                        handleInstallClick();
                      } else {
                        // Guide user where the button is
                        const guideElem = document.getElementById('samsung-menu-guide');
                        if (guideElem) {
                          guideElem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    disabled={isInstalling}
                    className="w-full py-3.5 px-4 bg-black text-amber-300 hover:bg-slate-900 font-black rounded-xl border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
                  >
                    <Zap className="w-5 h-5 fill-amber-300" />
                    <span>{isInstalling ? '설치 진행 중...' : '⚡ 지금 스마트폰 홈 화면에 바로 설치하기'}</span>
                  </button>
                  {installSuccess && (
                    <div className="text-xs text-emerald-700 font-black flex items-center justify-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      홈 화면에 아이콘이 성공적으로 추가되었습니다!
                    </div>
                  )}
                </div>
              )}

              {/* Step-by-Step Instructions for Android vs iPhone */}
              <div className="space-y-3">
                <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>스마트폰 기기별 정확한 설치 메뉴 위치</span>
                </div>

                {/* Important Notice for KakaoTalk / In-app Browsers */}
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 text-xs text-rose-950 space-y-1">
                  <div className="font-black text-rose-800 flex items-center gap-1">
                    🚨 혹시 카카오톡이나 문자에서 링크를 누르셨나요?
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    카카오톡 내부 브라우저에서는 앱 설치가 제한됩니다. 우측 상단 <strong>점 3개(⋮)</strong>를 터치한 뒤 <strong>[다른 브라우저로 열기]</strong>(또는 삼성인터넷/크롬)를 눌러서 열어주세요!
                  </div>
                </div>

                {/* Android Galaxy & Samsung Internet Guide */}
                <div id="samsung-menu-guide" className="border-2 border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-700 text-xs sm:text-sm flex items-center gap-1.5">
                      📱 삼성 인터넷 (메뉴가 안 보일 때 찾는 방법)
                    </span>
                    <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                      위치 안내
                    </span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-950 space-y-1.5">
                    <div className="font-black text-blue-900">
                      📍 메뉴가 어디에 숨어있나요?
                    </div>
                    <div className="text-slate-700 space-y-1">
                      <div>• <strong>지름길 1 (화면 맨 위):</strong> 주소창 오른쪽 끝에 있는 <strong>[ ⬇ ] 다운로드 아이콘</strong> 터치 → [설치]</div>
                      <div>• <strong>지름길 2 (화면 맨 아래):</strong> 우측 하단 <strong>줄 3개(☰)</strong> 터치 → 첫 화면의 <strong>[ + 현재 페이지 추가 ]</strong> 터치 → <strong>[앱]</strong> 또는 <strong>[홈 화면]</strong> 선택!</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-2 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>설치 후 바탕화면의 <strong>검정+노란 번개(⚡)</strong> 아이콘을 누르면 주소창 없이 전체화면으로 실행됩니다.</span>
                  </div>
                </div>

                {/* Android Chrome Guide */}
                <div className="border-2 border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-700 text-xs sm:text-sm flex items-center gap-1.5">
                      🌐 안드로이드 구글 크롬 (Chrome)
                    </span>
                  </div>
                  <ol className="text-xs text-slate-700 space-y-1 list-decimal list-inside leading-relaxed pl-1">
                    <li>우측 상단 <strong>점 3개(⋮)</strong> 터치 → <strong>[앱 설치]</strong> (또는 [홈 화면에 추가]) 선택</li>
                    <li>팝업에서 <strong>[설치]</strong> 터치 시 상단 주소창 없는 독립 앱으로 설치 완료</li>
                  </ol>
                </div>

                {/* iPhone Safari Guide */}
                <div className="border-2 border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-700 text-xs sm:text-sm flex items-center gap-1.5">
                      🍎 애플 아이폰 / 아이패드 (Safari 사파리)
                    </span>
                    <span className="text-[11px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      아이폰 필수
                    </span>
                  </div>
                  <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside leading-relaxed pl-1">
                    <li>
                      반드시 <strong>Safari(사파리) 브라우저</strong>로 접속합니다.
                    </li>
                    <li>
                      화면 하단 중앙의 <strong>공유 버튼 (네모 위로 화살표 ↑)</strong>을 누릅니다.
                    </li>
                    <li>
                      메뉴를 아래로 스크롤하여 <strong>[홈 화면에 추가]</strong>를 터치합니다.
                    </li>
                    <li>
                      우측 상단의 <strong>[추가]</strong>를 누르면 끝!
                    </li>
                  </ol>
                  <div className="bg-white rounded-xl p-2 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>아이폰 바탕화면에 <strong>검정 바탕 노란 번개(⚡)</strong> 앱이 생성됩니다.</span>
                  </div>
                </div>
              </div>

              {/* Running Experience Benefits */}
              <div className="bg-slate-900 text-white rounded-2xl p-3.5 border-2 border-black space-y-1.5 text-xs">
                <div className="font-black text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>홈 화면 아이콘으로 실행하면 좋은 점!</span>
                </div>
                <ul className="text-slate-300 space-y-1 pl-1">
                  <li>• 주소창이나 브라우저 뒤로가기 바가 사라져 <strong>100% 진짜 앱 화면</strong>으로 시원하게 표시</li>
                  <li>• 터치 한 번에 1초 만에 실행되며 오프라인 상태에서도 일정/지도 즉시 확인</li>
                  <li>• 가족 간 실시간 가계부 동기화 및 삼성카드 결제 알림 자동 등록 완벽 지원</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: ZIP File Download & Manual Transfer */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border-2 border-sky-400 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-[2px_2px_0_#000]">
                  📦
                </div>
                <div className="text-xs sm:text-sm leading-relaxed">
                  <div className="font-black text-sky-950">
                    스마트폰 전달용 설치 패키지 (ZIP 압축 파일)
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    압축 파일 형태로 다운로드하여 카카오톡이나 파일 공유로 스마트폰에 보낸 후 사용할 수 있습니다.
                  </div>
                </div>
              </div>

              {/* Download Action Box */}
              <div className="border-3 border-black rounded-2xl p-4 bg-gradient-to-b from-white to-slate-50 shadow-[4px_4px_0_#000] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900 text-sm">
                      tokyo-trip-mobile-package.zip
                    </div>
                    <div className="text-xs text-slate-500">
                      약 20KB · 원클릭 런처, 고해상도 앱 아이콘(PNG/SVG), 상세 설명서 포함
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-amber-200 text-amber-900 text-[11px] font-black rounded-lg border border-black">
                    준비 완료
                  </span>
                </div>

                <a
                  href="/api/download/mobile-package"
                  download="도쿄원정대_스마트폰_설치패키지.zip"
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-xl border-2 border-black shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-center text-sm"
                >
                  <Download className="w-5 h-5 text-black" />
                  <span>📦 스마트폰 설치 패키지 (.zip) 다운로드</span>
                </a>
              </div>

              {/* Contents list */}
              <div className="border-2 border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-2 text-xs">
                <div className="font-black text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>압축 파일 안에 들어있는 구성품</span>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="font-black text-amber-600 shrink-0">⚡</span>
                    <div>
                      <span className="font-black text-slate-900">도쿄원정대_실행하기.html</span>
                      <p className="text-[11px] text-slate-500">스마트폰에서 터치하면 바로 전체화면 전용 앱으로 연결되는 스마트 런처 파일</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="font-black text-amber-600 shrink-0">🖼️</span>
                    <div>
                      <span className="font-black text-slate-900">앱아이콘_검정바탕_노란번개 (192px / 512px / SVG)</span>
                      <p className="text-[11px] text-slate-500">첫페이지 좌측 상단과 동일한 검정 바탕 노란 번개 고해상도 앱 아이콘</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="font-black text-amber-600 shrink-0">📝</span>
                    <div>
                      <span className="font-black text-slate-900">스마트폰_홈화면_아이콘_설치가이드.txt</span>
                      <p className="text-[11px] text-slate-500">갤럭시 및 아이폰에서 홈 화면에 아이콘을 만드는 상세 방법 안내문</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smartphone Unpack & Run Guide */}
              <div className="border-2 border-slate-300 rounded-2xl p-3.5 bg-white space-y-2">
                <div className="font-black text-slate-900 text-xs sm:text-sm">
                  💡 스마트폰에서 전달받아 압축 풀고 실행하는 순서
                </div>
                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    카카오톡 또는 파일로 전달받은 ZIP 파일을 터치하고 <strong>[압축 풀기]</strong>를 누릅니다.
                  </li>
                  <li>
                    압축이 풀린 폴더에서 <strong>[⚡_도쿄원정대_실행하기.html]</strong>을 터치하여 브라우저로 엽니다.
                  </li>
                  <li>
                    열린 화면에서 <strong>[⚡ 원클릭 앱 실행하기]</strong>를 누르고, 브라우저 메뉴의 <strong>[홈 화면에 추가]</strong>를 누르면 바탕화면에 검정 바탕 노란 번개 아이콘이 생성됩니다!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: Share Link */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border-2 border-purple-400 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-[2px_2px_0_#000]">
                  💬
                </div>
                <div className="text-xs sm:text-sm leading-relaxed">
                  <div className="font-black text-purple-950">
                    가족 카톡방 전송용 스마트폰 링크 복사
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    가족들에게 카카오톡으로 링크를 보내주면, 스마트폰에서 링크를 누르고 3초 만에 홈 화면에 번개 아이콘을 만들 수 있습니다.
                  </div>
                </div>
              </div>

              {/* Link Box */}
              <div className="border-2 border-slate-300 rounded-2xl p-3.5 bg-slate-50 space-y-2.5">
                <div className="text-xs font-bold text-slate-600">앱 접속 주소:</div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono text-xs text-slate-800 break-all select-all">
                  {appUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-black font-black rounded-xl border-2 border-black shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>카톡 초대 메시지 복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>카카오톡 전송용 초대 메시지 복사</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preview of KakaoTalk Message */}
              <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-300 text-xs text-slate-800 space-y-1">
                <div className="font-black text-yellow-900 flex items-center gap-1">
                  <span>📱 카톡 전송 시 함께 전달되는 내용:</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-yellow-200 text-[11px] leading-relaxed text-slate-700">
                  [⚡ 도쿄 원정대 - 개구쟁이들의 일본여행 5박 6일]<br />
                  스마트폰 홈화면에 앱으로 설치하여 실시간 동선과 가계부를 확인하세요!<br />
                  👉 접속 링크: {appUrl}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t-2 border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>아이콘 터치 시 1초 전체화면 실행 보장</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black rounded-xl text-xs transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
