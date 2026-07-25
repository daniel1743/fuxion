import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bienestarMenuItems,
  fuxionMenuItems,
  getNavigationContext,
  isSidebarItemActive,
  NAVIGATION_CONTEXT,
} from '../src/components/mobile/sidebarNavigation.js';

test('clasifica rutas Fuxion directas, hijas y con slash final', () => {
  for (const pathname of [
    '/explorar',
    '/explorar/',
    '/categoria/energia',
    '/producto/biopro-sport',
    '/carrito',
    '/checkout',
    '/opiniones/wellness',
    '/oportunidad-fuxion',
    '/productos-fuxion-chile',
    '/envios',
  ]) {
    assert.equal(getNavigationContext(pathname), NAVIGATION_CONTEXT.FUXION, pathname);
  }
});

test('mantiene las rutas editoriales, evaluativas e institucionales en Bienestar', () => {
  for (const pathname of [
    '/',
    '/articulos',
    '/articulos/eje-intestino',
    '/bienestar/eje-intestino-higado',
    '/condicion/salud-digestiva',
    '/plan-a-medida',
    '/mi-informe',
    '/sobre-nosotros',
    '/ayuda',
  ]) {
    assert.equal(getNavigationContext(pathname), NAVIGATION_CONTEXT.BIENESTAR, pathname);
  }
});

test('los menús contienen solo las opciones acordadas y rutas existentes', () => {
  assert.deepEqual(
    bienestarMenuItems.map(({ label }) => label),
    ['Inicio', 'Evaluación de bienestar', 'Artículos', 'Sobre nosotros', 'Productos', 'Centro de ayuda']
  );
  assert.deepEqual(
    fuxionMenuItems.map(({ label }) => label),
    ['Bienestar en Claro', 'Tienda oficial', 'Mi carrito', 'Objetivos de bienestar', 'Evidencia', 'Oportunidad Fuxion', 'Centro de ayuda']
  );
});

test('el resaltado activo acepta rutas hijas sin confundir prefijos similares', () => {
  const articles = bienestarMenuItems.find(({ id }) => id === 'articulos');
  const products = fuxionMenuItems.find(({ id }) => id === 'tienda-oficial');
  assert.equal(isSidebarItemActive(articles, '/articulos/ejemplo'), true);
  assert.equal(isSidebarItemActive(products, '/explorar'), true);
  assert.equal(isSidebarItemActive(products, '/explorador'), false);
});
