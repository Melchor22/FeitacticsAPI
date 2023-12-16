const { Router } = require('express');
const router = Router();
const fs = require('fs');
const bodyParser = require('body-parser');
const PartidaDAO = require('../DAOs/PartidaDAO');

const path = require('path');
const matchmakingJSONPath = path.join(__dirname, '../data/matchmaking.json');
const partidaJSONPath = path.join(__dirname, '../data/partida.json');

router.post('/solicitarpartida', (req, res) => {
    //Recuperar Archivos JSON
    let archivoMatchmaking = [];
    let archivoPartida = [];

    try {
        archivoMatchmaking = require(matchmakingJSONPath);
    } catch (error) {
        console.error('Error al leer el archivo JSON: ', error);
        res.status(500).send('Error al leer el archivo JSON.');
        return;
    }

    try {
        archivoPartida = require(partidaJSONPath);
        console.log(archivoPartida);
    } catch (error) {
        console.error('Error al leer el archivo JSON: ', error);
        res.status(500).send('Error al leer el archivo JSON.');
        return;
    }

    //Comprobar si ya existe una partida o el jugador recibido ya existe en una partida
    if (archivoPartida.length > 0 && (archivoPartida.some(jugador => jugador.Jugador1 === req.body.Gamertag) || archivoPartida.some(jugador => jugador.Jugador2 === req.body.Gamertag)) ) {
        console.log('Archivo lleno');
        
        const jugadorEnPartida = archivoPartida.find(jugador =>
            jugador.Jugador1 === req.body.Gamertag || jugador.Jugador2 === req.body.Gamertag
        );

        if (req.body.Gamertag === jugadorEnPartida.Jugador1) {
            res.status(400).send({"Gamertag": jugadorEnPartida.Jugador2});
        } else if (req.body.Gamertag === jugadorEnPartida.Jugador2) {
            res.status(400).send({"Gamertag": jugadorEnPartida.Jugador1});
        } else {
            res.status(404).send("No encontrado");
        }
    } else {
        console.log('Archivo vacío');

        //Comprobar cuantos jugadores tiene la sala de espera
        if (archivoMatchmaking.length < 2) {
            const existeRegistro = archivoMatchmaking.some(jugador => jugador.Gamertag === req.body.Gamertag);
    
            if (existeRegistro) {
                res.status(400).send('Ya se solicitó la partida.');
            } else {
                archivoMatchmaking.push(req.body);
                try {
                    fs.writeFileSync(matchmakingJSONPath, JSON.stringify(archivoMatchmaking, null, 2));
                    res.status(200).send('Solicitud Guardada.');
                } catch (error) {
                    res.status(500).send('Error al escribir el archivo JSON.');
                }
            }
        } else {

            let archivoPartida = [];
    
            try {
                archivoPartida = require(partidaJSONPath);
            } catch (error) {
                console.error('Error al leer el archivo JSON: ', error);
                res.status(500).send('Error al leer el archivo JSON.');
                return;
            }

            const numPartidasGuardadas = 0;
            PartidaDAO.recuperarNumPartidas((err, numPartidas) => {
                if (err) {
                    return res.status(500).send('Error al escribir los archivos JSON');
                } else {
                    numPartidasGuardadas = numPartidas;
                }
            });
    
            let contenidoPartida = {
                "idPartida": numPartidasGuardadas + 1,
                "Jugador1": archivoMatchmaking[0].Gamertag,
                "Movimientos1": [],
                "MovimientosRegistrados1": 0,
                "Consultado1": 0,   
                "Jugador2": archivoMatchmaking[1].Gamertag,
                "Movimientos2": [],
                "MovimientosRegistrados2": 0,
                "Consultado2": 0,
                "Turno": "1"
            }

            PartidaDAO.guardarPartida(archivoMatchmaking[0].Gamertag, archivoMatchmaking[1].Gamertag, (err, cartas) => {
                if (err) {
                    res.status(500).send('Error al escribir los archivos JSON');
                }
            });
    
            try {
                archivoPartida.push(contenidoPartida);
                fs.writeFileSync(partidaJSONPath, JSON.stringify(archivoPartida, null, 2));
                fs.writeFileSync(matchmakingJSONPath, '[]', null, 2);
                res.status(200).send('Partida Creada');
            } catch (error) {
                res.status(500).send('Error al escribir los archivos JSON');
            }
        }
    }
});

