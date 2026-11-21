# API Contract

## Status
This is the contract baseline for APIs as they are introduced. Do not infer that a route exists merely because a target endpoint is discussed here. Document concrete routes and schemas as implemented.

## HTTP conventions
- Use resource-oriented paths and appropriate HTTP methods/status codes.
- Validate path, query, header, and body inputs at the boundary.
- Return consistent JSON response shapes.
- Never expose stack traces, secrets, database details, or unnecessary personal/payment data.
- Return safe client errors and retain only redacted diagnostic context in logs.

## Response envelope
Every endpoint returns one of two JSON shapes, typed in `src/api/contracts/`. The `success` flag tells them apart without inspecting the HTTP status.

Success (`ok()` returns 200, `created()` returns 201):

```json
{ "success": true, "data": { "id": "m_1" }, "meta": { "requestId": "req-1" } }
```

`meta` is optional and omitted when empty. It carries request correlation and, for list endpoints, `page: { limit, nextCursor }`.

Error (`toErrorResponse()`):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The request is invalid.",
    "details": [{ "location": "body", "field": "email", "message": "Must be a valid email address." }],
    "requestId": "req-9"
  }
}
```

- `code` is stable and machine-readable; clients branch on it, never on `message`.
- `message` is safe, human-readable text and may be reworded.
- `details` appears only for `VALIDATION_FAILED`. Each issue names its `location` (`path`, `query`, `header` or `body`), the `field`, and a message that never echoes the submitted value.
- `requestId` appears when the caller supplies one, so a response can be matched to redacted server logs.

## Error codes and HTTP status
Each code maps to exactly one status.

| Code | Status | Use when |
| --- | --- | --- |
| `VALIDATION_FAILED` | 400 | A path, query, header or body input fails boundary validation. |
| `UNAUTHENTICATED` | 401 | The caller has not proven who they are, or their credential is invalid or expired. |
| `FORBIDDEN` | 403 | The caller is authenticated but not allowed to perform the action. |
| `NOT_FOUND` | 404 | The resource does not exist, or the caller may not know it exists. |
| `CONFLICT` | 409 | The request conflicts with current state, for example a duplicate or an already-completed transition. |
| `RATE_LIMITED` | 429 | The caller exceeded a rate limit. |
| `INTERNAL_ERROR` | 500 | Anything unexpected. |

Throw `ApiError` (or use the `apiErrors` helpers) for errors a client may see. Anything else thrown is rendered as `INTERNAL_ERROR` with the default message. Its own message, stack and `cause` stay server-side, so internal details, connection strings and database errors never reach a client. Diagnostic context passed as an `ApiError`'s `cause` is likewise never serialized. Contract tests in `tests/contract/api-response.test.ts` pin these shapes.

## Document each endpoint
Record method/path, purpose, authentication, authorization, request schema, success response, possible errors, idempotency behavior, and relevant rate limits. Add contract tests for stable external behavior. Keep published API specifications synchronized with implementation when tooling exists.

## Sensitive workflows
Payment, identity, accommodation, lending/support, and member operations require explicit authorization and domain validation. Never trust client role claims or payment status as authoritative. Webhooks must be verified and reconciled through server-controlled workflows.
