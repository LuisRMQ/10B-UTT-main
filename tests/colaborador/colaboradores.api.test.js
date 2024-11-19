const constants = require("../../app/utils/constants");

test('No se puede crear un colaborador con los campos obligatorios faltantes', () => {
    const colaboradorInvalido = {
        nombre: "Juan",
        apellido_paterno: "Perez",
        apellido_materno: "Lopez",
        puesto: "Desarrollador",
        email: "juan@example.com",
        telefono: "123" // Teléfono inválido (menos de 10 dígitos)
    };

    const resultado = validate.nuevoColaborador(colaboradorInvalido);

    // Verifica que el error exista
    expect(resultado.error).not.toBeNull();

    // Verifica que el mensaje de error sea el esperado
    expect(resultado.error.details[0].message).toBe("\"telefono\" with value \"123\" fails to match the required pattern: /^\\d{10}$/");

    // Verifica que la clave del error sea la esperada
    expect(resultado.error.details[0].context.key).toBe("telefono");
});

test('NO se puede duplicar un colaborador por email', async function () {
    const colaborador = {
        nombre: "Carlos",
        apellido_paterno: "López",
        apellido_materno: "García",
        email: "carlos.lopez@example.com",
        puesto: "Desarrollador",
        telefono: "555-123-4567"
    };

    let entorno = constants.ENVIRONMENTS.local;
    const URL = constants.URLS[entorno];

    // Crear colaborador
    let response = await fetch(`${URL}/colaborador/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(colaborador)
    });

    let responseBody = await response.json();
    let created = responseBody.ok;

    // Verificar que el colaborador fue creado correctamente
    expect(response.status).toBe(200);
    expect(created).toBe(true);

    // Intentar duplicar colaborador
    response = await fetch(`${URL}/colaborador/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(colaborador)
    });

    // Verificar que la respuesta es de conflicto (código 409)
    expect(response.status).toBe(409); // Código de conflicto para duplicados

    // Eliminar colaborador original
    response = await fetch(`${URL}/colaborador/${colaborador.email}`, {
        method: "DELETE"
    });

    responseBody = await response.json();
    const deleted = responseBody.ok;

    // Verificar que el colaborador fue eliminado correctamente
    expect(response.status).toBe(200);
    expect(deleted).toBe(true);
});
