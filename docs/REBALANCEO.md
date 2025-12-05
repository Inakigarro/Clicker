# 📊 Rebalanceo de Economía del Juego

**Fecha:** 5 de Diciembre de 2025  
**Versión:** 2.0.0  
**Rama:** refactor/rebalanceo-costos-niveles

---

## 🎯 Objetivo del Rebalanceo

Transformar el sistema de progresión de **lineal** a **exponencial** para:
1. ✅ Escalabilidad infinita del juego
2. ✅ Preparación para sistema de Prestigio
3. ✅ Mejoras más significativas y satisfactorias
4. ✅ Balance entre early/mid/late game
5. ✅ Decisiones estratégicas más profundas

---

## 📈 Cambios Implementados

### **1. Auto-Click Speed (Velocidad)**

#### Antes (v1.0):
```javascript
Costo: 50 × (nivel + 1)           // Linear
Mejora: intervalo × 0.99^nivel    // 1% reducción
```

**Problemas:**
- Costo lineal → Explosión en late game
- 1% mejora → Imperceptible hasta nivel 100+
- No escalable

#### Después (v2.0):
```javascript
Costo: 50 × 1.15^nivel            // Exponencial suave
Mejora: intervalo × 0.95^nivel    // 5% reducción
```

**Progresión:**
| Nivel | Costo | Intervalo | Mejora Acumulada |
|-------|-------|-----------|------------------|
| 0 | - | 1000ms | - |
| 1 | 50 | 950ms | 5% más rápido |
| 5 | 101 | 773ms | 23% más rápido |
| 10 | 203 | 599ms | 40% más rápido |
| 20 | 818 | 358ms | 64% más rápido |
| 40 | 13,304 | 129ms | 87% más rápido |

---

### **2. Auto-Click Power (Poder)**

#### Antes (v1.0):
```javascript
Costo: 75 × (nivel + 1)           // Linear
Mejora: +1 punto/tick             // Aditivo
```

**Problemas:**
- Rompe el balance → Nivel 20 = 20 puntos/tick
- No interactúa con Prestigio
- Demasiado barato para su poder

#### Después (v2.0):
```javascript
Costo: 100 × 1.25^nivel           // Exponencial agresivo
Mejora: Base × (1 + 0.5 × nivel)  // Multiplicativo
  donde Base = 1 × MultiplicadorPrestigio
```

**Progresión (sin Prestigio):**
| Nivel | Costo | Puntos/Tick | ROI |
|-------|-------|-------------|-----|
| 0 | - | 1.0 | - |
| 1 | 100 | 1.5 | +50% |
| 2 | 125 | 2.0 | +33% |
| 5 | 305 | 3.5 | +17% |
| 10 | 931 | 6.0 | +7% |
| 20 | 8,674 | 11.0 | +5% |

**Con Prestigio nivel 2 (×2 multiplicador):**
| Nivel | Puntos/Tick |
|-------|-------------|
| 0 | 2.0 |
| 5 | 7.0 |
| 10 | 12.0 |

---

### **3. Auto-Invest (Inversión Automática)**

#### Antes (v1.0):
```javascript
Costo: costo_actual × 1.1         // Exponencial muy suave
Mejora: intervalo × 0.9^nivel     // 10% reducción
```

#### Después (v2.0):
```javascript
Costo: 1000 × 1.5^nivel           // Exponencial agresivo
Mejora: intervalo × 0.85^nivel    // 15% reducción
```

**Progresión:**
| Nivel | Costo | Intervalo | Inversiones/min |
|-------|-------|-----------|-----------------|
| 0 | - | 30s | - |
| 1 | 1,000 | 25.5s | 2.4/min |
| 3 | 3,375 | 18.4s | 3.3/min |
| 5 | 7,594 | 13.3s | 4.5/min |
| 10 | 57,665 | 5.9s | 10.2/min |

**Nota:** Límite mínimo de 5 segundos para evitar spam.

---

### **4. Objective (Sistema de Niveles)**

#### Antes (v1.0):
```javascript
Costo por inversión: 2 × nivel              // Linear
Puntos requeridos: 100 × nivel              // Linear
Inversiones necesarias: ~50 (constante)
```

**Problemas:**
- Predecible → Siempre 50 inversiones
- No emocionante
- Progresión monótona

#### Después (v2.0):
```javascript
Costo por inversión: 10 × 1.1^nivel         // Exponencial suave
Puntos requeridos: 100 × 1.15^nivel         // Exponencial medio
```

**Progresión:**
| Nivel | Costo/Inv | Total Requerido | Inversiones | Puntos Totales |
|-------|-----------|-----------------|-------------|----------------|
| 1 | 11 | 115 | 10 | 110 |
| 5 | 16 | 201 | 12 | 192 |
| 10 | 26 | 405 | 16 | 416 |
| 20 | 67 | 1,637 | 24 | 1,608 |
| 30 | 176 | 6,621 | 38 | 6,688 |
| 50 | 1,174 | 108,366 | 92 | 108,008 |

