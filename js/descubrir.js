// descubrir.js — comportamiento de la pantalla "Descubrir".
// Requiere state.js y shared.js (se cargan antes en el HTML).

const zona = extra => `<div class="sidebar-box"><h3 class="azul">Tu zona activa</h3><p>📍 Av. Canadá 100, La Victoria</p><small>Radio: ${state.busqueda.radio} km</small></div>${extra || ''}`;

const dinero = n => 'S/' + Number(n).toFixed(2);

const CATEGORIAS = [["Panadería","🍞"],["Lácteos","🥛"],["Frutas","🍎"],["Comida preparada","🍲"]];

function renderDescubrir() {
    const b = state.busqueda, todas = state.ofertas;
    const ultima = todas.filter(o => o.type === 'Última oportunidad'), resto = todas.filter(o => o.type !== 'Última oportunidad');
    const categorias = `<div class="sidebar-box"><h3 class="azul">Categorías</h3><div class="cat-list">${CATEGORIAS.map(([c, i]) =>
        `<label><input type="checkbox" ${b.cats.includes(c) ? 'checked' : ''} onchange="toggleFiltroCat('${c}'); navigate('resultados')"> ${i} ${c}</label>`).join('')}</div></div>`;
    return `<span class="zona-badge">La Victoria · ${b.radio} km</span>
        <p class="crumb">Inicio> Descubrir</p>
        <h1>Descubre excedentes cercanos</h1>
        <p class="subtitle">La Victoria, Lima · Miércoles 7 de octubre de 2026</p>
        <div class="layout-grid"><div>
            <form class="search-box" onsubmit="buscar(event)"><strong>Buscar por producto</strong><input id="q" placeholder="¿Qué alimento buscas?"></form>
            <div class="acciones">
                <button class="btn-green" onclick="buscar()">Buscar</button>
                <button class="btn-outline" onclick="navigate('filtros')">Filtros</button>
                <button class="btn-outline" onclick="navigate('mapa')">Ver en mapa</button>
            </div>
            <h2>Última oportunidad</h2><div class="card-grid">${ultima.map(tarjeta).join('')}</div>
            <h2>Ofertas disponibles</h2><div class="card-grid">${resto.map(tarjeta).join('')}</div>
            <div class="stats">
                <div><b>${todas.length}</b>ofertas hoy</div><div><b>${b.radio} km</b>radio</div>
                <div><b>-${Math.max(...todas.map(o => -parseInt(o.discount)))}%</b>mayor descuento</div>
                <div><b>${dinero(Math.min(...todas.map(o => o.price)))}</b>desde</div>
            </div>
        </div><aside>${zona(categorias)}</aside></div>`;
}

function tarjeta(o) {
    return `<div class="offer-card">
        <div class="offer-img-placeholder"><span style="font-size:2.5rem">${o.icon}</span><small>${o.name}</small></div>
        <div class="offer-tag">${o.type} · <span class="verde">${o.discount}</span></div>
        <strong>${o.name}</strong>
        <div class="offer-price">${dinero(o.price)}</div>
        <div class="offer-details">${o.store} · aprox. ${o.distance}<br>Original ${dinero(o.originalPrice)} · ${o.stock} ${o.unit} disponibles<br>Hoy 07/10 · Recojo 18:00–20:00</div>
        <button class="btn-green" onclick="navigate('producto',{id:${o.id}})">Ver oferta</button>
    </div>`;
}

function toggleFiltroCat(c) {
    const a = state.busqueda.cats;
    state.busqueda.cats = a.includes(c) ? a.filter(x => x !== c) : [...a, c];
}

function buscar(e) {
    if (e) e.preventDefault();
    state.busqueda.q = document.getElementById('q').value.trim();
    navigate('resultados');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderDescubrir();
});
