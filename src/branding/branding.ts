import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';
import { TOKENS } from './tokens';
import { PWA_MANIFEST } from './manifest';
import * as CONSTANTS from './constants';

export const LOGOS = {
  primary: '/branding/logo/logo-primary.svg',
  secondary: '/branding/logo/logo-light.svg',
  dark: '/branding/logo/logo-dark.svg',
  light: '/branding/logo/logo-light.svg',
  navbar: '/branding/logo/logo-navbar.svg',
  footer: '/branding/logo/logo-footer.svg',
  print: '/branding/logo/logo-print.svg',
  horizontal: '/branding/logo/logo-horizontal.svg',
  vertical: '/branding/logo/logo-horizontal.svg',
  square: '/branding/logo/logo-square.svg',
  minimal: '/branding/logo/logo-square.svg',
  isotype: '/branding/logo/isotype.svg',
  watermark: '/branding/logo/logo-watermark.svg',
};

export const FAVICONS = {
  ico: '/branding/favicon/favicon.ico',
  svg: '/branding/favicon/favicon.svg',
  png16: '/branding/favicon/favicon-16.png',
  png32: '/branding/favicon/favicon-32.png',
  png48: '/branding/favicon/favicon-48.png',
  png96: '/branding/favicon/favicon-96.png',
};

export const SOCIAL_ASSETS = {
  ogImage: '/branding/social/og-image.png',
  twitterCard: '/branding/social/twitter-card.png',
  shareImage: '/branding/social/share-image.png',
  appBanner: '/branding/social/app-banner.png',
};

export const ANIMATIONS = {
  logoIntro: '/branding/animations/logo-intro.json',
  loadingLogo: '/branding/animations/loading-logo.svg',
  successCheck: '/branding/animations/success-check.json',
  confetti: '/branding/animations/confetti.json',
};

export const BRANDING = {
  logos: LOGOS,
  favicons: FAVICONS,
  social: SOCIAL_ASSETS,
  animations: ANIMATIONS,
  colors: COLORS,
  typography: TYPOGRAPHY,
  tokens: TOKENS,
  manifest: PWA_MANIFEST,
  constants: CONSTANTS,
};

export default BRANDING;
