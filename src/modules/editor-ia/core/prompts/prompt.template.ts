/**
 * BAIOS - Editor IA
 * Prompt Template Contracts — Phase 1C
 */

import type { AIProvider, ContentFormat } from '../../types';

export interface PromptTemplate {
  template_id: string;
  name: string;
  description: string;
  variables: PromptVariable[];
  provider: AIProvider;
  output_format: ContentFormat;
  version: string;
  template_text: string;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  default_value: string | null;
  description: string;
}