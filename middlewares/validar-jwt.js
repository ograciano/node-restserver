const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token')
    // console.log(token);
    if (!token) {
        return res.status(401).json({ mdg: 'No hay token en la peticion' });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // Leer al usuario que corresponda al uid
        const usuario = await Usuario.findById(uid);
        // verificar si el usuario existe en la BD
        if (!usuario) {
            return res.status(401).json({ msg: 'Token no valido - Usuario no existe en la bd' })
        }

        // verificar si el usuario tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({ msg: 'Token no valido - usuario con estado: false' })
        }
        req.usuario = usuario;
        // console.log(usuario);
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ msg: 'token no valido' })
    }
}

module.exports = {
    validarJWT
}