router.post('/cancelarpartida', (req, res) => {
    let archivoPartida = [];

    try {
        archivoPartida = require(partidaJSONPath);
    } catch (error) {
        console.error('Error al leer el archivo JSON: ', error);
        return res.status(500).send('Error al leer el archivo JSON.');
    }

    const indexJugadorEnPartida = archivoPartida.findIndex(jugador => jugador.Gamertag === req.body.Gamertag);

    if (indexJugadorEnPartida !== -1) {
        archivoPartida.splice(indexJugadorEnPartida, 1);

        fs.writeFileSync(partidaJSONPath, JSON.stringify(archivoPartida, null, 2));

        return res.status(200).json({ mensaje: 'Jugador eliminado correctamente' });
    } else {
        return res.status(404).json({ error: 'Jugador no encontrado en la partida' });
    }
});

router.post('/jugarturno', (req, res) => {
    let archivoPartida = [];

    try {
        archivoPartida = require(partidaJSONPath);
    } catch (error) {
        console.error('Error al leer el archivo JSON: ', error);
        res.status(500).send('Error al leer el archivo JSON.');
        return;
    }

    const { Movimientos } = req.body;
    console.log(Movimientos);

    const jugadorEnPartida = archivoPartida.find(jugador => jugador.Jugador1 === req.body.Gamertag || jugador.Jugador2 === req.body.Gamertag);
    console.log(jugadorEnPartida);

    if (!jugadorEnPartida) {
        return res.status(404).json({ error: 'Jugador no encontrado en la partida' });
    }

    // Nueva validación para Movimientos1 y Movimientos2
    if (jugadorEnPartida.Movimientos1.length > 0 && jugadorEnPartida.Movimientos2.length > 0) {
        if (jugadorEnPartida.Consultado1 === 0 || jugadorEnPartida.Consultado2 === 0) {
            if (jugadorEnPartida.Jugador1 === req.body.Gamertag) {
                jugadorEnPartida.Consultado2 = 1;
                fs.writeFileSync(partidaJSONPath, JSON.stringify(archivoPartida, null, 2));
                return res.status(200).json(jugadorEnPartida.Movimientos2);
            } else {
                jugadorEnPartida.Consultado1 = 1;
                fs.writeFileSync(partidaJSONPath, JSON.stringify(archivoPartida, null, 2));
                return res.status(200).json(jugadorEnPartida.Movimientos1);
            }
        } else {
                PartidaDAO.guardarTurno(jugadorEnPartida.Movimientos1, jugadorEnPartida.Movimientos2, jugadorEnPartida.Turno, jugadorEnPartida.idPartida, (err, resultado) => {
                    if (err) {
                        return res.status(500).send('Error al escribir los archivos JSON');
                    } else {
                        console.log('Turno Guardado');
                    }
                });

            if (parseInt(jugadorEnPartida.Turno) === 4) {
                fs.writeFileSync(partidaJSONPath, JSON.stringify([], null, 2));
                return res.status(200).json({ mensaje: 'Juego terminado.' });
            } else {
                jugadorEnPartida.Movimientos1 = [];
                jugadorEnPartida.MovimientosRegistrados1 = 0;
                jugadorEnPartida.Consultado1 = 0;
                jugadorEnPartida.Movimientos2 = [];
                jugadorEnPartida.MovimientosRegistrados2 = 0;
                jugadorEnPartida.Consultado2 = 0;
                jugadorEnPartida.Turno = (parseInt(jugadorEnPartida.Turno) + 1).toString();
            }
        }
    }       

    if (jugadorEnPartida.Jugador1 === req.body.Gamertag) {
        // Validar si ya existe un movimiento del Jugador1
        if (jugadorEnPartida.MovimientosRegistrados1 === 1) {
            return res.status(400).json({ error: 'Ya se jugó un movimiento para Jugador1 en este turno.' });
        } else {
            jugadorEnPartida.Movimientos1 = Movimientos;
            jugadorEnPartida.MovimientosRegistrados1 = 1;
        }
    } else {
        // Validar si ya existe un movimiento del Jugador2
        if (jugadorEnPartida.MovimientosRegistrados2 === 1) {
            return res.status(400).json({ error: 'Ya se jugó un movimiento para Jugador2 en este turno.' });
        } else {
            jugadorEnPartida.Movimientos2 = Movimientos;
            jugadorEnPartida.MovimientosRegistrados2 = 1;
        }
    }

    fs.writeFileSync(partidaJSONPath, JSON.stringify(archivoPartida, null, 2));
    return res.status(200).json({ mensaje: 'Turno Jugado' });
});


module.exports = router;