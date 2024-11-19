const Joi = require('joi');

module.exports = {
    nuevoColaborador: function(data) {
        const schema = Joi.object({
            nombre: Joi.string().max(50).required(),
            apellido_paterno: Joi.string().max(50).required(),
            apellido_materno: Joi.string().max(50).required(),
            puesto: Joi.string().max(100).required(),
            email: Joi.string().email().required(),
            telefono: Joi.string().regex(/^\d{10}$/).required(),
            fecha_ingreso: Joi.date().default(() => new Date()) // Quita el segundo argumento
        });

        const validate = schema.validate(data);
        return validate;
    }
};
