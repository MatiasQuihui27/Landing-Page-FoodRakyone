// Estado global de la aplicación (simula base de datos en memoria)
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

const app = document.getElementById('app');
const header = document.getElementById('main-header');

// Renderiza la barra superior según si el usuario inició sesión o no
function renderHeader() {
    if (!state.loggedIn) {
        header.innerHTML = `
            <a class="logo" onclick="navigate('welcome')">🛒 FoodRakyone</a>
            <div class="nav-links">
                <a onclick="alert('Centro de ayuda FoodRakyone')">Ayuda</a>
            </div>
        `;
    } else {
        const perfilRoute = state.role === 'consumidor' ? 'perfil-consumidor' : 'datos-local';
        const configRoute = state.role === 'consumidor' ? 'intereses' : 'categorias-comercio';
        header.innerHTML = `
            <a class="logo" onclick="navigate('welcome')">🛒 FoodRakyone</a>
            <div class="nav-links">
                <a onclick="navigate('tutorial')">Descubrir</a>
                <a onclick="navigate('${configRoute}')">${state.role === 'consumidor' ? 'Preferencias' : 'Al por mayor'}</a>
                <a onclick="navigate('${perfilRoute}')">Perfil</a>
                <a onclick="logout()" style="color:#b91c1c">Salir</a>
            </div>
        `;
    }
}

// Enrutador principal
function navigate(view, params = {}) {
    renderHeader();
    window.scrollTo(0, 0);

    // Contenedor principal donde se dibuja la app (verifica que tu ID sea 'app' o el que uses en tu HTML)
    const appContainer = document.getElementById('app'); 

    const routes = {
        'welcome': renderWelcome,
        'login': () => renderLogin(params.role || state.role, params.error),
        'registro-consumidor': () => renderRegistroConsumidor(params.error),
        'cuenta-creada': renderCuentaCreada,
        'registro-comercio': () => renderRegistroComercio(params.error),
        'comercio-registrado': renderComercioRegistrado,
        'recuperar': () => renderRecuperar(params.step || 1, params.error),
        'intereses': renderIntereses,
        'categorias-comercio': renderCategoriasComercio,
        'tutorial': renderTutorial,
        'perfil-consumidor': renderPerfilConsumidor,
        'editar-perfil': () => renderEditarPerfil(params.error),
        'perfil-guardado': renderPerfilGuardado,
        'datos-local': () => renderDatosLocal(params.error),
        'local-guardado': renderLocalGuardado,
        
        // --- AQUÍ AGREGAS LAS 3 NUEVAS RUTAS ---
        'descubrir': () => { appContainer.innerHTML = renderDescubrir(); },
        'producto': () => { appContainer.innerHTML = renderProducto(params.id); },
        'favoritos': () => { appContainer.innerHTML = renderFavoritos(); }
    };

    // Ejecuta la ruta si existe en el diccionario
    if (routes[view]) {
        routes[view]();
    } else {
        console.error("La vista " + view + " no existe.");
    }
}

function logout() {
    state.loggedIn = false;
    navigate('welcome');
}

