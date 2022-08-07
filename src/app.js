const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const mysql = require("mysql2")
const dotenv = require("dotenv");
const myConnection = require("express-myconnection");
const bcryptjs = require("bcryptjs");
const cookieSession = require("cookie-session");
var xmlparser = require('express-xml-bodyparser');

const mdsesion = require("./middlewares/sesion");

//global.usuario = require("./Clases/Usuario");

const Usuario = require("./Clases/Usuario.js");
user = new Usuario();

app.use(cookieSession({
    name: "session",
    keys: ["llave-1", "llave-2"]
}));

app.use(xmlparser());


dotenv.config({path: './env/.env'});

//Importando routes
const landingPage = require("./routes/landingPage");
const adminRutas = require("./routes/adminRutas");

//settings
//Port es como una variable q almacena el contenido de la derecha de la coma
//process.env.PORT revisa si el puerto esta siendo utilizado en el equipo (o q nos de el puerto el S.O). Si no lo hay  q coja el 3000
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");

//Middlewares --> Se ejecutan antes de realizar las peticiones de los usuarios
app.use(morgan('dev'));

//app.use("cookieParser");


app.use(myConnection(mysql, {
    host: "localhost",
    user: "root",
    password: "",
    port:"3306",
    database: "domotizate"
}, "single"));



//Pertenece a un modulo llamado body parse
//Desde el modulo de express llamamos a un metodo que nos permite requerir todos los datos que vengan de un formulario
//false --> porque no nos van enviar imagenes ni datos codificados
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//Routes
//app.use("/", landingPage);
app.use(landingPage);
app.use("/admin", mdsesion);
app.use("/admin", adminRutas);
//app.use("/admin", adminRutas);

//static files --> Si queremos usar frameworks, imagenes, codigos fuente, archivos css, js
app.use('/public', express.static('src/public'))

app.listen(app.get('port'), () =>{
    console.log("Server on port 3000");
})