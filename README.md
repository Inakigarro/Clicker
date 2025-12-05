# 🎮 ZClicker

> Un incremental clicker game moderno con persistencia en la nube, sincronización multi-dispositivo y arquitectura modular.

[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS-yellow)]() [![Backend](https://img.shields.io/badge/Backend-Node.js_+_Express-green)]() [![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)]() [![Deploy](https://img.shields.io/badge/Deploy-Render_+_GitHub_Pages-blue)]()

---

## 📋 Descripción

**ZClicker** es un juego incremental (idle/clicker game) donde el objetivo es acumular puntos mediante clicks manuales y mejoras automáticas. El juego cuenta con un sistema de progresión por niveles, mejoras comprables, y un sistema robusto de persistencia que sincroniza tu progreso en la nube.

El proyecto destaca por su arquitectura modular, separación de responsabilidades, y funcionalidades avanzadas como sincronización multi-dispositivo, exportación/importación de progreso, y estadísticas en tiempo real.

---

## ✨ Características Principales

### 🎯 Mecánicas de Juego
- **Click Manual**: Genera +1 punto por click con animaciones visuales
- **Auto-Click**: Sistema automatizado con mejoras de velocidad y poder
- **Auto-Invest**: Inversión automática de puntos en objetivos
- **Sistema de Niveles**: Progresión mediante objetivos con costos escalados
- **Mejoras Comprables**: 3 tipos de upgrades con costos dinámicos
- **Feedback Visual**: Animaciones flotantes para cada acción (+puntos, -inversión)

### 💾 Persistencia y Sincronización
- **LocalStorage**: Caché local para juego offline
- **MongoDB Cloud**: Persistencia en la nube con MongoDB Atlas
- **Auto-Save Inteligente**: 
  - Debounce de 2 segundos después de cambios
  - Guardado periódico cada 30 segundos
  - Sincronización bidireccional automática
- **Multi-Dispositivo**: Juega desde cualquier navegador con el mismo progreso

### 🔄 Transferencia de Usuario
- **Exportar Progreso**: A portapapeles o archivo JSON
- **Importar Progreso**: Desde texto o archivo
- **Backup Seguro**: Sistema de respaldo para recuperación
- **Interfaz Visual**: Botones integrados en el header

### 📊 Estadísticas en Tiempo Real
- Puntos totales acumulados
- Puntos por segundo (PPS)
- Contador de clicks manuales
- Nivel actual y progreso
- Niveles de mejoras activas
- Puntos invertidos totales
- Tiempo de juego
- Actualización automática cada segundo

### 🎨 Interfaz y UX
- **Temas**: Modo claro y oscuro con persistencia
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Botones Inteligentes**: 
  - Deshabilitados cuando hay puntos insuficientes
  - Tooltips informativos con costos y puntos actuales
  - Estilos visuales según estado (activo/deshabilitado)
- **Animaciones Suaves**: Transiciones y efectos visuales pulidos
- **Sidebar Colapsable**: Control de visibilidad de mejoras

---

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: 
  - Variables CSS para theming
  - Nested selectors para organización
  - Media queries responsive (3 breakpoints)
  - Animaciones con @keyframes
  - Flexbox y Grid Layout
- **JavaScript (Vanilla)**:
  - Arquitectura modular (8 módulos)
  - ES6+ (async/await, arrow functions, template literals)
  - Event-driven programming
  - LocalStorage API
  - Clipboard API
  - File API
  - Crypto API (UUID generation)

### Backend
- **Node.js**: Runtime JavaScript del lado del servidor
- **Express.js** v4.21.2: Framework web minimalista
- **Mongoose** v8.8.0: ODM para MongoDB
- **MongoDB**: Base de datos NoSQL
  - MongoDB local (desarrollo)
  - MongoDB Atlas (producción)
- **CORS**: Configuración multi-origen
- **dotenv**: Gestión de variables de entorno

### DevOps y Deployment
- **GitHub**: Control de versiones
- **GitHub Pages**: Hosting del frontend
- **Render.com**: Hosting del backend
- **MongoDB Atlas**: Base de datos en la nube

### Arquitectura
```
┌─────────────────────┐
│   GitHub Pages      │
│   (Frontend)        │
│   HTML/CSS/JS       │
└──────────┬──────────┘
           │
           ├─► LocalStorage (Caché)
           │
           ├─► Clipboard/File API
           │
           ▼
    ┌──────────────┐
    │ API Client   │
    │ (REST)       │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Render.com  │
    │  (Backend)   │
    │  Express API │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ MongoDB      │
    │ Atlas        │
    │ (Database)   │
    └──────────────┘
```

---

## 📦 Estructura del Proyecto

```
Clicker/
├── index.html              # Punto de entrada
├── index.js                # Lógica principal y orquestación
├── styles.css              # Estilos globales + responsive
├── assets/
│   └── LogoVectorizado.svg # Logo del juego
├── js/                     # Módulos JavaScript
│   ├── api-client.js       # Cliente REST para backend
│   ├── stats.js            # Sistema de estadísticas
│   ├── floating-points.js  # Animaciones flotantes
│   ├── user-transfer.js    # Export/Import de usuario
│   ├── auto-click.js       # Lógica de auto-click
│   ├── auto-invest.js      # Lógica de auto-invest
│   ├── objective.js        # Sistema de niveles
│   └── theme-toggle.js     # Alternador de temas
├── server/                 # Backend Node.js
│   ├── index.js            # Servidor Express
│   ├── gameModel.js        # Modelo Mongoose
│   ├── gameRoutes.js       # Rutas API
│   ├── package.json        # Dependencias
│   ├── .env.development    # Config desarrollo
│   └── .env.production     # Config producción
└── docs/                   # Documentación
    ├── DEPLOYMENT.md
    ├── TESTING.md
    ├── USER_TRANSFER.md
    ├── CORS_FIX.md
    ├── BACKEND_SETUP.md
    └── MULTI_ENV_SETUP.md
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 14+ y npm
- MongoDB (local) o cuenta en MongoDB Atlas
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Inakigarro/Clicker.git
cd Clicker
```

### 2. Configurar Backend
```bash
cd server
npm install
```

Crear archivo `.env` en `server/`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/zclicker
NODE_ENV=development
```

### 3. Iniciar MongoDB (si es local)
```bash
mongod
```

### 4. Iniciar Backend
```bash
cd server
npm start
# Servidor en http://localhost:3001
```

### 5. Abrir Frontend
Opción A: Abrir `index.html` directamente en el navegador

Opción B: Usar servidor HTTP
```bash
python -m http.server 8000
# Abrir http://localhost:8000
```

---

## 📊 Modelo de Datos

### GameState Schema (MongoDB)
```javascript
{
  userId: String,        // UUID único del usuario
  userName: String,      // Nombre del jugador
  points: Number,        // Puntos actuales
  autoClick: {
    speedLevel: Number,  // Nivel de velocidad (reduce intervalo)
    powerLevel: Number,  // Nivel de poder (aumenta puntos/click)
    intervalMs: Number   // Intervalo actual en milisegundos
  },
  autoInvest: {
    level: Number,       // Nivel de auto-invest
    cost: Number,        // Costo actual
    intervalMs: Number   // Intervalo de inversión automática
  },
  objective: {
    level: Number,       // Nivel actual del objetivo
    progress: Number     // Puntos invertidos en nivel actual
  },
  createdAt: Date,       // Timestamp de creación
  updatedAt: Date        // Timestamp de última actualización
}
```

### GameStats Schema (LocalStorage)
```javascript
{
  totalPoints: Number,   // Puntos totales acumulados
  manualClicks: Number,  // Total de clicks manuales
  investedPoints: Number,// Total de puntos invertidos
  startTime: Number      // Timestamp de inicio (Date.now())
}
```

---

## 🎮 Funcionalidades Detalladas

### Sistema de Persistencia

**Flujo de Sincronización:**
1. Usuario abre el juego
2. `ensureUserIdentity()` obtiene/crea UUID y nombre
3. `initializeBackendSync()` intenta cargar estado desde MongoDB
4. Si existe en backend: aplica ese estado
5. Si no existe: guarda estado actual (POST)
6. Durante el juego:
   - Cada cambio → debounce 2s → PUT a MongoDB
   - Cada 30s → auto-save automático
7. LocalStorage actúa como caché para acceso rápido

**Características:**
- ✅ Identificación automática de usuario (UUID + nombre)
- ✅ Carga inicial desde MongoDB al abrir
- ✅ Guardado inteligente con debounce (evita sobrecarga)
- ✅ Guardado periódico de respaldo
- ✅ Sincronización bidireccional
- ✅ Manejo de errores y fallback a localStorage

### Sistema de Transferencia

**Exportación de Progreso:**
- Botón visual en el header (icono descarga)
- Copia automática al portapapeles
- Descarga como archivo JSON
- Formato seguro con metadata

**Importación de Progreso:**
- Botón visual en el header (icono carga)
- Pegar desde portapapeles o cargar archivo
- Validación estricta de formato
- Confirmación antes de sobrescribir
- Recarga automática para aplicar cambios

**API de Consola:**
```javascript
// Exportación
exportUserCredentials()        // Ver credenciales en consola
copyCredentialsToClipboard()   // Copiar al portapapeles
downloadCredentialsAsFile()    // Descargar como JSON

// Importación
importUserCredentials(json)    // Importar objeto JSON
promptImportCredentials()      // Prompt interactivo
importCredentialsFromFile()    // Selector de archivo
```

**Casos de Uso:**
- Cambiar de navegador (Chrome → Firefox)
- Sincronizar múltiples dispositivos
- Crear backups de seguridad
- Recuperar progreso perdido
- Compartir progreso entre PCs

---

## 🔌 API del Backend

### Endpoints

#### `GET /api/game/:userId`
Obtiene el estado del juego para un usuario.

**Respuesta exitosa (200):**
```json
{
  "userId": "uuid-string",
  "userName": "Player1",
  "points": 1500,
  "autoClick": {
    "speedLevel": 5,
    "powerLevel": 3,
    "intervalMs": 800
  },
  "autoInvest": {
    "level": 2,
    "cost": 2000,
    "intervalMs": 5000
  },
  "objective": {
    "level": 3,
    "progress": 45
  },
  "createdAt": "2025-12-04T...",
  "updatedAt": "2025-12-04T..."
}
```

**Usuario no encontrado (404):**
```json
{
  "message": "Game state not found"
}
```

#### `PUT /api/game/:userId`
Actualiza o crea el estado del juego.

**Request Body:**
```json
{
  "userName": "Player1",
  "points": 1500,
  "autoClick": { ... },
  "autoInvest": { ... },
  "objective": { ... }
}
```

**Respuesta (200):**
```json
{
  "message": "Game state saved successfully",
  "gameState": { ... }
}
```

### CORS Configuration
El backend acepta peticiones desde:
- `http://localhost:8000` (desarrollo)
- `https://inakigarro.github.io` (producción)

---

## 📱 Responsive Design

### Breakpoints

**Tablets (≤768px):**
- Sidebars reducidos (140px upgrades, 180px stats)
- Botón clicker 150px
- Fuentes ajustadas proporcionalmente

**Móviles (≤480px):**
- Layout vertical: sidebars apilados sobre contenido
- Upgrades en fila horizontal (flex-row)
- Stats y upgrades ocupan ancho completo
- Botón clicker 120px
- Botones de exportar/importar ocultos
- Overflow optimizado sin scroll horizontal

**Móviles Pequeños (≤360px):**
- Botón clicker 100px
- Fuentes ultra-compactas
- Espaciados mínimos
- Word-break para evitar desbordamiento

---

## 🎯 Roadmap y Mejoras Futuras

### Completado ✅
- [x] Conexión frontend ↔ backend con MongoDB
- [x] Sistema de persistencia con auto-save
- [x] Transferencia de usuario (export/import)
- [x] Tema claro/oscuro persistente
- [x] Botones inteligentes con tooltips
- [x] Animaciones flotantes visuales
- [x] Panel de estadísticas en tiempo real
- [x] Responsive design completo
- [x] Deploy en producción (Render + GitHub Pages)

### En Progreso 🚧
- [ ] Sistema de logros
- [ ] Rebalanceo de economía (costos exponenciales)
- [ ] Sonidos y efectos de audio

### Planificado 📋
- [ ] Sistema de prestigio
- [ ] Más tipos de mejoras
- [ ] Tests automatizados
- [ ] PWA (Progressive Web App)
- [ ] Ranking global de jugadores

Ver [mejoras.md](./mejoras.md) para más detalles.

---

## 📚 Documentación Adicional

- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)**: Guía de despliegue en Render y GitHub Pages
- **[TESTING.md](./docs/TESTING.md)**: Pruebas y verificación del sistema
- **[USER_TRANSFER.md](./docs/USER_TRANSFER.md)**: Sistema de transferencia de usuario
- **[CORS_FIX.md](./docs/CORS_FIX.md)**: Solución de problemas CORS
- **[BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)**: Configuración del backend
- **[MULTI_ENV_SETUP.md](./docs/MULTI_ENV_SETUP.md)**: Configuración multi-ambiente

---

## 🧪 Testing

### Tests Manuales
```javascript
// En la consola del navegador:

// 1. Verificar estado actual
console.log('Points:', points);
console.log('AutoClick Speed:', autoClickSpeedLevel);
console.log('Objective Level:', objectiveLevel);

// 2. Exportar progreso
exportUserCredentials();

// 3. Verificar sincronización
localStorage.getItem('points');

// 4. Estadísticas
console.log('Stats:', JSON.parse(localStorage.getItem('gameStats')));
```

### Verificación Backend
```bash
# Verificar estado de un usuario en MongoDB
curl http://localhost:3001/api/game/{userId}

# En producción
curl https://clicker-backend.onrender.com/api/game/{userId}
```

Ver [TESTING.md](./docs/TESTING.md) para guía completa de pruebas.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Áreas de Contribución Sugeridas
- 🎮 Nuevas mecánicas de juego
- 🎨 Mejoras visuales y animaciones
- 🐛 Reportar y corregir bugs
- 📚 Mejorar documentación
- ✅ Agregar tests automatizados
- 🌍 Traducciones (i18n)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autor

**Iñaki Garro**
- GitHub: [@Inakigarro](https://github.com/Inakigarro)
- LinkedIn: [Iñaki Garro](https://www.linkedin.com/in/inakigarro/)

---

## 🙏 Agradecimientos

- Inspirado en clásicos idle games como Cookie Clicker y Adventure Capitalist
- Font Awesome para los iconos
- MongoDB Atlas por el hosting de base de datos gratuito
- Render.com por el hosting de backend
- GitHub Pages por el hosting del frontend

---

## 📈 Estadísticas del Proyecto

- **Líneas de Código**: ~1,500 líneas
- **Módulos JavaScript**: 8 archivos
- **Breakpoints Responsive**: 3 (768px, 480px, 360px)
- **Endpoints API**: 2 (GET, PUT)
- **Tecnologías**: 12+ (HTML5, CSS3, Vanilla JS, Node.js, Express, MongoDB, etc.)
- **Tiempo de Desarrollo**: Incrementado en fases
- **Cobertura de Funcionalidades**: 69% completado (11/16 tareas)

---

## 🔗 Enlaces Útiles

- **Demo en Vivo**: [https://inakigarro.github.io/Clicker](https://inakigarro.github.io/Clicker)
- **Backend API**: [https://clicker-backend.onrender.com](https://clicker-backend.onrender.com)
- **Repositorio**: [https://github.com/Inakigarro/Clicker](https://github.com/Inakigarro/Clicker)
- **Issues**: [https://github.com/Inakigarro/Clicker/issues](https://github.com/Inakigarro/Clicker/issues)

---

## 🎮 ¡Empieza a Jugar!

Visita [https://inakigarro.github.io/Clicker](https://inakigarro.github.io/Clicker) y comienza a acumular puntos. Tu progreso se guardará automáticamente en la nube.

**¡Diviértete clickeando! 🖱️✨**

---

<div align="center">

**ZClicker** - Un incremental game moderno con persistencia en la nube

[![GitHub stars](https://img.shields.io/github/stars/Inakigarro/Clicker?style=social)](https://github.com/Inakigarro/Clicker/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Inakigarro/Clicker?style=social)](https://github.com/Inakigarro/Clicker/network/members)

*Desarrollado con ❤️ por Iñaki Garro*

*Última actualización: 4 de Diciembre de 2025*

</div>
