$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$AppRoot = Join-Path $RepoRoot 'app'
$Current = Join-Path $AppRoot 'index.html'

if (-not (Test-Path $Current)) {
    throw "Plataforma atual não encontrada em: $Current"
}

Write-Host "Publicando versão atual do repositório: $Current"

Push-Location $RepoRoot
try {
    git add README.md .gitignore app/index.html scripts/publish-current.ps1
    $changes = git status --porcelain

    if (-not $changes) {
        Write-Host 'Nenhuma alteração para publicar.'
        exit 0
    }

    git commit -m "feat: update current Q-SIM platform"
    git push origin main
}
finally {
    Pop-Location
}
