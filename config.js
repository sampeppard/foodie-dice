// config.js: Configuration determination
//

// Config process.env
var envVars = require('./.env');
var envVarsKeys = Object.keys(envVars);

for (var varIndex = 0; varIndex < envVarsKeys.length; varIndex++) {
  process.env[envVarsKeys[varIndex]] = envVars[envVarsKeys[varIndex]];
}

var debug = require('debug')('config');
debug("Configuring environment...");
// Use these as the default
module.exports = {
  mongoServer : "localhost",
  mongoPort : "27017"
};
if (process.env["ENV"] === "prod") {
    module.exports.mongoServer = "sp:murica123@ds043942.mlab.com";
  // module.exports.mongoServer = process.env["dbURI"];
    module.exports.mongoPort = "43942";
}
