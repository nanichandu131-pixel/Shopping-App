Commit instructions for SmartPrice Compare

If `git` is available locally, run these commands from the repository root to commit all changes made here:

```powershell
# stage and commit all changes
git add -A
git commit -m "chore: embed frontend; add E2E smoke test; add commit helper & CI workflow"
# push to origin if desired
git push origin HEAD
```

If `git` is not present on this machine, copy the repository to a machine with git, then run the commands above.

Alternatively, to create an archive of the current workspace for manual commit elsewhere:

```powershell
# create a zip of the current workspace (Windows PowerShell)
Compress-Archive -Path . -DestinationPath ../smartprice-changes.zip -Force
```

Helper script: `commit-changes.ps1` will attempt to run the git commands and report if `git` is missing.
