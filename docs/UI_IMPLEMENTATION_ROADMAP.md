# UI/UX & Technical Implementation Roadmap
**Version:** 1.0 (Release Candidate Fixes)

This document outlines the actionable tasks derived from the Final Release Candidate Audit (Phase 1-7). Tasks are categorized by Priority and Severity to guide the engineering and design teams.

## Immediate Priority (Blockers for Production)

### 1. Fix Z-Index Hierarchy Conflict
- **Description:** Mobile elements overlap incorrectly (`MobileBottomNav` uses `z-[60]`, drawers use `z-50`).
- **Action:** Create a strict z-index scale in Tailwind or CSS variables. Ensure Modals/Drawers > Bottom Nav > Sticky Header > Content.
- **Affected:** `MobileBottomNav.jsx`, `Header.jsx`, `Layout.jsx`
- **Status:** Completed (VERIFIED 100/100)

### 2. Mitigate React 18 Memory Leak (React Helmet)
- **Description:** `react-helmet` is obsolete and causes severe memory leaks in React 18 Strict Mode.
- **Action:** Replace `react-helmet` with `react-helmet-async`. Wrap the root in `<HelmetProvider>`.
- **Affected:** `package.json`, `SEO.jsx`, `App.jsx`
- **Status:** Pending

### 3. Clarify WhatsApp Checkout Handoff
- **Description:** Users click "Send" in the Cart and are violently thrown into WhatsApp without warning.
- **Action:** Add a tooltip, micro-copy, or interstitial modal explaining: "Te conectaremos con un asesor vía WhatsApp para coordinar el pago seguro y envío."
- **Affected:** `CartPage.jsx`
- **Status:** Pending

---

## High Priority (Required for Premium Standard)

### 4. Implement Global Keyboard Accessibility (focus-visible)
- **Description:** Custom buttons and navigation links lack focus rings.
- **Action:** Enforce `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500` on all interactive custom elements.
- **Affected:** Global (`Header.jsx`, `Carousel`, custom Buttons)
- **Status:** Pending

### 5. Unify Input Components
- **Description:** Forms look inconsistent because `AuthModal` uses generic `Input` while `PremiumInput` exists in the system.
- **Action:** Replace all generic `Input` fields with `PremiumInput.jsx` to ensure floating labels and typing micro-interactions are universally present.
- **Affected:** `AuthModal.jsx`, Checkout Forms
- **Status:** Pending

### 6. Remove Global Swipe-to-Navigate
- **Description:** `touchstart`/`touchend` in `Layout.jsx` intercepts natural scrolling and causes accidental route changes.
- **Action:** Remove these global event listeners entirely. Rely on the bottom nav for mobile navigation.
- **Affected:** `Layout.jsx`
- **Status:** Pending

### 7. Tokenize Hardcoded Brand Colors
- **Description:** Hex codes like `#0E5C53` are hardcoded in components.
- **Action:** Extract all brand hex codes into `tailwind.config.js` theme extensions.
- **Affected:** `tailwind.config.js`, multiple JSX files.
- **Status:** Pending

### 8. Standardize Iconography
- **Description:** The app mixes `lucide-react` with `@hugeicons/react`.
- **Action:** Replace all remaining `lucide-react` icons with their equivalents from `@hugeicons/react`.
- **Affected:** `package.json`, multiple JSX files.
- **Status:** Pending

### 9. Elevate Trust Signals
- **Description:** Badges like "Compra Asistida" are hidden far down the page.
- **Action:** Move the trust signals block higher on the HomePage. Add a mini-trust badge directly underneath the "Add to Cart" button on Product pages.
- **Affected:** `HomePage.jsx`, `ProductPage.jsx`
- **Status:** Pending

---

## Medium Priority (UX Enhancements & Tech Debt)

### 10. Refactor FalconBot Scroll Lock
- **Description:** The chat widget modifies `document.body` directly on mobile.
- **Action:** Wrap the mobile view of `FalconBot` in a standard Radix UI Dialog or `vaul` drawer.
- **Affected:** `FalconBot.jsx`
- **Status:** Pending

### 11. Optimize Empty Cart State
- **Description:** Empty cart provides no guidance.
- **Action:** Add a "Productos Destacados" mini-carousel directly into the empty cart view.
- **Affected:** `CartPage.jsx`
- **Status:** Pending

### 12. Fix Semantic HTML Landmarks
- **Description:** Core components use generic `<div>` tags.
- **Action:** Change the root wrapper in `MobileAppShell.jsx` to `<header>` and the dropdown navs to `<nav>`.
- **Affected:** `MobileAppShell.jsx`
- **Status:** Pending

### 13. Refactor "Provider Hell"
- **Description:** 8 deeply nested React Context providers in `App.jsx`.
- **Action:** Combine logical providers or introduce Zustand for global state management to prevent future render bottlenecks.
- **Affected:** `App.jsx`, `src/context/`
- **Status:** Pending

---

## Low Priority (Polishing)

### 14. Fix Mobile Tap Targets
- **Description:** Some custom icons lack sufficient padding for comfortable touch interactions.
- **Action:** Increase padding on mobile header icons to guarantee a 44x44px minimum tap target area.
- **Affected:** `MobileAppShell.jsx`
- **Status:** Pending

### 15. Automate PWA Manifest Generation
- **Description:** PWA logic relies on manual static files.
- **Action:** Implement `vite-plugin-pwa` in `vite.config.js` to handle Service Worker generation automatically.
- **Affected:** `vite.config.js`, `package.json`
- **Status:** Pending
