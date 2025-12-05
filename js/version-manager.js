// Sistema de Versionado del Juego
// Detecta cambios importantes y resetea el progreso automáticamente

const GAME_VERSION = '2.0.0'; // Incrementa esto cuando necesites resetear
const VERSION_KEY = 'gameVersion';

/**
 * Verifica si necesitamos resetear el juego por cambio de versión
 * @returns {boolean} true si se realizó un reset
 */
function checkAndResetIfNeeded() {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    
    if (savedVersion !== GAME_VERSION) {
        console.log(`🔄 Cambio de versión detectado: ${savedVersion || 'ninguna'} → ${GAME_VERSION}`);
        performGameReset();
        return true;
    }
    
    return false;
}

/**
 * Resetea completamente el progreso del jugador
 */
function performGameReset() {
    console.log('🗑️ Reseteando progreso del juego...');
    
    // Guardar solo el ID de usuario si existe
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    // Limpiar TODO el localStorage
    localStorage.clear();
    
    // Restaurar ID de usuario (para mantener la cuenta)
    if (userId) {
        localStorage.setItem('userId', userId);
    }
    if (userName) {
        localStorage.setItem('userName', userName);
    }
    
    // Establecer nueva versión
    localStorage.setItem(VERSION_KEY, GAME_VERSION);
    
    // Inicializar valores por defecto
    localStorage.setItem('points', '0');
    localStorage.setItem('prestigeLevel', '0');
    
    console.log('✅ Progreso reseteado completamente');
    console.log(`📌 Nueva versión: ${GAME_VERSION}`);
    
    // Mostrar mensaje al usuario
    showResetNotification();
    
    // Recargar la página para aplicar cambios
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}

/**
 * Muestra notificación de reset al usuario
 */
function showResetNotification() {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    // Crear mensaje
    const message = document.createElement('div');
    message.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem 3rem;
        border-radius: 16px;
        text-align: center;
        color: white;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    message.innerHTML = `
        <h2 style="margin: 0 0 1rem 0; font-size: 2rem;">🎮 Actualización v${GAME_VERSION}</h2>
        <p style="margin: 0 0 1rem 0; font-size: 1.1rem; line-height: 1.6;">
            Hemos implementado cambios importantes en el juego.<br>
            <strong>Tu progreso ha sido reseteado.</strong>
        </p>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">
            Recargando en 3 segundos...
        </p>
    `;
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
}

/**
 * Limpia el estado del juego en el backend
 * Llama al endpoint de limpieza solo si existe userId
 */
async function clearBackendData() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.log('No hay userId, omitiendo limpieza de backend');
        return;
    }
    
    try {
        const apiUrl = typeof API_BASE_URL !== 'undefined' 
            ? API_BASE_URL 
            : 'http://localhost:3001/api/game';
            
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('✅ Datos del backend eliminados correctamente');
        } else {
            console.warn('⚠️ No se pudieron eliminar datos del backend');
        }
    } catch (error) {
        console.error('Error al limpiar backend:', error);
    }
}

// Ejecutar verificación al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const wasReset = checkAndResetIfNeeded();
    
    // Si hubo reset, también limpiar backend
    if (wasReset) {
        clearBackendData();
    }
});
