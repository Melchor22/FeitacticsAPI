const conexion = require('../conexion');

function iniciarSesion(gamertagInicio, contraseniaInicio, callback) {
    const consulta = 'SELECT * FROM jugadores j WHERE BINARY j.Gamertag = ? AND BINARY j.contrasenia = ?';
    const valores = [gamertagInicio, contraseniaInicio];

    conexion.query(consulta, valores, (err, resultados) => {
        if (err) {
            return callback(err, null);
        } else {
            console.log(resultados);
            const jugadorEncontrado = resultados.length > 0 ? resultados[0] : null;
            console.log(jugadorEncontrado);
            callback(null, jugadorEncontrado);
        }
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