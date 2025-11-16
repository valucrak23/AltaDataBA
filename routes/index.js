import usuarioRouter from './UsuarioRouter.js';
import eventoRouter from './EventoRouter.js';
import categoriaRouter from './CategoriaRouter.js';
import migracionRouter from './MigracionRouter.js';

const routerAPI = (app) => {
    // Rutas para usuarios de eventos culturales
    app.use('/api/usuarios', usuarioRouter);
    
    // Rutas para eventos culturales
    app.use('/api/eventos', eventoRouter);
    
    // Rutas para categorías de eventos
    app.use('/api/categorias', categoriaRouter);
    
    // Rutas para migraciones (temporal)
    app.use('/api/migracion', migracionRouter);
}

export default routerAPI;