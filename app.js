const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const verificarToken = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: err.message,
  });
});

//validar token en todas las rutas
//app.use(verificarToken);

app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

mongoose.connect(config.get('configDB.HOST'))
.then(()=> console.log('conectado a mongo db'))
.catch(()=> console.log('no se pudo conectar con mongodb'));

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log('servidor correindo en http://localhost:3000/');
})

