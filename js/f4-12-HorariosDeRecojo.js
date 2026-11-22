// f4-12-HorariosDeRecojo.js — comportamiento de "Horarios de recojo" (F4-12).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderHorarios() {
    const h = state.horariosBorrador || state.horarios; // el borrador existe si se vuelve desde F4-13
    return `<h1>Horarios de recojo</h1>
        <p class="subtitle">Define una ventana exacta para cada día de la semana.</p>

        <div class="grid-2">
            <form onsubmit="handleGuardarHorarios(event)" novalidate>
                <div class="form-grid">
                    ${DIAS.map((d, i) => campoSelect(`hor-ini-${i}`, `${d} · Hora inicio`, HORAS, h[d].ini)
                        + campoSelect(`hor-fin-${i}`, `${d} · Hora fin`, HORAS, h[d].fin)).join('')}
                </div>
                <div class="btn-group">
                    <button type="submit" class="btn">Guardar horarios</button>
                    <button type="button" class="btn btn-outline" onclick="cancelarHorarios()">Cancelar</button>
                </div>
            </form>

            <aside class="aside-box">
                <h3 class="azul">Visibilidad y validación</h3>
                <p>Los selectores de hora definen inicio y fin. La ventana se muestra antes de reservar. No se permiten recojos fuera del rango.</p>
            </aside>
        </div>`;
}

function handleGuardarHorarios(e) {
    e.preventDefault();
    const nuevo = {};
    DIAS.forEach((d, i) => {
        nuevo[d] = { ini: document.getElementById(`hor-ini-${i}`).value, fin: document.getElementById(`hor-fin-${i}`).value };
    });
    const malo = DIAS.find(d => nuevo[d].ini >= nuevo[d].fin);
    if (malo) { // F4-13: no se guarda nada
        state.horariosBorrador = nuevo;
        state.horarioError = { dia: malo, ini: nuevo[malo].ini, fin: nuevo[malo].fin };
        navigate(F4.horarioInvalido);
        return;
    }
    state.horarios = nuevo;
    state.horariosBorrador = null;
    state.horarioError = null;
    navigate(F4.horariosOk);
}

function cancelarHorarios() {
    state.horariosBorrador = null;
    state.horarioError = null;
    navigate(F4.inicio);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderHorarios();
});
