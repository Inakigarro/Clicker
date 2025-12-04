# 🚀 Quick Start: Desarrollo Local vs Producción

## 💻 Desarrollo Local (AHORA)

### Backend:
```powershell
cd server
npm start
```
✅ Usa automáticamente: `mongodb://localhost:27017/clicker`

### Frontend:
Abre `index.html` en el navegador
✅ Usa automáticamente: `http://localhost:3001/api/game`

**Todo funciona sin configuración adicional!** 🎉

---

## 🌐 Despliegue a Producción (CUANDO QUIERAS)

### Paso 1: MongoDB Atlas (5 min)
1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea cluster gratuito M0
3. Crea usuario: `clicker-admin` / `[contraseña segura]`
4. Network Access: Permitir `0.0.0.0/0`
5. Copia connection string:
   ```
   mongodb+srv://clicker-admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/clicker?retryWrites=true&w=majority
   ```

### Paso 2: Verificar (30 seg)
```powershell
cd server
.\check-deploy.ps1
```

### Paso 3: Desplegar Backend en Render (10 min)
1. Ve a https://render.com → Sign Up
2. New Web Service → GitHub repo
3. Configuración:
   - Name: `zclicker-backend`
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
4. Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=[tu URL de Atlas copiada arriba]
   FRONTEND_URL=*
   ```
5. Create Web Service → Espera 2-5 min

### Paso 4: Actualizar Frontend (1 min)
Edita `js/api-client.js` línea 10:
```javascript
const PRODUCTION_API_URL = 'https://zclicker-backend.onrender.com/api/game';
```
(Reemplaza con tu URL de Render)

### Paso 5: Desplegar Frontend (5 min)

#### Opción A - GitHub Pages (Gratis):
```powershell
git add .
git commit -m "Deploy"
git push origin main
```
Luego: Settings → Pages → Source: main → Save

#### Opción B - Netlify (Drag & Drop):
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta del proyecto
3. ¡Listo!

---

## 🎯 URLs Finales

Después del despliegue tendrás:

- **Frontend**: `https://tu-usuario.github.io/Clicker` o `https://tu-app.netlify.app`
- **Backend**: `https://zclicker-backend.onrender.com`
- **MongoDB**: Atlas Cloud (managed)

---

## 📚 Documentación Completa

- `DEPLOYMENT.md` - Guía detallada con 4 opciones de hosting
- `MULTI_ENV_SETUP.md` - Explicación técnica completa
- `TESTING.md` - Cómo probar que todo funciona
- `USER_TRANSFER.md` - Exportar/importar usuario
- `BACKEND_SETUP.md` - Setup inicial de backend

---

## ✅ Checklist Rápido

### Desarrollo Local:
- [x] Backend detecta ambiente automáticamente
- [x] Frontend detecta ambiente automáticamente
- [x] MongoDB local configurado
- [x] Todo funciona sin configuración

### Para Desplegar:
- [ ] Crear cluster MongoDB Atlas
- [ ] Ejecutar `.\check-deploy.ps1`
- [ ] Desplegar backend en Render
- [ ] Actualizar URL en `api-client.js`
- [ ] Desplegar frontend en GitHub Pages/Netlify
- [ ] Probar flujo completo

---

## 🐛 Si Algo No Funciona

### En desarrollo:
- Backend no conecta: ¿MongoDB local está corriendo?
- Frontend no carga: ¿Backend está en puerto 3001?

### En producción:
- Backend error: Revisa logs en Render dashboard
- Frontend error CORS: Actualiza `FRONTEND_URL` con tu dominio real
- No se guarda: Verifica MongoDB Atlas connection string

---

**Por ahora, sigue desarrollando en local. Cuando quieras desplegar, solo sigue los pasos arriba!** 🎮
