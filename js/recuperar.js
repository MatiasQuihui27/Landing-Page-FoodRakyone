// recuperar.js — comportamiento de la pantalla "Recuperar contraseña".
// Requiere state.js y shared.js (se cargan antes en el HTML).

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
});