// 1. PANTALLA DE BIENVENIDA[cite: 1]
function renderWelcome() {
    app.innerHTML = `
        <h1>Bienvenido a FoodRakyone</h1>
        <p class="subtitle">Rescata excedentes alimentarios en Lima Metropolitana.</p>
        <div class="grid-2">
            <div>
                <div class="placeholder-graphic">🛍️<br><strong>Alimentos, comercio y recojo</strong></div>
                <h2>¿Cómo quieres usar FoodRakyone?</h2>
                <p class="subtitle">Selecciona el tipo de cuenta que deseas utilizar</p>
                <div class="role-grid">
                    <div class="role-card consumer-card">
                        <h3>Consumidor</h3>
                        <p>Encuentra, reserva y recoge alimentos</p>
                        <button class="btn-green" onclick="navigate('login', {role: 'consumidor'})">Iniciar sesión</button>
                    </div>
                    <div class="role-card merchant-card">
                        <h3>Comerciante</h3>
                        <p>Publica restos y gestiona tus ventas</p>
                        <button class="btn-blue" onclick="navigate('registro-comercio')">Registrar negocio</button>
                        <p class="card-sublink">
                            <a href="#" onclick="navigate('login', {role: 'comerciante'})">Registrarme · Iniciar sesión</a>
                        </p>
                    </div>
                </div>
            </div>
            <aside class="aside-box">
                <h3>Dos roles, una plataforma</h3>
                <p>Consumidor: descubre, reserva y recoge.<br>Comercio: publica, gestiona y entrega.</p>
                <hr>
                <h4>¿Cómo funciona?</h4>
                <ol style="padding-left:18px; margin-top:8px; line-height:1.6;">
                    <li>Regístrate o inicia sesión.</li>
                    <li>Descubre excedentes cerca de ti.</li>
                    <li>Reserva, paga y recoge con tu código.</li>
                </ol>
                <hr>
                <h4>Impacto en Lima Metropolitana</h4>
                <p>Reducimos el desperdicio conectando comercios con consumidores locales cada día.</p>
            </aside>
        </div>
    `;
}

