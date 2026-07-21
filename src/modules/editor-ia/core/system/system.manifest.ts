/**
 * BAIOS - Editor IA
 * System Manifest — Phase 1D (CORE FROZEN)
 * Single-file system description for discovery and integration.
 * Immutable after freeze. No logic.
 */

export const BAIOS_SYSTEM_MANIFEST = {
  system_name: 'BAIOS - Bienestar en Claro AI Operating System',
  version: '0.2.0',
  architecture_version: '0.2.0',
  core_frozen: true,
  frozen_at: '2026-07-20',

  modules: [
    'EditorIA',
    'WorkflowEngine',
    'Scheduler',
    'JobEngine',
    'KnowledgeGraph',
    'PolicyEngine',
    'PublicationEngine',
    'RuntimeAudit',
  ],

  pipelines: [
    'KnowledgePipeline',
    'EditorialPipeline',
    'GenerationPipeline',
    'SEOPipeline',
    'MediaPipeline',
    'QualityPipeline',
    'PublicationPipeline',
  ],

  workflows: [
    'GenerateSeriesWorkflow',
    'GenerateArticleWorkflow',
    'EditorialReviewWorkflow',
    'SchedulePublicationWorkflow',
    'PublishWorkflow',
  ],

  events: [
    'editor:content-job:created',
    'editor:knowledge:retrieved',
    'editor:outline:generated',
    'editor:article:generated',
    'editor:seo:completed',
    'editor:media:selected',
    'editor:quality-review:completed',
    'editor:approval:approved',
    'editor:job:scheduled',
    'editor:article:published',
    'editor:job:failed',
  ],

  jobs: [
    'GENERATE_ARTICLE',
    'GENERATE_SERIES',
    'GENERATE_FAQ',
    'GENERATE_SOCIAL_POST',
    'GENERATE_IMAGE',
    'REVIEW_CONTENT',
    'QUALITY_CHECK',
    'SEO_OPTIMIZATION',
    'MEDIA_SELECTION',
    'SCHEDULE_PUBLICATION',
    'PUBLISH_CONTENT',
    'REINDEX_CONTENT',
    'UPDATE_ARTICLE',
    'CREATE_REPORT',
    'DIGITAL_TWIN_ANALYSIS',
  ],

  providers: ['CLAUDE', 'OPENAI', 'GEMINI', 'DEEPSEEK', 'LLAMA'],

  capabilities: [
    'GenerateContent',
    'GenerateImages',
    'SearchKnowledge',
    'PublishContent',
    'ExecuteWorkflow',
    'ExecutePipeline',
    'AuditExecution',
    'ValidatePolicies',
    'ScheduleJob',
    'ExecuteJob',
    'TrackJob',
    'QueryGraph',
  ],

  services: [
    'KnowledgeService',
    'EditorialService',
    'PublicationService',
    'AssetService',
    'SchedulerService',
    'AuditService',
  ],

  policies: [
    { group: 'EDITORIAL', count: 2 },
    { group: 'SCIENTIFIC', count: 2 },
    { group: 'SEO', count: 2 },
    { group: 'YMYL', count: 2 },
    { group: 'PUBLICATION', count: 1 },
    { group: 'SAFETY', count: 2 },
    { group: 'INTERNAL', count: 2 },
  ],

  output_schemas: [
    'ArticleOutput',
    'FAQOutput',
    'ReportOutput',
    'SocialOutput',
    'ImageRecommendation',
    'QualityReport',
  ],
} as const;