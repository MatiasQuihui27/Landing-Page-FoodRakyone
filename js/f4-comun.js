// f4-comun.js — utilidades compartidas del Flujo 4 (inventario y publicación del comercio).
// Se carga después de state.js y shared.js en todas las pantallas F4-xx.

const dinero = n => 'S/' + Number(n).toFixed(2);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = v => parseFloat(String(v).replace(',', '.'));
const singular = u => String(u).toLowerCase().replace(/des$/, 'd').replace(/s$/, '');

const F4 = {
    inventario: 'f4-01-InventarioDeOfertas',
    publicar: 'f4-02-PublicarExcedente',
    faltaPrecio: 'f4-03-FaltaPrecioObligatorio',
    exito: 'f4-04-PublicacionExitosa',
    loteBloqueado: 'f4-05-LoteB2BBloqueado',
    lote: 'f4-06-PublicarLote',
    loteOk: 'f4-06A-LotePublicado',
    editar: 'f4-07-EditarOfertaActiva',
    confirmarAgotado: 'f4-08-ConfirmarAgotado',
    agotado: 'f4-09-AgotadoConfirmado',
    confirmarRetiro: 'f4-10-ConfirmarRetiro',
    retirado: 'f4-11-RetiroConfirmado',
    horarios: 'f4-12-HorariosDeRecojo',
    horarioInvalido: 'f4-13-HorarioInvalido',
    horariosOk: 'f4-14-HorariosGuardados',
    inicio: 'f5-01-InicioDelComercio'
};

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HORAS = Array.from({ length: 17 }, (_, i) => String(i + 6).padStart(2, '0') + ':00');
const CATEGORIAS_F4 = ['Panadería', 'Lácteos', 'Frutas', 'Verduras', 'Abarrotes', 'Comida preparada'];
const ICONOS_F4 = { 'Panadería': '🍞', 'Lácteos': '🥛', 'Frutas': '🍎', 'Verduras': '🥬', 'Abarrotes': '🛒', 'Comida preparada': '🍲' };
const FECHAS_CADUCIDAD = ['07/10/2026', '08/10/2026', '09/10/2026', '10/10/2026', '11/10/2026'];
const FECHAS_RECOJO = ['07/10/2026', '08/10/2026'];
const EMPAQUES = ['Empaque original sellado', 'Preparado en el día'];
const PAGINAS_PRODUCTO = [1, 2, 3]; // ofertas que ya tienen pantalla producto-N.html
const LOCAL_B2B = 'Puesto Verde · Mercado Santa Anita'; // caso de ejemplo del diseño (independiente de Bodega San Luis)

// ---------- Campos de formulario (mismo marcado que el resto de formularios) ----------
const opciones = (lista, sel) => lista.map(o => `<option${o === sel ? ' selected' : ''}>${o}</option>`).join('');
const campoTexto = (id, label, valor, ayuda = '', ph = '') =>
    `<div class="form-group"><label for="${id}">${label}</label><input type="text" id="${id}" value="${valor}" placeholder="${ph}">${ayuda ? `<span class="helper-text">${ayuda}</span>` : ''}</div>`;
const campoSelect = (id, label, lista, sel, ayuda = '') =>
    `<div class="form-group"><label for="${id}">${label}</label><select id="${id}">${opciones(lista, sel)}</select>${ayuda ? `<span class="helper-text">${ayuda}</span>` : ''}</div>`;

function mostrarError(id, msg) {
    const g = document.getElementById(id).closest('.form-group');
    g.classList.add('error-field');
    g.insertAdjacentHTML('beforeend', `<span class="error-msg">⚠️ ${msg}</span>`);
}
function limpiarErrores() {
    document.querySelectorAll('.error-msg').forEach(e => e.remove());
    document.querySelectorAll('.form-group.error-field').forEach(g => g.classList.remove('error-field'));
}

// ---------- Inventario ----------
function ofertaSeleccionada() {
    return state.inventario.find(o => o.id === state.ofertaSel)
        || state.inventario.find(o => o.estado === 'activa') || state.inventario[0];
}
function irA(vista, id) { state.ofertaSel = id; navigate(vista); }
function verComoConsumidor(id) { navigate(PAGINAS_PRODUCTO.includes(id) ? 'producto' : 'descubrir', { id }); }

const empaqueCorto = e => e === 'Empaque original sellado' ? 'Empaque sellado' : e;
const porcentaje = o => Math.round((1 - num(o.price) / num(o.originalPrice)) * 100);
const siguienteId = () => Math.max(0, ...state.ofertas.map(o => o.id), ...state.inventario.map(o => o.id)) + 1;

function parseCantidad(txt) {
    const m = String(txt).trim().match(/^(\d+)\s*(.*)$/);
    return m ? { n: parseInt(m[1], 10), unit: m[2].trim() } : null;
}

