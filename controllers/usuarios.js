const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {
    const { q, nombre, apikey } = req.query;
    res.json({
        ok: true,
        msg: 'GET API',
        q, 
        nombre, 
        apikey
    });
}

const usuariosPost = (req = request, res = response) => {
    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg: 'POST API',
        nombre,
        edad

    });
}

const usuariosPut = (req = request, res = response) => {
    const id = req.params.id;
    res.json({
        ok: true,
        msg: 'PUT API',
        id
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'DELETE API'
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'PÄTCH API'
    });
}
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}