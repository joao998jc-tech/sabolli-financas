# Auto-push: monitora alteracoes e envia para o GitHub automaticamente
$projectPath = "C:\Users\joao9\OneDrive\Área de Trabalho\Finanças\sabolli-financas"
$debounceSeconds = 5

Write-Host "Sabolli Auto-Push iniciado. Monitorando alteracoes..." -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar." -ForegroundColor Yellow

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $projectPath
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true
$watcher.Filter = "*.*"

$lastPush = [DateTime]::MinValue

while ($true) {
    $changed = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 2000)

    if (-not $changed.TimedOut) {
        $file = $changed.Name
        # Ignorar arquivos irrelevantes
        if ($file -match "^(\.git|auto-push|firebase-debug|\.firebase)" -or $file -match "\.log$") {
            continue
        }

        $now = [DateTime]::Now
        $diff = ($now - $lastPush).TotalSeconds

        if ($diff -lt $debounceSeconds) {
            continue
        }

        $lastPush = $now
        Start-Sleep -Seconds 2

        Set-Location $projectPath
        $status = git status --porcelain 2>&1
        if ($status) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Alteracao detectada em: $file" -ForegroundColor Cyan
            git add index.html app.js styles.css sw.js manifest.json icon.svg 404.html 2>&1 | Out-Null
            $msg = "update: $(Get-Date -Format 'dd/MM HH:mm')"
            git commit -m $msg 2>&1 | Out-Null
            $result = git push 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Enviado para o GitHub! Site atualizado em ~1min." -ForegroundColor Green
            } else {
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Erro ao enviar: $result" -ForegroundColor Red
            }
        }
    }
}
