/**
 * BAIOS - Editor IA
 * Knowledge Graph Contracts — Phase 1C
 */

import type { Entity } from './entity.types';
import type { Relation } from './relation.types';

export interface KnowledgeGraph {
  entities: Entity[];
  relations: Relation[];
}

export interface GraphQuery {
  entity_ids: string[];
  relation_types: string[];
  max_depth: number;
}

export interface GraphQueryResult {
  entities: Entity[];
  relations: Relation[];
  total_nodes: number;
  total_edges: number;
}