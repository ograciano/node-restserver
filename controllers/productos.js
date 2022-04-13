const { request, response } = require("express");
const { Producto } = require("../models");


//obtenerCategorias - paginado - total - populate
const obtenerProductos = async (req=request, res=response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre').populate('categoria', 'nombre')
    ])
    res.json({
        total,
        productos
    });
}

//obtenerCategoria - populate 6255bcc1968001c0f5da6761
const obtenerProducto = async (req=request, res=response) => {
    const id = req.params.id;

    const producto = await Producto.findOne({_id: id, estado: true}). populate('usuario', 'nombre').populate('categoria', 'nombre');
    if(!producto){
        return res.status(404).json({msg: 'La Catagoria no existe en la base de datos o esta bloqueada - consulte a su admiistrador'})
    }

    res.json({producto})
}


// Crear Categoria
const crearProducto = async (req=request, res=response) => {
    let {nombre, categoria, descripcion} = req.body;
    nombre = nombre.toUpperCase();
    descripcion = descripcion.toUpperCase();
    const productoDB = await Producto.findOne({nombre});
    if (productoDB) {
        return res.status(400).json({msg: `La producto ${productoDB.nombre} ya existe` })
    }

    // Generar la data a guardar
    try {
        const data = {
            nombre,
            categoria,
            usuario: req.usuario._id,
            descripcion
        }
        
        // Crear el objeto del modelo
        const producto = new Producto(data);
        
        // Guardar el objeto en la base de datos
        await producto.save();
        
        res.status(201).json({producto})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Consulte con el administrador'})
    }
}

// Actualizar Categoria
const actualizarProducto = async (req=request, res=response) => {
    const id = req.params.id;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.descripcion = data.descripcion.toUpperCase();
    data.usuario = req.usuario._id;
    try {
        const producto = await Producto.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre');
        res.json({producto})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Consulte a su administrador'});
    }
}

// Borrar Categoria
const borrarProducto = async (req=request, res=response) => {
    const id = req.params.id;
    try {
        await Producto.findByIdAndUpdate(id, {estado: false});
        res.json({msg: 'La Producto ah sido bloqueada'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Consulte a su administrador'});
    }
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}