// editar-perfil-error.js — comportamiento de la pantalla "Editar mi perfil - Nombre obligatorio".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderEditarPerfil(hasError = false) {
    app.innerHTML = `
        <h1>${hasError ? 'Editar mi perfil — Nombre obligatorio' : 'Editar mi perfil'}</h1>
        ${hasError ? '<div class="alert error">⚠️ El nombre no puede quedar vacío.</div>' : ''}
        <form onsubmit="handleGuardarPerfil(event)" style="max-width:500px">
            <div class="form-group ${hasError ? 'error-field' : ''}">
                <label>Nombre completo *</label>
                <input type="text" id="edit-nombre" value="${hasError ? '' : state.user.nombre}">
            </div>
            <div class="form-group">
                <label>Correo de contacto *</label>
                <input type="email" id="edit-correo" value="${state.user.correo}" required>
            </div>
            <div class="form-group">
                <label>Teléfono de contacto</label>
                <input type="text" id="edit-tel" value="${state.user.telefono}">
            </div>
            <div class="btn-group">
                <button type="submit" class="btn">Guardar cambios</button>
                <button type="button" class="btn btn-outline" onclick="navigate('perfil-consumidor')">Cancelar</button>
            </div>
        </form>
    `;
}

function handleGuardarPerfil(e) {
    e.preventDefault();
    const nombre = document.getElementById('edit-nombre').value.trim();
    if (!nombre) {
        navigate('editar-perfil', { error: true });
        return;
    }
    state.user.nombre = nombre;
    state.user.correo = document.getElementById('edit-correo').value;
    state.user.telefono = document.getElementById('edit-tel').value;
    navigate('perfil-guardado');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderEditarPerfil(true);
});
