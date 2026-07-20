/**
 * BAIOS - Editor IA
 * Editor Contracts — Phase 1B
 * Request/Response interfaces for editorial operations. No implementations.
 */

import type { ContentFormat, ContentJob } from '../../types';

// ─── Editorial Request ───────────────────────────────────────────────

export interface EditorialRequest {
  /** Unique job identifier */
  job_id: string;
  /** Topic or theme for the content */
  topic: string;
  /** Desired output format */
  format: ContentFormat;
  /** Target demographic or audience segment */
  target_audience: string;
  /** Optional: keywords to target */
  keywords?: string[];
  /** Optional: preferred tone */
  tone?: 'clinical' | 'educational' | 'conversational' | 'technical';
}

// ─── Editorial Response ──────────────────────────────────────────────

export interface EditorialResponse {
  /** Associated content job */
  job: ContentJob;
  /** Generated title */
  title: string;
  /** Generated body content */
  body: string;
  /** Number of scientific citations included */
  citation_count: number;
  /** Estimated reading time in minutes */
  reading_minutes: number;
  /** Quality score (0-100) */
  quality_score: number;
}

// ─── Series Request ──────────────────────────────────────────────────

export interface SeriesRequest {
  /** Overarching topic for the series */
  topic: string;
  /** Number of articles to generate */
  count: number;
  /** Formats to distribute across the series */
  formats: ContentFormat[];
  /** Target audience */
  target_audience: string;
  /** Optional: specific subtopics */
  subtopics?: string[];
}

// ─── Series Response ─────────────────────────────────────────────────

export interface SeriesResponse {
  /** Series identifier */
  series_id: string;
  /** Jobs created for this series */
  jobs: ContentJob[];
  /** Total articles generated */
  total_articles: number;
}

// ─── Topic Cluster ───────────────────────────────────────────────────

export interface TopicCluster {
  /** Primary topic */
  primary: string;
  /** Related subtopics */
  related: string[];
  /** Estimated content volume */
  estimated_articles: number;
  /** SEO opportunity score */
  seo_opportunity: number;
}

// ─── Editorial Outline ───────────────────────────────────────────────

export interface EditorialOutline {
  /** Associated job ID */
  job_id: string;
  /** Main title */
  title: string;
  /** Ordered sections */
  sections: EditorialSection[];
  /** Target word count */
  target_word_count: number;
}

export interface EditorialSection {
  /** Section heading */
  heading: string;
  /** Estimated word count */
  word_count: number;
  /** Key points to cover */
  key_points: string[];
  /** Required citations */
  required_citations: number;
}