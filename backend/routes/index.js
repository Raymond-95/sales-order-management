var express = require('express')
var router = express.Router();

const getEnums = require('./enums')
const { getSalesOrders, addSalesOrder, updateSalesOrder } = require('./salesOrder')
const getFilterOptions = require('./filterOptions')

router.get('/enums', getEnums);
router.get('/fiterOptions', getFilterOptions);

router.get('/salesOrders', getSalesOrders);
router.post('/salesOrder', addSalesOrder);
router.put('/salesOrder/:id', updateSalesOrder)

module.exports = router