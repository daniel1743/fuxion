# Cambio: CelebrationOverlay Component

**Fecha:** 2026-06-07 17:30 CLT  
**Archivo:** `src/components/CelebrationOverlay.jsx`

---

## Descripción

Overlay de celebración que combina confeti con un modal animado. Se muestra brevemente después de acciones importantes como envío de formularios.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| show | boolean | - | Controla visibilidad del overlay |
| onComplete | function | - | Callback cuando termina la animación (2s) |
| title | string | '¡Celebración!' | Título del modal |
| message | string | '' | Mensaje del modal |

## Uso

```jsx
import CelebrationOverlay from '@/components/CelebrationOverlay';

const [showCelebration, setShowCelebration] = useState(false);

// En el handler del formulario:
setShowCelebration(true);

// En el JSX:
<CelebrationOverlay
  show={showCelebration}
  onComplete={() => setShowCelebration(false)}
  title="¡Gracias por tu interés!"
  message="Recibimos tus datos. Te contactaremos pronto."
/>
```

## Comportamiento

1. Dispara `fireElegantConfetti()` al mostrarse
2. Muestra overlay con backdrop blur y modal centrado
3. Icono Sparkles con animación spring
4. Auto-dismiss después de 2 segundos
5. pointer-events-none para no bloquear interacción

## Aplicaciones

- OpportunityPage (formulario de oportunidad enviado)
