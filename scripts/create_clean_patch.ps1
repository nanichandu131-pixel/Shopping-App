$patch = 'clean-smartprice-changes.patch'
if (Test-Path $patch) { Remove-Item $patch -Force }
$files = @(
  'COMMIT_INSTRUCTIONS.md',
  'commit-changes.ps1',
  '.github/workflows/e2e.yml',
  'backend/tests/e2e/price-history.spec.js',
  'backend/tests/e2e/run-e2e.cjs',
  'PR_BODY.md',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'CREATE_PR.md'
)
foreach ($f in $files) {
  if (-not (Test-Path $f)) {
    Write-Error "Missing file: $f"
    exit 1
  }
}
foreach ($f in $files) {
  $rel = $f -replace '\\', '/'
  Add-Content -Path $patch -Value "diff --git a/$rel b/$rel"
  Add-Content -Path $patch -Value 'new file mode 100644'
  Add-Content -Path $patch -Value 'index 0000000..0000000'
  Add-Content -Path $patch -Value '--- /dev/null'
  Add-Content -Path $patch -Value "+++ b/$rel"
  $lines = Get-Content $f
  Add-Content -Path $patch -Value "@@ -0,0 +1,$($lines.Count) @@"
  foreach ($line in $lines) {
    Add-Content -Path $patch -Value "+$line"
  }
  Add-Content -Path $patch -Value ''
}
Write-Host "Created $patch"
