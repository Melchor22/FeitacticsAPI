const express = require('express');
const router = express.Router();

// Rutas para /jugador
router.use('/jugador', require('./JugadorRoute'));

// Rutas para /carta
router.use('/carta', require('./CartaRoute'));

// Rutas para /matchmaking
router.use('/matchmaking', require('./MatchmakingRoute'));

// Rutas para /escenario
router.use('/escenario', require('./EscenarioRoute'));

module.exports = router;