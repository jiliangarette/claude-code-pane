# Panes :: one-line bootstrap
#   irm https://raw.githubusercontent.com/jiliangarette/claude-code-pane/main/bootstrap.ps1 | iex
# Clones the repo into ~/projects (or updates it if already there) and runs install.ps1.

$ErrorActionPreference = 'Stop'

$repo   = 'https://github.com/jiliangarette/claude-code-pane.git'
$parent = Join-Path $env:USERPROFILE 'projects'
$dest   = Join-Path $parent 'claude-code-pane'

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error 'git is required. Install Git for Windows: https://git-scm.com/download/win'
  return
}

New-Item -ItemType Directory -Force -Path $parent | Out-Null

if (Test-Path (Join-Path $dest '.git')) {
  Write-Host "Updating existing clone at $dest"
  git -C $dest pull --ff-only
} else {
  Write-Host "Cloning Panes into $dest"
  git clone --depth 1 $repo $dest
}

$installer = Join-Path $dest 'install.ps1'
if (-not (Test-Path $installer)) {
  Write-Error "install.ps1 not found at $installer"
  return
}

Write-Host "Running installer..."
powershell -NoProfile -ExecutionPolicy Bypass -File $installer
