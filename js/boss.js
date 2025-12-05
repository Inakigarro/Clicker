// Sistema de Combate contra Jefes para Prestigio

// Configuración de jefes
const BOSS_CONFIG = {
	initialLevels: [10, 25, 50, 75, 100], // Primeros jefes
	recurringInterval: 25, // Después del nivel 100, cada 25 niveles
	baseHP: 10000,
	hpMultiplier: 1.5,
	baseTime: 30, // segundos
};

/**
 * Determina si un nivel es un nivel de jefe
 */
function isBossLevel(level) {
	// Primeros niveles específicos
	if (BOSS_CONFIG.initialLevels.includes(level)) {
		return true;
	}
	
	// Después del nivel 100, cada 25 niveles
	if (level > 100 && level % BOSS_CONFIG.recurringInterval === 0) {
		return true;
	}
	
	return false;
}

/**
 * Calcula el índice del jefe para escalar dificultad
 */
function getBossIndex(level) {
	const initialLevels = BOSS_CONFIG.initialLevels;
	const idx = initialLevels.indexOf(level);
	
	if (idx !== -1) {
		return idx;
	}
	
	// Para niveles recurrentes después de 100
	if (level > 100) {
		const additionalBosses = Math.floor((level - 100) / BOSS_CONFIG.recurringInterval);
		return initialLevels.length + additionalBosses;
	}
	
	return 0;
}

// Configuración de armas
const WEAPONS = {
	rapid: {
		name: 'Click Rápido',
		baseDamage: 100,
		cooldown: 0.5, // segundos
		icon: 'fa-gauge-high'
	},
	heavy: {
		name: 'Golpe Fuerte',
		baseDamage: 500,
		cooldown: 2,
		icon: 'fa-bolt'
	},
	tactical: {
		name: 'Inversión Táctica',
		baseDamage: 2000,
		cooldown: 5,
		icon: 'fa-bullseye'
	}
};

// Estado del combate
let bossState = {
	active: false,
	currentHP: 0,
	maxHP: 0,
	timeRemaining: 0,
	timerInterval: null,
	weaponCooldowns: {
		rapid: 0,
		heavy: 0,
		tactical: 0
	},
	lastBossLevel: 0 // Último nivel donde se venció un jefe
};

/**
 * Verifica si el jugador ha alcanzado un nivel de jefe
 */
function checkForBossEncounter() {
	if (typeof objectiveLevel === 'undefined') return;
	
	// Verificar si alcanzamos un nivel de jefe y no lo hemos enfrentado
	const shouldTriggerBoss = isBossLevel(objectiveLevel) && 
	                          objectiveLevel > bossState.lastBossLevel;
	
	if (shouldTriggerBoss && !bossState.active) {
		startBossEncounter();
	}
}

/**
 * Inicia el encuentro contra el jefe
 */
function startBossEncounter() {
	if (typeof objectiveLevel === 'undefined') return;
	
	// Calcular HP del jefe basado en el índice (escala infinitamente)
	const bossIndex = getBossIndex(objectiveLevel);
	bossState.maxHP = Math.floor(BOSS_CONFIG.baseHP * Math.pow(BOSS_CONFIG.hpMultiplier, bossIndex));
	bossState.currentHP = bossState.maxHP;
	bossState.timeRemaining = BOSS_CONFIG.baseTime;
	bossState.active = true;
	
	// Reiniciar cooldowns
	bossState.weaponCooldowns = { rapid: 0, heavy: 0, tactical: 0 };
	
	// Mostrar modal
	showBossModal();
	
	// Iniciar timer
	startBossTimer();
	
	// Actualizar UI
	updateBossUI();
	updateWeaponDamage();
}

/**
 * Muestra el modal de combate
 */
function showBossModal() {
	const modal = document.getElementById('boss-modal');
	const title = document.getElementById('boss-title');
	const bossName = document.getElementById('boss-name');
	
	if (modal) {
		modal.classList.add('active');
		
		if (title) {
			title.textContent = `¡Jefe de Nivel ${objectiveLevel}!`;
		}
		
		if (bossName) {
			bossName.textContent = `Boss Nivel ${objectiveLevel}`;
		}
	}
}

/**
 * Oculta el modal de combate
 */
