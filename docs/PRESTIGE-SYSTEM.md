# 🏆 Sistema de Prestigio y Jefes Recurrentes

## 📋 Resumen del Sistema

El sistema de prestigio permite a los jugadores **resetear su progreso a cambio de multiplicadores permanentes** que hacen más eficiente cada nueva partida.

---

## 🎯 Mecánica de Jefes

### Niveles de Jefes

**Primeros 5 Jefes (fijos):**
- Nivel 10
- Nivel 25
- Nivel 50
- Nivel 75
- Nivel 100

**Jefes Recurrentes (infinitos):**
- A partir del nivel 100, aparece un jefe **cada 25 niveles**
- Niveles: 125, 150, 175, 200, 225, 250...
- **Sin límite superior**

### Dificultad Escalada

La dificultad de cada jefe aumenta progresivamente usando un **índice de jefe**:

```
HP del Jefe = 10,000 × (1.5 ^ índice_del_jefe)
```

**Ejemplos:**
- Jefe Nivel 10 (índice 0): **10,000 HP**
- Jefe Nivel 25 (índice 1): **15,000 HP**
- Jefe Nivel 50 (índice 2): **22,500 HP**
- Jefe Nivel 75 (índice 3): **33,750 HP**
- Jefe Nivel 100 (índice 4): **50,625 HP**
- Jefe Nivel 125 (índice 5): **75,937 HP**
- Jefe Nivel 150 (índice 6): **113,906 HP**
- Y así infinitamente...

---

## 💎 Sistema de Prestigio

### Cómo Funciona

1. **Derrota un Jefe**: Al vencer a un jefe, aparece un **modal de decisión**

2. **Tienes 2 Opciones:**

   **A) Resetear y Ganar Prestigio:**
   - ✅ +1 Nivel de Prestigio
   - ✅ +50% multiplicador permanente
   - ❌ Se resetea TODO el progreso:
     - Puntos → 0
     - Auto-Click Speed → 0
     - Auto-Click Power → 0
     - Auto-Invest → 0
     - Nivel Objetivo → 1
   - 🔄 El juego se reinicia

   **B) Continuar Jugando:**
   - ✅ Sigues con tu progreso actual
   - ✅ Puedes seguir subiendo de nivel
   - ℹ️ Podrás elegir prestigio en el **próximo jefe**

### Multiplicador de Prestigio

El multiplicador afecta **TODOS los puntos que ganas**:

```
Puntos Ganados = Puntos Base × (1 + Prestigio × 0.5)
```

**Ejemplos:**
- Prestigio 0: ×1.0 (sin bonus)
- Prestigio 1: ×1.5 (+50%)
- Prestigio 2: ×2.0 (+100%)
- Prestigio 3: ×2.5 (+150%)
- Prestigio 5: ×3.5 (+250%)
- Prestigio 10: ×6.0 (+500%)

---

## 🎮 Flujo de Juego

### Primera Partida (Sin Prestigio)

```
1. Juegas hasta nivel 10
2. Aparece el primer jefe
3. Lo derrotas en combate (30 segundos)
4. Modal de decisión aparece:
   - "Resetear y Ganar Prestigio" → Prestigio 1, reinicio
   - "Continuar Jugando" → Sigues hasta nivel 25
```

### Con Prestigio

```
Prestigio 1 activo (×1.5 multiplicador)
↓
Todos tus clicks dan 1.5× puntos
↓
Progresas más rápido
↓
Llegas a nivel 10 más rápido
↓
Derrotas jefe → Opción de Prestigio 2
↓
Si reseteas: ×2.0 multiplicador
```

### Loop Infinito

```
Nivel 10 → Jefe → Prestigio opcional
Nivel 25 → Jefe → Prestigio opcional
Nivel 50 → Jefe → Prestigio opcional
Nivel 75 → Jefe → Prestigio opcional
Nivel 100 → Jefe → Prestigio opcional
Nivel 125 → Jefe → Prestigio opcional
Nivel 150 → Jefe → Prestigio opcional
...
∞
```

---

## 📊 Estrategias de Juego

### Estrategia Early Game (Niveles 1-50)

- **Resetear en nivel 10**: Ganar prestigio rápido
- **Ventaja**: Multiplicador temprano
- **Desventaja**: Progresas poco antes de resetear

### Estrategia Mid Game (Niveles 50-100)

