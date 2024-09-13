const executeQuery = require('../utils/queryHelper')

// retrieve sales order list
const getSalesOrder = async (req, res) => {
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

        res.status(200).json(sortedResponse);
    } catch (error) {
        console.error('Error retrieving sales order:', error);
        res.status(500).send('Error retrieving sales order');
    }
};

module.exports = getSalesOrder