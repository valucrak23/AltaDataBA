import supabase from '../config/supabase.js';

// Utilidades para manejo de usuarios en Supabase
export const UsuarioService = {
    // Crear nuevo usuario
    async crear(data) {
        const { data: usuario, error } = await supabase
            .from('api_usuarios')
            .insert([data])
            .select()
            .single();
        
        if (error) throw error;
        return usuario;
    },

    // Obtener todos los usuarios con filtros opcionales
    async listar(filtros = {}) {
        let query = supabase.from('api_usuarios').select('*');
        
        // Aplicar filtros
        if (filtros.nombre) {
            query = query.ilike('nombre', `%${filtros.nombre}%`);
        }
        
        const { data: usuarios, error } = await query.order('nombre');
        
        if (error) throw error;
        return usuarios;
    },

    // Obtener usuario por ID
    async obtenerPorId(id) {
        const { data: usuario, error } = await supabase
            .from('api_usuarios')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return usuario;
    },

    // Actualizar usuario por ID
    async actualizarPorId(id, datos) {
        const { data: usuario, error } = await supabase
            .from('api_usuarios')
            .update(datos)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return usuario;
    },

    // Eliminar usuario por ID
    async eliminarPorId(id) {
        const { error } = await supabase
            .from('api_usuarios')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    // Buscar usuario por email
    async buscarPorEmail(email) {
        const { data: usuario, error } = await supabase
            .from('api_usuarios')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error) throw error;
        return usuario;
    }
};