// 2. LOGIN UNIFICADO (Consumidor / Comerciante / Estado Error)[cite: 1, 2]
function renderLogin(role, hasError = false) {
    state.role = role;
    const titulo = role === 'consumidor' ? 'Iniciar sesión - Consumidor' : 'Iniciar sesión - Comerciante';

    app.innerHTML = `
        <h1>${hasError ? 'Iniciar sesión — Credenciales incorrectas' : titulo}</h1>
        <p class="subtitle">${hasError ? 'Vuelve a revisar tus datos de acceso.' : 'Accede con el correo de tu cuenta de consumidor o comercio.'}</p>

        ${hasError ? `
            <div class="alert error">
                <strong>⚠️ Revisa la información</strong><br>
                El correo o la contraseña no coinciden. No se inició sesión. (Prueba con contraseña: <b>1234</b>)
            </div>
        ` : ''}

        <div class="grid-2">
            <form onsubmit="event.preventDefault(); state.loggedIn = true; navigate('descubrir');">
                <div class="form-group">
                    <label>✉️ Correo electrónico</label>
                    <input type="email" id="login-email" value="${role === 'consumidor' ? state.user.correo : state.comercio.correo}" required>
                </div>
                <div class="form-group ${hasError ? 'error-field' : ''}">
                    <label>🔒 Contraseña</label>
                    <input type="password" id="login-pass" value="${hasError ? '' : '1234'}" placeholder="Ingresa 1234" required>
                    ${hasError ? '<span class="error-msg">⚠️ Credenciales inválidas.</span>' : ''}
                </div>
                <div class="btn-group">
                    <!-- El botón ahora es type="submit" y dispara el evento del form de arriba -->
                    <button type="submit" class="btn">${hasError ? 'Reintentar' : 'Ingresar'}</button>
                    
                    <button type="button" class="btn btn-outline" onclick="navigate('recuperar')">Olvidé mi contraseña</button>
                    ${!hasError ? `<button type="button" class="btn btn-outline" onclick="navigate('${role === 'consumidor' ? 'registro-consumidor' : 'registro-comercio'}')">Crear cuenta</button>` : ''}
                </div>
            </form>

            <aside class="aside-box">
                <p>Rescata alimentos en Lima<br>Encuentra excedentes, reserva y recoge.</p>
                <hr>
                <h4>Seguridad de acceso</h4>
                <p>Tu sesión es privada. Usa una contraseña segura y no la compartas con nadie.</p>
                <h4>Tip de prueba</h4>
                <p>Usa cualquier contraseña distinta a <b>1234</b> para ver la pantalla de error de credenciales.</p>
            </aside>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    const pass = document.getElementById('login-pass').value;
    if (pass !== '1234') {
        navigate('login', { role: state.role, error: true });
        return;
    }
    state.loggedIn = true;
    navigate(state.role === 'consumidor' ? 'intereses' : 'categorias-comercio');
}

// 3. REGISTRO CONSUMIDOR (Normal y Correo Duplicado)[cite: 2]
function renderRegistroConsumidor(hasError = false) {
    app.innerHTML = `
        <h1>${hasError ? 'Crear cuenta de consumidor — Correo duplicado' : 'Crear cuenta de consumidor'}</h1>
        ${hasError ? `
            <div class="alert error">
                <strong>⚠️ Revisa la información</strong><br>
                Este correo ya pertenece a una cuenta. Inicia sesión o usa otro correo.
            </div>
        ` : ''}
        <div class="grid-2">
            <form onsubmit="handleRegistroConsumidor(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nombre completo *</label>
                        <input type="text" id="reg-nombre" value="${state.user.nombre}" required>
                    </div>
                    <div class="form-group ${hasError ? 'error-field' : ''}">
                        <label>Correo electrónico *</label>
                        <input type="email" id="reg-correo" value="${hasError ? 'ana.torres@correo.pe' : 'nuevo@correo.pe'}" required>
                        <span class="helper-text">Debe tener un formato válido y no estar registrado.</span>
                        ${hasError ? '<span class="error-msg">⚠️ El correo ya está registrado.</span>' : ''}
                    </div>
                </div>
                <div class="form-group" style="max-width:50%">
                    <label>Contraseña *</label>
                    <input type="password" value="********" required>
                    <span class="helper-text">Usa una contraseña segura.</span>
                </div>
                <div class="btn-group">
                    <button type="submit" class="btn">${hasError ? 'Corregir correo' : 'Registrarme'}</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('welcome')">Volver</button>
                </div>
            </form>
            <aside class="aside-box">
                <h4>Datos requeridos</h4>
                <p>Los campos marcados con * son obligatorios.</p>
                <h4>Prueba de validación</h4>
                <p>Si ingresas <b>ana.torres@correo.pe</b> simulará el error de correo duplicado.</p>
            </aside>
        </div>
    `;
}

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

function renderCuentaCreada() {
    app.innerHTML = `
        <h1>Tu cuenta está creada — Confirmación y verificación</h1>
        <p class="subtitle">${state.user.nombre}, te damos la bienvenida como consumidora.</p>
        <div class="alert success">
            <strong>✓ Operación confirmada</strong><br>
            Registro exitoso. Enviamos un correo de verificación a ${state.user.correo}.
        </div>
        <h2>Verifica tu correo</h2>
        <p class="subtitle">Abre el enlace recibido para verificar tu dirección.</p>
        <div style="max-width:450px">
            <button class="btn btn-block" onclick="navigate('intereses')">Continuar a preferencias</button>
            <button class="btn btn-outline btn-block" onclick="alert('Correo reenviado')">Reenviar correo</button>
            <button class="btn btn-outline btn-block" onclick="navigate('tutorial')">Ir a Descubrir</button>
        </div>
    `;
}

// 4. REGISTRO COMERCIO (Con validación de dirección vacía en tiempo real)[cite: 3]
function renderRegistroComercio(hasError = false) {
    app.innerHTML = `
        <h1>${hasError ? 'Registra tu comercio — Dirección obligatoria' : 'Registra tu comercio'}</h1>
        <p class="subtitle">Formulario exclusivo para el responsable del establecimiento.</p>

        ${hasError ? `
            <div class="alert error">
                <strong>⚠️ Revisa la información</strong><br>
                Falta la dirección del local. El botón de registro permanece deshabilitado.
            </div>
        ` : ''}

        <div class="grid-2">
            <form onsubmit="handleRegistroComercio(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nombre del local *</label>
                        <input type="text" id="com-nombre" value="${state.comercio.nombre}" required>
                    </div>
                    <div class="form-group ${hasError ? 'error-field' : ''}" id="group-direccion">
                        <label>Dirección *</label>
                        <input type="text" id="com-direccion" value="${hasError ? '' : state.comercio.direccion}" placeholder="Ingresar..." oninput="validarDireccionComercio()">
                        ${hasError ? '<span class="error-msg" id="dir-err">⚠️ La dirección es obligatoria.</span>' : '<span class="error-msg" id="dir-err" style="display:none">⚠️ La dirección es obligatoria.</span>'}
                    </div>
                    <div class="form-group">
                        <label>Teléfono *</label>
                        <input type="text" id="com-tel" value="${state.comercio.telefono}" required>
                    </div>
                    <div class="form-group">
                        <label>Rubro *</label>
                        <select id="com-rubro">
                            <option>Bodega / minimarket</option>
                            <option>Panadería</option>
                            <option>Restaurante</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Correo de acceso *</label>
                        <input type="email" id="com-correo" value="${state.comercio.correo}" required>
                    </div>
                    <div class="form-group">
                        <label>Contraseña *</label>
                        <input type="password" value="********" required>
                    </div>
                </div>
                <div class="btn-group">
                    <button type="submit" id="btn-reg-comercio" class="btn" ${hasError ? 'disabled' : ''}>Registrar cuenta</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('login', {role:'comerciante'})">Iniciar Sesión</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('welcome')">Volver</button>
                </div>
            </form>
            <aside class="aside-box">
                <h4>Registro de comercio</h4>
                <p>Al registrar tu comercio podrás publicar excedentes y configurar ventanas de recojo.</p>
                <hr>
                <h4>Prueba de validación</h4>
                <p>Borra el texto del campo <b>Dirección</b> para ver cómo se bloquea el formulario automáticamente.</p>
            </aside>
        </div>
    `;
}

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

function renderComercioRegistrado() {
    app.innerHTML = `
        <h1>Bienvenido, ${state.comercio.nombre} — Comercio registrado</h1>
        <p class="subtitle">Tu cuenta de comercio se registró correctamente.</p>
        <div class="alert success">
            <strong>✓ Operación confirmada</strong><br>
            Local registrado. Correo de verificación enviado a ${state.comercio.correo}.
        </div>
        <h2>Antes de publicar</h2>
        <p class="subtitle">Configura categorías, venta por volumen y ventanas de recojo.</p>
        <div style="max-width:450px">
            <button class="btn btn-block" onclick="navigate('categorias-comercio')">Configurar mi comercio</button>
            <button class="btn btn-outline btn-block" onclick="navigate('datos-local')">Ir al panel</button>
            <button class="btn btn-outline btn-block" onclick="alert('Verificación reenviada')">Reenviar verificación</button>
        </div>
    `;
}

// 5. RECUPERAR CONTRASEÑA (Flujo completo: formulario, correo inexistente y enviado)[cite: 4, 5]
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

// 6. ALIMENTOS DE INTERÉS (Consumidor)[cite: 5]
function renderIntereses() {
    const opciones = ['Pan', 'Lácteos', 'Frutas', 'Verduras', 'Granos', 'Comida preparada'];
    app.innerHTML = `
        <h1>Alimentos de interés</h1>
        <p class="subtitle">Selecciona uno o varios alimentos. Puedes cambiarlos desde Perfil.</p>
        <div class="grid-2">
            <div>
                <h2>Tus preferencias</h2>
                <div class="check-grid">
                    ${opciones.map(op => `
                        <label class="check-item">
                            <input type="checkbox" value="${op}" ${state.user.intereses.includes(op) ? 'checked' : ''} onchange="toggleInteres('${op}')">
                            ${op}
                        </label>
                    `).join('')}
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="renderIntereses()">Guardar intereses</button>
                    <button class="btn btn-outline" onclick="state.user.intereses = []; renderIntereses()">Eliminar intereses</button>
                </div>
                <div class="alert success" style="margin-top:20px">
                    <strong>✓ Operación confirmada</strong><br>
                    Intereses guardados: ${state.user.intereses.length ? state.user.intereses.join(', ') : 'Ninguno'}.
                </div>
            </div>
            <aside class="aside-box">
                <strong>Tu zona</strong>
                <p>Av. Canadá 100, La Victoria</p>
                <hr>
                <h4>Tus intereses activos</h4>
                <p>${state.user.intereses.map(i => `[${i}]`).join(' ') || 'Sin selección'}</p>
                <h4>Cómo usamos tus intereses</h4>
                <p>Filtramos las ofertas disponibles para mostrarte primero los alimentos que más te interesan.</p>
            </aside>
        </div>
    `;
}

function toggleInteres(item) {
    if (state.user.intereses.includes(item)) {
        state.user.intereses = state.user.intereses.filter(i => i !== item);
    } else {
        state.user.intereses.push(item);
    }
}

// 7. CATEGORÍAS Y VENTA POR VOLUMEN (Comercio - B2B Activo / Desactivado)[cite: 5, 6]
function renderCategoriasComercio() {
    const cats = ['Panadería', 'Lácteos', 'Abarrotes', 'Comida preparada', 'Frutas', 'Verduras'];
    app.innerHTML = `
        <h1>Categorías y venta por volumen ${!state.comercio.b2b ? '— B2B desactivado' : ''}</h1>
        <p class="subtitle">${state.comercio.b2b ? 'Define qué productos ofrece tu comercio.' : 'Puedes volver a habilitar el canal comerciantes minoristas cuando lo necesites.'}</p>

        <div class="grid-2">
            <div>
                <h2>Categorías públicas</h2>
                <div class="check-grid">
                    ${cats.map(c => `
                        <label class="check-item">
                            <input type="checkbox" ${state.comercio.categorias.includes(c) ? 'checked' : ''} onchange="toggleCat('${c}')">
                            ${c}
                        </label>
                    `).join('')}
                </div>

                <h2>Unidades predeterminadas habilitadas</h2>
                ${state.comercio.b2b ? `
                    <div class="check-grid">
                        <label class="check-item"><input type="checkbox" checked> Jabas</label>
                        <label class="check-item"><input type="checkbox" checked> Sacos</label>
                        <label class="check-item"><input type="checkbox" checked> Cajas</label>
                    </div>
                ` : `
                    <div class="box" style="margin-bottom:15px; background:#f8fafc">
                        <strong>Unidades de volumen</strong><br>
                        <small>Jabas / Sacos / Cajas — Activa Al por mayor para habilitar las unidades.</small>
                    </div>
                `}

                <div class="alert">
                    <strong>ℹ️ Información</strong><br>
                    ${state.comercio.b2b
                        ? 'Al guardar, tu ficha pública mostrará las categorías seleccionadas y el indicador "Venta por volumen".'
                        : 'El indicador B2B no aparecerá en la ficha pública. Publicar lotes está bloqueado.'}
                </div>

                <div class="btn-group">
                    <button class="btn" onclick="alert('Configuración guardada correctamente')">Guardar configuración</button>
                    <button class="btn btn-outline" onclick="state.comercio.b2b = !state.comercio.b2b; renderCategoriasComercio()">
                        ${state.comercio.b2b ? 'Desactivar venta B2B' : 'Activar venta al por mayor'}
                    </button>
                </div>
            </div>
            <aside class="aside-box">
                <strong>Tu local</strong>
                <p>${state.comercio.nombre}<br>${state.comercio.direccion}</p>
                <hr>
                <h4>Categorías activas</h4>
                <p>${state.comercio.categorias.map(c => `[${c}]`).join(' ')}</p>
                <h4>Estado B2B</h4>
                <p>${state.comercio.b2b ? 'Venta al por mayor habilitada.' : 'Canal mayorista desactivado.'}</p>
            </aside>
        </div>
    `;
}

function toggleCat(c) {
    if (state.comercio.categorias.includes(c)) {
        state.comercio.categorias = state.comercio.categorias.filter(item => item !== c);
    } else {
        state.comercio.categorias.push(c);
    }
}

// 8. TUTORIAL DE 3 PASOS[cite: 6, 7]
function renderTutorial() {
    const pasos = [
        {
            titulo: 'Encuentra excedentes cerca de ti',
            icono: '🗺️ mapa y ofertas cercanas',
            sub: 'Descubre tu zona',
            desc: 'Usa tu ubicación o una dirección manual. Ajusta el radio para encontrar comercios a tu alcance.'
        },
        {
            titulo: 'Reserva y paga',
            icono: '🍲 alimento, cantidad y total',
            sub: 'Revisa antes de reservar',
            desc: 'Consulta el stock, la caducidad y el horario de recojo. Elige la cantidad y confirma el monto antes de pagar.'
        },
        {
            titulo: 'Recoge con tu código',
            icono: '📱 código y entrega en el local',
            sub: 'Muestra el QR o código numérico',
            desc: 'Acércate durante la ventana de recojo. Tras la entrega podrás calificar tu experiencia.'
        }
    ];

    const actual = pasos[state.tutorialStep - 1];

    app.innerHTML = `
        <h1>${actual.titulo}</h1>
        <p class="subtitle">Tutorial · Paso ${state.tutorialStep} de 3</p>

        <div class="btn-group" style="margin-bottom:20px">
            ${state.tutorialStep < 3
                ? `<button class="btn" onclick="state.tutorialStep++; renderTutorial()">Siguiente</button>`
                : `<button class="btn" onclick="state.tutorialStep=1; navigate('perfil-consumidor')">Ir a Descubrir</button>`
            }
            <button class="btn btn-outline" onclick="state.tutorialStep=1; navigate('perfil-consumidor')">Omitir</button>
            ${state.tutorialStep > 1 ? `<button class="btn btn-outline" onclick="state.tutorialStep--; renderTutorial()">Anterior</button>` : ''}
        </div>

        <div class="grid-2">
            <div>
                <div class="placeholder-graphic" style="padding:60px">${actual.icono}</div>
                <h2>${actual.sub}</h2>
                <p class="subtitle">${actual.desc}</p>
            </div>
            <aside class="aside-box">
                <h4>Tutorial · Paso ${state.tutorialStep} de 3</h4>
                <p>Aprende a usar FoodRakyone en tres pasos sencillos.</p>
            </aside>
        </div>
    `;
}

// 9. PERFIL DEL CONSUMIDOR[cite: 7, 8]
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

function renderEditarPerfil(hasError = false) {
    app.innerHTML = `
        <h1>${hasError ? 'Editar mi perfil — Nombre obligatorio' : 'Editar mi perfil'}</h1>
        ${hasError ? '<div class="alert error">⚠️ El nombre no puede quedar vacío.</div>' : ''}
        <form onsubmit="handleGuardarPerfil(event)" style="max-width:500px">
            <div class="form-group ${hasError ? 'error-field' : ''}">
                <label>Nombre completo *</label>
                <input type="text" id="edit-nombre" value="${hasError ? '' : state.user.nombre}">
            </div>
            <div class="form-group">
                <label>Correo de contacto *</label>
                <input type="email" id="edit-correo" value="${state.user.correo}" required>
            </div>
            <div class="form-group">
                <label>Teléfono de contacto</label>
                <input type="text" id="edit-tel" value="${state.user.telefono}">
            </div>
            <div class="btn-group">
                <button type="submit" class="btn">Guardar cambios</button>
                <button type="button" class="btn btn-outline" onclick="navigate('perfil-consumidor')">Cancelar</button>
            </div>
        </form>
    `;
}

function handleGuardarPerfil(e) {
    e.preventDefault();
    const nombre = document.getElementById('edit-nombre').value.trim();
    if (!nombre) {
        navigate('editar-perfil', { error: true });
        return;
    }
    state.user.nombre = nombre;
    state.user.correo = document.getElementById('edit-correo').value;
    state.user.telefono = document.getElementById('edit-tel').value;
    navigate('perfil-guardado');
}

function renderPerfilGuardado() {
    app.innerHTML = `
        <h1>Perfil actualizado — Guardado exitoso</h1>
        <div class="alert success">✓ Operación confirmada: Tu perfil se actualizó correctamente.</div>
        <button class="btn" onclick="navigate('perfil-consumidor')">Volver a mi perfil</button>
    `;
}

// 10. DATOS DEL LOCAL (Comercio)[cite: 8, 9]
function renderDatosLocal(hasError = false) {
    app.innerHTML = `
        <h1>${hasError ? 'Datos del local — Dirección obligatoria' : 'Datos del local'}</h1>
        ${hasError ? '<div class="alert error">⚠️ Completa la dirección para guardar los datos del local.</div>' : ''}
        <div class="grid-2">
            <form onsubmit="handleGuardarLocal(event)">
                <div class="form-group">
                    <label>Nombre del local *</label>
                    <input type="text" id="loc-nombre" value="${state.comercio.nombre}" required>
                </div>
                <div class="form-group ${hasError ? 'error-field' : ''}">
                    <label>Dirección *</label>
                    <input type="text" id="loc-dir" value="${hasError ? '' : state.comercio.direccion}">
                </div>
                <div class="form-group">
                    <label>Teléfono *</label>
                    <input type="text" id="loc-tel" value="${state.comercio.telefono}" required>
                </div>
                <div class="btn-group">
                    <button type="submit" class="btn">Guardar cambios</button>
                    <button type="button" class="btn btn-outline" onclick="navigate('comercio-registrado')">Cancelar</button>
                </div>
            </form>
            <aside class="aside-box">
                <strong>Tu local</strong>
                <p>${state.comercio.nombre}<br>${state.comercio.direccion}</p>
                <hr>
                <h4>Impacto en ficha pública</h4>
                <p>Los datos actualizados aparecen de inmediato en tu ficha visible para los consumidores.</p>
            </aside>
        </div>
    `;
}

function handleGuardarLocal(e) {
    e.preventDefault();
    const dir = document.getElementById('loc-dir').value.trim();
    if (!dir) {
        navigate('datos-local', { error: true });
        return;
    }
    state.comercio.nombre = document.getElementById('loc-nombre').value;
    state.comercio.direccion = dir;
    state.comercio.telefono = document.getElementById('loc-tel').value;
    navigate('local-guardado');
}

function renderLocalGuardado() {
    app.innerHTML = `
        <h1>Local actualizado — Guardado exitoso</h1>
        <div class="alert success">✓ Operación confirmada: La ficha pública ya muestra los datos actualizados del local.</div>
        <div style="max-width:400px">
            <button class="btn btn-block" onclick="navigate('datos-local')">Ver ficha pública</button>
            <button class="btn btn-outline btn-block" onclick="navigate('categorias-comercio')">Volver al panel</button>
        </div>
    `;
}

// Iniciar aplicación en la pantalla de bienvenida
navigate('welcome');

// --- NUEVAS VISTAS: DESCUBRIR, PRODUCTO Y FAVORITOS ---

function renderDescubrir() {
    // Generamos las tarjetas leyendo los datos de state.ofertas
    const cardsHTML = state.ofertas.map(offer => `
        <div class="offer-card">
            <div class="offer-img-placeholder">
                <span style="font-size: 2.5rem;">${offer.icon}</span>
                <span style="font-size: 0.9rem; margin-top: 5px;">${offer.name}</span>
            </div>
            <div class="offer-tag" style="font-size: 0.8rem; font-weight: bold; margin-top: 5px;">
                ${offer.type} · <span style="color: var(--primary-green);">${offer.discount}</span>
            </div>
            <div class="offer-name" style="margin-top: 5px;"><strong>${offer.name}</strong></div>
            <div class="offer-price" style="font-size: 1.2rem; font-weight: bold; color: var(--text-main);">S/${offer.price}</div>
            <div class="offer-details" style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 15px;">
                ${offer.store} · aprox. ${offer.distance}<br>
                Original S/${offer.originalPrice} · ${offer.stock} disponibles<br>
                Hoy 07/10 · Recojo 18:00–20:00
            </div>
            <button class="btn-green" style="width: 100%;" onclick="navigate('producto', {id: ${offer.id}})">Ver oferta</button>
        </div>
    `).join('');

    // Retornamos el HTML que se inyectará en la pantalla
    return `
        <div class="layout-grid">
            <div class="main-content">
                <p style="color: var(--primary-blue); font-size: 0.8rem; margin-bottom: 10px;">Inicio > Descubrir</p>
                <h1 class="section-title">Descubre excedentes cercanos</h1>
                <p class="section-subtitle">La Victoria, Lima - Miércoles 7 de octubre de 2026</p>
                
                <div class="search-box">
                    <strong style="font-size: 0.9rem;">Buscar por producto</strong><br>
                    <input type="text" placeholder="¿Qué alimento buscas?" id="search-input" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 30px;">
                    <button class="btn-green" style="flex: 1;" onclick="navigate('resultados')">Buscar</button>
                    <button class="btn-outline" style="flex: 1;" onclick="navigate('filtros')">Filtros</button>
                    <button class="btn-outline" style="flex: 1;" onclick="navigate('mapa')">Ver en mapa</button>
                </div>

                <h3 style="color: var(--primary-blue); margin-bottom: 15px;">Última oportunidad</h3>
                <div class="card-grid">${cardsHTML}</div>
            </div>

            <div class="sidebar">
                <div class="sidebar-box">
                    <h3 style="color: var(--primary-blue); font-size: 1.1rem; margin-bottom: 10px;">Tu zona activa</h3>
                    <p style="font-size: 0.9rem;">📍 Av. Canadá 100, La Victoria</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Radio: 1 km</p>
                </div>
                <div class="sidebar-box">
                    <h3 style="color: var(--primary-blue); font-size: 1.1rem; margin-bottom: 10px;">Categorías</h3>
                    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem;">
                        <label><input type="checkbox"> 🍞 Panadería</label>
                        <label><input type="checkbox"> 🥛 Lácteos</label>
                        <label><input type="checkbox"> 🍎 Frutas</label>
                        <label><input type="checkbox"> 🍲 Comida preparada</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProducto(id) {
    const offer = state.ofertas.find(o => o.id === id);
    if(!offer) return '<p>Oferta no encontrada.</p><button onclick="navigate(\'descubrir\')">Volver</button>';

    return `
        <p onclick="navigate('descubrir')" style="cursor: pointer; color: var(--primary-blue); font-size: 0.8rem; margin-bottom: 10px;">Inicio > Descubrir > ${offer.name}</p>
        
        <div class="layout-grid">
            <div class="main-content">
                <h1 class="section-title">${offer.name}</h1>
                <p class="section-subtitle">${offer.store} - 4.5/5</p>

                <div class="offer-img-placeholder" style="height: 180px;">
                    <span style="font-size: 3rem;">${offer.icon}</span> 
                    <span style="font-size: 1.2rem; margin-top: 10px;">${offer.name}</span>
                </div>

                <div class="product-detail-grid">
                    <div class="price-box">
                        <small>Precio original</small><br><strong style="text-decoration: line-through;">S/${offer.originalPrice}</strong>
                    </div>
                    <div class="price-box">
                        <small>Descuento</small><br><strong style="color: var(--primary-green);">${offer.discount}</strong>
                    </div>
                    <div class="price-box" style="background: var(--bg-light); border-color: var(--primary-blue);">
                        <small>Precio remate</small><br><strong style="font-size: 1.2rem; color: var(--primary-blue);">S/${offer.price}</strong>
                    </div>
                </div>
            </div>

            <div class="sidebar">
                <div class="sidebar-box" style="background: #F8F9FA; border: 1px solid var(--primary-blue);">
                    <h3 style="margin-bottom: 15px; color: var(--primary-blue);">Resumen de reserva</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 5px;">1x ${offer.name}</p>
                    <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ccc;">
                    <p style="font-size: 1.1rem; font-weight: bold; margin-bottom: 20px;">Total: S/${offer.price}</p>
                    
                    <button class="btn-green" style="width: 100%; padding: 12px; font-size: 1rem;">Confirmar Reserva</button>
                    <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 10px;">Recojo presencial en local</p>
                </div>
            </div>
        </div>
    `;
}

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