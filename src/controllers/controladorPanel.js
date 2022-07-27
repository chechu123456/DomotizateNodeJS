const { promisify } = require("util");
const express = require('express');
const path = require("path");
const usuario = require("../Clases/Usuario");
//const user = new usuario();
const controller = {};

controller.controlarPanel = (req, res)=>{
    const user = new usuario();

    res.render("panel/index");
    console.log(req.body);
    console.log(req.session.usuarioNickname);
    user.setNickname(req.session.usuarioNickname);
    console.log("----------------------------");
    console.log(user.getNickname());
    //console.log(user.buscarUsuario());

    user.buscarUsuario()
        .then( result => {
            console.log(result);
            //return conexion.query( str_sql_3 );
        } )/*
        .then( result => {
            otherRows = result;
            //return mydb.close();
        } , err => {
            //return mydb.close().then( () => { throw err; } )
        })*/
        .then( () => {
            // do something with someRows and otherRows
            //console.log("someRows: " + someRows[0]['itemid']);
            //console.log(`otherRows: ${otherRows[0]['itemid']}`);

        }).catch( err => {
            // handle the error
            console.log(err.message);
            }   
        );


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