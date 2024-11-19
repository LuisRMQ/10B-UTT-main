const validate = require("../../validation/colaborador.validate");

test('No se puede crear un colaborador con los campos obligatorios faltantes', () => {
    const colaborador = {
        nombre: "Carlos",
        apellido_paterno: "Sánchez",
        apellido_materno: "López",
        puesto: "Desarrollador",
        email: "carlos.sanchez@example.com",
        telefono: "5551234567"
    };

    // Falta el campo `email`
    const colaboradorSinEmail = { ...colaborador, email: undefined };
    let resultado = validate.nuevoColaborador(colaboradorSinEmail);
    expect(resultado.error.details).toEqual([{
        context: { key: "email", label: "email" },
        message: "\"email\" is required",
        path: ["email"],
        type: "any.required"
    }]);

    // Falta el campo `nombre`
    const colaboradorSinNombre = { ...colaborador, nombre: undefined };
    resultado = validate.nuevoColaborador(colaboradorSinNombre);
    expect(resultado.error.details).toEqual([{
        context: { key: "nombre", label: "nombre" },
        message: "\"nombre\" is required",
        path: ["nombre"],
        type: "any.required"
    }]);

    // Campo `telefono` inválido
    const colaboradorTelefonoInvalido = { ...colaborador, telefono: "123" };
    resultado = validate.nuevoColaborador(colaboradorTelefonoInvalido);
    expect(resultado.error.details).toEqual([{
        context: { key: "telefono", label: "telefono", regex: {} },
        message: "\"telefono\" with value \"123\" fails to match the required pattern: /^\\d{10}$/",
        path: ["telefono"],
        type: "string.pattern.base"
    }]);
});

test('Se puede crear un colaborador con datos válidos', () => {
    const colaborador = {
        nombre: "Carlos",
        apellido_paterno: "Sánchez",
        apellido_materno: "López",
        puesto: "Desarrollador",
        email: "carlos.sanchez@example.com",
        telefono: "5551234567"
    };

    const resultado = validate.nuevoColaborador(colaborador);
    expect(resultado).not.toHaveProperty('error');
});

test('El campo `fecha_ingreso` tiene un valor predeterminado si no se proporciona', () => {
    const colaborador = {
        nombre: "Carlos",
        apellido_paterno: "Sánchez",
        apellido_materno: "López",
        puesto: "Desarrollador",
        email: "carlos.sanchez@example.com",
        telefono: "5551234567"
    };

    const resultado = validate.nuevoColaborador(colaborador);
    expect(resultado).not.toHaveProperty('error');
    expect(resultado.value.fecha_ingreso).toBeDefined();
    expect(new Date(resultado.value.fecha_ingreso)).toBeInstanceOf(Date);
});
