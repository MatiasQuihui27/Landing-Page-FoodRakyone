// perfil-consumidor.js — comportamiento de la pantalla "Mi perfil".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderPerfilConsumidor() {
    app.innerHTML = `
        <h1>Mi perfil</h1>
        <p class="subtitle">${state.user.nombre} · ${state.user.correo}</p>
        <div class="grid-2">
            <div>
                <h2>Tu cuenta</h2>
                <div class="box" style="margin-bottom:15px">
                    <strong>Datos personales</strong>
                    <p class="subtitle" style="margin:5px 0">${state.user.nombre} · ${state.user.telefono}</p>
                    <button class="btn btn-block" onclick="navigate('editar-perfil')">Editar perfil</button>
                </div>
                <div class="box" style="margin-bottom:15px">
                    <strong>Favoritos e intereses</strong>
                    <p class="subtitle" style="margin:5px 0">Bodega San Luis guardada · ${state.user.intereses.join(' y ')}</p>
                    <button class="btn btn-outline btn-block" onclick="navigate('intereses')">Editar intereses</button>
                </div>
                <button class="btn btn-block" onclick="logout()">Cerrar sesión</button>
            </div>
            <aside class="aside-box">
                <strong>Tu zona</strong>
                <p>Av. Canadá 100, La Victoria</p>
                <hr>
                <h4>Tu impacto ambiental</h4>
                <p>Cada recojo completado reduce el desperdicio alimentario en tu comunidad.</p>
            </aside>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderPerfilConsumidor();
});
