@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mvn-local.ps1" %*
exit /b %ERRORLEVEL%
