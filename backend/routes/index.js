var express = require('express')
var router = express.Router();

const getEnums = require('./getEnums')
const getSalesOrder = require('./getSalesOrder')
const getFilterOptions = require('./getFilterOptions')

router.get('/getEnums', getEnums);
router.get('/getSalesOrder', getSalesOrder);
router.get('/getFiterOptions', getFilterOptions);

module.exports = router