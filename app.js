var personData = [
  {
    "id": 1,
    "firstName": "Ted",
    "lastName": "Neward",
    "status": "MEANing"
  },
  {
    "id": 2,
    "firstName": "Brian",
    "lastName": "Randell",
    "status": "TFSing"
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
var getAllPersons = function(req, res) {
  var response = personData;
  // res.send(JSON.stringify(response));
  res.status(200).jsonp(response);
};
app.get('/persons', getAllPersons);


//NOTE: ORDER OF DEFINITION MATTERS!! If callback is defined after endpoint then
// route definition does not know that it is a callback
// Endpoint for get individual persons
var getPerson = function(req, res) {
  if (req.person) {
    // res.send(200, JSON.stringify(req.person));
    res.status(200).jsonp(req.person);
  }
  else {
    res.send(400, { message: "Unrecognized identifier: " + identifier });
  }
}
app.get('/persons/:personId', getPerson);
//NOTE: we can also get params object from the request object in the callback
// but calling the param method allows us to do some filtering
app.param('personId', function(req, res, next, personId) {
  debug("personId found:", personId);
  var person = _.find(personData, function(it) { // this is _.find function is from lodash it returns the Person objects that satisfy personId == it.id
    return personId == it.id;
  });
  debug("person:", person);
  req.person = person;
  next();
});


// add person
var insertPerson = function(req, res) {
  var person = req.body;
  debug("Received", person);
  person.id = personData.length + 1;
  personData.push(person);
  res.status(200).jsonp(person);
};

app.post('/persons', insertPerson);

// update person
var updatePerson = function(req, res) {
  if (req.person) {
    var originalPerson = req.person;
    var incomingPerson = req.body;
    var newPerson = _.merge(originalPerson, incomingPerson);
    res.status(200).jsonp(newPerson);
  } else {
    res.status(404).jsonp({ message: "Unrecognized person identifier" });
  }
}

// delete route
var deletePerson = function(req, res) {
  if (req.person) {
    debug("Removing", req.person.firstName, req.person.lastName);
    _.remove(personData, function(it) {
      it.id === req.person.id;
    });
    debug("personData=", personData);
    var response = { message: "Deleted successfully" };
    res.status(200).jsonp(response);
  } else {
    var response = { message: "Unknown person identifier"};
    res.status(404).jsonp(response);
  }
}

app.delete('/persons/personId', deletePerson);
