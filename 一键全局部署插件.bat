@echo off
chcp 65001 > nul
title YC Portal SCL Viewer 一键部署工具

echo ===================================================
echo   YC Portal SCL Viewer 插件一键全局部署工具
echo ===================================================
echo.
echo 正在检测并配置插件，请稍候...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"

echo.
echo ===================================================
echo 部署完成！请根据上方提示重启或重载编辑器。
echo.
pause
