// registro-comercio.js — comportamiento de la pantalla "Registra tu comercio".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function validarDireccionComercio() {
    const dir = document.getElementById('com-direccion').value.trim();
    const btn = document.getElementById('btn-reg-comercio');
    const err = document.getElementById('dir-err');
    const grp = document.getElementById('group-direccion');

    if (!dir) {
        btn.disabled = true;
        err.style.display = 'block';
        grp.classList.add('error-field');
    } else {
        btn.disabled = false;
        err.style.display = 'none';
        grp.classList.remove('error-field');
    }
}

function handleRegistroComercio(e) {
    e.preventDefault();
    const dir = document.getElementById('com-direccion').value.trim();
    if (!dir) {
        navigate('registro-comercio', { error: true });
        return;
    }
    state.comercio.nombre = document.getElementById('com-nombre').value;
    state.comercio.direccion = dir;
    state.comercio.telefono = document.getElementById('com-tel').value;
    state.comercio.correo = document.getElementById('com-correo').value;
    state.role = 'comerciante';
    state.loggedIn = true;
    navigate('comercio-registrado');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
});
