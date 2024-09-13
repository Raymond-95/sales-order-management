var mysql = require('mysql');

// create the MySQL connection pool
const createDBConnectionPool = () => mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOSTNAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

module.exports = createDBConnectionPool;
