// como-llegar.js — comportamiento de la pantalla "Cómo llegar al recojo".
// Requiere state.js y shared.js.

function cargarReserva() {
    const reservas = state.reservas;
    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    let indice = guardado !== null
        ? Number(guardado)
        : state.reservaSeleccionadaIndex;

    if (!Number.isInteger(indice) || indice < 0 || indice >= reservas.length) {
        indice = reservas.map(r => r.estadoPago).lastIndexOf('pagada');
    }
    const reserva = reservas[indice];
    if (!reserva) {
        document.getElementById('contenido-como-llegar').hidden = true;
        document.getElementById('aviso-sin-reserva').hidden = false;
        return;
    }

    const comercio = state.favoritos.find(f => f.name === reserva.store);
    const direccion = reserva.direccion ||
        comercio?.address ||
        (state.comercio?.nombre === reserva.store ? state.comercio.direccion : '') ||
        `${reserva.store}, Lima`;
    const oferta = state.ofertas.find(o =>
        o.name === reserva.nombre && o.store === reserva.store
    );
    document.getElementById('nombre-comercio').textContent = reserva.store;
    document.getElementById('distancia-comercio').textContent = oferta?.distance || 'distancia no disponible';
    document.getElementById('direccion-destino').textContent = direccion;
    document.getElementById('horario-recojo').textContent = reserva.recojo || 'Hoy · 18:00–20:00';
    document.getElementById('referencia-reserva').textContent = reserva.referencia || `R-${1042 + indice}`;
    document.getElementById('codigo-recojo').textContent = reserva.codigo || 'No disponible';
}

function mostrarCodigo() {
    const panel = document.getElementById('panel-codigo');
    panel.hidden = !panel.hidden;
    document.getElementById('btn-ver-codigo').textContent =
        panel.hidden ? 'Mostrar código' : 'Ocultar código';
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="mapa"]')
        .forEach(enlace => enlace.classList.add('active'));
    cargarReserva();
});