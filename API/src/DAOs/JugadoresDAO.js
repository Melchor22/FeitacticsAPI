const conexion = require('../conexion');

function iniciarSesion(gamertag, contrasenia, callback) {
    const consulta = 'SELECT * FROM jugadores WHERE BINARY Gamertag = ? AND BINARY contrasenia = ?';
    const valores = [gamertag, contrasenia];

    conexion.query(consulta, valores, (err, resultados) => {

        if (err) {
            return callback(err, null);
        }
        
        const jugadorEncontrado = resultados.length > 0 ? resultados[0] : null;
        callback(null, jugadorEncontrado);
    });
}

function registrarJugador(gamertag, contrasenia, callback) {
    console.log(gamertag);
    console.log(contrasenia);
    const consulta = `INSERT INTO jugadores (Gamertag, contrasenia) 
                      VALUES (?, ?)`;
    const valores = [gamertag, contrasenia];

    conexion.query(consulta, valores, (err, resultado) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, resultado);
        }
    });
}

function cerrarConexion() {
    conexion.end(err => {
        if (err) {
            console.error('Error al cerrar la conexión:', err);
        } else {
            console.log('Conexión cerrada correctamente.');
        }
    });
}

module.exports = {
    iniciarSesion,
    registrarJugador,
    cerrarConexion
};