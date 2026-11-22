// f4-02-PublicarExcedente.js — comportamiento de "Publicar excedente" (F4-02).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderPublicarExcedente() {
    const b = state.borrador || borradorInicial();
    const o = num(b.original), r = num(b.remate);
    const pct = o > 0 && r >= 0 && r <= o ? Math.round((1 - r / o) * 100) : null;
    const btnDesc = p => `<button type="button" id="desc-${p}" class="btn${pct === p ? '' : ' btn-outline'}" onclick="aplicarDescuento(${p})">−${p}%</button>`;
    return `<h1>Publicar excedente</h1>
        <p class="subtitle">Formulario corto B2C · Completa datos, precio y horario.</p>

        <div class="grid-2">
            <form onsubmit="handlePublicarExcedente(event)" oninput="actualizarVistaExcedente()" novalidate>
                <div class="form-grid">
                    ${campoTexto('ex-nombre', 'Nombre del producto *', esc(b.nombre))}
                    ${campoTexto('ex-cantidad', 'Cantidad disponible *', esc(b.cantidad))}
                    ${campoSelect('ex-categoria', 'Categoría *', CATEGORIAS_F4, b.categoria)}
                    ${campoTexto('ex-original', 'Precio original (S/) *', esc(b.original))}
                    ${campoTexto('ex-remate', 'Precio de remate manual (S/)', esc(b.remate), 'Puedes ingresar el remate sin usar los botones de descuento.')}
                    ${campoSelect('ex-caducidad', 'Caducidad *', FECHAS_CADUCIDAD, b.caducidad)}
                    ${campoSelect('ex-empaque', 'Estado del empaque *', EMPAQUES, b.empaque, 'Opciones: Empaque original sellado / Preparado en el día.')}
                    ${campoSelect('ex-fecha', 'Fecha de recojo *', FECHAS_RECOJO, b.fecha)}
                    ${campoSelect('ex-ini', 'Hora inicio *', HORAS, b.ini)}
                    ${campoSelect('ex-fin', 'Hora fin *', HORAS, b.fin)}
                </div>

                <h2>Foto del alimento *</h2>
                ${fotoPlaceholder('🍲', 'Foto placeholder adjunta: pan.jpg')}

                <div class="btn-grid-3">${btnDesc(50)}${btnDesc(30)}${btnDesc(70)}</div>
                <div class="stat-grid">
                    <div class="stat-card"><small>Original</small><strong id="calc-orig">${o > 0 ? dinero(o) : '—'}</strong></div>
                    <div class="stat-card"><small>Descuento</small><strong id="calc-desc">${pct === null ? '—' : pct + '%'}</strong></div>
                    <div class="stat-card"><small>Remate calculado</small><strong id="calc-remate">${pct === null ? '—' : dinero(r)}</strong></div>
                </div>

                <div class="btn-group">
                    <button type="submit" class="btn">Publicar excedente</button>
                    <button type="button" class="btn btn-outline" onclick="cancelarPublicacion()">Cancelar</button>
                </div>
            </form>

            <aside class="aside-box" id="vista-previa">${htmlVistaPrevia(b)}</aside>
        </div>`;
}

function htmlVistaPrevia(b) {
    const c = parseCantidad(b.cantidad);
    return `<h3 class="azul">Vista previa de la oferta</h3>
        <p>${esc(b.nombre)}<br>${c ? `${c.n} ${c.unit || 'packs'}` : esc(b.cantidad)} · ${num(b.remate) >= 0 ? dinero(num(b.remate)) : '—'} cada uno<br>Recojo: ${b.ini}–${b.fin}<br>Caducidad: ${b.caducidad}<br>${b.empaque}</p>`;
}

function leerBorradorExcedente() {
    const v = id => document.getElementById(id).value;
    return {
        nombre: v('ex-nombre'), cantidad: v('ex-cantidad'), categoria: v('ex-categoria'), original: v('ex-original'),
        remate: v('ex-remate'), caducidad: v('ex-caducidad'), empaque: v('ex-empaque'), fecha: v('ex-fecha'),
        ini: v('ex-ini'), fin: v('ex-fin')
    };
}

// Recalcula descuento, remate y vista previa mientras se escribe.
function actualizarVistaExcedente() {
    const b = leerBorradorExcedente(), o = num(b.original), r = num(b.remate);
    const ok = o > 0 && b.remate.trim() !== '' && r >= 0 && r <= o;
    const pct = ok ? Math.round((1 - r / o) * 100) : null;
    document.getElementById('calc-orig').textContent = o > 0 ? dinero(o) : '—';
    document.getElementById('calc-desc').textContent = ok ? pct + '%' : '—';
    document.getElementById('calc-remate').textContent = ok ? dinero(r) : '—';
    [50, 30, 70].forEach(p => { document.getElementById('desc-' + p).className = 'btn' + (pct === p ? '' : ' btn-outline'); });
    document.getElementById('vista-previa').innerHTML = htmlVistaPrevia(b);
}

function aplicarDescuento(p) {
    const o = num(document.getElementById('ex-original').value);
    if (!(o > 0)) { limpiarErrores(); mostrarError('ex-original', 'Ingresa el precio original para calcular el descuento.'); return; }
    document.getElementById('ex-remate').value = (o * (1 - p / 100)).toFixed(2);
    actualizarVistaExcedente();
}

function handlePublicarExcedente(e) {
    e.preventDefault();
    limpiarErrores();
    const b = leerBorradorExcedente();
    state.borrador = b;
    if (!b.remate.trim()) { navigate(F4.faltaPrecio); return; } // F4-03: precio obligatorio

    let ok = true;
    const c = parseCantidad(b.cantidad), o = num(b.original), r = num(b.remate);
    if (!b.nombre.trim()) { mostrarError('ex-nombre', 'Ingresa el nombre del producto.'); ok = false; }
    if (!c || c.n < 1) { mostrarError('ex-cantidad', 'Ingresa una cantidad válida (ej. 8 packs).'); ok = false; }
    if (!(o > 0)) { mostrarError('ex-original', 'Ingresa un precio original válido.'); ok = false; }
    else if (!(r > 0) || r >= o) { mostrarError('ex-remate', 'El remate debe ser mayor a 0 y menor al precio original.'); ok = false; }
    if (b.ini >= b.fin) { mostrarError('ex-fin', 'La hora de fin debe ser posterior al inicio.'); ok = false; }
    if (!ok) return;

    const nueva = publicarOferta(b);
    state.borrador = null;
    state.ofertaSel = nueva.id;
    navigate(F4.exito);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderPublicarExcedente();
});
