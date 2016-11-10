var express = require('express');
var router = express.Router();

var _ = require('lodash');
var mongoose = require('mongoose');
var debug = require('debug')('lists');
var mongodb = require("mongodb");


/*======CONFIG MONGODB=======================================================*/

// Go get your configuration settings from .env
var config = require('./config.js');
debug("Mongo is available at ", config.mongoServer, ":", config.mongoPort);


// Connect to MongoDB and grab documents
var mongo = null;
var lists = null;
var mongoURL = config.mongoURL;
debug("Attempting connection to mongo @", mongoURL);
//NOTE: Be careful with async here! Concurrency problems can occur
mongodb.connect(mongoURL, function(err, db) {
  if (err) {
    debug("ERROR:", err);
  }
  else {
    debug("Connected correctly to server");
    mongo = db;
    mongo.collections(function(err, collections) {
      if (err) {
        debug("ERROR:", err);
      }
      else {
        for (var c in collections) {
          debug("Found collection", collections[c]);
        }
        lists = mongo.collection("lists");
      }
    });
  }
});



/*===============API ENDPOINTS===================*/

// INDEX
router.get('/', function(req, res, next) {
  res.send('INDEX PAGE');
});


/*------------MIDDLEWARE--------------*/

// MIDDLEWARE FOR ROUTES WITH DYNAMIC listID
//NOTE: we can also get params object from the request object in the callback
// but calling the param method allows us to do some filtering
app.param('listId', function(req, res, next, listId) {
  debug("listId found:", listId);
  if (mongodb.ObjectId.isValid(listId))
  {
    // Convert string version of listId into mongo type ObjectId
    lists.find({"_id": new mongodb.ObjectId(listId) })
      .toArray(function(err, docs) {
        if (err)
        {
          debug("ERROR: listId:", err);
          res.status(500).jsonp(err);
        }
        else if (docs.length < 1)
        {
          res.status(404).jsonp({ message: 'ID ' + listId + ' not found' });
        }
        else
        {
          debug("list:", docs[0]);
          req.list = docs[0];
          next();
        }
      });
  }
  else {
    res.status(404).jsonp({ message: 'ID ' + listId + ' not found'});
  }
});

/*------------MIDDLE WARE--------------*/

// MIDDLEWARE DEPENDENT FUNCTIONS

//NOTE: ORDER OF DEFINITION MATTERS!! If callback is defined after endpoint then
// route definition does not know that it is a callback
// Endpoint for get individual lists
var getList = function(req, res) {
  res.status(200).jsonp(req.person);
};
app.get('/lists/:listId', getList);

// update list
var updateList = function(req, res) {
  debug("Updating", req.list, "with", req.body);
  _.merge(req.list, req.body);
  lists.updateOne({"_id":req.list._id}, req.list, function(err, result) {
    if (err)
    {
      res.status(500).jsonp(err);
    }
    else
    {
      res.status(200).jsonp(result);
    }
  });
};

app.put('/lists/listId', updateList);

// delete route
var deleteList = function(req, res) {
  debug("Removing", req.list.listName, req.list.ingredients);
  lists.deleteOne({"_id": req.list._id}, function(err, result)
  {
    if (err)
    {
      debug("deleteList: ERROR:", err);
      res.status(500).jsonp(err);
    }
    else
    {
      res.list._id = undefined;
      res.status(200).jsonp(req.list);
    }
  });
};
app.delete('/lists/listId', deleteList);

// MIDDLEWARE DEPENDENT FUNCTIONS

// Set up endpoint to grab all lists
var getAllLists = function(req, res) {
  //NOTE: argument in find is a predicate document used to filter data
  // e.g. {'listName': 'Spice Night!' } would return all data collections
  // which satisfy the query criteria (aka with listName = Spice Night!)
  lists.find({}).toArray(function(err, results) {
    if (err)
    {
      debug("getAllLists--ERROR:", err);
      res.status(500).jsonp(err);
    }
    else
    {
      debug("getAllLists:", results);
      res.status(200).jsonp(results);
    }
  });
};
app.get('/lists', getAllLists);

// add list
var insertList = function(req, res) {
  var list = req.body;
  debug("Received", list);
  // MongoDB will create identifier field _id primary key

  //NOTE: insertList function will terminate BEFORE database insert completes!
  // DO NOT CALL res OUTSIDE OF CALLBACK TO MAKE SURE DB INSERT HAPPENS FIRST
  lists.insert(list, function(err, result) {
    if (err)
    {
      res.status(500).jsonp(err);
    }
    else
    {
      res.status(200).jsonp(list);
    }
    debug("INSIDE CALLBACK", list);
  });

  debug("OUTSIDE CALLBACK", list);
};
app.post('/lists', insertList);


module.exports = router;
