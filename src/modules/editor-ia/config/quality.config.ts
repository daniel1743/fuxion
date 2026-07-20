/**
 * BAIOS - Editor IA
 * Quality Configuration — Phase 1B
 */

export const QUALITY_CONFIG = {
  /** Minimum quality score to pass automated review (0-100) */
  minimum_quality_score: 80,

  /** Required sections for every article */
  required_sections: [
    'introduction',
    'body',
    'conclusion',
    'references',
  ],

  /** Minimum number of scientific citations per article */
  mandatory_citations: 2,

  /** Maximum allowed grammar issues per 1000 words */
  max_grammar_issues_per_1k: 1,

  /** Required metadata fields */
  required_metadata: [
    'title',
    'description',
    'keywords',
    'author',
    'published_date',
  ],

  /** SEO requirements */
  seo: {
    min_keyword_density: 0.5,
    max_keyword_density: 2.5,
    required_meta_description_length: 120,
    required_title_length: 50,
  },
} as const;