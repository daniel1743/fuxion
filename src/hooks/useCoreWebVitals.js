/**
 * Core Web Vitals Tracker
 * Mide y envía LCP, CLS e INP a analytics
 */

import { useEffect, useRef } from 'react';

const CWV_CONFIG = {
  lcp: { value: 2.5, threshold: 3.0 }, // Good: <2.5s, Needs improvement: <3.0s
  cls: { value: 0.1, threshold: 0.25 }, // Good: <0.1, Needs improvement: <0.25
  inp: { value: 200, threshold: 300 }, // Good: <200ms, Needs improvement: <300ms
};

/**
 * Hook que mide Core Web Vitals y envía a analytics
 */
export function useCoreWebVitals(analyticsTrack) {
  const lcpRef = useRef(null);
  const clsRef = useRef(0);
  const inpRef = useRef(0);

  useEffect(() => {
    // 1. Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcpRef.current = lastEntry.startTime;

      // Solo reportar si es la primera carga
      if (!lcpObserver._reported) {
        lcpObserver._reported = true;
        const lcp = Math.round(lastEntry.startTime);
        const grade = lcp <= CWV_CONFIG.lcp.value ? 'good' :
                     lcp <= CWV_CONFIG.lcp.threshold ? 'needs-improvement' : 'poor';

        console.log(`[CWV] LCP: ${lcp}ms (${grade})`);
        if (analyticsTrack) {
          analyticsTrack('core_web_vitals', { metric: 'lcp', value: lcp, grade });
        }
      }
    });

    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // 2. Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsRef.current += entry.value;
        }
      }
    });

    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    const reportCls = () => {
      const cls = Math.round(clsRef.current * 1000) / 1000;
      const grade = cls <= CWV_CONFIG.cls.value ? 'good' :
                   cls <= CWV_CONFIG.cls.threshold ? 'needs-improvement' : 'poor';

      console.log(`[CWV] CLS: ${cls} (${grade})`);
      if (analyticsTrack) {
        analyticsTrack('core_web_vitals', { metric: 'cls', value: cls, grade });
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCls();
      }
    });

    window.addEventListener('beforeunload', reportCls);

    // 3. Interaction to Next Paint (INP)
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > CWV_CONFIG.inp.threshold) {
          inpRef.current = Math.max(inpRef.current, entry.duration);
        }
      }
    });

    inpObserver.observe({ type: 'event', buffered: true });

    // Report INP on page hide
    const reportInp = () => {
      const inp = Math.round(inpRef.current);
      const grade = inp <= CWV_CONFIG.inp.value ? 'good' :
                   inp <= CWV_CONFIG.inp.threshold ? 'needs-improvement' : 'poor';

      console.log(`[CWV] INP: ${inp}ms (${grade})`);
      if (analyticsTrack) {
        analyticsTrack('core_web_vitals', { metric: 'inp', value: inp, grade });
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportInp();
      }
    });

    window.addEventListener('beforeunload', reportInp);

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      inpObserver.disconnect();
      document.removeEventListener('visibilitychange', reportCls);
      window.removeEventListener('beforeunload', reportCls);
      document.removeEventListener('visibilitychange', reportInp);
      window.removeEventListener('beforeunload', reportInp);
    };
  }, [analyticsTrack]);

  return { lcp: lcpRef.current, cls: clsRef.current, inp: inpRef.current };
}

/**
 * Hook que mide Performance Metrics generales
 */
export function usePerformanceMetrics() {
  const metricsRef = useRef({});

  useEffect(() => {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry;
          metricsRef.current = {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime,
            loadComplete: navEntry.loadEventEnd - navEntry.startTime,
            dnsLookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            tcpConnect: navEntry.connectEnd - navEntry.connectStart,
            ttfb: navEntry.responseStart - navEntry.requestStart,
            domParse: navEntry.domInteractive - navEntry.responseEnd,
          };
        }
      }
    });

    observer.observe({ type: 'navigation', buffered: true });

    return () => observer.disconnect();
  }, []);

  return metricsRef.current;
}

export { CWV_CONFIG };
