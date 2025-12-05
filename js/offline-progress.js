// Sistema de Progreso Offline
// Calcula puntos ganados mientras el jugador estuvo ausente

let lastActiveTime = Date.now();
let offlineCalculationEnabled = true;

/**
 * Actualiza el timestamp de última actividad
 */
function updateLastActiveTime() {
	lastActiveTime = Date.now();
	localStorage.setItem('lastActiveTime', lastActiveTime.toString());
}

/**
 * Calcula los puntos por segundo actuales del jugador
 */
function calculatePointsPerSecond() {
	// Si no hay auto-click activo, no hay puntos pasivos
	if (typeof autoClickSpeedLevel === 'undefined' || autoClickSpeedLevel === 0) {
		return 0;
	}
	
	// Obtener intervalo y poder del auto-click
	const intervalMs = typeof getCurrentIntervalMs === 'function' 
		? getCurrentIntervalMs() 
		: 1000;
	
	const power = typeof getPointsPerAutoClick === 'function'
		? getPointsPerAutoClick()
		: 1;
	
	// Aplicar multiplicador de prestigio
	const prestigeMultiplier = typeof getPrestigeMultiplier === 'function'
		? getPrestigeMultiplier()
		: 1;
	
	// Aplicar bonus de nivel
	const levelBonus = typeof getLevelBonus === 'function'
		? getLevelBonus()
		: 1;
	
	// Calcular clicks por segundo
	const clicksPerSecond = 1000 / intervalMs;
	
	// Puntos totales por segundo
	return clicksPerSecond * power * prestigeMultiplier * levelBonus;
}

/**
 * Calcula el progreso offline cuando el jugador regresa
 */
function calculateOfflineProgress() {
	if (!offlineCalculationEnabled) return;
	
	const savedLastTime = localStorage.getItem('lastActiveTime');
	if (!savedLastTime) {
		updateLastActiveTime();
		return;
	}
	
	const now = Date.now();
	const timeAway = now - parseInt(savedLastTime);
	
	// Solo calcular si estuvo ausente más de 10 segundos
	// (evitar mostrar modal por cambios de pestaña rápidos)
	if (timeAway < 10000) {
		updateLastActiveTime();
		return;
	}
	
	// Limitar progreso offline a 24 horas (opcional)
	const maxOfflineTime = 24 * 60 * 60 * 1000; // 24 horas
	const cappedTimeAway = Math.min(timeAway, maxOfflineTime);
	
	// Calcular puntos ganados offline
	const secondsAway = Math.floor(cappedTimeAway / 1000);
	const pointsPerSecond = calculatePointsPerSecond();
	
	// Aplicar penalización del 50% a puntos offline (común en juegos idle)
	const offlineEfficiency = 0.5;
	const offlinePoints = Math.floor(pointsPerSecond * secondsAway * offlineEfficiency);
	
	if (offlinePoints > 0) {
		showOfflineRewardModal(secondsAway, offlinePoints, pointsPerSecond);
	}
	
	updateLastActiveTime();
}

/**
 * Formatea el tiempo en texto legible
 */
function formatTimeAway(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	
	let parts = [];
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	if (secs > 0 && hours === 0) parts.push(`${secs}s`);
	
	return parts.join(' ') || '0s';
}

/**
 * Muestra el modal de recompensa offline
 */
function showOfflineRewardModal(seconds, points, pps) {
	const timeText = formatTimeAway(seconds);
	
	const modal = document.createElement('div');
	modal.className = 'offline-modal';
	modal.id = 'offline-modal';
	
	modal.innerHTML = `
		<div class="offline-modal-content">
			<i class="fa-solid fa-clock offline-icon"></i>
			<h2>¡Bienvenido de vuelta!</h2>
			<p>Estuviste ausente por <strong>${timeText}</strong></p>
			
			<div class="offline-stats">
				<div class="offline-stat">
					<span class="offline-stat-label">Producción</span>
					<span class="offline-stat-value">${pps.toFixed(1)} PPS</span>
				</div>
				<div class="offline-stat">
					<span class="offline-stat-label">Eficiencia Offline</span>
					<span class="offline-stat-value">50%</span>
				</div>
			</div>
			
			<div class="offline-reward">
				<span class="offline-points">+${points.toLocaleString()}</span>
				<span class="offline-label">Puntos ganados</span>
			</div>
			
			<button class="offline-claim-btn" id="claim-offline-btn">
				<i class="fa-solid fa-gift"></i> Reclamar Recompensa
			</button>
			
			<p class="offline-note">
				💡 Tip: Mejora tu Auto-Click para ganar más puntos offline
			</p>
		</div>
	`;
	
	document.body.appendChild(modal);
	
	// Activar modal con animación
	setTimeout(() => modal.classList.add('active'), 10);
	
	// Event listener para reclamar
	document.getElementById('claim-offline-btn').addEventListener('click', () => {
		claimOfflineReward(points);
	});
}

/**
 * Reclama la recompensa offline
 */
function claimOfflineReward(offlinePoints) {
	// Agregar puntos
	if (typeof points !== 'undefined') {
		points += offlinePoints;
		localStorage.setItem('points', points);
		
		// Actualizar display
		if (typeof updatePointsDisplay === 'function') {
			updatePointsDisplay();
		}
		
		// Mostrar animación de puntos ganados
		if (typeof createFloatingPoints === 'function') {
			const claimBtn = document.getElementById('claim-offline-btn');
			if (claimBtn) {
				createFloatingPoints(offlinePoints, claimBtn, 'offline');
			}
		}
		
		// Guardar en backend
		if (typeof scheduleSaveToBackend === 'function') {
			scheduleSaveToBackend();
		}
	}
	
	// Cerrar modal con animación
	const modal = document.getElementById('offline-modal');
	if (modal) {
		modal.classList.remove('active');
		setTimeout(() => modal.remove(), 300);
	}
}

/**
 * Actualiza el timestamp periódicamente mientras el jugador está activo
 */
function startOfflineTracking() {
	// Actualizar cada 15 segundos
	setInterval(updateLastActiveTime, 15000);
}

/**
 * Detecta cuando la pestaña se vuelve visible/invisible
 */
function setupVisibilityTracking() {
	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) {
			// Pestaña visible - calcular progreso offline
			calculateOfflineProgress();
		} else {
			// Pestaña oculta - guardar timestamp
			updateLastActiveTime();
		}
	});
	
	// También detectar cuando la ventana pierde/gana foco
	window.addEventListener('blur', () => {
		updateLastActiveTime();
	});
	
	window.addEventListener('focus', () => {
		calculateOfflineProgress();
	});
}

/**
 * Inicializar sistema de progreso offline
 */
function initOfflineProgress() {
	// Calcular progreso offline al cargar
	calculateOfflineProgress();
	
	// Iniciar tracking de actividad
	startOfflineTracking();
	
	// Configurar detección de visibilidad
	setupVisibilityTracking();
	
	console.log('✅ Sistema de progreso offline inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initOfflineProgress);
} else {
	initOfflineProgress();
}

// Exportar funciones al scope global
window.calculatePointsPerSecond = calculatePointsPerSecond;
window.claimOfflineReward = claimOfflineReward;
window.updateLastActiveTime = updateLastActiveTime;
