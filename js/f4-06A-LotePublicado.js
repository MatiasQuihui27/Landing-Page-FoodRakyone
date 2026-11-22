// f4-06A-LotePublicado.js — "Lote publicado — Publicación B2B exitosa" (F4-06A).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

// Si se abre la pantalla sin haber publicado, se muestra el lote de ejemplo del diseño.
const loteEjemplo = () => ({ name: 'Tomate por volumen', unidad: 'Jabas', cantidad: 3, precio: '30.00', total: '90.00', caducidad: '09/10', empaque: 'Empaque original sellado', fecha: '07/10', ini: '18:00', fin: '20:00', local: LOCAL_B2B });

function renderLotePublicado() {
    const l = state.lotes[state.lotes.length - 1] || loteEjemplo();
    return `<h1>Lote publicado — Publicación B2B exitosa</h1>
        <p class="status-meta">${l.local.split(' · ')[0]} · Venta por volumen.</p>
        ${avisoConfirmado('Lote publicado en el catálogo exclusivo Al por mayor.')}

        <h2>Inventario comerciantes minoristas</h2>
        <article class="history-card">
            <p><strong>Activo · Venta por volumen</strong></p>
            <p><strong>${esc(l.name)}</strong></p>
            <p><strong>${dinero(l.total)} total</strong></p>
            <p>${l.cantidad} ${l.cantidad === 1 ? singular(l.unidad) : l.unidad.toLowerCase()} × ${dinero(l.precio)}</p>
            <p>${l.local}</p>
            <p>Caducidad ${l.caducidad} · ${empaqueCorto(l.empaque)}</p>
            <p>Recojo ${l.fecha} · ${l.ini}–${l.fin}</p>
            <div class="action-stack">
                <button type="button" class="btn" onclick="alert('Edición de lote: pantalla no incluida en este flujo')">Editar lote</button>
                <button type="button" class="btn btn-outline" onclick="navigate('al-por-mayor')">Ver en catálogo</button>
            </div>
        </article>

        <div class="action-stack">
            <button type="button" class="btn" onclick="navigate('${F4.lote}')">Publicar otro lote</button>
            <button type="button" class="btn btn-outline" onclick="navigate('al-por-mayor')">Ver detalle como comprador</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderLotePublicado();
});
