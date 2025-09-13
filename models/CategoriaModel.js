import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Esquema para categorías de eventos culturales
const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    icono: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#007bff'
    },
    activa: {
        type: Boolean,
        default: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
