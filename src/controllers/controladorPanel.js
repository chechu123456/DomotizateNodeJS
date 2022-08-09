const { promisify } = require("util");
const express = require('express');
const path = require("path");
//const { use } = require("../routes/landingPage");
//const Usuario = require("../Clases/Usuario");

const controller = {};
/*
const user = new Usuario();
*/

controller.controlarPanel = (req, res)=>{

    res.render("panel/index");
    console.log(req.body);
    console.log(req.session.usuarioNickname);
    user.setNickname(req.session.usuarioNickname);
    console.log("----------------------------");
    console.log(user.getNickname());
    console.log("----------------------------");

    //console.log(user.buscarUsuario());

    user.buscarUsuarioBD()
        .then( result => {
            //res.send("<p>\nUsuario encontrado</p>");
            console.log(result);
            //return conexion.query( str_sql_3 );
        } )/*
        .then( result => {
            otherRows = result;
            //return mydb.close();
        } , err => {
            //return mydb.close().then( () => { throw err; } )
        })
        .then( () => {
            // do something with someRows and otherRows
            //console.log("someRows: " + someRows[0]['itemid']);
            //console.log(`otherRows: ${otherRows[0]['itemid']}`);

        })*/.catch( err => {
            // handle the error
            console.log(err.message);
            //console.log("<p>\n No hay coincidencias con el usuario introducido. OK</p>");
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

controller.registrarUsuario = (req, res)=>{
    //console.log(req.body.nickname, req.body.password, req.body.localidad, req.body.nombCasa, req.body.idCasa);
    user.setNickname(req.body.nickname);
    user.buscarUsuarioBD()
    .then(buscarUsuario => {
        console.log(buscarUsuario);
        if(buscarUsuario[1] === "<p>\nUsuario encontrado</p>"){
            res.send("Usuario encontrado");
        }else{
            user.crearUsuario(req.body.nickname, req.body.password, req.body.localidad, req.body.nombCasa, req.body.idCasa)
            req.session.usuarioNickname = req.body.nickname;
            user.buscarUsuarioBD()
            .then(buscarUsuario => {
                console.log(buscarUsuario);
                if(buscarUsuario === "<p>\nUsuario encontrado</p>"){
                    res.send("Usuario creado");
                }else{
                    res.send("ERROR");
                }
            })
        }
    }).catch( err => {
        console.log(err.message);
        }   
    );

//  res.redirect("/procesoLogin");
    
 

};




module.exports = controller;