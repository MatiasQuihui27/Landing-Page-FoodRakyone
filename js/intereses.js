// intereses.js — comportamiento de la pantalla "Alimentos de interés".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderIntereses() {
    const opciones = ['Pan', 'Lácteos', 'Frutas', 'Verduras', 'Granos', 'Comida preparada'];
    app.innerHTML = `
        <h1>Alimentos de interés</h1>
        <p class="subtitle">Selecciona uno o varios alimentos. Puedes cambiarlos desde Perfil.</p>
        <div class="grid-2">
            <div>
                <h2>Tus preferencias</h2>
                <div class="check-grid">
                    ${opciones.map(op => `
                        <label class="check-item">
                            <input type="checkbox" value="${op}" ${state.user.intereses.includes(op) ? 'checked' : ''} onchange="toggleInteres('${op}')">
                            ${op}
                        </label>
                    `).join('')}
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="renderIntereses()">Guardar intereses</button>
                    <button class="btn btn-outline" onclick="state.user.intereses = []; renderIntereses()">Eliminar intereses</button>
                </div>
                <div class="alert success" style="margin-top:20px">
                    <strong>✓ Operación confirmada</strong><br>
                    Intereses guardados: ${state.user.intereses.length ? state.user.intereses.join(', ') : 'Ninguno'}.
                </div>
            </div>
            <aside class="aside-box">
                <strong>Tu zona</strong>
                <p>Av. Canadá 100, La Victoria</p>
                <hr>
                <h4>Tus intereses activos</h4>
                <p>${state.user.intereses.map(i => `[${i}]`).join(' ') || 'Sin selección'}</p>
                <h4>Cómo usamos tus intereses</h4>
                <p>Filtramos las ofertas disponibles para mostrarte primero los alimentos que más te interesan.</p>
            </aside>
        </div>
    `;
}

function toggleInteres(item) {
    if (state.user.intereses.includes(item)) {
        state.user.intereses = state.user.intereses.filter(i => i !== item);
    } else {
        state.user.intereses.push(item);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderIntereses();
});
