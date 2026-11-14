// flujo2.js — Flujo 2 del Figma (Descubrir) + navegación Desktop/Mobile.
// Cargar DESPUÉS de main.js. Reemplaza funciones de main.js sin tocarlo.

const baseNavigate = navigate;
const loginBase = renderLogin;
const tutorialBase = renderTutorial;

const CATEGORIAS = [['Panadería', '🍞'], ['Lácteos', '🥛'], ['Frutas', '🍎'], ['Comida preparada', '🍲']];
const PRIVADAS = ['descubrir', 'resultados', 'filtros', 'mapa', 'reservas', 'al-por-mayor', 'producto', 'favoritos'];
const dinero = n => 'S/' + Number(n).toFixed(2);

state.ofertas.forEach(o => { o.cat = ['Panadería', 'Lácteos', 'Frutas'][o.id - 1]; o.unit = ['packs', 'unidades', 'bolsas'][o.id - 1]; });
state.busqueda = { q: '', cats: [], orden: 'precio', radio: 1 };
state.reservas = [];
state.view = 'welcome';

// ---------- Navegación ----------
navigate = function (view, params = {}) {
    if (view === 'inicio') view = state.loggedIn ? 'descubrir' : 'welcome';
    if (view === 'perfil') view = state.role === 'consumidor' ? 'perfil-consumidor' : 'datos-local';
    if (PRIVADAS.includes(view) && !state.loggedIn) { view = 'login'; params = { role: state.role }; }
    state.view = view;
    const nuevas = { resultados: renderResultados, filtros: renderFiltros, mapa: renderMapa, reservas: renderReservas, 'al-por-mayor': renderMayorista };
    if (nuevas[view]) {
        renderHeader();
        window.scrollTo(0, 0);
        app.innerHTML = nuevas[view]();
        return;
    }
    baseNavigate(view, params);
};

renderLogin = function (role, hasError) {
    loginBase(role, hasError);
    app.querySelector('form').onsubmit = handleLogin; // antes ignoraba la contraseña
};

renderTutorial = function () {
    tutorialBase();
    app.querySelectorAll('button[onclick*="perfil-consumidor"]').forEach(b =>
        b.setAttribute('onclick', b.getAttribute('onclick').replace("navigate('perfil-consumidor')", "navigate('descubrir')")));
};

function handleLogin(e) {
    e.preventDefault();
    if (document.getElementById('login-pass').value !== '1234') { navigate('login', { role: state.role, error: true }); return; }
    state.loggedIn = true;
    navigate(state.role === 'consumidor' ? 'descubrir' : 'categorias-comercio');
}

function renderHeader() {
    // La cabecera y la barra inferior ya están escritas en index.html; aquí solo se muestran u ocultan.
    const on = state.loggedIn;
    ['menu', 'lnk-notif', 'lnk-cuenta', 'bottom-nav'].forEach(id => { document.getElementById(id).hidden = !on; });
    const v = ['resultados', 'filtros', 'producto'].includes(state.view) ? 'descubrir'
        : ['perfil-consumidor', 'datos-local', 'editar-perfil'].includes(state.view) ? 'perfil' : state.view;
    document.querySelectorAll('[data-v]').forEach(a => a.classList.toggle('active', a.dataset.v === v));
}

// ---------- Utilidades de búsqueda ----------
function filtradas() {
    const b = state.busqueda, q = b.q.toLowerCase();
    return state.ofertas
        .filter(o => o.name.toLowerCase().includes(q) && (!b.cats.length || b.cats.includes(o.cat)) && parseFloat(o.distance) <= b.radio)
        .sort((a, c) => b.orden === 'precio' ? a.price - c.price : parseInt(a.discount) - parseInt(c.discount));
}
function buscar(e) {
    if (e) e.preventDefault();
    state.busqueda.q = document.getElementById('q').value.trim();
    navigate('resultados');
}
function toggleFiltroCat(c) {
    const a = state.busqueda.cats;
    state.busqueda.cats = a.includes(c) ? a.filter(x => x !== c) : [...a, c];
}
function limpiarFiltros() {
    state.busqueda = { q: '', cats: [], orden: 'precio', radio: 1 };
    navigate('descubrir');
}
function aplicarFiltros(e) {
    e.preventDefault();
    state.busqueda.radio = parseFloat(document.getElementById('f-radio').value);
    state.busqueda.orden = document.getElementById('f-orden').value;
    navigate('resultados');
}
function reservar(id) {
    const o = state.ofertas.find(x => x.id === id), n = +document.getElementById('qty').value;
    state.reservas.push({ nombre: o.name, store: o.store, n, total: n * o.price, codigo: String(Math.floor(1000 + Math.random() * 9000)) });
    navigate('reservas');
}

// ---------- Componentes ----------
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
const zona = extra => `<div class="sidebar-box"><h3 class="azul">Tu zona activa</h3><p>📍 Av. Canadá 100, La Victoria</p><small>Radio: ${state.busqueda.radio} km</small></div>${extra || ''}`;

// ---------- Pantallas ----------
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

