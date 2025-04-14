# PowerShell build script for Windows

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Building the project..." -ForegroundColor Green
npm run build

# Check if dist folder exists
if (-not (Test-Path -Path "./dist" -PathType Container)) {
    Write-Host "Error: Build failed - dist folder not found" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green 