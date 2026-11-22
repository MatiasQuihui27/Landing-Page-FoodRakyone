// f4-13-HorarioInvalido.js — "Horarios de recojo — Inicio posterior a fin" (F4-13).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderHorarioInvalido() {
    const e = state.horarioError || { dia: 'Miércoles', ini: '21:00', fin: '20:00' };
    return `<h1>Horarios de recojo — Inicio posterior a fin</h1>
        <p class="status-meta">Revisa el horario del ${e.dia.toLowerCase()} antes de guardar.</p>
        ${avisoError('La hora de inicio no puede ser posterior a la hora de fin. No se guardaron cambios.')}

        <div class="form-group error-field">
            <label>${e.dia} · Hora inicio</label>
            <input type="text" value="${e.ini}" disabled>
            <span class="error-msg">⚠️ El inicio supera la hora de fin.</span>
        </div>

        <div class="action-stack">
            <button type="button" class="btn" disabled>Guardar horarios · Deshabilitado</button>
            <button type="button" class="btn" onclick="navigate('${F4.horarios}')">Corregir horario</button>
            <button type="button" class="btn btn-outline" onclick="cancelarHorarios()">Cancelar</button>
        </div>`;
}

function cancelarHorarios() {
    state.horariosBorrador = null;
    state.horarioError = null;
    navigate(F4.inicio);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderHorarioInvalido();
});
