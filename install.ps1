# Panes :: installer (Windows PowerShell 5.1+)
# Copies the config + scripts into place, generates the icon, and creates a
# Desktop shortcut if it can find wezterm-gui.exe. Never overwrites your settings.lua.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$home_ = $env:USERPROFILE
$wtDir = Join-Path $home_ '.config\wezterm'
$ccpDir = Join-Path $home_ '.config\ccp'

Write-Host "Checking dependencies..."
$fatal = $false
if (Get-Command git -ErrorAction SilentlyContinue) {
  Write-Host "  [ok] git"
} else {
  Write-Host "  [missing] git — install Git for Windows: https://git-scm.com/download/win"
  $fatal = $true
}
if ($PSVersionTable.PSVersion.Major -ge 5) {
  Write-Host ("  [ok] PowerShell {0}" -f $PSVersionTable.PSVersion)
} else {
  Write-Host ("  [missing] PowerShell 5.1+ required (found {0})" -f $PSVersionTable.PSVersion)
  $fatal = $true
}
$bashExe = 'C:\Program Files\Git\bin\bash.exe'
if (Test-Path $bashExe) {
  Write-Host "  [ok] Git Bash ($bashExe)"
} else {
  Write-Host "  [warn] Git Bash not found at $bashExe — if you installed Git to a custom location, panes may fail to open a shell. Reinstall Git for Windows: https://git-scm.com/download/win"
}
if ((Get-Command wezterm-gui.exe -ErrorAction SilentlyContinue) -or (Get-Command wezterm.exe -ErrorAction SilentlyContinue)) {
  Write-Host "  [ok] wezterm"
} else {
  Write-Host "  [warn] wezterm not found on PATH — install continues, but no Desktop shortcut is created until WezTerm is installed."
}
if ($fatal) {
  Write-Error "Install the required dependencies above, then re-run install.ps1. Nothing was copied."
  return
}

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
$icoPath = Join-Path $ccpDir 'CCP.ico'
if (-not (Test-Path $icoPath)) {
  Write-Warning "Icon file not created at $icoPath — the Desktop shortcut will use WezTerm's default icon."
}

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
  Write-Warning "wezterm-gui.exe not found. To finish setup:"
  Write-Host "  1. Install WezTerm from https://wezterm.org/install/windows.html (or: winget install wez.wezterm)"
  Write-Host "  2. Re-run this installer (install.ps1)."
  Write-Host '  3. If still not found, check your PATH:  $Env:Path -split ";"  and ensure WezTerm''s folder is listed.'
}

Write-Host ""
if (Get-Command claude -ErrorAction SilentlyContinue) {
  Write-Host "Done. Launch Panes — it will ask for your projects folder on first run. (Change it later with Ctrl+A then S.)"
} else {
  Write-Host "Installation complete, but one thing is missing:"
  Write-Host ""
  Write-Host "  Claude Code not found on PATH. Panes opens plain shells until you install it."
  Write-Host "  Install it: https://docs.claude.com/en/docs/claude-code"
  Write-Host ""
  Write-Host "Launch Panes — it will ask for your projects folder on first run. (Change it later with Ctrl+A then S.)"
}
