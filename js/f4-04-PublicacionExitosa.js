// f4-04-PublicacionExitosa.js — "Excedente publicado — Publicación exitosa" (F4-04).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderPublicacionExitosa() {
    const o = ofertaSeleccionada();
    return `<h1>Excedente publicado — Publicación exitosa</h1>
        <p class="status-meta">${esc(o.name)} ya está visible para consumidores.</p>
        ${avisoConfirmado('Publicación exitosa. La oferta aparece en el listado y en el mapa.')}

        <h2>Oferta activa</h2>
        ${tarjetaOferta(o)}

        <div class="action-stack">
            <button type="button" class="btn" onclick="navigate('${F4.inventario}')">Ver inventario</button>
            <button type="button" class="btn btn-outline" onclick="verComoConsumidor(${o.id})">Ver oferta como consumidor</button>
            <button type="button" class="btn btn-outline" onclick="state.borrador = null; navigate('${F4.publicar}')">Publicar otro</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderPublicacionExitosa();
});
