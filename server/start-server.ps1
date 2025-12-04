# Script de inicio del servidor ZClicker

Write-Host "🎮 Iniciando servidor ZClicker..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecuta este script desde la carpeta server/" -ForegroundColor Red
    exit 1
}

# Verificar que existe .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Advertencia: No se encontró archivo .env" -ForegroundColor Yellow
    Write-Host "Creando .env con configuración por defecto..." -ForegroundColor Yellow
    @"
PORT=3001
MONGODB_URI=mongodb://localhost:27017/clicker
"@ | Out-File -FilePath ".env" -Encoding utf8
}

# Mostrar configuración
Write-Host ""
Write-Host "📋 Configuración:" -ForegroundColor Green
Write-Host "   Puerto: 3001"
Write-Host "   MongoDB: mongodb://localhost:27017/clicker"
Write-Host ""

# Verificar si MongoDB está corriendo (opcional)
Write-Host "🔍 Verificando MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB está corriendo" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB no parece estar corriendo" -ForegroundColor Yellow
        Write-Host "   Si no tienes MongoDB instalado, descárgalo de: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        Write-Host "   O usa MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  No se pudo verificar MongoDB" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Cyan
Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

# Iniciar servidor
npm start
