param(
  [string]$message = 'chore: embed frontend; add E2E smoke test; add commit helper & CI workflow'
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host 'git not found on this machine. Please run the following commands on a machine with git installed:'
  Write-Host ''
  Write-Host 'git add -A'
  Write-Host "git commit -m \"$message\""
  Write-Host 'git push origin HEAD'
  exit 2
}

Write-Host 'Staging changes...'
git add -A
$staged = git status --porcelain
if (-not $staged) {
  Write-Host 'No changes to commit.'
  exit 0
}

Write-Host 'Committing...'
git commit -m "$message"
if ($LASTEXITCODE -ne 0) {
  Write-Error 'git commit failed'
  exit $LASTEXITCODE
}

Write-Host 'Commit successful. You can push with `git push origin HEAD`.'
