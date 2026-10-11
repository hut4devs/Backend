# Environment Configuration

## Supported variables
| Variable | Required | Meaning |
|---|---|---|
| `NODE_ENV` | No; defaults to `development` | `development`, `test`, or `production`. |
| `DATABASE_MODE` | No | `memory` or `postgres`. Defaults to `memory` outside production and `postgres` in production. |
| `DATABASE_URL` | Production required | PostgreSQL connection string; treat as a secret. |

## Production requirements
- `DATABASE_URL` must be present and non-empty.
- `DATABASE_MODE` must be `postgres`; in-memory storage is not durable.
- Invalid values must produce actionable messages without printing supplied secret values.
- Never log the environment wholesale, credentials, or full connection strings.

## Local development and tests
The current validator defaults to `development` with `memory` mode when values are absent. This is a development/test fallback, not durable persistence and not production-ready storage. Tests should pass explicit environment objects rather than depend on a developer shell.

## Adding a variable
1. Add it to the central configuration type and loader.
2. Validate allowed values and environment-specific requirements.
3. Ensure errors do not reveal secret values.
4. Test defaults, valid and invalid values, missing required values, and secret-safe errors.
5. Update this document and relevant deployment/runbook docs.
