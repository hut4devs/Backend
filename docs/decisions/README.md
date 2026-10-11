# Architecture Decision Records

This register tracks architectural decisions for the Hut4Devs Backend.

## Status definitions

- **Proposed:** A decision is being investigated.
- **Accepted:** The decision has been reviewed and approved.
- **Superseded:** A later decision replaces it.

## Decision register

| ID | Decision | Status | Evidence required |
|---|---|---|---|
| ADR-001 | HTTP framework and route organization | Proposed | Requirements, maintainability, testability |
| ADR-002 | Database migration tooling and ownership | Proposed | PostgreSQL schema, deployment process, rollback needs |
| ADR-003 | Authentication and production session strategy | Proposed | Existing identity implementation, threat model, authorization requirements |
| ADR-004 | Payment-provider adapter boundaries | Proposed | Existing integrations, signature verification, retry behavior |
| ADR-005 | Outbox delivery and worker lifecycle | Proposed | Delivery guarantees, retry policy, duplicate handling, operational needs |
| ADR-006 | Extraction cutover and rollback strategy | Proposed | Feature parity, data ownership, migration and rollback evidence |

## Recording a decision

Before accepting a decision, create a separate file named
`ADR-NNN-short-title.md` in this directory.

Each record should contain:

1. **Context:** The problem and constraints.
2. **Decision:** The selected approach.
3. **Alternatives considered:** Viable options and trade-offs.
4. **Consequences:** Security, reliability, maintenance, and migration impacts.
5. **Evidence:** Relevant code, tests, documentation, and review.
6. **Status:** Proposed, Accepted, or Superseded.

Do not mark a decision Accepted until the evidence has been reviewed.
