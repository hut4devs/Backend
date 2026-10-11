# Backend Contributor Guide

## Start here
Read [Architecture](ARCHITECTURE.md), [Backend Engineering Standard](BACKEND_ENGINEERING_STANDARD.md), and the relevant domain references: [API Contract](API_CONTRACT.md), [Data Model](DATA_MODEL.md), [Security](SECURITY.md), [Environment Configuration](ENVIRONMENT_CONFIGURATION.md), and [Testing and Validation](TESTING_AND_VALIDATION.md). Confirm the issue's acceptance criteria before implementation.

## Change workflow
1. Create a focused branch from the latest `main`.
2. Preserve the issue's acceptance criteria and keep scope narrow.
3. Test success paths, failure paths, and relevant authorization/persistence boundaries.
4. Update documentation when contracts, configuration, data models, security, operations, or architecture change.
5. Run `npm run check` and `npm audit`.
6. Open a pull request linking the issue, design impact, security considerations, migration impact, tests run, and known limitations.

## Safety rules
- Never commit secrets, real personal/payment data, production dumps, or local environment files.
- Never log credentials, tokens, full connection strings, or sensitive payloads.
- PostgreSQL is authoritative for persisted accommodation/payment state and reconciliation.
- Provider `COMPLETED` alone is not a Hut4Devs `VERIFIED` payment.
- Verify webhooks against raw request bytes and persist provider evidence before reconciliation.
- Make financial operations idempotent and concurrency-safe.
- Realtime events are notifications, not authoritative state.
- Do not claim extraction or production readiness unless code and verification support it.

Record durable architectural choices in `docs/decisions/README.md`. Clarify ambiguous requirements rather than inventing product rules.
