var mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Root',
    database: process.env.DB_NAME || 'meesho'
});

function exe(sql, values) {
    return connection.promise().query(sql, values).then(function (result) {
        return result[0];
    });
}

module.exports = exe;
