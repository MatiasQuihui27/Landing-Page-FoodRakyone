// datos-local.js — comportamiento de la pantalla "Datos del local".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderDatosLocal(hasError = false) {
    app.innerHTML = `
        <h1>${hasError ? 'Datos del local — Dirección obligatoria' : 'Datos del local'}</h1>
        ${hasError ? '<div class="alert error">⚠️ Completa la dirección para guardar los datos del local.</div>' : ''}
        <div class="grid-2">
            <form onsubmit="handleGuardarLocal(event)">
                <div class="form-group">
                    <label>Nombre del local *</label>
                    <input type="text" id="loc-nombre" value="${state.comercio.nombre}" required>
                </div>
                <div class="form-group ${hasError ? 'error-field' : ''}">
                    <label>Dirección *</label>
                    <input type="text" id="loc-dir" value="${hasError ? '' : state.comercio.direccion}">
                </div>
                <div class="form-group">
                    <label>Teléfono *</label>
                    <input type="text" id="loc-tel" value="${state.comercio.telefono}" required>
                </div>
                <div class="btn-group">
                    <button type="submit" class="btn">Guardar cambios</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('comercio-registrado')">Cancelar</button>
                </div>
            </form>
            <aside class="aside-box">
                <strong>Tu local</strong>
                <p>${state.comercio.nombre}<br>${state.comercio.direccion}</p>
                <hr>
                <h4>Impacto en ficha pública</h4>
                <p>Los datos actualizados aparecen de inmediato en tu ficha visible para los consumidores.</p>
            </aside>
        </div>
    `;
}

function handleGuardarLocal(e) {
    e.preventDefault();
    const dir = document.getElementById('loc-dir').value.trim();
    if (!dir) {
        navigate('datos-local', { error: true });
        return;
    }
    state.comercio.nombre = document.getElementById('loc-nombre').value;
    state.comercio.direccion = dir;
    state.comercio.telefono = document.getElementById('loc-tel').value;
    navigate('local-guardado');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderDatosLocal(false);
});
