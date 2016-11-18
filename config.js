// config.js: Configuration determination
//
var debug = require('debug')('config');

// Config process.env
var envVars = require('./.env');
var envVarsKeys = Object.keys(envVars);

for (var varIndex = 0; varIndex < envVarsKeys.length; varIndex++) {
  process.env[envVarsKeys[varIndex]] = envVars[envVarsKeys[varIndex]];
}

// Mongo config
debug("Configuring environment...");
// Use these as the default
module.exports = {
  mongoServer : "localhost",
  mongoPort : "27017"
};


if (process.env["ENV"] === "prod") {

    module.exports.port = process.env["PORT"];

    module.exports.mongoURI = "mongodb://" + process.env["userName"] + ":" + process.env["password"] + "@" + process.env["dbHost"] + ":" + process.env["dbPort"] + "/" + process.env["dbName"];
}

// Passport Config
module.exports.password = process.env["testPassword"];
module.exports.username = process.env["testUsername"];
