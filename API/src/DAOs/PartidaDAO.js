const conexion = require('../conexion');

const path = require('path');
const matchmakingJSONPath = path.join(__dirname, '../data/matchmaking.json');
const partidaJSONPath = path.join(__dirname, '../data/partida.json');

function recuperarNumPartidas(callback) {
    const consulta = 'SELECT COUNT(*) FROM partida';

    conexion.query(consulta, (err, resultados) => {
        if (err) {
            return callback(err, null);
        } else {
            const numPartidas = resultados;
            callback(null, resultados)
        }
    });
}

function guardarPartida(Gamertag1, Gamertag2, callback) {
    const consulta = 'INSERT INTO partida (Gamertag1, Gamertag2) VALUES (?,?)';
    const valores = [Gamertag1, Gamertag2];

    conexion.query(consulta, valores, (err, resultado) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, resultado);
        }
    });
}

function guardarTurno(movimientos1, movimientos2, turno, idPartida, callback) {
    const consulta = 'INSERT INTO bitacora (movimientoJugador1, movimientoJugador2, turno, Partida_idPartida) VALUES (?,?,?,?)';
    const valores = [movimientos1, movimientos2, turno, idPartida];

    conexion.query(consulta, valores, (err, resultado) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, resultado);
        }
    });
}

module.exports = {
    recuperarNumPartidas,
    guardarPartida,
    guardarTurno
}