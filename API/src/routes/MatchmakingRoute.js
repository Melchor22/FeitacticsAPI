const { Router } = require('express');
const router = Router();
const fs = require('fs');
const bodyParser = require('body-parser');

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
    
            let contenidoPartida = {
                "idPartida": archivoPartida.length > 0 ? archivoPartida.length + 1 : 1,
                "Jugador1": archivoMatchmaking[0].Gamertag,
                "Movimientos1": [],
                "Jugador2": archivoMatchmaking[1].Gamertag,
                "Movimientos2": [],
                "Turno": "1"
            }
    
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

router.post('/jugarturno', (req, res) => {
    let archivoPartida = [];

    try {
        archivoPartida = require(partidaJSONPath);
        console.log(archivoPartida);
    } catch (error) {
        console.error('Error al leer el archivo JSON: ', error);
        res.status(500).send('Error al leer el archivo JSON.');
        return;
    }

    const { Movimientos } = req.body;
    console.log(Movimientos);

    const jugadorEnPartida = archivoPartida.find(jugador => jugador.Jugador1 === req.body.Gamertag || jugador.Jugador2 === req.body.Gamertag);
    console.log(jugadorEnPartida);

    if (jugadorEnPartida) {
        if (jugadorEnPartida.Jugador1 === req.body.Gamertag) {
            jugadorEnPartida.Movimientos1 = Movimientos;
        } else {
            jugadorEnPartida.Movimientos2 = Movimientos;
        }

        fs.writeFileSync(partidaJSONPath, JSON.stringify(archivoPartida, null, 2));
        res.status(200).json({ mensaje: 'Turno Jugado' });
    } else {
        res.status(404).json({ error: 'Jugador fuera de partida' });
    }
});


    /*if (Array.isArray(Movimientos)) {
        res.json({ Movimientos });
    } else {
        res.status(400).json({ error: 'El campo Movimientos no es un array válido.' });
    }*/

module.exports = router;