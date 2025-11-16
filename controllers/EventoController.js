import Evento from '../models/EventoModel.js';
import Categoria from '../models/CategoriaModel.js';

// Crear nuevo evento
const crearEvento = async (request, response) => {
    try {
        const eventoData = request.body;
        
        // Compatibilidad hacia atrás: si viene 'categoria' en lugar de 'categorias', convertir
        if (eventoData.categoria && !eventoData.categorias) {
            eventoData.categorias = [eventoData.categoria];
            if (!eventoData.categoriaPredominante) {
                eventoData.categoriaPredominante = eventoData.categoria;
            }
        }
        
        // Validar que existe al menos una categoría
        if (!eventoData.categorias || eventoData.categorias.length === 0) {
            return response.status(400).json({ 
                msg: 'Debe especificar al menos una categoría' 
            });
        }
        
        // Validar que existe la categoría predominante
        if (!eventoData.categoriaPredominante) {
            return response.status(400).json({ 
                msg: 'Debe especificar una categoría predominante' 
            });
        }
        
        // Validar que la categoría predominante está en el array de categorías
        if (!eventoData.categorias.includes(eventoData.categoriaPredominante)) {
            return response.status(400).json({ 
                msg: 'La categoría predominante debe estar en el array de categorías' 
            });
        }
        
        // Validar que todas las categorías existen
        const categoriasExistentes = await Categoria.find({
            _id: { $in: eventoData.categorias }
        });
        
        if (categoriasExistentes.length !== eventoData.categorias.length) {
            return response.status(400).json({ 
                msg: 'Una o más categorías especificadas no existen' 
            });
        }

        const evento = new Evento(eventoData);
        const data = await evento.save();
        
        // Poblar las categorías en la respuesta
        await data.populate('categorias', 'nombre descripcion icono color');
        await data.populate('categoriaPredominante', 'nombre descripcion icono color');
        // Mantener compatibilidad hacia atrás
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
        
        // Filtrar por categoría: puede ser por categoría predominante o por cualquiera de las categorías
        if (categoria) {
            filtros.$or = [
                { categoriaPredominante: categoria },
                { categorias: categoria },
                { categoria: categoria } // Compatibilidad hacia atrás
            ];
        }
        
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

        // Búsqueda por título (q)
        if (q && typeof q === 'string') {
            const regex = new RegExp(q.trim(), 'i');
            filtros.titulo = regex;
        }

        const eventos = await Evento.find(filtros)
            .populate('categorias', 'nombre descripcion icono color')
            .populate('categoriaPredominante', 'nombre descripcion icono color')
            .populate('categoria', 'nombre descripcion icono color') // Compatibilidad hacia atrás
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
            .populate('categorias', 'nombre descripcion icono color')
            .populate('categoriaPredominante', 'nombre descripcion icono color')
            .populate('categoria', 'nombre descripcion icono color'); // Compatibilidad hacia atrás
        
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
        
        // Compatibilidad hacia atrás: si viene 'categoria' en lugar de 'categorias', convertir
        if (updateData.categoria && !updateData.categorias) {
            updateData.categorias = [updateData.categoria];
            if (!updateData.categoriaPredominante) {
                updateData.categoriaPredominante = updateData.categoria;
            }
        }
        
        // Si se actualizan las categorías, validar que existen
        if (updateData.categorias) {
            if (updateData.categorias.length === 0) {
                return response.status(400).json({ 
                    msg: 'Debe especificar al menos una categoría' 
                });
            }
            
            const categoriasExistentes = await Categoria.find({
                _id: { $in: updateData.categorias }
            });
            
            if (categoriasExistentes.length !== updateData.categorias.length) {
                return response.status(400).json({ 
                    msg: 'Una o más categorías especificadas no existen' 
                });
            }
            
            // Validar que la categoría predominante está en el array (si se actualiza)
            if (updateData.categoriaPredominante && !updateData.categorias.includes(updateData.categoriaPredominante)) {
                return response.status(400).json({ 
                    msg: 'La categoría predominante debe estar en el array de categorías' 
                });
            }
        }
        
        // Si solo se actualiza la categoría predominante, validar que existe en categorias
        if (updateData.categoriaPredominante && !updateData.categorias) {
            const eventoActual = await Evento.findById(id);
            if (eventoActual) {
                const categoriasActuales = eventoActual.categorias || (eventoActual.categoria ? [eventoActual.categoria] : []);
                if (!categoriasActuales.includes(updateData.categoriaPredominante)) {
                    return response.status(400).json({ 
                        msg: 'La categoría predominante debe estar en el array de categorías del evento' 
                    });
                }
            }
        }

        const evento = await Evento.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        )
        .populate('categorias', 'nombre descripcion icono color')
        .populate('categoriaPredominante', 'nombre descripcion icono color')
        .populate('categoria', 'nombre descripcion icono color'); // Compatibilidad hacia atrás
        
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
        })
        .populate('categorias', 'nombre descripcion icono color')
        .populate('categoriaPredominante', 'nombre descripcion icono color')
        .populate('categoria', 'nombre descripcion icono color'); // Compatibilidad hacia atrás

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
