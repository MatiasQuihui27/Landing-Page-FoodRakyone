// f4-07-EditarOfertaActiva.js — comportamiento de "Editar oferta activa" (F4-07).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderEditarOferta() {
    const o = ofertaSeleccionada();
    return `<h1>Editar oferta activa</h1>
        <p class="subtitle">${esc(o.name)} · ${state.comercio.nombre}</p>

        <div class="grid-2">
            <div>
                <form onsubmit="handleEditarOferta(event)" novalidate>
                    <div class="form-grid">
                        ${campoTexto('ed-cantidad', 'Cantidad disponible *', o.estado === 'agotada' ? (o.stockPublicado || 1) : o.stock)}
                        ${campoTexto('ed-remate', 'Precio de remate (S/) *', o.price)}
                        ${campoSelect('ed-ini', 'Hora inicio *', HORAS, o.ini)}
                        ${campoSelect('ed-fin', 'Hora fin *', HORAS, o.fin)}
                    </div>
                    <div class="btn-group">
                        <button type="submit" class="btn">Guardar cambios</button>
                        <button type="button" class="btn btn-outline" onclick="navigate('${F4.inventario}')">Cancelar</button>
                    </div>
                </form>
                <div id="resultado-edicion"></div>
            </div>

            <aside class="aside-box">
                <h3 class="azul">Resultado visible</h3>
                <p>La oferta conserva los datos válidos mostrados en lista, mapa y detalle consumidor.</p>
            </aside>
        </div>`;
}

function handleEditarOferta(e) {
    e.preventDefault();
    limpiarErrores();
    const o = ofertaSeleccionada();
    const n = Number(document.getElementById('ed-cantidad').value), r = num(document.getElementById('ed-remate').value);
    const ini = document.getElementById('ed-ini').value, fin = document.getElementById('ed-fin').value;
    let ok = true;
    if (!Number.isInteger(n) || n < 1) { mostrarError('ed-cantidad', 'Ingresa una cantidad entera mayor a 0.'); ok = false; }
    if (!(r > 0) || r >= num(o.originalPrice)) { mostrarError('ed-remate', `El remate debe ser mayor a 0 y menor al precio original (${dinero(o.originalPrice)}).`); ok = false; }
    if (ini >= fin) { mostrarError('ed-fin', 'La hora de fin debe ser posterior al inicio.'); ok = false; }
    if (!ok) return;

    o.stock = n; o.price = r.toFixed(2); o.ini = ini; o.fin = fin;
    if (o.estado === 'agotada') { o.estado = 'activa'; delete o.stockPublicado; } // al reponer stock vuelve a estar activa
    sincronizarCatalogo();
    state.ofertaSel = o.id;
    document.getElementById('resultado-edicion').innerHTML = avisoConfirmado(`Cambios guardados: cantidad ${n}, precio ${dinero(r)} y recojo ${ini}–${fin}.`) +
        `<div class="btn-group">
            <button type="button" class="btn" onclick="navigate('${F4.inventario}')">Ver inventario</button>
            <button type="button" class="btn btn-outline" onclick="verComoConsumidor(${o.id})">Ver oferta como consumidor</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderEditarOferta();
});
