# BAIOS Runtime Development Standard v1.0

**Version:** 1.0
**Architecture:** BAIOS v1.0.0 (Core Frozen)
**Date:** 2026-07-20
**Author:** Chief Architect
**Audience:** Runtime Engine Implementors
**Status:** ENFORCED

---

## 1. Purpose

This standard defines the mandatory rules, patterns, and constraints for all runtime engine
implementations within BAIOS (Workflow Runtime, Pipeline Runtime, Event Bus, Scheduler, etc.).

**Violation of any rule in this document constitutes an architectural breach and must be
corrected before code review.**

---

## 2. Hierarchy of Runtimes

```
                    ┌─────────────────────┐
                    │   EVENT BUS         │  (Layer 4 — futuro)
                    │   Async, Publish/   │
                    │   Subscribe         │
                    └─────────┬───────────┘
                              │ triggers
                    ┌─────────▼───────────┐
                    │   SCHEDULER         │  (Layer 3 — futuro)
                    │   Cron, Recurring   │
                    └─────────┬───────────┘
                              │ creates
        ┌─────────────────────┼─────────────────────┐
        │                                           │
┌───────▼──────────┐                    ┌───────────▼──────────┐
│  WORKFLOW        │                    │  WORKFLOW            │
│  RUNTIME         │  (Layer 2)         │  RUNTIME             │
│  Orchestrates    │                    │  Orchestrates        │
│  Pipelines       │                    │  Pipelines           │
└───────┬──────────┘                    └───────────┬──────────┘
        │                                           │
        │ executes                                  │ executes
        ▼                                           ▼
┌───────────────────────────────────────────────────────────────┐
│                   PIPELINE RUNTIME  (Layer 1)                  │
│                   Executes Steps Sequentially                  │
└───────────────────────────────────────────────────────────────┘
```

**Rule:** A higher layer may create and manage lower layers. A lower layer MUST NOT depend on
any higher layer.

---

## 3. Mandatory Principles

### 3.1 Deterministic Execution
Every runtime function MUST produce the same output given the same input. No `Math.random()`,
no `Date.now()` except in explicit timing wrappers, no external state mutation.

### 3.2 Immutable Context
State transitions MUST return new objects. Never mutate `context` in place. Use object spread
(`{ ...prev, field: newValue }`).

### 3.3 Side-Effect Free
No I/O, no HTTP, no file system access, no database queries, no DOM manipulation.
Mock providers ONLY.

### 3.4 Contract-First
All runtime implementations MUST consume frozen Phase 1 types exclusively. No new type
aliases for concepts already defined in the contracts layer.

### 3.5 Fail-Fast
Invalid states, missing registrations, and contract violations MUST throw immediately.
No silent failures, no graceful degradation into undefined behavior.

### 3.6 Single Responsibility
Each runtime file MUST have exactly one reason to change:
- `*.context.ts` — data structures only
- `*.registry.ts` — registration/lookup only
- `*.factory.ts` — instance creation only
- `*.executor.ts` — step execution only
- `*.runtime.ts` — orchestration only
- `*.result.ts` — result types only
- `*.lifecycle.ts` — lifecycle hooks only
- `*.step.ts` — step definition only

### 3.7 Provider Agnostic
No provider-specific code. Use the `AIProvider` union type and `PROVIDER_REGISTRY` from the
frozen contracts. Concrete provider integration belongs in Phase 3+.

---

## 4. File Structure Standard

Every runtime module MUST follow this structure:

```
core/<runtime-name>/
├── <name>.context.ts      # Runtime context extending frozen contracts
├── <name>.registry.ts     # Registration and lookup
├── <name>.factory.ts      # Instance creation from definitions
├── <name>.executor.ts     # Atomic step execution
├── <name>.runtime.ts      # Orchestration engine (entry point)
├── <name>.result.ts       # Execution result types
├── <name>.lifecycle.ts    # Lifecycle hooks (if applicable)
└── <name>.step.ts         # Step definition (if applicable)
```

---

## 5. Type Safety Rules

### 5.1 No `any`
The `any` type is forbidden. Use `unknown` for truly dynamic data, and narrow with type guards.

### 5.2 Literal Unions Over `string`
Use `EditorState`, `JobType`, `EditorEventName` — never `string` for known domain values.

### 5.3 `readonly` for Constants
All registry arrays and config objects MUST use `as const` or `readonly` modifiers.

### 5.4 Strict Null Checks
Every nullable field MUST be typed as `T | null`, never `T | undefined`.
Use `BaseError | null` for error fields. Never `string | null` for errors.

---

## 6. Error Handling Standard

### 6.1 Use `BaseError` Exclusively
All error objects MUST conform to the `BaseError` interface defined in `core/errors/base.error.ts`.

