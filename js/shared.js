// shared.js — navegación entre páginas, cabecera y cierre de sesión.
// Se carga en TODAS las pantallas, después de state.js.

const app = document.getElementById('app');
const PRIVADAS = ['descubrir', 'resultados', 'filtros', 'mapa', 'reservas', 'al-por-mayor', 'producto', 'favoritos'];

// Devuelve el archivo HTML que corresponde a una vista (y sus estados de error).
function pageFor(view, p = {}) {
    const err = p.error ? '-error' : '';
    const inPages = location.pathname.includes('/pages/');

    let file;
    if (view === 'welcome') {
        file = 'index.html';
        return inPages ? `../${file}` : file;
    }

    if (view === 'login') file = `login-${p.role || state.role}${err}.html`;
    else if (view === 'recuperar') file = p.step === 2 ? 'recuperar-enviado.html' : `recuperar${err}.html`;
    else if (view === 'producto') file = `producto-${p.id}.html`;
    else file = `${view}${err}.html`;

    return inPages ? file : `pages/${file}`;
}

function navigate(view, params = {}) {
    if (view === 'inicio') view = state.loggedIn ? 'descubrir' : 'welcome';
    if (view === 'perfil') view = state.role === 'consumidor' ? 'perfil-consumidor' : 'datos-local';
    if (PRIVADAS.includes(view) && !state.loggedIn) { view = 'login'; params = { role: state.role }; }
    guardarEstado();
    location.href = pageFor(view, params);
}

function logout() {
    state.loggedIn = false;
    navigate('welcome');
}

// La cabecera y la barra inferior ya están en cada HTML; aquí solo se muestran u ocultan.
function renderHeader() {
    const on = state.loggedIn;
    ['menu', 'lnk-notif', 'lnk-cuenta', 'bottom-nav'].forEach(id => { document.getElementById(id).hidden = !on; });
    const v = document.body.dataset.view;
    const activa = ['resultados', 'filtros', 'producto'].includes(v) ? 'descubrir'
        : ['perfil-consumidor', 'datos-local', 'editar-perfil'].includes(v) ? 'perfil' : v;
    document.querySelectorAll('[data-v]').forEach(a => a.classList.toggle('active', a.dataset.v === activa));
}
