/**
 * BAIOS - Editor IA
 * Pipeline Mocks — Phase 2.002
 */

import type { PipelineDefinition } from '../../core/pipeline-runtime/pipeline.factory';

export const KnowledgePipelineMock: PipelineDefinition = {
  id: 'knowledge',
  name: 'KnowledgePipeline',
  description: 'Fetches and validates scientific sources',
  stages: [
    { stepId: 'k-1', name: 'fetch_sources', order: 0 },
    { stepId: 'k-2', name: 'validate_evidence', order: 1 },
    { stepId: 'k-3', name: 'categorize_knowledge', order: 2 },
  ],
};

export const EditorialPipelineMock: PipelineDefinition = {
  id: 'editorial',
  name: 'EditorialPipeline',
  description: 'Builds editorial outline from knowledge',
  stages: [
    { stepId: 'e-1', name: 'analyze_topic', order: 0 },
    { stepId: 'e-2', name: 'build_outline', order: 1 },
    { stepId: 'e-3', name: 'estimate_reading_time', order: 2 },
  ],
};

export const GenerationPipelineMock: PipelineDefinition = {
  id: 'generation',
  name: 'GenerationPipeline',
  description: 'Generates article content via AI',
  stages: [
    { stepId: 'g-1', name: 'generate_sections', order: 0 },
    { stepId: 'g-2', name: 'insert_citations', order: 1 },
    { stepId: 'g-3', name: 'polish_draft', order: 2 },
  ],
};

export const SEOPipelineMock: PipelineDefinition = {
  id: 'seo',
  name: 'SEOPipeline',
  description: 'Optimizes content for search engines',
  stages: [
    { stepId: 's-1', name: 'extract_keywords', order: 0 },
    { stepId: 's-2', name: 'optimize_metadata', order: 1 },
    { stepId: 's-3', name: 'score_content', order: 2 },
  ],
};