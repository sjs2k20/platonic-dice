# Architectural Rules & Engineering Principles

## Core Architectural Guardrails

1. **SOLID Principles:**
   - Single Responsibility (SRP): Decouple UI, state management, and network layers.
   - Open/Closed (OCP): Modules must be open for extension (e.g., dynamic asset catalogs) but closed for modification.
   - Dependency Inversion (DIP): Depend on abstract interfaces, not concrete implementations.
2. **Domain-Driven Design (DDD):**
   - Use Ubiquitous Language matching boardgame and TTRPG domain concepts (e.g., `roll`, `Advantage`, `Disadvantage`, `crit`).
   - Keep dynamic state mutations strictly inside defined aggregates/reducers.
3. **Clean Architecture & Separation of Concerns:**
   - UI / React Components: Pure presentation and event handlers only.
   - Network / PartyKit: State relay and connection handshakes.
   - Core Logic: Pure, deterministic functions (e.g., combat calculations, dice rolls).
4. **YAGNI & DRY (You Aren't Gonna Need It / Don't Repeat Yourself):**
   - Implement the minimal viable abstraction needed for the current phase.
5. **Predictable DSL Evolution:**
   - Favor explicit, grammar-stable syntax for new capabilities so the language remains readable and extensible over time.
   - Use a single reserved keyword such as `GET` as the canonical flag for introducing test-condition logic, rather than relying on ambiguous shorthand that makes later parser evolution harder.
   - Keep user-friendly shortcuts optional where they add value, but do not let them become the core contract of the DSL.

## Agent Execution Protocol

Before generating code, you MUST:

1. Identify affected architectural layers (Domain, UI, State, Network).
2. Validate against SOLID and DDD principles.
3. Write clean, self-documenting code with unit test hooks.

# **Platonic Dice - Agent Build Phases**

## Phase 1: Core DSL Runtime Overhaul (Expression-First Engine)

- **Objective:** Replace the current API-first orchestration model with a parser -> binder -> executor architecture centered on one primary roll(expression) entry point for @platonic-dice/core.
- **Scope Restriction:** index.js, roll.js, src, **tests**, README.md, examples
- **Features Included:** Freeze DSL v1 grammar and output contract; implement parser with diagnostics; implement binder for semantic validation; implement executor with strict each -> sum -> net ordering; support aggregate test clauses including total-threshold checks; preserve implicit natural crit defaults by test semantics; return a rich structured object from roll(expression).
  - **Verification Criteria:** Deterministic tests confirm correct behavior for 2D6+5, 3D6x2, 4D6+1toEach+10, 1D20 ADV GET >= 15, and 5D6 GET atLeast 1x 5+ AND total >= 15; invalid expressions return actionable diagnostics; end-to-end tests confirm stable output schema and aggregate clause results.

## Phase 2: Type Surface Refactor (types-core Alignment)

- **Objective:** Redesign declarations so roll(expression) and its rich result model are the authoritative type surface.
- **Scope Restriction:** types-core, core.d.ts, index.d.ts, test-d
- **Features Included:** Add types for expression input, AST nodes, parser diagnostics, aggregate rule results, and final output contract; deprecate or remove legacy type surfaces according to major-release policy.
  - **Verification Criteria:** Declaration tests validate representative expression contracts and return typing; declaration export paths remain coherent with runtime exports in index.js.

## Phase 3: Packaging, Migration, and Downstream Stabilization

- **Objective:** Finalize the major-release package surface and ensure downstream workspace packages adopt the new expression-first core safely.
- **Scope Restriction:** package.json, README.md, docs, dice, ui
- **Features Included:** Final export surface reduction; script and packaging alignment; migration mapping from imperative calls to DSL expressions; compatibility notes for consumers.
  - **Verification Criteria:** Smoke checks pass in dependent packages; migration docs cover common legacy-to-DSL translations; release candidate has no unresolved runtime/type export path mismatches.

## Phase 4: Post-Release Hardening and Controlled DSL Evolution

- **Objective:** Harden parser/evaluator behavior in real-world usage while preserving strict architecture boundaries and avoiding uncontrolled syntax creep.
- **Scope Restriction:** src, **tests**, README.md
- **Features Included:** Feedback-driven diagnostic improvements; regression tests for field-reported edge cases; explicit proposal-driven process for future DSL syntax additions.
  - **Verification Criteria:** Every production-discovered parser/evaluator issue is captured by regression tests; documentation stays synchronized with implemented grammar and behavior.
