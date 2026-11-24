// reportar-problema.js — comportamiento de la pantalla "Reportar problema".
// Requiere state.js y shared.js.

let indiceReporte = -1;

function mostrarReporteRecibido(reserva, referencia) {
    const reporte = reserva.reporteProblema;
    document.getElementById('pantalla-reporte').hidden = true;
    document.getElementById('pantalla-reporte-recibido').hidden = false;
    document.getElementById('resumen-reporte-recibido').textContent =
        `${referencia} · Incidente registrado.`;
    document.getElementById('motivos-enviados').textContent = reporte.motivos.join(' · ');

    const descripcion = document.getElementById('descripcion-enviada');
    descripcion.hidden = !reporte.descripcion;
    descripcion.querySelector('span').textContent = reporte.descripcion;
}

function enviarReporte(evento) {
    evento.preventDefault();

    const reserva = state.reservas[indiceReporte];
    const motivos = [...document.querySelectorAll('input[name="motivos"]:checked')].map(input => input.value);

    if (!motivos.length) {
        alert('Selecciona al menos un motivo para enviar el reporte.');
        return;
    }

    reserva.reporteProblema = {
        motivos,
        descripcion: document.getElementById('descripcion-reporte').value.trim(),
        fecha: new Date().toISOString()
    };

    guardarEstado();
    mostrarReporteRecibido(reserva, reserva.referencia || `R-${1042 + indiceReporte}`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();

    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }

    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    indiceReporte = guardado !== null ? Number(guardado) : state.reservaSeleccionadaIndex;
    const reserva = state.reservas[indiceReporte];

    if (!reserva || reserva.estado !== 'recogida') {
        navigate('reserva-recogida');
        return;
    }

    const referencia = reserva.referencia || `R-${1042 + indiceReporte}`;
    document.getElementById('resumen-reporte').textContent =
        `Reserva ${referencia} · ${reserva.nombre} × ${reserva.n || 1} · ${reserva.store}`;

    if (reserva.reporteProblema) mostrarReporteRecibido(reserva, referencia);

    document.getElementById('form-reporte').addEventListener('submit', enviarReporte);
});