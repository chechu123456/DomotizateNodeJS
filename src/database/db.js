const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({path: './env/.env'});

module.exports = () => {
    return mysql.createConnection ({
        host: "localhost",
        user: "root",
        password: "",
        port:"3306",
        database: "domotizate"
    }, "single");
/*
        conexion.connect((error) => {
        if(error){
            console.log("El error de la conexión es: "+ error)
            
        }

        console.log("Conectado a la base de datos");
    });

*/
}

 
    


