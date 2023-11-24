const { Router } = require('express');
const router = Router();
const CartasDAO = require('../DAOs/CartasDAO');

router.get('/recuperarCartas', (req, res) => {

    CartasDAO.recuperarCartas((err, cartas) => {
        if (err) {
            res.status(500).json({error: 'Error al obtener las cartas'});
        } else {
            if (cartas) {
                res.status(200).json({cartas});
            } else {
                res.status(404).json({mensaje: 'No se encontraron cartas'});
            }
        }
        CartasDAO.cerrarConexion();
    });
});

module.exports = router;