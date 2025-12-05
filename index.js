let currentUserId;
let currentUserName;

// Sistema de Prestigio
let prestigeLevel = parseInt(localStorage.getItem('prestigeLevel')) || 0;

// Función para obtener el multiplicador de prestigio
function getPrestigeMultiplier() {
  return 1 + (prestigeLevel * 0.5); // +50% por nivel de prestigio
}

// Función para obtener el bonus de nivel (aplica a clicks manuales)
function getLevelBonus() {
  if (typeof objectiveLevel === 'undefined') return 1;
  return 1 + (objectiveLevel * 0.01); // +1% por nivel
}

// Obtengo el boton para registrar los puntos.
const clickButton = document.getElementById('clicker-button');

// Boton para mostrar/ocultar la barra lateral de mejoras
const sidebarToggleButton = document.getElementById('sidebar-toggle');

// Variable para contar los puntos
let points = localStorage.getItem('points') ? parseInt(localStorage.getItem('points')) : 0;
localStorage.setItem('points', points);

// Funcion para actualizar el contador de puntos en la interfaz
function updatePointsDisplay() {
    const pointsDisplay = document.getElementById('points-display');
    pointsDisplay.innerHTML = `<span>${points}</span> Puntos`;
    
    // Actualizar estado de botones cuando cambian los puntos
    if (typeof updateAutoClickCostsDisplay === 'function') {
        updateAutoClickCostsDisplay();
    }
    if (typeof updateAutoInvestUI === 'function') {
        updateAutoInvestUI();
    }
    if (typeof updateObjectiveUI === 'function') {
        updateObjectiveUI();
    }
    
    // Actualizar daño de armas en combate de jefe
    if (typeof updateWeaponDamage === 'function') {
        updateWeaponDamage();
    }
}
updatePointsDisplay();

// Funcion para manejar el clic en el boton
function handleClick() {
    const basePoints = 1;
    const levelBonus = getLevelBonus();
    const prestigeMultiplier = getPrestigeMultiplier();
    
    const earnedPoints = Math.floor(basePoints * levelBonus * prestigeMultiplier);
    
    points += earnedPoints; // Incremento los puntos según bonificaciones
    localStorage.setItem('points', points); // Guardo los puntos en localStorage
    updatePointsDisplay(); // Actualizo la interfaz
    
    // Actualizar estadísticas
    if (typeof incrementManualClicks === 'function') {
        incrementManualClicks();
    }
    if (typeof addToTotalPoints === 'function') {
        addToTotalPoints(earnedPoints);
    }
    
    // Mostrar animación de puntos flotantes (con valor actualizado)
    if (typeof showManualClickPoints === 'function') {
        showManualClickPoints(earnedPoints);
    }
    
    if (typeof scheduleSaveToBackend === 'function') {
        scheduleSaveToBackend();
    }
}

clickButton.addEventListener('click', handleClick);

// Manejo del toggle de la barra lateral
if (sidebarToggleButton) {
    sidebarToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-hidden');
    });
}

function ensureUserIdentity() {
  let userId = localStorage.getItem('clickerUserId');
  let userName = localStorage.getItem('clickerUserName');

  if (!userId) {
    if (crypto.randomUUID) {
      userId = crypto.randomUUID();
    } else {
      userId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
    }
    localStorage.setItem('clickerUserId', userId);
  }

  if (!userName) {
    // Pedir nombre hasta que ponga algo no vacío o cancele
    let name = '';
    while (!name) {
      name = window.prompt('Bienvenido! Ingresa un nombre de usuario (será único en el juego):');
      if (name === null) {
        // Si cancela, puedes o bien salir del loop o poner un nombre por defecto
        name = '';
        alert('Necesitas un nombre de usuario para guardar tu progreso.');
      }
    }
    userName = name.trim();
    localStorage.setItem('clickerUserName', userName);
  }

  return { userId, userName };
}

// Inicializar identidad al cargar
window.addEventListener('DOMContentLoaded', async () => {
  const identity = ensureUserIdentity();
  currentUserId = identity.userId;
  currentUserName = identity.userName;
  console.log('Usuario identificado:', currentUserName, currentUserId);
  
  // Inicializar sincronización con backend
  // Esperamos un poco para que todos los módulos se carguen
  setTimeout(async () => {
    if (typeof initializeBackendSync === 'function') {
      await initializeBackendSync();
    }
  }, 500);
});