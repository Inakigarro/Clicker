# 🔄 Guía Rápida: Sistema de Reset para Early Access

## ¿Cuándo Usar el Sistema de Reset?

Usa el sistema de reset cuando hagas cambios que rompan compatibilidad:
- ✅ Rebalanceo completo de costos/mecánicas
- ✅ Nuevos sistemas que requieren estado limpio
- ✅ Cambios en estructura de datos guardados
- ✅ Actualización mayor de versión

---

## Método 1: Reset Automático por Versión (RECOMENDADO)

### ✨ Ventajas
- ✅ Cada jugador se resetea automáticamente UNA sola vez
- ✅ Notificación profesional al usuario
- ✅ No requiere intervención manual
- ✅ Frontend y backend sincronizados

### 📝 Pasos

1. **Edita `js/version-manager.js`:**
```javascript
const GAME_VERSION = '2.1.0'; // Incrementa el número
```

2. **Haz commit y push:**
```bash
git add js/version-manager.js
git commit -m "chore: bump version to 2.1.0 - reset automático"
git push origin refactor/rebalanceo-costos-niveles
```

3. **Deploy a producción:**
- Frontend: GitHub Pages se actualiza automáticamente
- Backend: Render.com se actualiza desde GitHub

4. **¡Listo!**
- Los jugadores verán mensaje de actualización
- Su progreso se resetea automáticamente
- Solo sucede una vez por usuario

---

## Método 2: Reset Manual de Base de Datos

Usa esto si solo necesitas limpiar el backend sin cambiar frontend.

### Desarrollo (localhost):

**PowerShell:**
```powershell
cd server
.\reset-database.ps1
```

**Node.js:**
```bash
cd server
node reset-database.js
```

**Panel Admin:**
1. Abre: `http://localhost:5500/admin.html`
2. Selecciona "Desarrollo (localhost:3001)"
3. Click en "Resetear Base de Datos"
4. Confirma la acción

### Producción (Render.com):

**Opción 1: Script PowerShell (Recomendado)**
```powershell
cd server
.\reset-production.ps1
```
Este script incluye confirmaciones de seguridad y maneja errores comunes.

**Opción 2: Panel Admin Web**
1. Abre: `admin.html` en tu navegador
2. Selecciona "Producción (Render.com)" en el dropdown
3. Click en "Resetear Base de Datos"
4. Confirma la acción

**Opción 3: curl/Invoke-RestMethod**
```powershell
# PowerShell
Invoke-RestMethod -Uri "https://zclicker-backend.onrender.com/api/game/admin/reset-all" -Method Delete

# O curl
curl -X DELETE https://zclicker-backend.onrender.com/api/game/admin/reset-all
```

⚠️ **Nota**: El servicio de Render.com puede tardar ~1 minuto en despertar si está inactivo.

---

## Método 3: Endpoint Directo

### Desarrollo:
```bash
curl -X DELETE http://localhost:3001/api/game/admin/reset-all
```

### Producción:
```bash
curl -X DELETE https://zclicker-backend.onrender.com/api/game/admin/reset-all
```

---

## 🎯 Ejemplo Práctico: Implementar Nueva Feature

Escenario: Añadiste sistema de "Talentos" que requiere nuevo estado.

### Paso a Paso:

1. **Implementa la feature en código**
```bash
# Desarrolla tu sistema de talentos
git add .
git commit -m "feat: add talent system"
```

2. **Incrementa la versión**
```javascript
// js/version-manager.js
const GAME_VERSION = '2.1.0'; // Era 2.0.0
```

3. **Commit y deploy**
```bash
git add js/version-manager.js
git commit -m "chore: bump version for talent system"
git push
```

4. **Verifica en Panel Admin**
- Abre `admin.html`
- Click "Verificar Versión"
- Debe mostrar "2.1.0"

5. **Comportamiento esperado:**
- Usuario carga el juego
- Ve notificación: "Actualización v2.1.0"
- Su progreso se resetea
- Juego se recarga automáticamente
- Todo funciona con estado limpio

---

## ⚠️ Advertencias

### NO Uses Reset Si:
- ❌ El cambio es solo visual (CSS)
- ❌ Es un bugfix sin cambio de datos
- ❌ Añades feature opcional que no rompe compatibilidad

### SÍ Usa Reset Si:
- ✅ Cambias estructura de localStorage
- ✅ Modificas esquema de MongoDB
- ✅ Rebalanceas economía del juego
- ✅ El estado anterior causaría bugs

---

## 📊 Verificación Post-Reset

### Checklist:
- [ ] Panel Admin muestra versión correcta
- [ ] LocalStorage del navegador está limpio (F12 > Application > Local Storage)
- [ ] Backend no tiene estados antiguos (usa Panel Admin)
- [ ] Nuevo juego inicia desde 0
- [ ] Todas las features funcionan correctamente

### Comandos de Verificación:

```bash
# Ver versión en archivo
grep "GAME_VERSION" js/version-manager.js

# Verificar backend (debe estar corriendo)
curl http://localhost:3001/api/game/admin/reset-all

# Ver logs del servidor
cd server
npm start
```

---

## 🔐 Seguridad en Producción

Para producción, considera proteger el endpoint `/admin/reset-all`:

```javascript
// server/gameRoutes.js
router.delete('/admin/reset-all', requireAdminAuth, async (req, res) => {
  // ... código de reset
});
```

Opciones de autenticación:
- API Key en headers
- JWT token
- IP whitelist
- Variable de entorno secreta

---

## 📝 Historial de Versiones

Mantén registro de cambios importantes:

| Versión | Fecha | Cambios | Reset? |
|---------|-------|---------|--------|
| 1.0.0 | 01/12/2025 | Lanzamiento inicial | No |
| 2.0.0 | 04/12/2025 | Rebalanceo + Prestigio + Jefes | ✅ Sí |
| 2.1.0 | 05/12/2025 | Sistema de reset automático | No |

---

## 🆘 Troubleshooting

### "Version no se detecta"
- Verifica que `version-manager.js` se carga ANTES que otros scripts
- Revisa consola del navegador (F12)

### "Backend no resetea"
- Verifica que servidor está corriendo: `npm start`
- Prueba endpoint manualmente con curl
- Revisa logs del servidor

### "Jugadores reportan que no se resetea"
- Verifica que hicieron hard refresh (Ctrl+F5)
- Limpia caché del navegador
- Verifica que la versión en `version-manager.js` cambió

---

## 📚 Referencias

- **Documentación completa**: `docs/RESET-SYSTEM.md`
- **Panel Admin**: `admin.html`
- **Script PowerShell**: `server/reset-database.ps1`
- **Script Node.js**: `server/reset-database.js`
- **Código fuente**: `js/version-manager.js`

---

**💡 Tip**: Durante early access, comunica resets con anticipación a tus jugadores vía Discord/redes sociales.
