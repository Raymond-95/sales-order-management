var express = require('express')
var router = express.Router();

const getEnums = require('./enums')
const { getSalesOrders, addSalesOrder } = require('./salesOrder')
const getFilterOptions = require('./filterOptions')

router.get('/enums', getEnums);
router.get('/fiterOptions', getFilterOptions);

router.get('/salesOrder', getSalesOrders);
router.post('/salesOrder', addSalesOrder);

module.exports = router