// f4-11-RetiroConfirmado.js — "Oferta retirada — Retiro confirmado" (F4-11).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderRetiroConfirmado() {
    const o = state.inventario.find(x => x.id === state.ofertaSel) || state.inventario[0];
    const restantes = state.inventario.filter(x => x.estado === 'activa' && x.id !== o.id);
    return `<h1>Oferta retirada — Retiro confirmado</h1>
        <p class="status-meta">Inventario actualizado · ${state.comercio.nombre}</p>
        ${avisoConfirmado(`${esc(o.name)} fue retirado del catálogo y del mapa.`)}

        <h2>Ofertas activas restantes</h2>
        ${restantes.length ? `<div class="history-list">${restantes.map(tarjetaOferta).join('')}</div>`
            : '<div class="alert">No quedan ofertas activas. Publica un excedente para volver a aparecer en el catálogo.</div>'}

        <div class="action-stack">
            <button type="button" class="btn" onclick="state.borrador = null; navigate('${F4.publicar}')">Publicar excedente</button>
            <button type="button" class="btn btn-outline" onclick="navigate('${F4.inventario}')">Volver al inventario</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderRetiroConfirmado();
});
