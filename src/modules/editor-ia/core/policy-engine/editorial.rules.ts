/**
 * BAIOS - Editor IA
 * Editorial Rules — Phase 1C
 * Immutable policy definitions. No evaluation logic.
 */

import type { Policy, PolicyGroup, PolicySeverity } from './policy.contracts';

/** Complete registry of editorial policies */
export const EDITORIAL_POLICIES: readonly Policy[] = [
  {
    id: 'EDITORIAL-001',
    name: 'Minimum Word Count',
    group: 'EDITORIAL' as PolicyGroup,
    severity: 'BLOCKER' as PolicySeverity,
    description:
      'Every article must meet the minimum word count configured in quality settings.',
    enabled: true,
  },
  {
    id: 'EDITORIAL-002',
    name: 'Required Sections',
    group: 'EDITORIAL' as PolicyGroup,
    severity: 'BLOCKER' as PolicySeverity,
    description:
      'Articles must contain introduction, body, conclusion, and references.',
    enabled: true,
  },
  {
    id: 'SCIENTIFIC-001',
    name: 'Mandatory Citations',
    group: 'SCIENTIFIC' as PolicyGroup,
    severity: 'BLOCKER' as PolicySeverity,
    description:
      'Every article must cite at least the configured minimum of scientific sources.',
    enabled: true,
  },
  {
    id: 'SCIENTIFIC-002',
    name: 'Evidence Level Requirement',
    group: 'SCIENTIFIC' as PolicyGroup,
    severity: 'WARNING' as PolicySeverity,
    description:
      'Citations should include at least one META_ANALYSIS or CLINICAL_GUIDELINE.',
    enabled: true,
  },
  {
    id: 'SEO-001',
    name: 'Keyword Density',
    group: 'SEO' as PolicyGroup,
    severity: 'WARNING' as PolicySeverity,
    description:
      'Keyword density must be within configured min/max range.',
    enabled: true,
  },
  {
    id: 'SEO-002',
    name: 'Meta Description Length',
    group: 'SEO' as PolicyGroup,
    severity: 'WARNING' as PolicySeverity,
    description:
      'Meta description must meet minimum character length.',
    enabled: true,
  },
  {
    id: 'YMYL-001',
    name: 'Medical Claim Verification',
    group: 'YMYL' as PolicyGroup,
    severity: 'BLOCKER' as PolicySeverity,
    description:
      'All medical claims must be backed by cited scientific evidence.',
    enabled: true,
  },
  {
    id: 'YMYL-002',
    name: 'Safety Disclaimer',
    group: 'YMYL' as PolicyGroup,
    severity: 'BLOCKER' as PolicySeverity,
    description:
      'Medical content must include appropriate safety disclaimers.',
    enabled: true,
  },
  {
    id: 'PUB-001',
    name: 'Publication Window',
    group: 'PUBLICATION' as PolicyGroup,
    severity: 'BLOCKER' as PolicySeverity,
    description:
      'Content must be published within the configured publication window.',
    enabled: true,
  },
  {
    id: 'SAFETY-001',
    name: 'Content Moderation',
    group: 'SAFETY' as PolicyGroup,
    severity: 'BLOCKER' as PolicySeverity,
    description:
      'All content must pass automated safety moderation.',
    enabled: true,
  },
  {
    id: 'SAFETY-002',
    name: 'Sensitive Topics Flag',
    group: 'SAFETY' as PolicyGroup,
    severity: 'WARNING' as PolicySeverity,
    description:
      'Content covering sensitive health topics must be flagged for manual review.',
    enabled: true,
  },
  {
    id: 'INTERNAL-001',
    name: 'Provider Availability',
    group: 'INTERNAL' as PolicyGroup,
    severity: 'INFO' as PolicySeverity,
    description:
      'Log provider used and fallback chain for each generation.',
    enabled: true,
  },
  {
    id: 'INTERNAL-002',
    name: 'Cost Tracking',
    group: 'INTERNAL' as PolicyGroup,
    severity: 'INFO' as PolicySeverity,
    description:
      'Track estimated cost per job for budget monitoring.',
    enabled: true,
  },
] as const;