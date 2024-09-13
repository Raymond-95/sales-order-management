var express = require('express')
var router = express.Router();

const getEnums = require('./enums')
const getSalesOrder = require('./salesOrder')
const getFilterOptions = require('./filterOptions')

router.get('/enums', getEnums);
router.get('/fiterOptions', getFilterOptions);
router.get('/salesOrder', getSalesOrder);

module.exports = router