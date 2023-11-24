let mysql = require('mysql');

let conexion = mysql.createConnection({
    host: 'localhost',
    database: 'feitactics',
    user: 'superuser',
    password: 'superuserpassword'
});

conexion.connect(function(err) {
    if (err) {
        throw err;
    } else {
        console.log('Conexión Exitosa');
    }
});

module.exports = conexion;