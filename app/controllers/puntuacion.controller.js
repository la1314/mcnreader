const connection = require('../models/puntuacion.model.js');

// Obtener todos los puntuaciones
exports.findAll = (req, res) => {

  const query = "SELECT * FROM OBRAS";
  
  // if there is no error, you have the result
  connection.query(query, (err, result, fields) => {

    // if any error while executing above query, throw error
    if (err) throw err;

    // if there is no error, you have the result
    console.log(result);
    res.send(result);
 });

};
