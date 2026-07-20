/**
 * BAIOS - Editor IA
 * Knowledge Graph Entity Types — Phase 1C
 */

/** All entity types supported in the knowledge graph */
export type EntityType =
  | 'Disease'
  | 'Symptom'
  | 'Organ'
  | 'Ingredient'
  | 'Nutrient'
  | 'Lifestyle'
  | 'MedicalTest'
  | 'Treatment'
  | 'Medication'
  | 'ScientificStudy'
  | 'ClinicalGuideline'
  | 'FAQ'
  | 'Tag'
  | 'Category';

/** Base entity contract */
export interface Entity {
  /** Unique entity identifier */
  id: string;
  /** Entity classification */
  type: EntityType;
  /** Human-readable label */
  label: string;
  /** Alternative names / synonyms */
  aliases: string[];
  /** Optional description */
  description: string | null;
  /** Arbitrary properties */
  properties: Record<string, string>;
}