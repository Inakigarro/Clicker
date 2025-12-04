# 🔄 Transferencia de Usuario entre Navegadores

## ✅ Funcionalidad Implementada

Ahora puedes exportar e importar tu usuario (userId y userName) para cargar tu progreso en diferentes navegadores o dispositivos.

## 🎮 Cómo Usar

### **Método 1: Botones en la Interfaz**

En el header del juego encontrarás dos nuevos botones:

- **📥 Botón de descarga** (izquierda del tema): Exportar usuario
- **📤 Botón de carga** (al lado): Importar usuario

#### Exportar (en tu navegador actual):
1. Haz clic en el botón de **descarga** (📥)
2. Se copiarán automáticamente tus credenciales al portapapeles
3. Verás un mensaje de confirmación con tu nombre de usuario e ID

#### Importar (en otro navegador):
1. Haz clic en el botón de **carga** (📤)
2. Pega el JSON que copiaste anteriormente
3. Confirma que quieres reemplazar el usuario actual
4. **Recarga la página** para cargar tu progreso desde el servidor

---

### **Método 2: Desde la Consola del Navegador**

Abre la consola (F12) y usa estos comandos:

#### Exportar:
```javascript
// Copiar al portapapeles
copyCredentialsToClipboard()

// O ver las credenciales
exportUserCredentials()

// O descargar como archivo
downloadCredentialsAsFile()
```

#### Importar:
```javascript
// Desde texto JSON
importUserCredentials('{"userId":"...","userName":"..."}')

// O con prompt interactivo
promptImportCredentials()

// O desde archivo
importCredentialsFromFile()
```

---

## 📝 Ejemplo Completo

### Escenario: Mover progreso de Chrome a Firefox

**En Chrome (donde ya juegas):**

1. Abre el juego
2. Haz clic en el botón de descarga 📥
3. O en consola: `copyCredentialsToClipboard()`
4. Verás un mensaje: "✅ Credenciales copiadas!"

**En Firefox (navegador nuevo):**

1. Abre el juego (te pedirá crear un usuario nuevo - cancela o ignora)
2. Haz clic en el botón de carga 📤
3. Pega el JSON que copiaste
4. Confirma el reemplazo
5. **Recarga la página** (F5)
6. ✅ Tu progreso se cargará desde MongoDB!

---

## 🔐 Formato de las Credenciales

El JSON exportado tiene este formato:

```json
{
  "userId": "3e4a7c8d-1234-5678-9abc-def012345678",
  "userName": "MiNombreDeUsuario",
  "exportDate": "2025-12-04T10:30:00.000Z",
  "version": "1.0"
}
```

**⚠️ IMPORTANTE**: 
- Guarda este JSON en un lugar seguro (es tu "contraseña" del juego)
- Cualquiera con este JSON puede acceder a tu progreso
- No lo compartas públicamente

---

## 📱 Casos de Uso

### 1. Cambiar de navegador
```
Chrome → Firefox → Edge
```
Exporta en uno, importa en otro, recarga y listo.

### 2. Múltiples dispositivos
```
PC escritorio ← MongoDB → Laptop
```
Usa el mismo userId en ambos para compartir progreso.

### 3. Respaldo de seguridad
```javascript
// Descargar backup
downloadCredentialsAsFile()
```
Guarda el archivo por si necesitas recuperar tu usuario.

### 4. Recuperar usuario perdido
Si borraste localStorage por accidente:
1. Importa tus credenciales guardadas
2. Recarga la página
3. El servidor restaurará tu progreso

---

## 🛠️ Funciones Disponibles

### `exportUserCredentials()`
Retorna objeto con userId, userName, fecha y versión.

### `copyCredentialsToClipboard()`
Copia credenciales al portapapeles automáticamente.

### `importUserCredentials(jsonString)`
Importa credenciales desde un JSON string.

### `promptImportCredentials()`
Muestra un prompt para pegar las credenciales.

### `downloadCredentialsAsFile()`
Descarga un archivo JSON con las credenciales.

### `importCredentialsFromFile()`
Abre diálogo para seleccionar archivo JSON.

---

## ⚠️ Advertencias Importantes

### Al importar:
- Se reemplazará tu usuario actual
- Debes recargar la página para aplicar cambios
- Si hay conflictos, prevalecerá el usuario importado

### Seguridad:
- Trata tu userId como una contraseña
- No lo compartas en público
- Usa la función de descarga para backups

### Multi-usuario:
- Cada navegador puede tener un usuario diferente
- Todos sincronizarán con el mismo MongoDB
- Dos usuarios no pueden tener el mismo userName

---

## 🎯 Checklist Rápido

**Para exportar:**
- [ ] Clic en botón 📥 o `copyCredentialsToClipboard()`
- [ ] Guardar el JSON en lugar seguro

**Para importar:**
- [ ] Tener el JSON copiado
- [ ] Clic en botón 📤 o `promptImportCredentials()`
- [ ] Pegar JSON
- [ ] Confirmar
- [ ] **Recargar página (F5)**
- [ ] Verificar que se cargó tu progreso

---

## 🐛 Troubleshooting

### "No hay usuario identificado para exportar"
**Causa**: No has creado un usuario aún.
**Solución**: Juega primero, crea tu usuario inicial.

### "Formato inválido"
**Causa**: El JSON pegado está incompleto o corrupto.
**Solución**: Verifica que copiaste todo el JSON completo, desde `{` hasta `}`.

### "Usuario importado pero no carga progreso"
**Causa**: No recargaste la página.
**Solución**: Presiona F5 para recargar y cargar desde MongoDB.

### "Error al copiar al portapapeles"
**Causa**: Navegador no soporta clipboard API o no hay permisos.
**Solución**: Aparecerá un cuadro de texto automáticamente. Copia manualmente.

---

## 💡 Tips

1. **Haz backups regulares**: Descarga tus credenciales periódicamente
2. **Usa nombres únicos**: Evita conflictos con otros jugadores
3. **Prueba primero**: Importa en una ventana de incógnito para probar
4. **Multiplataforma**: El mismo usuario funciona en Windows, Mac, Linux, móvil
5. **Cloud sync**: Mientras MongoDB esté corriendo, todo se sincroniza

---

¡Ahora puedes jugar desde cualquier navegador sin perder tu progreso! 🎮
