var listData = [
  {
    "id": 1,
    "listName": "Spice Night!",
    "ingredients": "['peppers', 'onions', 'cheese', 'cilantro', 'pork', 'beef']"
  },
  {
    "id": 2,
    "listName": "Sweet Night!",
    "ingredients": "['vanilla extract', 'syrup', 'ice cream', 'chocolate', 'cookies', 'apples']"
  }
];


// Config process.env
var envVars = require('./.env');
var envVarsKeys = Object.keys(envVars);

for (var varIndex = 0; varIndex < envVarsKeys.length; varIndex++) {
  process.env[envVarsKeys[varIndex]] = envVars[envVarsKeys[varIndex]];
}

// Load modules
var bodyParser = require('body-parser');
var _ = require('lodash');
var express = require('express');
var debug = require('debug')('app'); // debug will only output if DEBUG = (string in second parentheses aka app)

// Create express instance
var app = express();
app.use(bodyParser.json());

// Set up a simple route
app.get('/', function (req, res) {
  debug("/ requested");
  res.send("Hello World!");
});

// Start the server
var port = process.env.PORT || 3000;
debug("We picked up", port, "for the port");
var server = app.listen(port, "127.0.0.1", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(server.address());
    console.log("Example app listening at http://%s:%s", host, port);
});

// Set up endpoint to grab all people
var getAllLists = function(req, res) {
  var response = listData;
  // res.send(JSON.stringify(response));
  res.status(200).jsonp(response);
};
app.get('/lists', getAllLists);


//NOTE: ORDER OF DEFINITION MATTERS!! If callback is defined after endpoint then
// route definition does not know that it is a callback
// Endpoint for get individual lists
var getLists = function(req, res) {
  if (req.list) {
    // res.send(200, JSON.stringify(req.list));
    res.status(200).jsonp(req.list);
  }
  else {
    res.send(400, { message: "Unrecognized identifier: " + identifier });
  }
}
app.get('/lists/:listId', getLists);
//NOTE: we can also get params object from the request object in the callback
// but calling the param method allows us to do some filtering
app.param('listId', function(req, res, next, listId) {
  debug("listId found:", listId);
  var list = _.find(listData, function(it) { // this is _.find function is from lodash it returns the list objects that satisfy listId == it.id
    return listId == it.id;
  });
  debug("list:", list);
  req.list = list;
  next();
});


// add list
var insertList = function(req, res) {
  var list = req.body;
  debug("Received", list);
  list.id = listData.length + 1;
  listData.push(list);
  res.status(200).jsonp(list);
};

app.post('/lists', insertList);

// update list
var updateList = function(req, res) {
  if (req.list) {
    var originallist = req.list;
    var incominglist = req.body;
    var newlist = _.merge(originallist, incominglist);
    res.status(200).jsonp(newlist);
  } else {
    res.status(404).jsonp({ message: "Unrecognized list identifier" });
  }
}

// delete route
var deleteList = function(req, res) {
  if (req.list) {
    debug("Removing", req.list.listName, req.list.ingredients);
    _.remove(listData, function(it) {
      it.id === req.list.id;
    });
    debug("listData=", listData);
    var response = { message: "Deleted successfully" };
    res.status(200).jsonp(response);
  } else {
    var response = { message: "Unknown list identifier"};
    res.status(404).jsonp(response);
  }
}

app.delete('/lists/listId', deleteList);