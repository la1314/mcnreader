const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '185.162.171.27',
  user: 'gupoecom_tuinki',
  password: 'WE7L-jp]!$_7',
  database: 'gupoecom_mcnreader'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Conexión exitosa a la base de datos de mcnreader');
});

module.exports = connection;