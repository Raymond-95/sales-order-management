var express = require('express');
const dbConnectionPool = require('./db/db');
const bodyParser = require('body-parser');
const routes = require('./routes')

var app = express();
const port = 3000;

// parse the requests of content-type 'application/json'
app.use(bodyParser.json());

app.use('/api', routes);

var server = app.listen(port, function () {
    console.log(`Express App is running`);
})