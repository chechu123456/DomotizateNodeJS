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
    constructor(nickname)
    {
        this.nickname = nickname;
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
        console.log("Nickname: "+ this.nickname + "\n idCasa: "+ idCasa+ " idTema " + idTema);
    }
    /**
     *  Buscar si existe un usuario
     * 
     *  @access public
     *  @return boolean
     */

     buscarUsuario(){
        return new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM usuario WHERE nickname = ?',[this.nickname], (error, result) => {
                if(error){
                    return reject(error);
                    
                }
                resolve(result);
            });
        });
    }

/*

    buscarUsuario(){
        let query =  conexion.query('SELECT * FROM usuario WHERE nickname = ?',[this.nickname] ,  function(error, result){
            if(error){
                throw error;
            }else{
                onResults(result);
            }
        });
*/      
       
    
        
/*
        req.getConnection((err, conn) =>{
            conn.query('SELECT nickname FROM usuario WHERE nickname = "'+nickname+'" LIMIT 1', (err, usuario) => {
                if(err){
                    res.json(err);
                    //Recomendable manejar errores con next()
                }
              
                console.log(usuario[0].nickname);
                if(JSON.stringify(usuario)!='[]'){
                    console.log("Tiene datos");
                    res.send( "<p>\nUsuario encontrado</p>");
                }else{
                    res.send("<p>\n No hay coincidencias con el usuario introducido. OK</p>");
                }
          
            });


        });
    }
*/        


}


//module.exports = new Usuario("Sergio");
module.exports =  Usuario;
