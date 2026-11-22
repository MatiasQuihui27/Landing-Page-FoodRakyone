// state.js — estado global de la app (simula la base de datos en memoria).
// Se guarda en sessionStorage para conservarlo al pasar de una página a otra.

const state = {
    role: 'consumidor', // 'consumidor' | 'comerciante'
    loggedIn: false,
    user: {
        nombre: 'Ana Torres',
        correo: 'ana.torres@correo.pe',
        telefono: '912 345 678',
        intereses: ['Pan', 'Lácteos']
    },
    comercio: {
        nombre: 'Bodega San Luis',
        direccion: 'Av. Canadá 120, La Victoria',
        telefono: '987 654 321',
        rubro: 'Bodega / minimarket',
        correo: 'local@sanluis.pe',
        categorias: ['Panadería', 'Lácteos'],
        b2b: true,
        unidades: ['Jabas', 'Sacos', 'Cajas']
    },
    tutorialStep: 1,

    searchQuery: '',
    ofertas: [
        { id: 1, name: 'Pack de pan', type: 'Última oportunidad', discount: '-50%', price: '10.00', originalPrice: '20.00', store: 'Bodega San Luis', distance: '0.4 km', stock: 8, icon: '🍞' },
        { id: 2, name: 'Leche sellada 1 L', type: 'Empaque sellado', discount: '-50%', price: '4.00', originalPrice: '8.00', store: 'Bodega San Luis', distance: '0.4 km', stock: 6, icon: '🥛' },
        { id: 3, name: 'Bolsa de frutas', type: 'Frutas', discount: '-60%', price: '6.00', originalPrice: '15.00', store: 'Frutería El Sol', distance: '0.8 km', stock: 4, icon: '🍎' }
    ],
    favoritos: [
        { id: 101, name: 'Bodega San Luis', address: 'Av. Canadá 120, La Victoria', rating: '4.5 / 5', activeOffers: 2 }
    ]
};

state.ofertas.forEach(o => { o.cat = ['Panadería', 'Lácteos', 'Frutas'][o.id - 1]; o.unit = ['packs', 'unidades', 'bolsas'][o.id - 1]; });
state.busqueda = { q: '', cats: [], orden: 'precio', radio: 1 };
state.reservas = [];

// Flujo 4 — inventario del comercio (fuente de verdad del lado comerciante).
// Las ofertas ACTIVAS se reflejan en state.ofertas, que es lo que ve el consumidor (ver js/f4-comun.js).
state.inventario = [
    { id: 1, canal: 'B2C', estado: 'activa', name: 'Pack de pan', cat: 'Panadería', price: '10.00', originalPrice: '20.00', stock: 8, unit: 'packs', fecha: '07/10', ini: '18:00', fin: '20:00', caducidad: '09/10', empaque: 'Empaque original sellado' },
    { id: 2, canal: 'B2C', estado: 'activa', name: 'Leche sellada 1 L', cat: 'Lácteos', price: '4.00', originalPrice: '8.00', stock: 6, unit: 'unidades', fecha: '07/10', ini: '18:00', fin: '20:00', caducidad: '10/10', empaque: 'Empaque original sellado' }
];
state.lotes = [];
state.ofertaSel = null;
state.borrador = null;
state.horarios = Object.fromEntries(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => [d, { ini: '18:00', fin: '20:00' }]));

try {
    const guardado = JSON.parse(sessionStorage.getItem('foodrakyone-state') || 'null');
    if (guardado) Object.assign(state, guardado);
} catch (e) { }

function guardarEstado() {
    try { sessionStorage.setItem('foodrakyone-state', JSON.stringify(state)); } catch (e) { }
}
window.addEventListener('pagehide', guardarEstado);
