/**
 * BAIOS - Editor IA
 * Policy Engine Contracts — Phase 1C
 * Centralized editorial and operational rules. No logic.
 */

/** Policy groups for categorization */
export type PolicyGroup =
  | 'EDITORIAL'
  | 'SCIENTIFIC'
  | 'SEO'
  | 'YMYL'
  | 'PUBLICATION'
  | 'SAFETY'
  | 'INTERNAL';

/** Policy severity */
export type PolicySeverity = 'BLOCKER' | 'WARNING' | 'INFO';

/** Base policy contract */
export interface Policy {
  /** Unique policy identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Policy group classification */
  group: PolicyGroup;
  /** Severity level */
  severity: PolicySeverity;
  /** Human-readable description */
  description: string;
  /** Whether this policy is enforced */
  enabled: boolean;
}

/** Policy evaluation result */
export interface PolicyEvaluation {
  policy_id: string;
  passed: boolean;
  severity: PolicySeverity;
  message: string;
  violations: string[];
}

/** Result of evaluating all policies */
export interface PolicyEvaluationResult {
  job_id: string;
  evaluations: PolicyEvaluation[];
  all_passed: boolean;
  blocker_count: number;
  warning_count: number;
}