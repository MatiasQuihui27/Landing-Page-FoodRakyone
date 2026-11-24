// solicitar-reembolso.js — comportamiento de la pantalla "Solicitar reembolso".
// Requiere state.js y shared.js.

const dineroReembolso = n => 'S/' + Number(n || 0).toFixed(2);
const CLAVE_RESERVA_REEMBOLSO = 'foodrakyone-reserva-seleccionada';
let indiceReservaReembolso = -1;

function obtenerIndiceReservaReembolso() {
    const guardado = sessionStorage.getItem(CLAVE_RESERVA_REEMBOLSO);
    const indice = guardado !== null ? Number(guardado) : state.reservaSeleccionadaIndex;

    return Number.isInteger(indice) && indice >= 0 && indice < state.reservas.length
        ? indice : -1;
}

function mostrarAvisoReembolso(tipo, titulo, mensaje) {
    const aviso = document.getElementById('reembolso-aviso');
    aviso.className = 'alert' + (tipo ? ` ${tipo}` : '');
    document.getElementById('reembolso-aviso-titulo').textContent = titulo;
    document.getElementById('reembolso-aviso-mensaje').textContent = mensaje;
}

function cargarDatosReembolso(reserva) {
    const cantidad = Math.max(1, Number(reserva.n || reserva.cantidad || 1));
    const total = Number(reserva.total || 0);
    const referencia = reserva.referencia || `R-${1042 + indiceReservaReembolso}`;
    const nombre = reserva.nombre || reserva.producto || 'Oferta reservada';

    document.getElementById('reembolso-resumen').textContent =
        `${referencia} · Pagada y vigente · ${dineroReembolso(total)}`;

    document.getElementById('reembolso-monto').textContent =
        `${dineroReembolso(total)} · ${nombre} × ${cantidad}`;

    const motivoGuardado = reserva.motivoReembolso;
    if (motivoGuardado) {
        document.querySelectorAll('input[name="motivo-reembolso"]').forEach(opcion => {
            opcion.checked = opcion.value === motivoGuardado;
        });
    }
}

function confirmarSolicitudReembolso() {
    const motivo = document.querySelector('input[name="motivo-reembolso"]:checked');

    if (!motivo) {
        mostrarAvisoReembolso(
            'error',
            '⚠ Revisa la información',
            'Debes seleccionar un motivo para solicitar el reembolso.'
        );
        return;
    }

    const reserva = state.reservas[indiceReservaReembolso];
    reserva.motivoReembolso = motivo.value;
    reserva.estadoReembolso = 'solicitado';
    reserva.fechaSolicitudReembolso = new Date().toLocaleString('es-PE');

    guardarEstado();
    navigate('reembolso-proceso');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]').forEach(enlace => enlace.classList.add('active'));

    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }

    indiceReservaReembolso = obtenerIndiceReservaReembolso();
    const reserva = state.reservas[indiceReservaReembolso];

    if (!reserva || reserva.estadoPago !== 'pagada' ||
        ['cancelada', 'recogida'].includes(String(reserva.estado || '').toLowerCase())) {
        navigate('reservas');
        return;
    }

    cargarDatosReembolso(reserva);

    document.querySelectorAll('input[name="motivo-reembolso"]').forEach(opcion => {
        opcion.addEventListener('change', () => {
            mostrarAvisoReembolso(
                '',
                'ⓘ Información',
                'Utiliza esta opción si el local estaba cerrado o no te entregaron el producto.'
            );
        });
    });
});