const express = require('express');
const router = express.Router();

// Rutas para /jugador
router.use('/jugador', require('./routes/JugadorRoute'));

// Rutas para /carta
router.use('/carta', require('./routes/CartaRoute'));

// Rutas para /matchmaking
router.use('/matchmaking', require('./routes/MatchmakingRoute'));

// Rutas para /escenario
router.use('/escenario', require('./routes/EscenarioRoute'));

module.exports = router;