/**
 * useReaderTracking — Hook de captura de eventos de lector
 *
 * Captura comportamiento anónimo de navegación y lectura.
 * Envía eventos a Supabase en tiempo real para ser procesados
 * por el motor de análisis.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// ── Tipos de evento ──────────────────────────────────────────
export const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  ARTICLE_OPEN: 'article_open',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PARAGRAPH: 'time_on_paragraph',
  ZOOM_CHANGE: 'zoom_change',
  ORIENTATION_CHANGE: 'orientation_change',
  IMAGE_CLICK: 'image_click',
  TEXT_COPY: 'text_copy',
  SHARE: 'share',
  CHAT_OPEN: 'chat_open',
  SEARCH_ARTICLE: 'search_article',
  EXIT: 'exit',
  ARTICLE_CLOSE: 'article_close',
};

// ── Generador de sessionId anónimo ───────────────────────────
function generateSessionId() {
  if (typeof window === 'undefined') return null;
  let sid = sessionStorage.getItem('__reader_sid');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('__reader_sid', sid);
  }
  return sid;
}

// ── Hook principal ───────────────────────────────────────────
export function useReaderTracking() {
  const sessionId = useRef(generateSessionId());
  const [pageUrl, setPageUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const scrollDepthRef = useRef(0);
  const lastScrollDepth = useRef(0);
  const paragraphTimes = useRef(new Map()); // id → timestamp
  const imageClickCount = useRef(0);
  const textCopyCount = useRef(0);
  const chatOpened = useRef(false);
  const searchCount = useRef(0);

  // Track URL/title changes
  useEffect(() => {
    setPageUrl(window.location.pathname + window.location.search);
    setPageTitle(document.title);
  }, []);

  // ── Capturar scroll depth ──────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      scrollDepthRef.current = depth;

      // Emitir cada 10%
      if (depth - lastScrollDepth.current >= 10) {
        lastScrollDepth.current = depth;
        sendEvent(EVENT_TYPES.SCROLL_DEPTH, { depth });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Detectar clic en imágenes ──────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.tagName === 'IMG') {
        imageClickCount.current++;
        sendEvent(EVENT_TYPES.IMAGE_CLICK, {
          src: e.target.src?.slice(0, 120),
          clickCount: imageClickCount.current,
        });
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // ── Detectar copia de texto ────────────────────────────────
  useEffect(() => {
    const handleCopy = () => {
      textCopyCount.current++;
      sendEvent(EVENT_TYPES.TEXT_COPY, {
        copyCount: textCopyCount.current,
      });
    };
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  // ── Detectar zoom ──────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(min-resolution: 1.25dppx)');
    const handler = () => sendEvent(EVENT_TYPES.ZOOM_CHANGE, { zoom: window.devicePixelRatio });
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Detectar orientación ───────────────────────────────────
  useEffect(() => {
    const handler = () => sendEvent(EVENT_TYPES.ORIENTATION_CHANGE, { orientation: window.orientation });
    window.addEventListener('orientationchange', handler);
    return () => window.removeEventListener('orientationchange', handler);
  }, []);

  // ── Detectar búsqueda (buscador de artículos) ──────────────
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const input = document.querySelector('input[placeholder*="buscar"], input[placeholder*="Buscar"]');
      if (input && input.value.length > 0) {
        searchCount.current++;
        sendEvent(EVENT_TYPES.SEARCH_ARTICLE, { query: input.value.slice(0, 100) });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // ── Detectar cierre de pestaña ─────────────────────────────
  useEffect(() => {
    const handleUnload = () => {
      sendEvent(EVENT_TYPES.EXIT, {
        lastScrollDepth: scrollDepthRef.current,
        imageClickCount: imageClickCount.current,
        textCopyCount: textCopyCount.current,
        chatOpened: chatOpened.current,
      });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // ── Detectar apertura de chat IA ───────────────────────────
  const openChat = useCallback(() => {
    chatOpened.current = true;
    sendEvent(EVENT_TYPES.CHAT_OPEN, { timestamp: new Date().toISOString() });
  }, []);

  // ── Registrar apertura de artículo ─────────────────────────
  const trackArticleOpen = useCallback((slug, title) => {
    sendEvent(EVENT_TYPES.ARTICLE_OPEN, {
      article_slug: slug,
      article_title: title,
    });
  }, []);

  // ── Registrar cierre de artículo ───────────────────────────
  const trackArticleClose = useCallback((slug) => {
    sendEvent(EVENT_TYPES.ARTICLE_CLOSE, {
      article_slug: slug,
    });
  }, []);

  // ── Registrar tiempo en párrafo ────────────────────────────
  const trackParagraphTime = useCallback((paragraphId) => {
    const now = Date.now();
    if (paragraphTimes.current.has(paragraphId)) {
      const elapsed = Math.round((now - paragraphTimes.current.get(paragraphId)) / 1000);
      paragraphTimes.current.delete(paragraphId);
      if (elapsed > 2) {
        sendEvent(EVENT_TYPES.TIME_ON_PARAGRAPH, {
          paragraph_id: paragraphId,
          seconds: elapsed,
        });
      }
    } else {
      paragraphTimes.current.set(paragraphId, now);
    }
  }, []);

  // ── Página vista ───────────────────────────────────────────
  const trackPageView = useCallback(() => {
    sendEvent(EVENT_TYPES.PAGE_VIEW, {
      page_url: pageUrl,
      page_title: pageTitle,
    });
  }, [pageUrl, pageTitle]);

  return {
    trackArticleOpen,
    trackArticleClose,
    trackParagraphTime,
    trackPageView,
    openChat,
  };
}

// ── Enviar evento a Supabase ─────────────────────────────────
async function sendEvent(eventType, payload = {}) {
  if (!sessionId.current) return;

  try {
    await supabase.from('reader_events').insert({
      session_id: sessionId.current,
      event_type: eventType,
      payload: payload,
      page_url: pageUrl,
      page_title: pageTitle,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Silenciar errores de escritura (tabla puede no existir aún)
    console.debug('[ReaderTracking] No se pudo guardar evento:', eventType, err);
  }
}
