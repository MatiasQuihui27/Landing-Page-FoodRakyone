// calificar-comercio.js — comportamiento de la pantalla "Calificar comercio".
// Requiere state.js y shared.js.

let indiceCalificacion = -1;
let estrellasSeleccionadas = 4;

function seleccionarCalificacion(valor) {
    estrellasSeleccionadas = valor;
    document.getElementById('valor-calificacion').textContent = valor;

    document.querySelectorAll('[data-estrellas]').forEach(boton => {
        const activo = Number(boton.dataset.estrellas) === valor;
        boton.className = activo ? 'btn' : 'btn-outline';
        boton.setAttribute('aria-pressed', String(activo));
    });
}

function mostrarCalificacionRegistrada(reserva, referencia) {
    document.getElementById('pantalla-calificar').hidden = true;
    document.getElementById('pantalla-calificacion-registrada').hidden = false;
    document.getElementById('referencia-calificacion').textContent = `${referencia} · Una calificación por reserva.`;
    document.getElementById('comentario-registrado').textContent = reserva.comentarioCalificacion || 'No se agregó un comentario.';
    document.getElementById('estrellas-confirmadas').textContent = reserva.calificacion;
}

function enviarCalificacion(evento) {
    evento.preventDefault();

    const reserva = state.reservas[indiceCalificacion];
    if (!reserva || reserva.calificacion) return;

    reserva.calificacion = estrellasSeleccionadas;
    reserva.comentarioCalificacion = document.getElementById('comentario-calificacion').value.trim();
    reserva.fechaCalificacion = new Date().toISOString();

    guardarEstado();
    mostrarCalificacionRegistrada(reserva, reserva.referencia || `R-${1042 + indiceCalificacion}`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }
    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    indiceCalificacion = guardado !== null ? Number(guardado) : state.reservaSeleccionadaIndex;
    const reserva = state.reservas[indiceCalificacion];

    if (!reserva || reserva.estado !== 'recogida') {
        navigate('historial-recojo');
        return;
    }
    const referencia = reserva.referencia || `R-${1042 + indiceCalificacion}`;
    const fecha = reserva.fechaRecogida ? ` · ${reserva.fechaRecogida}` : '';

    document.getElementById('resumen-calificacion').textContent = `${reserva.store} · Reserva ${referencia} recogida${fecha}.`;
    if (reserva.calificacion) { mostrarCalificacionRegistrada(reserva, referencia); }

    document.getElementById('form-calificacion').addEventListener('submit', enviarCalificacion);
});