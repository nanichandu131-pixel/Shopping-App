$files = @(
  'COMMIT_INSTRUCTIONS.md',
  'commit-changes.ps1',
  '.github/workflows/e2e.yml',
  'backend/tests/e2e/price-history.spec.js',
  'backend/tests/e2e/run-e2e.js',
  'backend/tests/e2e/run-e2e.cjs',
  'PR_BODY.md',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'CREATE_PR.md'
)

$missing = $files | Where-Object { -not (Test-Path $_) }
if ($missing) {
  Write-Host 'Missing files:'
  $missing
  exit 1
}

$dest = Join-Path -Path (Get-Location).ProviderPath -ChildPath '..\smartprice-changes.zip'
Compress-Archive -Path $files -DestinationPath $dest -Force
Write-Host 'Created:' (Resolve-Path $dest)
