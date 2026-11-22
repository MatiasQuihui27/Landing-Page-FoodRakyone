// f4-01-InventarioDeOfertas.js — comportamiento de "Inventario de ofertas" (F4-01).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderInventario() {
    const activas = state.inventario.filter(o => o.estado === 'activa');
    const agotadas = state.inventario.filter(o => o.estado === 'agotada');
    return `<h1>Inventario de ofertas</h1>
        <p class="subtitle">${state.comercio.nombre} · Publicaciones activas.</p>

        <div class="grid-2">
            <div>
                <div class="btn-grid-3">
                    <button type="button" class="btn" onclick="navigate('${F4.publicar}')">Publicar excedente</button>
                    <button type="button" class="btn btn-outline" onclick="publicarLote()">Publicar lote</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('${F4.horarios}')">Configuración</button>
                </div>

                <h2>Ofertas activas</h2>
                ${activas.length ? `<div class="history-list">${activas.map(tarjetaOferta).join('')}</div>`
                    : '<div class="alert">No tienes ofertas activas. Publica un excedente para que los consumidores lo vean.</div>'}
                ${agotadas.length ? `<h2>Ofertas agotadas</h2><div class="history-list">${agotadas.map(tarjetaOferta).join('')}</div>` : ''}
            </div>

            <aside class="aside-box">
                <h3 class="azul">Disponibilidad</h3>
                <p>Los cambios se reflejan en lista y mapa del consumidor.<br>Agotar bloquea nuevas compras.<br>Retirar elimina la publicación del catálogo.</p>
                <div class="stat-card">
                    <h3 class="azul">Leyenda de estados</h3>
                    <div class="summary-row"><span class="summary-icon">✓</span><span>Activa: disponible en su catálogo correspondiente.</span></div>
                    <div class="summary-row"><span class="summary-icon">−</span><span>Agotada: no admite nuevas reservas.</span></div>
                    <div class="summary-row"><span class="summary-icon">×</span><span>Retirado: elimina la publicación del catálogo.</span></div>
                </div>
            </aside>
        </div>`;
}

// Si el canal Al por mayor está desactivado, la publicación de lotes queda bloqueada (F4-05).
function publicarLote() {
    navigate(state.comercio.b2b ? F4.lote : F4.loteBloqueado);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderInventario();
});
