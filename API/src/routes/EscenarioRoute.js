const { Router } = require('express');
const router = Router();
const EscenariosDAO = require('../DAOs/EscenariosDAO')

router.get('/recuperarescenarios', (req, res) => {
    EscenariosDAO.recuperarEscenarios((err, escenarios) => {
        if (err) {
            res.status(500).json({error: 'Error al obtener los escenarios'});
        } else {
            if (escenarios) {
                res.status(200).json({escenarios});
            } else {
                res.status(404).json({mensaje: 'No se encontraron imagenes de perfil'});
            }
        }
    });
});

module.exports = router;