# Plan de limpieza del historial Git

Estado: preparado, **no ejecutado**. Requiere autorización destructiva separada.

## Alcance confirmado

- Commit `715a77abdc94fd646f04f1822fd64c710afbbf81`: `robot_seo.cjs`.
- Commit `794b83aec7ee3c2e01e1a2ae7e162b9a3032bed2`:
  `PENDIENTES_SQL.md`, `scripts/convert-biblia-to-articles.mjs` y
  `scripts/polish-articles.mjs`.

La limpieza no sustituye la rotación. Clones, forks, caches de CI, artefactos y
despliegues pueden conservar objetos antiguos.

## Herramienta propuesta

`git filter-repo`, en un clon espejo aislado y después de rotar las credenciales.
Los valores a reemplazar deben cargarse desde un archivo temporal protegido,
nunca escribirse en terminal, ticket o documento.

Ejemplo conceptual, no ejecutar:

```powershell
git clone --mirror <REPOSITORY_URL> repo-cleanup.git
Set-Location repo-cleanup.git
git filter-repo --replace-text <PROTECTED_REPLACEMENTS_FILE>
git fsck --full
```

Después de revisión humana:

```powershell
git push --force --mirror
```

El último comando es destructivo y permanece prohibido sin autorización.

## Procedimiento

1. Rotar credenciales.
2. Congelar merges y avisar a colaboradores.
3. Respaldar el mirror y referencias remotas.
4. Preparar reemplazos en almacenamiento seguro.
5. Ejecutar en clon aislado.
6. Escanear todos los commits/refs resultantes.
7. Comparar ramas/tags y revisar diff de árboles.
8. Aprobar por dos responsables.
9. Force-push coordinado.
10. Invalidar caches/artefactos y pedir reclonado, no `pull`.
11. Verificar forks y solicitar eliminación/limpieza cuando proceda.

## Impacto

Cambiarán hashes de commits posteriores, PRs y enlaces; colaboradores deberán
reclonar; firmas pueden invalidarse; forks no se actualizan automáticamente.

## Autorización requerida

Propietario del repositorio, responsable de seguridad y coordinación con todos
los colaboradores. Fase 0 no otorgó esa autorización.
