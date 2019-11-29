var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    post: 3300,
    user: 'root',
    password: 'root',
    database: 'CIRCLE'
});

module.exports = db;
