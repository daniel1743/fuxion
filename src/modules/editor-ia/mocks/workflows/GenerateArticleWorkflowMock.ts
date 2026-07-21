/**
 * BAIOS - Editor IA
 * GenerateArticleWorkflow Mock — Phase 2.001
 * Mock workflow for testing the runtime engine.
 */

import type { WorkflowDefinition } from '../../core/workflow-runtime/workflow.factory';

/** Mock GenerateArticleWorkflow — 7 deterministic steps */
export const GenerateArticleWorkflowMock: WorkflowDefinition = {
  id: 'generate-article',
  name: 'GenerateArticleWorkflow',
  description: 'Generates a health article from knowledge to SEO-ready state',
  steps: [
    { name: 'VALIDATE_CONTEXT', targetState: 'DRAFT' },
    { name: 'LOAD_MOCK_KNOWLEDGE', targetState: 'KNOWLEDGE_READY' },
    { name: 'GENERATE_OUTLINE', targetState: 'OUTLINE_READY' },
    { name: 'GENERATE_DRAFT', targetState: 'CONTENT_READY' },
    { name: 'SEO_STAGE', targetState: 'SEO_READY' },
    { name: 'READY', targetState: 'QUALITY_READY' },
    { name: 'FINISHED', targetState: 'PUBLISHED' },
  ],
};

export const GenerateSeriesWorkflowMock: WorkflowDefinition = {
  id: 'generate-series',
  name: 'GenerateSeriesWorkflow',
  description: 'Generates a series of health articles',
  steps: [
    { name: 'VALIDATE_SERIES', targetState: 'DRAFT' },
    { name: 'GENERATE_TOPICS', targetState: 'KNOWLEDGE_READY' },
    { name: 'GENERATE_ARTICLES', targetState: 'CONTENT_READY' },
    { name: 'REVIEW_ALL', targetState: 'QUALITY_READY' },
    { name: 'APPROVE_SERIES', targetState: 'APPROVED' },
    { name: 'FINISHED', targetState: 'PUBLISHED' },
  ],
};