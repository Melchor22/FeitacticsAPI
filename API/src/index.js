const express = require('express');
const app = express();
const morgan = require('morgan');

//settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//middleware
app.use(morgan('combined'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes
app.use('/jugador', require('./routes/JugadorRoute'));
app.use('/carta', require('./routes/CartaRoute'));
app.use('/matchmaking', require('./routes/MatchmakingRoute'));
app.use('/escenario', require('./routes/EscenarioRoute'))

//starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});