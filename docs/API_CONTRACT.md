# API Contract

## Status
This is the contract baseline for APIs as they are introduced. Do not infer that a route exists merely because a target endpoint is discussed here. Document concrete routes and schemas as implemented.

## HTTP conventions
- Use resource-oriented paths and appropriate HTTP methods/status codes.
- Validate path, query, header, and body inputs at the boundary.
- Return consistent JSON response shapes.
- Never expose stack traces, secrets, database details, or unnecessary personal/payment data.
- Return safe client errors and retain only redacted diagnostic context in logs.

## Document each endpoint
Record method/path, purpose, authentication, authorization, request schema, success response, possible errors, idempotency behavior, and relevant rate limits. Add contract tests for stable external behavior. Keep published API specifications synchronized with implementation when tooling exists.

## Sensitive workflows
Payment, identity, accommodation, lending/support, and member operations require explicit authorization and domain validation. Never trust client role claims or payment status as authoritative. Webhooks must be verified and reconciled through server-controlled workflows.
