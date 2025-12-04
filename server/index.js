require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const gameRoutes = require('./gameRoutes');

const app = express();

// Detectar ambiente
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Configuración de puerto
const PORT = process.env.PORT || 3001;

// Configuración de MongoDB
// En desarrollo: usa MONGODB_URI del .env o fallback a localhost
// En producción: DEBE existir MONGODB_URI (Atlas)
const MONGODB_URI = process.env.MONGODB_URI || 
  (isProduction 
    ? null // En producción, MONGODB_URI es obligatorio
    : 'mongodb://localhost:27017/clicker' // Fallback para desarrollo
  );

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI no está configurado en las variables de entorno');
  console.error('Para producción, debes configurar MONGODB_URI con tu URL de MongoDB Atlas');
  process.exit(1);
}

// Configuración de CORS
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['*'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    // Si FRONTEND_URL es '*', permitir todo
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Log de CORS configurado
console.log('🔐 CORS configurado para:', allowedOrigins.join(', '));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Clicker backend is running' });
});

app.use('/api/game', gameRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📊 Database: ${isProduction ? 'MongoDB Atlas (Cloud)' : 'MongoDB Local'}`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      if (!isProduction) {
        console.log(`📡 API disponible en: http://localhost:${PORT}/api/game`);
      }
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
    console.error('Verifica tu MONGODB_URI en las variables de entorno');
    process.exit(1);
  });
