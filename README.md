# HSN Platform end-to-end tests

Playwright tests use the Page Object Model (POM) so page selectors and user
actions live outside the test cases.

## Structure

```text
agent/                 Planner Agent instructions for Playwright workflows
testcase-input/        Manual test-case .txt files for the Planner Agent
src/
  constants/          Shared UI labels and expected table/option values
  pages/              Page objects and their locators/actions
  utils/              Cross-page helpers (auth, page waits)
tests/
  auth/               Authentication-related test scenarios
  billing/            Billing-related test scenarios
  fixtures/            Shared Playwright fixtures
playwright.config.ts   Base URL, browser projects, timeouts, and reporting
```

## Setup and run

Install dependencies and browser binaries:

```sh
npm ci
npx playwright install
```

Run the suite in Google Chrome:

```sh
npm test
```

Useful commands:

```sh
npm run test:ui
npm run test:headed
npm run test:debug
npm run test:regression
npm run report
```

The base URL defaults to the HSN staging sign-in page. Override it with
`BASE_URL` when targeting another environment. Tests that need authenticated
access should read credentials from `HSN_EMAIL` and `HSN_PASSWORD` environment
variables and pass them to `LoginPage.signIn`; never commit credentials or
write them into test files.

The admin profile scenario uses `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Copy
`.env.example` to `.env` and fill in these values, or export them in your shell.
Playwright automatically loads `.env` (requires Node.js 20.12+); existing shell
variables take precedence. The `.env` file is ignored by Git. Then run:

```sh
npx playwright test tests/auth/admin-profile.spec.ts --project=chrome
```

Admin authentication currently requires an emailed six-digit OTP. Set
`ADMIN_OTP` to a valid code when an approved staging OTP method is available.
Without it the test fails explicitly at authentication. Dashboard/profile
locators are drafts pending live verification after OTP authentication.

The **Planner Agent** workflow is saved in [agent/planner.md](agent/planner.md)
and applied through `AGENTS.md`. Add a `.txt` file under `testcase-input/`, then
in chat send **only that path** (for example `testcase-input/my-case.txt`). The
agent parses the file, creates or updates specs, runs tests, analyzes the Playwright
report and `test-results/`, fixes test issues when possible, and reports the final
result.

Reusable test instructions are in `skills/hsn-playwright/SKILL.md`. Shared authentication
helpers are in `src/utils/auth.utils.ts`. Shared UI expectation constants (billing options,
table columns, and similar) live under `src/constants/` and should be imported from there
instead of inlining lists in specs.

The HTML report is written to `playwright-report/`; failure artifacts are
written to `test-results/`.
