import supabase from '../config/supabase.js';

// Utilidades para manejo de eventos en Supabase
export const EventoService = {
    // Crear nuevo evento
    async crear(data) {
        const { data: evento, error } = await supabase
            .from('api_eventos')
            .insert([data])
            .select(`
                *,
                categoria:api_categorias(*)
            `)
            .single();
        
        if (error) throw error;
        return evento;
    },

    // Obtener todos los eventos con filtros opcionales
    async listar(filtros = {}) {
        let query = supabase.from('api_eventos').select(`
            *,
            categoria:api_categorias(*)
        `);
        
        // Aplicar filtros
        if (filtros.tipo) {
            query = query.eq('tipo', filtros.tipo);
        }
        if (filtros.categoria) {
            query = query.eq('categoria_id', filtros.categoria);
        }
        if (filtros.activo !== undefined) {
            query = query.eq('activo', filtros.activo);
        }
        if (filtros.fecha_desde) {
            query = query.gte('fecha', filtros.fecha_desde);
        }
        if (filtros.fecha_hasta) {
            query = query.lte('fecha', filtros.fecha_hasta);
        }
        if (filtros.titulo) {
            query = query.ilike('titulo', `%${filtros.titulo}%`);
        }
        
        const { data: eventos, error } = await query.order('fecha');
        
        if (error) throw error;
        return eventos;
    },

    // Obtener evento por ID
    async obtenerPorId(id) {
        const { data: evento, error } = await supabase
            .from('api_eventos')
            .select(`
                *,
                categoria:api_categorias(*)
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return evento;
    },

    // Actualizar evento por ID
    async actualizarPorId(id, datos) {
        const { data: evento, error } = await supabase
            .from('api_eventos')
            .update(datos)
            .eq('id', id)
            .select(`
                *,
                categoria:api_categorias(*)
            `)
            .single();
        
        if (error) throw error;
        return evento;
    },

    // Eliminar evento por ID
    async eliminarPorId(id) {
        const { error } = await supabase
            .from('api_eventos')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    // Buscar eventos por ubicación (usando PostGIS si está disponible)
    async buscarPorUbicacion(lat, lng, radio = 5000) {
        // Nota: Esta implementación es básica. Para mejor precisión geográfica,
        // se recomienda usar PostGIS con funciones como ST_DWithin
        const { data: eventos, error } = await supabase
            .from('api_eventos')
            .select(`
                *,
                categoria:api_categorias(*)
            `)
            .eq('activo', true);
        
        if (error) throw error;
        
        // Filtrar por distancia (implementación básica)
        const eventosFiltrados = eventos.filter(evento => {
            if (!evento.ubicacion?.coordenadas?.lat || !evento.ubicacion?.coordenadas?.lng) {
                return false;
            }
            
            const distancia = calcularDistancia(
                lat, lng,
                evento.ubicacion.coordenadas.lat,
                evento.ubicacion.coordenadas.lng
            );
            
            return distancia <= radio;
        });
        
        return eventosFiltrados;
    }
};

// Función auxiliar para calcular distancia entre dos puntos
function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
