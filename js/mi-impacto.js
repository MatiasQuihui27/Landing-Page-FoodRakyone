// mi-impacto.js — comportamiento de la pantalla "Mi impacto".
// Requiere state.js y shared.js.

function fechaRescate(texto) {
    const fecha = String(texto || '').match(/\d{2}\/\d{2}/);
    return fecha ? fecha[0] : 'Fecha no registrada';
}

function guardarRescatesAnteriores() {
    if (!Array.isArray(state.rescates)) state.rescates = [];

    state.reservas.forEach((r, i) => {
        if (r.estado !== 'recogida') return;

        const referencia = r.referencia || `R-${1042 + i}`;
        const cantidad = Math.max(1, Number(r.n || r.cantidad || 1));
        const anterior = state.rescates.find(x => x.referencia === referencia);
        const registro = {
            referencia, nombre: r.nombre, comercio: r.store,
            cantidad, puntos: cantidad, fechaRecogida: r.fechaRecogida || ''
        };

        if (anterior) Object.assign(anterior, registro);
        else state.rescates.push(registro);
    });
    guardarEstado();
}

function cargarImpacto() {
    guardarRescatesAnteriores();

    const rescates = [...state.rescates].reverse();
    const total = rescates.reduce((suma, r) => suma + Number(r.puntos || 0), 0);
    const reciente = rescates[0];

    document.getElementById('impacto-puntos').textContent = `${total} ${total === 1 ? 'punto' : 'puntos'}`;

    document.getElementById('impacto-resumen').textContent = reciente
        ? `Antes: ${total - reciente.puntos} · Recojo ${reciente.referencia}: +${reciente.puntos}`
        : 'Cada pack recogido suma 1 punto.';

    document.getElementById('impacto-confirmacion').textContent = total
        ? `¡Has salvado ${total} ${total === 1 ? 'pack de alimentos' : 'packs de alimentos'}!`
        : '¡Completa tu primer recojo para comenzar a sumar puntos!';

    const lista = document.getElementById('lista-rescates');
    lista.innerHTML = '';
    document.getElementById('rescates-vacios').hidden = !!rescates.length;

    rescates.forEach(r => {
        const fila = document.createElement('p');
        fila.textContent = `${fechaRescate(r.fechaRecogida)} · ${r.referencia} · ${r.cantidad} ${r.cantidad === 1 ? 'pack recogido' : 'packs recogidos'} → +${r.puntos} ${r.puntos === 1 ? 'punto' : 'puntos'}`;
        lista.appendChild(fila);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    if (!state.loggedIn) {
        navigate('login', { role: 'consumidor' });
        return;
    }
    cargarImpacto();
});