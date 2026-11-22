// reservas.js — comportamiento de la pantalla "Mis reservas".
// Requiere state.js y shared.js (se cargan antes en el HTML).

const dinero = n => 'S/' + Number(n).toFixed(2);

function irAPagarReserva(indice) {
    state.reservaSeleccionadaIndex = indice;
    sessionStorage.setItem( 'foodrakyone-reserva-seleccionada', String(indice)  );
    navigate('pagar-reserva');
}

function irACancelarReserva(indice) {
    state.reservaSeleccionadaIndex = indice;
    sessionStorage.setItem( 'foodrakyone-reserva-seleccionada', String(indice)  );
    navigate('cancelar-reserva');
}

function renderReservas() {
    const lista = state.reservas.map((r, indice) => r.estado === 'cancelada' ? '' : `<div class="favorite-item"><div><strong>${r.n}x ${r.nombre}</strong><br>
            <small>${r.store} · Recojo hoy 18:00-20:00</small><br><small>Total ${dinero(r.total)}</small></div>
            <div>
                <button class="btn-green btn-block" onclick="irAPagarReserva(${indice})">
                    ${r.estadoPago === 'pagada' ? 'Pago aceptado' : 'Realizar pago'}
                </button>
                <button type="button" class="btn-outline btn-block" onclick="irACancelarReserva(${indice})">Cancelar reserva</button>
            </div>
            <div class="codigo">Código<br><b>${r.codigo}</b></div></div>`).join('');
    return `<p class="crumb">Inicio> Reservas</p><h1>Mis reservas</h1><p class="subtitle">Muestra tu código al recoger en el local.</p>
        ${lista || `<div class="alert">! Aún no tienes reservas. Elige una oferta y confirma tu primera reserva.</div>
        <button class="btn" onclick="navigate('descubrir')">Descubrir ofertas</button>`}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderReservas();
});
