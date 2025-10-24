import { createClient } from '@supabase/supabase-js';

export const handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Manejar preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Verificar variables de entorno
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
            throw new Error('Variables de entorno de Supabase no configuradas');
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        const path = event.path.replace('/api', '');
        
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
                        headers,
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
                        headers,
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
                        headers,
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
                    headers,
                    body: JSON.stringify({ msg: 'Endpoint no encontrado' })
                };
        }
        
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ msg: 'Método no permitido' })
        };
        
    } catch (error) {
        console.error('Error en función API:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                msg: 'Error del servidor', 
                error: error.message,
                debug: {
                    hasSupabaseUrl: !!process.env.SUPABASE_URL,
                    hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
                    path: event.path
                }
            })
        };
    }
};
