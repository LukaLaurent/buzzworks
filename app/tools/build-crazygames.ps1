param([string]$Out = '')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$app = Split-Path -Parent $PSScriptRoot
$root = Split-Path -Parent $app
if (-not $Out) { $Out = Join-Path $root 'dist' }
New-Item -ItemType Directory -Force $Out | Out-Null
$work = Join-Path ([IO.Path]::GetTempPath()) ('bz-cg-' + [guid]::NewGuid().ToString('N'))
$utf8 = New-Object System.Text.UTF8Encoding($false)
$version = ([regex]::Match((Get-Content (Join-Path $app 'src\data.js') -Raw), "VERSION = '([^']+)'")).Groups[1].Value

foreach ($variant in @('basic', 'full')) {
  $dir = Join-Path $work $variant
  New-Item -ItemType Directory -Force $dir | Out-Null
  foreach ($item in @('index.html', 'manifest.webmanifest', 'css', 'src', 'assets')) {
    Copy-Item (Join-Path $app $item) -Destination $dir -Recurse
  }
  Remove-Item (Join-Path $dir 'src\ads.js') -Force

  $ads = if ($variant -eq 'full') { 'true' } else { 'false' }
  $config = @"
(function (root) {
  const BZ = root.BZ = root.BZ || {};
  BZ.CONFIG = {
    platform: 'crazygames',
    cgAds: $ads,
    firebase: { apiKey: '', authDomain: '', projectId: '', appId: '' },
    adsense: { client: '', test: false }
  };
})(typeof window !== 'undefined' ? window : globalThis);
"@
  [IO.File]::WriteAllText((Join-Path $dir 'src\config.js'), $config.Replace("`r`n", "`n"), $utf8)

  $indexPath = Join-Path $dir 'index.html'
  $html = [IO.File]::ReadAllText($indexPath)
  $html = [regex]::Replace($html, '\s*<meta name="google-adsense-account"[^>]*>', '')
  $html = $html.Replace('<script src="src/ads.js"></script>' + "`n", '').Replace('<script src="src/ads.js"></script>' + "`r`n", '').Replace('<script src="src/ads.js"></script>', '')
  $html = $html.Replace('<script src="src/config.js"></script>', '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>' + "`n" + '<script src="src/config.js"></script>')
  $html = $html.Replace('<script src="src/main.js"></script>', '<script src="src/crazygames.js"></script>' + "`n" + '<script src="src/main.js"></script>')
  if ($html -notmatch 'crazygames-sdk-v3' -or $html -notmatch 'src/crazygames.js') { throw 'index.html patch failed' }
  [IO.File]::WriteAllText($indexPath, $html, $utf8)

  $zip = Join-Path $Out ("buzzworks-crazygames-$variant.zip")
  if (Test-Path $zip) { Remove-Item $zip -Force }
  $fs = [IO.File]::Open($zip, [IO.FileMode]::Create)
  $za = New-Object IO.Compression.ZipArchive($fs, [IO.Compression.ZipArchiveMode]::Create)
  foreach ($f in Get-ChildItem $dir -Recurse -File) {
    $rel = $f.FullName.Substring($dir.Length + 1).Replace('\', '/')
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($za, $f.FullName, $rel, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
  $za.Dispose(); $fs.Dispose()
  $size = [math]::Round((Get-Item $zip).Length / 1KB)
  $files = (Get-ChildItem $dir -Recurse -File).Count
  Write-Host "$variant  ->  $zip  ($size KB, $files files, version $version)"
}
Remove-Item $work -Recurse -Force
