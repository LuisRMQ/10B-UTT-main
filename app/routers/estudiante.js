const express = require('express');
const router = express.Router();
const Estudiante = require('../models/Estudiante');
const Log = require('../models/Log');

// POST: Crear nuevo estudiante
router.post('/new', async (req, res) => {
    const body = req.body || {};
    const validate = require('../../validation/estudiante.validate');
    const estudianteValido = validate.nuevoEstudiante(body);

    await new Log({
        method: 'POST',
        endpoint: '/estudiante/new',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();


  //Inversión
  if(estudianteValido.error) {
    return res.status(400).send(estudianteValido.error.details);
}



    // Verificar duplicado de matrícula
    const duplicado = await Estudiante.findOne({ matricula: body.matricula });
    if (duplicado) {
        return res.status(409).send({
            message: "La matrícula ya existe",
            info: body
        });
    }

    const nuevoEstudiante = new Estudiante(body);
    await nuevoEstudiante.save();

    res.send({ ok: true });
});

// GET: Obtener todos los estudiantes
router.get('/all', async (req, res) => {
    await new Log({
        method: 'GET',
        endpoint: '/estudiante/all',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const estudiantes = await Estudiante.find({});
    res.send(estudiantes);
});

// GET: Obtener estudiante por matrícula
router.get('/:matricula', async (req, res) => {
    await new Log({
        method: 'GET',
        endpoint: '/estudiante/:matricula',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const estudiante = await Estudiante.findOne({ matricula: req.params.matricula });
    if (!estudiante) {
        return res.status(404).send({
            message: `El estudiante con la matrícula ${req.params.matricula} no existe`
        });
    }

    res.send(estudiante);
});

// PUT: Actualizar datos de un estudiante
router.put('/:matricula', async (req, res) => {
    await new Log({
        method: 'PUT',
        endpoint: '/estudiante/:matricula',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const body = req.body || {};
    const estudiante = await Estudiante.findOne({ matricula: req.params.matricula });

    if (!estudiante) {
        return res.status(404).send({
            message: `El estudiante con la matrícula ${req.params.matricula} no existe`
        });
    }

    // Actualizar solo campos válidos
    const camposActualizables = ['nombre', 'apellido_paterno', 'apellido_materno', 'curp'];
    camposActualizables.forEach(campo => {
        if (body[campo] !== undefined) {
            estudiante[campo] = body[campo];
        }
    });

    await estudiante.save();
    res.send({ ok: true });
});

// DELETE: Eliminar estudiante por matrícula
router.delete('/:matricula', async (req, res) => {
    await new Log({
        method: 'DELETE',
        endpoint: '/estudiante/:matricula',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const estudiante = await Estudiante.findOne({ matricula: req.params.matricula });

    if (!estudiante) {
        return res.status(404).send({
            message: `El estudiante con la matrícula ${req.params.matricula} no existe`
        });
    }

    await Estudiante.deleteOne({ matricula: req.params.matricula });
    res.send({ ok: true });
});

module.exports = router;
