var express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
const port = 3000;

// parse the requests of content-type 'application/json'
app.use(bodyParser.json());

// create the MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vuetest'
});

// retrieve enum options (status, category, country)
app.get('/api/getEnums', (req, res) => {
    // Define the SQL queries for enums
    const queries = {
        status: 'SELECT name AS status FROM status;',
        category: 'SELECT DISTINCT name AS category FROM product_category;',
        country: 'SELECT DISTINCT name AS country FROM country;'
    };

    // Helper function to execute a SQL query
    const executeQuery = (query) => {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.map(row => Object.values(row)[0])); // Extract values
                }
            });
        });
    };

    // Fetch status, category, and country
    Promise.all([
        executeQuery(queries.status),
        executeQuery(queries.category),
        executeQuery(queries.country)
    ])
        .then(([status, category, country]) => {
            res.status(200).json({
                status,
                category,
                country
            });
        })
        .catch(error => {
            console.error('Error retrieving enum options:', error);
            res.status(500).send('Error retrieving enum options');
        });
});


// retrieve sales order list
app.get('/api/salesOrders', (req, res) => {
    const query = `
        SELECT so.object_id AS orderId,
               so.customer_name AS customerName,
               so.status AS status,
               so.country AS country,
               pc.name AS category,
               pc.category_group AS categoryGroup,
               so.created_date AS createdDate
        FROM sales_order so
        JOIN product_category pc ON so.category_id = pc.object_id;
    `;

    pool.query(query, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving sales orders');
        } else {
            const response = results.map((result) => {
                const formattedDate = new Date(result.createdDate).toISOString().split('T')[0];

                return {
                    orderId: result.orderId,
                    customerName: result.customerName,
                    status: result.status,
                    category: result.category,
                    categoryGroup: result.categoryGroup,
                    country: result.country,
                    createdDate: formattedDate,
                };
            });
            res.status(200).json(response);
        }
    });
});

// retrieve filter options
app.get('/api/filterOptions', (req, res) => {
    // Define the updated SQL queries
    const queries = {
        statusCountryCustomer: 'SELECT DISTINCT status, country, customer_name FROM sales_order;',
        category: 'SELECT DISTINCT category_group AS category FROM product_category;'
    };

    // Execute queries
    const executeQuery = (query) => {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    // Fetch filter options
    Promise.all([
        executeQuery(queries.statusCountryCustomer),
        executeQuery(queries.category)
    ])
        .then(([statusCountryCustomerResults, categoryResults]) => {
            // Extract status, country, and customer_name from the results
            const status = [...new Set(statusCountryCustomerResults.map(row => row.status))];
            const country = [...new Set(statusCountryCustomerResults.map(row => row.country))];
            const customerName = [...new Set(statusCountryCustomerResults.map(row => row.customer_name))];
            const category = categoryResults.map(row => row.category);

            res.status(200).json({
                status,
                country,
                customerName,
                category
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error retrieving filter options');
        });
});




var server = app.listen(port, function () {
    console.log(`Express App running at http://127.0.0.1:${port}/`);
})