**Observaciones:**
- Inversiones necesarias crecen: `~(10 + nivel/5)`
- Más desafiante con cada nivel
- Recompensa planificación estratégica

---

### **5. Clicks Manuales**

#### Antes (v1.0):
```javascript
Valor: 1 punto/click (fijo)
```

#### Después (v2.0):
```javascript
Valor: 1 × MultiplicadorPrestigio × BonusNivel

MultiplicadorPrestigio = 1 + (0.5 × prestigeLevel)
  Nivel 0: ×1
  Nivel 1: ×1.5 (+50%)
  Nivel 2: ×2 (+100%)
  Nivel 5: ×3.5 (+250%)

BonusNivel = 1 + (objectiveLevel × 0.01)
  Nivel 1: ×1.01
  Nivel 10: ×1.1 (+10%)
  Nivel 50: ×1.5 (+50%)
  Nivel 100: ×2 (+100%)
```

**Ejemplos:**
| Prestigio | Nivel | Puntos/Click |
|-----------|-------|--------------|
| 0 | 1 | 1 |
| 0 | 10 | 1 |
| 0 | 50 | 2 |
| 1 | 1 | 2 |
| 1 | 50 | 3 |
| 2 | 50 | 4 |

---

## 🔄 Sistema de Prestigio (Preparado)

### **Mecánica:**
```javascript
// Condición para desbloquear
function canPrestige() {
  return objectiveLevel >= 10; // Nivel mínimo
}

// Recompensa
function calculatePrestigeGain() {
  return Math.floor(objectiveLevel / 10);
}

// Al hacer Prestigio:
// RESET:
// - points → 0
// - Todos los niveles de mejoras → 0
// - objectiveLevel → 1
// - objectiveProgress → 0
//
// MANTIENE:
// - prestigeLevel → +1 (o más)
// - Estadísticas totales
```

### **Progresión de Prestigio:**
| Run | Nivel Alcanzado | Prestigio Ganado | Multiplicador Total |
|-----|-----------------|------------------|---------------------|
| 1 | 10 | +1 | ×1.5 |
| 2 | 20 | +2 | ×2.0 |
| 3 | 30 | +3 | ×2.5 |
| 4 | 40 | +4 | ×3.0 |
| 5+ | 50+ | +5+ | ×3.5+ |

---

## 📊 Impacto en Progresión

### **Early Game (Niveles 1-5):**
- **Antes:** 5-10 minutos
- **Ahora:** 8-12 minutos
- **Cambio:** Ligeramente más lento, más satisfactorio

### **Mid Game (Niveles 6-15):**
- **Antes:** 15-30 minutos
- **Ahora:** 25-45 minutos
- **Cambio:** Decisiones estratégicas importan más

### **Late Game (Niveles 16-30):**
- **Antes:** 1-2 horas (lineal, monótono)
- **Ahora:** 2-4 horas (exponencial, emocionante)
- **Cambio:** Preparado para Prestigio

### **Post-Prestigio:**
- **Primera run:** 3-4 horas hasta nivel 10-15
- **Segunda run:** 2-3 horas hasta nivel 20-25 (con ×1.5)
- **Tercera run:** 1.5-2 horas hasta nivel 30+ (con ×2)

---

## 🔧 Cambios Técnicos en el Código

### **Frontend:**

**index.js:**
```javascript
// Agregado
let prestigeLevel = parseInt(localStorage.getItem('prestigeLevel')) || 0;

function getPrestigeMultiplier() {
  return 1 + (prestigeLevel * 0.5);
}

function getLevelBonus() {
  return 1 + (objectiveLevel * 0.01);
}

// Modificado handleClick()
const earnedPoints = Math.floor(basePoints * levelBonus * prestigeMultiplier);
```

**auto-click.js:**
```javascript
// Constantes actualizadas
const AUTO_SPEED_COST_MULTIPLIER = 1.15;
const AUTO_POWER_COST_MULTIPLIER = 1.25;

// Fórmulas actualizadas
function getCurrentIntervalMs() {
  const factor = Math.pow(0.95, autoClickSpeedLevel);
  return Math.max(MIN_INTERVAL_MS, Math.floor(BASE_INTERVAL_MS * factor));
}

function getPointsPerAutoClick() {
  const multiplier = 1 + (0.5 * autoClickPowerLevel);
  const prestigeMultiplier = getPrestigeMultiplier();
  return Math.floor(BASE_POINTS_PER_TICK * multiplier * prestigeMultiplier);
}

function getAutoSpeedCost() {
  return Math.floor(AUTO_SPEED_BASE_COST * Math.pow(1.15, autoClickSpeedLevel));
}
```

