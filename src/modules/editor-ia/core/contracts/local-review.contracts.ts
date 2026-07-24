/**
 * Slice 1 local contracts. Pure types only; no providers or persistence.
 */

export type SourceTable = 'wellness_articles' | 'blog_posts' | 'local_export';
export type BodyFormat = 'markdown' | 'html' | 'plain_text' | 'unknown';
export type IssueSeverity = 'BLOCKER' | 'WARNING' | 'INFO';

export interface NormalizationIssue {
  code: string;
  severity: IssueSeverity;
  field: string;
  message: string;
  original_fragment: unknown;
  recoverable: boolean;
}

export interface CanonicalArticle {
  identity: {
    article_id: string;
    source_table: SourceTable;
    source_record_id: string;
    slug: string;
    url: string | null;
    status: string;
  };
  editorial: {
    title: string;
    subtitle: string | null;
    excerpt: string | null;
    body: string;
    body_format: BodyFormat;
    author: unknown;
    reviewer: unknown;
    category: string | null;
    tags: string[];
    language: string;
  };
  dates: {
    published_at: string | null;
    updated_at: string | null;
    reviewed_at: string | null;
  };
  structured_content: {
    visible_faq: unknown[];
    schema_faq: unknown[];
    references: unknown[];
    products: unknown[];
    json_ld: unknown[];
    table_of_contents: unknown[];
    health_notice: string[];
  };
  seo: {
    seo_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
    keywords: string[];
  };
  source: {
    raw_record: Record<string, unknown>;
    unparsed_fragments: Record<string, unknown>;
    normalization_issues: NormalizationIssue[];
    schema_version: '1.0.0';
  };
}

export interface ArtifactReference {
  artifact_id: string;
  article_id: string;
  artifact_type: string;
  path: string;
  sha256: string;
  created_at: string;
}

export interface ArticleSnapshot {
  snapshot_id: string;
  article_id: string;
  source_table: SourceTable;
  source_record_id: string;
  source_hash: string;
  snapshot_hash: string;
  source_schema_version: string;
  pipeline_version: string;
  created_at: string;
  original_record: Record<string, unknown>;
  canonical_article: CanonicalArticle;
  artifact_paths: ArtifactReference[];
}

export interface RunManifest {
  run_id: string;
  pipeline_version: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  dry_run: true;
  network_enabled: false;
  source_type: 'fixture' | 'local_json_export';
  input_paths: string[];
  article_ids: string[];
  snapshots: ArtifactReference[];
  artifacts: ArtifactReference[];
  errors: Array<Record<string, unknown>>;
  warnings: string[];
  environment_summary: {
    runtime: string;
    network: false;
    external_services: false;
  };
}

export interface ArticleSource {
  readByIds(ids: string[]): Promise<Record<string, unknown>[]>;
  readBySlugs(slugs: string[]): Promise<Record<string, unknown>[]>;
  readFromFile(path: string): Promise<Record<string, unknown>[]>;
  listAvailable(): Promise<string[]>;
}

export interface ArtifactRepository {
  writeAtomic(artifact: unknown): Promise<ArtifactReference>;
  read(artifactId: string): Promise<unknown>;
  exists(artifactId: string): Promise<boolean>;
  verifyHash(artifactId: string): Promise<boolean>;
}

export interface SnapshotRepository {
  create(snapshot: ArticleSnapshot): Promise<ArticleSnapshot>;
  get(snapshotId: string): Promise<ArticleSnapshot>;
  findByArticleAndHash(articleId: string, sourceHash: string): Promise<ArticleSnapshot | null>;
  verify(snapshotId: string): Promise<boolean>;
}

export interface AuditEventRepository {
  append(event: Record<string, unknown>): Promise<void>;
  listByRun(runId: string): Promise<Record<string, unknown>[]>;
  listByArticle(articleId: string): Promise<Record<string, unknown>[]>;
}
