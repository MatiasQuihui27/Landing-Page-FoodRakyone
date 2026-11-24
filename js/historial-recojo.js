// historial-recojo.js — comportamiento de la pantalla "Historial de recojos".
// Requiere state.js y shared.js.

function seleccionarReservaHistorial(indice, pantalla) {
    state.reservaSeleccionadaIndex = indice;
    sessionStorage.setItem('foodrakyone-reserva-seleccionada', String(indice));
    navigate(pantalla);
}

function cargarHistorialRecojo() {
    const reservas = (state.reservas || [])
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => String(r.estado || '').toLowerCase() === 'recogida')
        .reverse();

    const tieneHistorial = reservas.length > 0;
    document.getElementById('historial-vacio').hidden = tieneHistorial;
    document.getElementById('separacion-historial-vacio').hidden = tieneHistorial;
    document.getElementById('historial-con-registros').hidden = !tieneHistorial;
    document.getElementById('zona-historial').hidden = !tieneHistorial;

    document.getElementById('btn-por-recoger').textContent = 'Por recoger';
    document.getElementById('btn-por-recoger').onclick = () => navigate('por-recoger');
    document.getElementById('btn-volver').textContent = 'Volver';
    document.getElementById('btn-volver').onclick = () => navigate('reservas');

    document.getElementById('resumen-historial').textContent = tieneHistorial
        ? `Solo reservas recogidas · ${reservas.length} ${reservas.length === 1 ? 'recojo completado' : 'recojos completados'} · Más recientes primero.`
        : 'Solo aparecerán tus reservas recogidas.';

    const lista = document.getElementById('lista-historial-recojo');
    lista.innerHTML = '';

    reservas.forEach(({ r, i }, posicion) => {
        const tarjeta = document.getElementById('plantilla-historial').content.firstElementChild.cloneNode(true);
        const campo = nombre => tarjeta.querySelector(`[data-campo="${nombre}"]`);
        const fecha = String(r.fechaRecogida || '');
        const dia = fecha.match(/\d{2}\/\d{2}\/\d{4}/);
        const hora = fecha.match(/\d{2}:\d{2}/);
        const referencia = r.referencia || `R-${1042 + i}`;
        const cantidad = Number(r.n || 1);

        campo('referencia').textContent = referencia;
        campo('fecha').textContent = dia ? dia[0] : 'Fecha no registrada';
        campo('producto').textContent = `${r.nombre} × ${cantidad}`;
        campo('total').textContent = `S/${Number(r.total || 0).toFixed(2)}`;
        campo('comercio').textContent = r.store || 'Comercio FoodRakyone';
        campo('horario').textContent = `Recojo ${hora ? hora[0] : 'confirmado'}`;

        const detalle = tarjeta.querySelector('[data-accion="detalle"]');
        const calificar = tarjeta.querySelector('[data-accion="calificar"]');

        detalle.onclick = () => seleccionarReservaHistorial(i, 'detalle-recojo');

        if (r.calificacion) {
            campo('calificacion').textContent = `Calificación registrada: ${r.calificacion} / 5`;
            campo('calificacion').hidden = false;
            calificar.remove();
            detalle.classList.add('btn-block');
            detalle.parentElement.classList.remove('form-grid');
        } else {
            calificar.onclick = () => seleccionarReservaHistorial(i, 'calificar-comercio');
        }

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
    cargarHistorialRecojo();
});