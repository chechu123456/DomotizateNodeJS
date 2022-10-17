const { promisify } = require("util");
const express = require('express');
const path = require("path");
//const { use } = require("../routes/landingPage");
//const Usuario = require("../Clases/Usuario")
const request = require('request');
const { resolve } = require("path");
const xml2js = require('xml2js').parseString;;
var moment = require('moment'); // require


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
                                datosTema: JSON.stringify(resultDatosTema[0]),
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
        } )
        .catch( err => {
            // handle the error
            console.log(err.message);
        });
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
    user.setIdCasa(req.session.idCasa);
    user.crearTienenRegistro(nombSensor, valor);
};

controller.pasarDatosPrincipales = (req, res)=>{
 
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);
    user.setIdTema(req.session.idTema);
    let localidad = req.session.localidad;
    //Saber desde que url se está accediendo
    let web = req.url.split("/");
    console.log(web[web.length-1]);
    web = web[web.length-1];

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
                        datosUsuario: resultDatosUsuario,
                        sensoresValoresPorCasa: JSON.stringify(resulSensoresValoresPorCasa),
                        datosTema: resultDatosTema,
                        localidad: localidad,
                        nombCasa: resultNombCasa[0][0].nombCasa,                    
                    }
                    
                    if(web == "cambiarTema"){
                        res.render("panel/cambiarTema", enviarDatos);
                    }else if(web == "graficas"){
                        console.log("------------------------------------------------------------------------");   
                        let hoy = new Date();        
                        console.log(hoy);
         
                        let diaI = moment().format("YYYY-MM-DD") + " 00:00"; 
                        let diaF = moment().format("YYYY-MM-DD") + " 23:59"; 

                        console.log(diaI);
                        console.log(diaF);

                        let mesI = moment().startOf('month').format("YYYY-MM-DD") + " 00:00"; 
                        let mesF = moment().endOf('month').format("YYYY-MM-DD") + " 23:59"; 

                        console.log(mesI);
                        console.log(mesF);

                        let anoI = moment().startOf('year').format("YYYY-MM-DD") + " 00:00"; 
                        let anoF = moment().endOf('year').format("YYYY-MM-DD") + " 23:59"; 

                        console.log(anoI);
                        console.log(anoF);

                        //2 Formas de hacer los CALLBACKS
                        /*
                        let tempDia;
                        function mostrarResultado(resultado){
                            console.log(resultado);
                            tempDia = resultado;
                        
                        }

                        async function registrosTempHum(callback){
                            const resultado = await user.obtenerRegistrosTempHum("temperatura", diaI, diaF, callback);
                            callback(resultado);
                        }
                        registrosTempHum(mostrarResultado)
                        .then(function(){
                            console.log("------------------------------------------------------------------------");   
                            console.log(tempDia);
                            console.log("------------------------------------------------------------------------");   
                        });

*/                  
                        let tempMaxDia, tempMaxMes, tempMaxAno;
                        let tempMinDia, tempMinMes, tempMinAno;

                        let HumMaxDia, HumMaxMes, HumMaxAno;
                        let HumMinDia, HumMinMes, HumMinAno;

                        let tempsDia, tempsMes, tempsAno;
                        let humsDia, humsMes, humsAno;
                   

                        user.obtenerRegistrosTempHum("temperatura", diaI, diaF)
                        .then(resultTemp => {

                            tempsDia = resultTemp;
                            return  user.obtenerRegistrosTempHum("humedad", diaI, diaF);

                        })
                        .then(resultHum =>{
                            humsDia = resultHum;

                            return  user.obtenerRegistrosTempHum("temperatura", mesI, mesF)
                        })
                        .then(resultTemp =>{
                            tempsMes = resultTemp;

                            return  user.obtenerRegistrosTempHum("humedad", mesI, mesF)
                        })
                        .then( resultHum =>{
                            humsMes = resultHum;

                            return  user.obtenerRegistrosTempHum("temperatura", anoI, anoF)
                        })
                        .then( resultTemp =>{
                            tempsAno = resultTemp;

                            return  user.obtenerRegistrosTempHum("humedad", anoI, anoF)
                        })
                        .then( resultHum => {
                            humsAno = resultHum;

                            //OBTENER Temperaturas y humedades Máximas
                            return user.tempHumMaxFecha("temperatura", diaI, diaF)
                        })
                        .then(resultTemp => {

                            tempMaxDia = resultTemp;
                            return  user.tempHumMaxFecha("humedad", diaI, diaF);

                        })
                        .then(resultHum =>{
                            humMaxDia = resultHum;

                            return  user.tempHumMaxFecha("temperatura", mesI, mesF)
                        })
                        .then(resultTemp =>{
                            tempMaxMes = resultTemp;

                            return  user.tempHumMaxFecha("humedad", mesI, mesF)
                        })
                        .then( resultHum =>{
                            humMaxMes = resultHum;

                            return  user.tempHumMaxFecha("temperatura", anoI, anoF)
                        })
                        .then( resultTemp =>{
                            tempMaxAno = resultTemp;

                            return  user.tempHumMaxFecha("humedad", anoI, anoF)
                        })
                        .then( resultHum =>{
                            humMaxAno = resultHum;

                            //OBTENER Temperaturas y humedades Minimas
                            return  user.tempHumMinFecha("temperatura", diaI, diaI)
                        })

                        .then(resultTemp => {

                            tempMinDia = resultTemp;
                            return  user.tempHumMinFecha("humedad", diaI, diaF);

                        })
                        .then(resultHum =>{
                            humMinDia = resultHum;

                            return  user.tempHumMinFecha("temperatura", mesI, mesF)
                        })
                        .then(resultTemp =>{
                            tempMinMes = resultTemp;

                            return  user.tempHumMinFecha("humedad", mesI, mesF)
                        })
                        .then( resultHum =>{
                            humMinMes = resultHum;

                            return  user.tempHumMinFecha("temperatura", anoI, anoF)
                        })
                        .then( resultTemp =>{
                            tempMinAno = resultTemp;

                            return  user.tempHumMinFecha("humedad", anoI, anoF)
                        })
                        .then (restultHum => {
                            humMinAno =  restultHum;


                            let tempMax = [tempMaxDia, tempMaxMes, tempMaxAno];
                            let tempMin = [tempMinDia, tempMinMes, tempMinAno];

                            let humMax = [humMaxDia, humMaxMes, humMaxAno];
                            let humMin = [humMinDia, humMinMes, humMinAno];

                            let temps = [tempsDia, tempsMes, tempsAno];
                            let hums = [humsDia, humsMes, humsAno];



                            enviarDatos = {
                                datosUsuario: resultDatosUsuario,
                                sensoresValoresPorCasa: JSON.stringify(resulSensoresValoresPorCasa),
                                datosTema: resultDatosTema,
                                localidad: localidad,
                                nombCasa: resultNombCasa[0][0].nombCasa, 
                                tempMax: JSON.stringify(tempMax),
                                tempMin: JSON.stringify(tempMin),
                                humMax: JSON.stringify(humMax),
                                humMin: JSON.stringify(humMin),
                                temps: JSON.stringify(temps),
                                hums: JSON.stringify(hums),
                                idCasa: req.session.idCasa
                            }

                            res.render("panel/graficas", enviarDatos);

                        })
                        .catch(err =>{
                            console.log(err);
                        })


                        //user.obtenerRegistrosTempHum("temperatura", diaI, diaF, (result) => console.log(result));
                       // {tempDia: user.obtenerRegistrosTempHum("temperatura", diaI, diaF, (result) => console.log(result))};
                        //console.log(tempDia);
                        
                    }else if(web == "configuracion"){
                        res.render("panel/configuracion", enviarDatos);
                    }

                    console.log(req.body);                    
                    console.log(req.session.usuarioNickname);
                    console.log(localidad);

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
};

