// Cliente API para comunicación con el backend MongoDB

// Detectar ambiente y configurar URL del API
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

// En producción, puedes configurar esta variable antes de desplegar
// o usar una variable en tu build process
const PRODUCTION_API_URL = 'https://zclicker-backend.onrender.com/api/game';
const DEVELOPMENT_API_URL = 'http://localhost:3001/api/game';

const API_BASE_URL = isLocalhost ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

console.log(`🔗 API URL: ${API_BASE_URL} (${isLocalhost ? 'desarrollo' : 'producción'})`);

/**
 * Carga el estado del juego desde el backend
 * @param {string} userId - ID único del usuario
 * @returns {Promise<object|null>} Estado del juego o null si no existe
 */
async function loadGameStateFromBackend(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}`);
        
        if (response.status === 404) {
            console.log('No se encontró estado guardado en el servidor para este usuario');
            return null;
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Estado cargado desde backend:', data);
        return data;
    } catch (error) {
        console.error('Error al cargar estado desde backend:', error);
        return null;
    }
}

/**
 * Guarda el estado del juego en el backend
 * @param {string} userId - ID único del usuario
 * @param {object} gameState - Estado completo del juego
 * @returns {Promise<boolean>} true si se guardó correctamente
 */
async function saveGameStateToBackend(userId, gameState) {
    try {
        const response = await fetch(`${API_BASE_URL}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameState),
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Estado guardado en backend:', data);
        return true;
    } catch (error) {
        console.error('Error al guardar estado en backend:', error);
        return false;
    }
}

/**
 * Recopila el estado actual completo del juego
 * @returns {object} Estado completo del juego
 */
function collectCurrentGameState() {
    return {
        userId: currentUserId,
        userName: currentUserName,
        points: points || 0,
        prestigeLevel: prestigeLevel || 0,
        autoClick: {
            speedLevel: autoClickSpeedLevel || 0,
            powerLevel: autoClickPowerLevel || 0,
            intervalMs: autoClickCurrentIntervalMs || 0,
        },
        autoInvest: {
            level: autoInvestLevel || 0,
            intervalMs: autoInvestCurrentIntervalMs || 0,
        },
        objective: {
            level: objectiveLevel || 1,
            progress: objectiveProgress || 0,
        },
    };
}

/**
 * Aplica el estado cargado desde el backend al juego
 * @param {object} state - Estado del juego desde backend
 */
function applyGameState(state) {
    if (!state) return;
    
    // Puntos
    if (typeof state.points === 'number') {
        points = state.points;
        localStorage.setItem('points', points);
        if (typeof updatePointsDisplay === 'function') {
            updatePointsDisplay();
        }
    }
    
    // Prestige Level
    if (typeof state.prestigeLevel === 'number') {
        prestigeLevel = state.prestigeLevel;
        localStorage.setItem('prestigeLevel', prestigeLevel);
    }
    
    // Auto Click
    if (state.autoClick) {
        if (typeof state.autoClick.speedLevel === 'number') {
            autoClickSpeedLevel = state.autoClick.speedLevel;
        }
        if (typeof state.autoClick.powerLevel === 'number') {
            autoClickPowerLevel = state.autoClick.powerLevel;
        }
        if (typeof state.autoClick.intervalMs === 'number') {
            autoClickCurrentIntervalMs = state.autoClick.intervalMs;
        }
        saveAutoClickState();
        if (typeof updateAutoClickCostsDisplay === 'function') {
            updateAutoClickCostsDisplay();
        }
        if (typeof restartAutoClickInterval === 'function') {
            restartAutoClickInterval();
        }
    }
    
    // Auto Invest
    if (state.autoInvest) {
        if (typeof state.autoInvest.level === 'number') {
            autoInvestLevel = state.autoInvest.level;
        }
        if (typeof state.autoInvest.intervalMs === 'number') {
            autoInvestCurrentIntervalMs = state.autoInvest.intervalMs;
        }
        saveAutoInvestState();
        if (typeof updateAutoInvestUI === 'function') {
            updateAutoInvestUI();
        }
        if (typeof restartAutoInvestInterval === 'function') {
            restartAutoInvestInterval();
        }
    }
    
    // Objective
    if (state.objective) {
        if (typeof state.objective.level === 'number') {
            objectiveLevel = state.objective.level;
        }
        if (typeof state.objective.progress === 'number') {
            objectiveProgress = state.objective.progress;
        }
        saveObjectiveState();
        if (typeof updateObjectiveUI === 'function') {
            updateObjectiveUI();
        }
    }
}

/**
 * Guarda el estado actual con debounce para evitar muchas peticiones
 */
let saveTimeout = null;
function scheduleSaveToBackend() {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    
    // Guardar después de 2 segundos de inactividad
    saveTimeout = setTimeout(async () => {
        if (!currentUserId) {
            console.warn('No se puede guardar: usuario no identificado');
            return;
        }
        
        const state = collectCurrentGameState();
        await saveGameStateToBackend(currentUserId, state);
    }, 2000);
}

/**
 * Inicializa la conexión con el backend y carga el estado
 */
async function initializeBackendSync() {
    if (!currentUserId) {
        console.error('No se puede inicializar backend: usuario no identificado');
        return;
    }
    
    console.log('Iniciando sincronización con backend...');
    
    // Intentar cargar desde backend
    const backendState = await loadGameStateFromBackend(currentUserId);
    
    if (backendState) {
        // Si hay estado en backend, usarlo
        console.log('Aplicando estado desde backend');
        applyGameState(backendState);
    } else {
        // Si no hay estado en backend, guardar el estado actual (localStorage)
        console.log('No hay estado en backend, guardando estado actual...');
        const currentState = collectCurrentGameState();
        await saveGameStateToBackend(currentUserId, currentState);
    }
    
    // Guardar periódicamente cada 30 segundos
    setInterval(async () => {
        if (currentUserId) {
            const state = collectCurrentGameState();
            await saveGameStateToBackend(currentUserId, state);
        }
    }, 30000);
}
