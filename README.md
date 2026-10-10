# Hut4Devs Backend

Dedicated authoritative API and domain-services repository. The existing canonical application implements a TypeScript Node.js HTTP API, PostgreSQL persistence, Firebase browser identity integration, BMONI payment boundaries, reconciliation, and a transactional outbox. This repository defines the target boundary; it does not claim the code has already been extracted or production-certified.

## Responsibilities
- Authentication, server-side authorization, and capability checks.
- Accommodation, member, support, and payment domain operations.
- PostgreSQL schema, migrations, repositories, and transaction boundaries.
- Provider adapters, webhook verification, reconciliation, and audit history.
- API contracts, observability, deployment, and operational safety.

## Target structure
```text
src/
  api/routes/
  api/middleware/
  api/schemas/
  application/services/
  application/use-cases/
  domain/accommodation/
  domain/members/
  domain/payments/
  domain/support/
  domain/trust-trails/
  domain/repositories/
  infrastructure/database/migrations/
  infrastructure/database/repositories/
  infrastructure/identity/
  infrastructure/payments/
  infrastructure/realtime/
  infrastructure/config/
  workers/
tests/
  unit/
  integration/
  contract/
  security/
docs/
  ARCHITECTURE.md
  API_CONTRACT.md
  DATA_MODEL.md
  SECURITY.md
```

## Non-negotiable invariants
- PostgreSQL is authoritative for persisted accommodation/payment state and reconciliation.
- Provider `COMPLETED` alone is not a Hut4Devs `VERIFIED` payment.
- Verify webhooks against raw request bytes and persist provider evidence before reconciliation.
- Financial operations must be idempotent and concurrency-safe.
- Realtime events are notifications, not authoritative state.
- Keep credentials server-side and sensitive personal data off-chain.

Extraction must be deliberate and tested. Do not remove or bypass the canonical implementation until parity is verified.
