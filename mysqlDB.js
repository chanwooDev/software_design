var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: '1234',
    database: 'testdb'
});

module.exports = connection;