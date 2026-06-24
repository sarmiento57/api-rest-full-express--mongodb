const express = require("express");
const Usuario = require("../modules/usuarios_module");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const { decode } = require("jsonwebtoken");
const ruta = express.Router();
const verificarToken = require('../middlewares/auth');

ruta.get("/", verificarToken, async (req, res, next) => {
  try {
    const listar = await ListarUsuarios();

    res.json({
      success: true,
      users: listar,
    });
  } catch (err) {
    next(err);
  }
});

ruta.post("/", verificarToken, async (req, res, next) => {
  try {
    const { email, nombre, password } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    ExisteUsuario(existeUsuario, res);

    const nuevoUsuario = await CrearUsuario({ email, nombre, password });

    res.json({
      success: true,
      data: { email: nuevoUsuario.email, nombre: nuevoUsuario.nombre },
    });
  } catch (err) {
    next(err);
  }
});

ruta.put("/:id", verificarToken, async (req, res, next) => {
  try {
    const id = req.params.id;
    const { email, nombre, password, estado } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente && usuarioExistente._id.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: "El correo electronico ya esta siendo usado por otro usuario.",
      });
    }
    const actualizarUsuario = await ActualizarUsuario(id, {
      email,
      nombre,
      password,
      estado,
    });

    res.json({
      success: true,
      data: {
        email: actualizarUsuario.email,
        nombre: actualizarUsuario.nombre,
        estado: actualizarUsuario.estado,
      },
    });
  } catch (err) {
    next(err);
  }
});

ruta.delete("/:id", verificarToken,  async (req, res, next) => {
  try {
    const id = req.params.id;
    let resultado = await DesactivarUsuario(id);
    if (!resultado) {
      return res.status(400).json({
        success: false,
        message: "El usuario no existe.",
      });
    }
    res.json({
      success: true,
      data: {
        id: resultado.id,
        email: resultado.email,
        estado: resultado.estado,
      },
    });
  } catch (err) {
    next(err);
  }
});

async function ListarUsuarios() {
  let usuarios = await Usuario.find({ estado: true }).select({
    email: 1,
    nombre: 1,
  });

  return usuarios;
}

async function CrearUsuario(body) {
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: bcrypt.hashSync(body.password, 10),
  });
  return await usuario.save();
}

async function ActualizarUsuario(id, body) {
  let usuario = await Usuario.findByIdAndUpdate(
    id,
    {
      $set: {
        email: body.email,
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10),
        estado: body.estado,
      },
    },
    { new: true },
  );
  return usuario;
}

async function DesactivarUsuario(id) {
  let usuario = await Usuario.findByIdAndUpdate(
    id,
    {
      $set: {
        estado: false,
      },
    },
    { new: true },
  );
  return usuario;
}

async function ExisteUsuario(user, res) {
  if (user) {
    return res.status(400).json({
      success: false,
      message: "El correo electronico ya esta siendo usado por otro usuario.",
    });
  }
}

module.exports = ruta;
