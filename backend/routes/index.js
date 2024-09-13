var express = require('express')
var router = express.Router();

const getEnums = require('./getEnumsRoutes')

router.get('/getEnums', getEnums);

module.exports = router