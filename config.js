// config.js: Configuration determination
//

// Config process.env
var envVars = require('./.env');
var envVarsKeys = Object.keys(envVars);

for (var varIndex = 0; varIndex < envVarsKeys.length; varIndex++) {
  process.env[envVarsKeys[varIndex]] = envVars[envVarsKeys[varIndex]];
}

// Mongo config
var debug = require('debug')('config');
debug("Configuring environment...");
// Use these as the default
module.exports = {
  mongoServer : "localhost",
  mongoPort : "27017"
};

if (process.env["ENV"] === "prod") {
    module.exports.mongoURI = "mongodb://" + process.env["userName"] + ":" + process.env["password"] + "@" + process.env["dbHost"] + ":" + process.env["dbPort"] + "/" + process.env["dbName"];
}
