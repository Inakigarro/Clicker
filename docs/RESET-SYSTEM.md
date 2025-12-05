# Scripts de Reseteo - ZClicker Early Access

## Sistema de Versionado Automático

El juego ahora incluye un sistema de versionado que automáticamente detecta cambios importantes y resetea el progreso de los jugadores.

### Cómo Funciona

1. **Versión Actual**: Se define en `js/version-manager.js`
2. **Detección Automática**: Al cargar el juego, se verifica la versión guardada
3. **Reset Automático**: Si la versión cambió, se limpia localStorage y backend
4. **Notificación**: El jugador ve un mensaje informándole del reset

### Para Implementar un Reset Global

#### Opción 1: Cambiar la Versión del Juego (Recomendado)

Edita `js/version-manager.js`:

```javascript
const GAME_VERSION = '2.0.0'; // Cambia este número
```

**Cuando cambias la versión:**
- ✅ Cada jugador se resetea automáticamente al cargar el juego
- ✅ Se limpia su localStorage
- ✅ Se elimina su estado del backend
- ✅ Solo sucede UNA vez por jugador
- ✅ Se muestra notificación profesional

#### Opción 2: Reset Manual de Base de Datos

Si necesitas limpiar la base de datos sin cambiar la versión del frontend:

**Desarrollo (localhost):**
```bash
cd server
node reset-database.js
```

**Producción (Render.com):**
```bash
# Usando curl
curl -X DELETE https://zclicker-backend.onrender.com/api/game/admin/reset-all

# O usando el script con variable de entorno
API_URL=https://zclicker-backend.onrender.com/api/game/admin/reset-all node reset-database.js
```

### Ejemplos de Uso

#### Caso 1: Rebalanceo Completo del Juego
```javascript
// js/version-manager.js
const GAME_VERSION = '2.0.0'; // Era 1.0.0
```
→ Todos los jugadores se resetean automáticamente

#### Caso 2: Solo Limpiar Backend (sin cambiar frontend)
```bash
node server/reset-database.js
```
→ Base de datos limpia, pero localStorage de jugadores intacto

#### Caso 3: Nueva Feature que Requiere Reset
```javascript
// js/version-manager.js
const GAME_VERSION = '2.1.0'; // Sistema de prestigio añadido
```
→ Reset automático + notificación con número de versión

### Endpoints del Backend

- `DELETE /api/game/:userId` - Elimina estado de un usuario específico
- `DELETE /api/game/admin/reset-all` - Elimina TODOS los estados (admin)

### Historial de Versiones

- **v1.0.0**: Versión inicial del juego
- **v2.0.0**: Rebalanceo completo + Sistema de prestigio + Jefes

### Notas Importantes

⚠️ **Early Access**: Este sistema es temporal para la fase early access.

⚠️ **Protección**: En producción, considera proteger `/admin/reset-all` con autenticación.

⚠️ **Irreversible**: Los resets eliminan datos permanentemente.

💡 **Best Practice**: Incrementa la versión en cada actualización mayor que rompa compatibilidad.
