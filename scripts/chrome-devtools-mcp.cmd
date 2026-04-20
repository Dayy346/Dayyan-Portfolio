@echo off
setlocal EnableExtensions

set "HELPERS_DIR=%LOCALAPPDATA%\Programs\cursor\resources\app\resources\helpers"
set "PATH=%HELPERS_DIR%;%PATH%"
set "CURSOR_NODE=%HELPERS_DIR%\node.exe"
set "NPX_CLI=%ProgramFiles%\nodejs\node_modules\npm\bin\npx-cli.js"

if not exist "%CURSOR_NODE%" (
  echo chrome-devtools-mcp: Cursor bundled Node not found at "%CURSOR_NODE%" >&2
  echo Install Node.js 22.12 or newer from https://nodejs.org/ >&2
  exit /b 1
)

if not exist "%NPX_CLI%" (
  echo chrome-devtools-mcp: npm npx-cli.js not found at "%NPX_CLI%" >&2
  exit /b 1
)

"%CURSOR_NODE%" "%NPX_CLI%" -y chrome-devtools-mcp@latest --no-usage-statistics %*
