# Sistema de Branding Centralizado

Esta carpeta contiene la configuración de la identidad visual del proyecto.

## Modificar la identidad (White-Label)

Si deseas cambiar el nombre del proyecto, los colores, o la tipografía, simplemente modifica los archivos TypeScript ubicados en este directorio (`src/branding/`).

- `constants.ts`: Nombre del proyecto, descripción, y links sociales.
- `colors.ts`: Paletas de color principales y secundarias.
- `typography.ts`: Familias tipográficas y pesos.
- `tokens.ts`: Radios de borde, sombras, etc.
- `manifest.ts`: Configuración del manifiesto de la PWA.

Para actualizar los logos e imágenes, reemplaza los archivos ubicados en la carpeta pública: `public/branding/`. Los componentes React de este proyecto están diseñados para apuntar automáticamente a estas rutas de branding, por lo que no necesitas modificar el código fuente de los componentes.
