var config = require("./../../api/config");
var dbConfig = require("./db.config");
var db = dbConfig.db;
var d = dbConfig.d;
var logger = require("./../../api/logger").logger;

function request(dbname, design, view, query, cb) {
  //console.log("db name: ", dbname);
  //console.log("design: ",design);
  //console.log("view: ",view);
  //console.log("query len: ",query.queries.length);
  //console.log("query : ",query);
  db[dbname].nano.request({
    db: db[dbname].nano.config.db ,
    method: 'POST' ,
    path: '_design/' + design + '/_view/' + view + '?reduce=false' ,
    body: query
  }, cb);
}

function requestByKey(dbname, design, query, cb) {
  db[dbname].nano.request({
    db: db[dbname].nano.config.db ,
    method: 'POST' ,
    path: '_all_docs/?reduce=false&include_docs=true' ,
    body: query
  }, cb);
}


function getDoc(dbname, id, cb) {
  db[dbname].db.get(id, cb);
}

function getEntriesRange(dbname, design, view, key, limit, inc_docs, wildcard, descending, cb) {
  d.run(function() {
    var params = {
      startkey: [(wildcard ? key + "\ufff0" : key), []],
      endkey: [key],
      descending: descending,
      reduce: false,
      limit: limit
    };
    if(descending === false) {
      params.endkey = params.startkey;
      params.startkey = [key];
    }
    if (config.db.options.stale) {
      params.stale = "ok";
    }
    if(inc_docs) {
      params.include_docs = true;
    }

    db[dbname].db.view(design, view, params, function(err, body) {
      if (err) {
        logger.error({
          err: err
        });
      }
      if(limit === 1 && inc_docs) {
        cb(err, (body && body.rows && body.rows[0] && body.rows[0].doc && body.rows[0].doc.deleted !== true) ? body.rows[0].doc : null);
      }else{
        cb(err, body);
      }
    });
  });
}

function getEntry(dbname, design, view, key, cb) {
  d.run(function() {
    var params = {
      key: key,
      descending: "true",
      include_docs: "true",
      reduce: "false",
      limit: 1
    };
    if (config.db.options.stale) {
      params.stale = "ok";
    }
    db[dbname].db.view(design, view, params, function(err, body) {
      if (err) {
        logger.error({
          err: err
        });
      }

      cb(err, (body && body.rows && body.rows[0] && body.rows[0].doc && body.rows[0].doc.deleted !== true) ? body.rows[0].doc : null);
    });
  });
}

function getEntryRange(dbname, design, view, key, descending, cb) {
  getEntriesRange(dbname, design, view, key, 1, true, false, descending, cb);
}

function getEntries(dbname, design, view, keys, cb) {
  d.run(function() {
    var params = {
      keys: keys,
      include_docs: true,
      reduce: false
    };
    if (config.db.options.stale) {
      params.stale = "ok";
    }
    db[dbname].db.view(design, view, params, function(err, body) {
      if (err) {
        logger.error({
          err: err
        });
      }

      cb(err, body);
    });
  });
}


function bulkGet(dbname, design, view, keys, getAll, include_docs,  cb) {
  var queries = [];

  for (var i = 0; i < keys.length; i++) {
    var e = {
      include_docs: include_docs
    };
    if (config.db.options.stale) {
      e.stale = 'ok';
    }

    if (getAll) {
      e.startkey = [keys[i]];
      e.endkey = [keys[i], []];
    } else {
      e.limit = 1;
      e.descending = true;
      e.startkey = [keys[i], []];
      e.endkey = [keys[i]];
    }

    queries.push(e);
  }

  var query = {
    queries: queries
  };


  request(dbname, design, view, query, function(err, body) {
    cb(err, body);
  });
}

function bulkGetByKeys (dbname, design, keys, getAll, include_docs, cb) {
// keys is an array of document ids

  requestByKey (dbname, design, {"keys": keys}, function(err, body) {
    var docarray = [];

    if (body && body.rows) {
      docarray = body.rows.map (function (row) {
        return row.doc;
      });
    }

    cb(err, docarray);
  });
}



function insert(dbname, doc, cb) {
  db[dbname].db.insert(doc, function(err, body) {
    if (err) {
      logger.error({
        err: err
      });
    }

    if (cb) {
      cb(err, body);
    }
  });
}

module.exports.getEntries = getEntries;
module.exports.getEntriesRange = getEntriesRange;
module.exports.getEntry = getEntry;
module.exports.getEntryRange = getEntryRange;
module.exports.bulkGet = bulkGet;
module.exports.bulkGetByKeys = bulkGetByKeys;
module.exports.getDoc = getDoc;
module.exports.insert = insert;