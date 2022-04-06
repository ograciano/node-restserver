const role = require("../models/role");
const usuario = require("../models/usuario");


const esRoleValido = async (rol = '') => {
    const existeRole = await role.findOne({ role: rol });
    if (!existeRole) {
        throw new Error(`El role ${rol} no esta registrado en la base de datos`);
    }
}

const existEmail = async (correo = '') => {
    const existeEmail = await usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`este correo: ${correo} ya esta registrado`)
    }
}
const existUsuario = async (id) => {
    const existeUsuario = await usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El ID no existe: ${id}`)
    }
}

module.exports = {
    esRoleValido,
    existEmail,
    existUsuario
}