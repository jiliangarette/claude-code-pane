# Panes :: installer (Windows PowerShell 5.1+)
# Copies the config + scripts into place, generates the icon, and creates a
# Desktop shortcut if it can find wezterm-gui.exe. Never overwrites your settings.lua.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$home_ = $env:USERPROFILE
$wtDir = Join-Path $home_ '.config\wezterm'
$ccpDir = Join-Path $home_ '.config\ccp'

New-Item -ItemType Directory -Force -Path $wtDir, $ccpDir | Out-Null

# config: wezterm.lua always; settings.lua only if missing (don't clobber user edits)
Copy-Item (Join-Path $root 'wezterm\wezterm.lua') (Join-Path $wtDir 'wezterm.lua') -Force
$settingsDst = Join-Path $wtDir 'settings.lua'
if (-not (Test-Path $settingsDst)) {
  Copy-Item (Join-Path $root 'wezterm\settings.lua') $settingsDst
  Write-Host "Installed settings.lua (optional tuning; first launch will ask for your projects folder)."
} else {
  Write-Host "Kept your existing settings.lua."
}

# scripts
Copy-Item (Join-Path $root 'ccp\*') $ccpDir -Force -Recurse
Write-Host "Installed scripts to $ccpDir"

# icon
try {
  powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $ccpDir 'make-icon.ps1') | Out-Null
  Write-Host "Generated icon"
} catch { Write-Warning "Icon generation skipped: $_" }

# locate wezterm-gui.exe
$gui = $null
$cmd = Get-Command wezterm-gui.exe -ErrorAction SilentlyContinue
if ($cmd) { $gui = $cmd.Source }
if (-not $gui) {
  $candidates = @(
    "$home_\apps\wezterm\*\wezterm-gui.exe",
    "$env:ProgramFiles\WezTerm\wezterm-gui.exe",
    "$env:LOCALAPPDATA\Programs\WezTerm\wezterm-gui.exe",
    "$home_\scoop\apps\wezterm\current\wezterm-gui.exe"
  )
  foreach ($c in $candidates) {
    $hit = Get-ChildItem $c -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($hit) { $gui = $hit.FullName; break }
  }
}

if ($gui) {
  $desktop = [Environment]::GetFolderPath('Desktop')
  $ws = New-Object -ComObject WScript.Shell
  $lnk = $ws.CreateShortcut((Join-Path $desktop 'Panes.lnk'))
  $lnk.TargetPath = $gui
  $lnk.WorkingDirectory = $home_
  $ico = Join-Path $ccpDir 'CCP.ico'
  if (Test-Path $ico) { $lnk.IconLocation = "$ico,0" }
  $lnk.Description = 'Panes'
  $lnk.Save()
  Write-Host "Created Desktop shortcut: Panes -> $gui"
} else {
  Write-Warning "wezterm-gui.exe not found. Install WezTerm (https://wezterm.org/install/windows.html), then re-run this installer, or launch wezterm-gui.exe directly."
}

Write-Host ""
Write-Host "Done. Launch Panes — it will ask for your projects folder on first run. (Change it later with Ctrl+A then S.)"
