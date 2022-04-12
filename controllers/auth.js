const bcryptjs = require('bcryptjs');
const { request, response } = require("express");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require("../models/usuario");


const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ msg: 'Usuario / password no son correctos - correo' })
        }


        // si el usuario esta ativo
        if (!usuario.estado) {
            return res.status(400).json({ msg: 'Usuario / password no son correctos - estado: false' })
        }

        // verifica la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario / password no son correctos - password' })
        }

        // genarer jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el adminisrador'
        });

    }

}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            const data = {
                nombre,
                correo,
                img,
                password: ':P',
                google: true,
                role: 'USER_ROLE'
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si e usuario en BD 
        if(!usuario.estado){
            return res.status(401).json({msg: 'Hable con el administrador, usaurio bloqueado'});
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'El token no se pudo verificar'})
    }

}

module.exports = {
    login,
    googleSignIn
}