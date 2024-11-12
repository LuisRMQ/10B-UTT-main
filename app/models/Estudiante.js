const mongoose = require('mongoose');

module.exports = mongoose.model('Estudiante', new mongoose.Schema({
    nombre: String,
    apellido_paterno: String,
    apellido_materno: String,
    matricula: String,
    curp: String
}), 'Estudiantes');