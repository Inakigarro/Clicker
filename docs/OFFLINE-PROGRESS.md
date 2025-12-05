# 💤 Sistema de Progreso Offline

## 🎯 Descripción

El sistema de progreso offline permite a los jugadores **ganar puntos mientras el juego está inactivo**, calculando automáticamente lo que habrían ganado durante el tiempo ausente.

---

## ⚙️ Funcionamiento

### Detección de Inactividad

El sistema detecta cuando el jugador está ausente mediante:

1. **Timestamp de Actividad**
   - Se guarda cada 15 segundos en `localStorage`
   - Se actualiza al cambiar de pestaña
   - Se actualiza al minimizar/maximizar ventana

2. **Event Listeners**
   - `visibilitychange` - Detecta cambio de pestaña
   - `focus`/`blur` - Detecta cambio de ventana
   - `DOMContentLoaded` - Calcula al cargar página

### Cálculo de Recompensa

Cuando el jugador regresa (después de 10+ segundos):

```javascript
Puntos Offline = PPS × Segundos Ausente × 0.5 (eficiencia)
```

**Componentes:**
- **PPS (Puntos Por Segundo)**: Basado en Auto-Click actual
- **Tiempo Ausente**: Máximo 24 horas
- **Eficiencia**: 50% (penalización común en juegos idle)

**Ejemplo:**
- PPS actual: 10
- Tiempo ausente: 1 hora (3,600 segundos)
- Cálculo: `10 × 3,600 × 0.5 = 18,000 puntos`

---

## 🎨 Interfaz

### Modal de Bienvenida

Cuando regresas después de estar ausente, ves:

```
╔═══════════════════════════════════════╗
║      ¡Bienvenido de vuelta!          ║
║  Estuviste ausente por 1h 30m        ║
║                                       ║
║  Producción: 25.5 PPS                ║
║  Eficiencia Offline: 50%             ║
║                                       ║
║       +45,900 Puntos ganados         ║
║                                       ║
║    [Reclamar Recompensa]             ║
╚═══════════════════════════════════════╝
```

### Características Visuales

- ✨ Animación de reloj girando
- 💎 Números dorados pulsantes
- 📊 Estadísticas de producción
- 🎁 Botón de reclamar destacado
- 💡 Tip para mejorar ganancias offline

---

## 🔧 Configuración

### Límites y Parámetros

```javascript
// En js/offline-progress.js

const MIN_OFFLINE_TIME = 10000;        // 10 segundos (mostrar modal)
const MAX_OFFLINE_TIME = 86400000;     // 24 horas (límite máximo)
const OFFLINE_EFFICIENCY = 0.5;        // 50% de eficiencia
const UPDATE_INTERVAL = 15000;         // 15 segundos (actualizar timestamp)
```

### Modificar Eficiencia

Para cambiar la penalización offline:

```javascript
// 100% eficiencia (mismos puntos que estando activo)
const offlineEfficiency = 1.0;

// 75% eficiencia
const offlineEfficiency = 0.75;

// 25% eficiencia (más castigado)
const offlineEfficiency = 0.25;
```

---

## 📊 Cálculo de PPS

El sistema calcula automáticamente tu producción:

```javascript
PPS = (Clicks/seg × Poder × Prestigio × Nivel Bonus)

Donde:
- Clicks/seg = 1000 / intervalo_autoclick
- Poder = getPointsPerAutoClick()
- Prestigio = getPrestigeMultiplier()
- Nivel Bonus = getLevelBonus()
```

**Ejemplo:**
- Auto-Click Speed: Nivel 5 → ~1,111ms intervalo → 0.9 clicks/seg
- Auto-Click Power: Nivel 3 → ×2.5 multiplicador → 2.5 puntos/click
- Prestigio: Nivel 2 → ×2.0
- Nivel Bonus: Nivel 15 → ×1.15

```
PPS = 0.9 × 2.5 × 2.0 × 1.15 = 5.175 puntos/segundo
```

---

## 🎮 Estrategias de Juego

### Maximizar Ganancias Offline

1. **Mejora Auto-Click Speed**
   - Más clicks por segundo = más PPS
   - Prioridad #1 para juego idle

2. **Mejora Auto-Click Power**
   - Más puntos por click
   - Escala multiplicativamente

3. **Sube de Prestigio**
   - Multiplicador permanente
   - Afecta TODOS los puntos, incluso offline

4. **Sube de Nivel**
   - +1% por nivel objetivo
   - Bonus pequeño pero acumulativo

### Comparación de Ganancias

| Mejora | Sin Offline | Con Offline (8h) | Ganancia Extra |
|--------|-------------|------------------|----------------|
| Básico (PPS: 5) | Manual | 72,000 pts | 100% |
| Speed Lvl 10 (PPS: 15) | Manual | 216,000 pts | 300% |
| Speed+Power (PPS: 50) | Manual | 720,000 pts | 1000% |
| +Prestigio 3 (PPS: 125) | Manual | 1,800,000 pts | 2500% |

---

## 🐛 Resolución de Problemas

### No aparece el modal

**Causa:** Tiempo ausente menor a 10 segundos

**Solución:** Espera al menos 10 segundos antes de volver

### Puntos offline muy bajos

**Causa:** Auto-Click desactivado o bajo nivel

**Solución:** 
- Activa Auto-Click (mínimo Speed Nivel 1)
- Mejora Speed y Power para mayor PPS

### Modal aparece en loops

**Causa:** Timestamp no se actualiza correctamente

**Solución:** 
- Verifica que `localStorage` funcione
- Revisa la consola del navegador (F12)

### Puntos no se suman al reclamar

**Causa:** Variable `points` no definida

**Solución:**
- Asegúrate de que `index.js` se cargó antes
- Verifica el orden de scripts en `index.html`

---

## 🔍 Debugging

### Ver información en consola

Abre la consola (F12) y ejecuta:

```javascript
// Ver PPS actual
console.log('PPS:', calculatePointsPerSecond());

// Ver último timestamp
console.log('Último activo:', new Date(parseInt(localStorage.getItem('lastActiveTime'))));

// Forzar cálculo offline (testing)
localStorage.setItem('lastActiveTime', Date.now() - 3600000); // 1 hora atrás
location.reload();
```

### Deshabilitar progreso offline

```javascript
// En js/offline-progress.js
let offlineCalculationEnabled = false;
```

---

## 🚀 Mejoras Futuras

Posibles mejoras para el sistema:

- **Boost de Offline**: Comprar multiplicador de eficiencia offline
- **Límite Aumentable**: Mejora para extender las 24 horas
- **Auto-Claim**: Reclamar automáticamente sin modal
- **Notificaciones**: Avisar cuando has ganado X puntos offline
- **Estadísticas**: Tracker de puntos totales offline ganados

---

## 📈 Impacto en el Juego

### Beneficios

✅ **Jugadores Casuales**: Recompensa por volver después de días
✅ **Retención**: Incentivo para regresar al juego
✅ **Progresión**: Avance constante incluso sin jugar activamente
✅ **Balance**: Eficiencia reducida (50%) mantiene valor de juego activo

### Balance

- **No Exploitable**: Límite de 24 horas
- **Requiere Inversión**: Solo funciona con Auto-Click activo
- **Escalable**: Mejores upgrades = mejores recompensas offline

---

*Sistema implementado el 5 de Diciembre de 2025*
*Versión: 2.0.0*
