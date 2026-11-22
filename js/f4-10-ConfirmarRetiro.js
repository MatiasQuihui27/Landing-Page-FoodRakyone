// f4-10-ConfirmarRetiro.js — "¿Retirar esta oferta? — Confirmar retiro" (F4-10).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderConfirmarRetiro() {
    const o = ofertaSeleccionada();
    return `<h1>¿Retirar esta oferta? — Confirmar retiro</h1>
        <p class="status-meta">${esc(o.name)} · Confirmación de retiro.</p>

        <h2>Oferta seleccionada</h2>
        <p>${esc(o.name)} · ${dinero(o.price)}<br>${state.comercio.nombre}</p>
        ${avisoInfo('La publicación se eliminará del catálogo y del mapa. Las reservas existentes mantienen su registro.')}

        <div class="action-stack">
            <button type="button" class="btn" onclick="confirmarRetiro(${o.id})">Confirmar retiro</button>
            <button type="button" class="btn btn-outline" onclick="navigate('${F4.inventario}')">Cancelar</button>
        </div>`;
}

function confirmarRetiro(id) {
    cambiarEstado(id, 'retirada');
    state.ofertaSel = id;
    navigate(F4.retirado);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderConfirmarRetiro();
});
