var express = require('express')
var router = express.Router();

const getEnums = require('./getEnums')
const getSalesOrder = require('./getSalesOrder')

router.get('/getEnums', getEnums);
router.get('/getSalesOrder', getSalesOrder);

module.exports = router