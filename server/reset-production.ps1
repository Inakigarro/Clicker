# Script para resetear la base de datos de PRODUCCIÓN en Render.com
# USO: .\reset-production.ps1

$PRODUCTION_API_URL = "https://zclicker-backend.onrender.com/api/game/admin/reset-all"

Write-Host "`n" -NoNewline
Write-Host "╔═══════════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║                                                   ║" -ForegroundColor Red
Write-Host "║      ⚠️  RESETEO DE PRODUCCIÓN EN RENDER.COM  ⚠️  ║" -ForegroundColor Red
Write-Host "║                                                   ║" -ForegroundColor Red
Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""

Write-Host "🌍 Ambiente: " -NoNewline -ForegroundColor Yellow
Write-Host "PRODUCCIÓN (Render.com)" -ForegroundColor Red
Write-Host "🔗 API URL: " -NoNewline -ForegroundColor Yellow
Write-Host "$PRODUCTION_API_URL`n" -ForegroundColor Cyan

Write-Host "⚠️  ADVERTENCIA: " -ForegroundColor Red -NoNewline
Write-Host "Esto eliminará TODOS los estados de juego de PRODUCCIÓN" -ForegroundColor Yellow
Write-Host "⚠️  ADVERTENCIA: " -ForegroundColor Red -NoNewline
Write-Host "Todos los jugadores perderán su progreso guardado en la nube`n" -ForegroundColor Yellow

$confirmation = Read-Host "¿Estás ABSOLUTAMENTE seguro? Escribe 'RESET PRODUCCION' para confirmar"

if ($confirmation -ne "RESET PRODUCCION") {
    Write-Host "`n❌ Operación cancelada. Se requería escribir exactamente 'RESET PRODUCCION'" -ForegroundColor Yellow
    Write-Host "   Tu respuesta fue: '$confirmation'`n" -ForegroundColor Gray
    exit
}

Write-Host "`n🔄 Conectando a Render.com..." -ForegroundColor Cyan
Write-Host "🔄 Ejecutando reset de base de datos...`n" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $PRODUCTION_API_URL -Method Delete -ContentType "application/json" -TimeoutSec 30
    
    Write-Host "╔═══════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║          ✅ RESET COMPLETADO EXITOSAMENTE         ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════╝`n" -ForegroundColor Green
    
    Write-Host "📊 Documentos eliminados: " -NoNewline -ForegroundColor Yellow
    Write-Host "$($response.deletedCount)" -ForegroundColor Cyan
    
    Write-Host "`n💡 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Los jugadores verán sus progresos reseteados en la próxima recarga" -ForegroundColor White
    Write-Host "   2. Considera incrementar GAME_VERSION en js/version-manager.js" -ForegroundColor White
    Write-Host "   3. Comunica el reset a tus jugadores (Discord, redes sociales, etc.)`n" -ForegroundColor White
    
} catch {
    Write-Host "`n╔═══════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║              ❌ ERROR AL RESETEAR BD              ║" -ForegroundColor Red
    Write-Host "╚═══════════════════════════════════════════════════╝`n" -ForegroundColor Red
    
    Write-Host "Detalles del error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    
    if ($_.Exception.Message -like "*No se puede conectar*" -or $_.Exception.Message -like "*timeout*") {
        Write-Host "`n💡 Posibles causas:" -ForegroundColor Yellow
        Write-Host "   • El servicio de Render.com está inactivo (tarda ~1min en despertar)" -ForegroundColor White
        Write-Host "   • Problemas de conectividad a Internet" -ForegroundColor White
        Write-Host "   • El endpoint no está disponible`n" -ForegroundColor White
        Write-Host "💡 Soluciones:" -ForegroundColor Yellow
        Write-Host "   1. Espera 1-2 minutos y vuelve a intentar" -ForegroundColor White
        Write-Host "   2. Verifica que el backend esté desplegado en Render.com" -ForegroundColor White
        Write-Host "   3. Prueba acceder a: https://zclicker-backend.onrender.com`n" -ForegroundColor White
    }
}
