# Backend Architecture

## Layers
- API: routes, transport validation, auth middleware, HTTP mapping.
- Application: use cases and transaction orchestration.
- Domain: entities, value objects, invariants, repository interfaces.
- Infrastructure: PostgreSQL, identity, payment providers, realtime delivery, configuration.

## Data authority
PostgreSQL is authoritative for member/session records, accommodation responsibilities, payment intents/proposals, provider events, reconciliation, and outbox events.

## Payment safety
Verify webhook signatures against raw body; persist provider events before reconciliation; match provider event → proposal → intent → accommodation responsibility; prevent duplicate verification and double counting; write outbox events in the same transaction and publish after commit.

## Operations
Validate configuration, redact logs, implement health/readiness checks, least-privilege credentials, deterministic migrations, backups, restore tests, and incident runbooks.

## Extraction note
Populate this repository through deliberate, tested extraction from the canonical application. Do not delete or bypass the canonical implementation until parity and migration are verified.
