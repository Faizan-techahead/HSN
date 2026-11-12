---
name: hsn-playwright
description: Parse a .txt test-case file (Testcase Name, Step to Reproduce, optional Suggestion), turn steps into Playwright tests using existing page objects, utilities, and fixtures; execute tests and diagnose failures.
---

When the user message is only a `.txt` path, run the full [agent/planner.md](../../agent/planner.md) workflow automatically: parse the file, implement, run, analyze `test-results/` and related report output, fix and rerun when appropriate.

Required tags: `Testcase Name:` and `Step to Reproduce:`; apply `Tags:` as Playwright `@` tags (default `@regression`). When `Suggestion:` / `Suggestions:` is present, treat it as binding extra implementation guidance for the matching steps (for example fetch all dropdown options, print them in the report, then select the named option).

Inspect `src/pages`, `src/utils`, `src/constants`, `tests/fixtures/test.ts`, and existing specs before editing. Reuse existing page actions and assertions when they already implement a supplied step. If a required page-object method or helper is missing, create it, then call it from the spec. Put reusable UI expectation lists (menu options, table columns, card titles) in `src/constants/` rather than inlining them in specs. Do not expect `Expected Result:` or `Test File:` in the `.txt` input. Keep locators and page interactions in page objects, shared cross-page helpers in utility classes, and scenario sequencing in specs using the existing fixtures.

Inspect the live application's accessible DOM before choosing locators. Prefer roles with accessible names, labels, or stable test IDs. Scope repeated names to their actual containers. Do not present guessed locators as verified. Use Playwright's auto-waiting and retrying assertions instead of fixed sleeps.

Read credentials from environment variables. Handle authentication screens that actually occur, including OTP. If a required code or test authentication method is unavailable, request it and report the run as blocked; never bypass authentication or claim a pass.

Run the requested spec against the supplied environment. Inspect failure messages, DOM snapshots, screenshots, or traces. Fix confirmed locator or timing defects and rerun the spec. Preserve assertions that express the user's requirements. Stop and report an application defect, inaccessible environment, or missing authentication input when code changes cannot resolve it. Do not loop on unchanged failures.

Verify logout returns to sign-in. Close scenario pages and let Playwright fixtures dispose of contexts and the runner close its browser. Report the exact command, observed test result, files changed, and any steps that remain unverified.
