param([string]$Repo = 'buzzworks', [string]$Message = 'Update Buzzworks')
$ErrorActionPreference = 'Continue'
$gh = Join-Path $env:ProgramFiles 'GitHub CLI\gh.exe'
if (-not (Test-Path $gh)) { $gh = 'gh' }
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root

& $gh auth status *> $null
if ($LASTEXITCODE -ne 0) { & $gh auth login --hostname github.com --git-protocol https --web }
& $gh auth setup-git

$login = (& $gh api user --jq .login).Trim()
$id = (& $gh api user --jq .id).Trim()
$name = (& $gh api user --jq '.name // .login').Trim()

if (-not (Test-Path (Join-Path $root '.git'))) { git init -b main | Out-Null }
git config user.name $name
git config user.email "$id+$login@users.noreply.github.com"

git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  $body = "$Message`n`nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
  git commit -q -m $body
}

& $gh repo view "$login/$Repo" *> $null
if ($LASTEXITCODE -ne 0) {
  & $gh repo create $Repo --public --description 'Buzzworks, a cozy idle honey tycoon you play in the browser.' --homepage "https://buzzworks.novafox.fr/"
}
$remote = git remote
if ($remote -notcontains 'origin') { git remote add origin "https://github.com/$login/$Repo.git" }
git push -u origin main
if ($LASTEXITCODE -ne 0) { Write-Host 'Push failed.'; exit 1 }

& $gh api -X POST "repos/$login/$Repo/pages" -f build_type=workflow *> $null
& $gh api -X PUT "repos/$login/$Repo/pages" -f build_type=workflow *> $null
& $gh workflow run pages.yml --repo "$login/$Repo" *> $null

Write-Host ''
Write-Host "Repository: https://github.com/$login/$Repo"
Write-Host "Game: https://buzzworks.novafox.fr/"
