// tutorial.js — comportamiento de la pantalla "Tutorial".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderTutorial() {
    const pasos = [
        {
            titulo: 'Encuentra excedentes cerca de ti',
            icono: '🗺️ mapa y ofertas cercanas',
            sub: 'Descubre tu zona',
            desc: 'Usa tu ubicación o una dirección manual. Ajusta el radio para encontrar comercios a tu alcance.'
        },
        {
            titulo: 'Reserva y paga',
            icono: '🍲 alimento, cantidad y total',
            sub: 'Revisa antes de reservar',
            desc: 'Consulta el stock, la caducidad y el horario de recojo. Elige la cantidad y confirma el monto antes de pagar.'
        },
        {
            titulo: 'Recoge con tu código',
            icono: '📱 código y entrega en el local',
            sub: 'Muestra el QR o código numérico',
            desc: 'Acércate durante la ventana de recojo. Tras la entrega podrás calificar tu experiencia.'
        }
    ];

    const actual = pasos[state.tutorialStep - 1];

    app.innerHTML = `
        <h1>${actual.titulo}</h1>
        <p class="subtitle">Tutorial · Paso ${state.tutorialStep} de 3</p>

        <div class="btn-group" style="margin-bottom:20px">
            ${state.tutorialStep < 3
                ? `<button class="btn" onclick="state.tutorialStep++; renderTutorial()">Siguiente</button>`
                : `<button class="btn" onclick="state.tutorialStep=1; navigate('descubrir')">Ir a Descubrir</button>`
            }
            <button class="btn btn-outline" onclick="state.tutorialStep=1; navigate('descubrir')">Omitir</button>
            ${state.tutorialStep > 1 ? `<button class="btn btn-outline" onclick="state.tutorialStep--; renderTutorial()">Anterior</button>` : ''}
        </div>

        <div class="grid-2">
            <div>
                <div class="placeholder-graphic" style="padding:60px">${actual.icono}</div>
                <h2>${actual.sub}</h2>
                <p class="subtitle">${actual.desc}</p>
            </div>
            <aside class="aside-box">
                <h4>Tutorial · Paso ${state.tutorialStep} de 3</h4>
                <p>Aprende a usar FoodRakyone en tres pasos sencillos.</p>
            </aside>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderTutorial();
});
