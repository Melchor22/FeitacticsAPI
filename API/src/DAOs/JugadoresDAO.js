const conexion = require('../conexion');

function iniciarSesion(gamertagInicio, contraseniaInicio, callback) {
    const consulta = 'SELECT * FROM jugadores j WHERE BINARY j.Gamertag = ? AND BINARY j.contrasenia = ?';
    const valores = [gamertagInicio, contraseniaInicio];

    conexion.query(consulta, valores, (err, resultados) => {
        if (err) {
            return callback(err, null);
        } else {
            const jugadorEncontrado = resultados.length > 0 ? resultados[0] : null;
            callback(null, jugadorEncontrado);
        }
    });
}

function recuperarImagenPerfil(idFoto, callback) {
    const consulta = 'SELECT * FROM fotosperfil WHERE BINARY idFoto = ?';
    const valores = [idFoto];

    conexion.query(consulta, valores, (err, resultados) => {
        if (err) {
            return callback(err);
        } else {
            const imagenEncontrada = resultados.length > 0 ? resultados[0] : null;
            callback(null, imagenEncontrada);
        }
    });
}

function recuperarImagenesPerfil(callback) {
    const consulta = 'SELECT * FROM fotosperfil'

    conexion.query(consulta, (err, resultados) => {
        if (err) {
            return callback(err, null);
        }

        const imagenesPerfil = resultados.map(resultado => ({
            IDFoto: resultado.IDFoto,
            Foto: resultado.Foto ? resultado.Foto.toString('base64') : null
        }));

        console.log(imagenesPerfil[0].Foto);
        callback(null, imagenesPerfil);
    });
}

function modificarImagenPerfil(gamertag, idFoto, callback) {
    console.log(gamertag);
    console.log(idFoto);
    const consulta = 'UPDATE jugadores SET IDFoto = ? WHERE Gamertag = ?'
    const valores = [idFoto, gamertag]

    conexion.query(consulta, (err, resultados) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, resultados);
        }
    })
}

function registrarJugador(gamertag, contrasenia, idFoto, callback) {
    console.log(gamertag);
    console.log(contrasenia);
    console.log(idFoto);
    const consulta = `INSERT INTO jugadores (Gamertag, contrasenia, IDFoto) 
                      VALUES (?, ?, ?)`;
    const valores = [gamertag, contrasenia, idFoto];

    conexion.query(consulta, valores, (err, resultado) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, resultado);
        }
    });
}

function modificarMazo(Gamertag, Mazo, callback) {
    console.log(Gamertag);
    console.log(Mazo);
    const consulta = `UPDATE jugadores SET Mazo = ? WHERE Gamertag = ?`;
    const valores = [Mazo, Gamertag];

    conexion.query(consulta, valores, (err, resultado) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, resultado);
        }
    });
}

function desbloquearCarta(gamertag, idCarta, callback) {
    console.log(gamertag);
    console.log(idCarta);
    const consulta = `INSERT INTO jugadorescartas (Gamertag, IDCarta, Usos) 
    VALUES (?, ?, ?)`
    const valores = [gamertag, idCarta, 0]

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
    desbloquearCarta,
    recuperarImagenPerfil,
    recuperarImagenesPerfil,
    modificarImagenPerfil,
    modificarMazo,
    cerrarConexion
};