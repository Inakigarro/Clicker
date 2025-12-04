const themeToggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function toggleTheme() {
    document.body.classList.toggle('light-theme');

    if (document.body.classList.contains('light-theme')) {
        // Tema claro → sol
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        // Tema oscuro → luna
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

themeToggleButton.addEventListener('click', toggleTheme);