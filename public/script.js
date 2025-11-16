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
        
        // Leer la respuesta primero como texto para poder manejarla mejor
        const text = await response.text();
        let data;
        
        // Intentar parsear como JSON si el Content-Type indica que es JSON
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                // Si falla el parseo JSON pero el servidor dice que es JSON, usar el texto
                if (!response.ok) {
                    throw new Error(text || `Error ${response.status}: ${response.statusText}`);
                }
                throw new Error('Respuesta no es JSON válido: ' + text.substring(0, 100));
            }
        } else {
            // Si no es JSON y hay un error, lanzar el texto como error
            if (!response.ok) {
                throw new Error(text || `Error ${response.status}: ${response.statusText}`);
            }
            throw new Error('Respuesta no es JSON válido');
        }
        
        if (!response.ok) {
            throw new Error(data.msg || data.error || text || `Error ${response.status}: ${response.statusText}`);
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
    // Actualizar selector de filtro (select simple)
    const filterSelector = document.getElementById('evento-categoria-filter');
    if (filterSelector) {
        while (filterSelector.children.length > 1) {
            filterSelector.removeChild(filterSelector.lastChild);
        }
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria._id;
            option.textContent = `${categoria.icono} ${categoria.nombre}`;
            filterSelector.appendChild(option);
        });
    }
    
    // Actualizar contenedor de categorías con checkboxes (para el formulario)
    const categoriasContainer = document.getElementById('evento-categorias-container');
    if (categoriasContainer) {
        categoriasContainer.innerHTML = '';
        categorias.forEach(categoria => {
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            div.innerHTML = `
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" class="evento-categoria-checkbox" value="${categoria._id}" style="margin-right: 8px;">
                    <input type="radio" name="evento-categoria-predominante" value="${categoria._id}" class="evento-categoria-predominante" style="margin-right: 5px;" title="Categoría predominante">
                    <span>${categoria.icono} ${categoria.nombre}</span>
                </label>
            `;
            categoriasContainer.appendChild(div);
        });
        
        // Hacer que al seleccionar una checkbox, se pueda seleccionar como predominante
        const checkboxes = categoriasContainer.querySelectorAll('.evento-categoria-checkbox');
        const radios = categoriasContainer.querySelectorAll('.evento-categoria-predominante');
        
        // Función para actualizar el color basado en la categoría predominante
        const updateColorFromPredominantCategory = () => {
            const predominantRadio = categoriasContainer.querySelector('.evento-categoria-predominante:checked');
            if (predominantRadio) {
                const categoriaId = predominantRadio.value;
                const categoria = categorias.find(c => c._id === categoriaId);
                if (categoria && categoria.color) {
                    const colorInput = document.getElementById('evento-color');
                    if (colorInput) {
                        // Solo actualizar si el usuario no ha modificado manualmente el color recientemente
                        // Guardamos un flag para saber si fue cambio automático o manual
                        if (!colorInput.dataset.manualChange) {
                            colorInput.value = categoria.color;
                        }
                    }
                }
            }
        };
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const radio = categoriasContainer.querySelector(`input[type="radio"][value="${this.value}"]`);
                if (this.checked) {
                    radio.disabled = false;
                    // Si es la primera categoría seleccionada, marcarla como predominante
                    const checkedCount = categoriasContainer.querySelectorAll('.evento-categoria-checkbox:checked').length;
                    if (checkedCount === 1) {
                        radio.checked = true;
                        updateColorFromPredominantCategory();
                    }
                } else {
                    radio.disabled = true;
                    radio.checked = false;
                    // Si se desmarca la predominante, seleccionar la primera disponible
                    const predominanteChecked = categoriasContainer.querySelector('.evento-categoria-predominante:checked');
                    if (!predominanteChecked || predominanteChecked === radio) {
                        const firstChecked = categoriasContainer.querySelector('.evento-categoria-checkbox:checked');
                        if (firstChecked) {
                            const firstRadio = categoriasContainer.querySelector(`input[type="radio"][value="${firstChecked.value}"]`);
                            if (firstRadio) {
                                firstRadio.checked = true;
                                updateColorFromPredominantCategory();
                            }
                        }
                    }
                }
            });
        });
        
        // Listener para cuando se cambia la categoría predominante
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    updateColorFromPredominantCategory();
                }
            });
        });
        
        // Deshabilitar radios de categorías no seleccionadas
        radios.forEach(radio => {
            const checkbox = categoriasContainer.querySelector(`input[type="checkbox"][value="${radio.value}"]`);
            if (!checkbox.checked) {
                radio.disabled = true;
            }
        });
        
        // Listener para permitir modificación manual del color
        const colorInput = document.getElementById('evento-color');
        if (colorInput) {
            colorInput.addEventListener('input', function() {
                // Marcar que el usuario modificó manualmente el color
                this.dataset.manualChange = 'true';
            });
            
            // Si el usuario borra el color manualmente, permitir que se actualice automáticamente de nuevo
            colorInput.addEventListener('focus', function() {
                // Opcional: remover el flag al enfocar para permitir cambios automáticos después de editar manualmente
                // this.dataset.manualChange = 'false';
            });
        }
    }
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
        // Obtener categorías (compatibilidad hacia atrás con evento.categoria)
        const categoriasList = evento.categorias || (evento.categoria ? [evento.categoria] : []);
        const categoriaPredominante = evento.categoriaPredominante || evento.categoria;
        const categoriaPredominanteId = categoriaPredominante?._id || categoriaPredominante;
        
        // Formatear categorías para mostrar
        let categoriasHtml = '';
        if (categoriasList.length > 0) {
            categoriasHtml = categoriasList.map(cat => {
                const catObj = typeof cat === 'object' ? cat : categorias.find(c => c._id === cat);
                const catId = typeof cat === 'object' ? cat._id : cat;
                const isPredominante = catId === categoriaPredominanteId;
                
                if (catObj) {
                    return `
                        <span style="
                            display: inline-block;
                            margin: 2px 5px 2px 0;
                            padding: 4px 8px;
                            border-radius: 4px;
                            background-color: ${catObj.color || '#007bff'};
                            color: white;
                            font-size: 0.85em;
                            ${isPredominante ? 'font-weight: bold; border: 2px solid #ffd700;' : 'opacity: 0.85;'}
                        ">
                            ${isPredominante ? '⭐ ' : ''}${catObj.icono || '🏷️'} ${catObj.nombre || 'Sin nombre'}
                        </span>
                    `;
                }
                return '';
            }).filter(h => h).join('');
        } else {
            categoriasHtml = '<span style="color: #999;">Sin categorías</span>';
        }
        
        const precio = evento.precio?.esGratuito ? 'Gratuito' : 
                      `$${evento.precio?.monto?.toLocaleString()} ${evento.precio?.moneda || 'ARS'}`;
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <h3 class="item-title">${evento.titulo}</h3>
                        <span class="item-type" style="background-color: ${evento.color || '#007bff'}">${getTipoIcon(evento.tipo)} ${getTipoName(evento.tipo)}</span>
                    </div>
                </div>
                <div class="item-description">${evento.descripcion}</div>
                <div class="item-details">
                    <div class="item-detail">
                        <strong>Categorías:</strong>
                        <div style="margin-top: 5px;">
                            ${categoriasHtml}
                        </div>
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
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
    
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
    
    // Limpiar categorías seleccionadas y resetear flag de color manual
    if (!eventoId) {
        document.querySelectorAll('.evento-categoria-checkbox').forEach(cb => {
            cb.checked = false;
            const radio = document.querySelector(`input[type="radio"][value="${cb.value}"]`);
            if (radio) {
                radio.disabled = true;
                radio.checked = false;
            }
        });
        // Limpiar flag de cambio manual del color para permitir actualización automática
        const colorInput = document.getElementById('evento-color');
        if (colorInput) {
            colorInput.dataset.manualChange = 'false';
        }
    }
    
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

