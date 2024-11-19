const constants = require("../../app/utils/constants");

test('Se puede crear un estudiante', async function () {
    const estudiante = {
        nombre: "Juan",
        apellido_paterno: "Pérez",
        apellido_materno: "García",
        matricula: "123456",
        curp: "JUAP890102HDFLRN09"
    };

    let created;
    let entorno = constants.ENVIRONMENTS.local;
    const URL = constants.URLS[entorno];

    // Crear estudiante
    let response = await fetch(`${URL}/estudiante/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estudiante)
    });

    let responseBody = await response.json();
    created = responseBody.ok;

    expect(response.status).toBe(200);
    expect(created).toBe(true);

    // Verificar estudiante creado
    response = await fetch(`${URL}/estudiante/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    responseBody = await response.json();
    const existeEstudiante = responseBody.some(
        (e) => e.matricula === estudiante.matricula
    );

    expect(existeEstudiante).toBe(true);

    // Eliminar estudiante
    response = await fetch(`${URL}/estudiante/${estudiante.matricula}`, {
        method: "DELETE"
    });

    responseBody = await response.json();
    const deleted = responseBody.ok;

    expect(response.status).toBe(200);
    expect(deleted).toBe(true);
});

test('NO se puede duplicar un estudiante por matrícula o CURP', async function () {
    const estudiante = {
        nombre: "Juan",
        apellido_paterno: "Pérez",
        apellido_materno: "García",
        matricula: "123456",
        curp: "JUAP890102HDFLRN09"
    };

    let entorno = constants.ENVIRONMENTS.local;
    const URL = constants.URLS[entorno];

    // Crear estudiante
    let response = await fetch(`${URL}/estudiante/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estudiante)
    });

    let responseBody = await response.json();
    let created = responseBody.ok;

    expect(response.status).toBe(200);
    expect(created).toBe(true);

    // Intentar duplicar estudiante
    response = await fetch(`${URL}/estudiante/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estudiante)
    });

    expect(response.status).toBe(409);

    response = await fetch(`${URL}/estudiante/${estudiante.matricula}`, {
        method: "DELETE"
    });

    responseBody = await response.json();
    const deleted = responseBody.ok;

    expect(response.status).toBe(200);
    expect(deleted).toBe(true);
});
