Suggested PR title:
`chore(seed): embed frontend; add E2E smoke test; add CI workflow`

Suggested branch name:
`feature/embed-frontend-e2e`

Suggested commit message (single-line):
`chore: embed frontend; add E2E smoke test; add commit helper & CI workflow`

Suggested full PR description (copy into GitHub PR body):

Summary

This PR embeds the built frontend into the backend for single-image deployment, adds a minimal Playwright smoke E2E test that verifies the product details price-history chart, and introduces a GitHub Actions workflow to run the smoke test on push/PR.

Primary changes
- Embed script run output copied `frontend/dist` → `backend/frontend-dist` (for production serving).
- Add `backend/tests/e2e/run-e2e.cjs` to run a simple Playwright Chromium check.
- Add `backend/tests/e2e/price-history.spec.js` as a Playwright spec (for future use with Playwright test runner).
- Add `.github/workflows/e2e.yml` to run the CI job (MongoDB service, seed, start backend, run runner).
- Add `COMMIT_INSTRUCTIONS.md` and `commit-changes.ps1` to help with committing from environments lacking `git`.

How I tested
- Built frontend locally and embedded into `backend/frontend-dist`.
- Seeded local MongoDB and validated price-history entries exist.
- Ran the CommonJS runner `node backend/tests/e2e/run-e2e.cjs` — it navigated to a product with price history and detected the chart.

Manual steps to push

```bash
git checkout -b feature/embed-frontend-e2e
git add -A
git commit -m "chore: embed frontend; add E2E smoke test; add commit helper & CI workflow"
git push -u origin feature/embed-frontend-e2e
```

Notes
- If your workstation lacks `git`, use `commit-changes.ps1` or create a zip archive and commit from another machine.
- The CI workflow assumes `npm ci` works in a single-workspace invocation; adjust if your environment differs.
