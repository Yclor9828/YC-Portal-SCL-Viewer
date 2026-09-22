$workspacePath = $PSScriptRoot
$extensionsDirs = @(
    "C:\Users\yinyi\.antigravity\extensions",
    "C:\Users\yinyi\.antigravity-ide\extensions",
    "C:\Users\yinyi\.trae-cn\extensions",
    "C:\Users\yinyi\.vscode\extensions"
)
$settingsFiles = @(
    "C:\Users\yinyi\AppData\Roaming\Antigravity\User\settings.json",
    "C:\Users\yinyi\AppData\Roaming\Antigravity IDE\User\settings.json",
    "C:\Users\yinyi\AppData\Roaming\Trae CN\User\settings.json"
)

$targetFolder = "yclor.yc-portal-scl-viewer-2.11.1-universal"
$extId = "yclor.yc-portal-scl-viewer"
$version = "2.11.1"

# 1. Clear old / conflict extensions
$legacyFolders = @(
    "dynamicengineering.dynamic-siemens-language-support-2.11.1-universal",
    "dynamicengineering.dynamic-siemens-language-support-2.11.1",
    "yc-portal-scl-viewer"
)

foreach ($extDir in $extensionsDirs) {
    if (Test-Path $extDir) {
        foreach ($legacy in $legacyFolders) {
            $legacyPath = Join-Path $extDir $legacy
            if (Test-Path $legacyPath) {
                $item = Get-Item $legacyPath -ErrorAction SilentlyContinue
                if ($item.Attributes -match "ReparsePoint") {
                    cmd /c rmdir "$legacyPath"
                } else {
                    Remove-Item -Path $legacyPath -Recurse -Force -ErrorAction SilentlyContinue
                }
            }
        }

        # Backup or remove target folder
        $targetPath = Join-Path $extDir $targetFolder
        if (Test-Path $targetPath) {
            $bakPath = $targetPath + ".bak"
            $item = Get-Item $targetPath -ErrorAction SilentlyContinue
            if ($item.Attributes -match "ReparsePoint") {
                cmd /c rmdir "$targetPath"
            } else {
                if (-not (Test-Path $bakPath)) {
                    Rename-Item -Path $targetPath -NewName ($targetFolder + ".bak") -ErrorAction SilentlyContinue
                    Write-Host "已备份原插件目录：$targetPath -> $bakPath"
                } else {
                    Remove-Item -Path $targetPath -Recurse -Force -ErrorAction SilentlyContinue
                }
            }
        }
    }
}

# 2. Create Junction Links
foreach ($extDir in $extensionsDirs) {
    if (-not (Test-Path $extDir)) {
        New-Item -ItemType Directory -Path $extDir -ErrorAction SilentlyContinue | Out-Null
    }
    $linkPath = Join-Path $extDir $targetFolder
    if (-not (Test-Path $linkPath)) {
        cmd /c mklink /j "$linkPath" "$workspacePath" | Out-Null
        Write-Host "已关联扩展目录：$linkPath"
    }
}

# 3. Register in extensions.json
foreach ($extDir in $extensionsDirs) {
    $jsonPath = Join-Path $extDir "extensions.json"
    if (Test-Path $jsonPath) {
        try {
            $content = Get-Content -Raw -Path $jsonPath -ErrorAction SilentlyContinue
            if ($content) {
                $data = ConvertFrom-Json $content
            } else {
                $data = @()
            }
        } catch {
            $data = @()
        }

        # Remove legacy dynamicengineering entries if any
        $data = @($data | Where-Object { $_.identifier.id -ne "dynamicengineering.dynamic-siemens-language-support" })

        # Check if already exists
        $exists = $false
        foreach ($item in $data) {
            if ($item.identifier.id -eq $extId) {
                $item.version = $version
                $item.relativeLocation = $targetFolder
                $dirName = Split-Path (Split-Path $extDir -Parent) -Leaf
                $item.location = @{
                    '$mid' = 1
                    "path" = "/c:/Users/yinyi/$dirName/extensions/$targetFolder"
                    "scheme" = "file"
                }
                $item.metadata = @{
                    "installedTimestamp" = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    "pinned" = $true
                    "source" = "vsix"
                }
                $exists = $true
                break
            }
        }

        if (-not $exists) {
            $dirName = Split-Path (Split-Path $extDir -Parent) -Leaf
            $newEntry = @{
                "identifier" = @{
                    "id" = $extId
                }
                "version" = $version
                "location" = @{
                    '$mid' = 1
                    "path" = "/c:/Users/yinyi/$dirName/extensions/$targetFolder"
                    "scheme" = "file"
                }
                "relativeLocation" = $targetFolder
                "metadata" = @{
                    "installedTimestamp" = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    "pinned" = $true
                    "source" = "vsix"
                }
            }
            $data += $newEntry
            Write-Host "已成功在 $jsonPath 注册插件缓存"
        } else {
            Write-Host "已更新 $jsonPath 插件缓存"
        }

        $jsonStr = ConvertTo-Json $data -Depth 100
        $jsonStr | Out-File -FilePath $jsonPath -Encoding utf8 -Force
    }
}

# 4. Modify settings.json
foreach ($setFile in $settingsFiles) {
    if (Test-Path $setFile) {
        try {
            $content = Get-Content -Raw -Path $setFile -ErrorAction SilentlyContinue
            if ($content) {
                $data = ConvertFrom-Json $content
            } else {
                continue
            }
        } catch {
            continue
        }

        if (-not $data.PSObject.Properties['files.associations']) {
            $data | Add-Member -MemberType NoteProperty -Name "files.associations" -Value @{}
        }
        
        $data."files.associations"."*.scl" = "siemens"
        $data."files.associations"."*.st" = "siemens"
        $data."files.associations"."*.s7dcl" = "siemens-dcl"
        $data."files.associations"."*.scltest" = "siemens-test"
        
        if ($data.PSObject.Properties['workbench.iconTheme']) {
            $data."workbench.iconTheme" = "vs-minimal"
        } else {
            $data | Add-Member -MemberType NoteProperty -Name "workbench.iconTheme" -Value "vs-minimal"
        }
        
        $jsonStr = ConvertTo-Json $data -Depth 100
        $jsonStr | Out-File -FilePath $setFile -Encoding utf8 -Force
        Write-Host "已配置全局变量关联与图标主题：$setFile"
    }
}

Write-Host "`n一键部署成功！请关闭所有编辑器（Antigravity/Trae/VS Code）并重新启动。" -ForegroundColor Green
