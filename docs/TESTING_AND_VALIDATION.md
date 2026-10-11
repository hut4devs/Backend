# Testing and Validation

## Standard checks
Run from the repository root:

```bash
npm ci
npm run check
npm audit
```

For diagnosis, run `npm run typecheck`, `npm test`, and `npm run build` individually.

## Test expectations
- Unit tests cover domain rules, configuration validation, and isolated application behavior.
- Integration tests cover persistence, transactions, and adapters where implemented.
- Contract tests cover API compatibility and external-provider boundaries where implemented.
- Security tests cover authentication, authorization, input validation, secret-safe errors, and webhook verification where applicable.
- Test success and important failure paths.
- Tests must be deterministic and must not require production credentials or real customer/payment data.

## Pull request evidence
List commands run and actual results. Explain any checks not run. Local success does not replace checking the pull request's CI result.
