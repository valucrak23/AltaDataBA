import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event, context) => {
    const path = event.path.replace('/api', '');
    
    try {
        switch (path) {
            case '/eventos':
                if (event.httpMethod === 'GET') {
                    const { data, error } = await supabase
                        .from('api_eventos')
                        .select(`
                            *,
                            categoria:api_categorias(*)
                        `)
                        .order('fecha');
                    
                    if (error) throw error;
                    
                    return {
                        statusCode: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            msg: 'Eventos obtenidos exitosamente',
                            data: data || [],
                            total: data?.length || 0
                        })
                    };
                }
                break;
                
            case '/categorias':
                if (event.httpMethod === 'GET') {
                    const { data, error } = await supabase
                        .from('api_categorias')
                        .select('*')
                        .eq('activa', true)
                        .order('nombre');
                    
                    if (error) throw error;
                    
                    return {
                        statusCode: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            msg: 'Categorías obtenidas exitosamente',
                            data: data || [],
                            total: data?.length || 0
                        })
                    };
                }
                break;
                
            case '/usuarios':
                if (event.httpMethod === 'GET') {
                    const { data, error } = await supabase
                        .from('api_usuarios')
                        .select('*')
                        .order('nombre');
                    
                    if (error) throw error;
                    
                    // Remover contraseñas
                    const usuariosSinPassword = (data || []).map(usuario => {
                        const { password, ...usuarioSinPassword } = usuario;
                        return usuarioSinPassword;
                    });
                    
                    return {
                        statusCode: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            msg: 'Usuarios obtenidos exitosamente',
                            data: usuariosSinPassword,
                            total: usuariosSinPassword.length
                        })
                    };
                }
                break;
                
            default:
                return {
                    statusCode: 404,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ msg: 'Endpoint no encontrado' })
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg: 'Error del servidor', error: error.message })
        };
    }
};
