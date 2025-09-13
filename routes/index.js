import usuarioRouter from './UsuarioRouter.js';
import eventoRouter from './EventoRouter.js';
import categoriaRouter from './CategoriaRouter.js';

const routerAPI = (app) => {
    // Rutas para usuarios de eventos culturales
    app.use('/api/usuarios', usuarioRouter);
    
    // Rutas para eventos culturales
    app.use('/api/eventos', eventoRouter);
    
    // Rutas para categorías de eventos
    app.use('/api/categorias', categoriaRouter);
}

export default routerAPI;