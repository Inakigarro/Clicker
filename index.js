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