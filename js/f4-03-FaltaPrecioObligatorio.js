// f4-03-FaltaPrecioObligatorio.js — "Publicar excedente — Falta precio obligatorio" (F4-03).
// Requiere state.js, shared.js y f4-comun.js (se cargan antes en el HTML).

function renderFaltaPrecio() {
    return `<h1>Publicar excedente — Falta precio obligatorio</h1>
        <p class="subtitle">La publicación no se guardó.</p>
        ${avisoError('Ingresa un precio de remate o aplica un descuento antes de publicar.')}

        <div class="form-group error-field">
            <label for="fp-remate">Precio de remate manual (S/)</label>
            <input type="text" id="fp-remate" value="" placeholder="Ingresar...">
            <span class="helper-text">Puedes ingresar el remate sin usar los botones de descuento.</span>
            <span class="error-msg">⚠️ El precio final es obligatorio.</span>
        </div>

        <div class="action-stack">
            <button type="button" class="btn" onclick="corregirPrecio(50)">−50%</button>
            <button type="button" class="btn btn-outline" onclick="corregirPrecio(30)">−30%</button>
            <button type="button" class="btn btn-outline" onclick="corregirPrecio(70)">−70%</button>
            <button type="button" class="btn" disabled>Publicar excedente · Deshabilitado</button>
            <button type="button" class="btn" onclick="corregirPrecio()">Corregir precio</button>
            <button type="button" class="btn btn-outline" onclick="cancelarPublicacion()">Cancelar</button>
        </div>`;
}

// Vuelve a F4-02 con el precio ya aplicado (por descuento o escrito a mano).
function corregirPrecio(p) {
    const b = state.borrador || borradorInicial();
    if (p) b.remate = (num(b.original) * (1 - p / 100)).toFixed(2);
    else { const v = document.getElementById('fp-remate').value.trim(); if (v) b.remate = v; }
    state.borrador = b;
    navigate(F4.publicar);
}

document.addEventListener('DOMContentLoaded', () => {
    app.innerHTML = renderFaltaPrecio();
});
