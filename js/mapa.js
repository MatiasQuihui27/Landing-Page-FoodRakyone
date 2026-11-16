// mapa.js — comportamiento de la pantalla "Mapa".
// Requiere state.js y shared.js (se cargan antes en el HTML).

const dinero = n => 'S/' + Number(n).toFixed(2);

function renderMapa() {
    return `<p class="crumb">Inicio> Mapa</p><h1>Mapa de excedentes</h1>
        <p class="subtitle">Comercios con ofertas a ${state.busqueda.radio} km o menos de Av. Canadá 100, La Victoria.</p>
        <div class="placeholder-graphic mapa">🗺️<br><strong>Mapa de ofertas cercanas</strong></div>
        <div class="card-grid">${filtradas().map(o => `<div class="offer-card"><strong>📍 ${o.store}</strong>
            <small>${o.name} · ${o.distance} · ${dinero(o.price)}</small>
            <button class="btn-outline" onclick="navigate('producto',{id:${o.id}})">Ver oferta</button></div>`).join('')}</div>`;
}

function filtradas() {
    const b = state.busqueda, q = b.q.toLowerCase();
    return state.ofertas
        .filter(o => o.name.toLowerCase().includes(q) && (!b.cats.length || b.cats.includes(o.cat)) && parseFloat(o.distance) <= b.radio)
        .sort((a, c) => b.orden === 'precio' ? a.price - c.price : parseInt(a.discount) - parseInt(c.discount));
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderMapa();
});
