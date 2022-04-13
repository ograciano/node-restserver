const { request, response } = require("express");
const { Categoria } = require("../models");


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req=request, res=response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre')
    ])
    res.json({
        total,
        categorias
    });
}

//obtenerCategoria - populate 6255bcc1968001c0f5da6761
const obtenerCategoria = async (req=request, res=response) => {
    const id = req.params.id;

    const categoria = await Categoria.findOne({_id: id, estado: true}). populate('usuario', 'nombre');
    if(!categoria){
        return res.status(404).json({msg: 'La Catagoria no existe en la base de datos o esta bloqueada - consulte a su admiistrador'})
    }

    res.json({categoria})
}


// Crear Categoria
const crearCategoria = async (req=request, res=response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB) {
        return res.status(400).json({msg: `La categoria ${categoriaDB.nombre} ya existe` })
    }

    // Generar la data a guardar
    try {
        const data = {
            nombre,
            usuario: req.usuario._id
        }
        
        // Crear el objeto del modelo
        const categoria = new Categoria(data);
        
        // Guardar el objeto en la base de datos
        await categoria.save();
        
        res.status(201).json({categoria})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Consulte con el administrador'})
    }
}

// Actualizar Categoria
const actualizarCategoria = async (req=request, res=response) => {
    const id = req.params.id;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre');
        res.json({categoria})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Consulte a su administrador'});
    }
}

// Borrar Categoria
const borrarCategoria = async (req=request, res=response) => {
    const id = req.params.id;
    try {
        await Categoria.findByIdAndUpdate(id, {estado: false});
        res.json({msg: 'La categoria ah sido bloqueada'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Consulte a su administrador'});
    }
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}