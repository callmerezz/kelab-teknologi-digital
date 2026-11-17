Set-Location -LiteralPath $PSScriptRoot

Write-Host "Auto-sync aktif. Perubahan pada cabang dev akan diperiksa setiap 3 saat."

while ($true) {
    $currentBranch = git branch --show-current
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Tidak dapat menyemak cabang Git."
        Start-Sleep -Seconds 3
        continue
    }

    if ($currentBranch.Trim() -eq "dev") {
        $changes = git status --porcelain
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Tidak dapat menyemak status Git."
            Start-Sleep -Seconds 3
            continue
        }

        if ($changes) {
            Write-Host "Perubahan dikesan. Menambah, membuat commit dan push..."

            git add .
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "git add gagal; perubahan belum di-commit."
                Start-Sleep -Seconds 3
                continue
            }

            git commit -m "auto-update: $(Get-Date -Format 'HH:mm:ss')"
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "git commit gagal; semak konfigurasi Git dan perubahan."
                Start-Sleep -Seconds 3
                continue
            }

            git push
            $originPushExitCode = $LASTEXITCODE

            git push dev-site dev:main
            $devSitePushExitCode = $LASTEXITCODE

            if ($originPushExitCode -ne 0) {
                Write-Warning "git push gagal; commit tempatan dikekalkan."
            }
            if ($devSitePushExitCode -ne 0) {
                Write-Warning "Push ke dev-site gagal."
            }
        }
    }

    Start-Sleep -Seconds 3
}
