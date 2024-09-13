const executeQuery = require('../utils/queryHelper')

// retrieve enum options (status, category, country)
const getEnums = async (req, res) => {
    const queries = {
        status: 'SELECT DISTINCT status AS value FROM sales_order;',
        category: 'SELECT DISTINCT name AS category FROM product_category;',
        country: 'SELECT DISTINCT country AS value FROM sales_order;'
    };

    try {
        const [statusResults, categoryResults, countryResults] = await Promise.all([
            executeQuery(queries.status),
            executeQuery(queries.category),
            executeQuery(queries.country)
        ]);

        // process results to extract distinct values
        const status = statusResults.map(row => Object.values(row)[0]);
        const category = categoryResults.map(row => Object.values(row)[0]);
        const country = countryResults.map(row => Object.values(row)[0]);

        res.status(200).json({
            status,
            category,
            country
        });
    } catch (error) {
        console.error('Error retrieving enum options:', error);
        res.status(500).send('Error retrieving enum options');
    }
};

module.exports = getEnums