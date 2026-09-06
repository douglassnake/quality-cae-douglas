$ErrorActionPreference = 'Stop'

$SourceRoot = 'W:\Douglas\PLATAFORMA_QUALIDADE'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$AppRoot = Join-Path $RepoRoot 'app'

if (-not (Test-Path $SourceRoot)) {
    throw "Pasta de origem não encontrada: $SourceRoot"
}

New-Item -ItemType Directory -Force -Path $AppRoot | Out-Null

# Seleciona o HTML Q-SIM mais recente, evitando a pasta de relatórios/propostas.
$Current = Get-ChildItem -Path $SourceRoot -File -Filter 'QSIM*.html' |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $Current) {
    throw 'Nenhum arquivo QSIM*.html foi encontrado na pasta da plataforma.'
}

$Target = Join-Path $AppRoot 'index.html'
Copy-Item -Path $Current.FullName -Destination $Target -Force

Write-Host "Versão selecionada: $($Current.Name)"
Write-Host "Publicada em: $Target"

Push-Location $RepoRoot
try {
    git add README.md .gitignore app/index.html scripts/publish-current.ps1
    $changes = git status --porcelain
    if (-not $changes) {
        Write-Host 'Nenhuma alteração para publicar.'
        exit 0
    }

    git commit -m "feat: publish current Q-SIM platform"
    git push origin main
}
finally {
    Pop-Location
}
