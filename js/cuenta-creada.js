// cuenta-creada.js — comportamiento de la pantalla "Cuenta creada".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderCuentaCreada() {
    app.innerHTML = `
        <h1>Tu cuenta está creada — Confirmación y verificación</h1>
        <p class="subtitle">${state.user.nombre}, te damos la bienvenida como consumidora.</p>
        <div class="alert success">
            <strong>✓ Operación confirmada</strong><br>
            Registro exitoso. Enviamos un correo de verificación a ${state.user.correo}.
        </div>
        <h2>Verifica tu correo</h2>
        <p class="subtitle">Abre el enlace recibido para verificar tu dirección.</p>
        <div style="max-width:450px">
            <button class="btn btn-block" onclick="navigate('intereses')">Continuar a preferencias</button>
            <button class="btn btn-outline btn-block" onclick="alert('Correo reenviado')">Reenviar correo</button>
            <button class="btn btn-outline btn-block" onclick="navigate('tutorial')">Ir a Descubrir</button>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderCuentaCreada();
});
