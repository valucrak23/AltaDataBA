import express from 'express';
import supabase from './config/supabase.js';
import dotenv from 'dotenv'
import routerAPI from './routes/index.js';

dotenv.config();

// Debug: mostramos las variables cargadas
console.log('Variables de entorno cargadas:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('PORT:', process.env.PORT);

// Verificamos que las variables de entorno estén definidas
if (!process.env.SUPABASE_URL) {
    console.error('Error: SUPABASE_URL no está definida en el archivo .env');
    process.exit(1);
}

if (!process.env.SUPABASE_ANON_KEY) {
    console.error('Error: SUPABASE_ANON_KEY no está definida en el archivo .env');
    process.exit(1);
}

if (!process.env.PORT) {
    console.error('Error: PORT no está definido en el archivo .env');
    process.exit(1);
}

// Verificar conexión con Supabase
try {
    const { data, error } = await supabase.from('api_usuarios').select('count').limit(1);
    if (error) {
        console.error('Error de conexión con Supabase:', error.message);
    } else {
        console.log('Conexión con Supabase exitosa 👍');
    }
} catch (error) {
    console.error('Error al verificar conexión con Supabase:', error.message);
}

const PORT = process.env.PORT;
const app = express();

app.use( express.json() );

// Servir archivos estáticos desde la raíz
app.use(express.static('public'));

// Ruta principal para mostrar información de la API
app.get('/api-info', (request, response) => {
    response.send(`
        <h1>🎭 API de Eventos Culturales Buenos Aires</h1>
        <p>API REST para eventos culturales, recitales y talleres en Buenos Aires</p>
        <h2>Endpoints disponibles:</h2>
        <ul>
            <li><strong>Usuarios:</strong> /api/usuarios</li>
            <li><strong>Eventos:</strong> /api/eventos</li>
            <li><strong>Categorías:</strong> /api/categorias</li>
        </ul>
        <h2>Tipos de eventos:</h2>
        <ul>
            <li>🎵 Recitales</li>
            <li>🎨 Eventos Culturales</li>
            <li>📚 Talleres</li>
        </ul>
        <h2>Interfaz Web:</h2>
        <p><a href="/">Ver interfaz web</a></p>
    `);
});

// Ruta raíz para servir el index.html
app.get('/', (request, response) => {
    response.sendFile('index.html', { root: 'public' });
});

routerAPI(app);

app.listen( PORT, () => {
    console.log(`API Rest en el puerto ${PORT}`);
})