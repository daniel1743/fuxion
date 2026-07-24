# Layout local de artefactos

Directorio predeterminado: `.editorial-pipeline/`, fuera de `public/` e ignorado
por Git.

```text
.editorial-pipeline/
├── artifacts/   # fuente inmutable, canonical y diff JSON
├── snapshots/   # ArticleSnapshot
├── diffs/       # diff Markdown
├── restores/    # restauración automática
├── restores-manual/
├── runs/        # RunManifest
└── events/      # JSONL append-only por run
```

## Nomenclatura

IDs derivados de SHA-256 truncado:

- `source-...`
- `canonical-...`
- `snapshot-...`
- `diff-...`

El nombre nunca depende únicamente de fecha o slug.

## Escritura

Artefactos/snapshots usan archivo temporal y copia exclusiva al destino. Si ya
existe, no se sobrescribe. Los manifests de runs tienen UUID y también usan
creación exclusiva.

## Hashes

- `source_hash`: SHA-256 de todo el registro fuente serializado de forma estable.
- `ArtifactReference.sha256`: hash de bytes del archivo de artefacto.
- La restauración se parsea y vuelve a hashear como registro fuente.

## Retención

Slice 1 no elimina automáticamente. Para datos reales debe definirse retención,
cifrado y borrado aprobado. No copiar artefactos a `public/`, logs o Git.

## Restauración

Solo escribe en `restores/` o directorio temporal explícito. Nunca escribe en
Supabase/WordPress ni reemplaza fixtures. Un archivo existente, snapshot
manipulado o hash diferente bloquea la operación.
