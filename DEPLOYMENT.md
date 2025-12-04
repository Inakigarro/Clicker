# 🚀 Guía de Despliegue - ZClicker Backend

Esta guía te ayudará a desplegar el backend en diferentes servicios de hosting gratuitos.

---

## 📋 Preparación Previa

### 1. Configurar MongoDB Atlas (Base de Datos en la Nube)

MongoDB Atlas es **gratuito** hasta 512MB de almacenamiento.

#### Pasos:

1. **Crear cuenta** en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. **Crear un Cluster**:
   - Click en "Build a Database"
   - Selecciona **FREE** (M0 Sandbox)
   - Elige la región más cercana (ej: AWS - Virginia)
   - Click "Create"

3. **Configurar acceso**:
   - **Database Access** → Add New Database User
     - Username: `clicker-admin` (o el que prefieras)
     - Password: Genera una contraseña segura (guárdala!)
     - Database User Privileges: "Read and write to any database"
   
   - **Network Access** → Add IP Address
     - Click "Allow Access from Anywhere" (0.0.0.0/0)
     - Esto permite conexiones desde cualquier IP

4. **Obtener Connection String**:
   - Ve a "Database" → Click en "Connect"
   - Selecciona "Connect your application"
   - Copia la URL, se verá así:
     ```
     mongodb+srv://clicker-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **IMPORTANTE**: Reemplaza `<password>` con tu contraseña real
   - Agrega el nombre de la base de datos: `/clicker` después de `.net`
   
   Resultado final:
   ```
   mongodb+srv://clicker-admin:TuPassword123@cluster0.xxxxx.mongodb.net/clicker?retryWrites=true&w=majority
   ```

---

## 🎯 Opción 1: Render (Recomendado - Más Fácil)

**Ventajas**: Gratis, fácil de configurar, no duerme tanto como Heroku free tier.

### Pasos:

1. **Crear cuenta** en [Render.com](https://render.com/)

2. **Nuevo Web Service**:
   - Click "New +" → "Web Service"
   - Conecta tu repositorio de GitHub (sube el código primero)
   - O usa "Public Git repository" con la URL de tu repo

3. **Configuración**:
   ```
   Name: zclicker-backend
   Region: Oregon (US West) o el más cercano
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Plan**:
   - Selecciona **Free** (0$/mes)

5. **Variables de Entorno** (Environment):
   Click en "Advanced" → Add Environment Variable:
   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://clicker-admin:TuPassword@cluster0.xxxxx.mongodb.net/clicker?retryWrites=true&w=majority
   FRONTEND_URL = * 
   ```
   (Luego cambia `FRONTEND_URL` a tu dominio real)

6. **Deploy**:
   - Click "Create Web Service"
   - Espera 2-5 minutos
   - Tu backend estará en: `https://zclicker-backend.onrender.com`

7. **Actualizar Frontend**:
   Edita `js/api-client.js`:
   ```javascript
   const PRODUCTION_API_URL = 'https://zclicker-backend.onrender.com/api/game';
   ```

---

## 🎯 Opción 2: Railway

**Ventajas**: Muy rápido, interfaz moderna, buen free tier.

### Pasos:

