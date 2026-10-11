# Backend Engineering Standard

This describes the target implementation standard; it does not imply every target component already exists.

## Language and structure
- Use strict TypeScript and ECMAScript modules.
- Keep dependency changes intentional and commit `package-lock.json` with them.
- Validate external input at runtime; TypeScript types alone do not validate untrusted input.
- Keep API/transport concerns in the API layer, workflow coordination in application services, business invariants in domain modules, and external adapters in infrastructure.
- Dependencies point inward. Domain rules must not depend on HTTP frameworks or provider SDKs.
- Record material architectural exceptions in `docs/decisions/README.md`.

## Data and transactions
- PostgreSQL is authoritative for persisted accommodation/payment state.
- Use database constraints and transactions for multi-record invariants.
- Use migrations for schema changes and describe rollout/rollback implications.
- Make retries safe through idempotency or persisted deduplication.
- Treat realtime messages and caches as non-authoritative projections.

## API and security
- Follow `docs/API_CONTRACT.md` for request, response, validation, and error behavior.
- Enforce authorization server-side on protected operations.
- Do not leak stack traces, secrets, provider internals, or sensitive data to clients.
- Verify webhooks using raw request bytes and provider-specific verification.
- Persist verified provider evidence before reconciliation.
- Provider `COMPLETED` alone does not mean Hut4Devs `VERIFIED`.
- Redact secrets and sensitive personal/payment data from logs.

## Observability
Use structured, actionable logs and correlation identifiers where available. Health/readiness must reflect actual dependencies; do not report readiness if required durable storage is unavailable.

## Required validation
Add automated tests for changed behavior and important failure modes. Run `npm run check` and `npm audit`. Add integration, contract, or security tests when changing persistence, external contracts, identity, authorization, or payments. State which checks were not run and why.