function hideBossModal() {
	const modal = document.getElementById('boss-modal');
	if (modal) {
		modal.classList.remove('active');
	}
	bossState.active = false;
	
	if (bossState.timerInterval) {
		clearInterval(bossState.timerInterval);
		bossState.timerInterval = null;
	}
}

/**
 * Inicia el temporizador del combate
 */
function startBossTimer() {
	if (bossState.timerInterval) {
		clearInterval(bossState.timerInterval);
	}
	
	bossState.timerInterval = setInterval(() => {
		bossState.timeRemaining--;
		
		const timerDisplay = document.getElementById('boss-timer-display');
		const timerContainer = document.querySelector('.boss-timer');
		
		if (timerDisplay) {
			timerDisplay.textContent = bossState.timeRemaining;
		}
		
		// Advertencia cuando queda poco tiempo
		if (bossState.timeRemaining <= 10 && timerContainer) {
			timerContainer.classList.add('warning');
		}
		
		// Tiempo agotado
		if (bossState.timeRemaining <= 0) {
			defeatBoss();
		}
	}, 1000);
}

/**
 * Actualiza la UI del jefe
 */
function updateBossUI() {
	const hpBar = document.getElementById('boss-hp-bar');
	const hpText = document.getElementById('boss-hp-text');
	
	if (hpBar) {
		const hpPercent = (bossState.currentHP / bossState.maxHP) * 100;
		hpBar.style.width = `${hpPercent}%`;
	}
	
	if (hpText) {
		hpText.textContent = `${Math.max(0, bossState.currentHP)} / ${bossState.maxHP}`;
	}
}

/**
 * Calcula el daño de un arma basado en las mejoras del jugador
 */
function calculateWeaponDamage(weaponType) {
	const weapon = WEAPONS[weaponType];
	let damage = weapon.baseDamage;
	
	// Escalado según mejoras
	switch(weaponType) {
		case 'rapid':
			// Basado en Auto-Click Speed
			if (typeof autoClickSpeedLevel !== 'undefined') {
				damage += autoClickSpeedLevel * 10;
			}
			break;
		case 'heavy':
			// Basado en Auto-Click Power
			if (typeof autoClickPowerLevel !== 'undefined') {
				damage += autoClickPowerLevel * 50;
			}
			break;
		case 'tactical':
			// Basado en Nivel de Objetivo
			if (typeof objectiveLevel !== 'undefined') {
				damage += objectiveLevel * 100;
			}
			break;
	}
	
	return Math.floor(damage);
}

/**
 * Actualiza el daño mostrado en los botones de armas
 */
function updateWeaponDamage() {
	Object.keys(WEAPONS).forEach(weaponType => {
		const damageElement = document.getElementById(`damage-${weaponType}`);
		if (damageElement) {
			const damage = calculateWeaponDamage(weaponType);
			damageElement.textContent = damage;
		}
	});
}

/**
 * Usa un arma contra el jefe
 */
function useWeapon(weaponType) {
	if (!bossState.active) return;
	if (bossState.weaponCooldowns[weaponType] > 0) return;
	
	const damage = calculateWeaponDamage(weaponType);
	
	// Aplicar daño
	bossState.currentHP -= damage;
	
	// Mostrar feedback visual (puedes agregar animación aquí)
	showDamageNumber(damage);
	
	// Actualizar UI
	updateBossUI();
	
	// Iniciar cooldown
	const weapon = WEAPONS[weaponType];
	bossState.weaponCooldowns[weaponType] = weapon.cooldown;
	startWeaponCooldown(weaponType);
	
	// Verificar victoria
	if (bossState.currentHP <= 0) {
		victoryBoss();
	}
}

/**
 * Inicia el cooldown visual de un arma
 */
function startWeaponCooldown(weaponType) {
	const button = document.getElementById(`weapon-${weaponType}`);
	const cooldownBar = document.getElementById(`cooldown-${weaponType}`);
	
	if (button) {
		button.disabled = true;
	}
	
	if (cooldownBar) {
		const weapon = WEAPONS[weaponType];
		cooldownBar.style.transition = `width ${weapon.cooldown}s linear`;
		cooldownBar.style.width = '100%';
		
		setTimeout(() => {
			cooldownBar.style.transition = 'none';
			cooldownBar.style.width = '0%';
			if (button) {
				button.disabled = false;
			}
			bossState.weaponCooldowns[weaponType] = 0;
		}, weapon.cooldown * 1000);
	}
}

