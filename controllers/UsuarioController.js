import Usuario from '../models/UsuarioModel.js';

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

        const usuario = new Usuario({ nombre, email, password });
        const data = await usuario.save();
        
        // No enviamos la contraseña en la respuesta
        const usuarioRespuesta = data.toObject();
        delete usuarioRespuesta.password;
        
        response.status(201).json({ 
            msg: "Usuario creado exitosamente", 
            data: usuarioRespuesta 
        });
    } catch (error) {
        if (error.code === 11000) {
            response.status(400).json({ msg: 'El email ya está registrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Listar todos los usuarios
const listarUsuarios = async (request, response) => {
    try {
        const usuarios = await Usuario.find({}, { password: 0 });
        response.status(200).json({
            msg: 'Usuarios obtenidos exitosamente',
            data: usuarios,
            total: usuarios.length
        });
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const usuario = await Usuario.findById(id, { password: 0 });
        
        if (usuario) {
            response.status(200).json({ 
                msg: 'Usuario encontrado',
                data: usuario 
            });
        } else {
            response.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Eliminar usuario por ID
const eliminarUsuarioPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const usuario = await Usuario.findByIdAndDelete(id);
        
        if (usuario) {
            response.status(200).json({ msg: 'Usuario eliminado exitosamente' });
        } else {
            response.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
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

        const usuario = await Usuario.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, select: '-password' }
        );
        
        if (usuario) {
            response.status(200).json({ 
                msg: 'Usuario actualizado exitosamente',
                data: usuario 
            });
        } else {
            response.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        if (error.code === 11000) {
            response.status(400).json({ msg: 'El email ya está registrado' });
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