```typescript
const error: BaseError = {
  code: 'ERR_WF_001',
  message: 'Invalid transition',
  category: 'WORKFLOW',
  severity: 'HIGH',
  retryable: false,
  source: 'PipelineRuntime.execute',
  timestamp: new Date().toISOString(),
  context: { pipelineId: 'xyz' },
};
```

### 6.2 Specialized Errors
When additional context is needed, use the specialized interfaces (`WorkflowError`,
`PipelineError`, `ProviderError`, etc.) which extend `BaseError`.

### 6.3 Error Categories
| Category | Code Prefix | Use When |
|----------|-------------|----------|
| VALIDATION | ERR_VAL_XXX | Input/context validation fails |
| WORKFLOW | ERR_WF_XXX | Workflow execution error |
| PIPELINE | ERR_PIPE_XXX | Pipeline execution error |
| PROVIDER | ERR_PROV_XXX | Mock/simulated provider error |
| SCHEDULER | ERR_SCH_XXX | Scheduling error |
| POLICY | ERR_POL_XXX | Policy violation |
| PUBLICATION | ERR_PUB_XXX | Publication error |
| UNKNOWN | ERR_UNK_XXX | Uncategorized error |

---

## 7. Context Immutability Pattern

```typescript
// REQUIRED: return new object
function advanceState(ctx: RuntimeContext, newState: State): RuntimeContext {
  return {
    ...ctx,
    current_state: newState,
    history: [...ctx.history, { state: newState, timestamp: new Date().toISOString() }],
  };
}

// FORBIDDEN: mutation in place
function advanceStateBad(ctx: RuntimeContext, newState: State): void {
  ctx.current_state = newState; // ❌
}
```

---

## 8. Registration Pattern

```typescript
// Registry uses a module-level Map
const registry = new Map<string, RegistryEntry>();

// Register: must throw on duplicate
function register(entry: RegistryEntry): void {
  if (registry.has(entry.id)) {
    throw new Error(`Already registered: ${entry.id}`);
  }
  registry.set(entry.id, entry);
}

// Get: must throw on missing
function get(id: string): RegistryEntry {
  const entry = registry.get(id);
  if (!entry) {
    throw new Error(`Not found: ${id}`);
  }
  return entry;
}

// Test utility
function clearRegistry(): void {
  registry.clear();
}
```

---

## 9. Testing Requirements

### 9.1 Mandatory Test Cases
Every runtime engine MUST have tests for:
1. **Creation** — instance creation from factory
2. **Registration** — duplicate registration throws
3. **Execution** — full sequential execution succeeds
4. **State transitions** — valid transitions advance correctly
5. **Invalid transitions** — invalid states throw
6. **Completion** — terminal state is reached
7. **Cancellation** — cancellation sets FAILED state

### 9.2 Mock Environment
Tests MUST use mock providers and mock data exclusively.
No real network calls, no real AI, no real database.

---

## 10. Commit Standards

### 10.1 Commit Message Format
```
BAIOS-<phase>: <component> - <description>

Example:
BAIOS-PH2-002: pipeline-runtime - implement PipelineRuntime engine
```

### 10.2 File Change Constraints Per Commit
- Each commit MUST NOT modify files outside its declared phase
- Phase 1 files are FROZEN — any modification requires Antigravity approval
- Documentation files (`.md`) may be updated freely

---

## 11. Review Checklist

Before submitting any runtime engine for review, verify:

- [ ] All types imported from frozen contracts (never redefined locally)
- [ ] All state mutations use immutable spread pattern
- [ ] All errors conform to `BaseError` interface
- [ ] No `any` types
- [ ] No `console.log` (use structured error objects)
- [ ] No direct `Date.now()` outside timing wrappers
- [ ] No external dependencies
- [ ] Registry throws on duplicate and missing
- [ ] Factory creates valid initial context
- [ ] Executor advances state deterministically
- [ ] Runtime orchestrator handles all lifecycle states
- [ ] Tests cover all mandatory cases

---

## 12. Evolution Rules

### 12.1 Allowed Changes (No Audit Required)
- Adding new runtime engine files
- Adding new mock providers/workflows/pipelines
- Adding tests
- Updating documentation

### 12.2 Changes Requiring Antigravity Audit
- Modifying any file in `core/` created during Phase 1
- Modifying any type interface or union type
- Adding new event names
- Adding new states
- Adding new error categories
- Modifying the Kernel or Manifest

### 12.3 Forbidden Changes
- Removing or renaming exported types
- Weakening type constraints (e.g., literal union → string)
- Adding runtime dependencies (npm packages)
- Integrating real AI providers before Phase 3

---

**END OF STANDARD**