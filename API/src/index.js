const express = require('express');
const app = express();
const morgan = require('morgan');
const {SwaggerDocs: V1SwaggerDocs} = require('./swagger')
const routes = require('./routes');

//settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes
app.use('/', routes);

//starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
    V1SwaggerDocs(app, app.get('port'));
});