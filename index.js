import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import routerAPI from './routes/index.js';

dotenv.config();

// Debug: mostramos las variables cargadas
console.log('Variables de entorno cargadas:');
console.log('URI_DB:', process.env.URI_DB);
console.log('PORT:', process.env.PORT);

// Verificamos que las variables de entorno estén definidas
if (!process.env.URI_DB) {
    console.error('Error: URI_DB no está definida en el archivo .env');
    process.exit(1);
}

if (!process.env.PORT) {
    console.error('Error: PORT no está definido en el archivo .env');
    process.exit(1);
}

// Creamos la conexión con la Base de Datos
const urldb = process.env.URI_DB;
mongoose.connect(urldb);
const db = mongoose.connection;

db.on('error', () => { console.error('Error de conexion')});
db.once('open', () => { console.log('Conexion con al DB 👍')});

const PORT = process.env.PORT;
const app = express();

app.use( express.json() );

app.use('/', express.static('public'));


app.get('/', (request, response) => {
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
    `);
})

routerAPI(app);

app.listen( PORT, () => {
    console.log(`API Rest en el puerto ${PORT}`);
})