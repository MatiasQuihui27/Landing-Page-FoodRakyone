// pagar-reserva.js — comportamiento de la pantalla "Pagar reserva".
// Requiere state.js y shared.js.

const dineroPago = n => 'S/' + Number(n || 0).toFixed(2);
let indiceReservaPago = -1;

function cargarReservaPago() {
    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    indiceReservaPago = Number(guardado !== null ? guardado : state.reservaSeleccionadaIndex ?? -1);
    const reserva = state.reservas[indiceReservaPago];

    if (!reserva || reserva.estado === 'cancelada' || reserva.estado === 'recogida') {
    navigate('reservas');
    return;
    }
    if (reserva.estadoPago === 'pagada') {
        navigate('pago-confirmado');
        return;
    }

    const cantidad = Number(reserva.n || 1);
    const total = Number(reserva.total || 0);
    document.getElementById('pago-producto').textContent = reserva.nombre;
    document.getElementById('pago-cantidad').textContent = `${cantidad} ${cantidad === 1 ? 'pack' : 'packs'} × ${dineroPago(total / cantidad)}`;
    document.getElementById('pago-subtotal').textContent = dineroPago(total);
    document.getElementById('pago-total').textContent = dineroPago(total);
    document.getElementById('pago-comercio').textContent = reserva.store;
    document.getElementById('pago-recojo').textContent = reserva.recojo || 'Hoy · 18:00–20:00';
    document.getElementById('btn-pagar').textContent = `Pagar ahora · ${dineroPago(total)}`;
}

function pagarReserva(evento) {
    evento.preventDefault();
    const reserva = state.reservas[indiceReservaPago];
    const metodo = document.querySelector('input[name="metodoPago"]:checked');
    if (!reserva || !metodo) return alert('Selecciona un método de pago.');

    reserva.estadoPago = 'pagada';
    reserva.metodoPago = metodo.value;
    if (!reserva.codigo) reserva.codigo = String(Math.floor(1000 + Math.random() * 9000));

    state.reservaSeleccionadaIndex = indiceReservaPago;
    sessionStorage.setItem('foodrakyone-reserva-seleccionada', String(indiceReservaPago));
    guardarEstado();
    navigate('pago-confirmado');
}

function gestionarMetodosPago() {
    navigate('metodos-pago');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]').forEach(a => a.classList.add('active'));
    document.getElementById('form-pago').addEventListener('submit', pagarReserva);
    cargarReservaPago();
});