const express = require('express');
const router = express.Router();
var app = express();
const path = require("path");

const controlador = require("../controllers/controladorPanel");

app.set("views", path.join(__dirname, '../views/'));


// Ubicacion actual /admin/

app.get("/index",controlador.controlarPanel);

app.post("/actualizarDatosSensoresBD",controlador.actualizarSensoresBD);

app.get("/graficas", controlador.pasarDatosPrincipales);

app.get("/cambiarTema", controlador.pasarDatosPrincipales);

app.post("/actualizarDatosTema", controlador.actualizarDatosTema);

app.get("/configuracion", controlador.pasarDatosPrincipales);

app.get("/cerrarSesion", controlador.cerrarSession);



//app.post("/index", controlador.controlarSesion);


//app.post("/index", );

module.exports = app;