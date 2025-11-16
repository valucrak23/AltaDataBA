import express from 'express';
import mongoose from 'mongoose';
import Evento from '../models/EventoModel.js';

const router = express.Router();

// Colores por defecto según el tipo de evento
const coloresPorTipo = {
    'recital': '#ff6b6b',      // Rojo claro
    'evento_cultural': '#4ecdc4', // Turquesa
    'taller': '#ffe66d'         // Amarillo claro
};

// Endpoint para ejecutar la migración de colores
// GET /api/migracion/color-eventos
router.get('/color-eventos', async (request, response) => {
    try {
        // Verificar conexión a la BD
        if (mongoose.connection.readyState !== 1) {
            return response.status(500).json({ 
                msg: 'No hay conexión a la base de datos',
                error: 'Database not connected'
            });
        }

        console.log('🔌 Iniciando migración de colores...');
        
        // Buscar eventos sin el campo color
        const eventosSinColor = await Evento.find({ 
            $or: [
                { color: { $exists: false } },
                { color: null },
                { color: '' }
            ]
        });
        
        console.log(`📊 Encontrados ${eventosSinColor.length} eventos sin color`);
        
        if (eventosSinColor.length === 0) {
            return response.status(200).json({ 
                msg: '✅ Todos los eventos ya tienen el campo color',
                eventosActualizados: 0,
                totalEventos: await Evento.countDocuments(),
                eventosConColor: await Evento.countDocuments({ 
                    color: { $exists: true, $ne: null, $ne: '' } 
                })
            });
        }
        
        // Actualizar cada evento
        let actualizados = 0;
        const eventosActualizados = [];
        
        for (const evento of eventosSinColor) {
            const colorPorDefecto = coloresPorTipo[evento.tipo] || '#007bff';
            
            await Evento.findByIdAndUpdate(
                evento._id,
                { $set: { color: colorPorDefecto } }
            );
            
            actualizados++;
            eventosActualizados.push({
                id: evento._id,
                titulo: evento.titulo,
                tipo: evento.tipo,
                color: colorPorDefecto
            });
            
            console.log(`  ✓ Actualizado: "${evento.titulo}" → Color: ${colorPorDefecto}`);
        }
        
        console.log(`✅ Migración completada: ${actualizados} eventos actualizados`);
        
        // Verificar resultado
        const totalEventos = await Evento.countDocuments();
        const eventosConColor = await Evento.countDocuments({ 
            color: { $exists: true, $ne: null, $ne: '' } 
        });
        
        response.status(200).json({
            msg: `✅ Migración completada exitosamente`,
            eventosActualizados: actualizados,
            eventosActualizadosList: eventosActualizados,
            estadisticas: {
                totalEventos: totalEventos,
                eventosConColor: eventosConColor,
                eventosSinColor: totalEventos - eventosConColor
            }
        });
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        response.status(500).json({ 
            msg: 'Error durante la migración',
            error: error.message 
        });
    }
});

export default router;

