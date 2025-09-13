import Evento from '../models/EventoModel.js';
import Categoria from '../models/CategoriaModel.js';

// Crear nuevo evento
const crearEvento = async (request, response) => {
    try {
        const eventoData = request.body;
        
        // Validar que la categoría existe
        const categoria = await Categoria.findById(eventoData.categoria);
        if (!categoria) {
            return response.status(400).json({ 
                msg: 'La categoría especificada no existe' 
            });
        }

        const evento = new Evento(eventoData);
        const data = await evento.save();
        
        // Poblar la categoría en la respuesta
        await data.populate('categoria', 'nombre descripcion icono color');
        
        response.status(201).json({ 
            msg: "Evento creado exitosamente", 
            data 
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
        if (fecha_desde || fecha_hasta) {
            filtros.fecha = {};
            if (fecha_desde) filtros.fecha.$gte = new Date(fecha_desde);
            if (fecha_hasta) filtros.fecha.$lte = new Date(fecha_hasta);
        }

        // Búsqueda por texto en título o descripción (q)
        if (q && typeof q === 'string') {
            const regex = new RegExp(q.trim(), 'i');
            filtros.$or = [
                { titulo: regex },
                { descripcion: regex },
                { tipo: regex }
            ];
        }

        const eventos = await Evento.find(filtros)
            .populate('categoria', 'nombre descripcion icono color')
            .sort({ fecha: 1 });

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
        const evento = await Evento.findById(id)
            .populate('categoria', 'nombre descripcion icono color');
        
        if (evento) {
            response.status(200).json({ 
                msg: 'Evento encontrado',
                data: evento 
            });
        } else {
            response.status(404).json({ msg: 'Evento no encontrado' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Eliminar evento por ID
const eliminarEventoPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const evento = await Evento.findByIdAndDelete(id);
        
        if (evento) {
            response.status(200).json({ msg: 'Evento eliminado exitosamente' });
        } else {
            response.status(404).json({ msg: 'Evento no encontrado' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
    }
};

// Actualizar evento por ID
const actualizarEventoPorId = async (request, response) => {
    try {
        const id = request.params.id;
        const updateData = request.body;
        
        // Si se actualiza la categoría, validar que existe
        if (updateData.categoria) {
            const categoria = await Categoria.findById(updateData.categoria);
            if (!categoria) {
                return response.status(400).json({ 
                    msg: 'La categoría especificada no existe' 
                });
            }
        }

        const evento = await Evento.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('categoria', 'nombre descripcion icono color');
        
        if (evento) {
            response.status(200).json({ 
                msg: 'Evento actualizado exitosamente',
                data: evento 
            });
        } else {
            response.status(404).json({ msg: 'Evento no encontrado' });
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error del servidor', error: error.message });
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

        const eventos = await Evento.find({
            'ubicacion.coordenadas.lat': {
                $gte: parseFloat(lat) - (radio / 111000), // Aproximación: 1 grado ≈ 111km
                $lte: parseFloat(lat) + (radio / 111000)
            },
            'ubicacion.coordenadas.lng': {
                $gte: parseFloat(lng) - (radio / (111000 * Math.cos(parseFloat(lat) * Math.PI / 180))),
                $lte: parseFloat(lng) + (radio / (111000 * Math.cos(parseFloat(lat) * Math.PI / 180)))
            },
            activo: true
        }).populate('categoria', 'nombre descripcion icono color');

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
