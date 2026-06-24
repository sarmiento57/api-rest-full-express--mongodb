const mongoose = require('mongoose');

const schemaUsuario = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Usuario', schemaUsuario);