/**
 * BAIOS - Editor IA
 * Output Schema Contracts — Phase 1C
 * All AI providers must return these typed structures.
 */

import type { MediaClassification } from '../../types';

export interface ArticleOutput {
  title: string;
  body: string;
  sections: string[];
  citations: string[];
  word_count: number;
  reading_minutes: number;
  keywords: string[];
}

export interface FAQOutput {
  topic: string;
  questions: FAQItem[];
  total_questions: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  citations: string[];
}

export interface ReportOutput {
  title: string;
  summary: string;
  sections: ReportSection[];
  conclusions: string[];
  total_pages: number;
}

export interface ReportSection {
  heading: string;
  content: string;
  charts: string[];
}

export interface SocialOutput {
  platform: string;
  text: string;
  hashtags: string[];
  character_count: number;
  image_description: string | null;
}

export interface ImageRecommendation {
  description: string;
  classification: MediaClassification;
  search_keywords: string[];
  style: 'clinical' | 'educational' | 'lifestyle';
}

export interface QualityReport {
  job_id: string;
  score: number;
  passed: boolean;
  section_scores: Record<string, number>;
  issues: QualityIssue[];
  recommendations: string[];
}

export interface QualityIssue {
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  message: string;
  suggestion: string;
}