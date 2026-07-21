/**
 * BAIOS - Editor IA
 * Service Registry — Phase 1D (CORE FROZEN)
 * Discoverable services. No implementations.
 */

export const SERVICE_REGISTRY = [
  {
    id: 'KnowledgeService',
    description: 'Recupera y verifica fuentes científicas',
    capabilities: ['SearchKnowledge'],
  },
  {
    id: 'EditorialService',
    description: 'Genera contenido editorial asistido por IA',
    capabilities: ['GenerateContent'],
  },
  {
    id: 'PublicationService',
    description: 'Publica contenido en canales configurados',
    capabilities: ['PublishContent'],
  },
  {
    id: 'AssetService',
    description: 'Gestiona activos multimedia y visuales',
    capabilities: ['GenerateImages'],
  },
  {
    id: 'SchedulerService',
    description: 'Programa y planifica trabajos editoriales',
    capabilities: ['ScheduleJob'],
  },
  {
    id: 'AuditService',
    description: 'Registra métricas de ejecución y trazabilidad',
    capabilities: ['AuditExecution'],
  },
] as const;

export type ServiceId = (typeof SERVICE_REGISTRY)[number]['id'];