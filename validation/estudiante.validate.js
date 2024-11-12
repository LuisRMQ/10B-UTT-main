const Joi = require('joi');

module.exports = {
    nuevoEstudiante: function(data) {
        const schema = Joi.object({
            nombre: Joi.string().max(50).required(),  // Nombre del estudiante
            apellido_paterno: Joi.string().max(50).required(),  // Apellido paterno
            apellido_materno: Joi.string().max(50).optional(),  // Apellido materno (opcional)
            matricula: Joi.string().regex(/^[A-Za-z0-9]{6,10}$/).required(),  // Formato de matrícula (ej. ABC123456)
            curp: Joi.string().regex(/^[A-Z0-9]{18}$/).required(),  // Formato de CURP (18 caracteres)
        });

        const validate = schema.validate(data);
        return validate;
    }
}
