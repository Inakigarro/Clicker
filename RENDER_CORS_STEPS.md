# 🎯 Pasos Visuales para Configurar CORS en Render

## 📍 Paso a Paso con Capturas

### 1. Ir a Render Dashboard
```
https://dashboard.render.com/
```

### 2. Seleccionar tu Servicio
- Busca tu servicio: `zclicker-backend` (o como lo hayas nombrado)
- Haz clic en él

### 3. Ir a la Pestaña "Environment"
```
┌─────────────────────────────────────────┐
│ Dashboard  Settings  Environment  Logs  │ ← Haz clic en "Environment"
└─────────────────────────────────────────┘
```

### 4. Encontrar o Agregar FRONTEND_URL

Verás una lista de variables de entorno:
```
┌──────────────────────────────────────────────┐
│ Environment Variables                         │
│                                               │
│ ┌─────────────┬──────────────────────────┐  │
│ │ Key         │ Value                     │  │
│ ├─────────────┼──────────────────────────┤  │
│ │ NODE_ENV    │ production               │  │
│ │ MONGODB_URI │ mongodb+srv://...        │  │
│ │ FRONTEND_URL│ *                    [×] │  │ ← Esta línea
│ └─────────────┴──────────────────────────┘  │
│                                               │
│ [+ Add Environment Variable]                 │
└──────────────────────────────────────────────┘
```

### 5. Editar FRONTEND_URL

**Opción A: Si YA existe FRONTEND_URL**
1. Haz clic en el valor actual (donde dice `*`)
2. Borra el `*`
3. Escribe: `https://inakigarro.github.io`
4. Presiona Enter o clic fuera

**Opción B: Si NO existe FRONTEND_URL**
1. Haz clic en **"+ Add Environment Variable"**
2. Key: `FRONTEND_URL`
3. Value: `https://inakigarro.github.io`
4. Haz clic en "Add"

### 6. Guardar Cambios

Verás un botón en la parte superior:
```
┌────────────────────────────────────────┐
│ ⚠️ You have unsaved changes            │
│                     [Save Changes]     │ ← Haz clic aquí
└────────────────────────────────────────┘
```

### 7. Esperar Redeploy

Render automáticamente redesplegará:
```
┌────────────────────────────────────────┐
│ 🔄 Deploying...                        │
│                                         │
│ ▶ Installing dependencies...           │
│ ▶ Starting application...              │
│ ✅ Deploy succeeded                    │
└────────────────────────────────────────┘
```

Esto tarda **1-2 minutos**.

---

## ✅ Verificación

### En los Logs de Render:

1. Ve a la pestaña **"Logs"**
2. Busca estas líneas:
```
✅ Connected to MongoDB
🌍 Environment: production
📊 Database: MongoDB Atlas (Cloud)
🔐 CORS configurado para: https://inakigarro.github.io  ← ESTO
🚀 Server listening on port 10000
```

Si ves:
```
🔐 CORS configurado para: *
```
Significa que aún no se aplicó el cambio. Espera un poco más.

---

## 🎮 Probar el Juego

1. Abre tu juego en GitHub Pages
2. Abre la consola del navegador (F12)
3. Deberías ver:
```
🔗 API URL: https://zclicker-backend.onrender.com/api/game (producción)
Usuario identificado: TuNombre abc-123-def
Iniciando sincronización con backend...
Estado guardado en backend: {userId: "...", ...}
```

**Sin errores de CORS!** ✅

---

## 🔧 Comandos Útiles

### Verificar origen del frontend (en consola del navegador):
```javascript
console.log(window.location.origin);
// Debería mostrar: https://inakigarro.github.io
```

### Copiar para Render:
```javascript
copy(window.location.origin);
// Ahora está en tu portapapeles, pégalo en Render
```

---

## 📱 Desde el Móvil/Tableta

Si estás configurando desde un dispositivo móvil:

1. Abre Render en tu navegador móvil
2. Puede que necesites activar "Desktop Site" para ver bien
3. Todos los pasos son iguales

---

## ⏰ Tiempos Aproximados

- Editar variable: **30 segundos**
- Guardar cambios: **5 segundos**
- Redeploy automático: **1-2 minutos**
- Verificar funcionamiento: **30 segundos**

**Total: ~3 minutos** ⚡

---

## 🆘 Si No Encuentras la Pestaña Environment

Asegúrate de estar en:
1. Dashboard de Render
2. Tu servicio específico (no en la lista general)
3. Debería aparecer:
   - Overview
   - Settings
   - **Environment** ← aquí
   - Logs
   - Events
   - Shell

Si no la ves, intenta:
- Refrescar la página
- Verificar que seas owner/admin del servicio

---

¡Eso es todo! Una vez configurado, el CORS quedará resuelto permanentemente. 🎉
