// reembolso-proceso.js — comportamiento de la pantalla "Reembolso en proceso".
// Requiere state.js y shared.js.

const dineroProceso = n => 'S/' + Number(n || 0).toFixed(2);

function cargarReembolsoProceso() {
    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    const indice = guardado !== null ? Number(guardado) : state.reservaSeleccionadaIndex;
    const reserva = state.reservas[indice];

    if (!reserva || reserva.estadoReembolso !== 'solicitado') {
        navigate('reservas');
        return;
    }

    const referencia = reserva.referencia || `R-${1042 + indice}`;
    const cantidad = Math.max(1, Number(reserva.n || reserva.cantidad || 1));

    document.getElementById('reembolso-proceso-resumen').textContent =
        `${referencia} · Reserva reportada por ${reserva.motivoReembolso}.`;

    document.getElementById('proceso-producto').textContent =
        `${reserva.nombre || reserva.producto || 'Oferta reservada'} × ${cantidad}`;

    document.getElementById('proceso-total').textContent =
        dineroProceso(reserva.total);

    document.getElementById('proceso-comercio').textContent =
        `${reserva.store || 'Comercio FoodRakyone'} · ${referencia}`;

    document.getElementById('proceso-motivo').textContent =
        `Motivo: ${reserva.motivoReembolso}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]').forEach(enlace => enlace.classList.add('active'));

    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }

    cargarReembolsoProceso();
});