# Contributing

## Before implementation
1. Select an issue and confirm acceptance criteria and domain ownership.
2. Read `docs/CONTRIBUTOR_GUIDE.md` and `docs/BACKEND_ENGINEERING_STANDARD.md`.
3. Read issue-linked references relevant to the change: architecture, API contract, data model, security, environment configuration, testing, and decision records.
4. Create a focused branch from the latest `main`.

## During implementation
Separate domain rules from HTTP/provider code, validate inputs at boundaries, enforce permissions server-side, use transactions for multi-record invariants, and make financial/webhook workflows idempotent. Test expected behavior and relevant failure paths. Update docs when contracts, configuration, data models, security, operations, or architecture change.

## Before opening a pull request
Run `npm run check` and `npm audit`; check CI and report actual results. Use `.github/pull_request_template.md`, link the issue, and describe migration, security, compatibility, rollout, and test evidence. Never commit credentials, real personal/payment data, local environment files, or production dumps. Use the Hut4Devs 🛖 commit convention where practical.

## Issue maintenance
Every new issue must link the contributor guide and engineering standard plus the specific references relevant to its scope. Update existing issues with links without changing their requirements. When standards change, update docs, issue templates, and affected open issues in a focused pull request.
