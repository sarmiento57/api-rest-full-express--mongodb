const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaCursos = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  autor: {
    type: Schema.Types.ObjectId, ref: 'Usuario',
    required: true,
  },
  etiquetas: [
    {
      type: String,
      required: true,
    },
  ],
  publicado: {
    type: Boolean,
    default: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cursos", schemaCursos);