/**
 * Muestra número de daño flotante
 */
function showDamageNumber(damage) {
	const messageEl = document.getElementById('boss-message');
	if (messageEl) {
		messageEl.textContent = `-${damage} HP!`;
		messageEl.style.color = '#ff6b6b';
		
		setTimeout(() => {
			if (bossState.active) {
				messageEl.textContent = '';
			}
		}, 500);
	}
}

/**
 * Victoria contra el jefe
 */
function victoryBoss() {
	if (bossState.timerInterval) {
		clearInterval(bossState.timerInterval);
	}
	
	// Marcar este nivel como completado
	bossState.lastBossLevel = objectiveLevel;
	localStorage.setItem('lastBossLevel', bossState.lastBossLevel);
	
	// Cerrar modal de combate
	hideBossModal();
	
	// Mostrar modal de recompensa/prestigio
	setTimeout(() => {
		showPrestigeRewardModal();
	}, 500);
}

/**
 * Derrota (tiempo agotado)
 */
function defeatBoss() {
	if (bossState.timerInterval) {
		clearInterval(bossState.timerInterval);
	}
	
	const messageEl = document.getElementById('boss-message');
	if (messageEl) {
		messageEl.textContent = 'Tiempo agotado... ¡Inténtalo de nuevo!';
		messageEl.className = 'boss-message defeat';
	}
	
	// Cerrar modal después de 3 segundos
	setTimeout(() => {
		hideBossModal();
	}, 3000);
}

/**
 * Actualiza el display de prestigio en la UI
 */
function updatePrestigeDisplay() {
	const prestigeDisplay = document.getElementById('prestige-level-display');
	const statPrestigeLevel = document.getElementById('stat-prestige-level');
	const statPrestigeMultiplier = document.getElementById('stat-prestige-multiplier');
	
	if (prestigeDisplay) {
		prestigeDisplay.textContent = prestigeLevel;
	}
	
	if (statPrestigeLevel) {
		statPrestigeLevel.textContent = prestigeLevel;
	}
	
	if (statPrestigeMultiplier) {
		const multiplier = getPrestigeMultiplier();
		statPrestigeMultiplier.textContent = `×${multiplier.toFixed(1)}`;
	}
}

/**
 * Muestra el modal de recompensa por derrotar al jefe
 */
function showPrestigeRewardModal() {
	const modal = document.getElementById('prestige-reward-modal');
	if (!modal) return;
	
	const currentLevel = objectiveLevel;
	const newPrestigeLevel = prestigeLevel + 1;
	const newMultiplier = 1 + (newPrestigeLevel * 0.5);
	
	// Actualizar contenido del modal
	document.getElementById('current-level-display').textContent = currentLevel;
	document.getElementById('new-prestige-level').textContent = newPrestigeLevel;
	document.getElementById('current-prestige-level').textContent = prestigeLevel;
	document.getElementById('new-multiplier').textContent = `×${newMultiplier.toFixed(1)}`;
	document.getElementById('current-multiplier').textContent = `×${getPrestigeMultiplier().toFixed(1)}`;
	
	modal.classList.add('active');
}

/**
 * Oculta el modal de recompensa
 */
function hidePrestigeRewardModal() {
	const modal = document.getElementById('prestige-reward-modal');
	if (modal) {
		modal.classList.remove('active');
	}
}

/**
 * Acepta el prestigio y resetea el juego
 */
