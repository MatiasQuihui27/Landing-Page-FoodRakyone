// pagar-reserva.js — comportamiento de la pantalla "Pagar reserva".
// Requiere state.js y shared.js.

const dineroPago = n => 'S/' + Number(n).toFixed(2);

let indiceReservaPago = -1;

function cargarReservaPago() {
    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');

        if (guardado !== null) {    indiceReservaPago = Number(guardado);   } 
        else {  indiceReservaPago = state.reservaSeleccionadaIndex ?? -1;   }

    const reserva = state.reservas[indiceReservaPago];

    if (!reserva) {
        document.getElementById('payment-layout').hidden = true;
        document.getElementById('payment-not-found').hidden = false;
        return;
    }

    const cantidad = Number(reserva.n || 1);
    const total = Number(reserva.total || 0);

    document.getElementById('pago-producto').textContent = reserva.nombre;
    document.getElementById('pago-cantidad').textContent = `${cantidad} ${cantidad === 1 ? 'pack' : 'packs'} × ${dineroPago(total / cantidad)}`;
    document.getElementById('pago-subtotal').textContent = dineroPago(total);
    document.getElementById('pago-total').textContent = dineroPago(total);
    document.getElementById('pago-comercio').textContent = reserva.store;
    document.getElementById('pago-recojo').textContent = 'Hoy · 18:00–20:00';
    document.getElementById('btn-pagar').textContent = `Pagar ahora · ${dineroPago(total)}`;

    if (reserva.estadoPago === 'pagada') {  mostrarPagoConfirmado(reserva); }
}

function pagarReserva(evento) {
    evento.preventDefault();
    const reserva = state.reservas[indiceReservaPago];
    if (!reserva) return;
    const metodo = document.querySelector('input[name="metodoPago"]:checked');

    if (!metodo) {
        alert('Selecciona un método de pago.');
        return;
    }

    reserva.estadoPago = 'pagada';
    reserva.metodoPago = metodo.value;

    if (!reserva.codigo) {
        reserva.codigo = String(Math.floor(1000 + Math.random() * 9000));
    }

    state.reservaSeleccionadaIndex = indiceReservaPago;
    guardarEstado();
    mostrarPagoConfirmado(reserva);
}

function mostrarPagoConfirmado(reserva) {
    document.getElementById('payment-options').hidden = true;
    document.getElementById('payment-result').hidden = false;
    document.getElementById('payment-code').textContent = reserva.codigo;
}

function gestionarMetodosPago() {   navigate('metodos-pago');   }

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]')
        .forEach(enlace => enlace.classList.add('active'));
    cargarReservaPago();
    document.getElementById('form-pago')
        .addEventListener('submit', pagarReserva);
});