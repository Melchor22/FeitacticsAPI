const conexion = require('../conexion');

function recuperarEscenarios(callback) {
    const consulta = 'SELECT * FROM escenarios'

    conexion.query(consulta, (err, resultados) => {
        if (err) {
            return callback(err, null);
        }
        const escenarios = resultados.map(resultado => ({
            IDEscenario: resultado.IDEscenario,
            Imagen: resultado.Imagen ? resultado.Imagen.toString('base64') : null
        }));
        callback(null, escenarios);
    });
}

module.exports = {
    recuperarEscenarios
}