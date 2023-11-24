const conexion = require('../conexion');

function recuperarCartas(callback) {
    const consulta = 'SELECT * FROM cartas';

    conexion.query(consulta, (err, resultados) => {
        if (err) {
            return callback(err, null);
        }

        const cartas = resultados.map(resultado => ({
            IDCarta: resultado.IDCarta,
            Costo: resultado.Costo,
            Poder: resultado.Poder,
            Imagen: resultado.Imagen ? resultado.Imagen.toString('base64') : null,
        }));

        console.log(cartas[1].Imagen);
        callback(null, cartas);
    });
}

function cerrarConexion() {
    conexion.end(err => {
        if (err) {
            console.error('Error al cerrar la conexión:', err);
        } else {
            console.log('Conexión cerrada correctamente.');
        }
    });
}

module.exports = {
    recuperarCartas,
    cerrarConexion
}