// Script de migración para agregar el campo 'color' a eventos existentes
// Ejecutar con: node migracion-color-eventos.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Evento from './models/EventoModel.js';

dotenv.config();

// Colores por defecto según el tipo de evento
const coloresPorTipo = {
    'recital': '#ff6b6b',      // Rojo claro
    'evento_cultural': '#4ecdc4', // Turquesa
    'taller': '#ffe66d'         // Amarillo claro
};

async function migrarEventos() {
    try {
        console.log('🔌 Conectando a la base de datos...');
        
        // Conectar a MongoDB
        const urldb = process.env.URI_DB;
        if (!urldb) {
            console.error('❌ Error: URI_DB no está definida en el archivo .env');
            process.exit(1);
        }
        
        await mongoose.connect(urldb);
        console.log('✅ Conectado a la base de datos');
        
        // Buscar eventos sin el campo color
        const eventosSinColor = await Evento.find({ 
            $or: [
                { color: { $exists: false } },
                { color: null },
                { color: '' }
            ]
        });
        
        console.log(`\n📊 Encontrados ${eventosSinColor.length} eventos sin color`);
        
        if (eventosSinColor.length === 0) {
            console.log('✅ Todos los eventos ya tienen el campo color');
            await mongoose.disconnect();
            return;
        }
        
        // Actualizar cada evento
        let actualizados = 0;
        
        for (const evento of eventosSinColor) {
            const colorPorDefecto = coloresPorTipo[evento.tipo] || '#007bff';
            
            await Evento.findByIdAndUpdate(
                evento._id,
                { $set: { color: colorPorDefecto } }
            );
            
            actualizados++;
            console.log(`  ✓ Actualizado: "${evento.titulo}" → Color: ${colorPorDefecto}`);
        }
        
        console.log(`\n✅ Migración completada: ${actualizados} eventos actualizados`);
        
        // Verificar resultado
        const totalEventos = await Evento.countDocuments();
        const eventosConColor = await Evento.countDocuments({ 
            color: { $exists: true, $ne: null, $ne: '' } 
        });
        
        console.log(`\n📈 Estadísticas:`);
        console.log(`   - Total de eventos: ${totalEventos}`);
        console.log(`   - Eventos con color: ${eventosConColor}`);
        console.log(`   - Eventos sin color: ${totalEventos - eventosConColor}`);
        
        await mongoose.disconnect();
        console.log('\n✅ Desconectado de la base de datos');
        console.log('✨ ¡Migración completada exitosamente!');
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

// Ejecutar migración
migrarEventos();

