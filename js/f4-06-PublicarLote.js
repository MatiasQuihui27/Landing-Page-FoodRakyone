// f4-06-PublicarLote.js — comportamiento de "Publicar lote por volumen" (F4-06).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

const loteInicial = () => ({
    nombre: 'Tomate por volumen', categoria: 'Verduras', unidad: 'Jabas', cantidad: '3', precio: '30.00',
    caducidad: '09/10/2026', empaque: 'Empaque original sellado', fecha: '07/10/2026', ini: '18:00', fin: '20:00'
});

function renderPublicarLote() {
    const l = loteInicial();
    const unidades = state.comercio.unidades;
    return `<h1>Publicar lote por volumen</h1>
        <p class="subtitle">${LOCAL_B2B} · Canal B2B habilitado.</p>

        <div class="grid-2">
            <form onsubmit="handlePublicarLote(event)" oninput="actualizarTotalLote()" novalidate>
                <div class="form-grid">
                    ${campoTexto('lt-nombre', 'Producto *', esc(l.nombre))}
                    ${campoSelect('lt-categoria', 'Categoría *', CATEGORIAS_F4, l.categoria)}
                    ${campoSelect('lt-unidad', 'Unidad de medida *', unidades, l.unidad, `Opciones habilitadas: ${unidades.join(' / ')}.`)}
                    ${campoTexto('lt-cantidad', 'Cantidad de unidades *', l.cantidad)}
                    ${campoTexto('lt-precio', 'Precio por unidad (S/) *', l.precio)}
                    ${campoSelect('lt-caducidad', 'Caducidad *', FECHAS_CADUCIDAD, l.caducidad)}
                    ${campoSelect('lt-empaque', 'Empaque *', EMPAQUES, l.empaque)}
                    ${campoSelect('lt-fecha', 'Fecha de recojo *', FECHAS_RECOJO, l.fecha)}
                    ${campoSelect('lt-ini', 'Hora inicio *', HORAS, l.ini)}
                    ${campoSelect('lt-fin', 'Hora fin *', HORAS, l.fin)}
                </div>

                <h2>Foto del lote *</h2>
                ${fotoPlaceholder('🍎', 'Foto placeholder adjunta: tomate.jpg')}

                <div class="stat-grid">
                    <div class="stat-card"><small>Cantidad</small><strong id="lt-calc-cant">3 jabas</strong></div>
                    <div class="stat-card"><small>Precio unitario</small><strong id="lt-calc-unit">S/30.00</strong></div>
                    <div class="stat-card"><small>Precio total</small><strong id="lt-calc-total">S/90.00</strong></div>
                </div>

                <div class="btn-group">
                    <button type="submit" class="btn">Publicar lote</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('${F4.inventario}')">Cancelar</button>
                </div>
            </form>

            <aside class="aside-box">
                <h3 class="azul">Local del ejemplo B2B</h3>
                <p>Puesto Verde<br>Mercado Santa Anita<br>Pasillo 3, puesto 18<br>Contacto: 955 000 111<br>Este caso es independiente de Bodega San Luis.</p>
            </aside>
        </div>`;
}

function leerLote() {
    const v = id => document.getElementById(id).value;
    return {
        nombre: v('lt-nombre'), categoria: v('lt-categoria'), unidad: v('lt-unidad'), cantidad: v('lt-cantidad'),
        precio: v('lt-precio'), caducidad: v('lt-caducidad'), empaque: v('lt-empaque'), fecha: v('lt-fecha'),
        ini: v('lt-ini'), fin: v('lt-fin')
    };
}

// Total automático: cantidad × precio por unidad.
function actualizarTotalLote() {
    const l = leerLote(), n = parseInt(l.cantidad, 10), p = num(l.precio), ok = n > 0 && p >= 0;
    document.getElementById('lt-calc-cant').textContent = n > 0 ? `${n} ${n === 1 ? singular(l.unidad) : l.unidad.toLowerCase()}` : '—';
    document.getElementById('lt-calc-unit').textContent = p >= 0 ? dinero(p) : '—';
    document.getElementById('lt-calc-total').textContent = ok ? dinero(n * p) : '—';
}

function handlePublicarLote(e) {
    e.preventDefault();
    limpiarErrores();
    const l = leerLote(), n = Number(l.cantidad), p = num(l.precio);
    let ok = true;
    if (!l.nombre.trim()) { mostrarError('lt-nombre', 'Ingresa el nombre del producto.'); ok = false; }
    if (!Number.isInteger(n) || n < 1) { mostrarError('lt-cantidad', 'Ingresa una cantidad entera mayor a 0.'); ok = false; }
    if (!(p > 0)) { mostrarError('lt-precio', 'Ingresa un precio por unidad mayor a 0.'); ok = false; }
    if (l.ini >= l.fin) { mostrarError('lt-fin', 'La hora de fin debe ser posterior al inicio.'); ok = false; }
    if (!ok) return;

    state.lotes.push({
        id: state.lotes.length + 1, name: l.nombre.trim(), cat: l.categoria, unidad: l.unidad, cantidad: n,
        precio: p.toFixed(2), total: (n * p).toFixed(2), caducidad: l.caducidad.slice(0, 5), empaque: l.empaque,
        fecha: l.fecha.slice(0, 5), ini: l.ini, fin: l.fin, local: LOCAL_B2B
    });
    navigate(F4.loteOk);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderPublicarLote();
});
