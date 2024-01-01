const conn = {
    "development": {
        database: "residence",
        username:"root",
        password:"",
        host: "localhost",
        port: 3306,
        dialect: "mysql",    
        logging: false
    },
    "test": {
        database: "residence",
        username:"root",
        password:"",
        host: "localhost",
        port: 3306,
        dialect: "mysql",
    },
    "production": {
        database: "residence",
        username:"root",
        password:"",
        host: "localhost",
        port: 3306,
        dialect: "mysql",
    }

};
module.exports = conn;