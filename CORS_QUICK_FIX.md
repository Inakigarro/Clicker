# ⚡ SOLUCIÓN RÁPIDA CORS

## 🎯 El Problema
```
❌ CORS error al cargar desde GitHub Pages
```

## ✅ La Solución (3 minutos)

### 1️⃣ Ve a Render Dashboard
```
https://dashboard.render.com/
```

### 2️⃣ Abre tu Servicio
`zclicker-backend` (o como lo hayas nombrado)

### 3️⃣ Pestaña "Environment"
Busca en el menú superior

### 4️⃣ Edita FRONTEND_URL
- **Actual**: `*`
- **Nuevo**: `https://inakigarro.github.io`

⚠️ **SIN barra final**, solo el dominio base

### 5️⃣ Save Changes
Botón en la parte superior

### 6️⃣ Espera 1-2 minutos
Render redesplegará automáticamente

### 7️⃣ Verifica
Abre tu juego, revisa la consola (F12):
```
✅ Estado guardado en backend: {...}
```

---

## 🔍 ¿Cuál es tu URL de GitHub Pages?

En la consola del navegador:
```javascript
console.log(window.location.origin);
```

Copia ese valor **exacto** a `FRONTEND_URL` en Render.

---

## 📚 Más Detalles

- `CORS_FIX.md` - Solución completa
- `RENDER_CORS_STEPS.md` - Pasos visuales detallados

---

**¡Eso es todo!** Una vez configurado, el CORS quedará resuelto permanentemente. 🚀
