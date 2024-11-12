const Joi = require('joi');

module.exports = {
    nuevoColaborador: function(data) {
        const schema = Joi.object({
            nombre: Joi.string().max(50).required(),  // Nombre del colaborador
            apellido_paterno: Joi.string().max(50).required(),  // Apellido paterno
            apellido_materno: Joi.string().max(50).required(),  // Apellido materno
            puesto: Joi.string().max(100).required(),  // Puesto del colaborador
            email: Joi.string().email().required(),  // Email con formato válido
            telefono: Joi.string().regex(/^\d{10}$/).required(),  // Teléfono (10 dígitos)
            fecha_ingreso: Joi.date().default(() => new Date(), 'fecha de ingreso predeterminada')  // Fecha de ingreso, predeterminada si no se da
        });

        const validate = schema.validate(data);
        return validate;
    }
}
