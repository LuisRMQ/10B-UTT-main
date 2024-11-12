const mongoose = require('mongoose');

module.exports = mongoose.model('Colaborador', new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido_paterno: {
        type: String,
        required: true
    },
    apellido_materno: {
        type: String,
        required: true
    },
    puesto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true
    },
    fecha_ingreso: {
        type: Date,
        default: Date.now
    }
}), 'Colaboradores');
