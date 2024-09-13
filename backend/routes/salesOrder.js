const executeQuery = require('../utils/queryHelper')

// retrieve sales order list
const getSalesOrders = async (req, res) => {
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

    try {
        const results = await executeQuery(query);

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

        return res.status(200).json(sortedResponse);
    } catch (error) {
        console.error('Error retrieving sales order:', error);
        return res.status(500).send('Error retrieving sales order');
    }
};

// add a sales order
const addSalesOrder = async (req, res) => {
    const { customerName, status, category, country } = req.body;

    if (!customerName || !status || !category || !country) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const categoryQuery = `SELECT id FROM product_category WHERE name = ?`;

        const categoryResults = await executeQuery(categoryQuery, [category]);

        if (categoryResults.length === 0) {
            return res.status(404).send('Category not found');
        }

        const categoryId = categoryResults[0].id;

        const insertQuery = `
            INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
            VALUES (?, ?, ?, ?, NOW());
        `;

        const results = await executeQuery(insertQuery, [customerName, status, categoryId, country]);

        return res.status(201).send({ message: 'Sales order added successfully', orderId: results.insertId });
    } catch (error) {
        console.error('Error adding sales order:', error);
        return res.status(500).send('Error adding sales order');
    }
};

// edit sales order
const updateSalesOrder = async (req, res) => {
    const { id } = req.params;
    const { customerName, status, category, country } = req.body;

    if (!customerName || !status || !category || !country) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const categoryQuery = `SELECT id FROM product_category WHERE name = ?`;

        const categoryResults = await executeQuery(categoryQuery, [category]);

        if (categoryResults.length === 0) {
            return res.status(404).send('Category not found');
        }

        const categoryId = categoryResults[0].id;

        const updateQuery = `
            UPDATE sales_order
            SET customer_name = ?, status = ?, category_id = ?, country = ?, updated_date = NOW()
            WHERE id = ?;
        `;

        const results = await executeQuery(updateQuery, [customerName, status, categoryId, country, id]);

        if (results.affectedRows === 0) {
            return res.status(404).send('Sales order not found');
        }

        return res.status(200).send({ message: 'Sales order updated successfully' });
    } catch (error) {
        console.error('Error updating sales order:', error);
        return res.status(500).send('Error updating sales order');
    }
};

module.exports = {
    getSalesOrders,
    addSalesOrder,
    updateSalesOrder
}