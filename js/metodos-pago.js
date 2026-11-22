// metodos-pago.js — comportamiento de la pantalla "Métodos de pago".
// Requiere state.js y shared.js.

const METODOS_INICIALES = [
    { id: 'tarjeta-1234', tipo: 'tarjeta', nombre: 'Tarjeta', detalle: '**** **** **** 1234' },
    { id: 'billetera-678', tipo: 'billetera', nombre: 'Billetera digital', detalle: '912 *** 678' }
];

const CLAVE_METODOS = 'foodrakyone-metodos-inicializados-v3';
let metodoAEliminarId = null;

function inicializarMetodosPago() {
    if (!Array.isArray(state.metodosPago) || (!sessionStorage.getItem(CLAVE_METODOS) && !state.metodosPago.length)) {
        state.metodosPago = METODOS_INICIALES.map(m => ({ ...m }));
    }
    sessionStorage.setItem(CLAVE_METODOS, 'true');
    guardarEstado();
}

function mostrarVista(vista) {
    document.querySelectorAll('[id^="vista-"]').forEach(s => {
        s.hidden = s.id !== `vista-${vista}`;
    });
    if (vista === 'metodos') renderListaMetodos();
    document.getElementById('mensaje-metodo-agregado').hidden = true;
    window.scrollTo(0, 0);
}

function renderListaMetodos() {
    document.getElementById('lista-metodos').innerHTML = state.metodosPago.length
        ? state.metodosPago.map(m => `
            <div class="box" style="margin-bottom: 15px;">
                <strong>${m.nombre} &nbsp; ${m.detalle}</strong>
                <button type="button" class="btn btn-block" data-metodo-id="${m.id}">
                    Eliminar ${m.tipo === 'tarjeta' ? 'tarjeta' : 'billetera'}
                </button>
            </div>`).join(''): '<div class="alert">No tienes métodos de pago guardados. Puedes agregar uno nuevo.</div>';
}

function solicitarEliminacionMetodo(id) {
    const metodo = state.metodosPago.find(m => m.id === id);
    if (!metodo) return;

    metodoAEliminarId = id;
    document.getElementById('metodo-eliminar-nombre').textContent = metodo.nombre;
    document.getElementById('metodo-eliminar-detalle').textContent = metodo.detalle;
    document.getElementById('btn-mantener-metodo').textContent = `Mantener ${metodo.tipo === 'tarjeta' ? 'tarjeta' : 'billetera'}`;
    mostrarVista('confirmar-eliminacion');
}

function mantenerMetodo() {
    metodoAEliminarId = null;
    mostrarVista('metodos');
}

function confirmarEliminacionMetodo() {
    const metodo = state.metodosPago.find(m => m.id === metodoAEliminarId);
    if (!metodo) return;

    state.metodosPago = state.metodosPago.filter(m => m.id !== metodoAEliminarId);
    guardarEstado();
    document.getElementById('mensaje-eliminacion-metodo').textContent =
        metodo.tipo === 'tarjeta'
            ? `Eliminamos la tarjeta terminada en ${metodo.detalle.slice(-4)}.`
            : `Eliminamos la billetera digital asociada al número ${metodo.detalle}.`;
    metodoAEliminarId = null;
    mostrarVista('eliminacion-confirmada');
}

function actualizarCampoMetodo() {
    const tipo = document.getElementById('nuevo-metodo-tipo').value;
    const entrada = document.getElementById('nuevo-metodo-dato');

    document.getElementById('nuevo-metodo-label').textContent =
        tipo === 'tarjeta' ? 'Número de tarjeta *' : 'Número de celular *';
    entrada.placeholder = tipo === 'tarjeta' ? 'Ingresa los 16 dígitos' : 'Ingresa los 9 dígitos';
    entrada.maxLength = tipo === 'tarjeta' ? 19 : 9;
    entrada.value = '';
}

function agregarMetodoPago(evento) {
    evento.preventDefault();
    const tipo = document.getElementById('nuevo-metodo-tipo').value;
    const dato = document.getElementById('nuevo-metodo-dato').value.trim().replace(/\D/g, '');
    const longitud = tipo === 'tarjeta' ? 16 : 9;

    if (dato.length !== longitud) {
        alert(tipo === 'tarjeta' ? 'Ingresa un número de tarjeta de 16 dígitos.' : 'Ingresa un número de celular de 9 dígitos.');
        return;
    }
    state.metodosPago.push({
        id: `${tipo}-${Date.now()}`,
        tipo,
        nombre: tipo === 'tarjeta' ? 'Tarjeta' : 'Billetera digital',
        detalle: tipo === 'tarjeta' ? `**** **** **** ${dato.slice(-4)}` : `${dato.slice(0, 3)} *** ${dato.slice(-3)}`
    });
    guardarEstado();
    document.getElementById('form-agregar-metodo').reset();
    actualizarCampoMetodo();
    mostrarVista('metodos');
    document.getElementById('mensaje-metodo-agregado').hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    inicializarMetodosPago();

    document.querySelectorAll('[data-v="perfil"]').forEach(a => a.classList.add('active'));
    renderListaMetodos();

    document.getElementById('lista-metodos').addEventListener('click', e => {
        const boton = e.target.closest('[data-metodo-id]');
        if (boton) solicitarEliminacionMetodo(boton.dataset.metodoId);
    });

    document.getElementById('nuevo-metodo-tipo').addEventListener('change', actualizarCampoMetodo);
    document.getElementById('form-agregar-metodo').addEventListener('submit', agregarMetodoPago);
});