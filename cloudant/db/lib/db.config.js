var config = require("./../../api/config");
var logger = require("./../../api/logger").logger;
var profile = require('../profile')(logger, config.db.options);
var domain = require("domain");
var d = domain.create();
var dbs = ["music", "users"];
var db = {};

function initDb(dbName) {
  var dbConfig = {};
  if (config.db.options && config.db.options.logging) {
    dbConfig.log = function (id, args) {
      logger.info({
        dbId: id, dbArgs: args
      }, "database debug logging");
    };
  }

  dbConfig.requestDefaults = {};

  dbConfig.db = config.db[dbName][1];
  dbConfig.url = config.db[dbName][0];
  dbConfig.requestDefaults = {
    auth: {
      'user': config.db.credentials.username,
      'pass': config.db.credentials.password
    }
  };

  if (config.httpclient && config.httpclient.proxy) {
    dbConfig.requestDefaults.proxy = config.httpclient.proxy;
  }

  if (config.db.options && config.db.options.connections) {
    dbConfig.requestDefaults.pool = {
      maxSockets: config.db.options.connections
    };
  }

  var nano = require("nano")(dbConfig);
  var nanoDb = nano.use(dbConfig.db);

  if (config.db.options && config.db.options.profiling) {
    ['view', 'search', 'get', 'insert'].forEach(function (fnName) {
      profile(nanoDb, fnName, dbConfig.db);
    });
  }

  db[dbName] = {
    nano: nano,
    db: nanoDb,
    auth: dbConfig.requestDefaults.auth
  };
}

dbs.forEach(function (dbName) {
  initDb(dbName);
});


d.on("error", function (err) {
  logger.error({
    err: err
  }, "unexpected database error");
});

module.exports = {
  db: db,
  d: d,
  initDb: initDb
};