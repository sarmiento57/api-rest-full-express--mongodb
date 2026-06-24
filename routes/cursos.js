const express = require("express");
const Curso = require("../modules/cursos_module");
const verificarToken = require("../middlewares/auth");
const config = require("config");
const ruta = express.Router();

ruta.get("/", verificarToken, (req, res) => {
  let resultado = ListarCursos();
  resultado
    .then((cursos) => {
      res.json(cursos);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.get("/:id", verificarToken, (req, res) => {
  let resultado = GetCursoById(req.params.id);

  resultado
    .then((curso) => {
      res.json(curso);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.post("/", verificarToken, (req, res) => {
  let curso = CrearCurso(req);

  curso
    .then((curso) => {
      res.json({
        valor: curso,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.put("/:id", verificarToken, (req, res) => {
  let resultado = ActualizarCurso(req.params.id, req.body);

  resultado
    .then((curso) => {
      res.json({
        valor: curso,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

ruta.delete("/:id", verificarToken, (req, res) => {
  let resultado = DesactivarCurso(req.params.id);

  resultado
    .then((curso) => {
      res.json({
        valor: curso,
      });
    })
    .catch(
      (err) => {
        res.status(400).json({
          error: err,
        });
      },
      { new: true },
    );
});

async function ListarCursos() {
  let cursos = await Curso.find({ publicado: true }).populate("autor", "nombre -_id");

  return cursos;
}

async function GetCursoById(id) {
  let curso = await Curso.findById(id);
  return curso;
}

async function CrearCurso(req) {
  let curso = new Curso({
    nombre: req.body.nombre,
    autor: req.usuario._id,
    etiquetas: req.body.etiquetas,
  });

  return await curso.save();
}

async function ActualizarCurso(id, body) {
  let curso = await Curso.findByIdAndUpdate(
    id,
    {
      $set: {
        nombre: body.nombre,
        autor: body.autor,
        etiquetas: body.etiquetas,
        publicado: body.publicado,
      },
    },
    { new: true },
  );

  return curso;
}

async function DesactivarCurso(id) {
  let curso = await Curso.findByIdAndUpdate(
    id,
    {
      $set: {
        publicado: false,
      },
    },
    { new: true },
  );

  return curso;
}

module.exports = ruta;
