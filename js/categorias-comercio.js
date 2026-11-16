// categorias-comercio.js — comportamiento de la pantalla "Categorías y venta por volumen".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderCategoriasComercio() {
    const cats = ['Panadería', 'Lácteos', 'Abarrotes', 'Comida preparada', 'Frutas', 'Verduras'];
    app.innerHTML = `
        <h1>Categorías y venta por volumen ${!state.comercio.b2b ? '— B2B desactivado' : ''}</h1>
        <p class="subtitle">${state.comercio.b2b ? 'Define qué productos ofrece tu comercio.' : 'Puedes volver a habilitar el canal comerciantes minoristas cuando lo necesites.'}</p>

        <div class="grid-2">
            <div>
                <h2>Categorías públicas</h2>
                <div class="check-grid">
                    ${cats.map(c => `
                        <label class="check-item">
                            <input type="checkbox" ${state.comercio.categorias.includes(c) ? 'checked' : ''} onchange="toggleCat('${c}')">
                            ${c}
                        </label>
                    `).join('')}
                </div>

                <h2>Unidades predeterminadas habilitadas</h2>
                ${state.comercio.b2b ? `
                    <div class="check-grid">
                        <label class="check-item"><input type="checkbox" checked> Jabas</label>
                        <label class="check-item"><input type="checkbox" checked> Sacos</label>
                        <label class="check-item"><input type="checkbox" checked> Cajas</label>
                    </div>
                ` : `
                    <div class="box" style="margin-bottom:15px; background:#f8fafc">
                        <strong>Unidades de volumen</strong><br>
                        <small>Jabas / Sacos / Cajas — Activa Al por mayor para habilitar las unidades.</small>
                    </div>
                `}

                <div class="alert">
                    <strong>ℹ️ Información</strong><br>
                    ${state.comercio.b2b
                        ? 'Al guardar, tu ficha pública mostrará las categorías seleccionadas y el indicador "Venta por volumen".'
                        : 'El indicador B2B no aparecerá en la ficha pública. Publicar lotes está bloqueado.'}
                </div>

                <div class="btn-group">
                    <button class="btn" onclick="alert('Configuración guardada correctamente')">Guardar configuración</button>
                    <button class="btn btn-outline" onclick="state.comercio.b2b = !state.comercio.b2b; renderCategoriasComercio()">
                        ${state.comercio.b2b ? 'Desactivar venta B2B' : 'Activar venta al por mayor'}
                    </button>
                </div>
            </div>
            <aside class="aside-box">
                <strong>Tu local</strong>
                <p>${state.comercio.nombre}<br>${state.comercio.direccion}</p>
                <hr>
                <h4>Categorías activas</h4>
                <p>${state.comercio.categorias.map(c => `[${c}]`).join(' ')}</p>
                <h4>Estado B2B</h4>
                <p>${state.comercio.b2b ? 'Venta al por mayor habilitada.' : 'Canal mayorista desactivado.'}</p>
            </aside>
        </div>
    `;
}

function toggleCat(c) {
    if (state.comercio.categorias.includes(c)) {
        state.comercio.categorias = state.comercio.categorias.filter(item => item !== c);
    } else {
        state.comercio.categorias.push(c);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderCategoriasComercio();
});
