const AUTO_INVEST_STORAGE_KEY = 'autoInvestState';
const AUTO_INVEST_BASE_INTERVAL_MS = 30000; // 30 segundos
const AUTO_INVEST_MIN_INTERVAL_MS = 5000; // no bajar de 5s para no romper el juego
const AUTO_INVEST_BASE_COST = 1000; // costo inicial mínimo
const AUTO_INVEST_COST_MULTIPLIER = 1.5; // Crecimiento exponencial agresivo


let autoInvestInterval = null;
let autoInvestLevel = 0; // aumenta puntos invertidos automáticamente
let autoInvestCurrentIntervalMs = AUTO_INVEST_BASE_INTERVAL_MS; // intervalo actual de ejecución

function getAutoInvestIntervalMs() {
    // Reducimos el intervalo 15% por nivel, limitado a un mínimo
    const factor = Math.pow(0.85, autoInvestLevel); // 15% de reducción por nivel
    const interval = AUTO_INVEST_BASE_INTERVAL_MS * factor;
    return Math.max(AUTO_INVEST_MIN_INTERVAL_MS, Math.floor(interval));
}

function getAutoInvestCost() {
    // Costo exponencial: 1000 × 1.5^nivel
    return Math.floor(AUTO_INVEST_BASE_COST * Math.pow(AUTO_INVEST_COST_MULTIPLIER, autoInvestLevel));
}

function performAutoInvestTick() {
    if (typeof getObjectiveCost !== 'function') return;
    if (typeof investInObjective !== 'function') return;

    const cost = getObjectiveCost();

    if (typeof points === 'number' && points >= cost) {
        investInObjective();
    }
}

function saveAutoInvestState() {
    const state = {
        level: autoInvestLevel,
        intervalMs: autoInvestCurrentIntervalMs,
    };
    localStorage.setItem(AUTO_INVEST_STORAGE_KEY, JSON.stringify(state));
}

function loadAutoInvestState() {
    const raw = localStorage.getItem(AUTO_INVEST_STORAGE_KEY);
    if (!raw) return;

    try {
        const state = JSON.parse(raw);
        if (typeof state.level === 'number' && state.level >= 0) {
            autoInvestLevel = state.level;
        }
        if (
            typeof state.intervalMs === 'number' &&
            state.intervalMs >= AUTO_INVEST_MIN_INTERVAL_MS &&
            state.intervalMs <= AUTO_INVEST_BASE_INTERVAL_MS
        ) {
            autoInvestCurrentIntervalMs = state.intervalMs;
        }
    } catch (e) {
        // ignoramos errores de parseo
    }
}

function restartAutoInvestInterval() {
    if (autoInvestInterval) {
        clearInterval(autoInvestInterval);
    }

    if (autoInvestLevel <= 0) {
        autoInvestInterval = null;
        return;
    }

    autoInvestCurrentIntervalMs = getAutoInvestIntervalMs();
    const intervalMs = autoInvestCurrentIntervalMs;
    autoInvestInterval = setInterval(performAutoInvestTick, intervalMs);

    saveAutoInvestState();
}

function updateAutoInvestUI() {
    const upgradeButton = document.getElementById('auto-invest-upgrade');
    if (!upgradeButton) return;

    const cost = getAutoInvestCost();
    const currentPoints = typeof points !== 'undefined' ? points : 0;
    const labelElement = upgradeButton.querySelector('small');
    
    if (labelElement) {
        labelElement.textContent = `Costo: ${cost}`;
    }
    
    // Habilitar/deshabilitar botón según puntos disponibles
    if (currentPoints >= cost) {
        upgradeButton.classList.remove('disabled');
        upgradeButton.removeAttribute('disabled');
        upgradeButton.title = `Comprar auto-invest (${cost} puntos)`;
    } else {
        upgradeButton.classList.add('disabled');
        upgradeButton.setAttribute('disabled', 'true');
        upgradeButton.title = `Puntos insuficientes. Necesitas ${cost}, tienes ${currentPoints}`;
    }
}

function buyAutoInvestUpgrade() {
    if (typeof points === 'undefined') return;

    const cost = getAutoInvestCost();
    if (points < cost) return;

    points -= cost;
    autoInvestLevel += 1;

    localStorage.setItem('points', points);
    if (typeof updatePointsDisplay === 'function') {
        updatePointsDisplay();
    }

    saveAutoInvestState();
    updateAutoInvestUI();
    restartAutoInvestInterval();
    if (typeof scheduleSaveToBackend === 'function') {
        scheduleSaveToBackend();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAutoInvestState();

    const autoInvestButton = document.getElementById('auto-invest-upgrade');
    if (autoInvestButton) {
        autoInvestButton.addEventListener('click', buyAutoInvestUpgrade);
    }

    updateAutoInvestUI();
    restartAutoInvestInterval();
});