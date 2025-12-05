// Lógica de auto click para el juego

// Usamos la función handleClick definida en index.js
// y controlamos desde aquí cuándo y cada cuánto se ejecuta.

const AUTO_CLICK_STORAGE_KEY = 'autoClickState';

// Configuración base
const BASE_INTERVAL_MS = 1000; // 1 segundo
const MIN_INTERVAL_MS = 100; // límite para que no se vuelva ridículo
const BASE_POINTS_PER_TICK = 1;
const AUTO_SPEED_BASE_COST = 50;
const AUTO_SPEED_COST_MULTIPLIER = 1.15; // Crecimiento exponencial
const AUTO_POWER_BASE_COST = 100;
const AUTO_POWER_COST_MULTIPLIER = 1.25; // Crecimiento exponencial más agresivo


let autoClickInterval = null;
let autoClickSpeedLevel = 0; // reduce intervalo entre autoclicks
let autoClickPowerLevel = 0; // aumenta puntos por autoclick
let autoClickCurrentIntervalMs = BASE_INTERVAL_MS; // intervalo actual de ejecución


function getCurrentIntervalMs() {
	// Cada nivel de velocidad reduce un 5% el intervalo, hasta un mínimo
	const factor = Math.pow(0.95, autoClickSpeedLevel); // 5% de reducción por nivel

	return Math.max(MIN_INTERVAL_MS, Math.floor(BASE_INTERVAL_MS * factor));
}

function getPointsPerAutoClick() {
	// Fórmula multiplicativa: Base × (1 + 0.5 × nivel)
	// Nivel 0: 1, Nivel 1: 1.5, Nivel 2: 2, Nivel 3: 2.5, etc.
	const basePoints = BASE_POINTS_PER_TICK;
	const multiplier = 1 + (0.5 * autoClickPowerLevel);
	
	// Aplicar multiplicador de prestigio si existe
	let prestigeMultiplier = 1;
	if (typeof getPrestigeMultiplier === 'function') {
		prestigeMultiplier = getPrestigeMultiplier();
	}
	
	return Math.floor(basePoints * multiplier * prestigeMultiplier);
}

function getAutoSpeedCost() {
	// Costo exponencial: 50 × 1.15^nivel
	return Math.floor(AUTO_SPEED_BASE_COST * Math.pow(AUTO_SPEED_COST_MULTIPLIER, autoClickSpeedLevel));
}

function getAutoPowerCost() {
	// Costo exponencial: 100 × 1.25^nivel
	return Math.floor(AUTO_POWER_BASE_COST * Math.pow(AUTO_POWER_COST_MULTIPLIER, autoClickPowerLevel));
}

function saveAutoClickState() {
	const state = {
		speedLevel: autoClickSpeedLevel,
		powerLevel: autoClickPowerLevel,
		intervalMs: autoClickCurrentIntervalMs,
	};
	localStorage.setItem(AUTO_CLICK_STORAGE_KEY, JSON.stringify(state));
}

function loadAutoClickState() {
	const raw = localStorage.getItem(AUTO_CLICK_STORAGE_KEY);
	if (!raw) return;

	try {
		const state = JSON.parse(raw);
		if (typeof state.speedLevel === 'number' && state.speedLevel >= 0) {
			autoClickSpeedLevel = state.speedLevel;
		}
		if (typeof state.powerLevel === 'number' && state.powerLevel >= 0) {
			autoClickPowerLevel = state.powerLevel;
		}
		if (typeof state.intervalMs === 'number' && state.intervalMs >= MIN_INTERVAL_MS) {
			autoClickCurrentIntervalMs = state.intervalMs;
		}
	} catch (e) {
		// Si falla el parseo, ignoramos y seguimos con valores por defecto
	}
}

