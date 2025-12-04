// Sistema de exportación/importación de usuario

/**
 * Exporta las credenciales del usuario actual
 * @returns {object|null} Objeto con userId y userName, o null si no hay usuario
 */
function exportUserCredentials() {
    if (!currentUserId || !currentUserName) {
        console.error('No hay usuario identificado para exportar');
        return null;
    }
    
    const credentials = {
        userId: currentUserId,
        userName: currentUserName,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    return credentials;
}

/**
 * Copia las credenciales al portapapeles en formato JSON
 */
async function copyCredentialsToClipboard() {
    const credentials = exportUserCredentials();
    
    if (!credentials) {
        alert('❌ No se pudo exportar: usuario no identificado');
        return;
    }
    
    try {
        const jsonString = JSON.stringify(credentials, null, 2);
        await navigator.clipboard.writeText(jsonString);
        
        console.log('✅ Credenciales copiadas al portapapeles:', credentials);
        alert(`✅ Credenciales copiadas!\n\nUsuario: ${credentials.userName}\nID: ${credentials.userId}\n\nPega esto en otro navegador para recuperar tu progreso.`);
    } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        // Fallback: mostrar en un prompt
        showCredentialsInPrompt(credentials);
    }
}

/**
 * Muestra las credenciales en un cuadro de texto para copiar manualmente
 */
function showCredentialsInPrompt(credentials) {
    const jsonString = JSON.stringify(credentials, null, 2);
    const textarea = document.createElement('textarea');
    textarea.value = jsonString;
    textarea.style.position = 'fixed';
    textarea.style.top = '50%';
    textarea.style.left = '50%';
    textarea.style.transform = 'translate(-50%, -50%)';
    textarea.style.width = '400px';
    textarea.style.height = '200px';
    textarea.style.padding = '1rem';
    textarea.style.fontSize = '0.9rem';
    textarea.style.fontFamily = 'monospace';
    textarea.style.backgroundColor = 'var(--background-secondary-color)';
    textarea.style.color = 'var(--text-color)';
    textarea.style.border = '2px solid var(--text-color)';
    textarea.style.borderRadius = '8px';
    textarea.style.zIndex = '10000';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.style.position = 'fixed';
    closeButton.style.top = 'calc(50% + 120px)';
    closeButton.style.left = '50%';
    closeButton.style.transform = 'translateX(-50%)';
    closeButton.style.padding = '0.5rem 1rem';
    closeButton.style.backgroundColor = 'var(--background-color)';
    closeButton.style.color = 'var(--text-color)';
    closeButton.style.border = '1px solid var(--text-color)';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '10001';
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(textarea);
        document.body.removeChild(closeButton);
    });
    
    document.body.appendChild(closeButton);
    
    alert('Copia el texto del cuadro que apareció en pantalla');
}

/**
 * Importa credenciales desde JSON
 * @param {string} jsonString - String JSON con las credenciales
 * @returns {boolean} true si se importó correctamente
 */
function importUserCredentials(jsonString) {
    try {
        const credentials = JSON.parse(jsonString);
        
        // Validar estructura
        if (!credentials.userId || !credentials.userName) {
            throw new Error('Formato inválido: faltan userId o userName');
        }
        
        // Advertir al usuario
        const confirmed = confirm(
            `⚠️ ADVERTENCIA: Esto reemplazará tu usuario actual\n\n` +
            `Usuario actual: ${currentUserName || 'ninguno'}\n` +
            `Nuevo usuario: ${credentials.userName}\n\n` +
            `¿Deseas continuar?`
        );
        
        if (!confirmed) {
            console.log('Importación cancelada por el usuario');
            return false;
        }
        
        // Guardar en localStorage
        localStorage.setItem('clickerUserId', credentials.userId);
        localStorage.setItem('clickerUserName', credentials.userName);
        
        console.log('✅ Credenciales importadas:', credentials);
        alert(`✅ Usuario importado correctamente!\n\nUsuario: ${credentials.userName}\n\nRecarga la página para cargar el progreso desde el servidor.`);
        
        return true;
    } catch (error) {
        console.error('Error al importar credenciales:', error);
        alert(`❌ Error al importar:\n${error.message}\n\nAsegúrate de pegar el JSON completo.`);
        return false;
    }
}

/**
 * Muestra un prompt para pegar las credenciales
 */
function promptImportCredentials() {
    const jsonString = prompt(
        '📥 Importar Usuario\n\n' +
        'Pega aquí el JSON con tus credenciales de usuario:\n' +
        '(El texto que copiaste del otro navegador)'
    );
    
    if (!jsonString) {
        console.log('Importación cancelada');
        return;
    }
    
    importUserCredentials(jsonString);
}

/**
 * Descarga las credenciales como archivo JSON
 */
function downloadCredentialsAsFile() {
    const credentials = exportUserCredentials();
    
    if (!credentials) {
        alert('❌ No se pudo exportar: usuario no identificado');
        return;
    }
    
    const jsonString = JSON.stringify(credentials, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `zclicker-user-${credentials.userName}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Credenciales descargadas como archivo');
    alert(`✅ Archivo descargado!\n\nGuarda este archivo en un lugar seguro.\nPuedes importarlo desde otro navegador.`);
}

/**
 * Importa credenciales desde un archivo
 */
function importCredentialsFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonString = e.target.result;
            importUserCredentials(jsonString);
        };
        reader.readAsText(file);
    });
    
    input.click();
}

// Agregar botones a la interfaz
function addUserTransferButtons() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Contenedor de botones de transferencia
    const transferContainer = document.createElement('div');
    transferContainer.id = 'user-transfer-container';
    transferContainer.style.display = 'flex';
    transferContainer.style.gap = '0.5rem';
    transferContainer.style.marginLeft = 'auto';
    transferContainer.style.marginRight = '0.5rem';
    
    // Botón de exportar
    const exportButton = document.createElement('button');
    exportButton.id = 'export-user-button';
    exportButton.title = 'Exportar usuario';
    exportButton.style.cursor = 'pointer';
    exportButton.style.backgroundColor = 'transparent';
    exportButton.style.border = 'none';
    exportButton.innerHTML = '<i class="fa-solid fa-upload"></i>';
    exportButton.querySelector('i').style.color = 'var(--text-color)';
    exportButton.addEventListener('click', copyCredentialsToClipboard);
    
    // Botón de importar
    const importButton = document.createElement('button');
    importButton.id = 'import-user-button';
    importButton.title = 'Importar usuario';
    importButton.style.cursor = 'pointer';
    importButton.style.backgroundColor = 'transparent';
    importButton.style.border = 'none';
    importButton.innerHTML = '<i class="fa-solid fa-download"></i>';
    importButton.querySelector('i').style.color = 'var(--text-color)';
    importButton.addEventListener('click', promptImportCredentials);
    
    transferContainer.appendChild(exportButton);
    transferContainer.appendChild(importButton);
    
    // Insertar antes del botón de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        header.insertBefore(transferContainer, themeToggle);
    } else {
        header.appendChild(transferContainer);
    }
}

// Inicializar al cargar
window.addEventListener('DOMContentLoaded', () => {
    // Agregar botones después de que el usuario esté identificado
    setTimeout(addUserTransferButtons, 1000);
});

// Exportar funciones globales para uso desde consola
window.exportUserCredentials = exportUserCredentials;
window.importUserCredentials = importUserCredentials;
window.copyCredentialsToClipboard = copyCredentialsToClipboard;
window.downloadCredentialsAsFile = downloadCredentialsAsFile;
window.importCredentialsFromFile = importCredentialsFromFile;