function renderFiltros() {
    const b = state.busqueda;
    return `<p class="crumb">Inicio> Descubrir> Filtros</p>
        <h1>Filtrar ofertas</h1><p class="subtitle">Ajusta el radio, las categorías y el orden de los resultados.</p>
        <form style="max-width:560px" onsubmit="aplicarFiltros(event)">
            <div class="form-group"><label>Radio de búsqueda</label>
                <select id="f-radio">${[0.5, 1, 2].map(r => `<option value="${r}" ${b.radio === r ? 'selected' : ''}>${r} km</option>`).join('')}</select></div>
            <div class="form-group"><label>Ordenar por</label>
                <select id="f-orden"><option value="precio">Menor precio</option><option value="descuento" ${b.orden === 'descuento' ? 'selected' : ''}>Mayor descuento</option></select></div>
            <div class="check-grid">${CATEGORIAS.map(([c, i]) =>
                `<label class="check-item"><input type="checkbox" ${b.cats.includes(c) ? 'checked' : ''} onchange="toggleFiltroCat('${c}')"> ${i} ${c}</label>`).join('')}</div>
            <div class="btn-group"><button class="btn" type="submit">Aplicar filtros</button>
                <button type="button" class="btn btn-outline" onclick="limpiarFiltros()">Limpiar filtros</button></div>
        </form>`;
}

function renderMapa() {
    return `<p class="crumb">Inicio> Mapa</p><h1>Mapa de excedentes</h1>
        <p class="subtitle">Comercios con ofertas a ${state.busqueda.radio} km o menos de Av. Canadá 100, La Victoria.</p>
        <div class="placeholder-graphic mapa">🗺️<br><strong>Mapa de ofertas cercanas</strong></div>
        <div class="card-grid">${filtradas().map(o => `<div class="offer-card"><strong>📍 ${o.store}</strong>
            <small>${o.name} · ${o.distance} · ${dinero(o.price)}</small>
            <button class="btn-outline" onclick="navigate('producto',{id:${o.id}})">Ver oferta</button></div>`).join('')}</div>`;
}

function renderProducto(id) {
    const o = state.ofertas.find(x => x.id === id);
    if (!o) return `<p>Oferta no encontrada.</p><button class="btn" onclick="navigate('descubrir')">Volver a Descubrir</button>`;
    return `<p class="crumb">Inicio> Descubrir> ${o.name}</p>
        <h1>${o.name}</h1><p class="subtitle">${o.store} · 4.5/5 · aprox. ${o.distance}</p>
        <div class="layout-grid"><div>
            <div class="offer-img-placeholder" style="height:180px"><span style="font-size:3rem">${o.icon}</span></div>
            <div class="product-detail-grid">
                <div class="price-box"><small>Precio original</small><br><s>${dinero(o.originalPrice)}</s></div>
                <div class="price-box"><small>Descuento</small><br><strong class="verde">${o.discount}</strong></div>
                <div class="price-box"><small>Precio remate</small><br><strong class="azul">${dinero(o.price)}</strong></div>
            </div>
            <p class="subtitle" style="margin-top:16px">Hoy 07/10 · Recojo 18:00–20:00 · ${o.stock} ${o.unit} disponibles</p>
        </div><aside class="sidebar-box"><h3 class="azul">Resumen de reserva</h3>
            <div class="form-group"><label>Cantidad</label>
                <select id="qty" onchange="document.getElementById('tot').textContent=(this.value*${o.price}).toFixed(2)">
                    ${Array.from({ length: Math.min(o.stock, 5) }, (_, i) => `<option>${i + 1}</option>`).join('')}</select></div>
            <p><b>Total: S/<span id="tot">${o.price}</span></b></p>
            <button class="btn-green btn-block" style="margin-top:12px" onclick="reservar(${o.id})">Confirmar reserva</button>
            <small>Recojo presencial en el local</small>
        </aside></div>`;
}

function renderReservas() {
    const lista = state.reservas.map(r => `<div class="favorite-item"><div><strong>${r.n}x ${r.nombre}</strong><br>
        <small>${r.store} · Recojo hoy 18:00-20:00</small><br><small>Total ${dinero(r.total)}</small></div>
        <div class="codigo">Código<br><b>${r.codigo}</b></div></div>`).join('');
    return `<p class="crumb">Inicio> Reservas</p><h1>Mis reservas</h1><p class="subtitle">Muestra tu código al recoger en el local.</p>
        ${lista || `<div class="alert">! Aún no tienes reservas. Elige una oferta y confirma tu primera reserva.</div>
        <button class="btn" onclick="navigate('descubrir')">Descubrir ofertas</button>`}`;
}

function renderMayorista() {
    const lotes = [['Jaba de tomates', '🍅', 45, '3 jabas'], ['Saco de papa', '🥔', 60, '2 sacos'], ['Caja de yogures', '🥛', 38, '5 cajas']];
    return `<p class="crumb">Inicio> Al por mayor</p><h1>Al por mayor</h1>
        <p class="subtitle">Lotes en jabas, sacos y cajas para comercios minoristas.</p>
        <div class="card-grid">${lotes.map(([n, i, p, s]) => `<div class="offer-card"><span style="font-size:2rem">${i}</span><strong>${n}</strong>
            <div class="offer-price">${dinero(p)}</div><small>${state.comercio.nombre} · ${s} disponibles</small></div>`).join('')}</div>
        ${state.role === 'comerciante' ? `<div class="btn-group"><button class="btn" onclick="navigate('categorias-comercio')">Configurar venta por volumen</button></div>` : ''}`;
}

renderHeader(); // la pantalla inicial ya viene escrita en index.html