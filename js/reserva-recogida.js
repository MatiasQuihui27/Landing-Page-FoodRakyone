// reserva-recogida.js — comportamiento de la pantalla "Reserva recogida".
// Requiere state.js y shared.js.

const dineroRecogida = n => 'S/' + Number(n || 0).toFixed(2);

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

    if (!reserva || reserva.estadoPago !== 'pagada' && reserva.estado !== 'recogida' || reserva.estado === 'cancelada') {
        navigate('por-recoger');
        return;
    }
    if (reserva.estado !== 'recogida') {
        const ahora = new Date();
        const fecha = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(ahora);
        const hora = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(ahora);

        reserva.estado = 'recogida';
        reserva.fechaRecogida = `el ${fecha} a las ${hora}`;
        state.reservaSeleccionadaIndex = indice;
        guardarEstado();
    }

    const cantidad = Number(reserva.n || 1);
    const total = Number(reserva.total || 0);

    document.getElementById('resumen-recogida').textContent =
        `${reserva.referencia || `R-${1042 + indice}`} · Recogida ${reserva.fechaRecogida}`;

    document.getElementById('recogida-producto').textContent = reserva.nombre;
    document.getElementById('recogida-cantidad').textContent =
        `${cantidad} ${cantidad === 1 ? 'pack' : 'packs'} × ${dineroRecogida(total / cantidad)}`;
    document.getElementById('recogida-subtotal').textContent = dineroRecogida(total);
    document.getElementById('recogida-total').textContent = dineroRecogida(total);
    document.getElementById('recogida-comercio').textContent = reserva.store;
    document.getElementById('recogida-horario').textContent = reserva.recojo || 'Horario no especificado';
});