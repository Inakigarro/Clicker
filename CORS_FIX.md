# 🔧 Solución CORS para GitHub Pages + Render

## 🚨 Problema

```
Access to fetch at 'https://tu-backend.onrender.com/api/game/...' 
from origin 'https://tu-usuario.github.io' has been blocked by CORS policy
```

## ✅ Solución Rápida

### Paso 1: Obtener URL de GitHub Pages

Tu frontend está desplegado en una URL como:
```
https://inakigarro.github.io/Clicker
```

### Paso 2: Configurar Variable en Render

1. Ve a tu dashboard de **Render.com**
2. Haz clic en tu servicio `zclicker-backend`
3. Ve a la pestaña **"Environment"**
4. Busca la variable `FRONTEND_URL`
5. Edita el valor y reemplaza `*` con tu URL de GitHub Pages:

   ```
   FRONTEND_URL=https://inakigarro.github.io
   ```

   **⚠️ IMPORTANTE**: 
   - NO incluyas `/Clicker` al final
   - NO incluyas barra final `/`
   - Solo el dominio base

6. Haz clic en **"Save Changes"**
7. Render redesplegará automáticamente (tarda 1-2 minutos)

### Paso 3: Verificar

Una vez redesplegado:
1. Abre tu juego en GitHub Pages
2. Abre la consola del navegador (F12)
3. Deberías ver:
   ```
   🔗 API URL: https://tu-backend.onrender.com/api/game (producción)
   Estado guardado en backend: {...}
   ```

---

## 🎯 Configuración Avanzada (Múltiples Dominios)

Si quieres permitir acceso desde múltiples dominios (ej: GitHub Pages + localhost para testing):

En Render, configura `FRONTEND_URL` con URLs separadas por coma:

```
FRONTEND_URL=https://inakigarro.github.io,http://localhost:8000,http://127.0.0.1:8000
```

Esto permitirá:
- ✅ GitHub Pages
- ✅ Localhost en desarrollo
- ✅ 127.0.0.1

---

## 🔍 Verificar Configuración Actual

### En el backend (Render Logs):

Busca en los logs esta línea:
```
🔐 CORS configurado para: https://inakigarro.github.io
```

Si ves:
```
🔐 CORS configurado para: *
```
Significa que aún no configuraste `FRONTEND_URL`.

---

## 🐛 Troubleshooting

### "Still getting CORS error"

1. **Verifica que guardaste los cambios en Render**
   - Debe aparecer un banner verde "Environment updated"
   - Debe reiniciarse el servicio

2. **Espera a que termine el redeploy**
   - En Render → Events, verás "Deploy succeeded"
   - Puede tardar 1-2 minutos

3. **Limpia caché del navegador**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

4. **Verifica la URL exacta**
   - En consola del navegador, ejecuta:
     ```javascript
     window.location.origin
     ```
   - Copia ese valor exacto a `FRONTEND_URL` en Render

### "Error: Not allowed by CORS"

Significa que la URL del frontend NO coincide con `FRONTEND_URL`.

**Solución**:
- Verifica que `FRONTEND_URL` sea exactamente `window.location.origin`
- Sin espacios extra, sin barras finales

### "Preflight request doesn't pass"

El backend ahora maneja correctamente las peticiones OPTIONS.

Si persiste:
1. Verifica que el backend tenga las últimas actualizaciones
2. Redespliega manualmente en Render

---

## 📝 Configuraciones Comunes

### GitHub Pages (Usuario):
```
FRONTEND_URL=https://inakigarro.github.io
```

### GitHub Pages (Proyecto):
```
FRONTEND_URL=https://inakigarro.github.io
```
(Es igual, NO incluir `/Clicker`)

### Netlify:
```
FRONTEND_URL=https://tu-app.netlify.app
```

### Vercel:
```
FRONTEND_URL=https://tu-app.vercel.app
```

### Desarrollo + Producción:
```
FRONTEND_URL=https://inakigarro.github.io,http://localhost:8000
```

---

## ✅ Checklist

Después de configurar, verifica:

- [ ] Variable `FRONTEND_URL` configurada en Render
- [ ] Render redesplegó correctamente (sin errores)
- [ ] Logs muestran: `🔐 CORS configurado para: tu-dominio`
- [ ] Frontend carga sin errores de CORS
- [ ] Consola muestra: `Estado guardado en backend`
- [ ] Datos se persisten en MongoDB Atlas

---

## 🎯 Resultado Final

```
Usuario → GitHub Pages (https://inakigarro.github.io/Clicker)
              ↓
         API Request
              ↓
       Render Backend (CORS: permitido ✅)
              ↓
         MongoDB Atlas
              ↓
         Respuesta OK ✅
```

---

## 🚀 Comandos Rápidos

### Ver origen actual del frontend:
```javascript
// En consola del navegador
console.log(window.location.origin);
```

### Probar API directamente:
```
https://tu-backend.onrender.com/
```
Debería retornar:
```json
{"status":"ok","message":"Clicker backend is running"}
```

### Ver logs de Render:
```
Dashboard → Tu servicio → Logs (pestaña superior)
```

---

**¡Una vez configurado `FRONTEND_URL`, todo funcionará!** 🎉
