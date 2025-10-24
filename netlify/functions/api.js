export const handler = async (event, context) => {
    // Headers para CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Manejar OPTIONS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Importar Supabase dinámicamente
        const { createClient } = await import('@supabase/supabase-js');
        
        // Crear cliente Supabase con variables de entorno (con fallback)
        const supabase = createClient(
            process.env.SUPABASE_URL || 'https://mfsamlqnjrlajbeqylou.supabase.co',
            process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mc2FtbHFuanJsYWpiZXF5bG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzM1OTcsImV4cCI6MjA3NjY0OTU5N30.L78Y3j4Gm1DoVpS8e8JCQAUSF4RbN7PrcIsXrzs6Wuc'
        );

        const path = event.path.replace('/api', '');
        
        if (path === '/eventos' && event.httpMethod === 'GET') {
            const { data, error } = await supabase
                .from('api_eventos')
                .select('*')
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
        
        if (path === '/categorias' && event.httpMethod === 'GET') {
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
        
        if (path === '/usuarios' && event.httpMethod === 'GET') {
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
        
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ msg: 'Endpoint no encontrado' })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                msg: 'Error del servidor', 
                error: error.message 
            })
        };
    }
};