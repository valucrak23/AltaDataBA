// API Base URL
const API_BASE = '/api';

// Estado global
let currentEditingId = null;
let categorias = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadCategorias();
    loadEventos();
    loadUsuarios();
    setupFormHandlers();
});

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;

            // Remover clase active de botones y secciones
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Activar botón y sección seleccionados
            button.classList.add('active');
            document.getElementById(targetSection).classList.add('active');

            // Render o cargar datos según sección seleccionada
            if (targetSection === 'categorias') {
                if (categorias.length === 0) {
                    loadCategorias();
                } else {
                    displayCategorias(categorias);
                }
            } else if (targetSection === 'eventos') {
                loadEventos();
            } else if (targetSection === 'usuarios') {
                loadUsuarios();
            }
        });
    });
}

// ===== UTILIDADES =====
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
}

function formatTime(timeString) {
    return timeString || 'No especificada';
}

// ===== API CALLS =====
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
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.msg || 'Error en la petición');
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

// ===== CATEGORÍAS =====
async function loadCategorias() {
    try {
        const response = await apiCall('/categorias');
        categorias = response.data;
        
        // Actualizar selectores de categorías
        updateCategoriaSelectors();
        
        // Mostrar categorías si estamos en esa sección
        if (document.getElementById('categorias').classList.contains('active')) {
            displayCategorias(categorias);
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

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

// ===== EVENTOS =====
async function loadEventos() {
    try {
        const tipoFilter = document.getElementById('evento-tipo-filter')?.value || '';
        const categoriaFilter = document.getElementById('evento-categoria-filter')?.value || '';
        
        let endpoint = '/eventos';
        const params = new URLSearchParams();
        
        if (tipoFilter) params.append('tipo', tipoFilter);
        if (categoriaFilter) params.append('categoria', categoriaFilter);
        
        if (params.toString()) {
            endpoint += `?${params.toString()}`;
        }
        
        const response = await apiCall(endpoint);
        displayEventos(response.data);
    } catch (error) {
        console.error('Error cargando eventos:', error);
    }
}

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
                        <strong>Categoría:</strong>
                        <span style="color: ${categoria?.color || '#007bff'}">
                            ${categoria?.icono || '🏷️'} ${categoria?.nombre || 'Sin categoría'}
                        </span>
                    </div>
                    <div class="item-detail">
                        <strong>Fecha:</strong>
                        <span>${formatDate(evento.fecha)} - ${formatTime(evento.hora)}</span>
                    </div>
                    <div class="item-detail">
                        <strong>Lugar:</strong>
                        <span>${evento.ubicacion?.nombre || 'No especificado'}</span>
                    </div>
                    <div class="item-detail">
                        <strong>Dirección:</strong>
                        <span>${evento.ubicacion?.direccion || 'No especificada'}</span>
                    </div>
                    <div class="item-detail">
                        <strong>Precio:</strong>
                        <span>${precio}</span>
                    </div>
                    ${evento.informacionAdicional?.contacto ? `
                        <div class="item-detail">
                            <strong>Contacto:</strong>
                            <span>${evento.informacionAdicional.contacto}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary" onclick="editEvento('${evento._id}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deleteEvento('${evento._id}')">🗑️ Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

function getTipoIcon(tipo) {
    const icons = {
        'recital': '🎵',
        'evento_cultural': '🎨',
        'taller': '📚'
    };
    return icons[tipo] || '🎭';
}

function getTipoName(tipo) {
    const names = {
        'recital': 'Recital',
        'evento_cultural': 'Evento Cultural',
        'taller': 'Taller'
    };
    return names[tipo] || 'Evento';
}

// ===== USUARIOS =====
async function loadUsuarios() {
    try {
        const response = await apiCall('/usuarios');
        displayUsuarios(response.data);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

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

// ===== FORMULARIOS =====
function setupFormHandlers() {
    // Evento form
    document.getElementById('evento-form').addEventListener('submit', handleEventoSubmit);
    
    // Usuario form
    document.getElementById('usuario-form').addEventListener('submit', handleUsuarioSubmit);
    
    // Categoría form
    document.getElementById('categoria-form').addEventListener('submit', handleCategoriaSubmit);
    
    // Checkbox para evento gratuito
    document.getElementById('evento-gratuito').addEventListener('change', function() {
        const precioGroup = document.getElementById('precio-group');
        precioGroup.style.display = this.checked ? 'none' : 'block';
    });
}

// ===== MODALES =====
function showEventForm(eventoId = null) {
    currentEditingId = eventoId;
    const modal = document.getElementById('evento-modal');
    const title = document.getElementById('evento-form-title');
    const form = document.getElementById('evento-form');
    
    title.textContent = eventoId ? 'Editar Evento' : 'Nuevo Evento';
    form.reset();
    
    if (eventoId) {
        loadEventoData(eventoId);
    }
    
    modal.style.display = 'block';
}

function closeEventForm() {
    document.getElementById('evento-modal').style.display = 'none';
    currentEditingId = null;
}

function showUserForm(usuarioId = null) {
    currentEditingId = usuarioId;
    const modal = document.getElementById('usuario-modal');
    const title = document.getElementById('usuario-form-title');
    const form = document.getElementById('usuario-form');
    
    title.textContent = usuarioId ? 'Editar Usuario' : 'Nuevo Usuario';
    form.reset();
    
    if (usuarioId) {
        loadUsuarioData(usuarioId);
    }
    
    modal.style.display = 'block';
}

function closeUserForm() {
    document.getElementById('usuario-modal').style.display = 'none';
    currentEditingId = null;
}

function showCategoryForm(categoriaId = null) {
    currentEditingId = categoriaId;
    const modal = document.getElementById('categoria-modal');
    const title = document.getElementById('categoria-form-title');
    const form = document.getElementById('categoria-form');
    
    title.textContent = categoriaId ? 'Editar Categoría' : 'Nueva Categoría';
    form.reset();
    
    if (categoriaId) {
        loadCategoriaData(categoriaId);
    }
    
    modal.style.display = 'block';
}

function closeCategoryForm() {
    document.getElementById('categoria-modal').style.display = 'none';
    currentEditingId = null;
}

// ===== HANDLERS DE FORMULARIOS =====
async function handleEventoSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = {
            titulo: document.getElementById('evento-titulo').value,
            descripcion: document.getElementById('evento-descripcion').value,
            tipo: document.getElementById('evento-tipo').value,
            categoria: document.getElementById('evento-categoria').value,
            fecha: document.getElementById('evento-fecha').value,
            hora: document.getElementById('evento-hora').value,
            ubicacion: {
                nombre: document.getElementById('evento-ubicacion-nombre').value,
                direccion: document.getElementById('evento-ubicacion-direccion').value,
                coordenadas: {
                    lat: parseFloat(document.getElementById('evento-lat').value) || null,
                    lng: parseFloat(document.getElementById('evento-lng').value) || null
                }
            },
            precio: {
                esGratuito: document.getElementById('evento-gratuito').checked,
                monto: document.getElementById('evento-precio').value || 0,
                moneda: 'ARS'
            },
            informacionAdicional: {
                recomendaciones: document.getElementById('evento-recomendaciones').value.split(',').map(r => r.trim()).filter(r => r),
                contacto: document.getElementById('evento-contacto').value
            }
        };
        
        const endpoint = currentEditingId ? `/eventos/${currentEditingId}` : '/eventos';
        const method = currentEditingId ? 'PUT' : 'POST';
        
        await apiCall(endpoint, {
            method,
            body: JSON.stringify(formData)
        });
        
        showToast(currentEditingId ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente', 'success');
        closeEventForm();
        loadEventos();
        
    } catch (error) {
        console.error('Error guardando evento:', error);
    }
}

async function handleUsuarioSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = {
            nombre: document.getElementById('usuario-nombre').value,
            email: document.getElementById('usuario-email').value,
            password: document.getElementById('usuario-password').value
        };
        
        const endpoint = currentEditingId ? `/usuarios/${currentEditingId}` : '/usuarios';
        const method = currentEditingId ? 'PUT' : 'POST';
        
        await apiCall(endpoint, {
            method,
            body: JSON.stringify(formData)
        });
        
        showToast(currentEditingId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente', 'success');
        closeUserForm();
        loadUsuarios();
        
    } catch (error) {
        console.error('Error guardando usuario:', error);
    }
}

async function handleCategoriaSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = {
            nombre: document.getElementById('categoria-nombre').value,
            descripcion: document.getElementById('categoria-descripcion').value,
            icono: document.getElementById('categoria-icono').value,
            color: document.getElementById('categoria-color').value
        };
        
        const endpoint = currentEditingId ? `/categorias/${currentEditingId}` : '/categorias';
        const method = currentEditingId ? 'PUT' : 'POST';
        
        await apiCall(endpoint, {
            method,
            body: JSON.stringify(formData)
        });
        
        showToast(currentEditingId ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente', 'success');
        closeCategoryForm();
        loadCategorias();
        
    } catch (error) {
        console.error('Error guardando categoría:', error);
    }
}

// ===== FUNCIONES DE CARGA DE DATOS =====
async function loadEventoData(eventoId) {
    try {
        const response = await apiCall(`/eventos/${eventoId}`);
        const evento = response.data;
        
        document.getElementById('evento-titulo').value = evento.titulo;
        document.getElementById('evento-descripcion').value = evento.descripcion;
        document.getElementById('evento-tipo').value = evento.tipo;
        document.getElementById('evento-categoria').value = evento.categoria?._id || '';
        document.getElementById('evento-fecha').value = evento.fecha?.split('T')[0] || '';
        document.getElementById('evento-hora').value = evento.hora || '';
        document.getElementById('evento-ubicacion-nombre').value = evento.ubicacion?.nombre || '';
        document.getElementById('evento-ubicacion-direccion').value = evento.ubicacion?.direccion || '';
        document.getElementById('evento-lat').value = evento.ubicacion?.coordenadas?.lat || '';
        document.getElementById('evento-lng').value = evento.ubicacion?.coordenadas?.lng || '';
        document.getElementById('evento-gratuito').checked = evento.precio?.esGratuito || false;
        document.getElementById('evento-precio').value = evento.precio?.monto || '';
        document.getElementById('evento-recomendaciones').value = evento.informacionAdicional?.recomendaciones?.join(', ') || '';
        document.getElementById('evento-contacto').value = evento.informacionAdicional?.contacto || '';
        
        // Actualizar visibilidad del precio
        const precioGroup = document.getElementById('precio-group');
        precioGroup.style.display = evento.precio?.esGratuito ? 'none' : 'block';
        
    } catch (error) {
        console.error('Error cargando datos del evento:', error);
    }
}

async function loadUsuarioData(usuarioId) {
    try {
        const response = await apiCall(`/usuarios/${usuarioId}`);
        const usuario = response.data;
        
        document.getElementById('usuario-nombre').value = usuario.nombre;
        document.getElementById('usuario-email').value = usuario.email;
        document.getElementById('usuario-password').value = '';
        
    } catch (error) {
        console.error('Error cargando datos del usuario:', error);
    }
}

async function loadCategoriaData(categoriaId) {
    try {
        const response = await apiCall(`/categorias/${categoriaId}`);
        const categoria = response.data;
        
        document.getElementById('categoria-nombre').value = categoria.nombre;
        document.getElementById('categoria-descripcion').value = categoria.descripcion;
        document.getElementById('categoria-icono').value = categoria.icono || '';
        document.getElementById('categoria-color').value = categoria.color || '#007bff';
        
    } catch (error) {
        console.error('Error cargando datos de la categoría:', error);
    }
}

// ===== FUNCIONES DE EDICIÓN =====
async function editEvento(eventoId) {
    showEventForm(eventoId);
}

async function editUsuario(usuarioId) {
    showUserForm(usuarioId);
}

async function editCategoria(categoriaId) {
    showCategoryForm(categoriaId);
}

// ===== FUNCIONES DE ELIMINACIÓN =====
async function deleteEvento(eventoId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    
    try {
        await apiCall(`/eventos/${eventoId}`, { method: 'DELETE' });
        showToast('Evento eliminado exitosamente', 'success');
        loadEventos();
    } catch (error) {
        console.error('Error eliminando evento:', error);
    }
}

async function deleteUsuario(usuarioId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    try {
        await apiCall(`/usuarios/${usuarioId}`, { method: 'DELETE' });
        showToast('Usuario eliminado exitosamente', 'success');
        loadUsuarios();
    } catch (error) {
        console.error('Error eliminando usuario:', error);
    }
}

async function deleteCategoria(categoriaId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;
    
    try {
        await apiCall(`/categorias/${categoriaId}`, { method: 'DELETE' });
        showToast('Categoría eliminada exitosamente', 'success');
        loadCategorias();
    } catch (error) {
        console.error('Error eliminando categoría:', error);
    }
}

// ===== EVENT LISTENERS ADICIONALES =====
// Cerrar modales al hacer clic fuera
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Cerrar modales con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});
