// f4-14-HorariosGuardados.js — "Horarios guardados — Horario válido guardado" (F4-14).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderHorariosGuardados() {
    return `<h1>Horarios guardados — Horario válido guardado</h1>
        <p class="status-meta">${state.comercio.nombre} · Configuración actualizada.</p>
        ${avisoConfirmado('Guardamos tus ventanas de recojo. Los consumidores verán estos horarios antes de reservar.')}

        <table class="detail-table" aria-label="Horarios de recojo guardados">
            <tbody>
                <tr class="is-header"><td>Día <span class="detail-sep">|</span> Inicio <span class="detail-sep">|</span> Fin</td></tr>
                ${DIAS.map(d => `<tr><td>${d} <span class="detail-sep">|</span> ${state.horarios[d].ini} <span class="detail-sep">|</span> ${state.horarios[d].fin}</td></tr>`).join('')}
            </tbody>
        </table>

        <div class="action-stack">
            <button type="button" class="btn" onclick="navigate('${F4.horarios}')">Editar horarios</button>
            <button type="button" class="btn btn-outline" onclick="navigate('descubrir')">Ver oferta como consumidor</button>
            <button type="button" class="btn btn-outline" onclick="navigate('${F4.inicio}')">Volver al panel</button>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderHorariosGuardados();
});
