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

    // find the category_id from the product_category table
    const categoryQuery = `
        SELECT id FROM product_category WHERE name = ?
    `;

    try {
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

module.exports = {
    getSalesOrders,
    addSalesOrder
}