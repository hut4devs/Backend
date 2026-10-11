# Security Standard

## Core requirements
- Enforce authentication and server-side authorization on every protected action.
- Apply least privilege to service accounts, database roles, and provider credentials.
- Validate untrusted inputs and avoid unsafe dynamic queries.
- Keep secrets out of source control, client bundles, logs, errors, issues, and pull-request evidence.
- Never commit real personal/payment data or production dumps.
- Use secure transport and approved secret-management facilities in deployed environments.

## Identity and authorization
Authentication establishes identity; authorization determines allowed actions. Never trust client-supplied roles/capabilities without server-side verification. Test unauthenticated, unauthorized, and cross-user access paths.

## Payments and webhooks
Verify provider signatures against raw request bytes. Reject invalid signatures and handle replay/duplicate events safely. Persist verified provider evidence before reconciliation. Make payment and reconciliation workflows idempotent and concurrency-safe. Provider `COMPLETED` is not equivalent to Hut4Devs `VERIFIED`.

## Errors, logs, reporting
Return safe errors to clients. Redact tokens, passwords, connection strings, personal data, and payment secrets from logs. Report suspected vulnerabilities privately to maintainers. Changes to identity, authorization, payments, webhooks, data access, or secrets require explicit security-focused tests and review.
