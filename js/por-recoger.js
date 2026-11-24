// por-recoger.js — comportamiento de la pantalla "Por recoger".
// Requiere state.js y shared.js.

const dineroRecojo = n => 'S/' + Number(n || 0).toFixed(2);

function seleccionarReservaRecojo(indice, pantalla) {
    state.reservaSeleccionadaIndex = indice;
    sessionStorage.setItem('foodrakyone-reserva-seleccionada', String(indice));
    navigate(pantalla);
}

function cargarReservasRecojo() {
    const reservas = state.reservas.map((r, i) => ({ r, i })).filter(({ r }) =>
        r.estadoPago === 'pagada' && !['cancelada', 'recogida'].includes(String(r.estado || '').toLowerCase())
    );
    document.getElementById('separacion-recojo-vacio').hidden = reservas.length > 0;
    document.getElementById('resumen-recojo').textContent = reservas.length
        ? `Por recoger · Tienes ${reservas.length} ${reservas.length === 1 ? 'reserva pendiente' : 'reservas pendientes'} de recoger.`
        : 'Por recoger · Sin reservas pendientes de recoger.';

    document.getElementById('estado-vacio').hidden = !!reservas.length;
    document.getElementById('contenido-reservas').hidden = !reservas.length;
    document.getElementById('zona-recojo').hidden = !reservas.length;

    const lista = document.getElementById('lista-reservas-recojo');
    lista.innerHTML = '';

    reservas.forEach(({ r, i }, posicion) => {
        const tarjeta = document.getElementById('plantilla-reserva-recojo').content.firstElementChild.cloneNode(true);
        const campo = n => tarjeta.querySelector(`[data-campo="${n}"]`);
        const comercio = (state.favoritos || []).find(f => f.name === r.store);
        const direccion = r.direccion || comercio?.address ||
            (state.comercio?.nombre === r.store ? state.comercio.direccion : `${r.store}, Lima`);

        campo('referencia').textContent = r.referencia || `R-${1042 + i}`;
        campo('producto').textContent = `${r.nombre} × ${r.n || 1}`;
        campo('importe').textContent = `${dineroRecojo(r.total)} pagados`;
        campo('comercio').textContent = `${r.store} · ${direccion}`;
        campo('horario').textContent = r.recojo || 'Hoy · 18:00–20:00';

        tarjeta.querySelector('[data-accion="detalle"]').onclick = () =>
            seleccionarReservaRecojo(i, 'detalle-reserva');

        tarjeta.querySelector('[data-accion="llegar"]').onclick = () =>
            seleccionarReservaRecojo(i, 'como-llegar');

        lista.appendChild(tarjeta);
        if (posicion < reservas.length - 1) lista.appendChild(document.createElement('br'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();

    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }

    cargarReservasRecojo();
});