const express = require('express');
const router = express.Router();
const Colaborador = require('../models/Colaborador');
const Log = require('../models/Log');

// POST: Crear nuevo colaborador
router.post('/new', async (req, res) => {
    const body = req.body || {};
    
    await new Log({
        method: 'POST',
        endpoint: '/colaborador/new',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    // Verificar duplicado de correo electrónico
    const duplicado = await Colaborador.findOne({ email: body.email });
    if (duplicado) {
        return res.status(409).send({
            message: "El correo electrónico ya está registrado",
            info: body
        });
    }

    const nuevoColaborador = new Colaborador(body);
    await nuevoColaborador.save();

    res.send({ ok: true });
});

// GET: Obtener todos los colaboradores
router.get('/all', async (req, res) => {
    await new Log({
        method: 'GET',
        endpoint: '/colaborador/all',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const colaboradores = await Colaborador.find({});
    res.send(colaboradores);
});

// GET: Obtener colaborador por correo electrónico
router.get('/:email', async (req, res) => {
    await new Log({
        method: 'GET',
        endpoint: '/colaborador/:email',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const colaborador = await Colaborador.findOne({ email: req.params.email });
    if (!colaborador) {
        return res.status(404).send({
            message: `El colaborador con el correo ${req.params.email} no existe`
        });
    }

    res.send(colaborador);
});

// PUT: Actualizar datos de un colaborador
router.put('/:email', async (req, res) => {
    await new Log({
        method: 'PUT',
        endpoint: '/colaborador/:email',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const body = req.body || {};
    const colaborador = await Colaborador.findOne({ email: req.params.email });

    if (!colaborador) {
        return res.status(404).send({
            message: `El colaborador con el correo ${req.params.email} no existe`
        });
    }

    // Actualizar solo campos válidos
    const camposActualizables = ['nombre', 'apellido_paterno', 'apellido_materno', 'puesto', 'telefono'];
    camposActualizables.forEach(campo => {
        if (body[campo] !== undefined) {
            colaborador[campo] = body[campo];
        }
    });

    await colaborador.save();
    res.send({ ok: true });
});

// DELETE: Eliminar colaborador por correo electrónico
router.delete('/:email', async (req, res) => {
    await new Log({
        method: 'DELETE',
        endpoint: '/colaborador/:email',
        data: req.body || {},
        geoLocation: req.ipInfo,
        params: {
            query: req.query || {},
            path: req.params || {}
        },
        time: new Date()
    }).save();

    const colaborador = await Colaborador.findOne({ email: req.params.email });

    if (!colaborador) {
        return res.status(404).send({
            message: `El colaborador con el correo ${req.params.email} no existe`
        });
    }

    await Colaborador.deleteOne({ email: req.params.email });
    res.send({ ok: true });
});

module.exports = router;
