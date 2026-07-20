# BAIOS - Editor IA

**Bienestar en Claro AI Operating System** · Módulo Editorial

**Fase Actual:** Phase 1 — AI Editor Skeleton  
**Versión:** 0.1.0  
**Estado:** Esqueleto estructural — Sin lógica implementada

---

## Propósito

El módulo **Editor IA** es el núcleo editorial de BAIOS. Será responsable de:

- Gestionar fuentes científicas verificadas (`ScientificSource`)
- Crear y revisar contenido editorial asistido por IA (`ContentJob`, `DraftArticle`)
- Administrar activos multimedia con clasificación semántica (`MediaAsset`)
- Operar un sistema de colas de publicación (`queue-system`)
- Publicar contenido a través de múltiples canales (`publisher`)
- Abstraer proveedores de IA para evitar dependencia de un único vendor (`ProviderConfig`)

---

## Responsabilidades

| Responsabilidad | Estado |
|-----------------|--------|
| Tipos e interfaces estrictos | ✅ Completado |
| Skeleton UI (Bento Grid + Sidebar) | ✅ Completado |
| Abstracción de proveedores IA | ⬜ Preparado (solo estructura) |
| Contratos internos | ⬜ Fase 2 (BAIOS-PH1-002) |
| Lógica de negocio | ⬜ No implementada |
| Integración con Supabase | ⬜ No implementada |
| Conexión a APIs LLM | ⬜ No implementada |

---

## Estructura de Carpetas

```
src/modules/editor-ia/
├── README.md                          ← Este archivo
├── types/
│   └── index.ts                       ← Interfaces: ScientificSource, ContentJob, DraftArticle, MediaAsset, ProviderConfig, EditorDashboardState
├── ui/
│   ├── dashboard/
│   │   └── EditorDashboard.tsx        ← Dashboard principal con Bento Grid + Framer Motion
│   └── components/
│       ├── BentoCard.tsx              ← Tarjeta reutilizable para Bento Grid
│       ├── Sidebar.tsx                ← Navegación lateral colapsable
│       └── Header.tsx                 ← Cabecera con título y subtítulo
├── core/                              ← (vacío) Lógica de dominio
│   ├── knowledge-base/
│   ├── editorial-engine/
│   ├── media-manager/
│   ├── queue-system/
│   └── publisher/
├── providers/                         ← (vacío) Abstracción de proveedores IA
├── services/                          ← (vacío) Servicios de aplicación
├── hooks/                             ← (vacío) Hooks React específicos
├── constants/                         ← (vacío) Constantes del módulo
└── mocks/                             ← (vacío) Datos de prueba
```

---

## Dependencias

- **React** (^18.x) — UI framework
- **Framer Motion** (^10.x) — Animaciones spring para el dashboard
- **TypeScript** (strict mode) — Tipado estricto

El proyecto padre (`fuxion`) ya incluye estas dependencias. Este módulo **no instala** dependencias adicionales.

---

## Principios de Arquitectura

| Principio | Aplicación |
|-----------|-----------|
| Single Responsibility | Cada carpeta tiene una responsabilidad única y bien definida |
| Low Coupling | Los componentes se comunican vía props tipadas, sin acoplamiento a implementaciones |
| High Cohesion | Lógica relacionada se agrupa en el mismo módulo |
| Dependency Injection | Preparado para inyectar proveedores (ProviderConfig) |
| Provider Agnostic | Soporte futuro para Claude, OpenAI, Gemini, DeepSeek, Llama |
| Strict Typing | Todas las interfaces exportadas con tipos literales, no `string` genérico |
| Scalable | Estructura de carpetas preparada para crecimiento orgánico |
| Testable | Componentes puros sin efectos secundarios |
| Fail Fast | TypeScript en strict mode detiene builds con errores de tipo |

---

## Próxima Fase

**BAIOS-PH1-002** — Contratos internos del Editor IA

Crear contratos internos (eventos, estados y comunicación entre módulos) sin implementar lógica.

---

## Golden Rules Recordatorio

- No modificar código fuera de `src/modules/editor-ia/`
- No instalar dependencias
- No implementar lógica de negocio
- Ante cualquier duda: DETENER, Reportar, Esperar aprobación