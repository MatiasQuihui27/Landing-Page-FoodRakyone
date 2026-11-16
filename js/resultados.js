// resultados.js — comportamiento de la pantalla "Resultados".
// Requiere state.js y shared.js (se cargan antes en el HTML).

const zona = extra => `<div class="sidebar-box"><h3 class="azul">Tu zona activa</h3><p>📍 Av. Canadá 100, La Victoria</p><small>Radio: ${state.busqueda.radio} km</small></div>${extra || ''}`;

const dinero = n => 'S/' + Number(n).toFixed(2);

function renderResultados() {
    const b = state.busqueda, lista = filtradas(), vacio = !lista.length, s = lista.length > 1 ? 's' : '';
    return `<p class="crumb">Inicio> Descubrir> Resultados</p>
        <h1>${vacio ? 'Resultados de búsqueda — Sin coincidencias' : `Resultados para "${b.q || 'todas las ofertas'}"`}</h1>
        <p class="subtitle">${vacio ? `Búsqueda por producto: "${b.q}"` : `${lista.length} oferta${s} encontrada${s} dentro de ${b.radio} km.`}</p>
        <div class="layout-grid"><div>
            <form class="search-box" onsubmit="buscar(event)"><strong>Buscar por producto</strong><input id="q" value="${b.q}" placeholder="Escribe el nombre del alimento"></form>
            ${vacio ? `<div class="alert">!No encontramos ofertas para "${b.q}" en tu zona.</div>
                <h2>Prueba otra búsqueda</h2><p class="subtitle">Cambia el nombre del producto, limpia los filtros o amplía el radio.</p>`
            : `<label class="orden">Ordenar resultados
                    <select onchange="state.busqueda.orden=this.value; navigate('resultados')">
                        <option value="precio" ${b.orden === 'precio' ? 'selected' : ''}>Menor precio</option>
                        <option value="descuento" ${b.orden === 'descuento' ? 'selected' : ''}>Mayor descuento</option>
                    </select></label>
                <h2>Coincidencias de búsqueda</h2><div class="card-grid">${lista.map(tarjeta).join('')}</div>`}
            <div class="acciones">
                <button class="btn-green" onclick="navigate('descubrir')">Cambiar búsqueda</button>
                ${vacio ? `<button class="btn-outline" onclick="limpiarFiltros()">Limpiar filtros</button>` : `<button class="btn-outline" onclick="navigate('filtros')">Filtros</button>`}
                <button class="btn-outline" onclick="navigate('mapa')">Ver en mapa</button>
            </div>
        </div><aside>${zona(`<div class="sidebar-box"><h3 class="azul">Sugerencias de búsqueda</h3><p>Prueba con "Leche", "Frutas" o "Verduras". Amplía el radio desde Filtros.</p></div>`)}</aside></div>`;
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

function limpiarFiltros() {
    state.busqueda = { q: '', cats: [], orden: 'precio', radio: 1 };
    navigate('descubrir');
}

function buscar(e) {
    if (e) e.preventDefault();
    state.busqueda.q = document.getElementById('q').value.trim();
    navigate('resultados');
}

function filtradas() {
    const b = state.busqueda, q = b.q.toLowerCase();
    return state.ofertas
        .filter(o => o.name.toLowerCase().includes(q) && (!b.cats.length || b.cats.includes(o.cat)) && parseFloat(o.distance) <= b.radio)
        .sort((a, c) => b.orden === 'precio' ? a.price - c.price : parseInt(a.discount) - parseInt(c.discount));
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderResultados();
});
