// producto-1.js — comportamiento de la pantalla "Detalle de oferta".
// Requiere state.js y shared.js (se cargan antes en el HTML).

const dinero = n => 'S/' + Number(n).toFixed(2);

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

function reservar(id) {
    const o = state.ofertas.find(x => x.id === id), n = +document.getElementById('qty').value;
    state.reservas.push({ nombre: o.name, store: o.store, n, total: n * o.price, codigo: String(Math.floor(1000 + Math.random() * 9000)) });
    navigate('reservas');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderProducto(1);
});
