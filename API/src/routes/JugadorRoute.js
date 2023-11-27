const { Router } = require('express');
const router = Router();
const JugadoresDAO = require('../DAOs/JugadoresDAO');

router.get('/', (req, res) => {
    res.send({"IDJugador":"1"});
});

router.post('/iniciarsesion', (req, res) => {
    console.log(req.body);
    const { Gamertag, contrasenia } = req.body;

    JugadoresDAO.iniciarSesion(Gamertag, contrasenia, (err, jugador) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener el jugador' });
        } else {
            if (jugador) {
                console.log(jugador);
                res.status(200).json(jugador);
            } else {
                res.status(404).json({ mensaje: 'No se encontró ningún jugador con las credenciales proporcionadas' });
            }
        }
    });
});

router.post('/registrarjugador', (req, res) => {
    console.log(req.body);

    const {Gamertag, contrasenia} = req.body;
    
    JugadoresDAO.registrarJugador(Gamertag, contrasenia, (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar el jugador' });
        } else {
            if (resultado.affectedRows > 0) {
                res.status(200).json({ mensaje: "Jugador Registrado" });
            } else {
                res.status(404).json({ mensaje: 'No se pudo registrar al Jugador' });
            }
        }
    });
});

module.exports = router;