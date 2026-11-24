// detalle-reserva.js — comportamiento de la pantalla "Detalle de reserva".
// Requiere state.js y shared.js.

const dineroDetalle = n => 'S/' + Number(n || 0).toFixed(2);
let indiceDetalle = -1;

function alternarVistaDetalle() {
    const resumen = document.getElementById('detalle-resumen');
    const codigo = document.getElementById('detalle-codigo-panel');
    const mostrarCodigo = codigo.hidden;

    resumen.hidden = mostrarCodigo;
    codigo.hidden = !mostrarCodigo;
    document.getElementById('titulo-detalle').textContent =
        mostrarCodigo ? 'Código de recojo' : 'Resumen de la reserva';
    document.getElementById('btn-toggle-codigo').textContent =
        mostrarCodigo ? 'Mostrar resumen' : 'Mostrar código';
}

function solicitarReembolso() {
    navigate('solicitar-reembolso');
}


function irAReservaRecogida() {
    navigate('reserva-recogida');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]').forEach(a => a.classList.add('active'));

    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }

    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    indiceDetalle = guardado !== null ? Number(guardado) : (state.reservaSeleccionadaIndex ?? -1);
    const reserva = state.reservas[indiceDetalle];

    if (!reserva || reserva.estadoPago !== 'pagada' || ['cancelada', 'recogida'].includes(reserva.estado)) {
        navigate('por-recoger');
        return;
    }

    const cantidad = Number(reserva.n || 1);
    const total = Number(reserva.total || 0);
    const referencia = reserva.referencia || `R-${1042 + indiceDetalle}`;

    document.getElementById('detalle-estado').textContent = `${referencia} · Pagada · Vigente`;
    document.getElementById('detalle-producto').textContent = reserva.nombre;
    document.getElementById('detalle-cantidad').textContent =
        `${cantidad} ${cantidad === 1 ? 'pack' : 'packs'} × ${dineroDetalle(total / cantidad)}`;
    document.getElementById('detalle-subtotal').textContent = dineroDetalle(total);
    document.getElementById('detalle-total').textContent = dineroDetalle(total);
    document.getElementById('detalle-comercio').textContent = reserva.store;
    document.getElementById('detalle-recojo').textContent = reserva.recojo || 'Hoy · 18:00–20:00';
    document.getElementById('detalle-codigo').textContent = reserva.codigo || 'Pendiente';
});