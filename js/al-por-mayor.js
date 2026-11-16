// al-por-mayor.js — comportamiento de la pantalla "Al por mayor".
// Requiere state.js y shared.js (se cargan antes en el HTML).

const dinero = n => 'S/' + Number(n).toFixed(2);

function renderMayorista() {
    const lotes = [['Jaba de tomates', '🍅', 45, '3 jabas'], ['Saco de papa', '🥔', 60, '2 sacos'], ['Caja de yogures', '🥛', 38, '5 cajas']];
    return `<p class="crumb">Inicio> Al por mayor</p><h1>Al por mayor</h1>
        <p class="subtitle">Lotes en jabas, sacos y cajas para comercios minoristas.</p>
        <div class="card-grid">${lotes.map(([n, i, p, s]) => `<div class="offer-card"><span style="font-size:2rem">${i}</span><strong>${n}</strong>
            <div class="offer-price">${dinero(p)}</div><small>${state.comercio.nombre} · ${s} disponibles</small></div>`).join('')}</div>
        ${state.role === 'comerciante' ? `<div class="btn-group"><button class="btn" onclick="navigate('categorias-comercio')">Configurar venta por volumen</button></div>` : ''}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderMayorista();
});
