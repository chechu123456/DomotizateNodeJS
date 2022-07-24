//Para validar que al acceder en /admin solo puedan acceder aquellos usuarios con la sesión iniciada
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { promisify } = require("util");
const express = require('express');
const path = require("path");

var app = express();



app.set("views", path.join(__dirname, '../panel'));

//Funcion que recibe la solicitud, la respuesta y el siguiente middleware a ejecutar
//async
module.exports =  function(req, res, next){
    //Si no tenemos una sesión con un user id
    
    try{

        if(!req.session.usuarioNickname){
            console.log("No hay session");
            res.redirect("/index");
        }else{
            console.log("Hay sesion");
            next();
        }
    }catch(error){
        console.log(error);
    }
}