const { Router } = require('express');
const router = Router();
const CartasDAO = require('../DAOs/CartasDAO');

/**
 * @Swagger
 *  paths:
 *   /recuperarcartas
 *    get:
 *     summary: Recuperas las cartas
 *     description: Recuperas todas las cartas de la base de datos
 *     responses:
 *      '200':
 * 
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