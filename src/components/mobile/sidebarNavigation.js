import {
  ArrowLeft02Icon,
  BookOpen02Icon,
  HelpCircleIcon,
  Home03Icon,
  Leaf01Icon,
  Rocket01Icon,
  ShoppingBag03Icon,
  ShoppingCart01Icon,
  Store01Icon,
  Target01Icon,
} from '@hugeicons/core-free-icons';

export const NAVIGATION_CONTEXT = Object.freeze({
  BIENESTAR: 'bienestar',
  FUXION: 'fuxion',
});

const fuxionRoutePrefixes = Object.freeze([
  '/explorar',
  '/categorias',
  '/categoria',
  '/producto',
  '/carrito',
  '/checkout',
  '/opiniones',
  '/oportunidad-fuxion',
  '/productos-fuxion-chile',
  '/envios',
]);

function normalizePathname(pathname = '/') {
  const cleanPath = String(pathname).split(/[?#]/, 1)[0] || '/';
  if (cleanPath === '/') return cleanPath;
  return cleanPath.replace(/\/+$/, '');
}

function matchesRoute(pathname, route) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function getNavigationContext(pathname) {
  const normalized = normalizePathname(pathname);
  return fuxionRoutePrefixes.some((prefix) => matchesRoute(normalized, prefix))
    ? NAVIGATION_CONTEXT.FUXION
    : NAVIGATION_CONTEXT.BIENESTAR;
}

export function isSidebarItemActive(item, pathname) {
  const normalized = normalizePathname(pathname);
  return (item.activeRoutes || [item.path]).some((route) => matchesRoute(normalized, route));
}

export const bienestarMenuItems = Object.freeze([
  { id: 'inicio', label: 'Inicio', icon: Home03Icon, path: '/', exact: true },
  {
    id: 'evaluacion-bienestar',
    label: 'Evaluación de bienestar',
    icon: Target01Icon,
    path: '/plan-a-medida',
    activeRoutes: ['/plan-a-medida', '/mi-informe'],
  },
  {
    id: 'articulos',
    label: 'Artículos',
    icon: BookOpen02Icon,
    path: '/articulos',
    activeRoutes: ['/articulos', '/bienestar', '/condicion', '/etiqueta'],
  },
  { id: 'sobre-nosotros', label: 'Sobre nosotros', icon: Leaf01Icon, path: '/sobre-nosotros' },
  {
    id: 'productos',
    label: 'Productos',
    icon: ShoppingBag03Icon,
    path: '/explorar',
    sectionBreak: true,
    contextHint: 'Fuxion',
  },
  { id: 'centro-ayuda', label: 'Centro de ayuda', icon: HelpCircleIcon, path: '/ayuda' },
]);

export const fuxionMenuItems = Object.freeze([
  {
    id: 'volver-bienestar',
    label: 'Bienestar en Claro',
    icon: ArrowLeft02Icon,
    path: '/',
    exact: true,
    isContextExit: true,
  },
  { id: 'tienda-oficial', label: 'Tienda oficial', icon: Store01Icon, path: '/explorar' },
  { id: 'carrito', label: 'Mi carrito', icon: ShoppingCart01Icon, path: '/carrito' },
  {
    id: 'objetivos-bienestar',
    label: 'Objetivos de bienestar',
    icon: Target01Icon,
    path: '/opiniones',
  },
  { id: 'evidencia', label: 'Evidencia', icon: BookOpen02Icon, path: '/blog' },
  {
    id: 'oportunidad-fuxion',
    label: 'Oportunidad Fuxion',
    icon: Rocket01Icon,
    path: '/oportunidad-fuxion',
  },
  { id: 'centro-ayuda', label: 'Centro de ayuda', icon: HelpCircleIcon, path: '/ayuda' },
]);

export function getSidebarMenu(pathname) {
  const context = getNavigationContext(pathname);
  return {
    context,
    items: context === NAVIGATION_CONTEXT.FUXION ? fuxionMenuItems : bienestarMenuItems,
  };
}
