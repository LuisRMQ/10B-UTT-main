const validate = require("../../validation/estudiante.validate");

test('No se puede crear un estudiante con los campos obligatorios faltantes', function() {
    const estudiante = {
        matricula: "123456789",
        nombre: "Juan",
        apellido_paterno: "Pérez",
        apellido_materno: "González",
        curp: "PEGA010203HDFRRN08"
    }

    const estudianteSinMatricula = Object.assign({}, estudiante);
    estudianteSinMatricula.matricula = undefined;
    let resultado = validate.nuevoEstudiante(estudianteSinMatricula);
    expect(resultado.error.details).toEqual([{"context": {"key": "matricula", "label": "matricula"}, "message": "\"matricula\" is required", "path": ["matricula"], "type": "any.required"}]);

    const estudianteSinNombre = Object.assign({}, estudiante);
    estudianteSinNombre.nombre = undefined;
    resultado = validate.nuevoEstudiante(estudianteSinNombre);
    expect(resultado.error.details).toEqual([{"context": {"key": "nombre", "label": "nombre"}, "message": "\"nombre\" is required", "path": ["nombre"], "type": "any.required"}]);

    const estudianteSinCurp = Object.assign({}, estudiante);
    estudianteSinCurp.curp = undefined;
    resultado = validate.nuevoEstudiante(estudianteSinCurp);
    expect(resultado.error.details).toEqual([{"context": {"key": "curp", "label": "curp"}, "message": "\"curp\" is required", "path": ["curp"], "type": "any.required"}]);
});

test('Se puede crear un estudiante', function() {
    const estudiante = {
        matricula: "123456789",
        nombre: "Juan",
        apellido_paterno: "Pérez",
        apellido_materno: "González",
        curp: "PEGA010203HDFRRN08"
    }

    let resultado = validate.nuevoEstudiante(estudiante);
    expect(resultado).not.toHaveProperty('error');
});

test('No se puede crear un estudiante con matrícula duplicada', async function() {
    const estudiante = {
        matricula: "123456789",
        nombre: "Juan",
        apellido_paterno: "Pérez",
        apellido_materno: "González",
        curp: "PEGA010203HDFRRN08"
    };

    let resultado = validate.nuevoEstudiante(estudiante);
    expect(resultado).not.toHaveProperty('error');

    const estudianteDuplicado = {
        matricula: "123456789",
        nombre: "Pedro",
        apellido_paterno: "Lopez",
        apellido_materno: "Martínez",
        curp: "LOPE010203HDFRRN09"
    };

    resultado = validate.nuevoEstudiante(estudianteDuplicado);
    expect(resultado.error.details).toEqual([{"context": {"key": "matricula", "label": "matricula"}, "message": "\"matricula\" must be unique", "path": ["matricula"], "type": "any.unique"}]);
});
