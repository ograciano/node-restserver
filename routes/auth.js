const { Router } = require("express");
const { check } = require('express-validator');
const { login, googleSignIn } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post('/login',[
    check('correo', 'El Correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de mas de 6 letras').isLength({ min: 6 }),
    validarCampos

], login);


router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos

], googleSignIn);


module.exports = router;