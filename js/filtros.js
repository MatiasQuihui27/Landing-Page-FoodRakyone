// filtros.js — comportamiento de la pantalla "Filtros".
// Requiere state.js y shared.js (se cargan antes en el HTML).

const CATEGORIAS = [["Panadería","🍞"],["Lácteos","🥛"],["Frutas","🍎"],["Comida preparada","🍲"]];

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

function aplicarFiltros(e) {
    e.preventDefault();
    state.busqueda.radio = parseFloat(document.getElementById('f-radio').value);
    state.busqueda.orden = document.getElementById('f-orden').value;
    navigate('resultados');
}

function limpiarFiltros() {
    state.busqueda = { q: '', cats: [], orden: 'precio', radio: 1 };
    navigate('descubrir');
}

function toggleFiltroCat(c) {
    const a = state.busqueda.cats;
    state.busqueda.cats = a.includes(c) ? a.filter(x => x !== c) : [...a, c];
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderFiltros();
});
