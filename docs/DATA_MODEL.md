# Data Model

## Authority and status
PostgreSQL is the target authoritative store for persisted accommodation/payment state and reconciliation. This repository defines the extraction boundary; this document does not claim a complete schema or migrations already exist.

## Modeling rules
- Use explicit domain concepts and stable identifiers.
- Enforce uniqueness, referential integrity, and valid state transitions in the database where possible.
- Use transactions for changes that must succeed or fail together.
- Define timestamp and timezone conventions.
- Represent money with explicit currency and units; never use floating-point arithmetic for money.
- Minimize sensitive data and define retention/access expectations.
- Do not log secrets or unnecessary personal/payment data.

## Payments and reconciliation
Preserve provider transaction identifiers and verified evidence needed for reconciliation. Provider status and Hut4Devs payment state are distinct; provider `COMPLETED` alone does not establish Hut4Devs `VERIFIED`. Design retries, duplicate delivery, and concurrent updates to be safe. Audit sensitive financial transitions.

## Schema changes
Include migrations, constraints/indexes, tests, deployment order, backfill needs, compatibility, and rollback limitations in the pull request. Update this document when entities or invariants materially change.
