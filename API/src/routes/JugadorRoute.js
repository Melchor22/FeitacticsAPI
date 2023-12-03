const { Router } = require('express');
const router = Router();
const JugadoresDAO = require('../DAOs/JugadoresDAO');
const CartasDAO = require('../DAOs/CartasDAO');

router.get('/', (req, res) => {
    res.send({"IDJugador":"1"});
});

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
                res.status(404).json({ mensaje: 'No se encontró ningún jugador con las credenciales proporcionadas' });
            }
        }
    });
});

router.get('/imagenPerfilSesion', (req, res) => {
    console.log('Petición:');
    console.log(req.body);

    const { idFoto } = req.body;

    JugadoresDAO.recuperarImagenPerfil(idFoto, (err, imagen) => {
        if (err) {
            res.status(500).json({error: 'Error al obtener el jugador' });
        } else {
            if (imagen) {
                console.log('Imagen Obtenida:');
                console.log(imagen);
                res.status(200).json(imagen);
            } else {
                res.status(404).json({ mensaje: 'No se encontró ningúna imagen con el id proporcionado' });
            }
        }
    });
});

router.get('/recuperarImagenesPerfil', (req, res) => {
    JugadoresDAO.recuperarImagenesPerfil((err, imagenesPerfil) => {
        if (err) {
            res.status(500).json({error: 'Error al obtener las cartas'});
        } else {
            if (imagenesPerfil) {
                res.status(200).json({imagenesPerfil});
            } else {
                res.status(404).json({mensaje: 'No se encontraron imagenes de perfil'});
            }
        }
    });
});

router.post('/registrarjugador', (req, res) => {
    console.log(req.body);

    const {Gamertag, contrasenia, idFoto} = req.body;
    
    JugadoresDAO.registrarJugador(Gamertag, contrasenia, idFoto, (err, resultadoJugador) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar el jugador' });
        } else {
            if (resultadoJugador.affectedRows > 0) {
                CartasDAO.recuperarCartas((err, cartas) => {
                    if (err) {
                        res.status(500).json({ error: 'Error al recuperar las cartas' });
                    } else {
                        if (cartas) {
                            cartas.forEach(carta => {
                                JugadoresDAO.desbloquearCarta(Gamertag, carta.idCarta, (err, resultadoCartas) => {
                                    if (err) {
                                        res.status(500).json({ error: 'Error al registrar el jugador' });
                                    } else {
                                        if (resultadoCartas.affectedRows > 0) {
                                            console.log('Carta:');
                                            console.log(carta.idCarta);
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
                res.status(404).json({ mensaje: 'No se pudo registrar al Jugador' });
            }
        }
    });
});

router.put('/modificarimagenperfil', (req, res)  => {
    console.log(req.body);
    const { Gamertag, idFoto } = req.body;
    JugadoresDAO.modificarImagenPerfil(Gamertag, idFoto, (err, resultado) => {
        if (err) {
            res.status(500).json({Error: 'Error al modificar la imagen de perfil'});
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
            res.status(500).json({Error: 'Error al modificar el mazo'});
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