const { Router } = require('express');
const router = Router();
const JugadoresDAO = require('../DAOs/JugadoresDAO');
const CartasDAO = require('../DAOs/CartasDAO');

router.post('/iniciarsesion', (req, res) => {
    console.log('Petición: ');
    console.log(req.body);
    const { Gamertag, contrasenia } = req.body;

    JugadoresDAO.iniciarSesion(Gamertag, contrasenia, (err, jugador) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener el jugador' });
        } else {
            if (jugador) {
                console.log('Jugador Obtenido: ');
                console.log(jugador);
                res.status(200).json(jugador);
            } else {
                res.status(404).json({ error: 'No se encontró ningún jugador con las credenciales proporcionadas' });
            }
        }
    });
});

router.post('/recuperaroponente', (req, res) => {
    console.log(req.body);
    const { Gamertag } = req.body;
    JugadoresDAO.recuperarOponente(Gamertag, (err, jugador) => {
        if (err) {
            res.status(500).json({error: 'Error al obtener al oponente'});
        } else {
            if (jugador) {
                console.log('Jugador Obtenido: ');
                console.log(jugador);
                res.status(200).json(jugador);
            } else {
                res.status(404).json({ error: 'No se encontró al jugador oponente' });
            }
        }
    });
})

router.get('/recuperarfotosperfil', (req, res) => {
    JugadoresDAO.recuperarImagenesPerfil((err, imagenesPerfil) => {
        if (err) {
            res.status(500).json({error: 'Error al obtener las fotos de perfil'});
        } else {
            if (imagenesPerfil) {
                res.status(200).json({imagenesPerfil});
            } else {
                res.status(404).json({error: 'No se encontraron imagenes de perfil'});
            }
        }
    });
});

router.post('/registrarjugador', (req, res) => {
    console.log(req.body);

    const {gamertag, password, idFoto} = req.body;
    console.log(gamertag);
    console.log(password);
    console.log(idFoto);
    
    JugadoresDAO.registrarJugador(gamertag, password, idFoto, (err, resultadoJugador) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar el jugador' });
        } else {
            if (resultadoJugador.affectedRows > 0) {

                CartasDAO.recuperarCartas((err, cartas) => {
                    if (err) {
                        res.status(500).json({ error: 'Error al recuperar las cartas' });
                    } else {
                        if (cartas) {
                            console.log(cartas);
                            cartas.forEach(carta => {
                                console.log(carta);
                                console.log(carta.IDCarta);
                                
                                JugadoresDAO.desbloquearCarta(gamertag, carta.IDCarta, (err, resultadoCartas) => {
                                    if (err) {
                                        res.status(500).json({ error: 'Error al registrar el jugador' });
                                    } else {
                                        if (resultadoCartas.affectedRows > 0) {
                                            console.log('Carta:');
                                            console.log(carta);
                                        } else {
                                            res.status(404).json({ mensaje: 'No se pudo desbloquear las cartas' });
                                        }
                                    }
                                });
                                
                            });

                        } else {
                            res.status(404).json({mensaje: 'No se encontraron cartas'});
                        }

                    }
                });

                res.status(200).json({ mensaje: "Jugador Registrado" });
            } else {
                res.status(500).json({ mensaje: 'Error al registrar el jugador' });
            }
        }
    });
});

router.put('/modificarimagenperfil', (req, res)  => {
    console.log(req.body);
    const { Gamertag, idFoto } = req.body;
    JugadoresDAO.modificarImagenPerfil(Gamertag, idFoto, (err, resultado) => {
        if (err) {
            res.status(500).json({error: 'Error al modificar la imagen de perfil'});
        } else {
            if (resultado.affectedRows > 0) {
                res.status(200).json({ mensaje: 'Imagen de Perfil modificada correctamente' });
            } else {
                res.status(404).json({ mensaje: 'No se pudo modificar la Imagen de Perfil' });
            }
        }
    });
});

router.put('/modificarmazo', (req, res) => {
    console.log(req.body);
    const { Gamertag, Mazo } = req.body;
    JugadoresDAO.modificarMazo(Gamertag, Mazo, (err, resultado) => {
        if (err) {
            res.status(500).json({error: 'Error al modificar el mazo'});
        } else {
            if (resultado.affectedRows > 0) {
                res.status(200).json({ mensaje: 'Mazo modificado correctamente' });
            } else {
                res.status(404).json({ mensaje: 'No se pudo modificar el Mazo' });
            }
        }
    });
})

module.exports = router;