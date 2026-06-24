const express = require("express");
const Usuario = require("../modules/usuarios_module");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const ruta = express.Router();

// ruta.post("/", (req, res) => {
//   const { email, password } = req.body;
//   Usuario.findOne({ email: email })
//     .then((user) => {
//       if (user) {
//         const passwordValido = bcrypt.compareSync(password, user.password);
//         if(!passwordValido) return res.status(400).json({error: "ok", msj: "Usuario o contraseña incorreptos."});
//         res.json(user);
//       } else {
//         res.status(400).json({
//           error: "ok",
//           msj: "Usuario o contraseña incorreptos.",
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(400).json({
//         error: "ok",
//         msj: "Error " + err,
//       });
//     });
// });

ruta.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        error: "ok",
        msj: "Credenciales no validas, revise su correo o contraseña.",
      });
    }

    const passwordValido = bcrypt.compareSync(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({
        error: "ok",
        msj: "Credenciales no validas, revise su correo o contraseña.",
      });
    }

    const jwtoken = jwt.sign(
      {
        usuario: {
          _id: usuario._id,
          email: usuario.email,
          nombre: usuario.nombre,
        },
      },
      config.get("configToken.SEED"),
      { expiresIn: config.get("configToken.Expiration") },
    );

    res.json({
      users: {
        _id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
      },
      token: jwtoken,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = ruta;
