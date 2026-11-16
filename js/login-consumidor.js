// login-consumidor.js — comportamiento de la pantalla "Iniciar sesión - Consumidor".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function handleLogin(e) {
    e.preventDefault();
    if (document.getElementById('login-pass').value !== '1234') { navigate('login', { role: state.role, error: true }); return; }
    state.loggedIn = true;
    navigate(state.role === 'consumidor' ? 'descubrir' : 'categorias-comercio');
}

document.addEventListener('DOMContentLoaded', () => {
    state.role = 'consumidor';
    renderHeader();
});
