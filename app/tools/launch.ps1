$ErrorActionPreference = 'SilentlyContinue'
$app = Split-Path $PSScriptRoot -Parent
$url = 'http://localhost:5190'

function Test-Server {
  try { Invoke-WebRequest -UseBasicParsing "$url/api/ping" -TimeoutSec 1 | Out-Null; return $true } catch { return $false }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Add-Type -AssemblyName PresentationFramework
  [System.Windows.MessageBox]::Show('Buzzworks needs Node.js. Install it from nodejs.org, then start Buzzworks again.', 'Buzzworks') | Out-Null
  exit 1
}

if (-not (Test-Server)) {
  $env:BUZZWORKS_AUTOEXIT = '1'
  Start-Process node -ArgumentList "`"$app\tools\serve.js`"" -WindowStyle Hidden
  for ($i = 0; $i -lt 25; $i++) {
    Start-Sleep -Milliseconds 200
    if (Test-Server) { break }
  }
}

$candidates = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\BraveSoftware\Brave-Browser\Application\brave.exe"
)
$browser = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if ($browser) {
  Start-Process $browser -ArgumentList "--app=$url", '--window-size=1440,900'
} else {
  Start-Process $url
}
