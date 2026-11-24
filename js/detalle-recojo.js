// detalle-recojo.js — comportamiento de la pantalla "Detalle del recojo".
// Requiere state.js y shared.js.

const dineroRecojoDetalle = n => 'S/' + Number(n || 0).toFixed(2);

function cargarDetalleRecojo() {
    const guardado = sessionStorage.getItem('foodrakyone-reserva-seleccionada');
    const indice = guardado !== null ? Number(guardado) : state.reservaSeleccionadaIndex;
    const reserva = state.reservas[indice];

    if (!reserva || String(reserva.estado || '').toLowerCase() !== 'recogida') {
        navigate('historial-recojo');
        return;
    }

    const cantidad = Math.max(1, Number(reserva.n || 1));
    const total = Number(reserva.total || 0);
    const fecha = String(reserva.fechaRecogida || '');
    const dia = fecha.match(/\d{2}\/\d{2}\/\d{4}/);
    const hora = fecha.match(/\d{2}:\d{2}/);

    document.getElementById('recojo-referencia').textContent = reserva.referencia || `R-${1042 + indice}`;
    document.getElementById('recojo-producto').textContent = reserva.nombre || 'Producto';
    document.getElementById('recojo-cantidad').textContent =
        `${cantidad} ${cantidad === 1 ? 'pack' : 'packs'} × ${dineroRecojoDetalle(total / cantidad)}`;
    document.getElementById('recojo-subtotal').textContent = dineroRecojoDetalle(total);
    document.getElementById('recojo-total').textContent = dineroRecojoDetalle(total);
    document.getElementById('recojo-comercio').textContent = reserva.store || 'Comercio FoodRakyone';
    document.getElementById('recojo-fecha').textContent = dia
        ? `${dia[0]}${hora ? ' · ' + hora[0] : ''}`
        : fecha || 'Fecha no registrada';
    document.getElementById('recojo-codigo').textContent = reserva.codigo || 'No registrado';
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    document.querySelectorAll('[data-v="reservas"]').forEach(a => a.classList.add('active'));
    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }
    cargarDetalleRecojo();
});