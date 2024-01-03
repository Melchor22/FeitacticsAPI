const { Router } = require('express');
const router = Router();
const CartasDAO = require('../DAOs/CartasDAO');

/**
 * @openapi
 * /carta/recuperarcartas:
 *   get:
 *     summary: Recupera la lista de cartas.
 *     description: Endpoint para recuperar todas las cartas disponibles.
 *     responses:
 *       '200':
 *         description: Retorna la lista de cartas.
 *         content:
 *           application/json:
 *             example:
 *               cartas:
 *                 - nombre: 'Carta1'
 *                   tipo: 'Tipo1'
 *                   // Agrega más propiedades de la carta según tu modelo de datos
 *                 - nombre: 'Carta2'
 *                   tipo: 'Tipo2'
 *                   // ...
 *       '404':
 *         description: No se encontraron cartas.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: 'No se encontraron cartas'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error al obtener las cartas'
 */
router.get('/recuperarcartas', (req, res) => {
    // Llama a la función recuperarCartas del CartasDAO
    CartasDAO.recuperarCartas((err, cartas) => {
        if (err) {
            // En caso de error interno del servidor
            console.error('Error al obtener las cartas:', err);
            res.status(500).json({ error: 'Error al obtener las cartas' });
        } else {
            if (cartas && cartas.length > 0) {
                // Si se encuentran cartas, devuelve el código 200 y la lista de cartas
                res.status(200).json({ cartas });
            } else {
                // Si no se encuentran cartas, devuelve el código 404
                res.status(404).json({ mensaje: 'No se encontraron cartas' });
            }
        }
    });
});

module.exports = router;