// cancelar-reserva.js — comportamiento de la pantalla "Cancelar reserva".
// Requiere state.js y shared.js.

const dineroCancelacion = n => 'S/' + Number(n || 0).toFixed(2);
const CLAVE_RESERVA_CANCELACION = 'foodrakyone-reserva-seleccionada';
let indiceReservaCancelacion = -1;

function obtenerIndiceReservaCancelacion() {
    const guardado = sessionStorage.getItem(CLAVE_RESERVA_CANCELACION);
    const indice = guardado !== null ? Number(guardado) : state.reservaSeleccionadaIndex;
    return Number.isInteger(indice) && indice >= 0 && indice < state.reservas.length ? indice : -1;
}

function obtenerDatosCancelacion(reserva) {
    const cantidad = Math.max(1, Number(reserva.n || reserva.cantidad || 1));
    const total = Number(reserva.total || 0);
    const subtotal = Number(reserva.subtotal ?? total);
    const nombre = reserva.nombre || reserva.producto || 'Oferta reservada';
    const comercio = reserva.store || reserva.comercio || 'Comercio FoodRakyone';
    const recojo = reserva.recojo || 'Horario no especificado';

    return { cantidad, total, subtotal, nombre, comercio, recojo };
}

function cargarDatosCancelacion(datos) {
    document.getElementById('cancelacion-producto').textContent = datos.nombre;
    document.getElementById('cancelacion-cantidad').textContent =
        `${datos.cantidad} ${datos.cantidad === 1 ? 'pack' : 'packs'} × ${dineroCancelacion(datos.total / datos.cantidad)}`;
    document.getElementById('cancelacion-subtotal').textContent = dineroCancelacion(datos.subtotal);
    document.getElementById('cancelacion-total').textContent = dineroCancelacion(datos.total);
    document.getElementById('cancelacion-comercio').textContent = datos.comercio;
    document.getElementById('cancelacion-recojo').textContent = datos.recojo;
}

function renderSinReserva() {
    document.getElementById('pantalla-confirmar-cancelacion').hidden = true;
    document.getElementById('pantalla-cancelacion-confirmada').hidden = true;
    document.getElementById('cancelacion-sin-reserva').hidden = false;
}

function renderCancelacionConfirmada(reserva, datos) {
    const estadoPago = reserva.estadoPago === 'pagada'
        ? `El pago de ${dineroCancelacion(datos.total)} permanece registrado. La cancelación no genera un reembolso automático; la solicitud de reembolso por reserva fallida tiene un proceso separado.`
        : 'El pago estaba pendiente, por lo que no se realizó ningún cobro.';

    document.getElementById('cancelacion-estado-pago').textContent = estadoPago;
    document.getElementById('pantalla-confirmar-cancelacion').hidden = true;
    document.getElementById('cancelacion-sin-reserva').hidden = true;
    document.getElementById('pantalla-cancelacion-confirmada').hidden = false;
}

function mantenerReserva() {    navigate('reservas');   }

function confirmarCancelacion() {
    const reserva = state.reservas[indiceReservaCancelacion]
    if (!reserva) {
        renderSinReserva();
        return;
    }
    reserva.estado = 'cancelada';
    state.reservaSeleccionadaIndex = indiceReservaCancelacion;
    guardarEstado();
    renderCancelacionConfirmada(reserva, obtenerDatosCancelacion(reserva));
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]').forEach(enlace => enlace.classList.add('active'));
    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }
    indiceReservaCancelacion = obtenerIndiceReservaCancelacion();
    const reserva = state.reservas[indiceReservaCancelacion];
    if (!reserva) {
        renderSinReserva();
        return;
    }
    const datos = obtenerDatosCancelacion(reserva);
    cargarDatosCancelacion(datos);
    if (reserva.estado === 'cancelada') {   renderCancelacionConfirmada(reserva, datos);    }
});