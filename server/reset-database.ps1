# Script PowerShell para resetear la base de datos de ZClicker
# USO: .\reset-database.ps1

param(
    [string]$ApiUrl = "http://localhost:3001/api/game/admin/reset-all"
)

Write-Host "`n🚨 ADVERTENCIA: Este script eliminará TODOS los estados de juego 🚨`n" -ForegroundColor Red
Write-Host "API URL: $ApiUrl`n" -ForegroundColor Yellow

$confirmation = Read-Host "¿Estás seguro de que quieres continuar? (escribe 'SI' para confirmar)"

if ($confirmation -ne "SI") {
    Write-Host "`n❌ Operación cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`n🔄 Reseteando base de datos...`n" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $ApiUrl -Method Delete -ContentType "application/json"
    
    Write-Host "✅ Base de datos reseteada exitosamente!" -ForegroundColor Green
    Write-Host "📊 Documentos eliminados: $($response.deletedCount)" -ForegroundColor Green
    Write-Host "`n💡 Los jugadores verán sus progresos reseteados en la próxima recarga.`n" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Error al resetear la base de datos:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Message -like "*No se puede conectar*") {
        Write-Host "`n💡 Asegúrate de que el servidor backend está corriendo.`n" -ForegroundColor Yellow
    }
}
