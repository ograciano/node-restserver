const { Router } = require("express");
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existCategoria } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole, tieneRole } = require("../middlewares");

const router = Router();

/**
 * localhost:8080/api/categorias
 */

// Obtener todas las cateorias - publico
router.get('/', obtenerCategorias)

// Obtener una cattegoria por id - publico
router.get('/:id',[
    check('id').custom(existCategoria),
    validarCampos
], obtenerCategoria)

// Crear una categoria - provado cualquier rol con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos], 
    crearCategoria)
    
    // actualizar - privado cualquiera con token valido
    router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existCategoria),
        validarCampos
    ],actualizarCategoria)
    
    // borrar - admin
    router.delete('/:id',[
        validarJWT,
        esAdminRole,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existCategoria),
        validarCampos
], borrarCategoria)

module.exports = router;