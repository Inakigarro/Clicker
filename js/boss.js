// Sistema de Combate contra Jefes para Prestigio

// Configuración de jefes
const BOSS_CONFIG = {
	levels: [10, 25, 50, 75, 100], // Niveles donde aparecen jefes
	baseHP: 10000,
	hpMultiplier: 1.5,
	baseTime: 30, // segundos
};

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
	const shouldTriggerBoss = BOSS_CONFIG.levels.includes(objectiveLevel) && 
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
	
	// Calcular HP del jefe basado en el nivel
	const levelIndex = BOSS_CONFIG.levels.indexOf(objectiveLevel);
	bossState.maxHP = Math.floor(BOSS_CONFIG.baseHP * Math.pow(BOSS_CONFIG.hpMultiplier, levelIndex));
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
	
	const messageEl = document.getElementById('boss-message');
	if (messageEl) {
		messageEl.textContent = '¡VICTORIA! +1 Nivel de Prestigio';
		messageEl.className = 'boss-message victory';
	}
	
	// Incrementar prestigio
	prestigeLevel++;
	localStorage.setItem('prestigeLevel', prestigeLevel);
	bossState.lastBossLevel = objectiveLevel;
	localStorage.setItem('lastBossLevel', bossState.lastBossLevel);
	
	// Actualizar UI de prestigio
	updatePrestigeDisplay();
	
	// Cerrar modal después de 3 segundos
	setTimeout(() => {
		hideBossModal();
	}, 3000);
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
	
	// Actualizar display inicial de prestigio
	updatePrestigeDisplay();
});
