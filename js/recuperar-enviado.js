// recuperar-enviado.js — comportamiento de la pantalla "Revisa tu correo".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderRecuperar(step = 1, hasError = false) {
    if (step === 2) {
        app.innerHTML = `
            <h1>Revisa tu correo — Instrucciones enviadas</h1>
            <p class="subtitle">Solicitud de recuperación recibida.</p>
            <div class="alert success">
                <strong>✓ Operación confirmada</strong><br>
                Enviamos instrucciones a ${state.user.correo} para restablecer tu contraseña.
            </div>
            <h2>Siguiente paso</h2>
            <p class="subtitle">Abre el mensaje y sigue el enlace. Revisa también la carpeta de correo no deseado.</p>
            <div style="max-width:450px">
                <button class="btn btn-block" onclick="navigate('login')">Regresar al login</button>
                <button class="btn btn-outline btn-block" onclick="alert('Instrucciones reenviadas')">Reenviar instrucciones</button>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <h1>${hasError ? 'Recuperar contraseña — Correo inexistente' : 'Recuperar contraseña'}</h1>
        <p class="subtitle">${hasError ? 'No se pudo encontrar la cuenta.' : 'Te enviaremos instrucciones al correo de tu cuenta.'}</p>

        ${hasError ? `
            <div class="alert error">
                <strong>⚠️ Revisa la información</strong><br>
                No encontramos una cuenta asociada a ese correo. (Usa <b>ana.torres@correo.pe</b>)
            </div>
        ` : ''}

        <div class="grid-2">
            <form onsubmit="handleRecuperar(event)">
                <div class="form-group ${hasError ? 'error-field' : ''}">
                    <label>Correo registrado</label>
                    <input type="email" id="rec-correo" value="${hasError ? 'nuevo@correo.pe' : state.user.correo}" required>
                    ${hasError ? '<span class="error-msg">⚠️ Correo no registrado.</span>' : ''}
                </div>
                <div class="btn-group">
                    <button type="submit" class="btn">${hasError ? 'Reintentar' : 'Enviar instrucciones'}</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('login')">Regresar al login</button>
                </div>
            </form>
            <aside class="aside-box">
                <h4>Recuperación de acceso</h4>
                <p>Ingresa el correo asociado a tu cuenta. Te enviaremos un enlace para restablecer tu contraseña.</p>
            </aside>
        </div>
    `;
}

function handleRecuperar(e) {
    e.preventDefault();
    const correo = document.getElementById('rec-correo').value.trim();
    if (correo !== state.user.correo && correo !== state.comercio.correo) {
        navigate('recuperar', { step: 1, error: true });
        return;
    }
    navigate('recuperar', { step: 2 });
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderRecuperar(2);
});
