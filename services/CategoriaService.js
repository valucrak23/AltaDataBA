import supabase from '../config/supabase.js';

// Utilidades para manejo de categorías en Supabase
export const CategoriaService = {
    // Crear nueva categoría
    async crear(data) {
        const { data: categoria, error } = await supabase
            .from('api_categorias')
            .insert([data])
            .select()
            .single();
        
        if (error) throw error;
        return categoria;
    },

    // Obtener todas las categorías
    async listar(filtros = {}) {
        let query = supabase.from('categorias').select('*');
        
        // Aplicar filtros
        if (filtros.activa !== undefined) {
            query = query.eq('activa', filtros.activa);
        }
        
        const { data: categorias, error } = await query.order('nombre');
        
        if (error) throw error;
        return categorias;
    },

    // Obtener categoría por ID
    async obtenerPorId(id) {
        const { data: categoria, error } = await supabase
            .from('api_categorias')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return categoria;
    },

    // Actualizar categoría por ID
    async actualizarPorId(id, datos) {
        const { data: categoria, error } = await supabase
            .from('api_categorias')
            .update(datos)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return categoria;
    },

    // Eliminar categoría por ID
    async eliminarPorId(id) {
        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }
};
