const { resolveInclude } = require("ejs");
let db = require("../database/db");
//const mysql = require("mysql2");
const conexion = db();

class Usuario{
    /**
     * JS: Usuario.js
     * BASE DE DATOS: domotizate
     * @author Sergio <sergyrp98@gmail.com>
     */
    
    nickname;
    idCasa;
    idTema;

    /**
     * Constructor - Mandar parámetros a la clase padre de conexión a la bd
     * @param string db_host   nombre del host / dominio
     * @param string db_user   nombre del usuario con acceso a la bd
     * @param string db_passwd contraseña del usuario con acceso a la bd
     * @param string db_name   nombre de la base de datos
     * @return null 
     * 
    */
    constructor()
    {
        
    }


    getNickname(){
        return this.nickname;
    }

    setNickname(nickname){
        this.nickname = nickname;
    }

    getIdCasa(){
        return this.idCasa;
    }

    setIdCasa(idCasa){
        this.idCasa = idCasa;
    }

    getIdTema(){
        return this.idCasa;
    }

    setIdTema(idTema){
        this.idTema = idTema;
    }


    toString(){
        console.log("Nickname: "+ this.nickname + "\n idCasa: "+ this.idCasa+ " \n idTema " + this.idTema);
    }

    /**
     *  Buscar si existe un usuario
     * 
     *  @access public
     *  @return boolean
     */

