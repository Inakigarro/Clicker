// Estadísticas del juego
let gameStats = {
	totalPoints: 0,
	manualClicks: 0,
	investedPoints: 0,
	startTime: Date.now(),
};

// Cargar estadísticas desde localStorage
function loadStats() {
	const savedStats = localStorage.getItem('gameStats');
	if (savedStats) {
		gameStats = JSON.parse(savedStats);
	}
}

// Guardar estadísticas en localStorage
function saveStats() {
	localStorage.setItem('gameStats', JSON.stringify(gameStats));
}

// Incrementar clicks manuales
function incrementManualClicks() {
	gameStats.manualClicks++;
	saveStats();
}

// Agregar puntos al total
function addToTotalPoints(amount) {
	gameStats.totalPoints += amount;
	saveStats();
}

// Agregar puntos invertidos
function addToInvestedPoints(amount) {
	gameStats.investedPoints += amount;
	saveStats();
}

// Calcular puntos por segundo (PPS)
function calculatePPS() {
	let pps = 0;
	
	// Puntos del auto-click
	if (typeof autoClickInterval !== 'undefined' && autoClickInterval && typeof autoClickPower !== 'undefined') {
		// autoClickSpeed determina el intervalo en ms
		// Por cada segundo (1000ms), calculamos cuántos clicks hay
		const clicksPerSecond = 1000 / autoClickSpeed;
		pps += clicksPerSecond * autoClickPower;
	}
	
	// Puntos del auto-invest (si está activo)
	if (typeof autoInvestActive !== 'undefined' && autoInvestActive && typeof autoInvestRate !== 'undefined') {
		// autoInvestRate es cada cuántos ms invierte
		// Puntos invertidos por segundo
		const investsPerSecond = 1000 / autoInvestRate;
		// Cada inversión usa puntos del juego, no genera
		// No suma al PPS directamente, pero podemos mostrar la tasa
	}
	
	return pps.toFixed(1);
}

// Formatear tiempo de juego
function formatPlayTime() {
	const elapsed = Date.now() - gameStats.startTime;
	const minutes = Math.floor(elapsed / 60000);
	const hours = Math.floor(minutes / 60);
	
	if (hours > 0) {
		const remainingMinutes = minutes % 60;
		return `${hours}h ${remainingMinutes}m`;
	}
	return `${minutes}m`;
}

// Actualizar todas las estadísticas en la UI
function updateStatsDisplay() {
	// Puntos totales acumulados
	const statTotalPoints = document.getElementById('stat-total-points');
	if (statTotalPoints) {
		statTotalPoints.textContent = gameStats.totalPoints.toLocaleString();
	}
	
	// PPS
	const statPPS = document.getElementById('stat-pps');
	if (statPPS) {
		statPPS.textContent = calculatePPS();
	}
	
	// Clicks manuales
	const statManualClicks = document.getElementById('stat-manual-clicks');
	if (statManualClicks) {
		statManualClicks.textContent = gameStats.manualClicks.toLocaleString();
	}
	
	// Nivel actual
	const statCurrentLevel = document.getElementById('stat-current-level');
	if (statCurrentLevel && typeof objectiveLevel !== 'undefined') {
		statCurrentLevel.textContent = objectiveLevel;
	}
	
	// Auto-click speed
	const statAutoClickSpeed = document.getElementById('stat-autoclick-speed');
	if (statAutoClickSpeed && typeof autoClickSpeedLevel !== 'undefined') {
		statAutoClickSpeed.textContent = autoClickSpeedLevel;
	}
	
	// Auto-click power
	const statAutoClickPower = document.getElementById('stat-autoclick-power');
	if (statAutoClickPower && typeof autoClickPowerLevel !== 'undefined') {
		statAutoClickPower.textContent = autoClickPowerLevel;
	}
	
	// Puntos invertidos
	const statInvestedPoints = document.getElementById('stat-invested-points');
	if (statInvestedPoints) {
		statInvestedPoints.textContent = gameStats.investedPoints.toLocaleString();
	}
	
	// Tiempo de juego
	const statPlayTime = document.getElementById('stat-play-time');
	if (statPlayTime) {
		statPlayTime.textContent = formatPlayTime();
	}
}

// Inicializar estadísticas
loadStats();

// Actualizar estadísticas cada segundo
setInterval(() => {
	updateStatsDisplay();
}, 1000);

// Actualizar inmediatamente al cargar
updateStatsDisplay();
