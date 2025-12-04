let currentUserId;
let currentUserName;

// Aseguro la identidad del usuario al cargar la página

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
}
updatePointsDisplay();

// Funcion para manejar el clic en el boton
function handleClick() {
    points += 1; // Incremento los puntos en 1 por cada clic
    localStorage.setItem('points', points); // Guardo los puntos en localStorage
    updatePointsDisplay(); // Actualizo la interfaz
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