import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ScrollAwareFloating — Hook para manejo inteligente de opacidad/scale
 * en botones flotantes durante scroll.
 *
 * Comportamiento:
 * - Al hacer scroll: baja opacidad a 0.35-0.45 y scale a 0.92
 * - Al detener scroll 600ms: restaura opacidad 1 y scale 1
 * - Hover/touch restaura opacidad inmediatamente
 * - Nunca oculta completamente los botones
 */
export function useScrollAware(opts = {}) {
  const {
    idleOpacity = 1,
    idleScale = 1,
    scrollingOpacity = 0.4,
    scrollingScale = 0.92,
    settleDelay = 600,
  } = opts;

  const [isScrolling, setIsScrolling] = useState(false);
  const settleTimerRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const isScrollingRef = useRef(false);

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Solo activar si realmente hay movimiento
      if (Math.abs(currentScrollY - lastScrollYRef.current) < 3) return;
      lastScrollYRef.current = currentScrollY;

      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        setIsScrolling(true);
      }

      clearSettleTimer();
      settleTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
      }, settleDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearSettleTimer();
    };
  }, [settleDelay, clearSettleTimer]);

  const currentOpacity = isScrolling ? scrollingOpacity : idleOpacity;
  const currentScale = isScrolling ? scrollingScale : idleScale;

  return {
    isScrolling,
    opacity: currentOpacity,
    scale: currentScale,
    style: {
      opacity: currentOpacity,
      scale: currentScale,
      transition: 'opacity 250ms ease, scale 250ms ease',
      willChange: 'opacity, scale',
    },
  };
}

/**
 * ScrollAwareGroup — Componente contenedor que aplica scroll-awareness
 * a un grupo de elementos flotantes.
 *
 * Props:
 * - className: clases adicionales
 * - children: elementos hijos
 * - style: estilos adicionales
 * - as: elemento HTML (default 'div')
 */
export function ScrollAwareGroup({ children, className = '', style = {}, as: Tag = 'div', ...rest }) {
  const { style: scrollStyle } = useScrollAware();

  return (
    <Tag
      className={className}
      style={{ ...scrollStyle, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default useScrollAware;
