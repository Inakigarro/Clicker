# 🎮 ZClicker - Integración Backend

## ✅ Cambios Implementados

### Frontend
1. **Identidad de usuario**: Ahora se inicializa automáticamente al cargar la app
2. **API Client** (`js/api-client.js`): Módulo para comunicación con backend
3. **Sincronización automática**: 
   - Carga inicial desde MongoDB al abrir el juego
   - Guardado con debounce (2s después de cada cambio)
   - Guardado periódico cada 30 segundos
4. **LocalStorage como caché**: Se mantiene para funcionalidad offline

### Backend
- Ya estaba implementado, solo se agregó `.env` con configuración

## 🚀 Cómo Probar

### 1. Instalar MongoDB (si no lo tienes)

**Opción A: MongoDB Local**
- Descargar: https://www.mongodb.com/try/download/community
- Instalar y ejecutar `mongod`

**Opción B: MongoDB Atlas (Cloud - Gratis)**
1. Crear cuenta en: https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito
3. Obtener string de conexión
4. Actualizar `MONGODB_URI` en `server/.env`

### 2. Iniciar el Backend

```powershell
cd server
.\start-server.ps1
```

O manualmente:
```powershell
cd server
npm start
```

Deberías ver:
```
Connected to MongoDB
Server listening on port 3001
```

### 3. Abrir el Frontend

Simplemente abre `index.html` en tu navegador. 

**Nota**: Si tienes problemas de CORS, puedes usar un servidor local:

```powershell
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js (si tienes http-server instalado)
npx http-server -p 8000

# Luego abre: http://localhost:8000
```

### 4. Verificar Funcionamiento

1. **Al abrir el juego**: Deberías ver en la consola del navegador:
   ```
   Usuario identificado: [tu nombre] [uuid]
   Iniciando sincronización con backend...
   Estado guardado en backend: {...}
   ```

2. **Juega un poco**: Haz clicks, compra mejoras

3. **Verifica en MongoDB**: 
   ```powershell
   # Conéctate a MongoDB
   mongosh
   
   # Ver base de datos
   use clicker
   
   # Ver usuarios guardados
   db.gamestates.find().pretty()
   ```

4. **Recarga la página**: Tu progreso debería cargarse desde MongoDB

## 📊 Estructura de Datos Guardados

```javascript
{
  userId: "uuid-único",
  userName: "TuNombre",
  points: 1234,
  autoClick: {
    speedLevel: 5,
    powerLevel: 3,
    intervalMs: 951
  },
  autoInvest: {
    level: 2,
    cost: 1210,
    intervalMs: 24300
  },
  objective: {
    level: 3,
    progress: 45
  },
  createdAt: "2025-12-04T...",
  updatedAt: "2025-12-04T..."
}
```

## 🔧 Configuración

Edita `server/.env` para cambiar:
- `PORT`: Puerto del servidor (default: 3001)
- `MONGODB_URI`: Conexión a MongoDB

Edita `js/api-client.js` para cambiar:
- `API_BASE_URL`: URL del backend (línea 3)
- Intervalo de guardado automático (línea 170, default: 30s)
- Debounce de guardado (línea 153, default: 2s)

## 🐛 Troubleshooting

### "Failed to fetch"
- Verifica que el backend esté corriendo en puerto 3001
- Revisa la consola del backend por errores

### "CORS error"
- El backend ya tiene CORS habilitado
- Si persiste, asegúrate de usar `http://localhost` no `file://`

### "MongoDB connection failed"
- Verifica que MongoDB esté corriendo: `Get-Process mongod`
- Revisa el string de conexión en `.env`

### "Usuario no identificado"
- Borra localStorage y recarga: `localStorage.clear()`
- Deberías ver el prompt para ingresar nombre

## 📝 Próximos Pasos Sugeridos

1. **Manejo de conflictos**: Qué hacer si hay datos diferentes en localStorage vs MongoDB
2. **Indicador visual**: Mostrar estado de conexión (online/offline/guardando)
3. **Migración de datos**: Script para importar datos de localStorage a MongoDB
4. **Backup/Restore**: Funciones para exportar e importar progreso
5. **Multi-dispositivo**: Sincronizar entre diferentes navegadores/dispositivos