**auto-invest.js:**
```javascript
// Constantes actualizadas
const AUTO_INVEST_COST_MULTIPLIER = 1.5;

// Fórmulas actualizadas
function getAutoInvestIntervalMs() {
  const factor = Math.pow(0.85, autoInvestLevel);
  return Math.max(MIN_INTERVAL_MS, Math.floor(BASE_INTERVAL_MS * factor));
}

function getAutoInvestCost() {
  return Math.floor(AUTO_INVEST_BASE_COST * Math.pow(1.5, autoInvestLevel));
}

// Eliminado: autoInvestCurrentCost (ahora calculado)
```

**objective.js:**
```javascript
// Fórmulas actualizadas
function getObjectiveRequiredPoints() {
  return Math.floor(100 * Math.pow(1.15, objectiveLevel));
}

function getObjectiveCost() {
  return Math.floor(10 * Math.pow(1.1, objectiveLevel));
}
```

**api-client.js:**
```javascript
// Agregado prestigeLevel en collectCurrentGameState()
prestigeLevel: prestigeLevel || 0,

// Eliminado cost de autoInvest
autoInvest: {
  level: autoInvestLevel || 0,
  intervalMs: autoInvestCurrentIntervalMs || 0,
},

// Agregado en applyGameState()
if (typeof state.prestigeLevel === 'number') {
  prestigeLevel = state.prestigeLevel;
  localStorage.setItem('prestigeLevel', prestigeLevel);
}
```

### **Backend:**

**gameModel.js:**
```javascript
// Schema actualizado
const GameStateSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true, unique: true },
  userName: { type: String, required: true, index: true, unique: true },
  points: { type: Number, default: 0 },
  prestigeLevel: { type: Number, default: 0 }, // NUEVO
  autoClick: { type: AutoClickSchema, default: () => ({}) },
  autoInvest: { 
    level: { type: Number, default: 0 },
    intervalMs: { type: Number, default: 0 },
    // Eliminado: cost (ahora calculado)
  },
  objective: { type: ObjectiveSchema, default: () => ({}) },
}, { timestamps: true });
```

---

## ✅ Testing Realizado

### **Verificaciones de Sintaxis:**
```bash
✅ server/index.js - Compilación exitosa
✅ server/gameModel.js - Compilación exitosa
✅ server/gameRoutes.js - Compilación exitosa
✅ Dependencias actualizadas (0 vulnerabilidades)
```

### **Pruebas Funcionales Pendientes:**
- [ ] Progresión early game (niveles 1-5)
- [ ] Costos exponenciales correctos
- [ ] Auto-click speed perceptible
- [ ] Auto-click power multiplicativo
- [ ] Sistema de niveles exponencial
- [ ] Clicks manuales con bonus
- [ ] Sincronización con backend
- [ ] Persistencia de prestigeLevel

---

## 🎯 Próximos Pasos

### **Fase 1: Testing (Actual)**
1. Resetear progreso local
2. Jugar primeros 5 niveles
3. Verificar costos y mejoras
4. Ajustar multiplicadores si es necesario

### **Fase 2: UI de Prestigio**
1. Botón de Prestigio (deshabilitado hasta nivel 10)
2. Modal de confirmación
3. Indicador de puntos de prestigio ganados
4. Visualización de multiplicador actual

### **Fase 3: Estadísticas Extendidas**
1. Mejor run (nivel máximo alcanzado)
2. Total de prestigios realizados
3. Puntos totales lifetime
4. Tiempo total jugado

### **Fase 4: Deployment**
1. Merge a main
2. Deploy backend a Render
3. Deploy frontend a GitHub Pages
4. Actualizar README con nueva economía

---

## 📚 Referencia Rápida

### **Multiplicadores de Costo:**
- Auto-Click Speed: **1.15**
- Auto-Click Power: **1.25**
- Auto-Invest: **1.5**
- Objective Cost: **1.1**
- Objective Required: **1.15**

### **Multiplicadores de Mejora:**
- Auto-Click Speed: **0.95** (5% reducción)
- Auto-Click Power: **+50%** por nivel
- Auto-Invest: **0.85** (15% reducción)
- Prestigio: **+50%** por nivel
- Bonus Nivel: **+1%** por nivel

### **Límites:**
- Auto-Click Speed mínimo: **100ms**
- Auto-Invest mínimo: **5000ms**
- Prestigio desbloqueado: **Nivel 10+**

---

## 🔗 Enlaces Relacionados

- [mejoras.md](../mejoras.md) - Roadmap completo
- [README.md](../README.md) - Documentación general
- [TESTING.md](./TESTING.md) - Guía de pruebas

---

**Última actualización:** 5 de Diciembre de 2025  
**Autor:** Iñaki Garro  
**Estado:** ✅ Implementado, pendiente testing
