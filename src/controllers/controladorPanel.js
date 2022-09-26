const { promisify } = require("util");
const express = require('express');
const path = require("path");
//const { use } = require("../routes/landingPage");
//const Usuario = require("../Clases/Usuario")
const request = require('request');
const xml2js = require('xml2js').parseString;;

const controller = {};
/*
const user = new Usuario();
*/

controller.controlarPanel = (req, res)=>{
    let nombreCiudad, temperatura, estadoDia, temp, img, codigoLocalidad;
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);
    user.setIdTema(req.session.idTema);

    let localidad = req.session.localidad ;    
    if((localidad)){
        switch(localidad){
            case "ponferrada":
                codigoLocalidad = "24115";
                break;
            case "barco":
                codigoLocalidad = "32009";
                break;
            case "coruna":
                codigoLocalidad = "15030";
                break;
            case "madrid":
                codigoLocalidad = "28079";
                break;
            case "barcelona":
                codigoLocalidad = "08019";
                break;
        }
    }

    console.log("Codigo localizad: " +codigoLocalidad);

    if(codigoLocalidad){
        request.get({url:"https://www.aemet.es/xml/municipios/localidad_"+codigoLocalidad+".xml" ,json:false}, function (e, r, data) {
            //console.log(data);
            xml2js(data, function (err, results) {
                var horaActual = new Date();
    
                horaActual = horaActual.getHours();
    
                //console.log(results);
                //let datos = JSON.stringify( results.root.prediccion);
                nombreCiudad =  results.root.nombre[0];
                let datos = results.root.prediccion;
                //console.log(nombreCiudad);
    
                //console.log(datos);
                
                
                datos.forEach(obj => {
                    Object.entries(obj).forEach(([key, value]) => {
                        //console.log(key, value);
                    });
                    
                    estadoDia = obj.dia[0].estado_cielo[2].$.descripcion;
                    //console.log(obj.dia[0].estado_cielo[2].$.descripcion);
                    //console.log(obj.dia[0].temperatura);
                    temperatura = (obj.dia[0].temperatura);
                    temperatura.forEach(obj => {
                        //console.log(obj.maxima);
                        //temperatura = obj.maxima[0];
    
                        if( (horaActual >= 3) && (horaActual < 9) ){
                            temp = obj.dato[0]._ + "ºC";
                        }else if( (horaActual >= 9) && (horaActual < 15) ){
                            temp = obj.dato[1]._ + "ºC";  
                        }else if( (horaActual >= 15) && (horaActual < 21) ){
                            temp = obj.dato[2]._ + "ºC";  
                        }else if( (horaActual >= 21) && (horaActual < 3) ){
                            temp = obj.dato[3]._ + "ºC";  
                        }else{
                            temp = "<div class='errorDatosTiempo'>SIN DATOS</div>";
                        }
    
                    });
    
                    if(!estadoDia){
                        img = "/public/imagenes/iconos/advertencia.png";
                    }else{
                        if( estadoDia.search("soleado") >= 0 || estadoDia.search("poco nuboso") >= 0  ||  estadoDia.search("Despejado") >= 0 ){
                            img = "/public/imagenes/iconos/soleado.svg";
                        }else if(estadoDia.search("nuboso") >= 0  ){
                            img = "/public/imagenes/iconos/nublado.svg";
                        }else if(estadoDia.search("lluvia") >= 0 ){
                            img = "/public/imagenes/iconos/lluvia.svg";
                        }else{
                            img = "/public/imagenes/iconos/soleado.svg";
                        }
                    }
    
                    console.log(nombreCiudad);
                    console.log(temp);
                    console.log(estadoDia);
                    console.log(img);
    
                 
    
                });
              
                
            });

            user.recuperarDatosUsuarioBD()
            .then(resultDatosUsuario => {

                console.log(resultDatosUsuario);

                user.listarSensoresValoresPorCasa()
                .then(resulSensoresValoresPorCasa => {
                    console.log("--------------");

                    console.log(resulSensoresValoresPorCasa);

                    user.buscarNombreCasa()
                    .then(resultNombCasa => {
                        console.log(resultNombCasa[0][0].nombCasa);

                        user.obtenerDatosTema()
                        .then(resultDatosTema => {
                            console.log(resultDatosTema)
                            var enviarDatos = {
                                nombreCiudad: nombreCiudad,
                                temp: temp,
                                estadoDia: estadoDia,
                                img: img,
                                datosUsuario: resultDatosUsuario,
                                sensoresValoresPorCasa: JSON.stringify(resulSensoresValoresPorCasa),
                                datosTema: resultDatosTema,
                                nombCasa: resultNombCasa[0][0].nombCasa
                            }
                            

                            res.render("panel/index", enviarDatos);

                            console.log(req.body);                    
                            console.log(req.session.usuarioNickname);
                            /*
                            user.setNickname(req.session.usuarioNickname);
                            console.log("----------------------------");
                            console.log(user.getNickname());
                            console.log("----------------------------");
                            */
                        })
                        .catch(err => {
                            console.log(err.message);
                        });              
                    })
                    .catch(err =>{
                        console.log(err);
                    });
                })
                .catch(err => {
                    console.log(err.message);
                });
                
            })
            .catch(err => {
                console.log(err.message);
            });
    
    
        })
       
    
        //console.log(user.buscarUsuario());
    
        user.buscarUsuarioBD()
            .then( result => {
                console.log("datos de buscar Usuario: ");
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
                }   
            );
    }
    
  
}; 