controller.actualizarDatosTema = (req, res)=>{
    user.setIdCasa(req.session.idCasa);
    console.log(req.body);

    user.idTema = req.session.idTema; 
    console.log(user.idTema);

    if(req.body.defecto){
        let colorFondoPagPanel = "";
        let colorFondoPanel = "";
        let colorTitulosPanel = "";
        let colorNombSensores = "";
        let tamanoLetraTit = "";
        let tamanoLetraNombSensores = "";

       
        user.modificarTema(colorFondoPagPanel, colorFondoPanel, colorTitulosPanel, colorNombSensores, tamanoLetraTit, tamanoLetraNombSensores);
       
    }else{

        let colorFondoPagPanel = req.body.colorFondoPagPanel;
        let colorFondoPanel = req.body.colorFondoPanel;
        let colorTitulosPanel = req.body.colorTitulosPanel;
        let colorNombSensores = req.body.colorNombSensores;
        let tamanoLetraTit = req.body.tamanoLetraTit;
        let tamanoLetraNombSensores = req.body.tamanoLetraNombSensores;
        /*
        console.log(colorFondoPagPanel);
        console.log(colorFondoPanel);
        console.log(colorTitulosPanel);
        console.log(colorNombSensores);
        console.log(tamanoLetraTit);
        console.log(tamanoLetraNombSensores);
        */
        user.modificarTema(colorFondoPagPanel, colorFondoPanel, colorTitulosPanel, colorNombSensores, tamanoLetraTit, tamanoLetraNombSensores);

    }
    

};

