# Ejemplos de cómo traer datos en el Frontend

## 1. Función base `apiCall` (ya existe en tu código)

```javascript
// API Base URL
const API_BASE = '/api';

async function apiCall(endpoint, options = {}) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        // Leer respuesta como texto primero
        const text = await response.text();
        let data;
        
        // Intentar parsear como JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = JSON.parse(text);
        } else {
            if (!response.ok) {
                throw new Error(text || `Error ${response.status}`);
            }
            throw new Error('Respuesta no es JSON válido');
        }
        
        if (!response.ok) {
            throw new Error(data.msg || data.error || text);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast(`Error: ${error.message}`, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}
```

---

## 2. TRAER TODOS LOS EVENTOS

```javascript
// ===== EVENTOS =====
async function loadEventos() {
    try {
        // Obtener filtros del formulario (opcional)
        const tipoFilter = document.getElementById('evento-tipo-filter')?.value || '';
        const categoriaFilter = document.getElementById('evento-categoria-filter')?.value || '';
        
        // Construir endpoint con parámetros
        let endpoint = '/eventos';
        const params = new URLSearchParams();
        
        if (tipoFilter) params.append('tipo', tipoFilter);
        if (categoriaFilter) params.append('categoria', categoriaFilter);
        
        if (params.toString()) {
            endpoint += `?${params.toString()}`;
        }
        
        // Llamar a la API
        const response = await apiCall(endpoint);
        
        // Mostrar los eventos en la página
        displayEventos(response.data);
    } catch (error) {
        console.error('Error cargando eventos:', error);
    }
}

// Ejemplos de uso:
// GET /api/eventos
// GET /api/eventos?tipo=recital
// GET /api/eventos?tipo=recital&categoria=123abc

// Función para mostrar los eventos en el DOM
function displayEventos(eventos) {
    const container = document.getElementById('eventos-list');
    
    if (eventos.length === 0) {
        container.innerHTML = '<p class="no-data">No hay eventos registrados.</p>';
        return;
    }
    
    container.innerHTML = eventos.map(evento => {
        const categoria = categorias.find(c => c._id === evento.categoria?._id);
        const precio = evento.precio?.esGratuito ? 'Gratuito' : 
                      `$${evento.precio?.monto?.toLocaleString()} ${evento.precio?.moneda || 'ARS'}`;
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <h3 class="item-title">${evento.titulo}</h3>
                        <span class="item-type">${getTipoIcon(evento.tipo)} ${getTipoName(evento.tipo)}</span>
                    </div>
                </div>
                <div class="item-description">${evento.descripcion}</div>
                <div class="item-details">
                    <div class="item-detail">
                        <strong>Fecha:</strong>
                        <span>${formatDate(evento.fecha)} ${formatTime(evento.hora)}</span>
                    </div>
                    <div class="item-detail">
                        <strong>Ubicación:</strong>
                        <span>${evento.ubicacion?.nombre || 'No especificada'}</span>
                    </div>
                    <div class="item-detail">
                        <strong>Precio:</strong>
                        <span>${precio}</span>
                    </div>
                    ${categoria ? `<div class="item-detail">
                        <strong>Categoría:</strong>
                        <span>${categoria.icono} ${categoria.nombre}</span>
                    </div>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary" onclick="editEvento('${evento._id}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deleteEvento('${evento._id}')">🗑️ Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}
```

---

## 3. TRAER TODOS LOS USUARIOS

```javascript
// ===== USUARIOS =====
async function loadUsuarios() {
    try {
        // Llamada simple sin parámetros
        const response = await apiCall('/usuarios');
        
        // response tiene la estructura: { msg, data, total, filtros_aplicados }
        // response.data es el array de usuarios
        displayUsuarios(response.data);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

// Ejemplo de uso:
// GET /api/usuarios

// Función para mostrar los usuarios en el DOM
function displayUsuarios(usuarios) {
    const container = document.getElementById('usuarios-list');
    
    if (usuarios.length === 0) {
        container.innerHTML = '<p class="no-data">No hay usuarios registrados.</p>';
        return;
    }
    
    container.innerHTML = usuarios.map(usuario => `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <h3 class="item-title">${usuario.nombre}</h3>
                    <span class="item-type">Usuario</span>
                </div>
            </div>
            <div class="item-details">
                <div class="item-detail">
                    <strong>Email:</strong>
                    <span>${usuario.email}</span>
                </div>
                <div class="item-detail">
                    <strong>Registro:</strong>
                    <span>${formatDate(usuario.fechaRegistro)}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="editUsuario('${usuario._id}')">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteUsuario('${usuario._id}')">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}
```

---

## 4. TRAER TODAS LAS CATEGORÍAS

```javascript
// ===== CATEGORÍAS =====
async function loadCategorias() {
    try {
        const response = await apiCall('/categorias');
        
        // Guardar categorías en variable global (se usa en formularios)
        categorias = response.data;
        
        // Actualizar selectores en formularios
        updateCategoriaSelectors();
        
        // Mostrar categorías si estamos en esa sección
        if (document.getElementById('categorias').classList.contains('active')) {
            displayCategorias(categorias);
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

// Ejemplo de uso:
// GET /api/categorias

// Función para actualizar selectores de categorías
function updateCategoriaSelectors() {
    const selectors = [
        'evento-categoria',
        'evento-categoria-filter'
    ];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            // Limpiar opciones existentes (excepto la primera)
            while (selector.children.length > 1) {
                selector.removeChild(selector.lastChild);
            }
            
            // Agregar categorías
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria._id;
                option.textContent = `${categoria.icono} ${categoria.nombre}`;
                selector.appendChild(option);
            });
        }
    });
}

// Función para mostrar las categorías en el DOM
function displayCategorias(categoriasList) {
    const container = document.getElementById('categorias-list');
    
    if (categoriasList.length === 0) {
        container.innerHTML = '<p class="no-data">No hay categorías registradas.</p>';
        return;
    }
    
    container.innerHTML = categoriasList.map(categoria => `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <h3 class="item-title">${categoria.icono} ${categoria.nombre}</h3>
                    <span class="item-type" style="background-color: ${categoria.color}">Categoría</span>
                </div>
            </div>
            <div class="item-description">${categoria.descripcion}</div>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="editCategoria('${categoria._id}')">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteCategoria('${categoria._id}')">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}
```

---

## 5. TRAER UN EVENTO POR ID

```javascript
async function loadEventoData(eventoId) {
    try {
        const response = await apiCall(`/eventos/${eventoId}`);
        
        // response.data contiene el evento completo
        const evento = response.data;
        
        // Llenar formulario con los datos
        document.getElementById('evento-titulo').value = evento.titulo;
        document.getElementById('evento-descripcion').value = evento.descripcion;
        document.getElementById('evento-tipo').value = evento.tipo;
        document.getElementById('evento-categoria').value = evento.categoria?._id || '';
        document.getElementById('evento-fecha').value = evento.fecha;
        document.getElementById('evento-hora').value = evento.hora || '';
        document.getElementById('evento-ubicacion-nombre').value = evento.ubicacion?.nombre || '';
        document.getElementById('evento-ubicacion-direccion').value = evento.ubicacion?.direccion || '';
        document.getElementById('evento-lat').value = evento.ubicacion?.coordenadas?.lat || '';
        document.getElementById('evento-lng').value = evento.ubicacion?.coordenadas?.lng || '';
        document.getElementById('evento-gratuito').checked = evento.precio?.esGratuito || false;
        document.getElementById('evento-precio').value = evento.precio?.monto || '';
        document.getElementById('evento-recomendaciones').value = evento.informacionAdicional?.recomendaciones?.join(', ') || '';
        document.getElementById('evento-contacto').value = evento.informacionAdicional?.contacto || '';
    } catch (error) {
        console.error('Error cargando evento:', error);
    }
}

// Ejemplo de uso:
// GET /api/eventos/123abc
```

---

## 6. TRAER UN USUARIO POR ID

```javascript
async function loadUsuarioData(usuarioId) {
    try {
        const response = await apiCall(`/usuarios/${usuarioId}`);
        
        // response.data contiene el usuario completo
        const usuario = response.data;
        
        // Llenar formulario con los datos
        document.getElementById('usuario-nombre').value = usuario.nombre;
        document.getElementById('usuario-email').value = usuario.email;
        // Nota: La contraseña no se carga por seguridad
    } catch (error) {
        console.error('Error cargando usuario:', error);
    }
}

// Ejemplo de uso:
// GET /api/usuarios/789xyz
```

---

## 7. TRAER UNA CATEGORÍA POR ID

```javascript
async function loadCategoriaData(categoriaId) {
    try {
        const response = await apiCall(`/categorias/${categoriaId}`);
        
        // response.data contiene la categoría completa
        const categoria = response.data;
        
        // Llenar formulario con los datos
        document.getElementById('categoria-nombre').value = categoria.nombre;
        document.getElementById('categoria-descripcion').value = categoria.descripcion;
        document.getElementById('categoria-icono').value = categoria.icono || '';
        document.getElementById('categoria-color').value = categoria.color || '#007bff';
    } catch (error) {
        console.error('Error cargando categoría:', error);
    }
}

// Ejemplo de uso:
// GET /api/categorias/456def
```

---

## 8. EJEMPLOS DE RESPUESTAS DE LA API

### Respuesta de GET /api/eventos
```json
{
    "msg": "Eventos obtenidos exitosamente",
    "data": [
        {
            "_id": "123abc",
            "titulo": "Concierto de Rock",
            "descripcion": "Presentación de las mejores bandas",
            "tipo": "recital",
            "categoria": {
                "_id": "456",
                "nombre": "Música",
                "descripcion": "Eventos musicales",
                "icono": "🎵",
                "color": "#ff6b6b"
            },
            "fecha": "2024-03-15",
            "hora": "20:00",
            "ubicacion": {
                "nombre": "Estadio Luna Park",
                "direccion": "Av. Corrientes 4200, CABA",
                "coordenadas": {
                    "lat": -34.6037,
                    "lng": -58.3816
                }
            },
            "precio": {
                "esGratuito": false,
                "monto": 5000,
                "moneda": "ARS"
            },
            "informacionAdicional": {
                "recomendaciones": ["Llegar temprano", "Traer documento"],
                "contacto": "info@evento.com"
            },
            "activo": true
        }
    ],
    "total": 1,
    "filtros_aplicados": {}
}
```

### Respuesta de GET /api/usuarios
```json
{
    "msg": "Usuarios obtenidos exitosamente",
    "data": [
        {
            "_id": "789xyz",
            "nombre": "Juan Pérez",
            "email": "juan@email.com",
            "fechaRegistro": "2024-01-15T10:30:00.000Z"
        }
    ],
    "total": 1,
    "filtros_aplicados": {}
}
```

### Respuesta de GET /api/categorias
```json
{
    "msg": "Categorías obtenidas exitosamente",
    "data": [
        {
            "_id": "456def",
            "nombre": "Música",
            "descripcion": "Eventos musicales",
            "icono": "🎵",
            "color": "#ff6b6b"
        }
    ],
    "total": 1,
    "filtros_aplicados": {}
}
```

---

## 9. INICIALIZACIÓN AL CARGAR LA PÁGINA

```javascript
// Estado global
let currentEditingId = null;
let categorias = [];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadCategorias();    // Primero categorías (se usan en formularios)
    loadEventos();       // Luego eventos
    loadUsuarios();      // Y usuarios
    setupFormHandlers();
});
```

---

## 10. PATRONES GENERALES

### Estructura de todas las peticiones GET:
```javascript
// Sin parámetros
const response = await apiCall('/endpoint');
const datos = response.data;  // Array o objeto

// Con parámetros de búsqueda
let endpoint = '/endpoint';
const params = new URLSearchParams();
if (filtro) params.append('parametro', filtro);
if (params.toString()) endpoint += `?${params.toString()}`;
const response = await apiCall(endpoint);

// Con ID específico
const response = await apiCall(`/endpoint/${id}`);
const item = response.data;  // Objeto individual
```

### Manejo de errores:
```javascript
try {
    const response = await apiCall('/endpoint');
    // Procesar respuesta
} catch (error) {
    console.error('Error:', error);
    // El error ya se muestra al usuario mediante showToast
}
```

---

## RESUMEN RÁPIDO

- **Eventos**: `await apiCall('/eventos')` → `response.data` (array)
- **Usuarios**: `await apiCall('/usuarios')` → `response.data` (array)
- **Categorías**: `await apiCall('/categorias')` → `response.data` (array)
- **Por ID**: `await apiCall('/endpoint/${id}')` → `response.data` (objeto)
- **Con filtros**: `await apiCall('/eventos?tipo=recital&categoria=123')` → `response.data` (array)

Todas las respuestas tienen la estructura:
```javascript
{
    msg: "Mensaje de éxito",
    data: [...],  // Array o objeto
    total: 1,
    filtros_aplicados: {}
}
```

