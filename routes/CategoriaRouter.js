import express from 'express';
import { 
    crearCategoria, 
    listarCategorias, 
    obtenerCategoriaPorId, 
    eliminarCategoriaPorId, 
    actualizarCategoriaPorId 
} from '../controllers/CategoriaController.js';

const router = express.Router();

// Definimos las rutas de Categorías para eventos culturales
router.get('/', listarCategorias);
router.get('/:id', obtenerCategoriaPorId);
router.post('/', crearCategoria);
router.delete('/:id', eliminarCategoriaPorId);
router.put('/:id', actualizarCategoriaPorId);

export default router;