1. **Crear cuenta** en [Railway.app](https://railway.app/)

2. **Nuevo Proyecto**:
   - Click "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Configuración**:
   - Railway detectará automáticamente que es Node.js
   - Root Directory: `/server`
   - Start Command: `npm start`

4. **Variables de Entorno**:
   Ve a la pestaña "Variables":
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/clicker?retryWrites=true&w=majority
   FRONTEND_URL=*
   ```

5. **Generar dominio**:
   - Settings → "Generate Domain"
   - Te dará algo como: `zclicker-backend.up.railway.app`

6. **Deploy**:
   - Se despliega automáticamente
   - Cada push a GitHub redesplegará

---

## 🎯 Opción 3: Vercel

**Nota**: Vercel está más orientado a serverless. Funciona pero puede tener limitaciones.

### Pasos:

1. **Crear cuenta** en [Vercel.com](https://vercel.com/)

2. **Instalar CLI** (opcional):
   ```powershell
   npm install -g vercel
   ```

3. **Deploy desde GitHub**:
   - Import Git Repository
   - Selecciona tu repo
   - Root Directory: `server`
   - Framework Preset: Other

4. **Variables de Entorno**:
   Settings → Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=[tu URL de Atlas]
   FRONTEND_URL=*
   ```

5. **Deploy**:
   - Automático en cada push

**Archivo ya incluido**: `server/vercel.json` ✅

---

## 🎯 Opción 4: Heroku (Clásico)

**Nota**: Heroku eliminó su free tier, ahora requiere tarjeta de crédito.

### Pasos:

1. Crear cuenta en [Heroku.com](https://www.heroku.com/)
2. Instalar [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Desde terminal:
   ```powershell
   cd server
   heroku login
   heroku create zclicker-backend
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="tu-url-de-atlas"
   git push heroku main
   ```

**Archivo ya incluido**: `server/Procfile` ✅

---

## 📦 Configuración del Frontend

Una vez desplegado el backend, actualiza el frontend:

### Editar `js/api-client.js`:

```javascript
const PRODUCTION_API_URL = 'https://tu-backend-desplegado.com/api/game';
```

Reemplaza con tu URL real:
- Render: `https://zclicker-backend.onrender.com/api/game`
- Railway: `https://zclicker-backend.up.railway.app/api/game`
- Vercel: `https://zclicker-backend.vercel.app/api/game`

### Desplegar Frontend (Opciones):

#### **GitHub Pages** (Estático):
```powershell
# En la raíz del proyecto
git add .
git commit -m "Deploy"
git push origin main

# Settings → Pages → Source: main branch → Save
```

#### **Netlify** (Drag & Drop):
1. Arrastra la carpeta raíz a [Netlify Drop](https://app.netlify.com/drop)
2. Listo!

#### **Vercel** (Frontend):
1. Import Git Repository
2. Root Directory: `.` (raíz)
3. Framework: Other
4. Deploy

---

## ✅ Verificar Despliegue

### 1. Probar Backend:

Abre en tu navegador:
```
https://tu-backend.com/
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Clicker backend is running"
}
```

### 2. Probar API:

```
https://tu-backend.com/api/game/test-user-id
```

Debería retornar 404 o el estado del usuario.

### 3. Verificar Logs:

- **Render**: Dashboard → Logs
- **Railway**: Pestaña "Deployments" → Ver logs
- **Vercel**: Functions → Ver logs

Busca:
```
✅ Connected to MongoDB
🌍 Environment: production
📊 Database: MongoDB Atlas (Cloud)
🚀 Server listening on port XXXX
```

---

## 🔐 Seguridad en Producción

### 1. Configurar CORS correctamente:

En `server/.env` (producción):
```
FRONTEND_URL=https://tu-dominio-frontend.com
```

### 2. Nunca subas `.env` a Git:

Ya está en `.gitignore` ✅

### 3. Rotar credenciales:

Si accidentalmente subes credenciales:
1. Ve a MongoDB Atlas
2. Database Access → Edita el usuario
3. Cambia la contraseña
4. Actualiza en las variables de entorno del hosting

---

## 🐛 Troubleshooting

### "MongooseServerSelectionError"
**Problema**: No puede conectarse a MongoDB Atlas

**Soluciones**:
1. Verifica que la URL de conexión sea correcta
2. Verifica que la contraseña no tenga caracteres especiales (o escápalos)
3. En Atlas → Network Access → Permite 0.0.0.0/0
4. Verifica que el usuario tenga permisos de lectura/escritura

### "CORS Error" en el frontend
**Problema**: Backend rechaza peticiones del frontend

**Solución**:
```
FRONTEND_URL=https://tu-frontend.com
```
O temporalmente: `FRONTEND_URL=*`

### "Application Error" o "503"
**Problema**: El servidor no inicia

**Solución**:
1. Revisa los logs del hosting
2. Verifica que `NODE_ENV=production` esté configurado
3. Verifica que `MONGODB_URI` esté configurado
4. Asegúrate de que el puerto se lea de `process.env.PORT`

### Backend "duerme" después de inactividad
**Render/Heroku free tier**: Se duermen después de 15-30 min de inactividad

**Solución**:
- Usar un servicio de "ping" como [UptimeRobot](https://uptimerobot.com/)
- O actualizar a plan de pago ($7/mes en Render)

---

## 📊 Resumen de Costos

| Servicio | Backend | MongoDB | Total/mes |
|----------|---------|---------|-----------|
| Render Free + Atlas Free | $0 | $0 | **$0** |
| Railway Free + Atlas Free | $0 | $0 | **$0** |
| Render Starter + Atlas Free | $7 | $0 | **$7** |
| Railway Pro + Atlas Free | $5 | $0 | **$5** |

---

## 🎯 Recomendación Final

**Para comenzar (gratis)**:
1. MongoDB Atlas Free (512MB)
2. Render Free (backend)
3. GitHub Pages (frontend) o Netlify

**Para producción seria**:
1. MongoDB Atlas Shared ($9/mes)
2. Render Starter ($7/mes)
3. Tu propio dominio

---

## ✅ Checklist de Despliegue

- [ ] Crear cluster en MongoDB Atlas
- [ ] Configurar usuario y contraseña
- [ ] Permitir acceso desde cualquier IP (0.0.0.0/0)
- [ ] Obtener connection string
- [ ] Crear cuenta en Render/Railway
- [ ] Subir código a GitHub
- [ ] Configurar variables de entorno
- [ ] Deploy backend
- [ ] Verificar que backend responde
- [ ] Actualizar URL en frontend
- [ ] Deploy frontend
- [ ] Probar flujo completo
- [ ] Configurar CORS con dominio real

---

¡Listo! Tu ZClicker estará disponible 24/7 en internet 🎮🚀
