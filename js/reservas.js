// reservas.js — comportamiento de la pantalla "Mis reservas".
// Requiere state.js y shared.js.

const dinero = n => 'S/' + Number(n || 0).toFixed(2);

function seleccionarReserva(indice, pantalla) {
    state.reservaSeleccionadaIndex = indice;
    sessionStorage.setItem('foodrakyone-reserva-seleccionada', String(indice));
    navigate(pantalla);
}

function irAPagarReserva(i) { seleccionarReserva(i, 'pagar-reserva'); }
function irACancelarReserva(i) { seleccionarReserva(i, 'cancelar-reserva'); }

function renderReservas() {
    const lista = document.getElementById('lista-reservas');
    const aviso = document.getElementById('reservas-vacias');
    const navegacion = document.getElementById('navegacion-reservas');

    const disponibles = state.reservas.map((r, i) => ({ r, i }))
        .filter(({ r }) => r.estado !== 'cancelada');

    const pendientes = disponibles.filter(({ r }) => r.estadoPago !== 'pagada' && r.estado !== 'recogida');

    navegacion.hidden = !disponibles.length;
    aviso.hidden = !!pendientes.length;
    lista.innerHTML = '';

    pendientes.forEach(({ r, i }) => {
        const tarjeta = document.getElementById('plantilla-reserva').content.firstElementChild.cloneNode(true);
        const campo = n => tarjeta.querySelector(`[data-campo="${n}"]`);

        campo('titulo').textContent = `${r.n}x ${r.nombre}`;
        campo('detalle').textContent = `${r.store} · Recojo hoy 18:00-20:00`;
        campo('total').textContent = dinero(r.total);
        campo('codigo').textContent = r.codigo || 'Pendiente';

        tarjeta.querySelector('[data-accion="pagar"]').onclick = () => irAPagarReserva(i);
        tarjeta.querySelector('[data-accion="cancelar"]').onclick = () => irACancelarReserva(i);

        lista.appendChild(tarjeta);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderReservas();
});