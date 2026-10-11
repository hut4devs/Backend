# Backend Architecture

## 1. Purpose and Status

This document defines the target architecture for the Hut4Devs Backend and the rules for extracting functionality from the canonical application.

**Status:** Target architecture; extraction is incremental and not yet considered complete.

The canonical Hut4Devs application remains the reference implementation until feature parity, security, data integrity, and migration checks have been completed and approved.

## 2. Architectural Layers

### API Layer

**Responsibilities**
- Define HTTP routes and transport contracts.
- Validate incoming requests at the boundary.
- Apply authentication and authorization middleware.
- Map application outcomes to HTTP status codes and response formats.
- Handle transport concerns such as request parsing and response headers.

**Must not**
- Implement domain invariants or payment reconciliation rules.
- Access database implementations directly.
- Treat client-supplied identity, roles, or payment status as authoritative.

### Application Layer

**Responsibilities**
- Coordinate use cases and application workflows.
- Enforce transaction boundaries through repository abstractions.
- Coordinate authentication-dependent operations and domain services.
- Publish application outcomes through defined interfaces.
- Handle workflow-level failure paths and idempotency requirements.

**Must not**
- Depend on HTTP request or response objects.
- Depend directly on PostgreSQL or a specific payment provider.
- Duplicate domain rules across multiple use cases.

### Domain Layer

**Responsibilities**
- Define entities, value objects, domain invariants, and repository interfaces.
- Represent accommodation responsibilities, members, payment intents, payment proposals, provider events, reconciliation, and outbox concepts.
- Define valid state transitions and domain-level rules.

**Must not**
- Depend on HTTP frameworks, database drivers, or provider SDKs.
- Read environment variables or perform infrastructure configuration.
- Treat unverified provider events as confirmed payments.

### Infrastructure Layer

**Responsibilities**
- Implement repository interfaces and PostgreSQL persistence.
- Manage database connections, migrations, and transaction mechanics.
- Integrate identity systems, payment providers, and real-time delivery.
- Load and validate runtime configuration.
- Implement provider signature verification and infrastructure adapters.

**Must not**
- Become the owner of business rules that belong in the domain.
- Bypass application use cases to mutate authoritative business state.

## 3. Dependency Direction

The intended dependency direction is:

API  Application  Domain

Infrastructure implements interfaces defined by the domain or application and is connected through explicit composition at the application boundary.

The domain must remain independent of API and infrastructure implementations.

## 4. Data Authority

PostgreSQL is the intended authoritative store for:
- Member and session records.
- Accommodation responsibilities.
- Payment intents and proposals.
- Payment provider event receipts.
- Reconciliation records.
- Transactional outbox events.

Caches, browser state, real-time messages, and blockchain records must not silently replace PostgreSQL as the source of truth for these records.

Any future change to data authority requires an explicit architectural decision and migration plan.

## 5. Payment and Event Safety

Payment-related extraction must preserve these invariants:

1. Verify webhook signatures against the original raw request body.
2. Persist provider event receipts before reconciliation.
3. Associate provider events with proposals, intents, and accommodation responsibilities through validated identifiers.
4. Prevent duplicate event processing and double counting.
5. Persist business changes and corresponding outbox events in the same database transaction.
6. Publish outbox events only after the transaction commits.
7. Treat provider notifications as evidence to validate, not automatic proof that an accommodation payment is verified.

These are target requirements. Their implementation and test coverage must be verified during extraction rather than assumed from this document.

## 6. Current Implementation and Extraction Boundary

The canonical application currently includes a root `server.ts` that coordinates HTTP routing, request handlers, authentication, payment workflows, reconciliation, PostgreSQL repositories, and outbox publishing.

Related domain and infrastructure modules already exist in the canonical application. The new Backend repository must extract these capabilities deliberately, with tests and documented dependencies.

For every extracted capability:

1. Identify the canonical source files and existing behavior.
2. Document request/response contracts and domain invariants.
3. Establish or migrate automated tests for success and failure paths.
4. Extract the smallest coherent capability into the appropriate layer.
5. Compare behavior and data effects against the canonical implementation.
6. Verify authorization, transaction safety, idempotency, and error handling.
7. Document migration, rollback, and operational implications where relevant.
8. Obtain review before switching production traffic or retiring old code.

**Do not delete, disable, or bypass the canonical implementation before parity and migration are verified and explicitly approved.**

Avoid maintaining two competing authoritative writers for the same business records during migration.

## 7. Operations and Security

The target backend must support:
- Validated configuration and safe startup failure.
- Structured logs with secrets and sensitive data redacted.
- Health and readiness checks with clearly defined semantics.
- Least-privilege credentials and server-side authorization.
- Deterministic database migrations.
- Backup and restore verification.
- Incident response and operational runbooks.
- Tests for authorization failures, persistence failures, and replayed events.

## 8. Open Architectural Decisions

The following decisions remain open until documented and approved:

| ID | Decision | Required evidence |
|---|---|---|
| ADR-001 | HTTP framework and route organization | Current requirements, maintainability, testability |
| ADR-002 | Database migration tooling and ownership | Existing PostgreSQL schema, deployment process, rollback needs |
| ADR-003 | Authentication and production session strategy | Current identity implementation, threat model, authorization requirements |
| ADR-004 | Payment-provider adapter boundaries | Existing provider integrations, signature verification, retry behavior |
| ADR-005 | Outbox delivery and worker lifecycle | Delivery guarantees, retry policy, duplicate handling, operational needs |
| ADR-006 | Extraction cutover and rollback strategy | Feature parity, data ownership, migration and rollback evidence |

Record each decision in a dedicated Architecture Decision Record (ADR) before treating it as settled. Do not infer a final choice solely from the current implementation.

## 9. Change Control

Changes to architectural boundaries, data authority, payment invariants, or the extraction strategy must:
- Explain the motivation and affected layers.
- Identify security and data-integrity implications.
- Include tests or a documented validation plan.
- Update relevant architecture decisions and API contracts.
- Preserve traceability to the issue and pull request.
