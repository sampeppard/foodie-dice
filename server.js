// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var debug = require('debug')('server');

// Authentication
var connectFlash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var index = require('./routes/index.js');
var listsAPI = require('./routes/lists.js');

//TODO: dry up config require
var config = require('./config.js');

var port = config.port || 3000;
debug("We picked up", port, "for the port");

var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder (Angular Entry Point)
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Define Basic Routes
app.use('/', index);
app.use('/api', listsAPI);


// Passport Authentication
// Middleware for passport
app.use(connectFlash());

app.use(passport.initialize());
// Establish callback to be used to validate password
//TODO: look into hashing
passport.use(new LocalStrategy(
    function(username, password, done) {
        debug("Authenticating ", username, ",", password);

        //TODO: verify that === orperator is safe for password check
        if ((username === config.username) && (password === config.password)) {
            var user = {
                username: "warren",
                firstName: "Warren",
                lastName: "Buffet",
                id: 1
            };
            return done(null, user);
        }
        else {
            return done(null, false, { message: "AUTHORIZATION DENIED" });
        }
    }
));

//TODO: check authentication on EVERY route

//TODO: Potentially better to hand back JSON representation of User object (without sensitive info!)
//NOTE: SENSITIVE DATA SHOULD NEVER LEAVE THE SERVER

app.post('/login',
    passport.authenticate('local', { session: false }),
    function(req, res) {
        debug("User ", req.user.firstName, " successfully authenticated");
        res.redirect('/');
    }
);


//NOTE: Watch out for concurrency issues between this server and mongodb
var server = app.listen(port, "127.0.0.1", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
