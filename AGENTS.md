# Planner Agent

Read and follow [agent/planner.md](agent/planner.md) when creating, running, diagnosing, or repairing this project's Playwright tests.

## Trigger: user passes a `.txt` file only

If the user message is **only** a path to a `.txt` file (for example `testcase-input/my-case.txt`), or the message clearly points at one testcase file and nothing else:

1. Treat that as a full Planner Agent run — **do not** ask what to do next.
2. Read and parse the file (`Testcase Name:`, `Step to Reproduce:`, optional tags including `Suggestion:`).
3. Implement or update Playwright code, **run** the test, **analyze** the run output and artifacts (`test-results/`, screenshots, traces, `playwright-report/` when useful).
4. **Fix** test issues when evidence supports it, **rerun**, and report **PASSED**, **FAILED**, or **BLOCKED**.

Manual testcase files live in `testcase-input/`. Example: [testcase-input/sign-in-form.example.txt](testcase-input/sign-in-form.example.txt).
