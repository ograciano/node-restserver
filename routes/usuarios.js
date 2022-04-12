const { Router } = require("express");
const { check } = require('express-validator');
const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require("../controllers/usuarios");
const { esRoleValido, existEmail, existUsuario } = require("../helpers/db-validators");

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');


const router = Router();

router.get('/', usuariosGet);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser de mas de 6 letras').isLength({ min: 6 }),
        // check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom(existEmail),
        // check('role', 'No es un Role valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom(esRoleValido),
        validarCampos
], usuariosPost);

router.put('/:id', [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existUsuario),
        check('role').custom(esRoleValido),
        validarCampos
], usuariosPut);

router.delete('/:id', [
        validarJWT,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        //esAdminRole,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existUsuario),
        validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch)

module.exports = router;