controller.registrarUsuario = (req, res)=>{
    //console.log(req.body.nickname, req.body.password, req.body.localidad, req.body.nombCasa, req.body.idCasa);
    user.setNickname(req.body.nickname);
    user.buscarUsuarioBD()
    .then(buscarUsuario => {
        console.log(buscarUsuario);
        if(buscarUsuario[1] === "<p>\nUsuario encontrado</p>"){
            let mensajeRespuesta =  ["Usuario encontrado"];
            res.send(mensajeRespuesta);
        }else{

            user.crearUsuario(req.body.nickname, req.body.password, req.body.localidad, req.body.nombCasa, req.body.idCasa)
            .then( result => {
                console.log(result);
                req.session.usuarioNickname = req.body.nickname;
                req.session.idCasa = user.getIdCasa();
                req.session.idTema = user.getIdTema();
                console.log(user.getIdCasa());
                console.log(req.body.idCasa);
                if(user.getIdCasa() != req.body.idCasa){
                    let mensajeRespuesta =  ["ID de casa cambiado", "Usuario creado correctamente"];
                    res.send(mensajeRespuesta);
                }else{
                    res.send("Usuario creado correctamente");
                }


            })
            .catch(err => {
                console.log(err);
            })
/*
            user.buscarIdCasaBD(idCasa)
            .then(resultBuscarIdCasa => {

                console.log(resultBuscarIdCasa);
                if(resultBuscarIdCasa[1] != "<p>Se ha encontrado el id de la casa</p>"){
                    res.send("ID de casa cambiado");
                }else{
                    res.send("Usuario creado correctamente");
                }
            })
            .catch(err => {

            })
*/

        }
    })
    .catch(err => {
        console.log(err);
    })
//  res.redirect("/procesoLogin");
    
 
};

controller.actualizarSensoresBD = (req, res)=>{
    let nombSensor = req.body.nombSensor;
    let valor = req.body.valor;
    user.setIdCasa = req.session.idCasa;

    user.crearTienenRegistro(nombSensor, valor);
    console.log("-----------!!!!!!!!!!!!!-----------------");
    console.log(user.idCasa);
};

controller.cerrarSession = (req, res)=>{
    if(req.session){
        req.session = null;       
        res.redirect("/login");
     }
};



module.exports = controller;