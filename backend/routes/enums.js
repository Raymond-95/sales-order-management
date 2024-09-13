const executeQuery = require('../utils/queryHelper')

// retrieve enum options (status, category, country)
const getEnums = async (req, res) => {
    const queries = {
        statusCountry: 'SELECT DISTINCT status, country FROM sales_order;',
        category: 'SELECT DISTINCT name AS category FROM product_category;'
    };

    try {
        const [statusCountryResults, categoryResults] = await Promise.all([
            executeQuery(queries.statusCountry),
            executeQuery(queries.category),
        ]);

        // process results to extract distinct values
        const status = statusCountryResults.map(row => row.status);
        const country = statusCountryResults.map(row => row.country);
        const category = categoryResults.map(row => row.category);

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