function updateAutoClickCostsDisplay() {
	const speedButton = document.getElementById('auto-click-speed-upgrade');
	const powerButton = document.getElementById('auto-click-power-upgrade');
	const speedCostElement = document.getElementById('auto-click-speed-cost');
	const powerCostElement = document.getElementById('auto-click-power-cost');
	
	const speedCost = getAutoSpeedCost();
	const powerCost = getAutoPowerCost();
	const currentPoints = typeof points !== 'undefined' ? points : 0;
	
	if (speedCostElement) {
		speedCostElement.textContent = `Costo: ${speedCost}`;
	}
	if (powerCostElement) {
		powerCostElement.textContent = `Costo: ${powerCost}`;
	}
	
	// Habilitar/deshabilitar botones según puntos disponibles
	if (speedButton) {
		if (currentPoints >= speedCost) {
			speedButton.classList.remove('disabled');
			speedButton.removeAttribute('disabled');
			speedButton.title = `Comprar mejora de velocidad (${speedCost} puntos)`;
		} else {
			speedButton.classList.add('disabled');
			speedButton.setAttribute('disabled', 'true');
			speedButton.title = `Puntos insuficientes. Necesitas ${speedCost}, tienes ${currentPoints}`;
		}
	}
	
	if (powerButton) {
		if (currentPoints >= powerCost) {
			powerButton.classList.remove('disabled');
			powerButton.removeAttribute('disabled');
			powerButton.title = `Comprar mejora de poder (${powerCost} puntos)`;
		} else {
			powerButton.classList.add('disabled');
			powerButton.setAttribute('disabled', 'true');
			powerButton.title = `Puntos insuficientes. Necesitas ${powerCost}, tienes ${currentPoints}`;
		}
	}
}

function restartAutoClickInterval() {
	if (autoClickInterval) {
		clearInterval(autoClickInterval);
	}

	// No tiene sentido arrancar si no hay ningún nivel
	if (autoClickSpeedLevel === 0 && autoClickPowerLevel === 0) {
		autoClickInterval = null;
		return;
	}

	autoClickCurrentIntervalMs = getCurrentIntervalMs();
	const intervalMs = autoClickCurrentIntervalMs;
	const pointsPerTick = getPointsPerAutoClick();

	autoClickInterval = setInterval(() => {
		if (typeof points === 'number') {
			points += pointsPerTick;
			localStorage.setItem('points', points);
			if (typeof updatePointsDisplay === 'function') {
				updatePointsDisplay();
			}
			// Actualizar estadísticas de puntos totales
			if (typeof addToTotalPoints === 'function') {
				addToTotalPoints(pointsPerTick);
			}
			// Mostrar animación de puntos flotantes
			if (typeof showAutoClickPoints === 'function') {
				showAutoClickPoints(pointsPerTick);
			}
		}
	}, intervalMs);

	saveAutoClickState();
}

function buyAutoSpeedUpgrade() {
	if (typeof points === 'undefined') return;
	const cost = getAutoSpeedCost();
	if (points < cost) return;

	points -= cost;
	autoClickSpeedLevel += 1;
	localStorage.setItem('points', points);
	if (typeof updatePointsDisplay === 'function') {
		updatePointsDisplay();
	}
	saveAutoClickState();
	updateAutoClickCostsDisplay();
	restartAutoClickInterval();
	if (typeof scheduleSaveToBackend === 'function') {
		scheduleSaveToBackend();
	}
}

function buyAutoPowerUpgrade() {
	if (typeof points === 'undefined') return;
	const cost = getAutoPowerCost();
	if (points < cost) return;

	points -= cost;
	autoClickPowerLevel += 1;
	localStorage.setItem('points', points);
	if (typeof updatePointsDisplay === 'function') {
		updatePointsDisplay();
	}
	saveAutoClickState();
	updateAutoClickCostsDisplay();
	restartAutoClickInterval();
	if (typeof scheduleSaveToBackend === 'function') {
		scheduleSaveToBackend();
	}
}

// Conectamos los botones cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
	loadAutoClickState();

	const autoSpeedButton = document.getElementById('auto-click-speed-upgrade');
	const autoPowerButton = document.getElementById('auto-click-power-upgrade');
	if (autoSpeedButton) {
		autoSpeedButton.addEventListener('click', buyAutoSpeedUpgrade);
	}
	if (autoPowerButton) {
		autoPowerButton.addEventListener('click', buyAutoPowerUpgrade);
	}

	updateAutoClickCostsDisplay();
	restartAutoClickInterval();
});
