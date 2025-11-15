import express from 'express';
import { 
    crearUsuario, 
    listarUsuarios, 
    obtenerUsuarioPorId, 
    eliminarUsuarioPorId, 
    actualizarUsuarioPorId,
    autenticarUsuario 
} from '../controllers/UsuarioController.js';

const router = express.Router();

// Definimos las rutas de Usuario para eventos culturales
router.post('/auth', autenticarUsuario);
router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/', crearUsuario);
router.delete('/:id', eliminarUsuarioPorId);
router.put('/:id', actualizarUsuarioPorId);

export default router;