- **Esperar hasta nivel 50-75**: Acumular mejoras
- **Ventaja**: Mayor progreso antes de resetear
- **Desventaja**: Tarda más en conseguir prestigio

### Estrategia Late Game (Nivel 100+)

- **Grindear jefes recurrentes**: Maximizar prestigio
- Cada 25 niveles = nueva oportunidad de prestigio
- Con multiplicadores altos, llegas rápido a cada jefe

---

## 🔧 Detalles Técnicos

### Variables Reseteadas

Al aceptar prestigio, se resetean:
```javascript
points = 0
autoClickSpeedLevel = 0
autoClickPowerLevel = 0
autoInvestLevel = 0
objectiveLevel = 1
objectiveProgress = 0
lastBossLevel = 0 // Permite enfrentar jefes desde nivel 10 de nuevo
```

### Variables Persistentes

Estas NO se resetean:
```javascript
prestigeLevel // Tu nivel de prestigio
userId // Tu ID de usuario
userName // Tu nombre
themePreference // Tema claro/oscuro
```

### Sincronización con Backend

- El prestigio se **guarda en MongoDB**
- Se sincroniza automáticamente
- Puedes jugar desde diferentes dispositivos
- Tu prestigio se mantiene

---

## 🎨 Interfaz de Usuario

### Modal de Combate (Sin Cambios)

- Aparece al alcanzar nivel de jefe
- 30 segundos para derrotarlo
- 3 armas con diferentes cooldowns
- Barra de HP del jefe

### Modal de Prestigio (NUEVO)

Después de victoria, muestra:

```
╔═══════════════════════════════════╗
║        🎮 ¡Jefe Derrotado!       ║
╠═══════════════════════════════════╣
║  Has alcanzado el Nivel 10       ║
║                                   ║
║  Prestigio: 0 → 1                ║
║  Multiplicador: ×1.0 → ×1.5      ║
║                                   ║
║  [Resetear y Ganar Prestigio]    ║
║  [Continuar Jugando]             ║
╚═══════════════════════════════════╝
```

---

## ❓ FAQs

### ¿Qué pasa si rechazo el prestigio?

Continúas jugando normalmente. En el próximo jefe (nivel 25, 50, etc.) tendrás otra oportunidad.

### ¿Puedo "saltarme" jefes?

No. Debes derrotar cada jefe para continuar. Si no lo derrotas en 30 segundos, puedes reintentarlo.

### ¿El prestigio afecta a las mejoras automáticas?

Sí, el multiplicador afecta **todos** los puntos ganados, incluyendo:
- Clicks manuales
- Auto-clicks
- Cualquier fuente de puntos

### ¿Hay límite de prestigio?

**No hay límite**. Con jefes recurrentes cada 25 niveles, puedes acumular prestigio infinitamente.

### ¿Qué pasa con mi progreso en el backend?

Al resetear, tu nuevo estado (con prestigio aumentado y todo en 0) se guarda en MongoDB automáticamente.

---

## 🚀 Roadmap Futuro

Posibles mejoras para el sistema:

- **Achievements por prestigio**: Logros al alcanzar ciertos niveles
- **Skin de armas**: Desbloqueables con prestigio alto
- **Jefes especiales**: Cada 100 niveles, jefes únicos
- **Bonus por racha**: Ganar prestigio consecutivo sin rechazar
- **Modo desafío**: Resetear cada X jefes obligatoriamente

---

## 📈 Matemática del Prestigio

### Tiempo para Alcanzar Niveles con Prestigio

Sin prestigio vs Con prestigio:

| Nivel | Sin Prestigio | Prestigio 3 (×2.5) | Mejora |
|-------|--------------|-------------------|---------|
| 10 | ~10 min | ~4 min | 60% más rápido |
| 25 | ~30 min | ~12 min | 60% más rápido |
| 50 | ~2 horas | ~48 min | 60% más rápido |
| 100 | ~8 horas | ~3.2 horas | 60% más rápido |

### Puntos Totales con Prestigio

Ejemplo: 1000 puntos ganados en una sesión

| Prestigio | Multiplicador | Puntos Reales |
|-----------|--------------|---------------|
| 0 | ×1.0 | 1,000 |
| 1 | ×1.5 | 1,500 |
| 2 | ×2.0 | 2,000 |
| 5 | ×3.5 | 3,500 |
| 10 | ×6.0 | 6,000 |

---

*Sistema implementado el 5 de Diciembre de 2025*
*Versión: 2.0.0*
