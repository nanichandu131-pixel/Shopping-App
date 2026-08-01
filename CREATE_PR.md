Create and open a PR using `gh` (GitHub CLI)

Prerequisites
- `git` installed and configured
- `gh` (GitHub CLI) installed and authenticated (`gh auth login`)

Commands (copy & run from repo root):

```bash
# create and switch to the feature branch
git checkout -b feature/embed-frontend-e2e

# stage and commit all changes
git add -A
git commit -m "chore: embed frontend; add E2E smoke test; add commit helper & CI workflow"

# push branch to origin
git push -u origin feature/embed-frontend-e2e

# create the PR using the drafted body in PR_BODY.md
gh pr create \
  --title "chore(seed): embed frontend; add E2E smoke test; add CI workflow" \
  --body-file PR_BODY.md \
  --base main \
  --head feature/embed-frontend-e2e
```

Options
- To create a draft PR, add `--draft` to the `gh pr create` command.
- To add reviewers or labels, append `--reviewer username` and `--label "e2e"`.

Fallback (no `gh` available)
1. Push your branch with `git push -u origin feature/embed-frontend-e2e`.
2. Open a browser to your repository and create a PR from `feature/embed-frontend-e2e` → `main`.
3. Copy the contents of `PR_BODY.md` into the PR description.

If you want, I can also generate an exportable patch file containing only the modified/new files for offline application—tell me and I'll produce it next.