const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({path: './env/.env'});

module.exports = () => {
    return  mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        port:"3306",
        database: "domotizate"
    });

}

 
    


