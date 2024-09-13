const dbConnectionPool = require('../db/db')

const executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        dbConnectionPool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = executeQuery;