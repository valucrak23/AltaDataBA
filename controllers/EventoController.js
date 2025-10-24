import { EventoService } from '../services/EventoService.js';
import { CategoriaService } from '../services/CategoriaService.js';

// Crear nuevo evento
const crearEvento = async (request, response) => {
    try {
        const eventoData = request.body;
        
        // Validar que la categoría existe
        try {
            await CategoriaService.obtenerPorId(eventoData.categoria_id);
        } catch (error) {
            if (error.code === 'PGRST116') {
                return response.status(400).json({ 
                    msg: 'La categoría especificada no existe' 
                });
            }
            throw error;
        }

        // Preparar datos para Supabase
        const eventoParaSupabase = {
            ...eventoData,
            categoria_id: eventoData.categoria_id,
            fecha_creacion: new Date().toISOString()
        };

        const evento = await EventoService.crear(eventoParaSupabase);
        
        response.status(201).json({ 
            msg: "Evento creado exitosamente", 
            data: evento 
        });
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Listar todos los eventos
const listarEventos = async (request, response) => {
    try {
        const { tipo, categoria, activo, fecha_desde, fecha_hasta, q } = request.query;
        
        let filtros = {};
        
        if (tipo) filtros.tipo = tipo;
        if (categoria) filtros.categoria = categoria;
        
        // Por defecto mostrar solo eventos activos si no se especifica
        if (activo === undefined) {
            filtros.activo = true;
        } else {
            filtros.activo = activo === 'true';
        }
        
        // Filtros de fecha
        if (fecha_desde) filtros.fecha_desde = fecha_desde;
        if (fecha_hasta) filtros.fecha_hasta = fecha_hasta;

        // Búsqueda por título (q)
        if (q && typeof q === 'string') {
            filtros.titulo = q.trim();
        }

        const eventos = await EventoService.listar(filtros);

        response.status(200).json({
            msg: 'Eventos obtenidos exitosamente',
            data: eventos,
            total: eventos.length,
            filtros_aplicados: filtros
        });
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Obtener evento por ID
const obtenerEventoPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const evento = await EventoService.obtenerPorId(id);
        
        if (evento) {
            response.status(200).json({ 
                msg: 'Evento encontrado',
                data: evento 
            });
        } else {
            response.status(404).json({ msg: 'Evento no encontrado' });
        }
    } catch (error) {
        if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Evento no encontrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Eliminar evento por ID
const eliminarEventoPorId = async (request, response) => {
    try {
        const id = request.params.id;
        console.log('Intentando eliminar evento con ID:', id); // Debug temporal
        
        await EventoService.eliminarPorId(id);
        
        response.status(200).json({ msg: 'Evento eliminado exitosamente' });
    } catch (error) {
        console.log('Error en eliminación:', error.message); // Debug temporal
        if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Evento no encontrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Actualizar evento por ID
const actualizarEventoPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const updateData = request.body;
        
        // Si se actualiza la categoría, validar que existe
        if (updateData.categoria_id) {
            try {
                await CategoriaService.obtenerPorId(updateData.categoria_id);
            } catch (error) {
                if (error.code === 'PGRST116') {
                    return response.status(400).json({ 
                        msg: 'La categoría especificada no existe' 
                    });
                }
                throw error;
            }
        }

        const evento = await EventoService.actualizarPorId(id, updateData);
        
        if (evento) {
            response.status(200).json({ 
                msg: 'Evento actualizado exitosamente',
                data: evento 
            });
        } else {
            response.status(404).json({ msg: 'Evento no encontrado' });
        }
    } catch (error) {
        if (error.code === 'PGRST116') { // No encontrado en Supabase
            response.status(404).json({ msg: 'Evento no encontrado' });
        } else {
            response.status(500).json({ msg: 'Error del servidor', error: error.message });
        }
    }
};

// Buscar eventos por ubicación (para integración con Google Maps)
const buscarEventosPorUbicacion = async (request, response) => {
    try {
        const { lat, lng, radio = 5000 } = request.query; // radio en metros
        
        if (!lat || !lng) {
            return response.status(400).json({ 
                msg: 'Se requieren coordenadas de latitud y longitud' 
            });
        }

        const eventos = await EventoService.buscarPorUbicacion(
            parseFloat(lat), 
            parseFloat(lng), 
            parseInt(radio)
        );

        response.status(200).json({
            msg: 'Eventos encontrados por ubicación',
            data: eventos,
            total: eventos.length,
            ubicacion_busqueda: { lat: parseFloat(lat), lng: parseFloat(lng), radio }
        });
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

export { 
    crearEvento, 
    listarEventos, 
    obtenerEventoPorId, 
    eliminarEventoPorId, 
    actualizarEventoPorId,
    buscarEventosPorUbicacion
};