// Lo que ve el consumidor (state.ofertas) siempre refleja las ofertas ACTIVAS del inventario:
// agotar o retirar la quita de lista y mapa; publicar o editar la agrega o actualiza.
function ofertaConsumidor(o) {
    return {
        id: o.id, name: o.name, type: empaqueCorto(o.empaque), discount: `-${porcentaje(o)}%`,
        price: o.price, originalPrice: o.originalPrice, store: state.comercio.nombre, distance: '0.4 km',
        stock: o.stock, icon: ICONOS_F4[o.cat] || '🛒', cat: o.cat, unit: o.unit
    };
}
function sincronizarCatalogo() {
    state.ofertas = state.ofertas.filter(of => !state.inventario.some(i => i.id === of.id && i.estado !== 'activa'));
    state.inventario.filter(i => i.estado === 'activa').forEach(i => {
        const e = state.ofertas.find(of => of.id === i.id);
        if (e) Object.assign(e, { price: i.price, originalPrice: i.originalPrice, discount: `-${porcentaje(i)}%`, stock: i.stock });
        else state.ofertas.push(ofertaConsumidor(i));
    });
}
function cambiarEstado(id, estado) {
    const o = state.inventario.find(x => x.id === id);
    if (!o) return;
    if (estado === 'agotada') { o.stockPublicado = o.stock; o.stock = 0; }
    o.estado = estado;
    sincronizarCatalogo();
}
function publicarOferta(b) {
    const c = parseCantidad(b.cantidad);
    const o = {
        id: siguienteId(), canal: 'B2C', estado: 'activa', name: b.nombre.trim(), cat: b.categoria,
        price: num(b.remate).toFixed(2), originalPrice: num(b.original).toFixed(2), stock: c.n, unit: c.unit || 'packs',
        fecha: b.fecha.slice(0, 5), ini: b.ini, fin: b.fin, caducidad: b.caducidad.slice(0, 5), empaque: b.empaque
    };
    state.inventario.push(o);
    sincronizarCatalogo();
    return o;
}

// Tarjeta de una oferta del inventario (activa o agotada) con sus acciones.
function tarjetaOferta(o) {
    if (o.estado === 'agotada') {
        return `<article class="history-card">
            <p><strong>Agotada</strong></p>
            <p><strong>${esc(o.name)}</strong></p>
            <p><strong>${dinero(o.price)}</strong></p>
            <p>Stock disponible para compra: 0</p>
            <p>Retirada de lista y mapa activos</p>
            <p>Las reservas ya existentes conservan su detalle.</p>
            <div class="offer-actions offer-actions-2">
                <button type="button" class="btn" onclick="irA('${F4.editar}', ${o.id})">Editar</button>
                <button type="button" class="btn btn-outline" onclick="irA('${F4.confirmarRetiro}', ${o.id})">Retirar</button>
            </div>
        </article>`;
    }
    return `<article class="history-card">
        <p><strong>Activa · ${o.canal}</strong></p>
        <p><strong>${esc(o.name)}</strong></p>
        <p><strong>${dinero(o.price)} por ${singular(o.unit)}</strong></p>
        <p>Stock: ${o.stock} ${o.unit}</p>
        <p>Recojo: ${o.fecha} · ${o.ini}–${o.fin}</p>
        <p>Caducidad: ${o.caducidad} · ${empaqueCorto(o.empaque)}</p>
        <div class="offer-actions">
            <button type="button" class="btn" onclick="irA('${F4.editar}', ${o.id})">Editar</button>
            <button type="button" class="btn btn-outline" onclick="irA('${F4.confirmarAgotado}', ${o.id})">Marcar como agotado</button>
            <button type="button" class="btn btn-outline" onclick="irA('${F4.confirmarRetiro}', ${o.id})">Retirar</button>
        </div>
    </article>`;
}

// Aviso de operación exitosa (mismo marcado que "Entrega confirmada").
const avisoConfirmado = msg => `<div class="confirm-alert" role="status">
    <span class="confirm-icon" aria-hidden="true">✓</span>
    <div><strong>✓ Operación confirmada</strong><p>${msg}</p></div>
</div>`;
const avisoInfo = msg => `<div class="alert"><strong>ℹ️ Información</strong><br>${msg}</div>`;
const avisoError = msg => `<div class="alert error"><strong>⚠️ Revisa la información</strong><br>${msg}</div>`;

const fotoPlaceholder = (icono, texto) =>
    `<div class="placeholder-graphic"><p>${icono}</p><p>${texto}</p></div>
     <div class="btn-grid-3">
        <button type="button" class="btn" onclick="alert('Foto simulada: este mockup no sube archivos')">Cambiar foto</button>
        <button type="button" class="btn btn-outline" onclick="alert('Foto simulada: este mockup no usa la cámara')">Tomar foto</button>
        <button type="button" class="btn btn-outline" onclick="alert('Foto simulada: este mockup no sube archivos')">Subir archivo</button>
     </div>`;

// Datos de ejemplo del formulario "Publicar excedente" y cancelación del borrador (F4-02 / F4-03).
const borradorInicial = () => ({
    nombre: 'Pack de pan', cantidad: '8 packs', categoria: 'Panadería', original: '20.00', remate: '10.00',
    caducidad: '09/10/2026', empaque: 'Empaque original sellado', fecha: '07/10/2026', ini: '18:00', fin: '20:00'
});
function cancelarPublicacion() {
    state.borrador = null;
    navigate(F4.inventario);
}
