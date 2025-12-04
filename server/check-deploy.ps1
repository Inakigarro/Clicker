# Script de verificación pre-despliegue

Write-Host "🔍 Verificando configuración para despliegue..." -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Verificar que estamos en el directorio server
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecuta este script desde la carpeta server/" -ForegroundColor Red
    exit 1
}

# 1. Verificar archivos necesarios
Write-Host "📁 Verificando archivos necesarios..." -ForegroundColor Yellow

$requiredFiles = @(
    "index.js",
    "gameModel.js", 
    "gameRoutes.js",
    "package.json",
    ".env.production",
    "Procfile",
    "vercel.json",
    ".gitignore"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (falta)" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""

# 2. Verificar package.json
Write-Host "📦 Verificando package.json..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" | ConvertFrom-Json

if ($packageJson.engines) {
    Write-Host "  ✅ engines definido" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  engines no definido (recomendado para Heroku/Railway)" -ForegroundColor Yellow
}

if ($packageJson.scripts.start) {
    Write-Host "  ✅ script 'start' definido: $($packageJson.scripts.start)" -ForegroundColor Green
} else {
    Write-Host "  ❌ script 'start' falta" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# 3. Verificar dependencias
Write-Host "📚 Verificando dependencias..." -ForegroundColor Yellow

$requiredDeps = @("express", "mongoose", "cors", "dotenv")

foreach ($dep in $requiredDeps) {
    if ($packageJson.dependencies.$dep) {
        Write-Host "  ✅ $dep" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $dep (falta)" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""

# 4. Verificar .env.production
Write-Host "🔐 Verificando configuración de producción..." -ForegroundColor Yellow

if (Test-Path ".env.production") {
    $envContent = Get-Content ".env.production" -Raw
    
    if ($envContent -match "NODE_ENV=production") {
        Write-Host "  ✅ NODE_ENV configurado" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NODE_ENV no está en production" -ForegroundColor Yellow
    }
    
    if ($envContent -match "MONGODB_URI=mongodb\+srv://") {
        Write-Host "  ✅ MONGODB_URI usa Atlas (mongodb+srv://)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  MONGODB_URI no usa Atlas (debes configurarlo)" -ForegroundColor Yellow
        Write-Host "     Obtén tu URL en: https://cloud.mongodb.com/" -ForegroundColor Gray
    }
    
    if ($envContent -match "tu-usuario" -or $envContent -match "tu-password") {
        Write-Host "  ❌ MONGODB_URI tiene valores de ejemplo" -ForegroundColor Red
        Write-Host "     Debes reemplazar con tus credenciales reales de Atlas" -ForegroundColor Gray
        $allGood = $false
    }
} else {
    Write-Host "  ❌ .env.production no existe" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# 5. Verificar .gitignore
Write-Host "🔒 Verificando .gitignore..." -ForegroundColor Yellow

if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    
    if ($gitignoreContent -match "\.env") {
        Write-Host "  ✅ .env está en .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  .env NO está en .gitignore (peligro de seguridad)" -ForegroundColor Yellow
    }
    
    if ($gitignoreContent -match "node_modules") {
        Write-Host "  ✅ node_modules está en .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  node_modules NO está en .gitignore" -ForegroundColor Yellow
    }
}

Write-Host ""

# 6. Verificar que .env no esté en Git
Write-Host "🔍 Verificando archivos en Git..." -ForegroundColor Yellow

if (Test-Path ".git") {
    $trackedFiles = git ls-files
    
    if ($trackedFiles -contains ".env") {
        Write-Host "  ⚠️  .env está siendo trackeado por Git" -ForegroundColor Red
        Write-Host "     Ejecuta: git rm --cached .env" -ForegroundColor Gray
        $allGood = $false
    } else {
        Write-Host "  ✅ .env NO está en Git" -ForegroundColor Green
    }
}

Write-Host ""

# 7. Resumen
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($allGood) {
    Write-Host ""
    Write-Host "✅ Todo listo para desplegar!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Crea tu cluster en MongoDB Atlas" -ForegroundColor White
    Write-Host "     https://www.mongodb.com/cloud/atlas" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Copia tu connection string de Atlas" -ForegroundColor White
    Write-Host ""
    Write-Host "  3. Elige un hosting:" -ForegroundColor White
    Write-Host "     • Render.com (recomendado)" -ForegroundColor Gray
    Write-Host "     • Railway.app" -ForegroundColor Gray
    Write-Host "     • Vercel.com" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  4. Configura las variables de entorno:" -ForegroundColor White
    Write-Host "     NODE_ENV=production" -ForegroundColor Gray
    Write-Host "     MONGODB_URI=<tu-url-de-atlas>" -ForegroundColor Gray
    Write-Host "     FRONTEND_URL=*" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 Lee DEPLOYMENT.md para instrucciones detalladas" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Hay algunos problemas que debes corregir antes de desplegar" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Revisa los errores marcados con ❌ arriba" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
