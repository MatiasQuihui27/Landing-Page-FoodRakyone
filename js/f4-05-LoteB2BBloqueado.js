// f4-05-LoteB2BBloqueado.js — "Publicar lote por volumen — B2B bloqueado" (F4-05).
// Se muestra cuando el canal Al por mayor está desactivado (state.comercio.b2b = false).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderLoteBloqueado() {
    return `<h1>Publicar lote por volumen — B2B bloqueado</h1>
        <p class="subtitle">El canal Al por mayor está desactivado.</p>
        ${avisoError('Debes habilitar la venta al por mayor en Configuración para publicar lotes.')}

        <div class="form-group">
            <label>Unidad de volumen</label>
            <input type="text" value="Jabas / Sacos / Cajas" disabled>
        </div>
        <div class="form-group">
            <label>Cantidad</label>
            <input type="text" value="No disponible" disabled>
        </div>

        <div class="action-stack">
            <button type="button" class="btn" disabled>Publicar lote · Deshabilitado</button>
            <button type="button" class="btn" onclick="navigate('categorias-comercio')">Ir a configuración</button>
            <button type="button" class="btn btn-outline" onclick="navigate('${F4.inventario}')">Volver</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderLoteBloqueado();
});
