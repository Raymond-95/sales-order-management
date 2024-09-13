const dbConnectionPool = require('../db/db')

const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        dbConnectionPool.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = executeQuery;