function showLoginForm() {
    const modal = document.getElementById('login-modal');
    const form = document.getElementById('login-form');
    const resultDiv = document.getElementById('login-result');
    
    form.reset();
    resultDiv.style.display = 'none';
    resultDiv.className = '';
    resultDiv.textContent = '';
    modal.style.display = 'block';
}

function closeLoginForm() {
    const modal = document.getElementById('login-modal');
    const resultDiv = document.getElementById('login-result');
    
    modal.style.display = 'none';
    resultDiv.style.display = 'none';
    resultDiv.className = '';
    resultDiv.textContent = '';
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
        // Obtener categorías seleccionadas
        const categoriaCheckboxes = document.querySelectorAll('.evento-categoria-checkbox:checked');
        const categoriasSeleccionadas = Array.from(categoriaCheckboxes).map(cb => cb.value);
        
        if (categoriasSeleccionadas.length === 0) {
            showToast('Debes seleccionar al menos una categoría', 'error');
            return;
        }
        
        // Obtener categoría predominante
        const categoriaPredominante = document.querySelector('.evento-categoria-predominante:checked')?.value;
        if (!categoriaPredominante) {
            showToast('Debes seleccionar una categoría predominante', 'error');
            return;
        }
        
        const formData = {
            titulo: document.getElementById('evento-titulo').value,
            descripcion: document.getElementById('evento-descripcion').value,
            tipo: document.getElementById('evento-tipo').value,
            categorias: categoriasSeleccionadas,
            categoriaPredominante: categoriaPredominante,
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
            },
            color: document.getElementById('evento-color').value || '#007bff'
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

async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const resultDiv = document.getElementById('login-result');
    resultDiv.style.display = 'block';
    
    try {
        const formData = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };
        
        const response = await apiCall('/usuarios/auth', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        // Mostrar el token recibido
        const token = response.jwt || response.token;
        if (token) {
            resultDiv.className = 'success';
            resultDiv.style.backgroundColor = '#d4edda';
            resultDiv.style.color = '#155724';
            resultDiv.style.border = '1px solid #c3e6cb';
            resultDiv.innerHTML = `
                <strong>✅ Login exitoso!</strong><br>
                <strong>Token JWT:</strong><br>
                <code style="word-break: break-all; font-size: 12px;">${token}</code><br>
                <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${token}'); showToast('Token copiado al portapapeles', 'success');" style="margin-top: 10px;">📋 Copiar Token</button>
            `;
            
            // Guardar token en localStorage (opcional)
            localStorage.setItem('authToken', token);
            
            showToast('Login exitoso', 'success');
            
            // Opcional: cerrar el modal después de 3 segundos
            setTimeout(() => {
                closeLoginForm();
            }, 5000);
        } else {
            throw new Error('No se recibió token en la respuesta');
        }
        
    } catch (error) {
        resultDiv.className = 'error';
        resultDiv.style.backgroundColor = '#f8d7da';
        resultDiv.style.color = '#721c24';
        resultDiv.style.border = '1px solid #f5c6cb';
        resultDiv.innerHTML = `<strong>❌ Error:</strong> ${error.message}`;
        console.error('Error en login:', error);
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
        
        // Cargar múltiples categorías
        const categoriasIds = evento.categorias?.map(c => typeof c === 'object' ? c._id : c) || 
                              (evento.categoria ? [typeof evento.categoria === 'object' ? evento.categoria._id : evento.categoria] : []);
        const categoriaPredominanteObj = evento.categoriaPredominante || null;
        const categoriaPredominanteId = categoriaPredominanteObj?._id || 
                                       evento.categoriaPredominante || 
                                       (evento.categoria ? (typeof evento.categoria === 'object' ? evento.categoria._id : evento.categoria) : null);
        
        // Desmarcar todas las categorías primero
        document.querySelectorAll('.evento-categoria-checkbox').forEach(cb => {
            cb.checked = false;
            const radio = document.querySelector(`input[type="radio"][value="${cb.value}"]`);
            if (radio) radio.disabled = true;
        });
        
        // Marcar las categorías seleccionadas
        categoriasIds.forEach(catId => {
            const checkbox = document.querySelector(`.evento-categoria-checkbox[value="${catId}"]`);
            if (checkbox) {
                checkbox.checked = true;
                const radio = document.querySelector(`input[type="radio"][value="${catId}"]`);
                if (radio) {
                    radio.disabled = false;
                    if (catId === categoriaPredominanteId) {
                        radio.checked = true;
                    }
                }
            }
        });
        
        // Si no hay categoría predominante pero hay categorías, seleccionar la primera
        if (!categoriaPredominanteId && categoriasIds.length > 0) {
            const firstRadio = document.querySelector(`input[type="radio"][value="${categoriasIds[0]}"]`);
            if (firstRadio) firstRadio.checked = true;
        }
        
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
        
        // Cargar color: si el evento tiene color propio, usarlo; si no, usar el de la categoría predominante
        let colorEvento = evento.color || null;
        if (!colorEvento && categoriaPredominanteId) {
            // Buscar la categoría predominante para obtener su color
            const catPredObj = categoriaPredominanteObj || 
                              categorias.find(c => c._id === categoriaPredominanteId);
            if (catPredObj && catPredObj.color) {
                colorEvento = catPredObj.color;
            }
        }
        // Si todavía no hay color, usar el predeterminado
        if (!colorEvento) {
            colorEvento = '#007bff';
        }
        
        const colorInput = document.getElementById('evento-color');
        if (colorInput) {
            colorInput.value = colorEvento;
            // Si el evento tenía color propio (diferente del de la categoría), marcar que fue modificado manualmente
            // Solo si el color del evento es diferente al de la categoría predominante, es que fue modificado manualmente
            if (evento.color) {
                const catPredObj = categoriaPredominanteObj || 
                                  categorias.find(c => c._id === categoriaPredominanteId);
                const colorCategoria = catPredObj?.color || null;
                // Si el color del evento es diferente al de la categoría, fue modificado manualmente
                if (colorCategoria && evento.color !== colorCategoria) {
                    colorInput.dataset.manualChange = 'true';
                } else {
                    // Si coincide con la categoría, permitir cambios automáticos
                    colorInput.dataset.manualChange = 'false';
                }
            } else {
                // Si no tenía color, no marcar como manual para permitir cambios automáticos
                colorInput.dataset.manualChange = 'false';
            }
        }
        
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
