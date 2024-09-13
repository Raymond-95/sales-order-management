var express = require('express');
const dbConnectionPool = require('./db/db');
const bodyParser = require('body-parser');
const routes = require('./routes')

var app = express();
const port = 3000;

// parse the requests of content-type 'application/json'
app.use(bodyParser.json());

app.use('/api', routes);

// retrieve sales order list
app.get('/api/salesOrders', (req, res) => {
    const query = `
        SELECT so.id AS orderId,
               so.customer_name AS customerName,
               so.status AS status,
               so.country AS country,
               pc.name AS category,
               pc.category_group AS categoryGroup,
               so.created_date AS createdDate
        FROM sales_order so
        JOIN product_category pc ON so.category_id = pc.id;
    `;

    dbConnectionPool.query(query, (error, results) => {
        if (error) {
            res.status(500).send(error);
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

            // default: sort the response by order id
            const sortedResponse = response.sort((a, b) => a.orderId - b.orderId)

            res.status(200).json(sortedResponse);
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
            dbConnectionPool.query(query, (error, results) => {
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
            res.status(500).send(error);
        });
});

// retrieve enum options (status, category, and country)
app.get('/api/getEnum', (req, res) => {
    // Define the SQL queries
    const queries = {
        statusCountry: 'SELECT DISTINCT status, country FROM sales_order;',
        category: 'SELECT DISTINCT name AS category FROM product_category;'
    };

    // Execute queries
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

    // Fetch enum options
    Promise.all([
        executeQuery(queries.statusCountry),
        executeQuery(queries.category)
    ])
        .then(([statusCountryResults, categoryResults]) => {
            // Extract status and country from the results
            const status = [...new Set(statusCountryResults.map(row => row.status))];
            const country = [...new Set(statusCountryResults.map(row => row.country))];
            const category = categoryResults.map(row => row.category);

            res.status(200).json({
                status,
                country,
                category
            });
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

// add a sales order
app.post('/api/salesOrders', (req, res) => {
    const { customerName, status, category, country } = req.body;

    if (!customerName || !status || !category || !country) {
        return res.status(400).send('Missing required fields');
    }

    // find the category_id from the product_category table
    const categoryQuery = `
        SELECT id FROM product_category WHERE name = ?
    `;

    // execute the category query
    dbConnectionPool.query(categoryQuery, [category], (error, categoryResults) => {
        if (error) {
            console.error('Error fetching category:', error);
            return res.status(500).send('Error fetching category');
        }

        if (categoryResults.length === 0) {
            return res.status(404).send('Category not found');
        }

        const categoryId = categoryResults[0].id;

        // define the SQL query for inserting the sales order
        const insertQuery = `
            INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
            VALUES (?, ?, ?, ?, NOW());
        `;

        // execute the insert query
        dbConnectionPool.query(insertQuery, [customerName, status, categoryId, country], (error, results) => {
            if (error) {
                console.error('Error inserting sales order:', error);
                return res.status(500).send('Error inserting sales order');
            }

            res.status(201).send({ message: 'Sales order added successfully', orderId: results.insertId });
        });
    });
});

// delete sales order by ID
app.delete('/api/salesOrders/:id', (req, res) => {
    const orderId = req.params.id;

    // Check if id is provided
    if (!orderId) {
        return res.status(400).send('Sales order ID is required');
    }

    // SQL query to delete a sales order by id
    const query = `
        DELETE FROM sales_order 
        WHERE id = ?
    `;

    // Execute the query
    dbConnectionPool.query(query, [orderId], (error, results) => {
        if (error) {
            console.error('Error deleting sales order:', error);
            return res.status(500).send('Error deleting sales order');
        }

        // If no rows were affected, the sales order ID does not exist
        if (results.affectedRows === 0) {
            return res.status(404).send('Sales order not found');
        }

        res.status(200).send({ message: 'Sales order deleted successfully' });
    });
});

// Edit a sales order
app.put('/api/salesOrders/:id', (req, res) => {
    const { id } = req.params;
    const { customerName, status, category, country } = req.body;

    // Validation
    if (!customerName || !status || !category || !country) {
        return res.status(400).send('Missing required fields');
    }

    // Find the category_id from the product_category table
    const categoryQuery = `
        SELECT id FROM product_category WHERE name = ?
    `;

    dbConnectionPool.query(categoryQuery, [category], (error, categoryResults) => {
        if (error) {
            console.error('Error fetching category:', error);
            return res.status(500).send('Error fetching category');
        }

        if (categoryResults.length === 0) {
            return res.status(404).send('Category not found');
        }

        const categoryId = categoryResults[0].id;

        // Define the SQL query for updating the sales order
        const updateQuery = `
            UPDATE sales_order
            SET customer_name = ?, status = ?, category_id = ?, country = ?, updated_date = NOW()
            WHERE id = ?;
        `;

        // Execute the update query
        dbConnectionPool.query(updateQuery, [customerName, status, categoryId, country, id], (error, results) => {
            if (error) {
                console.error('Error updating sales order:', error);
                return res.status(500).send('Error updating sales order');
            }

            if (results.affectedRows === 0) {
                return res.status(404).send('Sales order not found');
            }

            res.status(200).send({ message: 'Sales order updated successfully' });
        });
    });
});

var server = app.listen(port, function () {
    console.log(`Express App is running`);
})