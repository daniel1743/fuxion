# Cambio: CartPage Empty State Mejorado

**Fecha:** 2026-06-07 17:30 CLT  
**Archivo:** `src/pages/CartPage.jsx`

---

## Descripción

Mejora del estado vacío del carrito de compras para hacerlo más atractivo emocionalmente.

## Cambios

### Antes
- Mensaje genérico "Tu carrito está vacío"
- Icono simple sin animación
- Sin gradiente ni estilo premium

### Después
- **Mensaje:** "Tu carrito está esperando tus productos favoritos 🌱"
- **Icono:** ShoppingBag (lucide-react) con gradient background emerald
- **Animación:** Spring animation en icono (scale: 0 → 1)
- **Texto:** Animaciones motion con delays escalonados (0.2s, 0.3s, 0.4s)
- **CTA:** Botón "Explorar productos" con enlace a /productos

## Código relevante

```jsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
  className="mb-6 flex justify-center"
>
  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 
    dark:from-emerald-950/30 dark:to-emerald-900/20 flex items-center justify-center 
    border border-emerald-200 dark:border-emerald-800/40">
    <ShoppingBag className="h-16 w-16 text-emerald-400 dark:text-emerald-500" />
  </div>
</motion.div>
<motion.h1 ...>
  Tu carrito está esperando tus productos favoritos 🌱
</motion.h1>
```

## Principios

- Premium pero no infantil
- Animaciones sutiles (<300ms)
- Consistente con el estilo general de la app
- CTA claro para guiar al usuario
