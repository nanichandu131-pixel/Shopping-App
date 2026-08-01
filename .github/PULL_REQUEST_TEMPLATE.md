<!-- Title: short, imperative tense -->

## Summary
A short description of what this PR does and why.

## Changes
- Brief list of changes made (code, tests, CI, docs).

## Files Changed
List the most important files modified:
- backend/src/scripts/seed.js
- frontend/src/components/PriceHistoryChart.jsx
- backend/tests/e2e/run-e2e.cjs
- backend/tests/e2e/price-history.spec.js
- .github/workflows/e2e.yml
- COMMIT_INSTRUCTIONS.md

## How to test locally
1. Install dependencies: `npm ci`
2. Build and embed frontend:
   - `npm run build --workspace frontend`
   - `node scripts/embed-frontend.js`
3. Seed the backend:
   - `npm run seed:backend`
4. Start backend (production mode recommended):
   - `NODE_ENV=production PORT=5000 npm run start --workspace backend`
5. Run E2E smoke runner:
   - `node backend/tests/e2e/run-e2e.cjs`

## Checklist
- [ ] CI passes
- [ ] Seed script verified locally
- [ ] Smoke E2E passes

## Notes for reviewers
- The seed script now generates time-series `PriceHistory` entries and clears stale store-related collections before seeding.
- The Playwright runner is a minimal smoke test and intended to be expanded for full E2E coverage.

<!-- Add any screenshots or logs if helpful -->
