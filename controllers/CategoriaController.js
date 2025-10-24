import { CategoriaService } from '../services/CategoriaService.js';
import { EventoService } from '../services/EventoService.js';

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

        const categoriaData = { 
            nombre, 
            descripcion, 
            icono: icono || '', 
            color: color || '#007bff',
            activa: true,
            fecha_creacion: new Date().toISOString()
        };
        
        const categoria = await CategoriaService.crear(categoriaData);
        
        response.status(201).json({ 
            msg: "Categoría creada exitosamente", 
            data: categoria 
        });
    } catch (error) {
        if (error.code === '23505') { // Error de duplicado en PostgreSQL
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

        // Búsqueda por nombre
        if (q && typeof q === 'string') {
            filtros.nombre = q.trim();
        }

        const categorias = await CategoriaService.listar(filtros);

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
        const categoria = await CategoriaService.obtenerPorId(id);
        
        if (categoria) {
            response.status(200).json({ 
                msg: 'Categoría encontrada',
                data: categoria 
            });
        } else {
            response.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Categoría no encontrada' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Eliminar categoría por ID
const eliminarCategoriaPorId = async (request, response) => {
    try {
        const id = request.params.id;
        
        // Verificar si hay eventos asociados a esta categoría
        const eventos = await EventoService.listar({ categoria: id });
        if (eventos.length > 0) {
            return response.status(400).json({ 
                msg: `No se puede eliminar la categoría porque tiene ${eventos.length} eventos asociados` 
            });
        }

        await CategoriaService.eliminarPorId(id);
        
        response.status(200).json({ msg: 'Categoría eliminada exitosamente' });
    } catch (error) {
        if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Categoría no encontrada' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
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

        const categoria = await CategoriaService.actualizarPorId(id, updateData);
        
        if (categoria) {
            response.status(200).json({ 
                msg: 'Categoría actualizada exitosamente',
                data: categoria 
            });
        } else {
            response.status(404).json({ msg: 'Categoría no encontrada' });
        }
    } catch (error) {
        if (error.code === '23505') { // Error de duplicado en PostgreSQL
            response.status(400).json({ msg: 'Ya existe una categoría con ese nombre' });
        } else if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Categoría no encontrada' });
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
