// Lógica del objetivo global del juego

let objectiveLevel = 1;
let objectiveProgress = 0; // puntos invertidos en el nivel actual

const OBJECTIVE_STORAGE_KEY = 'objectiveState';

function getObjectiveRequiredPoints() {
	// Cada nivel requiere 100 * nivel puntos para completarse
	return 100 * objectiveLevel;
}

function getObjectiveCost() {
	// costo = nivelActual + (1 * nivelActual) => 2 * nivel
	return objectiveLevel + 1 * objectiveLevel;
}

function saveObjectiveState() {
	const state = {
		level: objectiveLevel,
		progress: objectiveProgress,
	};
	localStorage.setItem(OBJECTIVE_STORAGE_KEY, JSON.stringify(state));
}

function loadObjectiveState() {
	const raw = localStorage.getItem(OBJECTIVE_STORAGE_KEY);
	if (!raw) return;

	try {
		const state = JSON.parse(raw);
		if (typeof state.level === 'number' && state.level >= 1) {
			objectiveLevel = state.level;
		}
		if (typeof state.progress === 'number' && state.progress >= 0) {
			objectiveProgress = state.progress;
		}
	} catch (e) {
		// Si falla el parse, seguimos con valores por defecto
	}
}

function updateObjectiveUI() {
	const levelLabel = document.getElementById('objective-level-label');
	const investButton = document.getElementById('objective-invest-button');
	const barFill = document.getElementById('objective-bar-fill');

	if (levelLabel) {
		levelLabel.textContent = `Nivel ${objectiveLevel}`;
	}

	if (investButton) {
		investButton.textContent = `Invertir ${getObjectiveCost()} puntos`;
	}

	if (barFill) {
		const required = getObjectiveRequiredPoints();
		const percent = Math.min(100, (objectiveProgress / required) * 100);
		barFill.style.width = `${percent}%`;
	}
}

function investInObjective() {
	// Usamos los puntos globales del juego
	if (typeof points === 'undefined') return;

	const cost = getObjectiveCost();
	if (points < cost) return; // no alcanza

	points -= cost;
	objectiveProgress += cost;

	// Guardamos puntos y objetivo
	localStorage.setItem('points', points);
	if (typeof updatePointsDisplay === 'function') {
		updatePointsDisplay();
	}

	const required = getObjectiveRequiredPoints();
	if (objectiveProgress >= required) {
		// Siguiente nivel
		objectiveProgress -= required; // si se pasó, mantenemos el excedente
		objectiveLevel += 1;
	}

	saveObjectiveState();
	updateObjectiveUI();
}

window.addEventListener('DOMContentLoaded', () => {
	loadObjectiveState();

	const investButton = document.getElementById('objective-invest-button');
	if (investButton) {
		investButton.addEventListener('click', investInObjective);
	}

	updateObjectiveUI();
});
