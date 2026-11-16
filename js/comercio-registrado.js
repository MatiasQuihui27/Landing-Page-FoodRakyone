// comercio-registrado.js — comportamiento de la pantalla "Comercio registrado".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderComercioRegistrado() {
    app.innerHTML = `
        <h1>Bienvenido, ${state.comercio.nombre} — Comercio registrado</h1>
        <p class="subtitle">Tu cuenta de comercio se registró correctamente.</p>
        <div class="alert success">
            <strong>✓ Operación confirmada</strong><br>
            Local registrado. Correo de verificación enviado a ${state.comercio.correo}.
        </div>
        <h2>Antes de publicar</h2>
        <p class="subtitle">Configura categorías, venta por volumen y ventanas de recojo.</p>
        <div style="max-width:450px">
            <button class="btn btn-block" onclick="navigate('categorias-comercio')">Configurar mi comercio</button>
            <button class="btn btn-outline btn-block" onclick="navigate('datos-local')">Ir al panel</button>
            <button class="btn btn-outline btn-block" onclick="alert('Verificación reenviada')">Reenviar verificación</button>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderComercioRegistrado();
});
