var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Root',
    database: process.env.DB_NAME || 'meesho'
});

function setupDatabase() {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS singup (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            otp VARCHAR(10),
            otp_created_at TIMESTAMP,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    connection.query(createTableSQL, (err, results) => {
        if (err) {
            console.error('Error creating singup table:', err);
            return;
        }
        console.log('Singup table created or already exists');
        connection.end();
    });
}

module.exports = setupDatabase;
