import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Esquema para eventos culturales en Buenos Aires
const eventoSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['recital', 'evento_cultural', 'taller'],
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    ubicacion: {
        nombre: {
            type: String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        },
        coordenadas: {
            lat: Number,
            lng: Number
        }
    },
    precio: {
        esGratuito: {
            type: Boolean,
            default: false
        },
        monto: {
            type: Number,
            min: 0
        },
        moneda: {
            type: String,
            default: 'ARS'
        }
    },
    informacionAdicional: {
        alojamiento: String,
        comoLlegar: String,
        recomendaciones: [String],
        contacto: String,
        capacidad: Number
    },
    imagen: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#007bff'
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Eventos = mongoose.model('Eventos', eventoSchema);

export default Eventos;
