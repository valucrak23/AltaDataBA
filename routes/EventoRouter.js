import express from 'express';
import { 
    crearEvento, 
    listarEventos, 
    obtenerEventoPorId, 
    eliminarEventoPorId, 
    actualizarEventoPorId,
    buscarEventosPorUbicacion
} from '../controllers/EventoController.js';

const router = express.Router();

// Definimos las rutas de Eventos culturales
router.get('/', listarEventos);
router.get('/ubicacion', buscarEventosPorUbicacion);
router.get('/:id', obtenerEventoPorId);
router.post('/', crearEvento);
router.delete('/:id', eliminarEventoPorId);
router.put('/:id', actualizarEventoPorId);

export default router;
