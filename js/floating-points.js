// Sistema de animación de puntos flotantes

/**
 * Crea una animación de puntos flotante
 * @param {number} points - Cantidad de puntos a mostrar
 * @param {HTMLElement} target - Elemento de referencia (opcional, por defecto el botón clicker)
 * @param {string} type - Tipo de animación: 'auto' o 'manual'
 */
function createFloatingPoints(points, target = null, type = 'auto') {
    const container = document.querySelector('.clicker-section');
    if (!container) return;
    
    // Elemento de referencia (por defecto el botón de click)
    const referenceElement = target || document.getElementById('clicker-button');
    if (!referenceElement) return;
    
    // Obtener posición del elemento de referencia
    const rect = referenceElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Crear elemento flotante
    const floatingEl = document.createElement('div');
    floatingEl.className = `floating-points ${type}`;
    floatingEl.textContent = `+${points}`;
    
    // Posición inicial (centro del elemento de referencia, relativo al container)
    const startX = rect.left + rect.width / 2 - containerRect.left;
    const startY = rect.top + rect.height / 2 - containerRect.top;
    
    // Agregar variación aleatoria para evitar superposición
    const randomOffsetX = (Math.random() - 0.5) * 40; // ±20px
    const randomOffsetY = (Math.random() - 0.5) * 20; // ±10px
    
    floatingEl.style.left = `${startX + randomOffsetX}px`;
    floatingEl.style.top = `${startY + randomOffsetY}px`;
    
    container.appendChild(floatingEl);
    
    // Remover después de la animación
    setTimeout(() => {
        floatingEl.remove();
    }, 1500); // Duración de la animación
}

/**
 * Crea animación para clicks manuales
 */
function showManualClickPoints() {
    createFloatingPoints(1, null, 'manual');
}

/**
 * Crea animación para auto-clicks
 * @param {number} points - Cantidad de puntos del auto-click
 */
function showAutoClickPoints(points) {
    createFloatingPoints(points, null, 'auto');
}