function acceptPrestige() {
	// Incrementar prestigio
	prestigeLevel++;
	localStorage.setItem('prestigeLevel', prestigeLevel);
	
	// Resetear todo el progreso
	points = 0;
	localStorage.setItem('points', '0');
	
	// Resetear auto-click
	if (typeof autoClickSpeedLevel !== 'undefined') {
		autoClickSpeedLevel = 0;
		localStorage.setItem('autoClickSpeedLevel', '0');
	}
	if (typeof autoClickPowerLevel !== 'undefined') {
		autoClickPowerLevel = 0;
		localStorage.setItem('autoClickPowerLevel', '0');
	}
	
	// Resetear auto-invest
	if (typeof autoInvestLevel !== 'undefined') {
		autoInvestLevel = 0;
		localStorage.setItem('autoInvestLevel', '0');
	}
	
	// Resetear objetivos
	if (typeof objectiveLevel !== 'undefined') {
		objectiveLevel = 1;
		objectiveProgress = 0;
		localStorage.setItem('objectiveLevel', '1');
		localStorage.setItem('objectiveProgress', '0');
	}
	
	// Limpiar último jefe vencido para permitir enfrentar jefes desde nivel 10 de nuevo
	bossState.lastBossLevel = 0;
	localStorage.setItem('lastBossLevel', '0');
	
	// Ocultar modal
	hidePrestigeRewardModal();
	
	// Mostrar mensaje de guardando
	showPrestigeConfirmation(prestigeLevel, true);
	
	// Guardar en backend de forma inmediata (NO debounced)
	if (typeof saveGameStateToBackend === 'function' && typeof collectCurrentGameState === 'function' && typeof currentUserId !== 'undefined') {
		const currentState = collectCurrentGameState();
		saveGameStateToBackend(currentUserId, currentState)
			.then((success) => {
				if (success) {
					console.log('✅ Progreso de prestigio guardado exitosamente');
					// Recargar la página después de guardar
					setTimeout(() => {
						location.reload();
					}, 1000);
				} else {
					console.error('❌ Error al guardar prestigio en backend');
					// Recargar de todas formas (localStorage está actualizado)
					setTimeout(() => {
						location.reload();
					}, 1000);
				}
			})
			.catch((error) => {
				console.error('❌ Error al guardar prestigio:', error);
				// Recargar de todas formas
				setTimeout(() => {
					location.reload();
				}, 1000);
			});
	} else {
		// Si no hay backend, solo recargar
		setTimeout(() => {
			location.reload();
		}, 2000);
	}
}

/**
 * Rechaza el prestigio y continúa jugando
 */
function declinePrestige() {
	hidePrestigeRewardModal();
	
	// Mostrar mensaje de que puede intentarlo en el próximo jefe
	const notification = document.createElement('div');
	notification.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem 2rem;
		border-radius: 12px;
		font-size: 1.1rem;
		z-index: 10001;
		box-shadow: 0 10px 30px rgba(0,0,0,0.3);
		text-align: center;
	`;
	notification.textContent = '¡Sigue jugando! Podrás resetear en el próximo jefe.';
	document.body.appendChild(notification);
	
	setTimeout(() => {
		notification.remove();
	}, 3000);
}

/**
 * Muestra confirmación de prestigio obtenido
 */
function showPrestigeConfirmation(level, isSaving = false) {
	const notification = document.createElement('div');
	notification.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
		color: #1a1a2e;
		padding: 2rem 3rem;
		border-radius: 16px;
		font-size: 1.3rem;
		font-weight: bold;
		z-index: 10001;
		box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5);
		text-align: center;
		border: 3px solid #ffd700;
	`;
	
	if (isSaving) {
		notification.innerHTML = `
			<i class="fa-solid fa-crown" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
			¡Nivel de Prestigio ${level} Alcanzado!<br>
			<span style="font-size: 0.9rem; opacity: 0.8;">
				<i class="fa-solid fa-spinner fa-spin"></i> Guardando progreso...
			</span>
		`;
	} else {
		notification.innerHTML = `
			<i class="fa-solid fa-crown" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
			¡Nivel de Prestigio ${level} Alcanzado!<br>
			<span style="font-size: 0.9rem; opacity: 0.8;">Reiniciando juego...</span>
		`;
	}
	document.body.appendChild(notification);
}

// Event listeners para los botones de armas
window.addEventListener('DOMContentLoaded', () => {
	// Cargar último nivel de jefe vencido
	const savedLastBossLevel = localStorage.getItem('lastBossLevel');
	if (savedLastBossLevel) {
		bossState.lastBossLevel = parseInt(savedLastBossLevel);
	}
	
	// Botones de armas
	document.getElementById('weapon-rapid')?.addEventListener('click', () => useWeapon('rapid'));
	document.getElementById('weapon-heavy')?.addEventListener('click', () => useWeapon('heavy'));
	document.getElementById('weapon-tactical')?.addEventListener('click', () => useWeapon('tactical'));
	
	// Botones de prestigio
	document.getElementById('accept-prestige-btn')?.addEventListener('click', acceptPrestige);
	document.getElementById('decline-prestige-btn')?.addEventListener('click', declinePrestige);
	
	// Actualizar display inicial de prestigio
	updatePrestigeDisplay();
});
