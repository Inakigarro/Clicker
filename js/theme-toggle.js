const themeToggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

const THEME_STORAGE_KEY = 'clickerTheme';

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    
    applyTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
        applyTheme(savedTheme);
    }
    // Si no hay tema guardado, usar el tema oscuro por defecto (ya aplicado en HTML)
}

// Cargar tema guardado al iniciar
loadSavedTheme();

themeToggleButton.addEventListener('click', toggleTheme);