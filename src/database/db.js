const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({path: './env/.env'});

class Db{

    host;
    user;
    password;
    port;
    database;
    
    constructor(host, user,password,port,database){
        host;
        user;
        password;
        port;
        database;
    }

    conexion(){
        return conexion =mysql.createConnection ({
            host: "localhost",
            user: "root",
            password: "",
            port:"3306",
            database: "domotizate"
        }, "single");
    
        conexion.connect((error) => {
            if(error){
                console.log("El error de la conexión es: "+ error)
                return
            }
    
            console.log("Conectado a la base de datos");
        });
    }

    termminarConexion(){
        
    }
    
}

module.exports = Db;

