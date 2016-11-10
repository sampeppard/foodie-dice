// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var debug = require('debug')('server');

var index = require('./routes/index.js');
var listsAPI = require('./routes/lists.js');

//TODO: dry up config require
var config = require('./config.js');

var port = process.env['PORT'] || 3000;
debug("We picked up", port, "for the port");

var app = express();

// Set Static Folder (Angular Entry Point)
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/', index);
app.use('/api', listsAPI);

//NOTE: Watch out for concurrency issues between this server and mongodb
var server = app.listen(port, "127.0.0.1", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
