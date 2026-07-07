# Cambio: SuccessAnimation Component

**Fecha:** 2026-06-07 17:30 CLT  
**Archivo:** `src/components/SuccessAnimation.jsx`

---

## Descripción

Componente de checkmark animado para estados de éxito en formularios. Utiliza framer-motion con animación spring para la entrada y pathLength animation para el icono CheckCircle2 de lucide-react.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| size | 'default' \| 'lg' | 'default' | Tamaño del componente |

## Uso

```jsx
import SuccessAnimation from '@/components/SuccessAnimation';

// Tamaño default
<SuccessAnimation />

// Tamaño grande
<SuccessAnimation size="lg" />
```

## Comportamiento

1. Animación de escala (0 → 1) con spring (stiffness: 200, damping: 15)
2. Animación de pathLength en CheckCircle2 (0 → 1, duración 0.5s, delay 0.2s)
3. Fondo circular con gradient emerald

## Aplicaciones

- HelpCenterPage (formulario de ayuda)
- ContactPage (formulario de contacto)
- OpportunityPage (formulario de oportunidad)
