import { UsuarioService } from '../services/UsuarioService.js';

// Crear nuevo usuario
const crearUsuario = async (request, response) => {
    try {
        const { nombre, email, password } = request.body;
        
        // Validaciones básicas
        if (!nombre || !email || !password) {
            return response.status(400).json({ 
                msg: 'Faltan campos requeridos: nombre, email, password' 
            });
        }

        if (password.length < 6) {
            return response.status(400).json({ 
                msg: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        const usuarioData = { 
            nombre, 
            email, 
            password,
            fecha_registro: new Date().toISOString()
        };
        
        const usuario = await UsuarioService.crear(usuarioData);
        
        // No enviamos la contraseña en la respuesta
        const usuarioRespuesta = { ...usuario };
        delete usuarioRespuesta.password;
        
        response.status(201).json({ 
            msg: "Usuario creado exitosamente", 
            data: usuarioRespuesta 
        });
    } catch (error) {
        if (error.code === '23505') { // Error de duplicado en PostgreSQL
            response.status(400).json({ msg: 'El email ya está registrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Listar todos los usuarios
const listarUsuarios = async (request, response) => {
    try {
        const { q } = request.query;
        
        let filtros = {};
        
        // Búsqueda por nombre
        if (q && typeof q === 'string') {
            filtros.nombre = q.trim();
        }

        const usuarios = await UsuarioService.listar(filtros);
        
        // Remover contraseñas de la respuesta
        const usuariosSinPassword = usuarios.map(usuario => {
            const { password, ...usuarioSinPassword } = usuario;
            return usuarioSinPassword;
        });
        
        response.status(200).json({
            msg: 'Usuarios obtenidos exitosamente',
            data: usuariosSinPassword,
            total: usuariosSinPassword.length,
            filtros_aplicados: filtros
        });
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const usuario = await UsuarioService.obtenerPorId(id);
        
        if (usuario) {
            // No enviamos la contraseña en la respuesta
            const { password, ...usuarioSinPassword } = usuario;
            
            response.status(200).json({ 
                msg: 'Usuario encontrado',
                data: usuarioSinPassword 
            });
        } else {
            response.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Usuario no encontrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Eliminar usuario por ID
const eliminarUsuarioPorId = async (request, response) => {
    try {
        const id = request.params.id;
        await UsuarioService.eliminarPorId(id);
        
        response.status(200).json({ msg: 'Usuario eliminado exitosamente' });
    } catch (error) {
        if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Usuario no encontrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Actualizar usuario por ID
const actualizarUsuarioPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const { nombre, email, password } = request.body;
        
        const updateData = {};
        if (nombre) updateData.nombre = nombre;
        if (email) updateData.email = email;
        if (password) {
            if (password.length < 6) {
                return response.status(400).json({ 
                    msg: 'La contraseña debe tener al menos 6 caracteres' 
                });
            }
            updateData.password = password;
        }

        const usuario = await UsuarioService.actualizarPorId(id, updateData);
        
        if (usuario) {
            // No enviamos la contraseña en la respuesta
            const { password, ...usuarioSinPassword } = usuario;
            
            response.status(200).json({ 
                msg: 'Usuario actualizado exitosamente',
                data: usuarioSinPassword 
            });
        } else {
            response.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        if (error.code === '23505') { // Error de duplicado en PostgreSQL
            response.status(400).json({ msg: 'El email ya está registrado' });
        } else if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Usuario no encontrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

export { 
    crearUsuario, 
    listarUsuarios, 
    obtenerUsuarioPorId, 
    eliminarUsuarioPorId, 
    actualizarUsuarioPorId 
};