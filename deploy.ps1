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

$targetFolder = "dynamicengineering.dynamic-siemens-language-support-2.11.1-universal"
$extId = "dynamicengineering.dynamic-siemens-language-support"
$version = "2.11.1"

# 1. Clear old / conflict extensions
foreach ($extDir in $extensionsDirs) {
    if (Test-Path $extDir) {
        # Clear old yc-portal-scl-viewer if exists
        $oldLink = Join-Path $extDir "yc-portal-scl-viewer"
        if (Test-Path $oldLink) {
            Remove-Item -Path $oldLink -Recurse -Force -ErrorAction SilentlyContinue
        }

        # Backup or remove target folder
        $targetPath = Join-Path $extDir $targetFolder
        if (Test-Path $targetPath) {
            $bakPath = $targetPath + ".bak"
            # Check if it is a junction or symlink
            $item = Get-Item $targetPath -ErrorAction SilentlyContinue
            if ($item.Attributes -match "ReparsePoint") {
                # Junction can be deleted using rmdir or Remove-Item directly
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
                    "installedTimestamp" = 1781162744031
                    "pinned" = $false
                    "source" = "gallery"
                    "id" = $extId
                    "publisherId" = "dynamicengineering"
                    "publisherDisplayName" = "DynamicEngineering"
                    "targetPlatform" = "universal"
                    "updated" = $false
                    "private" = $false
                    "isPreReleaseVersion" = $false
                    "hasPreReleaseVersion" = $false
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
