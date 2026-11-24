// pago-confirmado.js — comportamiento de la pantalla "Pago confirmado".
// Requiere state.js y shared.js.

const dineroConfirmado = n => 'S/' + Number(n || 0).toFixed(2);

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]').forEach(a => a.classList.add('active'));

    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }

    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    const indice = guardado !== null ? Number(guardado) : state.reservaSeleccionadaIndex;
    const reserva = state.reservas[indice];

    if (!reserva || reserva.estadoPago !== 'pagada') {
        navigate('reservas');
        return;
    }

    document.getElementById('payment-code').textContent = reserva.codigo || 'Pendiente';
    document.getElementById('mensaje-pago-confirmado').textContent =
        `El pago de ${dineroConfirmado(reserva.total)} se realizó correctamente. Tu reserva está lista para recoger.`;

    document.getElementById('contenido-pago-confirmado').hidden = false;
});