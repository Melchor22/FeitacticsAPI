const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const morgan = require('morgan');


const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'FeitacticsAPI', version: '1.0.0' },
  },
  apis: ['./routes/routes.js'], // Rutas a todos los archivos de rutas en la carpeta routes
};

const swaggerSpec = swaggerJSDoc(options);

// Función para configurar la documentación Swagger
const SwaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

module.exports = { SwaggerDocs };