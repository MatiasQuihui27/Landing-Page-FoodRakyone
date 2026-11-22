// f4-09-AgotadoConfirmado.js — "Oferta agotada — Agotado confirmado" (F4-09).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderAgotadoConfirmado() {
    const o = ofertaSeleccionada();
    return `<h1>Oferta agotada — Agotado confirmado</h1>
        <p class="status-meta">${esc(o.name)} · No disponible para nuevas reservas.</p>
        ${avisoConfirmado('Marcaste la oferta como agotada. Se deshabilitaron nuevas compras.')}

        <h2>Estado actualizado</h2>
        ${tarjetaOferta({ ...o, estado: 'agotada' })}

        <div class="action-stack">
            <button type="button" class="btn" onclick="navigate('${F4.inventario}')">Ver inventario</button>
            <button type="button" class="btn btn-outline" onclick="navigate('descubrir')">Ver estado consumidor</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderAgotadoConfirmado();
});
