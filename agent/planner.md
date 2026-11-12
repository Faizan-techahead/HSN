# Planner Agent

Turn user-provided application steps into executable Playwright tests. Input is supplied as a **`.txt` file`** with labeled sections. Complete the parse, create, run, diagnose, fix, and rerun workflow within the requested scope.

## Trigger: `.txt` only

When the user sends **only** a `.txt` path (relative or absolute), or a short message whose sole intent is that file (for example `testcase-input/checkout.txt`):

- Start this workflow **immediately**. No confirmation, no "what would you like me to do?"
- The `.txt` file is the **only** required user input for a full cycle through implementation, execution, report analysis, fixes, and final status.

If the path is missing, does not end in `.txt`, or the file cannot be read, stop and say what is wrong.

## Input: `.txt` test case file

The user provides a path to a plain-text file under `testcase-input/` (for example `testcase-input/my-testcase.txt`). Read that file first before editing code or running tests.

### Required tags

Parse these labels case-insensitively. Accept common variants:

| Tag | Purpose |
| --- | --- |
| `Testcase Name:` | Human-readable scenario title; becomes the Playwright test name and describe-block context when appropriate. |
| `Step to Reproduce:` or `Steps to Reproduce:` | Ordered manual steps the automation must follow. |

`Step to Reporduce:` is treated as an alias for `Step to Reproduce:` (typo tolerance).

### Optional tags

When present, use them in the scenario and assertions:

| Tag | Purpose |
| --- | --- |
| `Preconditions:` | Setup before steps (login state, data, navigation). |
| `Environment:` | Base URL or env hint; otherwise use `playwright.config.ts` and project env vars. |
| `Tags:` | Comma- or space-separated labels for the Playwright test (for example `regression`, `smoke`). Each value becomes a Playwright tag with an `@` prefix (`regression` → `@regression`). Default to `@regression` when `Tags:` is omitted. |
| `Suggestion:` or `Suggestions:` | Extra implementation guidance for steps that need more than a literal click/assert. Use when creating a new script or updating an existing one. |

#### `Suggestion:` behavior

Treat `Suggestion:` as **binding implementation notes**, not optional commentary. When present:

- Apply each suggestion to the matching step(s) while creating or updating the spec and page objects.
- Prefer the suggestion over a naive one-action mapping of that step.
- Keep the original step order; suggestions refine how a step is automated, they do not replace the step list.

Typical uses:

- **Dropdown / menu / list**: collect all visible options, print/log them in the Playwright report (for example `test.info().attach` or `console.log` captured in the report), then select the option named in the steps.
- **Dynamic counts**: assert the stated count (for example “3 options”), then continue with the select/verify step.
- **Extra verification or reporting** the plain steps do not spell out.

Example suggestion for a Billing menu with three options:

```text
Suggestion:
- Step 4–5 (Billing): open Billing, fetch all visible options, print them in the report, confirm 3 options, then select "HSN Mentoring Billing"
```

Do **not** use `Expected Result:` or `Test File:` in `.txt` files. Derive assertions from the reproduction steps. Choose the target spec path from the feature area and existing `tests/` layout.

### Step list format

Under `Step to Reproduce:` (or alias):

- Numbered lines (`1.`, `2.`, …) or bullet lines (`-`, `*`) are individual steps.
- Blank lines between steps are allowed.
- Preserve **order** and **intent**; do not drop or reorder steps unless the user’s file is ambiguous—in that case ask only for what blocks correct implementation.

### Example files

- Basic template: [testcase-input/sign-in-form.example.txt](../testcase-input/sign-in-form.example.txt)
- With `Suggestion:` (dropdown options + report): [testcase-input/sign-in-form.example copy.txt](../testcase-input/sign-in-form.example%20copy.txt)

## Workflow

1. **Load input** — Read the user’s `.txt` file from `testcase-input/` (or the path they give). Extract `Testcase Name`, all reproduction steps, `Tags` (default `@regression`), `Suggestion` / `Suggestions` when present, and any other optional sections. If `Testcase Name:` or reproduction steps are missing, stop and ask for a corrected file.
2. **Load project context** — Read `skills/hsn-playwright/SKILL.md`, existing specs, `src/pages`, `src/utils`, `tests/fixtures/test.ts`, and `playwright.config.ts`. Reuse existing code and conventions.
3. **Plan the scenario** — Map each step to page actions, navigation, and assertions implied by the steps. Overlay `Suggestion:` notes onto the matching steps (for example fetch-and-report dropdown options before selecting). Use preconditions for `beforeEach` / setup. Ask for missing information only when it prevents correct implementation or execution.
4. **DOM and selectors** — Inspect the live application’s accessible DOM before adding selectors. Prefer roles, labels, and stable test IDs. Identify any selectors that remain unverified.
5. **Implement** — Create or update the relevant `.spec.ts` based on feature area and existing layout. For each step, check whether a matching page-object method (or shared helper) already exists; if it does not, create a new method and wire it into the spec. When `Suggestion:` is present, implement the extra behavior it describes (collect options, attach/print them in the report, assert counts, then select). Keep locators and page actions in page objects, shared helpers in utilities, and scenario sequencing in specs. Import `test` and `expect` from the shared fixture and use `screenshotStep` where appropriate. Use auto-waiting and retrying assertions instead of fixed sleeps. Name the test from `Testcase Name:`. Set Playwright tags on the test (or `test.describe`) from `Tags:` — for example `test('…', { tag: '@regression' }, async …)` or `tag: ['@regression', '@smoke']` when multiple tags are listed.
6. **Secrets** — Read credentials and OTP values from environment variables. Never embed or print secrets or bypass authentication.
7. **Run** — Execute the affected test, for example:

   ```sh
   npx playwright test tests/auth/login.spec.ts --project=chrome
   ```

   Run only regression-tagged tests:

   ```sh
   npm run test:regression
   ```

8. **Analyze the report** — After every run, inspect all available evidence:

   - Terminal output (exit code, assertion messages, timeouts).
   - `test-results/` (per-test folders, `error-context.md`, screenshots, video/trace when present).
   - Open or skim `playwright-report/index.html` data under `playwright-report/` when a broader view helps.
   - Map each failure to a step from the `.txt` file and to the spec line or locator involved.

   On ambiguous failures, rerun with `--trace=on` or `--headed` once for more signal, then analyze again.

9. **Fix and rerun** — From the report analysis, fix confirmed **test** defects (locators, timing, fixtures, page objects) and rerun the affected test. Continue while each attempt makes evidence-based progress. Preserve required assertions; never skip tests, weaken expectations, or hide errors to obtain a pass.
10. **Blockers** — If an application defect, unavailable environment, missing credentials, or missing OTP prevents completion, report the cause and required next action. Do not repeat unchanged failures indefinitely or claim unresolved issues are fixed.
11. **Regression** — After changing shared page objects, utilities, or fixtures, run other directly affected tests. Verify sign-out when it is part of the scenario and let Playwright dispose of contexts and browsers.

## Results

Report the parsed **test case name**, **source `.txt` path**, scenario summary, applied **suggestions** (if any), changed files, exact command, observed result, fixes made, and final rerun result. Include test counts when available and identify skipped or unverified steps.

- **PASSED**: The steps from the `.txt` file and assertions completed successfully in an actual run.
- **FAILED**: The executed test failed; include the cause and whether it remains unresolved.
- **BLOCKED / NOT RUN**: Execution could not proceed; state the missing input or environment requirement. If a run already failed before becoming blocked, preserve that failed result too.

Creating or listing a test does not count as passing. This file provides instructions for the coding agent and does not launch a background process.
