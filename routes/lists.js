var express = require('express');
var router = express.Router();

var _ = require('lodash');
var mongoose = require('mongoose');
var debug = require('debug')('server');
var Promise = require('bluebird');

var listSchema = require('../schema/list.schema.js');

/*======CONFIG MONGODB =======================================================*/

// Go get your configuration settings from .env
var config = require('../config.js');
debug("Mongo is available at", config.mongoServer, ":", config.mongoPort);

// Set Promises library for Mongoosejs
mongoose.Promise = Promise;
var mongooseOptions = {
    promiseLibrary: Promise
};

// Connect to MongoDB through Mongoose and grab documents

var List = null;
var mongoURI = config.mongoURI;
debug("Attempting connection to mongo @", mongoURI);


//TODO: Importing all data at once would never scale. Define query modifier as
// callback function with mongoose model objects (promise style syntax)
//NOTE: Be careful with async here! Concurrency problems can occur

var mongoConnection = mongoose.createConnection(mongoURI, mongooseOptions);

mongoConnection.on('error', function(err) {
    debug("ERROR:", err);
});

mongoConnection.once('open', function(){
    debug("Connected correctly to server");

    // Log all collections in db for sanity check
    mongoConnection.db.listCollections().toArray(function(err, collections) {
        if (err) {
            debug("ERROR:", err);
        }
        else {
            for (var c in collections) {
                debug("Found collection", collections[c]);
            }
        }
    });

    List = mongoConnection.model('List', listSchema);
});

/*===============API ENDPOINTS===================*/

// INDEX
router.get('/', function(req, res, next) {
    res.send('INDEX PAGE');
});


/*------------MIDDLEWARE--------------*/

// MIDDLEWARE FOR ROUTES WITH DYNAMIC listId
router.param('listId', function(req, res, next, listId) {
    debug("listId found:", listId);
    if (mongoose.Types.ObjectId.isValid(listId)) {
        List.findById(listId)
        .then(function(list) {
            debug("Found", list.listName);
            req.list = list;
            next();
        });
        // debug("Async Proof", req.list);
    }
    else {
        res.status(404).jsonp({ message: 'ID ' + listId + ' not found'});
    }
});

/*------------MIDDLEWARE-----------------------------------------------------*/

/*-----------MIDDLEWARE DEPENDENT FUNCTIONS----------------------------------*/

//NOTE: ORDER OF DEFINITION MATTERS!! If callback is defined after endpoint then
// route definition does not know that it is a callback
// Endpoint for get individual lists
var getList = function(req, res) {
    res.status(200).jsonp(req.list);
};
router.get('/lists/:listId', getList);

// update list
var updateList = function(req, res) {
    debug("Updating", req.list, "with", req.body);
    _.merge(req.list, req.body);
    req.list.save(function(err, list) {
        if (err) {
            res.status(500).jsonp(err);
        }
        else
        {
            res.status(200).jsonp(list);
        }
    });
};
router.put('/lists/:listId', updateList);

// delete route
var deleteList = function(req, res) {
    debug("Removing", req.list.listName, req.list.ingredients);
    req.list.remove(function(err, result) {
        if (err) {
            debug("deleteList: ERROR:", err);
            res.status(500).jsonp(err);
        }
        else
        {
            res.status(200).jsonp(req.list);
        }
    });
};
router.delete('/lists/:listId', deleteList);

/*-----------MIDDLEWARE DEPENDENT FUNCTIONS----------------------------------*/

// Set up endpoint to grab all lists
var getAllLists = function(req, res) {
    List.find(function(err, lists) {
        if (err) {
            debug("getAllLists--ERROR:", err);
            res.status(500).jsonp(err);
        }
        else {
            debug("getAllLists:", lists);
            res.status(200).jsonp(lists);
        }
    });
};
router.get('/lists', getAllLists);

// add list
var insertList = function(req, res) {
    var list = new List(req.body);
    debug("Received", list);
    // MongoDB will create identifier field _id primary key

    //NOTE: insertList function will terminate BEFORE database insert completes!
    // DO NOT CALL res OUTSIDE OF CALLBACK TO MAKE SURE DB INSERT HAPPENS FIRST
    list.save(function(err, list) {
        if (err) {
            res.status(500).jsonp(err);
        }
        else {
            res.status(200).jsonp(list);
        }
        debug("INSIDE CALLBACK", list);
    });
    // debug("OUTSIDE CALLBACK", list);
};
router.post('/lists', insertList);

module.exports = router;
