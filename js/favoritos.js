// favoritos.js — comportamiento de la pantalla "Mis favoritos".
// Requiere state.js y shared.js (se cargan antes en el HTML).

function renderFavoritos() {
    const listHTML = state.favoritos.map(store => `
        <div class="favorite-item">
            <div>
                <strong>${store.activeOffers > 0 ? `<span style="color: var(--primary-green);">Excedentes activos: ${store.activeOffers} ofertas</span>` : 'Sin excedentes activos'}</strong><br>
                <span style="color: red;">❤️</span> <strong style="font-size: 1.1rem; color: var(--primary-blue);">${store.name}</strong><br>
                <small style="color: var(--text-muted);">${store.address}</small><br>
                <small style="color: var(--text-muted);">⭐ ${store.rating}</small>
            </div>
            <button class="btn-green">Ver comercio</button>
        </div>
    `).join('');

    return `
        <div class="layout-grid">
            <div class="main-content">
                <h1 class="section-title">Mis favoritos</h1>
                <p class="section-subtitle">Establecimientos que guardaste para consultar sus excedentes.</p>
                <div style="margin-top: 20px;">
                    ${listHTML}
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    app.innerHTML = renderFavoritos();
});
