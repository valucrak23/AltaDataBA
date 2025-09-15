import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Esquema para usuarios de eventos culturales
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const users = mongoose.model('users', usuarioSchema);

export default users;