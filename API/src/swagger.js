const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

// Ruta al archivo OpenAPI JSON
const openapiSpecPath = 'C:/Users/marqu/OneDrive/Documentos/UV/7° Semestre/Desarrollo de Red/Código/API/src/Documentation/AWLOWREACH-FeitacticsAPI-1.0.0-resolved (1).json';

// Cargar la especificación OpenAPI desde el archivo
const openapiSpec = JSON.parse(fs.readFileSync(openapiSpecPath, 'utf8'));

// Función para configurar la documentación Swagger
const SwaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openapiSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

module.exports = { SwaggerDocs };
