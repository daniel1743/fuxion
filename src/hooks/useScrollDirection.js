import { useState, useEffect, useRef } from 'react';

/**
 * Detects scroll direction for smart sticky headers.
 * Returns { scrollDirection: 'up' | 'down', isAtTop: boolean, scrollY: number }
 */
export function useScrollDirection(threshold = 8) {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;

      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY < 10);

      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
        ticking.current = false;
        return;
      }

      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDir);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrollDirection, isAtTop, scrollY };
}