     buscarUsuarioBD(){
        return new Promise((resolve, reject) => {
            let resultado = "<p>\nUsuario no encontrado</p>";
            conexion.query('SELECT nickname FROM usuario WHERE nickname = ?',[this.nickname], (error, result) => {
                if(error){
                    error = [error, "<p>\n No hay coincidencias con el usuario introducido. OK</p>"];
                    return reject(error);                    
                }

                if(! (JSON.stringify(result) === "[]")){
                    resultado = [result, "<p>\nUsuario encontrado</p>"];
                }

                resolve(resultado);
            });
             
        });
    }

    
    /**
     *  Coger los datos almacenados de ese Usuario
     * 
     *  @access public
     *  @return array|boolean
     */
    recuperarDatosUsuarioBD(){
        return new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM usuario WHERE nickname = ?',[this.nickname], (error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR:No se obtuvieron los datos del usario</p>"];
                    return reject(error);  
                    console.log(this.nickname);                  
                }
                let resultado = [result, "Se han obtenido los datos del usuario", this.nickname];
                resolve(resultado);
            });
             
        });
    }

    /**
     *  Verificar si la contraseña coincide con la que hay almacenada de ese usuario
     * 
     *  @access public
     *  @return boolean
     */
    comprobarUsuarioContrasenaBD(password){            
        return new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM usuario WHERE nickname = ? AND  password = ? LIMIT 1',[this.nickname, password], (error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR:Usuario y contraseña no coinciden</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Usuario encontrado</p>"];
                resolve(resultado);
            });
             
        });
    }


    crearUsuarioBD(password, localidad){
        return new Promise((resolve, reject) => {
            conexion.query('INSERT INTO usuario VALUES ( ?, ?, ?, ?, ?)',[this.nickname, password, localidad, this.idTema, this.idCasa], (error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se pudo crear el usuario</p>"]
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Alta de usuario realizada</p>"];
                resolve(resultado);
            });
             
        });
    }

    /**
     *  Crear un usuario realizando las comprobaciones como saber si existe antes el usuario
     *  pasado, saber si pertenece a una casa o si hay que asignarle un idCasa aleatorio, 
     *  crear el tema para que pueda personalizarlo, y crear los sensores que pertenecen a
     *  esta casa asignada.
     * 
     *  @access public
     *  @return null|int
     */
    crearUsuario(nickname, password, localidad, nombCasa, idCasa){
        //Si el idCasa no esta vacío 
        return new Promise((resolve, reject) => {

            if(idCasa){          
                //Se comprueba si existe ese idCasa en la base de datos
                this.buscarIdCasa(idCasa)
                .then(resultBuscarIdCasa => {
                    console.log(resultBuscarIdCasa);
                    console.log("***************");


                    if(resultBuscarIdCasa === true){
                        //Si existe en la base de datos, se crea el usuario asignandole esa casa con el idCasa introducido
                        console.log("***************");

                        this.setIdCasa(idCasa);
                        this.crearTema()
                        .then( crearTema => {
                            console.log(crearTema); 
        
                            this.crearUsuarioBD(password, localidad)
                                .then(crearUsuarioBD => {
                                    console.log(crearUsuarioBD);
        
                                }).catch( err => {
                                    console.log(err.message);
                                    }   
                                );
        
                        }).catch( err => {
                            console.log(err.message);
                            }   
                        );
        
                    
                    }else{
                        //Si ha especificado un idCasa que no existe en la BD               
                        this.crearCasa()
                            .then( resultCrearCasa => {
                                console.log(resultCrearCasa);
                            
                                console.log(this.idCasa);
        
                                this.cambiarNombreCasa(nombCasa,this.idCasa) 
                                    .then( resultCambiarNombCasa => {
                                        console.log(resultCambiarNombCasa);   
        
                                    this.crearTema()
                                        .then( crearTema => {
                                            console.log(crearTema); 
        
                                            this.crearUsuarioBD(password, localidad)
                                                .then(crearUsuarioBD => {
                                                    console.log(crearUsuarioBD);
        
                                                    this.crearSensorTienenRegistro();
        
                                                }).catch( err => {
                                                    console.log(err.message);
                                                    }   
                                                );
        
                                        }).catch( err => {
                                            console.log(err.message);
                                            }   
                                        );
        
                                }).catch( err => {
                                    console.log(err.message);
                                    }   
                                );
        
                            }).catch( err => {
                                console.log(err.message);
                                }   
                            );  
                                        
                    }          
                }).catch( err => {
                    console.log(err.message);
                    }   
                );
                
                        
                
            }else{
                this.crearCasa()
                        .then( resultCrearCasa => {
                            console.log("<----------------------->");
                            console.log(resultCrearCasa);
                            console.log(this.idCasa);
                            console.log("<----------------------->");
                            this.cambiarNombreCasa(nombCasa,this.idCasa) 
                                .then( resultCambiarNombCasa => {
                                    console.log(resultCambiarNombCasa);   

                                this.crearTema()
                                    .then( crearTema => {
                                        console.log(crearTema); 

                                        this.crearUsuarioBD(password, localidad)
                                            .then(crearUsuarioBD => {
                                                console.log(crearUsuarioBD);

                                                this.crearSensorTienenRegistro();

                                            }).catch( err => {
                                                console.log(err.message);
                                                }   
                                            );

                                    }).catch( err => {
                                        console.log(err.message);
                                        }   
                                    );


                            }).catch( err => {
                                console.log(err.message);
                                }   
                            );

                        }).catch( err => {
                            console.log(err.message);
                            }   
                        );  
                                    
                    
            }
            resolve("ok");
        });


        /*else{
            
            echo "El id de casa no coincide con otra casa";
            echo "ID de casa asignado"; 
            //Si el idCasa no coincide con ninguno en la base de datos, se le asigna el siguiente id al último existente   
            $this->crearCasa();
            $idCasa = $this->buscarIdUltCasa();
            $this->cambiarNombreCasa($nombCasa, $idCasa);
            $this->crearTema();
            $idTema = $this->obtenerUltIdTema();
            $query = 'INSERT INTO usuario VALUES ("'.$nickname.'", "'.$password.'", "'.$localidad.'", "'.$idTema.'", "'.$idCasa.'")';
            $_SESSION['idCasa'] = $idCasa;

            $enlace = parent::conecta();
            $res = $enlace ->query($query);

            if($res === false) {
                echo "SQL Error: " . mysqli_error($enlace);
            }else{
                if($enlace->affected_rows == 0){
                    echo "<p>ERROR: No se pudo crear el usuario</p>";      
                }else{
                    echo "<p>Alta de usuario realizada</p>";      
                }
            }
            echo ' ar: '. $enlace->affected_rows.'<br>';
                
            $this->crearSensorTienenRegistro($idCasa, $nickname);


            mysqli_close($enlace);
        }

        return $idCasa;
        */
    }


    /**
     *  Para editar los valores de un usuario existente
     * 
     *  @access public
     *  @return boolean
     */
    
    editarUsuarioBD(datos){            
        return new Promise((resolve, reject) => {
            conexion.query('UPDATE usuario SET '+datos+' WHERE nickname = '+this.nickname, (error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se ha editado el usuario</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Editado correctamente el usuario</p>"];
                resolve(resultado);
            });
             
        });
    }



    editarUsuario(nickname, password, localidad, nombCasa){
        valores = [];
        (nickname ?  valores['nickname']="nickname='"+nickname+"'" : null);
        (password ?  valores['password']="password='"+password+"'" : null);
        (localidad ?  valores['localidad']="localidad='"+localidad+"'" : null);

        datos = valores.join(",");

        if(!(this.nickname)){
            resolveInclude.send("ERROR: No se especifico el usuario para modificar los cambios");
        }else{
            editarUsuarioBD() 
                .then( result => {
                    console.log(result);
                }).catch( err => {
                    console.log(err.message);
                    }   
                );
        }

        if(!(nombCasa)){                
        
            editarNombCasaBD() 
                .then( result => {
                    console.log(result);
                }).catch( err => {
                    console.log(err.message);
                    }   
                );

          
        }
        
    }
    
    editarNombCasaBD(nombCasa){            
        return new Promise((resolve, reject) => {
            conexion.query('UPDATE usuario SET nombcasa = ? WHERE nickname = ?', [nombCasa, this.nickname], (error, result) => {
                if(error){
                    error = [error, "<p>\nERROR: No se ha editado el nombre de la casa</p>"];
                    return reject(error);                    
                }
                let resultado  = [resultado, "<p>\nEditado correctamente el nombre de la casa</p>"];
                resolve(resultado);
            });
             
        });
    }


    /**
     *  Para borrar un usuario existente 
     * 
     *  @access public
     *  @return null
     */
    borrarUsuarioBD(){
        return new Promise((resolve, reject) => {
            conexion.query('DELETE FROM usuario WHERE id = ?', [this.nickname], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha realizado la baja</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Baja realizazada</p>"];
                resolve(resultado);
            });
             
        });
    }

    /**
     *  Crear un registro en la tabla “Casa”
     * 
     *  @access public
     *  @return null
     */
    crearCasa(){
        return new Promise((resolve, reject) => {
            conexion.query('INSERT INTO casa (idCasa) VALUES(0)', (error, result) => {
                if(error){
                    error =  [error, "<p>ERROR: No se ha creado la casa</p>"]
                    return reject(error);                    
                }
                let resultado = [result, "<p>Casa creada</p>"];
                this.idCasa = result.insertId;
                resolve(resultado);
            });
             
        });
       
    }

    /**
     *  Obtener nombre de la casa
     * 
     *  @access public
     *  @return array
     */
    buscarNombreCasa(){
        return new Promise((resolve, reject) => {
            conexion.query('SELECT nombCasa FROM casa WHERE idCasa = ?  LIMIT 1', [this.idCasa], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha encontrado el nombre de la casa</p>"]
                    return reject(error);                    
                }
                let resultado = [result, "<p>Se ha encontrado el nombre de la casa</p>"];
                resolve(resultado);
            });
        });
        
    }

    
    /**
     *  Cambiar el nombre de la casa
     * 
     *  @access public
     *  @return null
     */
    cambiarNombreCasa(nombCasa){
        console.log("----------------");
        console.log(this.idCasa);
        return new Promise((resolve, reject) => {
            conexion.query('UPDATE casa SET nombCasa= ? WHERE idCasa = ?', [nombCasa, this.idCasa], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha podido cambiar el nombre de la casa</p>"]
                    return reject(error);                    
                }
                let resultado = [result, "<p>Se ha cambiado el nombre de la casa</p>"];
                resolve(resultado);
            });
             
        });
    }

    /**
     * Obtener el ID de la casa de un usuario en concreto
     * 
     *  @access public
     *  @return int
     */
    buscarIdCasaNickname(){
        return new Promise((resolve, reject) => {
            conexion.query('SELECT idCasa FROM usuario WHERE nickname = ? LIMIT 1', [this.nickname], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha encontrado el id de la casa de este usuario</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Se ha encontrado el id de la casa de este usuario</p>"];
                resolve(resultado);
            });
             
        });

    }

    /**
     * Buscar si el id de la casa existe
     * 
     *  @access public
     *  @return boolean
     */

    buscarIdCasaBD(){
        return new Promise((resolve, reject) => {
            let resultado = "<p>No Se ha encontrado el id de la casa</p>";
            conexion.query('SELECT * FROM casa WHERE idCasa = ? LIMIT 1', [this.idCasa], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha encontrado el id de la casa</p>"];
                    return reject(error);                    
                }

                if(! (JSON.stringify(result) === "[]")){
                    resultado = [result, "<p>Se ha encontrado el id de la casa</p>"];
                }
                resolve(resultado);
            });
             
        });

    }
    
    buscarIdCasa(idCasa){
            // isNaN --> si es un numero devuelve false
            //Si es true --> es texto
            if( (idCasa == false) || ( (isNaN(idCasa))) ){
                console.log("NO HAS INSERTADO ID CASA");
                resolve(false);
            }else{
                console.log(" HAS INSERTADO ID CASA");
                return this.buscarIdCasaBD()
                        .then( result => {
                            console.log(result);
                            
                            if(result != "<p>No Se ha encontrado el id de la casa</p>"){
                                console.log("<p>Se ha encontrado la casa</p>");
                                return true;
                            }else{
                                console.log("<p>ERROR: No se ha encontrado el ID de la Casa</p>");
                                return false;
                            }

                        } )
                        .catch( err => {
                            console.log(err.message);
                            console.log("<p>ERROR: No se ha encontrado el ID de la Casa</p>");
                            return false;
                        }
                ); 
            }  

         
    }

        /**
     * Obtener el último ID registrado de la tabla “Casa”
     * 
     *  @access public
     *  @return int
     */
    buscarIdUltCasa(){
        return new Promise((resolve, reject) => {
            conexion.query('SELECT idCasa FROM casa ORDER BY idCasa DESC LIMIT 1', (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha encontrado ningún ID de la casa</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Se ha encontrado el ultimo ID de la casa</p>"];
                resolve(resultado);
            });
             
        });
        
    }

     /**
     * Editar Localidad de un usuario
     * 
     *  @access public
     *  @return boolean
     */
    editarLocalidad(localidad){
        return new Promise((resolve, reject) => {
            conexion.query("UPDATE  usuario SET localidad = ? WHERE nickname = ?", [localidad, this.nickname], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha actualizado la localidad</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Localidad actualizada</p>"]
                resolve(resultado);
            });
             
        });
      
    }

    /**
     * Crear un registro con el valor del sensor y el nickname que ha realizado la petición
     * 
     *  @access public
     *  @return boolean
     */
    crearRegistro(valor){
        (valor == "NULL" ? valor = 'NULL': valor = valor);        
        return new Promise((resolve, reject) => {
            conexion.query("INSERT INTO registro (valor, nickname) VALUES(?, ?)", [valor, this.nickname], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha creado el registro</p>"]
                    return reject(error);                    
                }
                let resultado = [result, "<p>Registro creado</p>"];
                resolve(resultado);
            });
             
        });

     
    }

    /**
     * Recuperar el último ID de la tabla “Registro”
     * 
     *  @access public
     *  @return int
     */
    obtenerUltRegistro(){
        return new Promise((resolve, reject) => {
            conexion.query("SELECT idRegistro FROM registro WHERE nickname = ? ORDER BY idRegistro DESC LIMIT 1", [this.nickname], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha obtenido el último registro</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Registro obtenido</p>"];
                resolve(resultado);
            });
             
        });
 
    }

    /**
     * Modificar un valor de un registro
     * 
     *  @access public
     *  @return boolean
     */        
    actualizarRegistro(idRegistro, valor){
        return new Promise((resolve, reject) => {
            conexion.query("UPDATE registro SET valor = ? WHERE idRegistro = ?", [valor, idRegistro], (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha actualizado el registro</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Registro actualizado</p>"]
                resolve(resultado);
            });
             
        });

    }

    /**
     * Ver todos los registros creado relacionados a una Casa
     * 
     *  @access public
     *  @return object
     */  
    listarRegistrosCasa(){
        if(!(this.idCasa)){
            return new Promise((resolve, reject) => {
                conexion.query("SELECT sensor.nombsensor, registro.fechaRegistro, registro.valor, registro.nickname"+
                            "FROM registro"+
                            "INNER JOIN tienen ON tienen.idRegistro = registro.idRegistro"+
                            "INNER JOIN sensor ON tienen.idSensor = sensor.idSensor"+
                            "INNER JOIN casa ON casa.idCasa = sensor.idCasa"+
                            "WHERE casa.idCasa =$idCasa"+
                            "ORDER BY fechaRegistro DESC", (error, result) => {
                    if(error){
                        error = [error, "<p>No se han obtenido los registros de la casa</p>"]
                        return reject(error);                    
                    }
                    let resultado = [result, "<p>Registro actualizado</p>"];
                    resolve(resultado);
                });
                 
            });
        
        }else{
           return "ERROR: No se pudo obtener el listado de registros de la casa porque no se tiene el IdCasa";
        }
    }

    /**
     * Permite añadir un sensor
     * 
     *  @access public
     *  @return boolean
     */  
    crearSensor(nombSensor){
        return new Promise((resolve, reject) => {
            conexion.query("INSERT INTO sensor VALUES(0, ?, NULL, ? )", [nombSensor, this.idCasa],  (error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha creado el sensor</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Sensor creado</p>"];
                resolve(resultado);
            });
             
        });  

    }

    
    /**
     * Buscar si el nombre del sensor de una casa coincide con con otro sensor
     * 
     *  @access public
     *  @return boolean
     */  
    buscarExisteNombSensor(nombSensor){
        return new Promise((resolve, reject) => {
            conexion.query("SELECT idSensor FROM sensor WHERE nombSensor = ? AND idCasa = ? LIMIT 1", [nombSensor, this.idCasa],(error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha encontrado ningún ID de la casa</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Se ha encontrado el ultimo ID de la casa</p>"];
                resolve(resultado);
            });
             
        });  
        
    }

    /**
    * Recuperar el IDa partir del nombre del sensor de una casa
    * 
    *  @access public
    *  @return int
    */  
    buscarIdSensorNomb( nombSensor){

        return new Promise((resolve, reject) => {
            conexion.query("SELECT idSensor FROM sensor WHERE nombSensor = ? AND idCasa =  ? LIMIT 1", [nombSensor, this.idCasa],(error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha encontrado ningún ID del sensor</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "<p>Se ha encontrado el  ID del sensor</p>"] ;
                resolve(resultado);
            });
             
        });  
    
    }


    /**
    *  Cambiar el nombre del sensor que aparece en la página Web
    * 
    *  @access public
    *  @return boolean
    */  
    actualizarNombSensorWeb(nombSensor, valor){
        
        return new Promise((resolve, reject) => {
            conexion.query("UPDATE sensor SET nombSensorWeb = ? WHERE idCasa = ? AND  nombSensor = ? ", [valor, this.idCasa,  nombSensor],(error, result) => {
                if(error){
                    error = [error, "<p>ERROR: No se ha actualizado el nombre del sensor en la web</p>"]
                    return reject(error);                    
                }
                let resultado = [result, "<p>Actualizado nombre del sensor en la web</p>"]
                resolve(resultado);
            });
             
        });  
        
    }

    /**
    *  Asociar el “idSensor” con el “idRegistro”
    * 
    *  @access public
    *  @return boolean
    */  
    crearTienen(idSensor, idRegistro){        
        return new Promise((resolve, reject) => {
            conexion.query("INSERT INTO tienen VALUES(?, ?)", [idSensor, idRegistro],(error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se ha asignado el sensor a un registro</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Sensor asignado al registro correctamente</p>"];
                resolve(resultado);
            });
             
        });  
    }

    /**
    *  Se crean los sensores que tiene una casa por defecto, y se crea un
    * registro de la tabla “Registro” con un valor por defecto, y se asocian
    * los sensores con los registros
    * 
    *  @access public
    *  @return null
    */  
    crearSensorTienenRegistro(){            
        //Al crear la casa se crearan y se asignaran los sensores y el registro, que permite tener un historial
        //de todos los eventos con los sensores 
        //Se inicializa, para que cuando se cree el usuario, tenga un valor inicial y no de errores al entrar 
        //a la página de inicio del panel

        let nombreSensores = ["arduino","ascensor", "ventilador", "puertaGaraje", "puertaPrincipal", "alarma", "luzPasilloPB", "luzPasilloPA",
        "luzCocina",  "luzSalon", "luzBanho", "luzHab1", "luzHab2", "luzInteriorGaraje", "luzVerdeGaraje", "luzRojaGaraje"];         
        console.log(nombreSensores);
        console.log(nombreSensores.length);

        for(let i = 0; i < nombreSensores.length; i++){
            let valorSensorDefecto = 0;

            if(nombreSensores[i] == "puertaGaraje" || nombreSensores[i] == "puertaPrincipal" ||  nombreSensores[i] == "alarma"){
                valorSensorDefecto = "E";
            }

            console.log("---------------------------");
            console.log(nombreSensores[i]);
            console.log(valorSensorDefecto);
            console.log("---------------------------");

            this.crearRegistro(valorSensorDefecto)
            .then( resultCrearRegistro => {
                console.log(resultCrearRegistro);
                console.log(resultCrearRegistro[0].insertId);
                
                this.crearSensor(nombreSensores[i])
                    .then( resultNombSensores => {
                        console.log(resultNombSensores);

                        this.crearTienen(resultNombSensores[0].insertId,  resultCrearRegistro[0].insertId)
                            .then( resultTienen => {
                                console.log(resultTienen);
                            } ).catch( err => {
                                console.log(err.message);
                                }   
                            );

                    } ).catch( err => {
                        console.log(err.message);
                        }   
                    );

            } ).catch( err => {
                console.log(err.message);
                }   
            );
        
        }
        
    }

    /**
    *  Crea un registro en la tabla “Registro”, y se asocia con el sensor.
    * 
    *  @access public
    *  @return null
    */  
    crearTienenRegistro(nombSensor, valor){            
        //Al crear la casa se crearan y se asignaran los sensores y el registro, que permite tener un historial
        //de todos los eventos con los sensores 
        //Se inicializa, para que cuando se cree el usuario, tenga un valor inicial y no de errores al entrar 
        //a la página de inicio del panel
        
        
        this.crearRegistro(valor)
        .then( resultCrearRegistro => {
            console.log(resultCrearRegistro);
           
            let ultRegistro = resultCrearRegistro[0].insertId;
            console.log(ultRegistro);
            console.log(nombSensor);
            this.buscarIdSensorNomb(nombSensor)
                .then( resultIdSensorNomb => {
                    console.log(resultIdSensorNomb);
                    console.log(resultIdSensorNomb[0][0].idSensor);

                    this.crearTienen(resultIdSensorNomb[0][0].idSensor,  ultRegistro)
                            .then( resultTienen => {
                                console.log(resultTienen);
                            } ).catch( err => {
                                console.log(err.message);
                                }   
                            );

                } ).catch( err => {
                    console.log(err.message);
                    }   
                    );

        } ).catch( err => {
            console.log(err.message);
            }   
        );
    
        
    }



    /**
    *  Se muestran todos los valores de los sensores de la casa
    * 
    *  @access public
    *  @return array
    */  
    valoresSensores(idSensor){        
        console.log(idSensor);
        return new Promise((resolve, reject) => {
            conexion.query("SELECT * FROM sensor INNER JOIN tienen ON tienen.idSensor = sensor.idSensor INNER JOIN registro ON registro.idRegistro = tienen.idRegistro WHERE tienen.idSensor = ? ORDER BY registro.fechaRegistro DESC LIMIT 1", [idSensor],(error, resultValorSensor) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se han encontrado valores para el sensor</p>"];
                    return reject(error);                    
                }
                //console.log(resultValorSensor);
                let resultado = [resultValorSensor, "\n<p>Se han encontrado valores del sensor</p>"];

                resolve(resultValorSensor);
            });  
             
        });  
    }

    listarSensoresValoresPorCasa(){            
    let datosSensores=[];

      return new Promise((resolve, reject) => {

        conexion.query("SELECT idSensor FROM sensor WHERE idCasa = ?", [this.idCasa] ,(error, result) => {
                        if(error){
                            error = [error, "\n<p>ERROR: No se han encontrado valores para el sensor</p>"];
                            return reject(error);                    
                        }

                        for(let i = 0; i < result.length; i++){
                            let sensores = result[i].idSensor;
                            //console.log(sensores);

                            this.valoresSensores(sensores)
                            .then(resultValorSensor => {
                                console.log(resultValorSensor);
                                datosSensores.push(resultValorSensor);
                            })
                            .catch(err => {
                                console.log(err);
                            });

                        }

                        resolve(datosSensores);
                    });    
              
        });     
    }  


    /**
    *  Mostrar valores por nombre del sensor
    * 
    *  @access public
    *  @return array|null
    */  
    listarValorSensorPorNombre(nombSensor){
        if(this.idCasa){
            return new Promise((resolve, reject) => {

                    console.log(idSensor);
                    return new Promise((resolve, reject) => {
                        conexion.query("SELECT * FROM sensor INNER JOIN tienen ON tienen.idSensor = sensor.idSensor INNER JOIN registro ON registro.idRegistro = tienen.idRegistro WHERE sensor.`nombSensor` = ? AND sensor.idCasa = ? ORDER BY registro.fechaRegistro ORDER BY registro.fechaRegistro DESC LIMIT 1",  [nombSensor, this.idCasa],(error, resultValorSensor) => {
                            if(error){
                                error = [error, "\n<p>ERROR: No se han encontrado valores para el sensor por Nombre</p>"];
                                return reject(error);                    
                            }
                            console.log(resultValorSensor);
                            let resultado = [resultValorSensor, "\n<p>Se han encontrado valores del sensor por Nombre</p>"];
            
                            resolve(resultado);
                        });  
                         
                    });  
             
            });  
        
        }else{
            return  "No se han obtenido el valor del sensor de la casa, porque el idCasa está vacío";
        }
    }

    /**
    *  Mostrar los nombres de los sensores que aparecerán en la Página Web
    * 
    *  @access public
    *  @return array|null
    */  
    listarNombresSensoresWeb(){
        if(this.idCasa){
            return new Promise((resolve, reject) => {
                conexion.query("SELECT nombSensor, nombSensorWeb" +
                                "FROM sensor" +
                                "WHERE idCasa = ?", [this.idCasa],(error, result) => {
                        if(error){
                            error = [error, "\n<p>ERROR: No se han encintrado los valores para todos los sensores</p>"];
                            return reject(error);                    
                        }
                        resultado = [result, "\n<p>Se han encontrado los valores de todos los sensores</p>"]
                        resolve(resultado);
                    });
                     
                });  
        }else{
            return  "No se han obtenido los valores de los sensores de la casa, porque el idCasa está vacío";
        }
    }

    /**
    *  Crear un tema para un usuario
    * 
    *  @access public
    *  @return boolean
    */  
    crearTema(){
        return new Promise((resolve, reject) => {
            conexion.query("INSERT INTO tema (idTema) VALUES(0)",(error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se ha creado el TEMA</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Tema Creado</p>"];
                this.idTema = result.insertId;
                resolve(resultado);
            });
             
        });  
    }

        /**
    *  Coger el ID del último registro de la tabla “Tema”
    * 
    *  @access public
    *  @return array
    */  
    obtenerUltIdTema(){
        return new Promise((resolve, reject) => {
            conexion.query("SELECT idTema FROM tema ORDER BY idTema DESC LIMIT 1",(error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se ha encontrado ningún ID del tema</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Se ha encontrado el ultimo ID del tema</p>"];
                resolve(resultado);
            });
             
        });  
        
    }
    

    /**
    *  Obtener el “idTema” de un usuario
    * 
    *  @access public
    *  @return int
    */  
    obtenerIdTemaUsuario(){
        return new Promise((resolve, reject) => {
            conexion.query("SELECT idTema FROM usuario WHERE nickname = ?", [this.nickname],(error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se ha encontrado ningún ID del tema que pertenezca a este nickname pasado</p>"]
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Se ha encontrado el  ID del tema  que pertenece a este nickname</p>"];
                resolve(resultado);
            });
             
        });  
    }

    /**
    *  Cambiar los valores de un tema de un usuario
    * 
    *  @access public
    *  @return boolean
    */  
    modificarTemaBD(datos){
        return new Promise((resolve, reject) => {
            conexion.query("UPDATE tema SET "+ datos +" WHERE idTema = ?", [this.idTema],(error, result) => {
                if(error){
                    error = [error, "\n<p>ERROR: No se ha modificado el tema del usuario</p>"];
                    return reject(error);                    
                }
                let resultado = [result, "\n<p>Se ha modificado el tema del usuario</p>"]
                resolve(resultado);
            });
             
        });  
    }

    modificarTema( colorFondoPagPanel, colorFondoPanel, colorTitulosPanel, colorNombSensores, tamanoLetraTit, tamanoLetraNombSensores ){
        let valores = new Array();
        (colorFondoPagPanel ?  valores['colorFondoPagPanel']="colorFondoPagPanel='" + colorFondoPagPanel + "'" : valores['colorFondoPagPanel']="colorFondoPagPanel=NULL");
        (colorFondoPanel ?  valores['colorFondoPanel']="colorFondoPanel='" + colorFondoPanel + "'": valores['colorFondoPanel']="colorFondoPanel=NULL");
        (colorTitulosPanel ?  valores['colorTitulosPanel']="colorTitulosPanel='" + colorTitulosPanel + "'" : valores['colorTitulosPanel']="colorTitulosPanel=NULL");
        (colorNombSensores ?  valores['colorNombSensores']="colorNombSensores='" + colorNombSensores + "'" : valores['colorNombSensores']="colorNombSensores=NULL");
        (tamanoLetraTit ?  valores['tamanoLetraTit']="tamanoLetraTit='" + tamanoLetraTit + "'": valores['tamanoLetraTit']="tamanoLetraTit=NULL");
        (tamanoLetraNombSensores ?  valores['tamanoLetraNombSensores']="tamanoLetraNombSensores='" + tamanoLetraNombSensores + "'" : valores['tamanoLetraNombSensores']="tamanoLetraNombSensores=NULL");
        
        //let datos = valores['colorFondoPagPanel'] + ", " +valores['colorFondoPanel'];
        let datos= "";
        //Coger longitud de un array asociativo
        console.log(Object.getOwnPropertyNames(valores).length - 1); 
        for (var propiedad in valores){
            datos = datos + " " + valores[propiedad] + ",";
        }

        datos = datos.substring(1, datos.length - 1);
        console.log(datos);


        this.modificarTemaBD(datos)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
       

    }

        /**
        *  Coger todos los datos de un tema
        * 
        *  @access public
        *  @return array|null
        */  
        obtenerDatosTema(){
            if(this.idTema){
                return new Promise((resolve, reject) => {
                    conexion.query("SELECT * FROM tema WHERE idTema = ?", [this.idTema],(error, result) => {
                        if(error){
                            error = [error, "\n<p>ERROR: No se han obtenido los valores del tema</p>"]
                            return reject(error);                    
                        }
                        let resultado = [result, "\n<p>Se han obtenido los valores del tema</p>"];
                        resolve(resultado);
                    });
                     
                }); 

            }
        }

        /**
        *   Coger todos los registros de la temperatura y de la humedad comprendido entre 2 fechas
        * 
        *  @access public
        *  @return array|null
        */  
       /*
          function obtenerRegistrosTempHum(int $idCasa, String $nombSensor,String $fechaInicio, String $fechaFin){
            $registros = Array();
            if(!empty($idCasa)){
                $query="SELECT * 
                    FROM `tienen` 
                    INNER JOIN sensor on sensor.idSensor = tienen.idSensor
                    INNER JOIN registro on registro.idRegistro = tienen.idRegistro
                    WHERE nombSensor = '".$nombSensor."' AND sensor.idCasa = $idCasa AND (fechaRegistro BETWEEN '".$fechaInicio."' AND '".$fechaFin."')
                    ORDER BY `registro`.`fechaRegistro` ASC";
                
                        
                if($res = parent::conecta()->query($query)) {   
                    while($fila = mysqli_fetch_array($res)){
                        $registros[] = array('idRegistro'=>$fila['idRegistro'], "fechaRegistro" => $fila['fechaRegistro'], "valor"=>$fila['valor']);
                    }
                    return $registros;
                }else{
                    echo "No se han obtenido los registros del sensor TemperaturaHumedad para las gráficas";
                }
            }
        }


        */

         /**
        *   Obtener la temperatura o la humedad mínima entre 2 fechas
        * 
        *  @access public
        *  @return int|null
        */  
        tempHumMinFecha(nombSensor, fechaInicio, fechaFin){
 
            if(this.idCasa){
                return new Promise((resolve, reject) => {
                    conexion.query("SELECT * " +
                                    "FROM `tienen`" +
                                    "INNER JOIN sensor on sensor.idSensor = tienen.idSensor" +
                                    "INNER JOIN registro on registro.idRegistro = tienen.idRegistro" +
                                    "WHERE nombSensor = ? AND sensor.idCasa = $idCasa AND (fechaRegistro BETWEEN ? AND ?')"+
                                    "ORDER BY CAST(`valor` AS UNSIGNED) ASC LIMIT 1", [nombSensor, fechaInicio,fechaFin],(error, result) => {
                        if(error){
                            error = [error, "\n<p>ERROR: No se han obtenido el valor mínimo del sensor TemperaturaHumedad para las gráficas</p>"]
                            return reject(error);                    
                        }
                        let resultado = [result, "\n<p>Se obtenido el valor mínimo del sensor TemperaturaHumedad para las gráficas</p>"];
                        resolve(resultado);
                    });
                     
                });  
                
            }
        }

        /**
        *    Obtener la temperatura o la humedad máxima entre 2 fechas
        * 
        *  @access public
        *  @return array|null
        */  
        tempHumMaxFecha(nombSensor, fechaInicio, fechaFin){
 
            if(this.idCasa){
                return new Promise((resolve, reject) => {
                    conexion.query("SELECT *" + 
                                "FROM `tienen` " +
                                "INNER JOIN sensor on sensor.idSensor = tienen.idSensor" +
                                "INNER JOIN registro on registro.idRegistro = tienen.idRegistro" +
                                "WHERE nombSensor = ? AND sensor.idCasa = ? AND (fechaRegistro BETWEEN ? AND ?)"+
                                "ORDER BY CAST(`valor` AS UNSIGNED) DESC LIMIT 1", [nombSensor, idCasa, fechaInicio,fechaFin],(error, result) => {
                        if(error){
                            error = [error, "\n<p>ERROR:No se han obtenido el valor máximo del sensor TemperaturaHumedad para las gráficas</p>"];
                            return reject(error);                    
                        }
                        let resultado = [resultado, "\n<p>Se han obtenido el valor máximo del sensor TemperaturaHumedad para las gráficas</p>"];
                        resolve(resultado);
                    });
                });  
  
            }
        }



  
  

}


//module.exports = new Usuario();
module.exports =  Usuario;
