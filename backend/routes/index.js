var express = require('express')
var router = express.Router();

const getEnums = require('./enums')
const getSalesOrder = require('./salesOrder')
const getFilterOptions = require('./filterOptions')

router.get('/getEnums', getEnums);
router.get('/getSalesOrder', getSalesOrder);
router.get('/getFiterOptions', getFilterOptions);

module.exports = router