// Lógica de auto click para el juego

// Usamos la función handleClick definida en index.js
// y controlamos desde aquí cuándo y cada cuánto se ejecuta.

const AUTO_CLICK_STORAGE_KEY = 'autoClickState';

// Configuración base
const BASE_INTERVAL_MS = 1000; // 1 segundo
const MIN_INTERVAL_MS = 100; // límite para que no se vuelva ridículo
const BASE_POINTS_PER_TICK = 1;
const AUTO_SPEED_BASE_COST = 50;
const AUTO_POWER_BASE_COST = 75;


let autoClickInterval = null;
let autoClickSpeedLevel = 0; // reduce intervalo entre autoclicks
let autoClickPowerLevel = 0; // aumenta puntos por autoclick
let autoClickCurrentIntervalMs = BASE_INTERVAL_MS; // intervalo actual de ejecución


function getCurrentIntervalMs() {
	// Cada nivel de velocidad reduce un 1% el intervalo, hasta un mínimo
	const factor = Math.pow(0.99, autoClickSpeedLevel); // 0.99, 0.9801, 0.970299...

	return Math.max(MIN_INTERVAL_MS, Math.floor(BASE_INTERVAL_MS * factor));
}

function getPointsPerAutoClick() {
	// Cada nivel de poder suma +1 punto por tick
	return BASE_POINTS_PER_TICK + autoClickPowerLevel;
}

function getAutoSpeedCost() {
	return AUTO_SPEED_BASE_COST * (autoClickSpeedLevel + 1);
}

function getAutoPowerCost() {
	return AUTO_POWER_BASE_COST * (autoClickPowerLevel + 1);
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
	const speedCostElement = document.getElementById('auto-click-speed-cost');
	const powerCostElement = document.getElementById('auto-click-power-cost');
	if (speedCostElement) {
		speedCostElement.textContent = `Costo: ${getAutoSpeedCost()}`;
	}
	if (powerCostElement) {
		powerCostElement.textContent = `Costo: ${getAutoPowerCost()}`;
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
