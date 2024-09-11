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

// retrieve sales order list
app.get('/api/salesOrders', (req, res) => {
    const query = `
        SELECT so.object_id AS orderId,
               c.name AS customerName,
               s.name AS status,
               co.name AS country,
               pc.name AS category,
               pc.category_group AS categoryGroup,
               so.created_date AS createdDate
        FROM sales_order so
        JOIN customer c ON so.customer_id = c.id
        JOIN status s ON so.status_id = s.id
        JOIN country co ON so.country_id = co.id
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
    // Define the SQL queries
    const queries = {
        status: 'SELECT name AS status FROM status;',
        category: 'SELECT DISTINCT category_group AS category FROM product_category;',
        customerName: 'SELECT DISTINCT name AS customerName FROM customer;',
        country: 'SELECT DISTINCT name AS country FROM country;'
    };

    // Execute queries
    const executeQuery = (query) => {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.map(row => Object.values(row)[0]));
                }
            });
        });
    };

    // Fetch all filter options
    Promise.all([
        executeQuery(queries.status),
        executeQuery(queries.category),
        executeQuery(queries.customerName),
        executeQuery(queries.country)
    ])
        .then(([status, category, customerName, country]) => {
            res.status(200).json({
                status,
                category,
                customerName,
                country
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error retrieving filter options');
        });
});

// add a new sales order
app.post('/api/salesOrders', (req, res) => {
    const { customerName, status, category, country, createdDate } = req.body;

    // Find or insert the related entities (customer, status, country, product category)
    const getOrInsertCustomer = `INSERT INTO customer (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);`;
    const getOrInsertStatus = `INSERT INTO status (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);`;
    const getOrInsertCountry = `INSERT INTO country (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);`;
    const getOrInsertCategory = `INSERT INTO product_category (name, category_group) VALUES (?, ?) ON DUPLICATE KEY UPDATE object_id=LAST_INSERT_ID(object_id);`;

    // Sales order insertion query
    const insertSalesOrder = `
        INSERT INTO sales_order (customer_id, status_id, country_id, category_id, created_date)
        VALUES (?, ?, ?, ?, ?);
    `;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error getting database connection');
            return;
        }

        connection.beginTransaction(async (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error starting transaction');
                connection.release();
                return;
            }

            try {
                // Insert or find customer
                const customerResult = await new Promise((resolve, reject) => {
                    connection.query(getOrInsertCustomer, [customerName], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });

                // Insert or find status
                const statusResult = await new Promise((resolve, reject) => {
                    connection.query(getOrInsertStatus, [status], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });

                // Insert or find country
                const countryResult = await new Promise((resolve, reject) => {
                    connection.query(getOrInsertCountry, [country], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });

                // Insert or find category
                const categoryResult = await new Promise((resolve, reject) => {
                    connection.query(getOrInsertCategory, [category, 'default'], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });

                // Insert sales order
                const salesOrderResult = await new Promise((resolve, reject) => {
                    connection.query(
                        insertSalesOrder,
                        [
                            customerResult.insertId,
                            statusResult.insertId,
                            countryResult.insertId,
                            categoryResult.insertId,
                            createdDate,
                        ],
                        (error, results) => {
                            if (error) reject(error);
                            else resolve(results);
                        }
                    );
                });

                connection.commit((err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).send('Error saving sales order');
                        });
                        return;
                    }

                    connection.release();
                    res.status(201).send('Sales order added successfully');
                });
            } catch (error) {
                console.error('Transaction error:', error);
                connection.rollback(() => {
                    connection.release();
                    res.status(500).send('Error adding sales order');
                });
            }
        });
    });
});

var server = app.listen(port, function () {
    console.log(`Express App running at http://127.0.0.1:${port}/`);
})