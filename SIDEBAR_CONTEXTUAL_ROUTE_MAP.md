# Sidebar móvil contextual — mapa de rutas

Fecha: 2026-07-24

## Menú Bienestar en Claro

| Opción | Destino real | Rutas activas relacionadas |
|---|---|---|
| Inicio | `/` | `/` |
| Evaluación de bienestar | `/plan-a-medida` | `/plan-a-medida`, `/mi-informe` |
| Artículos | `/articulos` | `/articulos/*`, `/bienestar/*`, `/condicion/*`, `/etiqueta/*` |
| Sobre nosotros | `/sobre-nosotros` | `/sobre-nosotros` |
| Productos | `/explorar` | cambia al contexto Fuxion |
| Centro de ayuda | `/ayuda` | `/ayuda` |

## Menú Fuxion

| Opción | Destino real | Observación |
|---|---|---|
| Bienestar en Claro | `/` | salida explícita al inicio principal |
| Tienda oficial | `/explorar` | catálogo interno existente |
| Mi carrito | `/carrito` | flujo existente |
| Objetivos de bienestar | `/opiniones` | ruta existente |
| Evidencia | `/blog` | conserva el enlace previo |
| Oportunidad Fuxion | `/oportunidad-fuxion` | ruta existente |
| Centro de ayuda | `/ayuda` | ayuda compartida |

## Detección del contexto Fuxion

Se reconocen por coincidencia exacta o por segmento hijo:

`/explorar`, `/categorias`, `/categoria/*`, `/producto/*`, `/carrito`,
`/checkout`, `/opiniones/*`, `/oportunidad-fuxion`,
`/productos-fuxion-chile` y `/envios`.

El resto de rutas pertenece al contexto general de Bienestar en Claro.

## Ambigüedades conservadas

- `/blog` redirige actualmente a `/articulos`; no existe una página independiente
  de Evidencia enlazada por el router. Se conserva el destino previo y no se
  inventa una ruta.
- `/ayuda` es compartida. Al refrescar esa URL se muestra el contexto general
  porque la ruta no codifica el ecosistema de origen.
- La etiqueta móvil “Tienda oficial” usa el catálogo interno `/explorar`, de
  acuerdo con la especificación contextual. El enlace externo oficial continúa
  disponible en la navegación de escritorio.

## Integridad

La refactorización solo modifica configuración y presentación del sidebar.
No cambia páginas, formularios, autenticación, carrito, catálogo, evaluación,
PDF, APIs, servicios, hooks de negocio ni almacenamiento.
