var express = require('express');
const dbConnectionPool = require('./db/db');
const bodyParser = require('body-parser');
const routes = require('./routes')

var app = express();
const port = 3000;

// parse the requests of content-type 'application/json'
app.use(bodyParser.json());

app.use('/api', routes);

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

var server = app.listen(port, function () {
    console.log(`Express App is running`);
})