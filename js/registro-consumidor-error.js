// registro-consumidor-error.js — comportamiento de la pantalla "Crear cuenta - Correo duplicado".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function handleRegistroConsumidor(e) {
    e.preventDefault();
    const correo = document.getElementById('reg-correo').value.trim();
    if (correo === 'ana.torres@correo.pe') {
        navigate('registro-consumidor', { error: true });
        return;
    }
    state.user.nombre = document.getElementById('reg-nombre').value;
    state.user.correo = correo;
    state.role = 'consumidor';
    state.loggedIn = true;
    navigate('cuenta-creada');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
});
