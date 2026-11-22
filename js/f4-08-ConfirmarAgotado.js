// f4-08-ConfirmarAgotado.js — "¿Marcar como agotado? — Confirmar agotado" (F4-08).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderConfirmarAgotado() {
    const o = ofertaSeleccionada();
    return `<h1>¿Marcar como agotado? — Confirmar agotado</h1>
        <p class="status-meta">${esc(o.name)} · ${state.comercio.nombre}</p>

        <h2>Oferta seleccionada</h2>
        <p>Stock publicado: ${o.stock} ${o.unit}<br>Precio: ${dinero(o.price)}<br>Recojo: ${o.ini}–${o.fin}</p>
        ${avisoInfo('La oferta dejará de aceptar nuevas compras y saldrá de los resultados activos.')}

        <div class="action-stack">
            <button type="button" class="btn" onclick="confirmarAgotado(${o.id})">Confirmar agotado</button>
            <button type="button" class="btn btn-outline" onclick="navigate('${F4.inventario}')">Cancelar</button>
        </div>`;
}

function confirmarAgotado(id) {
    cambiarEstado(id, 'agotada');
    state.ofertaSel = id;
    navigate(F4.agotado);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderConfirmarAgotado();
});
