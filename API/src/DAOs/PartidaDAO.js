const conexion = require('../conexion');
const JugadorDAO = require('../DAOs/JugadoresDAO');

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

function guardarResultado(Gamertag, resultado, callback) {
    JugadorDAO.recuperarOponente(Gamertag, (err, jugador) => {
        if (err) {
            callback(err, null);
        } else {
            var partidasGanadas = jugador.PartidasGanadas;
            var partidasPerdidas = jugador.PartidasPerdidas;

            console.log(Gamertag);
            console.log(resultado);

            if (resultado === 1) {
                console.log("IF 1");
                partidasGanadas = partidasGanadas + 1;
                const consulta1 = 'UPDATE jugadores SET PartidasGanadas = ? WHERE Gamertag = ?';
                const valores1 = [partidasGanadas, Gamertag];

                conexion.query(consulta1, valores1, (err1, resultado1) => {
                    if (err1) {
                        callback(err1, null);
                    } else {
                        callback(null, resultado1);
                    }
                });
            } else if (resultado === 0) {
                console.log("If 2");
                partidasPerdidas = partidasPerdidas + 1;
                const consulta2 = 'UPDATE jugadores SET PartidasPerdidas = ? WHERE Gamertag = ?';
                const valores2 = [partidasPerdidas, Gamertag];

                conexion.query(consulta2, valores2, (err2, resultado2) => {
                    if (err2) {
                        callback(err2, null);
                    } else {
                        callback(null, resultado2);
                    }
                });
            }
        }
    });
}

module.exports = {
    recuperarNumPartidas,
    guardarPartida,
    guardarTurno,
    guardarResultado
}