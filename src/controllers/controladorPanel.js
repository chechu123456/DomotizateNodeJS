const { promisify } = require("util");
const express = require('express');
const path = require("path");
const usuario = require("../Clases/Usuario");
const user = new usuario("Sergio");
const controller = {};

controller.controlarPanel = async (req, res)=>{
    res.render("panel/index");
    console.log(req.body);
    console.log(req.session.usuarioNickname);
    //user.setNickname("Sergio");
    console.log(user.getNickname());
    console.log(user.buscarUsuario());
    let data = req.body;
    /*
    req.getConnection((err, conn) =>{
        conn.query("SELECT * FROM usuario WHERE nickname = ? AND password = ?", [data.nickname, data.password], (err, usuario) => {
            if(err){
                res.json(err);
                //Recomendable manejar errores con next()
            }
                        
            console.log("----------------------------");
            console.log(usuario);
            console.log("----------------------------");
            //console.log(usuario[0].nickname);
            if(JSON.stringify(usuario)!='[]'){
                console.log("Tiene datos");
                req.session.usuarioNickname = usuario[0].nickname;
                console.log("Sesion: "+ req.session.usuarioNickname);
                res.send("Usuario y contraseña OK");
            }else{
                console.log("No tiene datos");
                res.send("");
            }
      
        });
    });
    */
    
}; 




module.exports = controller;