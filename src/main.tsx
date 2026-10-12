import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent mobile browser pull-to-refresh (모바일 화면 최상단 당겨서 새로고침 방지)
if (typeof window !== 'undefined') {
  let touchStartY = 0;

  window.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        // User pulls downward (finger moving down)
        if (currentY > touchStartY) {
          const isAtTop =
            window.scrollY <= 0 &&
            (document.documentElement ? document.documentElement.scrollTop <= 0 : true) &&
            (document.body ? document.body.scrollTop <= 0 : true);

          if (isAtTop) {
            // Check if touch target is inside a scrollable container that is already scrolled down
            let target = e.target as HTMLElement | null;
            let canScrollUp = false;
            while (target && target !== document.body && target !== document.documentElement) {
              if (target.scrollTop > 0) {
                canScrollUp = true;
                break;
              }
              target = target.parentElement;
            }

            // If at the very top and not inside a scrolled-down element, prevent pull-to-refresh reload
            if (!canScrollUp && e.cancelable) {
              e.preventDefault();
            }
          }
        }
      }
    },
    { passive: false }
  );
}

// Register Service Worker for Android (Samsung Internet & Chrome) PWA installability
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Quiet fallback
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

