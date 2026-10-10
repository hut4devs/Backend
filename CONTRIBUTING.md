# Contributing

1. Select an issue and confirm domain ownership and acceptance criteria.
2. Create a focused branch.
3. Test domain rules, authorization, failure modes, and persistence boundaries.
4. Run formatting, type-check, unit, integration, and build checks available.
5. Open a pull request linking the issue, migration impact, security considerations, and test evidence.

Separate domain rules from HTTP/provider code. Validate inputs at boundaries, enforce permissions server-side, use transactions for multi-record invariants, make webhook processing idempotent, and preserve audit evidence. Never commit credentials or real personal/payment data. Use the Hut4Devs 🛖 commit convention where practical.
