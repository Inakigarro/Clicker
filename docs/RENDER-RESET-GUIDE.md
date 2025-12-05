# 🌐 Gestión de Base de Datos en Render.com

## 🎯 Resetear Base de Datos en Producción

### Opción 1: Script PowerShell (Más Seguro) ✅

```powershell
cd server
.\reset-production.ps1
```

**Características:**
- ✅ Confirmación de seguridad (debes escribir "RESET PRODUCCION")
- ✅ Mensajes claros y coloridos
- ✅ Manejo de errores (timeout, conexión, etc.)
- ✅ Instrucciones post-reset

**Salida esperada:**
```
╔═══════════════════════════════════════════════════╗
║     ⚠️  RESETEO DE PRODUCCIÓN EN RENDER.COM  ⚠️  ║
╚═══════════════════════════════════════════════════╝

🌍 Ambiente: PRODUCCIÓN (Render.com)
🔗 API URL: https://zclicker-backend.onrender.com/api/game/admin/reset-all

⚠️  ADVERTENCIA: Esto eliminará TODOS los estados de juego de PRODUCCIÓN
⚠️  ADVERTENCIA: Todos los jugadores perderán su progreso guardado en la nube

¿Estás ABSOLUTAMENTE seguro? Escribe 'RESET PRODUCCION' para confirmar:
```

---

### Opción 2: Panel Admin Web

1. **Abre admin.html en tu navegador:**
   ```
   http://localhost:5500/admin.html
   ```

2. **Cambia el ambiente:**
   - En el dropdown "Ambiente", selecciona: **"Producción (Render.com)"**
   - Verifica que la URL muestra: `https://zclicker-backend.onrender.com/api/game`

3. **Ejecuta el reset:**
   - Click en el botón rojo "🗑️ Resetear Base de Datos"
   - Confirma en el diálogo que aparece
   - Espera la confirmación

---

### Opción 3: Comando Directo

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://zclicker-backend.onrender.com/api/game/admin/reset-all" -Method Delete
```

**Bash/curl:**
```bash
curl -X DELETE https://zclicker-backend.onrender.com/api/game/admin/reset-all
```

**Respuesta esperada:**
```json
{
  "message": "All game states deleted successfully",
  "deletedCount": 15
}
```

---

## ⏱️ Tiempo de Respuesta de Render.com

**Servicio Activo:** < 1 segundo
**Servicio Inactivo (free tier):** ~30-90 segundos

Si obtienes timeout, espera 1-2 minutos y reintenta. El servicio gratuito de Render.com se duerme después de 15 minutos de inactividad.

---

## 🔍 Verificar Estado del Servicio

### 1. Verificar que el backend está activo:

```powershell
# Test simple
curl https://zclicker-backend.onrender.com

# O con PowerShell
Invoke-WebRequest -Uri "https://zclicker-backend.onrender.com" -Method Get
```

### 2. Dashboard de Render.com:

1. Abre: https://dashboard.render.com
2. Login con tu cuenta
3. Busca tu servicio "zclicker-backend"
4. Verifica que el estado sea: **"Live"** (verde)

### 3. Ver logs en tiempo real:

```bash
# En el dashboard de Render.com:
Services → zclicker-backend → Logs
```

---

## 🚨 Troubleshooting

### Error: "No se puede conectar al servidor remoto"

**Causa:** El servicio está dormido (free tier de Render.com)

**Solución:**
1. Abre https://zclicker-backend.onrender.com en el navegador
2. Espera 30-60 segundos a que despierte
3. Vuelve a intentar el reset

### Error: "Request timeout"

**Causa:** Conexión lenta o servicio iniciando

**Solución:**
```powershell
# Aumentar timeout
Invoke-RestMethod -Uri "https://zclicker-backend.onrender.com/api/game/admin/reset-all" -Method Delete -TimeoutSec 60
```

### Error: "404 Not Found"

**Causa:** El endpoint no existe o la URL es incorrecta

**Solución:**
1. Verifica la URL: `https://zclicker-backend.onrender.com/api/game/admin/reset-all`
2. Asegúrate de que el backend está desplegado con el código actualizado
3. Revisa los logs de Render.com

### Error: "500 Internal Server Error"

**Causa:** Error en el servidor

**Solución:**
1. Revisa los logs en el dashboard de Render.com
2. Verifica que MongoDB Atlas está conectado
3. Revisa variables de entorno en Render.com

---

## 🔐 Seguridad

### ⚠️ Proteger en Producción

Actualmente, el endpoint `/admin/reset-all` está sin autenticación, apropiado para early access.

**Para versión final, considera:**

```javascript
// server/gameRoutes.js
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

router.delete('/admin/reset-all', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  next();
}, async (req, res) => {
  // ... código de reset
});
```

**Uso con API Key:**
```powershell
$headers = @{ "x-api-key" = "tu-api-key-secreta" }
Invoke-RestMethod -Uri "https://zclicker-backend.onrender.com/api/game/admin/reset-all" -Method Delete -Headers $headers
```

---

## 📊 Monitoreo Post-Reset

### Verificar que el reset fue exitoso:

1. **Revisa el contador de documentos eliminados** en la respuesta del API
2. **Prueba crear un nuevo juego** desde el frontend
3. **Verifica en MongoDB Atlas:**
   - Login: https://cloud.mongodb.com
   - Collections → zclicker → gameStates
   - Debe mostrar 0 documentos

---

## 🔄 Workflow Completo para Actualización Mayor

```mermaid
1. Desarrollo Local
   ↓
2. Incrementar GAME_VERSION (js/version-manager.js)
   ↓
3. Commit y Push a GitHub
   ↓
4. Render.com auto-deploys
   ↓
5. Ejecutar reset de producción:
   .\reset-production.ps1
   ↓
6. Verificar en MongoDB Atlas
   ↓
7. Probar desde frontend en producción
   ↓
8. Comunicar a jugadores
```

---

## 📝 Checklist Pre-Reset

Antes de resetear producción, verifica:

- [ ] ¿Ya incrementaste `GAME_VERSION` en `js/version-manager.js`?
- [ ] ¿Hiciste deploy del frontend a GitHub Pages?
- [ ] ¿Render.com tiene la última versión del backend?
- [ ] ¿Comunicaste el reset a los jugadores?
- [ ] ¿Tienes backup de la BD? (opcional, pero recomendado)

---

## 💾 Crear Backup (Opcional)

Antes de resetear, puedes exportar datos de MongoDB Atlas:

1. MongoDB Atlas → Clusters
2. Click en "..." → "Load Sample Data" → "Export"
3. O usa mongodump:

```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/zclicker" --out=./backup
```

**Restaurar:**
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/zclicker" ./backup/zclicker
```

---

## 🎯 Resumen Rápido

| Acción | Comando |
|--------|---------|
| Reset Producción (seguro) | `.\reset-production.ps1` |
| Reset Producción (directo) | `curl -X DELETE https://zclicker-backend.onrender.com/api/game/admin/reset-all` |
| Verificar servicio | `curl https://zclicker-backend.onrender.com` |
| Ver logs | Dashboard Render.com → Logs |
| Panel Admin | `admin.html` → Seleccionar "Producción" |

---

**⚡ Tip:** Guarda el script `reset-production.ps1` para futuros resets durante early access.

