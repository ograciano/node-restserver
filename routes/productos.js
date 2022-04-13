const { Router } = require("express");
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { existCategoria, existProducto } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole, tieneRole } = require("../middlewares");

const router = Router();

/**
 * localhost:8080/api/categorias
 */

// Obtener todas las cateorias - publico
router.get('/', obtenerProductos)

// Obtener una cattegoria por id - publico
router.get('/:id',[
    check('id').custom(existProducto),
    validarCampos
], obtenerProducto)

// Crear una Producto - provado cualquier rol con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('categoria', 'La categoria es Obligatoria').not().isEmpty(),
    check('categoria').custom(existCategoria),
    check('categoria', 'No es un id valido').isMongoId(),
    validarCampos], 
    crearProducto)
    
    // actualizar - privado cualquiera con token valido
    router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existProducto),
        check('categoria', 'La categoria es Obligatoria').not().isEmpty(),
        check('categoria').custom(existCategoria),
        check('categoria', 'No es un id valido').isMongoId(),
        validarCampos
    ],actualizarProducto)
    
    // borrar - admin
    router.delete('/:id',[
        validarJWT,
        esAdminRole,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existProducto),
        validarCampos
], borrarProducto)

module.exports = router;