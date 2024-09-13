const executeQuery = require('../utils/queryHelper')

// retrieve filter options
const getFilterOptions = async (req, res) => {

    const queries = {
        statusCountryCustomer: 'SELECT DISTINCT status, country, customer_name FROM sales_order;',
        category: 'SELECT DISTINCT category_group AS category FROM product_category;'
    };

    try {
        const [statusCountryCustomerResults, categoryResults] = await Promise.all([
            executeQuery(queries.statusCountryCustomer),
            executeQuery(queries.category)
        ]);

        const status = statusCountryCustomerResults.map(row => row.status);
        const country = statusCountryCustomerResults.map(row => row.country);
        const customerName = statusCountryCustomerResults.map(row => row.customer_name);
        const category = categoryResults.map(row => row.category);

        res.status(200).json({
            status,
            country,
            customerName,
            category
        });
    } catch (error) {
        console.error('Error retrieving fitler options:', error);
        res.status(500).send('Error retrieving fitler options');
    }
};

module.exports = getFilterOptions