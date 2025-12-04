# 🧪 Pruebas de Integración Backend

## ✅ Verificación Paso a Paso

### 1. Backend Corriendo
- [x] MongoDB instalado y corriendo
- [x] Servidor backend en puerto 3001
- [x] Conexión a base de datos `clicker` establecida

### 2. Probar el Frontend

#### Opción A: Abrir directamente
1. Abre `index.html` en Chrome/Edge (navegadores modernos)
2. Abre la consola del navegador (F12)

#### Opción B: Con servidor HTTP (recomendado para evitar CORS)
```powershell
# En una terminal nueva
cd c:\ZStudio\Gaming\Clicker
python -m http.server 8000
# Luego abre: http://localhost:8000
```

### 3. Verificar en la Consola del Navegador

Deberías ver estos mensajes al cargar:

```
Usuario identificado: [TuNombre] [uuid-del-usuario]
Iniciando sincronización con backend...
No se encontró estado guardado en el servidor para este usuario
No hay estado en backend, guardando estado actual...
Estado guardado en backend: {userId: "...", userName: "...", points: 0, ...}
```

O si ya tienes datos guardados:

```
Usuario identificado: [TuNombre] [uuid-del-usuario]
Iniciando sincronización con backend...
Estado cargado desde backend: {userId: "...", userName: "...", points: 1234, ...}
Aplicando estado desde backend
```

### 4. Jugar y Verificar Guardado

1. **Haz algunos clicks** → Espera 2 segundos
   - Deberías ver en consola: `Estado guardado en backend: {...}`

2. **Compra una mejora** → Espera 2 segundos
   - Nuevamente: `Estado guardado en backend: {...}`

3. **Invierte en objetivos**
   - También se guarda automáticamente

### 5. Verificar en MongoDB

Abre una terminal y ejecuta:

```powershell
mongosh
```

Luego:

```javascript
// Cambiar a la base de datos
use clicker

// Ver todos los usuarios guardados
db.gamestates.find().pretty()

// Ver un usuario específico
db.gamestates.findOne({userName: "TuNombre"})

// Ver cuántos usuarios hay
db.gamestates.countDocuments()
```

Deberías ver algo como:

```javascript
{
  _id: ObjectId("..."),
  userId: "tu-uuid-aquí",
  userName: "TuNombre",
  points: 150,
  autoClick: {
    speedLevel: 2,
    powerLevel: 1,
    intervalMs: 980
  },
  autoInvest: {
    level: 0,
    cost: 1000,
    intervalMs: 30000
  },
  objective: {
    level: 1,
    progress: 20
  },
  createdAt: ISODate("2025-12-04T..."),
  updatedAt: ISODate("2025-12-04T...")
}
```

### 6. Probar Persistencia

1. **Juega un rato** y acumula puntos/mejoras
2. **Cierra el navegador** completamente
3. **Abre nuevamente** `index.html`
4. **Verifica** que tu progreso se haya cargado

En la consola deberías ver:
```
Estado cargado desde backend: {points: [tus puntos], ...}
Aplicando estado desde backend
```

Y tu contador de puntos debería mostrar el valor guardado.

### 7. Probar Multi-Dispositivo (Opcional)

Si quieres probar sincronización entre dispositivos:

1. Anota tu `userId` de la consola
2. En otro navegador/dispositivo, abre la consola
3. Ejecuta antes de cargar:
   ```javascript
   localStorage.setItem('clickerUserId', 'tu-uuid-aqui');
   localStorage.setItem('clickerUserName', 'TuNombre');
   ```
4. Recarga la página
5. Debería cargar el mismo progreso

## 🐛 Problemas Comunes

### "Failed to fetch" en consola
**Causa**: Backend no está corriendo o hay problema de CORS

**Solución**:
```powershell
# Verifica que el backend esté corriendo
cd c:\ZStudio\Gaming\Clicker\server
npm start
```

### "MongoServerError: E11000 duplicate key error"
**Causa**: Intentas crear dos usuarios con el mismo userName

**Solución**:
```javascript
// En mongosh, borra el usuario duplicado
use clicker
db.gamestates.deleteOne({userName: "NombreDuplicado"})

// O borra toda la colección y empieza de nuevo
db.gamestates.deleteMany({})
```

### No se guarda automáticamente
**Verifica en consola del navegador**:
1. ¿Hay errores?
2. ¿Ves mensajes de "Estado guardado en backend"?
3. Verifica que `scheduleSaveToBackend` esté definida:
   ```javascript
   typeof scheduleSaveToBackend
   // Debería retornar: "function"
   ```

### LocalStorage vs Backend diferentes
Si tienes datos antiguos en localStorage que difieren del backend:

**Opción 1**: Limpiar localStorage y usar solo backend
```javascript
localStorage.clear();
location.reload();
```

**Opción 2**: Forzar guardado de localStorage a backend
```javascript
// En consola del navegador
scheduleSaveToBackend();
```

## 📊 Logs del Backend

En la terminal donde corre el servidor deberías ver:

```
✅ Connected to MongoDB
🚀 Server listening on port 3001
📡 API disponible en: http://localhost:3001/api/game
```

Y cuando el frontend haga peticiones:
- GET requests al cargar el juego
- PUT requests al guardar cambios

## 🎯 Checklist Final

- [ ] Backend conectado a MongoDB
- [ ] Frontend abre sin errores
- [ ] Usuario se identifica correctamente
- [ ] Sincronización inicial funciona (carga o crea estado)
- [ ] Clicks se guardan automáticamente
- [ ] Mejoras se guardan al comprar
- [ ] Objetivos se guardan al invertir
- [ ] Guardado periódico cada 30s funciona
- [ ] Datos visibles en MongoDB
- [ ] Persistencia entre sesiones funciona
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en terminal del servidor

## 🚀 Todo Funcionando?

Si todo está ✅, tu juego ahora:
- 💾 Guarda automáticamente en MongoDB
- 🔄 Sincroniza cada 30 segundos
- 🌐 Está listo para multi-dispositivo
- 📈 Registra timestamps de creación/actualización
- 🎮 Mantiene localStorage como caché local

**Próximos pasos sugeridos**:
1. Indicador visual de estado de conexión
2. Manejo de conflictos offline/online
3. Deploy del backend (Render, Railway, Heroku)
4. Ranking de jugadores
5. Sistema de logros guardados en servidor
