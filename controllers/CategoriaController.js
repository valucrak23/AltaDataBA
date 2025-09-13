import Categoria from '../models/CategoriaModel.js';
import Evento from '../models/EventoModel.js';

// Crear nueva categoría
const crearCategoria = async (request, response) => {
    try {
        const { nombre, descripcion, icono, color } = request.body;
        
        // Validaciones básicas
        if (!nombre || !descripcion) {
            return response.status(400).json({ 
                msg: 'Faltan campos requeridos: nombre, descripcion' 
            });
        }

        const categoria = new Categoria({ nombre, descripcion, icono, color });
        const data = await categoria.save();
        
        response.status(201).json({ 
            msg: "Categoría creada exitosamente", 
            data 
        });
    } catch (error) {
        if (error.code === 11000) {
            response.status(400).json({ msg: 'Ya existe una categoría con ese nombre' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Listar todas las categorías
const listarCategorias = async (request, response) => {
    try {
        const { activa, q } = request.query;
        
        let filtros = {};
        
        // Por defecto mostrar solo categorías activas si no se especifica
        if (activa === undefined) {
            filtros.activa = true;
        } else {
            filtros.activa = activa === 'true';
        }

        // Búsqueda por nombre/descripcion
        if (q && typeof q === 'string') {
            const regex = new RegExp(q.trim(), 'i');
            filtros.$or = [
                { nombre: regex },
                { descripcion: regex }
            ];
        }

        const categorias = await Categoria.find(filtros).sort({ nombre: 1 });

        response.status(200).json({
            msg: 'Categorías obtenidas exitosamente',
            data: categorias,
            total: categorias.length
        });
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Obtener categoría por ID
const obtenerCategoriaPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const categoria = await Categoria.findById(id);
        
        if (categoria) {
            response.status(200).json({ 
                msg: 'Categoría encontrada',
                data: categoria 
            });
        } else {
            response.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Eliminar categoría por ID
const eliminarCategoriaPorId = async (request, response) => {
    try {
        const id = request.params.id;
        
        // Verificar si hay eventos asociados a esta categoría
        const eventosAsociados = await Evento.countDocuments({ categoria: id });
        if (eventosAsociados > 0) {
            return response.status(400).json({ 
                msg: `No se puede eliminar la categoría porque tiene ${eventosAsociados} eventos asociados` 
            });
        }

        const categoria = await Categoria.findByIdAndDelete(id);
        
        if (categoria) {
            response.status(200).json({ msg: 'Categoría eliminada exitosamente' });
        } else {
            response.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Actualizar categoría por ID
const actualizarCategoriaPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const { nombre, descripcion, icono, color, activa } = request.body;
        
        const updateData = {};
        if (nombre) updateData.nombre = nombre;
        if (descripcion) updateData.descripcion = descripcion;
        if (icono !== undefined) updateData.icono = icono;
        if (color) updateData.color = color;
        if (activa !== undefined) updateData.activa = activa;

        const categoria = await Categoria.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );
        
        if (categoria) {
            response.status(200).json({ 
                msg: 'Categoría actualizada exitosamente',
                data: categoria 
            });
        } else {
            response.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        if (error.code === 11000) {
            response.status(400).json({ msg: 'Ya existe una categoría con ese nombre' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

export { 
    crearCategoria, 
    listarCategorias, 
    obtenerCategoriaPorId, 
    eliminarCategoriaPorId, 
    actualizarCategoriaPorId 
};
