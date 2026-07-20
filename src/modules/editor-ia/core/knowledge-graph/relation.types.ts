/**
 * BAIOS - Editor IA
 * Knowledge Graph Relation Types — Phase 1C
 */

/** Relationship types between entities */
export type RelationType =
  | 'RELATED_TO'
  | 'CAUSES'
  | 'PREVENTS'
  | 'ASSOCIATED_WITH'
  | 'CONTRAINDICATED_WITH'
  | 'TREATS'
  | 'PART_OF'
  | 'REFERENCES'
  | 'CITES';

/** Directed relationship between two entities */
export interface Relation {
  id: string;
  type: RelationType;
  source_id: string;
  target_id: string;
  weight: number;
  evidence: string | null;
}