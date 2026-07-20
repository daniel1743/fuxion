/**
 * PerformanceProvider — Wrapper global de rendimiento
 * Aplica todas las optimizaciones de Core Web Vitals
 */

import React, { useEffect } from 'react';
import { useCoreWebVitals } from '@/hooks/useCoreWebVitals';
import { PRELOAD_ASSETS, PREFETCH_ROUTES, PRECONNECT_HOSTS, FONT_STRATEGY } from '@/lib/performance';

const PerformanceProvider = ({ children }) => {
  // Track CWV metrics
  useCoreWebVitals((event, data) => {
    // Send to analytics (replace with your analytics provider)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'core_web_vitals', {
        event_category: 'CWV',
        event_label: data.metric,
        value: data.value,
        grade: data.grade,
      });
    }
  });

  useEffect(() => {
    // Apply font-display: swap
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      link.style.fontDisplay = FONT_STRATEGY.display;
    });

    // Preload critical assets
    PRELOAD_ASSETS.forEach(asset => {
      const el = document.createElement('link');
      el.rel = 'preload';
      el.href = asset.href;
      if (asset.as) el.as = asset.as;
      if (asset.crossorigin) el.crossOrigin = asset.crossorigin;
      if (asset.type) el.type = asset.type;
      document.head.appendChild(el);
    });

    // Preconnect to hosts
    PRECONNECT_HOSTS.forEach(host => {
      const el = document.createElement('link');
      el.rel = 'preconnect';
      el.href = host;
      el.crossOrigin = 'anonymous';
      document.head.appendChild(el);
    });

    // Prefetch routes
    PREFETCH_ROUTES.forEach(route => {
      const el = document.createElement('link');
      el.rel = 'prefetch';
      el.href = route;
      el.as = 'document';
      document.head.appendChild(el);
    });

    // Lazy load non-critical stylesheets
    document.querySelectorAll('link[rel="stylesheet"][data-lazy]').forEach(link => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            link.removeAttribute('data-lazy');
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(document.body);
    });
  }, []);

  return <>{children}</>;
};

export default PerformanceProvider;
