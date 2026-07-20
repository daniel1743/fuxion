/**
 * BAIOS - Editor IA
 * Provider Registry — Phase 1B
 * Decoupled provider registration. No integrations, no logic.
 */

import type { AIProvider, ProviderConfig } from '../types';

/** Registered providers with their capabilities */
export interface ProviderEntry {
  name: AIProvider;
  display_name: string;
  capabilities: string[];
  default_model: string;
  config: ProviderConfig;
}

/** Provider registry — extendable but no implementations */
export const PROVIDER_REGISTRY: Readonly<Record<AIProvider, ProviderEntry>> = {
  CLAUDE: {
    name: 'CLAUDE',
    display_name: 'Anthropic Claude',
    capabilities: ['text-generation', 'reasoning', 'analysis', 'citation'],
    default_model: 'claude-3-5-sonnet-20241022',
    config: {
      provider: 'CLAUDE',
    },
  },
  OPENAI: {
    name: 'OPENAI',
    display_name: 'OpenAI GPT',
    capabilities: ['text-generation', 'analysis', 'embedding'],
    default_model: 'gpt-4o',
    config: {
      provider: 'OPENAI',
    },
  },
  GEMINI: {
    name: 'GEMINI',
    display_name: 'Google Gemini',
    capabilities: ['text-generation', 'multimodal', 'analysis'],
    default_model: 'gemini-1.5-pro',
    config: {
      provider: 'GEMINI',
    },
  },
  DEEPSEEK: {
    name: 'DEEPSEEK',
    display_name: 'DeepSeek',
    capabilities: ['text-generation', 'reasoning', 'code-generation'],
    default_model: 'deepseek-chat',
    config: {
      provider: 'DEEPSEEK',
    },
  },
  LLAMA: {
    name: 'LLAMA',
    display_name: 'Meta Llama',
    capabilities: ['text-generation', 'research', 'opensource'],
    default_model: 'llama-3-70b',
    config: {
      provider: 'LLAMA',
    },
  },
} as const;

/** Active provider — to be configured via environment */
export type ActiveProvider = keyof typeof PROVIDER_REGISTRY;