controller.actualizarLocalidad = (req, res)=>{
    user.setNickname(req.session.usuarioNickname);

    user.editarLocalidad(req.body.localidad)
    .then(resultEditLocal => {
        console.log(resultEditLocal);
        res.send("Ok");
    })
    .catch(err =>{
        console.log(err);
    })
};


controller.actualizarDatosConfiguracion = (req, res)=>{
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);

    let lCocina = req.body.lCocina;
    let lSalon = req.body.lSalon;
    let bano = req.body.bano;
    let lHab1 = req.body.lHab1;
    let lHab2 = req.body.lHab2;
    let lPlantaA = req.body.lPlantaA;
    let lPlantaB = req.body.lPlantaB;
    let alarma = req.body.alarma;
    let puertaGaraje = req.body.puertaGaraje;
    let puertaPrincipal = req.body.puertaPrincipal;
    let ventilador = req.body.ventilador;


    let nombresSensorWeb = new Array(lCocina, lSalon, bano, lHab1, lHab2, lPlantaA, lPlantaB, alarma, puertaGaraje, puertaPrincipal, ventilador);
    let nombresSensor = new Array("luzCocina","luzSalon","luzBanho","luzHab1","luzHab2","luzPasilloPA","luzPasilloPB","alarma","puertaGaraje", "puertaPrincipal", "ventilador");
    console.log(nombresSensorWeb);
    for(let i = 0; i < nombresSensorWeb.length; i++){
        console.log(nombresSensor[i] + "-------->"+nombresSensorWeb[i])
        
        user.actualizarNombSensorWeb( nombresSensor[i], nombresSensorWeb[i])
        .then(resultActualizarNombSensorWeb => {
            console.log(resultActualizarNombSensorWeb);
            //res.send("Ok");
        })
        .catch(err =>{
            console.log(err);
        })


        
    }
    
};

controller.datosLog = (req, res)=>{
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);

    user.recuperarDatosUsuarioBD()
    .then(resultDatosUsuario => {

        console.log(resultDatosUsuario);

        user.buscarNombreCasa()
        .then(resultNombCasa => {

            user.listarRegistrosCasa()
            .then(resultRegistrosCasa => {
                console.log(resultRegistrosCasa);
                var enviarDatos = {
                    datosUsuario: resultDatosUsuario,
                    nombCasa: resultNombCasa[0][0].nombCasa,
                    registrosCasa: resultRegistrosCasa
                }
                res.render("panel/logCasa", enviarDatos);

                //res.send(resultRegistrosCasa);
            })
            .catch(err =>{
                console.log(err);
            });

        })
        .catch(err =>{
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err.message);
    });

};
/*
controller.cogerDatosLog = async (req, res)=>{
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);

    user.listarRegistrosCasa()
    .then(resultRegistrosCasa => {
        console.log(resultRegistrosCasa);
        res.send(resultRegistrosCasa);
    })
    .catch(err =>{
        console.log(err);
    });
    
    
    
};

*/

controller.datosGraficasTempHum = (req, res)=>{
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);

    this.obtenerRegistrosTempHum(nombSensor, fechaInicio, fechaFin)
    .then(resultRegistrosTempHum => {
        res.send(resultRegistrosTempHum)
    })
    .catch(err =>{
        console.log(err);
    });
};

controller.datosGraficasTempHumMin = (req, res)=>{
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);

    this.tempHumMinFecha(nombSensor, fechaInicio, fechaFin)
    .then(resultRegistrosTempHum => {
        res.send(resultRegistrosTempHum)
    })
    .catch(err =>{
        console.log(err);
    });
};

controller.datosGraficasTempHumMax = (req, res)=>{
    user.setNickname(req.session.usuarioNickname);
    user.setIdCasa(req.session.idCasa);

    this.tempHumMaxFecha(nombSensor, fechaInicio, fechaFin)
    .then(resultRegistrosTempHum => {
        res.send(resultRegistrosTempHum)
    })
    .catch(err =>{
        console.log(err);
    });
};

controller.cerrarSession = (req, res)=>{
    if(req.session){
        req.session = null;       
        res.redirect("/login");
     }
};



module.exports = controller;